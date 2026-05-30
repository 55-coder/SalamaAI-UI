/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Activity, LineChart, ShieldCheck, ArrowRight, BrainCircuit, HeartHandshake } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onClinicianDemo: () => void;
}

export default function LandingPage({ onStart, onClinicianDemo }: LandingPageProps) {
  return (
    <div className="bg-slate-50 text-zinc-900 min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center border-b border-zinc-200 pb-16">
            {/* Column 1 - Copy */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                <BrainCircuit className="h-3.5 w-3.5 animate-spin-slow text-emerald-600" />
                <span>Explainable AI in Clinical Practice</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                CVD Risk Prediction <br />
                <span className="text-emerald-600">Perfectly Explained.</span>
              </h1>
              <p className="font-sans text-base sm:text-lg text-zinc-650 leading-relaxed max-w-xl font-normal">
                Salama AI guides cardiovascular medicine forward. Securely project 10-year coronary disease hazards, demystify predictive decisions using mathematical SHAP waterfall graphs, and sync findings instantly to medical caregivers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={onStart}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-smooth group active:scale-95 cursor-pointer"
                >
                  <span>Evaluate My CVD Risk</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={onClinicianDemo}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-white border border-zinc-200 px-6 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-smooth cursor-pointer shadow-sm"
                >
                  <span>Enter Clinician Suite</span>
                </button>
              </div>
              <div className="flex items-center space-x-6 text-xs text-zinc-400 font-mono mt-8 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>PostgreSQL Sync</span>
                </div>
                <div>•</div>
                <div>XGBoost Risk Matrices</div>
                <div>•</div>
                <div>Gemini 3.5-Flash Core</div>
              </div>
            </div>

            {/* Column 2 - Interactive Mock preview */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl leading-none text-left">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 opacity-60 shadow-[0_0_15px_rgba(244,63,94,0.3)]"></div>
                
                <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <span className="font-display font-bold text-zinc-800 text-sm">CVD Vector Inference</span>
                  </div>
                  <span className="rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-[9px] font-bold text-rose-700 tracking-wider uppercase">
                    Stage 2 Alert
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="block font-sans text-xs text-zinc-400">Predicted CVD Risk</span>
                      <span className="font-display text-4xl font-extrabold text-zinc-900 tracking-tight">68%</span>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100/60 px-2.5 py-1 rounded-lg">High Risk Matrix</span>
                  </div>

                  {/* Mock SHAP Bar */}
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-[10px] text-zinc-400 font-semibold">
                      <span>Feature Shifting Indicators</span>
                      <span className="text-rose-600 font-bold">SHAP Impact (Pushes risk high)</span>
                    </div>
                    {/* BP Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-700 font-medium font-mono">
                        <span>Systolic BP (146 mmHg)</span>
                        <span className="text-rose-600 font-bold">+18%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-[78%] bg-rose-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Smoking Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-700 font-medium font-mono">
                        <span>Active Smoker</span>
                        <span className="text-rose-600 font-bold">+16%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-[65%] bg-rose-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Activity Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-700 font-medium font-mono">
                        <span>Physical Activity (None)</span>
                        <span className="text-amber-600 font-bold">+11%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-[45%] bg-amber-500 rounded-full"></div>
                      </div>
                    </div>
                    {/* Age Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] text-zinc-700 font-medium font-mono">
                        <span>Age Metric (58 yrs)</span>
                        <span className="text-rose-600 font-bold">+15%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div className="h-full w-[60%] bg-rose-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-zinc-500 italic leading-normal border-t border-zinc-150 pt-3">
                    "Patient metrics exhibit heavy synergistic macrovascular risk modifiers. Immediate tobacco counseling and hypertension triage is advised."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured workflow overview */}
      <section className="bg-zinc-100/50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900">
              The Salama Predictive Workflow
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-500 max-w-2xl mx-auto font-normal">
              How health metrics progress seamlessly from clinical logs to explainable medical indicators.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12 sm:mt-16 text-left">
            <div className="space-y-4 border border-zinc-200 bg-white p-6 rounded-2xl hover:border-zinc-300 shadow-sm transition-smooth">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/10">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-zinc-900">1. Medical telemetry</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-550 leading-normal font-normal">
                Patients easily declare clinical metrics including sleep parameters, cholesterol counts, average systolic/diastolic blood pressure, glucose registers, and BMI weight ratios.
              </p>
            </div>

            <div className="space-y-4 border border-zinc-200 bg-white p-6 rounded-2xl hover:border-zinc-300 shadow-sm transition-smooth">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white font-bold shadow-md shadow-purple-500/10">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-zinc-900">2. XGBoost & Gemini</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-550 leading-normal font-normal">
                The machine learning model projects precise 10-year probabilities, and translates raw statistical attributions using explainable AI values alongside clinical recommendations.
              </p>
            </div>

            <div className="space-y-4 border border-zinc-200 bg-white p-6 rounded-2xl hover:border-zinc-300 shadow-sm transition-smooth">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-md shadow-amber-500/10">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-zinc-900">3. Clinician Integration</h3>
              <p className="font-sans text-xs sm:text-sm text-zinc-550 leading-normal font-normal">
                Caregivers are instantly notified of high-risk outliers, allowing physicians to view detail cards, download full diagnostic portfolios, and adjust therapeutics.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
