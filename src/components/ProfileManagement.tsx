/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Save, Sliders, ArrowLeft, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileManagementProps {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
  onBack: () => void;
}

export default function ProfileManagement({ profile, onSave, onBack }: ProfileManagementProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [smokingStatus, setSmokingStatus] = useState(profile.smokingStatus);
  const [diabetesStatus, setDiabetesStatus] = useState(profile.diabetesStatus);
  const [physicalActivity, setPhysicalActivity] = useState(profile.physicalActivity);
  const [stressLevel, setStressLevel] = useState(profile.stressLevel);
  const [sleepQuality, setSleepQuality] = useState(profile.sleepQuality);
  const [onBpMedication, setOnBpMedication] = useState(profile.on_bp_medication || false);
  const [bpMedicationType, setBpMedicationType] = useState(profile.bp_medication_type || 'none');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...profile,
      fullName,
      age: Number(age),
      gender,
      height: Number(height),
      weight: Number(weight),
      smokingStatus,
      diabetesStatus,
      physicalActivity,
      stressLevel,
      sleepQuality,
      on_bp_medication: onBpMedication,
      bp_medication_type: bpMedicationType,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 group cursor-pointer transition-smooth"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Return to Patient Portal</span>
      </button>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xl leading-none">
        <div className="flex items-center space-x-3.5 border-b border-zinc-200 pb-5 mb-6 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <User className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-900">Cardiovascular Baseline Profile</h2>
            <p className="font-sans text-xs text-zinc-500 mt-1 font-semibold leading-normal">
              Adjust your biological and habit baseline descriptors; these values initialize new CVD risk scans automatically.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-150 px-4 py-3.5 text-xs text-emerald-700 font-bold leading-normal text-left">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
            <span>Success: Baseline cardiac biomarkers correctly updated! PostgreSQL schema synchronizations simulated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Demographic Grid */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3.5 text-left">1. Biographical Baselines</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Age (Years)</label>
                  <input
                    type="number"
                    min="18"
                    max="110"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Biological Sex</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-2.5 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Anthropometric attributes */}
          <div className="border-t border-zinc-200 pt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3.5 text-left">2. Anthropometrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Height (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Weight (kg)</label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  required
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
                />
              </div>
            </div>
            <div className="mt-3.5 text-right font-semibold">
              <span className="font-mono text-[10.5px] text-zinc-500">
                Calculated BMI Baseline: <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded ml-1.5 font-bold">{(weight / ((height / 100) * (height / 100))).toFixed(1)}</span>
              </span>
            </div>
          </div>

          {/* Behavioral Markers */}
          <div className="border-t border-zinc-200 pt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3.5 text-left">3. Behavioral Risk Markers</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Smoking Status</label>
                <select
                  value={smokingStatus}
                  onChange={(e) => setSmokingStatus(e.target.value as 'never' | 'former' | 'active')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-2.5 sm:px-3 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                >
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="active">Active Smoker</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Diabetes Status</label>
                <select
                  value={diabetesStatus}
                  onChange={(e) => setDiabetesStatus(e.target.value as 'none' | 'prediabetes' | 'type1' | 'type2')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-2.5 sm:px-3 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                >
                  <option value="none">No Diabetes</option>
                  <option value="prediabetes">Prediabetes</option>
                  <option value="type1">Type-1 Diabetes</option>
                  <option value="type2">Type-2 Diabetes</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Physical Exercise Rate</label>
                <select
                  value={physicalActivity}
                  onChange={(e) => setPhysicalActivity(e.target.value as 'none' | 'low' | 'moderate' | 'high')}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-2.5 sm:px-3 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                >
                  <option value="none">Sedentary (No regular exercise)</option>
                  <option value="low">Low (Occasional walks)</option>
                  <option value="moderate">Moderate (2-3 workout sessions/wk)</option>
                  <option value="high">High (4+ intensive workouts/wk)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Stress Exposure</label>
                  <select
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-1 py-3 text-xs font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Sleep Quality</label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as 'poor' | 'fair' | 'good' | 'excellent')}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-1 py-3 text-xs font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                  >
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Hypertension & Cardiovascular Therapeutics */}
          <div className="border-t border-zinc-200 pt-5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3.5 text-left">4. Cardiovascular Therapeutics</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Active BP Medication Status</label>
                <label className="flex items-center space-x-3 rounded-xl bg-zinc-50 p-3.5 border border-zinc-200 cursor-pointer hover:border-emerald-250 hover:bg-emerald-50/20 transition-smooth select-none">
                  <input 
                    type="checkbox" 
                    checked={onBpMedication}
                    onChange={e => setOnBpMedication(e.target.checked)}
                    className="rounded bg-white border-zinc-300 text-emerald-600 h-4.5 w-4.5 outline-none cursor-pointer" 
                  />
                  <span className="text-xs text-zinc-700 font-bold">Taking Blood Pressure medication</span>
                </label>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">BP Medication Class Type</label>
                <select 
                  value={bpMedicationType}
                  onChange={e => setBpMedicationType(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-2.5 sm:px-3 py-3 text-xs sm:text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth cursor-pointer"
                >
                  <option value="none">None / No active drugs</option>
                  <option value="beta-blockers">Beta-blockers (e.g. Metoprolol)</option>
                  <option value="ace-inhibitors">ACE Inhibitors (e.g. Lisinopril)</option>
                  <option value="calcium-channel-blockers">Calcium Channel Blockers (e.g. Amlodipine)</option>
                  <option value="diuretics">Thiazide Diuretics (e.g. Hydrochlorothiazide)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex border-t border-zinc-200 pt-6 select-none">
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-smooth active:scale-95 cursor-pointer ml-auto hover:shadow-emerald-500/10"
            >
              <Save className="h-4 w-4" />
              <span>Save Cardiac Baseline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
