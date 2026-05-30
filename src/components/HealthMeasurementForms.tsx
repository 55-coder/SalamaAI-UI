/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, Sliders, Check, ArrowRight, HeartHandshake, Loader2 } from 'lucide-react';
import { UserProfile, HealthMeasurements } from '../types';

interface HealthMeasurementFormsProps {
  profile: UserProfile;
  onSubmit: (measurements: HealthMeasurements) => void;
  isSubmitting: boolean;
}

export default function HealthMeasurementForms({ profile, onSubmit, isSubmitting }: HealthMeasurementFormsProps) {
  // Pull default values from active user profile parameters!
  const [age, setAge] = useState(profile.age);
  const [height, setHeight] = useState(profile.height);
  const [weight, setWeight] = useState(profile.weight);
  const [smokingStatus, setSmokingStatus] = useState(profile.smokingStatus);
  const [diabetesStatus, setDiabetesStatus] = useState(profile.diabetesStatus);
  const [physicalActivity, setPhysicalActivity] = useState(profile.physicalActivity);
  const [stressLevel, setStressLevel] = useState(profile.stressLevel);
  const [sleepQuality, setSleepQuality] = useState(profile.sleepQuality);

  // Core biometric inputs
  const [systolicBP, setSystolicBP] = useState(128);
  const [diastolicBP, setDiastolicBP] = useState(82);
  const [heartRate, setHeartRate] = useState(72);
  const [cholesterol, setCholesterol] = useState(195);
  const [bloodGlucose, setBloodGlucose] = useState(95);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      smokingStatus,
      diabetesStatus,
      physicalActivity,
      stressLevel,
      sleepQuality,
      systolicBP: Number(systolicBP),
      diastolicBP: Number(diastolicBP),
      heartRate: Number(heartRate),
      cholesterol: Number(cholesterol),
      bloodGlucose: Number(bloodGlucose),
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl leading-none">
        
        {/* Header */}
        <div className="flex items-center space-x-3.5 border-b border-zinc-200 pb-5 mb-8 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="rounded-full bg-emerald-50 border border-emerald-150 px-2.5 py-1 text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest leading-none">
              New Evaluation Session
            </span>
            <h2 className="font-display text-xl font-extrabold text-zinc-900 mt-1.5">Launch New Cardiovascular Scan</h2>
            <p className="font-sans text-xs text-zinc-500 mt-1 font-semibold leading-normal">
              Enter current physiological telemetry parameters. Results are processed instantly through our diagnostic intelligence engine.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main measurements grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Blood Pressure (Systolic) */}
            <div className="space-y-2 border border-zinc-200 p-4.5 rounded-2xl bg-zinc-50/40 text-left hover:border-zinc-300 transition-smooth">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Systolic BP (mmHg)</label>
                <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">Ref: 120</span>
              </div>
              <input
                type="number"
                min="70"
                max="240"
                required
                value={systolicBP}
                onChange={(e) => setSystolicBP(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
              <div className="text-[10px] text-zinc-500 font-semibold leading-normal">Arterial pressure during contraction (ideal is below 120).</div>
            </div>

            {/* Blood Pressure (Diastolic) */}
            <div className="space-y-2 border border-zinc-200 p-4.5 rounded-2xl bg-zinc-50/40 text-left hover:border-zinc-300 transition-smooth">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Diastolic BP (mmHg)</label>
                <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">Ref: 80</span>
              </div>
              <input
                type="number"
                min="40"
                max="150"
                required
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
              <div className="text-[10px] text-zinc-500 font-semibold leading-normal">Arterial pressure during relaxation (ideal is below 80).</div>
            </div>

            {/* Cholesterol */}
            <div className="space-y-2 border border-zinc-200 p-4.5 rounded-2xl bg-zinc-50/40 text-left hover:border-zinc-300 transition-smooth">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Serum Cholesterol (mg/dL)</label>
                <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">Ref: &lt;200</span>
              </div>
              <input
                type="number"
                min="100"
                max="450"
                required
                value={cholesterol}
                onChange={(e) => setCholesterol(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
              <div className="text-[10px] text-zinc-500 font-semibold leading-normal">Total systemic lipid loading (elevated if above 200).</div>
            </div>

            {/* Fasting Glucose */}
            <div className="space-y-2 border border-zinc-200 p-4.5 rounded-2xl bg-zinc-50/40 text-left hover:border-zinc-300 transition-smooth">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Fast Serum Glucose (mg/dL)</label>
                <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">Ref: &lt;100</span>
              </div>
              <input
                type="number"
                min="50"
                max="400"
                required
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
              <div className="text-[10px] text-zinc-500 font-semibold leading-normal">Fasting glucose concentration (prediabetic reads above 100).</div>
            </div>

            {/* Resting Heart Rate */}
            <div className="space-y-2 border border-zinc-200 p-4.5 rounded-2xl bg-zinc-50/40 text-left hover:border-zinc-300 transition-smooth">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Resting Heart Rate (BPM)</label>
                <span className="font-mono text-[9px] text-zinc-400 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">Range: 60-90</span>
              </div>
              <input
                type="number"
                min="40"
                max="180"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-3 text-sm font-semibold text-zinc-800 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 transition-smooth"
              />
              <div className="text-[10px] text-zinc-500 font-semibold leading-normal">Pacemaker contractions per minute under rested baseline.</div>
            </div>

            {/* Demographics / Attributes Prefilled check */}
            <div className="space-y-2 border border-emerald-100 p-4.5 rounded-2xl bg-emerald-50/40 text-left flex flex-col justify-between">
              <div>
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 mb-2">Baseline Settings Connected</span>
                <p className="text-[10px] text-zinc-550 leading-relaxed font-semibold">
                  Your profile's biological variables represent the following preset configurations:
                </p>
                <div className="mt-2.5 text-[10px] font-mono space-y-1 text-zinc-650 leading-none font-bold">
                  <div>• Age: <strong className="text-zinc-900">{age} years</strong></div>
                  <div>• Height & Weight: <strong className="text-zinc-900">{height}cm, {weight}kg</strong></div>
                  <div>• Smoking status: <strong className="text-zinc-900 capitalize">{smokingStatus}</strong></div>
                  <div>• Diabetes status: <strong className="text-zinc-900 capitalize">{diabetesStatus}</strong></div>
                </div>
              </div>
              <div className="text-[9px] font-extrabold text-emerald-700 flex items-center space-x-1 mt-2.5">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>Adjust in baseline parameters tab if needed.</span>
              </div>
            </div>

          </div>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-zinc-200 pt-6 gap-4">
            <div className="text-[10px] text-zinc-500 font-sans max-w-md text-left flex items-start space-x-2 leading-normal">
              <HeartHandshake className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">
                By requesting the scan, parameters are routed through AI predictors and explanations formulated. Never substitute computer assistance for emergency symptoms.
              </span>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-6 py-4 text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 transition-smooth disabled:opacity-50 active:scale-95 cursor-pointer sm:ml-auto min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Processing AI Predictions...</span>
                </>
              ) : (
                <>
                  <span>Submit CVD Scan Request</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
