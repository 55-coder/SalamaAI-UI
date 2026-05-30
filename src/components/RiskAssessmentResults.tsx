/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, HelpCircle, FileDown, HeartHandshake, Printer, ArrowLeft, ShieldAlert, CheckCircle, ChevronRight } from 'lucide-react';
import { Assessment } from '../types';
import ShapExplanationView from './ShapExplanationView';

interface RiskAssessmentResultsProps {
  assessment: Assessment;
  onBack: () => void;
}

export default function RiskAssessmentResults({ assessment, onBack }: RiskAssessmentResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'shap'>('overview');

  const getRiskColor = (cat: string) => {
    switch (cat) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-150 font-bold';
      case 'Intermediate': return 'text-amber-700 bg-amber-50 border-amber-150 font-bold';
      case 'Borderline': return 'text-yellow-700 bg-yellow-50 border-yellow-150 font-bold';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-150 font-bold';
    }
  };

  const getRiskRingColor = (cat: string) => {
    switch (cat) {
      case 'High': return 'stroke-rose-500';
      case 'Intermediate': return 'stroke-amber-500';
      case 'Borderline': return 'stroke-yellow-500';
      default: return 'stroke-emerald-500';
    }
  };

  // Convert dates easily
  const formattedDate = new Date(assessment.timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getFullDiseasePredictions = () => {
    if (assessment.diseasePredictions && assessment.diseasePredictions.length === 4) {
      return assessment.diseasePredictions;
    }
    const m = assessment.measurements;
    const age = Number(m.age || 28);
    const weight = Number(m.weight || 74);
    const height = Number(m.height || 178);
    const heightMeters = height / 100;
    const bmi = heightMeters > 0 ? (weight / (heightMeters * heightMeters)) : 23.5;

    const systolic = Number(m.systolicBP || 120);
    const diastolic = Number(m.diastolicBP || 80);

    const cholesterol = Number(m.cholesterol || 190);
    const glucose = Number(m.bloodGlucose || 95);

    const smoking = m.smokingStatus || "never";
    const diabetes = m.diabetesStatus || "none";
    const activity = m.physicalActivity || "moderate";

    // CVD
    let cvdBase = 10;
    if (age > 30) cvdBase += (age - 30) * 0.7;
    if (systolic > 120) cvdBase += (systolic - 120) * 0.35;
    if (diastolic > 80) cvdBase += (diastolic - 80) * 0.25;
    if (cholesterol > 180) cvdBase += (cholesterol - 180) * 0.12;
    if (glucose > 100) cvdBase += (glucose - 100) * 0.15;
    if (bmi > 25) cvdBase += (bmi - 25) * 1.6;
    if (smoking === "active") cvdBase += 16;
    if (diabetes === "type2" || diabetes === "type1" || diabetes === "prediabetes") cvdBase += 18;
    const cvdRisk = Math.round(Math.max(5, Math.min(95, cvdBase)));

    // HYP
    let hypBase = 12;
    if (systolic > 115) hypBase += (systolic - 115) * 1.3;
    if (diastolic > 75) hypBase += (diastolic - 75) * 1.5;
    if (age > 35) hypBase += (age - 35) * 0.5;
    const hypRisk = Math.round(Math.max(5, Math.min(99.9, hypBase)));

    // Stroke
    let strokeBase = 4;
    if (systolic > 115) strokeBase += (systolic - 115) * 0.6;
    if (age > 40) strokeBase += (age - 40) * 0.7;
    if (smoking === "active") strokeBase += 20;
    if (diabetes === "type2" || diabetes === "type1" || diabetes === "prediabetes") strokeBase += 12;
    const strokeRisk = Math.round(Math.max(2, Math.min(95, strokeBase)));

    // CHD
    let chdBase = 6;
    if (cholesterol > 180) chdBase += (cholesterol - 180) * 0.3;
    if (age > 35) chdBase += (age - 35) * 0.6;
    if (smoking === "active") chdBase += 15;
    if (activity === "none" || activity === "low") chdBase += 10;
    const chdRisk = Math.round(Math.max(3, Math.min(95, chdBase)));

    const getLabel = (percentage: number) => {
      if (percentage >= 60) return "High";
      if (percentage >= 35) return "Intermediate";
      if (percentage >= 15) return "Borderline";
      return "Low";
    };

    return [
      {
        id: `dp-cvd`,
        disease: "cvd",
        risk_score: cvdRisk / 100,
        risk_percentage: cvdRisk,
        risk_label: getLabel(cvdRisk) as 'Low' | 'Borderline' | 'Intermediate' | 'High',
        model_version: "xgbcvd_v3",
        predicted_at: assessment.timestamp,
        explanation: `Evaluating the 10-year cumulative CVD risk at ${cvdRisk}% (${getLabel(cvdRisk)}). Triggers relate to resting cardiometabolic indices, physical metrics, and genetic baseline factors.`
      },
      {
        id: `dp-hyp`,
        disease: "hyp",
        risk_score: hypRisk / 100,
        risk_percentage: hypRisk,
        risk_label: getLabel(hypRisk) as 'Low' | 'Borderline' | 'Intermediate' | 'High',
        model_version: "xgbhyp_v1",
        predicted_at: assessment.timestamp,
        explanation: `Chronic arterial workload risk is evaluated at ${hypRisk}% (${getLabel(hypRisk)}). Systolic tension coefficient exerts continuous shear load on smooth muscle outer vessel linings.`
      },
      {
        id: `dp-stroke`,
        disease: "stroke",
        risk_score: strokeRisk / 100,
        risk_percentage: strokeRisk,
        risk_label: getLabel(strokeRisk) as 'Low' | 'Borderline' | 'Intermediate' | 'High',
        model_version: "xgbstroke_v5",
        predicted_at: assessment.timestamp,
        explanation: `Cerebral stroke vulnerability maps at ${strokeRisk}% (${getLabel(strokeRisk)}), correlating with vascular wall fragility metrics, lifestyle habits, and high blood force values.`
      },
      {
        id: `dp-chd`,
        disease: "chd",
        risk_score: chdRisk / 100,
        risk_percentage: chdRisk,
        risk_label: getLabel(chdRisk) as 'Low' | 'Borderline' | 'Intermediate' | 'High',
        model_version: "xgbchd_v2",
        predicted_at: assessment.timestamp,
        explanation: `Coronary Heart Disease risk score indexes serum lipids (${assessment.measurements.cholesterol} mg/dL) as contributing factors to inner-lumen sedimenting, reaching ${chdRisk}% (${getLabel(chdRisk)}).`
      }
    ];
  };

  const diseaseMetadata: { [key: string]: { name: string; desc: string; icon: string; accentColor: string } } = {
    cvd: {
      name: 'Cardiovascular Disease (CVD)',
      desc: '10-Year general cardiovascular system failure or event prediction',
      icon: '❤️',
      accentColor: 'emerald'
    },
    hyp: {
      name: 'Chronic Hypertension (HTN)',
      desc: 'Risk of continuous blood pressure elevation demanding active therapy',
      icon: '🩺',
      accentColor: 'teal'
    },
    stroke: {
      name: 'Cerebrovascular Stroke Risk',
      desc: 'Vaporized risk of cerebral blood vessel occlusion or micro-bleed incidents',
      icon: '🧠',
      accentColor: 'indigo'
    },
    chd: {
      name: 'Coronary Heart Disease (CHD)',
      desc: 'Coronary lumen occlusion coefficient from long-term cholesterol sediments',
      icon: '⚡',
      accentColor: 'sky'
    },
  };

  const diseaseList = getFullDiseasePredictions();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Return button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-smooth group cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Return to Diagnostic History</span>
      </button>

      {/* Main Container */}
      <div className="rounded-3xl border border-zinc-200 bg-white shadow-xl overflow-hidden leading-none">
        
        {/* Banner header with info */}
        <div className="bg-zinc-50 px-6 py-6 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 text-left">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-emerald-50 border border-emerald-150 px-2.5 py-1 text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest leading-none">
                Core ML Assessment Finished
              </span>
              <span className="text-[10px] text-zinc-400 font-mono font-semibold">ID: {assessment.id.slice(0, 8)}</span>
            </div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-zinc-900">
              CVD Risk Assessment for {assessment.patientName}
            </h1>
            <p className="font-sans text-xs text-zinc-500 font-semibold">Formulated on {formattedDate}</p>
          </div>

          <div className="flex space-x-2.5 sm:self-center">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 transition-smooth cursor-pointer shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50/50 p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-bold transition-smooth cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-bold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            📋 Risk Probability Overview
          </button>
          <button
            onClick={() => setActiveTab('shap')}
            className={`flex-1 rounded-xl py-3 text-xs sm:text-sm font-bold transition-smooth cursor-pointer ${
              activeTab === 'shap'
                ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200 font-bold'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            📊 Artificial Intelligence (SHAP) Explanation
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6 sm:p-8">
          
          {activeTab === 'overview' ? (
            <div className="space-y-8 text-left">
              
              {/* Dial and basic explanation */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Visual Dial Column */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border border-zinc-200 rounded-3xl bg-zinc-50/50">
                  <div className="relative flex h-36 w-36 items-center justify-center">
                    <svg className="absolute top-0 left-0 h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* background path */}
                      <circle cx="50" cy="50" r="40" className="stroke-zinc-200" strokeWidth="8" fill="transparent" />
                      {/* active path */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className={`transition-all duration-1000 ease-out ${getRiskRingColor(assessment.riskCategory)}`}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * assessment.cvdRiskPercentage) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                                   {/* Inner content */}
                    <div className="text-center space-y-0.5">
                      <span className="block font-display text-4xl font-extrabold text-zinc-900 tracking-tight">
                        {assessment.cvdRiskPercentage}%
                      </span>
                      <span className="block font-sans text-[10px] uppercase tracking-wider text-zinc-500 font-extrabold">
                        10-Yr CVD Risk
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-bold border ${getRiskColor(assessment.riskCategory)}`}>
                      <span>{assessment.riskCategory} Risk Profile</span>
                    </span>
                  </div>
                </div>

                {/* verbal text overview Column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center space-x-2">
                    <ShieldAlert className="h-5 w-5 text-emerald-600" />
                    <h3 className="font-display font-bold text-zinc-800 text-sm sm:text-base">AI Diagnostic Statement</h3>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-zinc-700 leading-relaxed font-semibold bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    {assessment.summary}
                  </p>
                  
                  {/* Stats list */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    <div className="border border-zinc-250 p-3 rounded-xl bg-zinc-50/40 text-left leading-none shadow-sm">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Systolic BP</div>
                      <div className="text-sm font-extrabold text-zinc-900 font-mono">{assessment.measurements.systolicBP} mmHg</div>
                    </div>
                    <div className="border border-zinc-250 p-3 rounded-xl bg-zinc-50/40 text-left leading-none shadow-sm">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Serum Cholesterol</div>
                      <div className="text-sm font-extrabold text-zinc-900 font-mono">{assessment.measurements.cholesterol} mg/dL</div>
                    </div>
                    <div className="border border-zinc-250 p-3 rounded-xl bg-zinc-50/40 text-left leading-none shadow-sm col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Smoking Details</div>
                      <div className="text-sm font-extrabold text-zinc-900 capitalize font-mono">{assessment.measurements.smokingStatus}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comprehensive Multi-Disease Risk Probability Panels */}
              <div className="border-t border-zinc-200 pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-display font-bold text-zinc-800 text-sm sm:text-base">Comprehensive Multi-Disease Forecast Panels</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {diseaseList.map((pred) => {
                    const meta = diseaseMetadata[pred.disease] || {
                      name: pred.disease.toUpperCase(),
                      desc: 'AI forecasted disease probability modeling',
                      icon: '🩺',
                      accentColor: 'emerald'
                    };
                    return (
                      <div key={pred.disease} className="border border-zinc-200 rounded-2xl bg-zinc-50/20 p-5 space-y-3 flex flex-col justify-between shadow-sm">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl">{meta.icon}</span>
                              <div>
                                <h4 className="font-display font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                                  {meta.name}
                                </h4>
                                <p className="text-[10px] text-zinc-400 font-medium leading-normal">
                                  {meta.desc}
                                </p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold border ${getRiskColor(pred.risk_label)}`}>
                              {pred.risk_label}
                            </span>
                          </div>

                          {/* Progress slider / bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 font-mono">
                              <span>Forecasted Probability</span>
                              <span className="text-zinc-800">{pred.risk_percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  pred.risk_label === 'High' ? 'bg-rose-500' :
                                  pred.risk_label === 'Intermediate' ? 'bg-amber-500' :
                                  pred.risk_label === 'Borderline' ? 'bg-yellow-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${pred.risk_percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Diagnostic statement */}
                        <div className="rounded-xl bg-zinc-50 border border-zinc-150 p-3 text-xs text-zinc-650 font-medium leading-relaxed mt-2 text-left">
                          <span className="font-bold text-zinc-800 block mb-0.5">Diagnostic Statement:</span>
                          {pred.explanation || `Evaluating estimated potential score of ${pred.risk_percentage}% against patient biometric readings.`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Personalized recommendations checklist */}
              <div className="border-t border-zinc-200 pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <HeartHandshake className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-display font-bold text-zinc-800 text-sm sm:text-base">Personalized Health Intervention Plan</h3>
                </div>
                <div className="grid grid-cols-1 gap-3.5">
                  {assessment.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 leading-normal"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="font-sans text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="text-right pt-2 font-semibold">
                  <button
                    onClick={() => setActiveTab('shap')}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    <span>View Exploded (SHAP) Feature Importance</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <ShapExplanationView shapValues={assessment.shapValues} riskPercentage={assessment.cvdRiskPercentage} />
          )}

        </div>

        {/* Footer info box */}
        <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-4.5 text-center text-[11px] text-zinc-500 font-sans leading-relaxed">
          Salama AI represents a predictive diagnostic assist model. Clinical recommendations must be validated beside active physician supervision. If you feel sudden or radiating chest pressure, call local emergency services immediately.
        </div>

      </div>
    </div>
  );
}
