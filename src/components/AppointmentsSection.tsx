/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Check, X, Clock, Video, MapPin, User, ChevronRight, 
  Plus, AlertCircle, RefreshCw, FileText, ArrowLeft, Pill, Shield 
} from 'lucide-react';
import { UserProfile } from '../types';

interface Clinician {
  id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  location: string;
  availability: string[];
  avatarUrl: string;
}

interface Appointment {
  id: string;
  patientEmail: string;
  patientName: string;
  clinicianId: string;
  clinicianName: string;
  datetime: string;
  type: 'virtual' | 'in_person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

interface Prescription {
  id: string;
  patientEmail: string;
  patientName: string;
  clinicianId: string;
  clinicianName: string;
  medicationName: string;
  dosage: string;
  indications: string;
  status: 'active' | 'completed' | 'paused';
  prescribedAt: string;
}

interface AppointmentsSectionProps {
  profile: UserProfile;
  onBack: () => void;
}

export default function AppointmentsSection({ profile, onBack }: AppointmentsSectionProps) {
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states for booking
  const [selectedClinician, setSelectedClinician] = useState<Clinician | null>(null);
  const [showBookForm, setShowBookForm] = useState<boolean>(false);
  const [datetime, setDatetime] = useState<string>('');
  const [type, setType] = useState<'virtual' | 'in_person'>('virtual');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form states for reschedule
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [newDatetime, setNewDatetime] = useState<string>('');

  const fetchConsultationsData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch Clinicians
      const cRes = await fetch('/api/appointments/appointments/clinicians');
      let cliniciansList: Clinician[] = [];
      if (cRes.ok) {
        cliniciansList = await cRes.json();
        setClinicians(cliniciansList);
      } else {
        throw new Error("Failed to load clinical experts.");
      }

      // 2. Fetch My Appointments
      const aRes = await fetch(`/api/appointments/appointments/me?email=${encodeURIComponent(profile.email)}`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setAppointments(aData);
      }

      // 3. Fetch My Prescriptions
      const pRes = await fetch(`/api/clinicians/clinicians/me/prescriptions?patient_email=${encodeURIComponent(profile.email)}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setPrescriptions(pData);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred synchronizing consultation databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultationsData();
  }, [profile.email]);

  const triggerFeedback = (type: 'success' | 'error', message: string) => {
    if (type === 'success') {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(null), 6000);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClinician || !datetime) {
      triggerFeedback('error', 'Select a medical clinician and appointment schedule.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/appointments/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicianId: selectedClinician.id,
          datetime,
          type,
          notes,
          patientEmail: profile.email,
          patientName: profile.fullName
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          triggerFeedback('success', `Appointment successfully filed with ${selectedClinician.name}!`);
          setShowBookForm(false);
          setSelectedClinician(null);
          setDatetime('');
          setNotes('');
          fetchConsultationsData();
        }
      } else {
        triggerFeedback('error', 'Failed to register the requested consultation.');
      }
    } catch (err) {
      triggerFeedback('error', 'Connection failure. Please verify active telemetry endpoints.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (!window.confirm("Are you sure you want to cancel this scheduled consultation?")) return;
    try {
      const res = await fetch(`/api/appointments/appointments/me/${apptId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        triggerFeedback('success', 'Consultation cancelled successfully.');
        fetchConsultationsData();
      } else {
        triggerFeedback('error', 'Unable to cancel appointment at this time.');
      }
    } catch (err) {
      triggerFeedback('error', 'Unable to process cancellation.');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment || !newDatetime) return;

    try {
      const res = await fetch(`/api/appointments/appointments/me/${reschedulingAppointment.id}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datetime: newDatetime })
      });

      if (res.ok) {
        triggerFeedback('success', `Appointment rescheduled to ${new Date(newDatetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}.`);
        setReschedulingAppointment(null);
        setNewDatetime('');
        fetchConsultationsData();
      } else {
        triggerFeedback('error', 'Rescheduling failed.');
      }
    } catch (err) {
      triggerFeedback('error', 'Failed to update schedule.');
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Confirmed</span>;
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">Completed</span>;
      case 'cancelled':
        return <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-bold text-zinc-500 border border-zinc-200">Cancelled</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200 animate-pulse">Pending Triage</span>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Title Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-6 text-left leading-none gap-4">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center space-x-1 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-smooth mb-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-smooth" />
            <span>Back to Health Portal</span>
          </button>
          <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm leading-none">
            Active Clinical Consultations
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2.5">
            Clinical Care & Appointments
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1 font-semibold leading-normal">
            Schedule personalized cardiac check-ups, review prescriptions, and consult with leading cardiologists.
          </p>
        </div>

        <button 
          onClick={() => {
            if (clinicians.length > 0) {
              setSelectedClinician(clinicians[0]);
              setShowBookForm(true);
            }
          }}
          className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 text-xs transition-smooth shadow-md shadow-emerald-500/10 active:scale-95 cursor-pointer self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Book Consultation</span>
        </button>
      </div>

      {/* Response feedback notifications */}
      {(errorMsg || successMsg) && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-1.5 duration-200">
          {errorMsg && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-rose-200 bg-rose-50/50 p-4 text-xs font-semibold text-rose-800">
              <AlertCircle className="h-4.5 w-4.5 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center space-x-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs font-semibold text-emerald-800">
              <Check className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-10 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
          <p className="text-xs text-zinc-500 mt-3 font-semibold">Synchronizing with Clinical Calendars...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* LEFT: Appointments list and prescriptions list */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Appointments Section */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4.5 w-4.5 text-emerald-600" />
                  <h2 className="font-display font-bold text-zinc-800 text-sm sm:text-base">Your Consultations Schedule</h2>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">{appointments.length} RECORDED</span>
              </div>

              {appointments.length === 0 ? (
                <div className="py-8 text-center text-zinc-400 font-sans">
                  <Calendar className="h-10 w-10 text-zinc-250 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-zinc-700">No scheduled appointments</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Click "Book Consultation" to speak with an AI care partner.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                  {appointments.map((appt) => (
                    <div 
                      key={appt.id} 
                      className="border border-zinc-200 rounded-xl bg-zinc-50/20 p-4 hover:border-zinc-300 transition-smooth flex flex-col sm:flex-row justify-between sm:items-start gap-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                              {appt.clinicianName}
                            </h4>
                            <p className="text-[10px] text-zinc-400 font-medium">
                              Cardiology Specialist Consult
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-zinc-500 font-semibold font-sans pt-1">
                          <span className="flex items-center space-x-1.5">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{new Date(appt.datetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </span>
                          <span className="flex items-center space-x-1.5 capitalize">
                            {appt.type === 'virtual' ? (
                              <>
                                <Video className="h-3.5 w-3.5 text-emerald-500" />
                                <span>VidyoLink Live</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                <span>In Person / Clinical Desk</span>
                              </>
                            )}
                          </span>
                        </div>

                        {appt.notes && (
                          <div className="text-[11.5px] leading-relaxed text-zinc-550 italic bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg">
                            "{appt.notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 pt-1 sm:pt-0">
                        {getStatusBadge(appt.status)}

                        {appt.status === 'pending' && (
                          <div className="flex space-x-2 sm:mt-1">
                            <button
                              onClick={() => {
                                setReschedulingAppointment(appt);
                                setNewDatetime(appt.datetime.slice(0, 16));
                              }}
                              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-2 py-1 rounded transition-smooth border border-emerald-100 cursor-pointer"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelAppointment(appt.id)}
                              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/60 px-2 py-1 rounded transition-smooth border border-rose-100 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescriptions Section */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Pill className="h-4.5 w-4.5 text-rose-500" />
                  <h2 className="font-display font-bold text-zinc-800 text-sm sm:text-base">Your Active Prescriptions</h2>
                </div>
                <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-wider">{prescriptions.length} LOGGED</span>
              </div>

              {prescriptions.length === 0 ? (
                <div className="py-6 text-center text-zinc-400 font-sans">
                  <Pill className="h-8 w-8 text-zinc-250 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-zinc-700">No active medication prescriptions</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Your consulting physician will input prescribed drugs here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.map((rx) => (
                    <div 
                      key={rx.id} 
                      className="border border-zinc-150 rounded-xl bg-zinc-50/30 p-4 text-left flex flex-col justify-between hover:border-zinc-250 transition-smooth"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold uppercase text-emerald-700 border border-emerald-100 font-mono leading-none tracking-wider">
                            Active Rx
                          </span>
                          <span className="text-[9px] font-bold text-zinc-400 font-mono">
                            {new Date(rx.prescribedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-zinc-900 leading-tight">
                          {rx.medicationName}
                        </h4>
                        <p className="text-xs text-zinc-550 font-semibold mt-1 font-sans">
                          Dosage: <strong className="text-zinc-850 font-bold">{rx.dosage}</strong>
                        </p>
                        {rx.indications && (
                          <div className="mt-2 text-[10.5px] leading-relaxed text-zinc-500 bg-zinc-100/50 p-2 rounded border border-zinc-150">
                            <span className="font-bold text-zinc-700 block mb-0.5 text-[10px] uppercase font-mono tracking-wider">Clinical Guidance:</span>
                            {rx.indications}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-zinc-150 text-[10px] text-zinc-400 font-semibold flex items-center justify-between">
                        <span>Authorized By:</span>
                        <span className="text-zinc-700 font-bold">{rx.clinicianName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Browse Cardiologists / General Practitioners */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center space-x-2 mb-4 border-b border-zinc-100 pb-3">
                <Shield className="h-4.5 w-4.5 text-emerald-600" />
                <h3 className="font-display font-extrabold text-zinc-805 text-sm sm:text-base">Cardiopulmonary Specialist Panel</h3>
              </div>

              <div className="space-y-5">
                {clinicians.map((clinician) => (
                  <div 
                    key={clinician.id}
                    className="border border-zinc-150 rounded-2xl bg-white p-4 text-left hover:border-emerald-300 transition-smooth shadow-xs relative overflow-hidden"
                  >
                    <div className="flex items-start space-x-3.5">
                      <img 
                        src={clinician.avatarUrl} 
                        alt={clinician.name}
                        referrerPolicy="no-referrer"
                        className="h-12 w-12 rounded-full border border-zinc-200 object-cover flex-shrink-0 bg-zinc-50"
                      />
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                          {clinician.name}
                        </h4>
                        <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold inline-block font-mono leading-none">
                          {clinician.specialty}
                        </p>
                        <p className="text-[11px] leading-relaxed text-zinc-500 font-semibold pt-1 font-sans">
                          {clinician.bio}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-zinc-150 flex flex-col gap-2 bg-zinc-50/50 p-2 rounded-xl">
                      <div className="flex items-center space-x-2 text-[10.5px] text-zinc-500 font-semibold font-sans">
                        <MapPin className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
                        <span className="truncate">{clinician.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10.5px] text-zinc-500 font-semibold font-sans">
                        <Clock className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-zinc-700 font-bold">Available: {clinician.availability[0]}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedClinician(clinician);
                        setShowBookForm(true);
                        setDatetime('');
                        setNotes('');
                      }}
                      className="mt-3 w-full flex items-center justify-center space-x-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-750 font-bold rounded-xl text-xs transition-smooth cursor-pointer border border-emerald-100"
                    >
                      <span>Book Consultation Session</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Booking Form Overlay Modal */}
      {showBookForm && selectedClinician && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => { setShowBookForm(false); setSelectedClinician(null); }}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-smooth cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Schedule Consultation Slot
            </span>

            <h3 className="font-display font-black text-lg text-zinc-900 mt-2.5 leading-none">
              Consult with {selectedClinician.name}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-semibold font-sans">
              Formulate your cardiac telehealth session below.
            </p>

            <form onSubmit={handleBookSubmit} className="space-y-4 pt-4 leading-none text-xs">
              <div className="space-y-1.5 text-left">
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Select Consultation Type</label>
                <div className="grid grid-cols-2 gap-3 pb-1.5">
                  <button
                    type="button"
                    onClick={() => setType('virtual')}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-bold transition-smooth cursor-pointer ${
                      type === 'virtual' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50'
                    }`}
                  >
                    <Video className="h-4 w-4" />
                    <span>VidyoLink Virtual</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('in_person')}
                    className={`flex items-center justify-center space-x-2 py-3 rounded-xl border font-bold transition-smooth cursor-pointer ${
                      type === 'in_person' 
                        ? 'border-rose-500 bg-rose-50 text-rose-700' 
                        : 'border-zinc-200 bg-white text-zinc-650 hover:bg-zinc-50'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Clinical Visit</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Appointment Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px]">Personal Clinical Notes / Symptoms</label>
                <textarea 
                  placeholder="E.g. seeking guidance on lipid parameters, review active Lisinopril therapeutics, or check chronic microvascular heart conditions..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-sans"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowBookForm(false); setSelectedClinician(null); }}
                  className="flex-1 py-3 border border-zinc-250 rounded-xl font-bold bg-white hover:bg-zinc-50 text-zinc-700 cursor-pointer text-center text-xs transition-smooth"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer text-center text-xs transition-smooth shadow-sm hover:shadow-emerald-500/5"
                >
                  {isSubmitting ? 'Verifying Calendar...' : 'Confirm Booking Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Confirmation Overlay Modal */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 text-left shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative col-span-1">
            <button 
              onClick={() => setReschedulingAppointment(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-800 transition-smooth cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Update Schedule Time
            </span>

            <h3 className="font-display font-bold text-base text-zinc-900 mt-2.5 leading-tight">
              Reschedule Appointment
            </h3>
            <p className="text-[11px] text-zinc-450 font-semibold mt-1 font-sans pb-3 border-b border-zinc-100 leading-normal">
              Select your replacement Consultation availability Slot with Dr. Sara Patel.
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4 pt-3 text-xs leading-none">
              <div className="space-y-1.5 text-left">
                <label className="block font-bold text-zinc-500 uppercase tracking-wider text-[10px]">New Time Slot</label>
                <input 
                  type="datetime-local"
                  required
                  value={newDatetime}
                  onChange={(e) => setNewDatetime(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="flex-1 py-2.5 border border-zinc-200 rounded-xl font-bold bg-white text-zinc-700 hover:bg-zinc-50 cursor-pointer text-xs transition-smooth"
                >
                  Keep Original
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer text-xs transition-smooth"
                >
                  Save Schedule Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
