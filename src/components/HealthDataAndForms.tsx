/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  User, 
  TrendingUp, 
  Plus, 
  Check, 
  ChevronRight, 
  Calendar, 
  Eye, 
  Clipboard, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';
import {
  getUserProfile,
  getBloodPressure,
  getHeartRate,
  getHealthAssessments,
  createUserProfile,
  updateUserProfile,
  createBloodPressure,
  createHeartRate,
  createHealthAssessment,
} from '../api';

interface HealthDataAndFormsProps {
  onBackToDashboard: () => void;
}

export default function HealthDataAndForms({ onBackToDashboard }: HealthDataAndFormsProps) {
  const [activeTab, setActiveTab] = useState<'form_profile' | 'form_bp' | 'form_hr' | 'form_ha'>('form_profile');
  
  // Data State
  const [profileData, setProfileData] = useState<any>(null);
  const [bpList, setBpList] = useState<any[]>([]);
  const [hrList, setHrList] = useState<any[]>([]);
  const [haList, setHaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form Inputs
  // 1. Profile fields
  const [profileForm, setProfileForm] = useState({
    first_name: '', middle_name: '', last_name: '', phone_number: '',
    date_of_birth: '', sex: 'male', work_type: 'private', education: 'undergraduate',
    diabetes: false, heart_disease: false, history_cvd: false, kidney_disease: false,
    prevalent_stroke: false, prevalent_hypertension: false, bp_history: 'normal',
    family_history_htn: false, family_history_cvd: false, smoking: 'never',
    cigs_per_day: 0, alcohol_use: 'none', physical_activity_level: 'moderate',
    exercise_frequency: '3-4 times/week', diet_quality: 'healthy', salt_intake: 2.5,
    stress_score: 3, sleep_duration: 8, sleep_quality: 'good'
  });

  // 2. BP fields
  const [bpForm, setBpForm] = useState({
    systolic_value: 120,
    diastolic_value: 80,
    body_posture: 'sitting',
    measurement_location: 'left wrist',
    descriptive_statistic: 'average',
    temporal_relationship_to_physical_activity: 'before exercise',
    temporal_relationship_to_sleep: 'before sleep',
    start_date_time: new Date().toISOString().substring(0, 16)
  });

  // 3. HR fields
  const [hrForm, setHrForm] = useState({
    value: 72,
    body_posture: 'sitting',
    measurement_location: 'left wrist',
    descriptive_statistic: 'average',
    temporal_relationship_to_physical_activity: 'before exercise',
    temporal_relationship_to_sleep: 'before sleep',
    start_date_time: new Date().toISOString().substring(0, 16)
  });

  // 4. HA fields
  const [haForm, setHaForm] = useState({
    weight: 74,
    height: 1.78,
    glucose: 95,
    avg_glucose_level: 95,
    total_cholesterol: 195,
    hdl_cholesterol: 50,
    on_bp_medication: false,
    bp_medication_type: 'none',
    smoking_status: 'never',
    cigs_per_day: 0,
    alcohol_use: 'none',
    physical_activity_level: 'moderate',
    assessment_notes: 'Standard checkup'
  });

  // Fetch from APIs on load
  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, bpRes, hrRes, haRes] = await Promise.all([
        getUserProfile(),
        getBloodPressure(),
        getHeartRate(),
        getHealthAssessments(),
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        setProfileData(profile);
        setProfileForm({
          ...profileForm,
          ...profile,
          date_of_birth: profile.date_of_birth || '',
        });
      }

      if (bpRes.ok) {
        const bpData = await bpRes.json();
        setBpList(Array.isArray(bpData) ? bpData : []);
      }

      if (hrRes.ok) {
        const hrData = await hrRes.json();
        setHrList(Array.isArray(hrData) ? hrData : []);
      }

      if (haRes.ok) {
        const haData = await haRes.json();
        setHaList(Array.isArray(haData) ? haData : []);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading clinical data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerAlertMessage = (type: 'success' | 'error', text: string) => {
    if (type === 'success') {
      setSuccessMessage(text);
      setTimeout(() => setSuccessMessage(''), 4500);
    } else {
      setErrorMessage(text);
      setTimeout(() => setErrorMessage(''), 4500);
    }
  };

  // Submit operations
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profileRequest = profileData ? updateUserProfile(profileForm) : createUserProfile(profileForm);
      const profileRes = await profileRequest;
      if (profileRes.ok) {
        const profile = await profileRes.json();
        setProfileData(profile);
        triggerAlertMessage('success', 'User profile parameters synced successfully (Form 1 of 4)');
      } else {
        const error = await profileRes.json();
        throw new Error(error.detail || 'Profile sync failed');
      }
    } catch (err: any) {
      console.error('Profile submit failed:', err);
      triggerAlertMessage('error', err.message || 'Failed to update profile form values.');
    }
  };

  const handleBpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bpRes = await createBloodPressure({
        ...bpForm,
        start_date_time: new Date(bpForm.start_date_time).toISOString(),
      });
      if (bpRes.ok) {
        const bp = await bpRes.json();
        setBpList(prev => [bp, ...prev]);
        triggerAlertMessage('success', 'Blood Pressure log recorded successfully (Form 2 of 4)');
        setActiveTab('form_bp');
      } else {
        const error = await bpRes.json();
        throw new Error(error.detail || 'Blood pressure log failed');
      }
    } catch (err: any) {
      console.error('BP submit failed:', err);
      triggerAlertMessage('error', err.message || 'Failed to log Blood Pressure values.');
    }
  };

  const handleHrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hrRes = await createHeartRate({
        ...hrForm,
        start_date_time: new Date(hrForm.start_date_time).toISOString(),
      });
      if (hrRes.ok) {
        const hr = await hrRes.json();
        setHrList(prev => [hr, ...prev]);
        triggerAlertMessage('success', 'Resting Heart Rate log recorded successfully (Form 3 of 4)');
        setActiveTab('form_hr');
      } else {
        const error = await hrRes.json();
        throw new Error(error.detail || 'Heart rate log failed');
      }
    } catch (err: any) {
      console.error('HR submit failed:', err);
      triggerAlertMessage('error', err.message || 'Failed to log heart rate values.');
    }
  };

  const handleHaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assessmentRes = await createHealthAssessment(haForm);
      if (assessmentRes.ok) {
        const assessment = await assessmentRes.json();
        setHaList(prev => [assessment, ...prev]);
        triggerAlertMessage('success', 'Clinical Health Assessment record filed successfully (Form 4 of 4)');
        setActiveTab('form_ha');
      } else {
        const error = await assessmentRes.json();
        throw new Error(error.detail || 'Health assessment submission failed');
      }
    } catch (err: any) {
      console.error('Health assessment submit failed:', err);
      triggerAlertMessage('error', err.message || 'Failed to file clinical health assessment.');
    }
  };

  // SVG Blood Pressure Plot generator
  const renderBloodPressureGraph = () => {
    if (bpList.length === 0) {
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 text-zinc-500 py-10">
          <Activity className="h-10 w-10 text-rose-500/50 mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-zinc-300">No Blood Pressure Readings</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center">Add a blood pressure measurement using Form 2 to generate an active telemetry graph.</p>
        </div>
      );
    }

    // Sort to display chronologically (earliest to latest)
    const sortedBp = [...bpList].sort((a, b) => new Date(a.start_date_time).getTime() - new Date(b.start_date_time).getTime());
    
    const svgWidth = 800;
    const svgHeight = 280;
    const paddingLeft = 50;
    const paddingRight = 40;
    const paddingTop = 30;
    const paddingBottom = 40;

    const plotWidth = svgWidth - paddingLeft - paddingRight;
    const plotHeight = svgHeight - paddingTop - paddingBottom;

    // mmHg bounds (clamp display to 30 - 180)
    const minVal = 30;
    const maxVal = 180;
    const valRange = maxVal - minVal;

    const getX = (idx: number) => {
      if (sortedBp.length <= 1) return paddingLeft + plotWidth / 2;
      return paddingLeft + (idx / (sortedBp.length - 1)) * plotWidth;
    };

    const getY = (val: number) => {
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      const ratio = (clamped - minVal) / valRange;
      return paddingTop + plotHeight - (ratio * plotHeight);
    };

    // Build path coordinates
    let sysPath = "";
    let diaPath = "";
    sortedBp.forEach((bp, idx) => {
      const x = getX(idx);
      const ySys = getY(bp.systolic_value || 120);
      const yDia = getY(bp.diastolic_value || 80);
      
      if (idx === 0) {
        sysPath = `M ${x} ${ySys}`;
        diaPath = `M ${x} ${yDia}`;
      } else {
        sysPath += ` L ${x} ${ySys}`;
        diaPath += ` L ${x} ${yDia}`;
      }
    });

    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 border-zinc-800 shadow-xl p-6 text-left">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <div>
            <span className="font-mono text-[9px] font-bold text-rose-500 uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-950/20">
              Live Clinical Telemetry
            </span>
            <h2 className="font-display font-bold text-xl text-zinc-100 mt-1">
              Active Blood Pressure Assessment
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Chronological systolic and diastolic values plotted from medical log entries.</p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 block shadow-glow" />
              <span className="text-zinc-300 font-semibold font-mono">Systolic (mmHg)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-cyan-500 block shadow-glow" />
              <span className="text-zinc-300 font-semibold font-mono">Diastolic (mmHg)</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg className="w-full min-w-[700px] h-[280px]" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Horizontal Grid lines */}
            {[40, 60, 80, 100, 120, 140, 160, 180].map((level) => {
              const y = getY(level);
              return (
                <g key={level}>
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#1f1f23" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="fill-zinc-500 text-[10px] font-mono leading-none">
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Time labels below chart */}
            {sortedBp.map((bp, idx) => {
              const x = getX(idx);
              const dateObj = new Date(bp.start_date_time);
              const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
              return (
                <g key={idx}>
                  <line x1={x} y1={paddingTop} x2={x} y2={paddingTop + plotHeight} stroke="#1f1f23" strokeWidth="0.5" />
                  <text x={x} y={paddingTop + plotHeight + 16} textAnchor="middle" className="fill-zinc-400 text-[9px] font-mono">
                    {dateStr}
                  </text>
                  <text x={x} y={paddingTop + plotHeight + 28} textAnchor="middle" className="fill-zinc-500 text-[8px] font-mono font-normal">
                    {timeStr}
                  </text>
                </g>
              );
            })}

            {/* Systolic Line */}
            {sortedBp.length > 0 && (
              <path d={sysPath} fill="none" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_10px_rgba(239,68,68,0.4)]" />
            )}

            {/* Diastolic Line */}
            {sortedBp.length > 0 && (
              <path d={diaPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_10px_rgba(6,182,212,0.4)]" />
            )}

            {/* Dots */}
            {sortedBp.map((bp, idx) => {
              const x = getX(idx);
              const ySys = getY(bp.systolic_value || 120);
              const yDia = getY(bp.diastolic_value || 80);
              return (
                <g key={idx} className="group cursor-pointer">
                  {/* Systolic Node */}
                  <circle cx={x} cy={ySys} r="5" fill="#ef4444" stroke="#09090b" strokeWidth="1.5" />
                  
                  {/* Diastolic Node */}
                  <circle cx={x} cy={yDia} r="5" fill="#06b6d4" stroke="#09090b" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Logs List Table */}
        <div className="mt-8">
          <h3 className="font-semibold text-sm text-zinc-300 mb-4 font-display">Historical Log Entries</h3>
          <div className="overflow-hidden border border-zinc-800 rounded-xl bg-zinc-950/40">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono text-[9px]">
                  <th className="p-3">DATE & TIME</th>
                  <th className="p-3">BP READING</th>
                  <th className="p-3">BODY POSTURE</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3">PHYSICAL RELATIONSHIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/60 text-zinc-300">
                {sortedBp.slice().reverse().map((bp, idx) => {
                  const dateVal = new Date(bp.start_date_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                  return (
                    <tr key={idx} className="hover:bg-zinc-900/30">
                      <td className="p-3 font-mono text-zinc-400">{dateVal}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-zinc-100 font-mono text-sm">{bp.systolic_value}/{bp.diastolic_value}</span>
                        <span className="text-[10px] text-zinc-500 ml-1">mmHg</span>
                      </td>
                      <td className="p-3 capitalize text-zinc-400">{bp.body_posture}</td>
                      <td className="p-3 capitalize text-zinc-400">{bp.measurement_location}</td>
                      <td className="p-3 text-[11px] font-sans text-zinc-405">{bp.temporal_relationship_to_physical_activity} ({bp.temporal_relationship_to_sleep})</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Back button and banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-5 text-left">
        <div>
          <button 
            onClick={onBackToDashboard}
            className="flex items-center space-x-1.5 text-xs text-emerald-600 font-bold hover:text-emerald-700 cursor-pointer"
          >
            <span>&larr; Back to Patient Dashboard</span>
          </button>
          
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2.5">
            Health Telemetry Hub & Patient Forms
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1 font-semibold">
            Log physical telemetry, compile diagnostic baseline data layers, and plot automated clinical assessment charts.
          </p>
        </div>
      </div>

      {/* Banner alert notices */}
      {successMessage && (
        <div className="mb-6 flex items-center space-x-3.5 rounded-xl border border-emerald-150 bg-emerald-50 p-4 text-emerald-800 text-xs font-semibold leading-normal text-left">
          <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 flex items-center space-x-3.5 rounded-xl border border-rose-150 bg-rose-50 p-4 text-rose-800 text-xs font-semibold leading-normal text-left">
          <AlertCircle className="h-5 w-5 text-rose-650 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Forms and Graph subtabs selection rails */}
      <div className="mb-8 flex flex-wrap border-b border-zinc-200">
        <button
          onClick={() => setActiveTab('form_profile')}
          className={`px-5 py-4 text-xs font-bold transition-smooth outline-none cursor-pointer border-b-2 ${
            activeTab === 'form_profile' 
              ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50 font-bold' 
              : 'text-zinc-500 border-transparent hover:text-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Form 1: User Profile</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('form_bp')}
          className={`px-5 py-4 text-xs font-bold transition-smooth outline-none cursor-pointer border-b-2 ${
            activeTab === 'form_bp' 
              ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50 font-bold' 
              : 'text-zinc-500 border-transparent hover:text-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Form 2: Blood Pressure</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('form_hr')}
          className={`px-5 py-4 text-xs font-bold transition-smooth outline-none cursor-pointer border-b-2 ${
            activeTab === 'form_hr' 
              ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50 font-bold' 
              : 'text-zinc-500 border-transparent hover:text-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4" />
            <span>Form 3: Heart Rate</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('form_ha')}
          className={`px-5 py-4 text-xs font-bold transition-smooth outline-none cursor-pointer border-b-2 ${
            activeTab === 'form_ha' 
              ? 'text-emerald-700 border-emerald-600 bg-emerald-50/50 font-bold' 
              : 'text-zinc-500 border-transparent hover:text-zinc-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Clipboard className="h-4 w-4" />
            <span>Form 4: Health Assessment</span>
          </div>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto" />
          <p className="text-xs text-zinc-500 mt-3">Fetching synchronized medical database store...</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Form 1: User Profile Form */}
          {activeTab === 'form_profile' && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl text-left max-w-4xl mx-auto leading-none">
              <div className="border-b border-zinc-200 pb-5 mb-6">
                <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded">
                  Form Class 01 of 04
                </span>
                <h2 className="font-display font-extrabold text-xl text-zinc-900 mt-2.5">User Profile Configuration Form</h2>
                <p className="text-xs text-zinc-500 mt-1 font-semibold leading-normal">Define patient identity parameters, medical anamnesis baseline, work markers, and home behavioral habits.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* 1. Demographics Section */}
                <div>
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4 font-mono">1. Personal Demographics</h3>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={profileForm.first_name}
                        onChange={e => setProfileForm({ ...profileForm, first_name: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Middle Name (Optional)</label>
                      <input 
                        type="text" 
                        value={profileForm.middle_name}
                        onChange={e => setProfileForm({ ...profileForm, middle_name: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Last Name / Surname</label>
                      <input 
                        type="text" 
                        required
                        value={profileForm.last_name}
                        onChange={e => setProfileForm({ ...profileForm, last_name: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileForm.phone_number}
                        onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Date of Birth</label>
                      <input 
                        type="date" 
                        required
                        value={profileForm.date_of_birth}
                        onChange={e => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Biological Gender / Sex</label>
                      <select 
                        value={profileForm.sex}
                        onChange={e => setProfileForm({ ...profileForm, sex: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Professional & Education Section */}
                <div className="pt-5 border-t border-zinc-200">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4 font-mono">2. Social & Environmental Markers</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Work Type / Occupation</label>
                      <select 
                        value={profileForm.work_type}
                        onChange={e => setProfileForm({ ...profileForm, work_type: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="private">Private Sector Corporate</option>
                        <option value="government">Government / Public Servant</option>
                        <option value="self-employed">Self Employed Entrepreneur</option>
                        <option value="children">Student / Underage</option>
                        <option value="unemployed">Unemployed / Pensioner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Highest Completed Education</label>
                      <select 
                        value={profileForm.education}
                        onChange={e => setProfileForm({ ...profileForm, education: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="none">No formal schooling</option>
                        <option value="high school">Secondary / High School</option>
                        <option value="undergraduate">College / Undergraduate</option>
                        <option value="postgraduate">Postgraduate Degree</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Clinical Pre-existing and Family history checkboxes */}
                <div className="pt-5 border-t border-zinc-200">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4 font-mono">3. Pre-existing Conditions & Family History</h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.diabetes}
                        onChange={e => setProfileForm({ ...profileForm, diabetes: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">History of Diabetes</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.heart_disease}
                        onChange={e => setProfileForm({ ...profileForm, heart_disease: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Chronic Heart Disease</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.history_cvd}
                        onChange={e => setProfileForm({ ...profileForm, history_cvd: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">History of CVD</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.kidney_disease}
                        onChange={e => setProfileForm({ ...profileForm, kidney_disease: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Chronic Kidney Disease</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.prevalent_stroke}
                        onChange={e => setProfileForm({ ...profileForm, prevalent_stroke: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Prevalent Stroke History</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.prevalent_hypertension}
                        onChange={e => setProfileForm({ ...profileForm, prevalent_hypertension: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Prevalent Hypertension</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.family_history_htn}
                        onChange={e => setProfileForm({ ...profileForm, family_history_htn: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Family History: HTN</span>
                    </label>

                    <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                      <input 
                        type="checkbox" 
                        checked={profileForm.family_history_cvd}
                        onChange={e => setProfileForm({ ...profileForm, family_history_cvd: e.target.checked })}
                        className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                      />
                      <span className="text-xs text-zinc-700 font-bold">Family History: CVD</span>
                    </label>
                  </div>
                </div>

                {/* 4. Lifestyle and Habits */}
                <div className="pt-5 border-t border-zinc-200">
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-4 font-mono">4. Habits & Lifestyle Coefficients</h3>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Tobacco Smoker State</label>
                      <select 
                        value={profileForm.smoking}
                        onChange={e => setProfileForm({ ...profileForm, smoking: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="never">Never Smoked</option>
                        <option value="former">Former Smoker (Quit)</option>
                        <option value="current_light">Active Smoker (under 10/day)</option>
                        <option value="current_heavy">Heavy Smoker (over 10/day)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Cigarettes per Day count</label>
                      <input 
                        type="number" 
                        min="0"
                        value={profileForm.cigs_per_day}
                        onChange={e => setProfileForm({ ...profileForm, cigs_per_day: Number(e.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Alcohol Consumption</label>
                      <select 
                        value={profileForm.alcohol_use}
                        onChange={e => setProfileForm({ ...profileForm, alcohol_use: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="none">Sober / None</option>
                        <option value="low">Low (1-2 drinks/week)</option>
                        <option value="moderate">Moderate (3-7 drinks/week)</option>
                        <option value="heavy">Heavy (7+ drinks/week)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Physical Activity Intensity</label>
                      <select 
                        value={profileForm.physical_activity_level}
                        onChange={e => setProfileForm({ ...profileForm, physical_activity_level: e.target.value })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                      >
                        <option value="none">Completely Sedentary</option>
                        <option value="low">Low aerobic density</option>
                        <option value="moderate">Moderate workouts</option>
                        <option value="high">High systemic workout strain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Weekly Sodium Intake (Salt)</label>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0"
                        value={profileForm.salt_intake}
                        onChange={e => setProfileForm({ ...profileForm, salt_intake: Number(e.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Subjective Stress Rating</label>
                      <select 
                        value={profileForm.stress_score}
                        onChange={e => setProfileForm({ ...profileForm, stress_score: Number(e.target.value) })}
                        className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono cursor-pointer"
                      >
                        <option value="1">1 - Safe / Very Calm</option>
                        <option value="2">2 - Low / Occasional Tension</option>
                        <option value="3">3 - Moderate</option>
                        <option value="4">4 - High Sympathetic Stress</option>
                        <option value="5">5 - Extreme / Hypertensive Stress</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 text-right flex justify-end space-x-3 select-none">
                  <button 
                    type="button"
                    onClick={onBackToDashboard}
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-650 hover:bg-zinc-50 cursor-pointer active:scale-95 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer hover:shadow-emerald-500/10"
                  >
                    Save Profile Baseline
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form 2: Blood Pressure Form */}
          {activeTab === 'form_bp' && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl text-left max-w-2xl mx-auto leading-none">
              <div className="border-b border-zinc-200 pb-5 mb-6">
                <span className="text-[9px] font-mono font-bold text-rose-700 uppercase tracking-widest bg-rose-50 border border-rose-150 px-2.5 py-1 rounded">
                  Form Class 02 of 04
                </span>
                <h2 className="font-display font-extrabold text-xl text-zinc-900 mt-2.5">Log Blood Pressure Measurement</h2>
                <p className="text-xs text-zinc-500 mt-1 font-semibold leading-normal">Log clinical arterial pressure logs, including physical postures and descriptive telemetry parameters.</p>
              </div>

              <form onSubmit={handleBpSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Systolic Value (mmHg)</label>
                    <input 
                      type="number" 
                      min="40" 
                      max="240" 
                      required
                      value={bpForm.systolic_value}
                      onChange={e => setBpForm({ ...bpForm, systolic_value: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Diastolic Value (mmHg)</label>
                    <input 
                      type="number" 
                      min="30" 
                      max="150" 
                      required
                      value={bpForm.diastolic_value}
                      onChange={e => setBpForm({ ...bpForm, diastolic_value: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono text-sm" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Start Date & Time (Measurement Record)</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={bpForm.start_date_time}
                    onChange={e => setBpForm({ ...bpForm, start_date_time: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Body Posture during check</label>
                    <select 
                      value={bpForm.body_posture}
                      onChange={e => setBpForm({ ...bpForm, body_posture: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="sitting">Sitting comfortably</option>
                      <option value="standing">Standing erect</option>
                      <option value="supine">Supine (Lying flat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Measurement Device Location</label>
                    <select 
                      value={bpForm.measurement_location}
                      onChange={e => setBpForm({ ...bpForm, measurement_location: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="left wrist">Left Wrist</option>
                      <option value="left upper arm">Left Upper Arm</option>
                      <option value="right wrist">Right Wrist</option>
                      <option value="right upper arm">Right Upper Arm</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Temporal relation to Activity</label>
                    <select 
                      value={bpForm.temporal_relationship_to_physical_activity}
                      onChange={e => setBpForm({ ...bpForm, temporal_relationship_to_physical_activity: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="before exercise">Before physical exercise</option>
                      <option value="after exercise">After physical exercise</option>
                      <option value="during exercise">During active exercise</option>
                      <option value="unrelated">Unrelated to workouts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Temporal relation to Sleep</label>
                    <select 
                      value={bpForm.temporal_relationship_to_sleep}
                      onChange={e => setBpForm({ ...bpForm, temporal_relationship_to_sleep: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="before sleep">Immediately before sleep</option>
                      <option value="after waking">Immediately after waking</option>
                      <option value="during sleep">During sleep cycle</option>
                      <option value="unrelated">Unrelated to sleeping cycle</option>
                    </select>
                  </div>
                </div>

                <div className="pt-5 border-t border-zinc-200 text-right flex justify-end space-x-3 select-none">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('graph_bp')} 
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-650 hover:bg-zinc-50 cursor-pointer active:scale-95 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer hover:shadow-emerald-500/10"
                  >
                    Save BP Entry
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form 3: Heart Rate Form */}
          {activeTab === 'form_hr' && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl text-left max-w-2xl mx-auto leading-none">
              <div className="border-b border-zinc-200 pb-5 mb-6">
                <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded">
                  Form Class 03 of 04
                </span>
                <h2 className="font-display font-extrabold text-xl text-zinc-900 mt-2.5">Log Heart Rate Measurement</h2>
                <p className="text-xs text-zinc-500 mt-1 font-semibold leading-normal">Register resting or active heart rate values (in beats per minute) to keep track of cardiorespiratory loads.</p>
              </div>

              <form onSubmit={handleHrSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Heart Rate Value (BPM - Beats per minute)</label>
                  <input 
                    type="number" 
                    min="35" 
                    max="220" 
                    required
                    value={hrForm.value}
                    onChange={e => setHrForm({ ...hrForm, value: Number(e.target.value) })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-extrabold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono text-lg text-emerald-600" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Start Date & Time (Measurement Record)</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={hrForm.start_date_time}
                    onChange={e => setHrForm({ ...hrForm, start_date_time: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Body Posture during check</label>
                    <select 
                      value={hrForm.body_posture}
                      onChange={e => setHrForm({ ...hrForm, body_posture: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="sitting">Sitting comfortably</option>
                      <option value="standing">Standing erect</option>
                      <option value="supine">Supine (Lying flat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Measurement Device Location</label>
                    <select 
                      value={hrForm.measurement_location}
                      onChange={e => setHrForm({ ...hrForm, measurement_location: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="left wrist">Left Wrist</option>
                      <option value="left upper arm">Left Upper Arm</option>
                      <option value="right wrist">Right Wrist</option>
                      <option value="right upper arm">Right Upper Arm</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Temporal relation to Activity</label>
                    <select 
                      value={hrForm.temporal_relationship_to_physical_activity}
                      onChange={e => setHrForm({ ...hrForm, temporal_relationship_to_physical_activity: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="before exercise">Before physical exercise</option>
                      <option value="after exercise">After physical exercise</option>
                      <option value="during exercise">During active exercise</option>
                      <option value="unrelated">Unrelated to workouts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Temporal relation to Sleep</label>
                    <select 
                      value={hrForm.temporal_relationship_to_sleep}
                      onChange={e => setHrForm({ ...hrForm, temporal_relationship_to_sleep: e.target.value })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                    >
                      <option value="before sleep">Immediately before sleep</option>
                      <option value="after waking">Immediately after waking</option>
                      <option value="during sleep">During sleep cycle</option>
                      <option value="unrelated">Unrelated to sleeping cycle</option>
                    </select>
                  </div>
                </div>

                <div className="pt-5 border-t border-zinc-200 text-right flex justify-end space-x-3 select-none">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('graph_bp')} 
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-650 hover:bg-zinc-50 cursor-pointer active:scale-95 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer hover:shadow-emerald-500/10"
                  >
                    Save Heart Rate BPM
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Form 4: Health Assessment / Medical measurements form */}
          {activeTab === 'form_ha' && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl text-left max-w-3xl mx-auto leading-none">
              <div className="border-b border-zinc-200 pb-5 mb-6">
                <span className="text-[9px] font-mono font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-150 px-2.5 py-1 rounded">
                  Form Class 04 of 04
                </span>
                <h2 className="font-display font-extrabold text-xl text-zinc-900 mt-2.5">General Clinical Health Assessment Form</h2>
                <p className="text-xs text-zinc-500 mt-1 font-semibold leading-normal">Collect biometric vitals, blood lipid panels, medication regimes, and professional notes.</p>
              </div>

              <form onSubmit={handleHaSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Weight (kilograms)</label>
                    <input 
                      type="number" 
                      min="10" 
                      max="300" 
                      required
                      value={haForm.weight}
                      onChange={e => setHaForm({ ...haForm, weight: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Height (meters - e.g. 1.78)</label>
                    <input 
                      type="number" 
                      min="0.5" 
                      max="3.0" 
                      step="0.01" 
                      required
                      value={haForm.height}
                      onChange={e => setHaForm({ ...haForm, height: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Fasting Blood Glucose (mg/dL)</label>
                    <input 
                      type="number" 
                      min="20" 
                      max="400" 
                      required
                      value={haForm.glucose}
                      onChange={e => setHaForm({ ...haForm, glucose: Number(e.target.value), avg_glucose_level: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Average Blood Glucose over 30 days (mg/dL)</label>
                    <input 
                      type="number" 
                      min="20" 
                      max="400" 
                      required
                      value={haForm.avg_glucose_level}
                      onChange={e => setHaForm({ ...haForm, avg_glucose_level: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Total Serum Cholesterol (mg/dL)</label>
                    <input 
                      type="number" 
                      min="50" 
                      max="600" 
                      required
                      value={haForm.total_cholesterol}
                      onChange={e => setHaForm({ ...haForm, total_cholesterol: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">HDL "Good" Cholesterol (mg/dL)</label>
                    <input 
                      type="number" 
                      min="10" 
                      max="150" 
                      required
                      value={haForm.hdl_cholesterol}
                      onChange={e => setHaForm({ ...haForm, hdl_cholesterol: Number(e.target.value) })}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-mono" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1.5 font-bold">Additional Clinical Assessment Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Log comments, symptoms, cardiovascular family markers, or clinical warnings..."
                    value={haForm.assessment_notes}
                    onChange={e => setHaForm({ ...haForm, assessment_notes: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-800 font-semibold outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth font-sans"
                  />
                </div>

                <div className="pt-5 border-t border-zinc-200 text-right flex justify-end space-x-3 select-none">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('graph_bp')} 
                    className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold text-zinc-650 hover:bg-zinc-50 cursor-pointer active:scale-95 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer hover:shadow-emerald-500/10"
                  >
                    Submit Clinical Form
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
