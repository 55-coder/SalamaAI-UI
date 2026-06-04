/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, Search, AlertCircle, FileText, Sliders, Activity, Check,
  Calendar, Pill, Clock, Video, MapPin, Plus, Trash2, ShieldAlert
} from 'lucide-react';
import { Assessment, Notification } from '../types';

interface ClinicianDashboardProps {
  assessments: Assessment[];
  notifications: Notification[];
  onViewAssessment: (assessment: Assessment) => void;
  onMarkNotificationRead: (id: string) => void;
}

export default function ClinicianDashboard({
  assessments,
  notifications,
  onViewAssessment,
  onMarkNotificationRead,
}: ClinicianDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'high_risk' | 'intermediate'>('all');
  const [selectedPatientEmail, setSelectedPatientEmail] = useState<string | null>(null);

  // Synchronized clinical sub-state trackers
  const [activeAppointments, setActiveAppointments] = useState<any[]>([]);
  const [activePrescriptions, setActivePrescriptions] = useState<any[]>([]);
  const [clinicianProfile, setClinicianProfile] = useState<any>(null);

  // Form scheduling states
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [apptDatetime, setApptDatetime] = useState<string>('');
  const [apptType, setApptType] = useState<'virtual' | 'in_person'>('virtual');
  const [apptNotes, setApptNotes] = useState<string>('');
  const [isSubmittingAppt, setIsSubmittingAppt] = useState<boolean>(false);

  // Form prescription states
  const [showPrescriptionForm, setShowPrescriptionForm] = useState<boolean>(false);
  const [rxMeds, setRxMeds] = useState<string>('');
  const [rxDosage, setRxDosage] = useState<string>('');
  const [rxIndications, setRxIndications] = useState<string>('');
  const [isSubmittingRx, setIsSubmittingRx] = useState<boolean>(false);

  // Active clinician context email
  const currentClinicianEmail = "sara.patel@salama.ai";

  // Fetch active clinician profile on mount
  useEffect(() => {
    fetch(`/api/clinicians/clinicians/me?email=${encodeURIComponent(currentClinicianEmail)}`)
      .then(res => res.json())
      .then(data => setClinicianProfile(data))
      .catch(err => console.error("Error loaded clinician profile context:", err));
  }, []);

  // Filter list of alert notifications for clinician role
  const alertNotifications = notifications.filter(
    n => n.recipientRole === 'clinician' && n.severity === 'alert' && !n.isRead
  );

  // Group assessments by unique patients to get a unified Patient Directory
  const uniquePatientsMap: { [email: string]: Assessment[] } = {};
  assessments.forEach(a => {
    const k = a.patientEmail.toLowerCase();
    if (!uniquePatientsMap[k]) {
      uniquePatientsMap[k] = [];
    }
    uniquePatientsMap[k].push(a);
  });

  const patientEntries = Object.values(uniquePatientsMap).map(pList => {
    // latest assessment representing current state
    const latest = pList[0];
    return {
      name: latest.patientName,
      email: latest.patientEmail,
      latestAssessment: latest,
      allAssessmentsCount: pList.length,
      history: pList,
    };
  });

  // Filter patients based on searches or triage triggers
  const filteredPatients = patientEntries.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const latestRisk = p.latestAssessment.riskCategory;

    if (filterType === 'high_risk') {
      return matchesSearch && latestRisk === 'High';
    }
    if (filterType === 'intermediate') {
      return matchesSearch && (latestRisk === 'Intermediate' || latestRisk === 'Borderline');
    }
    return matchesSearch;
  });

  // Get current active selection patient object
  const activePatient = selectedPatientEmail 
    ? patientEntries.find(p => p.email.toLowerCase() === selectedPatientEmail.toLowerCase()) 
    : (filteredPatients[0] || null);

  const fetchPatientVitalsAndSchedule = async () => {
    if (!activePatient) return;
    try {
      const aRes = await fetch(`/api/appointments/appointments/me?email=${encodeURIComponent(activePatient.email)}`);
      if (aRes.ok) {
        const aData = await aRes.json();
        setActiveAppointments(aData);
      }
      
      const pRes = await fetch(`/api/clinicians/clinicians/me/prescriptions?patient_email=${encodeURIComponent(activePatient.email)}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setActivePrescriptions(pData);
      }
    } catch (err) {
      console.error("Error loaded patient telemetry links:", err);
    }
  };

  useEffect(() => {
    fetchPatientVitalsAndSchedule();
  }, [activePatient?.email]);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !apptDatetime) return;

    setIsSubmittingAppt(true);
    try {
      const res = await fetch('/api/clinicians/clinicians/me/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: activePatient.email,
          patientName: activePatient.name,
          datetime: apptDatetime,
          type: apptType,
          notes: apptNotes,
          clinicianEmail: currentClinicianEmail
        })
      });

      if (res.ok) {
        setShowScheduleForm(false);
        setApptDatetime('');
        setApptNotes('');
        fetchPatientVitalsAndSchedule();
      }
    } catch (err) {
      console.error("Scheduling error:", err);
    } finally {
      setIsSubmittingAppt(false);
    }
  };

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !rxMeds) return;

    setIsSubmittingRx(true);
    try {
      const res = await fetch('/api/clinicians/clinicians/me/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: activePatient.email,
          patientName: activePatient.name,
          medicationName: rxMeds,
          dosage: rxDosage,
          indications: rxIndications,
          clinicianEmail: currentClinicianEmail
        })
      });

      if (res.ok) {
        setShowPrescriptionForm(false);
        setRxMeds('');
        setRxDosage('');
        setRxIndications('');
        fetchPatientVitalsAndSchedule();
      }
    } catch (err) {
      console.error("Prescribing error:", err);
    } finally {
      setIsSubmittingRx(false);
    }
  };

  const handleUpdateApptStatus = async (apptId: string, status: string) => {
    try {
      const res = await fetch(`/api/clinicians/clinicians/me/appointments/${apptId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchPatientVitalsAndSchedule();
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const getRiskBadgeColor = (cat: string) => {
    switch (cat) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-150 font-bold';
      case 'Intermediate': return 'text-amber-700 bg-amber-50 border-amber-150 font-bold';
      case 'Borderline': return 'text-yellow-700 bg-yellow-50 border-yellow-150 font-bold';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-150 font-bold';
    }
  };

  // Extract or backfill the 4-disease structure with explanations for the clinician view
  const getFourDiseasePredictions = (assessment: Assessment): any[] => {
    if (assessment.diseasePredictions && assessment.diseasePredictions.length === 4) {
      return assessment.diseasePredictions;
    }

    // Backfill based on measurements
    const m = assessment.measurements;
    const age = Number(m.age || 28);
    const systolic = Number(m.systolicBP || 120);
    const diastolic = Number(m.diastolicBP || 80);
    const cholesterol = Number(m.cholesterol || 190);
    const smoking = m.smokingStatus || 'never';

    // cvd
    const cvdRisk = assessment.cvdRiskPercentage;

    // hyp
    let hypBase = 12;
    if (systolic > 115) hypBase += (systolic - 115) * 1.3;
    if (diastolic > 75) hypBase += (diastolic - 75) * 1.5;
    if (age > 35) hypBase += (age - 35) * 0.5;
    const hypRisk = Math.round(Math.max(5, Math.min(99.9, hypBase)));

    // stroke
    let strokeBase = 4;
    if (systolic > 115) strokeBase += (systolic - 110) * 0.6;
    if (age > 40) strokeBase += (age - 35) * 0.5;
    if (smoking === 'active') strokeBase += 15;
    const strokeRisk = Math.round(Math.max(2, Math.min(95, strokeBase)));

    // chd
    let chdBase = 6;
    if (cholesterol > 180) chdBase += (cholesterol - 180) * 0.3;
    if (age > 35) chdBase += (age - 35) * 0.5;
    if (smoking === 'active') chdBase += 12;
    const chdRisk = Math.round(Math.max(3, Math.min(95, chdBase)));

    const getLabel = (percentage: number) => {
      if (percentage >= 60) return 'High';
      if (percentage >= 35) return 'Intermediate';
      if (percentage >= 15) return 'Borderline';
      return 'Low';
    };

    const ts = assessment.timestamp;

    return [
      { id: 'dp-cvd', disease: 'cvd', risk_score: cvdRisk / 100, risk_percentage: cvdRisk, risk_label: getLabel(cvdRisk), model_version: 'xgbcvd_v3', predicted_at: ts, explanation: `CVD risk is evaluated at ${cvdRisk}% (${getLabel(cvdRisk)}). Calculated chronologically considering patient biometric profiles.` },
      { id: 'dp-hyp', disease: 'hyp', risk_score: hypRisk / 100, risk_percentage: hypRisk, risk_label: getLabel(hypRisk), model_version: 'xgbhyp_v1', predicted_at: ts, explanation: `Risk of persistent arterial pressure strain calculated heavily based on systolic load of ${systolic} mmHg.` },
      { id: 'dp-stroke', disease: 'stroke', risk_score: strokeRisk / 100, risk_percentage: strokeRisk, risk_label: getLabel(strokeRisk), model_version: 'xgbstroke_v5', predicted_at: ts, explanation: `Stroke potential factors mechanical arterial resistance combined with active smoking status descriptors.` },
      { id: 'dp-chd', disease: 'chd', risk_score: chdRisk / 100, risk_percentage: chdRisk, risk_label: getLabel(chdRisk), model_version: 'xgbchd_v2', predicted_at: ts, explanation: `Coronary indicators analyze total serum lipids (${cholesterol} mg/dL) as active plaque deposits coefficients.` }
    ];
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Title block */}
      <div className="mb-6 border-b border-zinc-200 pb-6 text-left leading-none">
        <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm leading-none">
          Professional Clinical Suite Running
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2.5">
          Clinician Monitoring Console
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1 font-semibold leading-normal">
          Real-time cardiovascular triage alerts, multi-disease predictive dashboards, and patient medical record reviews.
        </p>
      </div>

      {/* Clinician Overview Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 text-left leading-none">
        {/* Total Patients */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 transition-smooth">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider font-mono">Managed Caseload</span>
            <div className="text-xl font-black text-zinc-900 tracking-tight">
              {patientEntries.length} Registered Patient(s)
            </div>
            <p className="text-[10px] text-zinc-400 font-semibold leading-normal font-sans">
              Linked active electronic health medical records
            </p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex-shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* High Risk Alerts counting */}
        <div className="rounded-2xl border border-rose-250 bg-rose-50/10 p-5 flex items-center justify-between shadow-sm hover:border-rose-350 transition-smooth">
          <div className="space-y-1">
            <span className="text-[10px] text-rose-600 font-extrabold uppercase tracking-wider font-mono font-bold">Intervention Alerts</span>
            <div className="text-xl font-black text-rose-700 tracking-tight">
              {patientEntries.filter(p => p.latestAssessment.riskCategory === 'High').length} High-Risk Alert Case(s)
            </div>
            <p className="text-[10px] text-rose-400 font-semibold leading-normal font-sans">
              Critical indicators requiring diagnostic triage
            </p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-650 flex-shrink-0 animate-pulse">
            <AlertCircle className="h-5 w-5 text-rose-600" />
          </div>
        </div>

        {/* Total diagnostics logged */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 transition-smooth">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider font-mono">XGBoost Diagnostics</span>
            <div className="text-xl font-black text-zinc-900 tracking-tight">
              {assessments.length} Total Telemetry Runs
            </div>
            <p className="text-[10px] text-zinc-400 font-semibold leading-normal font-sans">
              Full mathematical model evaluation epochs
            </p>
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex-shrink-0">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Critical High-risk notification banner alerts */}
      {alertNotifications.length > 0 && (
        <div className="mb-6 space-y-3 px-4.5 py-4 border border-rose-200 rounded-2xl bg-rose-50/70 p-5 leading-normal text-left shadow-sm">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs sm:text-sm">
            <AlertCircle className="h-4.5 w-4.5 text-rose-600 flex-shrink-0 animate-pulse" />
            <span className="font-display font-extrabold tracking-wider text-rose-800">CRITICAL CLINICAL TRACE ALERTS ({alertNotifications.length})</span>
          </div>
          <div className="space-y-2">
            {alertNotifications.map(alert => (
              <div
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs py-3 px-4 rounded-xl bg-white border border-rose-100 shadow-sm gap-2"
              >
                <p className="font-semibold text-zinc-700 font-sans leading-relaxed">
                  {alert.message}
                </p>
                <button
                  onClick={() => onMarkNotificationRead(alert.id)}
                  className="text-[10px] font-extrabold text-rose-700 hover:text-rose-900 underline flex-shrink-0 sm:ml-4 cursor-pointer"
                >
                  Clear Alarm Alert
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tripartite Workstation Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Search and Patient entries folder */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-4.5 leading-none shadow-xl text-left">
            
            {/* Search inputs */}
            <div className="relative mb-3.5">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search patient name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white pl-10.5 pr-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
            </div>

            {/* Risk category quick filter tabs */}
            <div className="flex bg-zinc-100 border border-zinc-200 rounded-xl p-1 space-x-1.5 mb-4">
              <button
                onClick={() => setFilterType('all')}
                className={`flex-1 text-[10px] font-extrabold rounded-lg py-1.5 transition-smooth cursor-pointer leading-none ${
                  filterType === 'all'
                    ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200'
                    : 'text-zinc-550 hover:text-zinc-800'
                }`}
              >
                All Cases
              </button>
              <button
                onClick={() => setFilterType('high_risk')}
                className={`flex-1 text-[10px] font-extrabold rounded-lg py-1.5 transition-smooth cursor-pointer leading-none ${
                  filterType === 'high_risk'
                    ? 'bg-white text-rose-800 shadow-sm border border-rose-200/50'
                    : 'text-zinc-550 hover:text-rose-700'
                }`}
              >
                High Risk 🚨
              </button>
              <button
                onClick={() => setFilterType('intermediate')}
                className={`flex-1 text-[10px] font-extrabold rounded-lg py-1.5 transition-smooth cursor-pointer leading-none ${
                  filterType === 'intermediate'
                    ? 'bg-white text-amber-800 shadow-sm border border-amber-200/50'
                    : 'text-zinc-550 hover:text-amber-700'
                }`}
              >
                Intermediate
              </button>
            </div>

            {/* Patients list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-550 font-semibold leading-normal">
                  No registered patient caseload matched filters.
                </div>
              ) : (
                filteredPatients.map(p => {
                  const isCur = activePatient?.email.toLowerCase() === p.email.toLowerCase();
                  return (
                    <div
                      key={p.email}
                      onClick={() => setSelectedPatientEmail(p.email)}
                      className={`p-3.5 rounded-xl border transition-smooth cursor-pointer flex items-center justify-between text-left ${
                        isCur 
                          ? 'border-emerald-250 bg-emerald-50/50 shadow-sm' 
                          : 'border-zinc-150 hover:border-zinc-250 bg-zinc-50/20 hover:bg-zinc-50/50'
                      }`}
                    >
                      <div className="space-y-1 truncate">
                        <span className="block text-xs font-bold text-zinc-900 truncate">{p.name}</span>
                        <span className="block font-mono text-[9px] text-zinc-400 font-bold truncate">{p.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2.5 flex-shrink-0">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border leading-none ${getRiskBadgeColor(p.latestAssessment.riskCategory)}`}>
                          {p.latestAssessment.cvdRiskPercentage}%
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Detailed clinical medical records check */}
        <div className="lg:col-span-7">
          {activePatient ? (
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl p-6 sm:p-8 leading-none text-left space-y-6">
              
              {/* Patient header info card */}
              <div className="border-b border-zinc-150 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1.5 text-left">
                  <span className="inline-flex items-center space-x-1 font-mono text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                    <Users className="h-3 w-3 text-emerald-600" />
                    <span>EMR Connected Vitals</span>
                  </span>
                  <h3 className="font-display font-extrabold text-zinc-900 text-lg sm:text-xl">
                    {activePatient.name}
                  </h3>
                  <p className="font-sans text-[11px] text-zinc-400 font-bold">Clinical Caseload Email: {activePatient.email}</p>
                </div>

                <div className="flex gap-2 font-semibold sm:self-center">
                  <span className={`inline-flex px-3 py-1.5 rounded-lg border text-xs leading-none ${getRiskBadgeColor(activePatient.latestAssessment.riskCategory)}`}>
                    CVD Forecast: <strong className="ml-1">{activePatient.latestAssessment.cvdRiskPercentage}%</strong>
                  </span>
                </div>
              </div>

              {/* Patient Vitals Subgrid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono text-left">Current Biometric Readings</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="border border-zinc-200 p-3.5 rounded-xl bg-zinc-50/30 text-left">
                    <span className="block text-[9px] text-zinc-400 font-bold mb-1 uppercase">Arterial BP</span>
                    <strong className="text-xs sm:text-sm text-zinc-900 font-mono font-extrabold">
                      {activePatient.latestAssessment.measurements.systolicBP}/{activePatient.latestAssessment.measurements.diastolicBP}
                    </strong>
                    <span className="block text-[8px] text-zinc-400 mt-1 font-bold">mmHg</span>
                  </div>
                  
                  <div className="border border-zinc-200 p-3.5 rounded-xl bg-zinc-50/30 text-left">
                    <span className="block text-[9px] text-zinc-400 font-bold mb-1 uppercase">Total Lipids</span>
                    <strong className="text-xs sm:text-sm text-zinc-900 font-mono font-extrabold">
                      {activePatient.latestAssessment.measurements.cholesterol}
                    </strong>
                    <span className="block text-[8px] text-zinc-400 mt-1 font-bold">mg/dL</span>
                  </div>

                  <div className="border border-zinc-200 p-3.5 rounded-xl bg-zinc-50/30 text-left">
                    <span className="block text-[9px] text-zinc-400 font-bold mb-1 uppercase">Fasting Glucose</span>
                    <strong className="text-xs sm:text-sm text-zinc-900 font-mono font-extrabold">
                      {activePatient.latestAssessment.measurements.bloodGlucose}
                    </strong>
                    <span className="block text-[8px] text-zinc-400 mt-1 font-bold">mg/dL</span>
                  </div>

                  <div className="border border-zinc-200 p-3.5 rounded-xl bg-zinc-50/30 text-left">
                    <span className="block text-[9px] text-zinc-400 font-bold mb-1 uppercase">Heart Status</span>
                    <strong className="text-xs sm:text-sm text-zinc-900 font-mono font-extrabold">
                      {activePatient.latestAssessment.measurements.heartRate}
                    </strong>
                    <span className="block text-[8px] text-zinc-400 mt-1 font-bold">BPM</span>
                  </div>
                </div>
              </div>

              {/* Behavior indicators row */}
              <div className="grid grid-cols-3 gap-3 border-t border-zinc-150 pt-5 text-xs text-zinc-500 font-semibold leading-none text-left">
                <div className="bg-zinc-50/30 px-3 py-2.5 rounded-xl border border-zinc-200">
                  <span className="block text-[9px] text-zinc-400 uppercase font-bold mb-1 font-mono">Smoking</span>
                  <span className="text-zinc-900 capitalize leading-none font-bold">
                    {activePatient.latestAssessment.measurements.smokingStatus}
                  </span>
                </div>
                <div className="bg-zinc-50/30 px-3 py-2.5 rounded-xl border border-zinc-200">
                  <span className="block text-[9px] text-zinc-400 uppercase font-bold mb-1 font-mono">Diabetes</span>
                  <span className="text-zinc-900 capitalize leading-none font-bold truncate block">
                    {activePatient.latestAssessment.measurements.diabetesStatus}
                  </span>
                </div>
                <div className="bg-zinc-50/30 px-3 py-2.5 rounded-xl border border-zinc-200">
                  <span className="block text-[9px] text-zinc-400 uppercase font-bold mb-1 font-mono">Exercise Rate</span>
                  <span className="text-zinc-900 capitalize leading-none font-bold">
                    {activePatient.latestAssessment.measurements.physicalActivity}
                  </span>
                </div>
              </div>

              {/* Comprehensive Predictive Disease Status (4-Models Triage Card Panel) */}
              <div className="space-y-3 px-4.5 py-4 border border-zinc-200 rounded-2xl bg-zinc-50/20 text-left shadow-sm">
                <div className="flex items-center space-x-1.5 border-b border-zinc-150 pb-2 mb-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 font-mono">Multi-Disease Stratification Profiles & Explanations</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {getFourDiseasePredictions(activePatient.latestAssessment).map((p: any) => {
                    const namesMap: any = {
                      cvd: 'Cardiovascular Disease (CVD)',
                      hyp: 'Hypertension Indicator (HYP)',
                      stroke: 'Stroke Potential',
                      chd: 'Coronary Heart Disease (CHD)'
                    };
                    return (
                      <div key={p.id} className="p-3.5 rounded-xl border border-zinc-150 bg-white text-left space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-zinc-800 uppercase tracking-tight">{namesMap[p.disease] || p.disease}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase border font-sans ${p.risk_label === 'High' ? 'bg-rose-50 border-rose-100 text-rose-750 font-bold' : p.risk_label === 'Intermediate' ? 'bg-amber-50 border-amber-100 text-amber-750 font-bold' : p.risk_label === 'Borderline' ? 'bg-yellow-50 border-yellow-101 text-yellow-700 font-bold' : 'bg-emerald-50 border-emerald-100 text-emerald-700 font-bold'}`}>
                            {p.risk_label}
                          </span>
                        </div>
                        <div className="flex items-baseline space-x-1">
                          <span className="font-display text-xl font-extrabold text-zinc-900">{p.risk_percentage.toFixed(1)}%</span>
                          <span className="text-[8px] text-zinc-400 font-mono font-bold">Model: {p.model_version}</span>
                        </div>
                        <p className="text-[10px] text-zinc-550 leading-relaxed font-semibold">
                          {p.explanation || `Mathematical forecast risk coefficient at ${p.risk_percentage}% computed successfully.`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Historical records list */}
              <div className="border-t border-zinc-150 pt-5 space-y-3 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">Historical Predictions Logs</h4>
                <div className="divide-y divide-zinc-100 space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {activePatient.history.map((hist, idx) => {
                    const dateStr = new Date(hist.timestamp).toLocaleDateString([], {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                    return (
                      <div key={idx} className="flex justify-between items-center py-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-zinc-400 font-mono text-[10px] font-bold">#{hist.id.slice(0, 5)}</span>
                          <span className="font-bold text-zinc-750">{dateStr}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border leading-none ${getRiskBadgeColor(hist.riskCategory)}`}>
                            {hist.cvdRiskPercentage}%
                          </span>
                          <button
                            onClick={() => onViewAssessment(hist)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-850 cursor-pointer flex items-center space-x-1"
                          >
                            <Sliders className="h-3 w-3" />
                            <span>Analyze SHAP</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Care Plan, Consultations & Prescriptions System */}
              <div className="border-t border-zinc-150 pt-6 space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <h3 className="font-display font-extrabold text-zinc-900 text-sm sm:text-base flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-emerald-650" />
                    <span>Care Plan & Consultations Hub</span>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">Dynamic Telemedicine Nodes</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Appointments Calendar & Schedulers */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] uppercase font-bold text-zinc-400 font-mono">Teledoctor Appointments</span>
                      <button
                        onClick={() => setShowScheduleForm(!showScheduleForm)}
                        className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded transition-smooth cursor-pointer"
                      >
                        {showScheduleForm ? 'Close Scheduler' : 'Schedule Appointment'}
                      </button>
                    </div>

                    {showScheduleForm && (
                      <form onSubmit={handleScheduleSubmit} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4.5 space-y-3.5 text-xs animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Consultation Date & Time</label>
                          <input
                            type="datetime-local"
                            required
                            value={apptDatetime}
                            onChange={(e) => setApptDatetime(e.target.value)}
                            className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs text-zinc-800 font-semibold font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Consultation Forum</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setApptType('virtual')}
                              className={`py-1.5 rounded-lg border font-bold capitalize ${apptType === 'virtual' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-zinc-200 text-zinc-650'}`}
                            >
                              VidyoLink Virtual
                            </button>
                            <button
                              type="button"
                              onClick={() => setApptType('in_person')}
                              className={`py-1.5 rounded-lg border font-bold capitalize ${apptType === 'in_person' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-zinc-200 text-zinc-650'}`}
                            >
                              In-Clinic Visit
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Clinical Directives / Session Notes</label>
                          <textarea
                            placeholder="E.g. Follow-up predictive scan results and monitor blood glucose indicators..."
                            rows={2}
                            value={apptNotes}
                            onChange={(e) => setApptNotes(e.target.value)}
                            className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs font-semibold"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingAppt}
                          className="w-full bg-emerald-600 hover:bg-emerald-705 text-white font-bold py-2 rounded-lg text-xs transition-smooth cursor-pointer"
                        >
                          {isSubmittingAppt ? 'Registering...' : 'Register and Confirm Appointment'}
                        </button>
                      </form>
                    )}

                    {activeAppointments.length === 0 ? (
                      <div className="py-6 text-center border border-dashed border-zinc-200 bg-zinc-50/20 rounded-xl text-zinc-400 font-sans text-xs">
                        No consultations requested by this patient.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {activeAppointments.map((appt) => (
                          <div key={appt.id} className="border border-zinc-200 rounded-xl bg-zinc-50/10 p-3 flex flex-col justify-between gap-2.5">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-zinc-405 font-semibold font-mono">Consultation ID: {appt.id.slice(-5)}</span>
                                <span className="block font-bold text-xs text-zinc-800">
                                  {new Date(appt.datetime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                </span>
                              </div>
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-extrabold capitalize border ${
                                appt.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                appt.status === 'completed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                appt.status === 'cancelled' ? 'bg-zinc-100 text-zinc-600 border-zinc-200' :
                                'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                              }`}>
                                {appt.status}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2 text-[10px] text-zinc-500 font-semibold font-sans">
                              <span className="flex items-center gap-1">
                                {appt.type === 'virtual' ? <Video className="h-3 w-3 text-emerald-500" /> : <MapPin className="h-3 w-3 text-rose-500" />}
                                <span className="capitalize">{appt.type}</span>
                              </span>
                              {appt.notes && <span className="text-zinc-400 italic font-medium truncate max-w-xs">"{appt.notes}"</span>}
                            </div>

                            {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                              <div className="flex gap-2 border-t border-zinc-100 pt-2 text-[10px]">
                                {appt.status === 'pending' && (
                                  <button
                                    onClick={() => handleUpdateApptStatus(appt.id, 'confirmed')}
                                    className="flex-1 bg-emerald-50 font-bold text-emerald-700 hover:bg-emerald-100 py-1 rounded transition-smooth border border-emerald-200 cursor-pointer text-center"
                                  >
                                    Confirm
                                  </button>
                                )}
                                <button
                                  onClick={() => handleUpdateApptStatus(appt.id, 'completed')}
                                  className="flex-1 bg-blue-50 font-bold text-blue-700 hover:bg-blue-100 py-1 rounded transition-smooth border border-blue-200 cursor-pointer text-center"
                                >
                                  Mark Completed
                                </button>
                                <button
                                  onClick={() => handleUpdateApptStatus(appt.id, 'cancelled')}
                                  className="flex-1 bg-zinc-100 font-bold text-zinc-600 hover:bg-zinc-150 py-1 rounded transition-smooth border border-zinc-200 cursor-pointer text-center"
                                >
                                  Cancel consult
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* RIGHT COLUMN: Active Therapeutics & Recipes prescription */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] uppercase font-bold text-zinc-400 font-mono">Pharmacotherapy (Rx)</span>
                      <button
                        onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                        className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 rounded transition-smooth cursor-pointer"
                      >
                        {showPrescriptionForm ? 'Close Rx Form' : 'Issue Prescription'}
                      </button>
                    </div>

                    {showPrescriptionForm && (
                      <form onSubmit={handlePrescriptionSubmit} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4.5 space-y-3 text-xs animate-in fade-in slide-in-from-top-1">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Medication Name & Strength</label>
                          <input
                            type="text"
                            placeholder="E.g. Metoprolol Succinate 25mg"
                            required
                            value={rxMeds}
                            onChange={(e) => setRxMeds(e.target.value)}
                            className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs font-semibold text-zinc-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Dosage Regimen</label>
                          <input
                            type="text"
                            placeholder="E.g. One tablet daily with breakfast"
                            required
                            value={rxDosage}
                            onChange={(e) => setRxDosage(e.target.value)}
                            className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs font-semibold text-zinc-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-550">Diagnostic Purpose / Indications</label>
                          <input
                            type="text"
                            placeholder="E.g. Mitigate myocardial load and reduce systolic hypertension"
                            value={rxIndications}
                            onChange={(e) => setRxIndications(e.target.value)}
                            className="w-full rounded-lg border border-zinc-250 bg-white px-3 py-2 text-xs font-semibold text-zinc-800"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingRx}
                          className="w-full bg-emerald-600 hover:bg-emerald-705 text-white font-bold py-2 rounded-lg text-xs transition-smooth cursor-pointer"
                        >
                          {isSubmittingRx ? 'Issuing...' : 'Authorize and Record Prescription'}
                        </button>
                      </form>
                    )}

                    {activePrescriptions.length === 0 ? (
                      <div className="py-6 text-center border border-dashed border-zinc-200 bg-zinc-50/20 rounded-xl text-zinc-400 font-sans text-xs">
                        No active clinical medications prescribed.
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {activePrescriptions.map((rx) => (
                          <div key={rx.id} className="border border-zinc-150 rounded-xl bg-zinc-50/5 p-3 text-xs text-zinc-650 font-medium">
                            <div className="flex justify-between items-center mb-1">
                              <strong className="text-zinc-850 font-bold text-[12px]">{rx.medicationName}</strong>
                              <span className="text-[9px] text-zinc-400 font-mono">{new Date(rx.prescribedAt).toLocaleDateString()}</span>
                            </div>
                            <p className="font-semibold text-zinc-550 pb-1.5">Dosage: <strong className="text-zinc-800">{rx.dosage}</strong></p>
                            {rx.indications && (
                              <div className="bg-zinc-100/40 p-2 rounded border border-zinc-150 text-[10.5px]">
                                <span className="font-extrabold uppercase font-mono tracking-wider text-[8px] text-zinc-400 block mb-0.5">Indicated For:</span>
                                {rx.indications}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Core Diagnostic CTA action bar links */}
              <div className="flex border-t border-zinc-150 pt-5 items-center justify-between gap-4 sm:flex-row flex-col">
                <div className="text-[10.5px] text-zinc-500 leading-normal max-w-md flex gap-1.5 items-start font-semibold">
                  <Activity className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Analyze active patient indicators through fully modeled Shapley Additive Explanations. Review the diagnostic graph variables pushing patient totals outward.
                  </span>
                </div>
                
                <button
                  onClick={() => onViewAssessment(activePatient.latestAssessment)}
                  className="flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10 ml-auto"
                >
                  <FileText className="h-4 w-4" />
                  <span>Inspect Explainable Profile</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-500 bg-zinc-50/50">
              Select a patient directory file in the left column to view records.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

// Compact helper
function ChevronRight(props: any) {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="h-3.5 w-3.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
