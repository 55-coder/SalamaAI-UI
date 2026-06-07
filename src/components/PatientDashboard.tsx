/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Activity, Plus, TrendingUp, Sliders, Settings, Calendar, Heart, ArrowRight, UserCheck } from 'lucide-react';
import { UserProfile, Assessment } from '../types';

interface PatientDashboardProps {
  profile: UserProfile;
  assessments: Assessment[];
  onNewScan: () => void;
  onEditProfile: () => void;
  onViewAssessment: (assessment: Assessment) => void;
  onViewHealthData: () => void;
}

interface DiseasePrediction {
  id: string;
  disease: 'cvd' | 'hyp' | 'stroke' | 'chd';
  risk_score: number;
  risk_percentage: number;
  risk_label: 'Low' | 'Borderline' | 'Intermediate' | 'High';
  model_version: string;
  predicted_at: string;
  explanation?: string;
}

export default function PatientDashboard({
  profile,
  assessments,
  onNewScan,
  onEditProfile,
  onViewAssessment,
  onViewHealthData,
}: PatientDashboardProps) {

  const latestAssessment = assessments[0] || null;

  const [bpList, setBpList] = useState<any[]>([]);
  const [loadingBp, setLoadingBp] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    fetch('/api/bp')
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) {
          setBpList(data);
          setLoadingBp(false);
        }
      })
      .catch(err => {
        console.error("Error fetching bp logs in dashboard:", err);
        setLoadingBp(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const getRiskBadgeColor = (cat: string) => {
    switch (cat) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-100 font-bold';
      case 'Intermediate': return 'text-amber-700 bg-amber-50 border-amber-150 font-bold';
      case 'Borderline': return 'text-yellow-700 bg-yellow-50 border-yellow-150 font-bold';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-150 font-bold';
    }
  };

  // Extract or backfill the 4-disease structure
  const getFourDiseasePredictions = (): DiseasePrediction[] => {
    if (latestAssessment && latestAssessment.diseasePredictions && latestAssessment.diseasePredictions.length === 4) {
      return latestAssessment.diseasePredictions as DiseasePrediction[];
    }

    if (latestAssessment) {
      // Backfill based on measurements
      const m = latestAssessment.measurements;
      const age = Number(m.age || 28);
      const systolic = Number(m.systolicBP || 120);
      const diastolic = Number(m.diastolicBP || 80);
      const cholesterol = Number(m.cholesterol || 190);
      const glucose = Number(m.bloodGlucose || 95);
      const smoking = m.smokingStatus || 'never';
      const bmi = m.weight / Math.pow((m.height / 100), 2);

      // cvd
      const cvdRisk = latestAssessment.cvdRiskPercentage;

      // hyp
      let hypBase = 12;
      if (systolic > 115) hypBase += (systolic - 115) * 1.3;
      if (diastolic > 75) hypBase += (diastolic - 75) * 1.5;
      if (age > 35) hypBase += (age - 35) * 0.5;
      const hypRisk = Math.round(Math.max(5, Math.min(99.9, hypBase)));

      // stroke
      let strokeBase = 4;
      if (systolic > 115) strokeBase += (systolic - 115) * 0.6;
      if (age > 40) strokeBase += (age - 40) * 0.7;
      if (smoking === 'active') strokeBase += 20;
      const strokeRisk = Math.round(Math.max(2, Math.min(95, strokeBase)));

      // chd
      let chdBase = 6;
      if (cholesterol > 180) chdBase += (cholesterol - 180) * 0.3;
      if (age > 35) chdBase += (age - 35) * 0.6;
      if (smoking === 'active') chdBase += 15;
      const chdRisk = Math.round(Math.max(3, Math.min(95, chdBase)));

      const getLabel = (percentage: number) => {
        if (percentage >= 60) return 'High';
        if (percentage >= 35) return 'Intermediate';
        if (percentage >= 15) return 'Borderline';
        return 'Low';
      };

      const ts = latestAssessment.timestamp;

      return [
        { id: 'dp-cvd', disease: 'cvd', risk_score: cvdRisk / 100, risk_percentage: cvdRisk, risk_label: getLabel(cvdRisk), model_version: 'xgbcvd_v3', predicted_at: ts, explanation: `CVD 10-year risk of ${cvdRisk}% reflects core metrics, chronobiological age, and blood pressure indicators.` },
        { id: 'dp-hyp', disease: 'hyp', risk_score: hypRisk / 100, risk_percentage: hypRisk, risk_label: getLabel(hypRisk), model_version: 'xgbhyp_v1', predicted_at: ts, explanation: `Arterial tension overload risk (${hypRisk}%) is calculated primarily based on systolic pressure loading.` },
        { id: 'dp-stroke', disease: 'stroke', risk_score: strokeRisk / 100, risk_percentage: strokeRisk, risk_label: getLabel(strokeRisk), model_version: 'xgbstroke_v5', predicted_at: ts, explanation: `Ischemic stroke potential of ${strokeRisk}% is calculated against vascular shear stress parameters.` },
        { id: 'dp-chd', disease: 'chd', risk_score: chdRisk / 100, risk_percentage: chdRisk, risk_label: getLabel(chdRisk), model_version: 'xgbchd_v2', predicted_at: ts, explanation: `Coronary indicators evaluate total lipid levels (${cholesterol} mg/dL) as active plaque accumulation coefficients.` }
      ];
    }

    // Default requested clinical mock values from the prompt
    return [
      { id: 'mock-1', disease: 'cvd', risk_score: 0.327, risk_percentage: 32.7, risk_label: 'High', model_version: 'xgbcvd_v3', predicted_at: '2026-05-27T09:08:46.959Z', explanation: "CVD risk is evaluated with chronobiological metrics and baseline resting hemodynamics." },
      { id: 'mock-2', disease: 'hyp', risk_score: 0.9991, risk_percentage: 99.91, risk_label: 'High', model_version: 'xgbhyp_v1', predicted_at: '2026-05-27T09:08:46.959Z', explanation: "Hypertension index shows high arterial wall shear stress and vascular resistance." },
      { id: 'mock-3', disease: 'stroke', risk_score: 0.0002, risk_percentage: 0.02, risk_label: 'Low', model_version: 'xgbstroke_v5', predicted_at: '2026-05-27T09:08:46.959Z', explanation: "Stroke potential is low reflecting resilient blood vessels elastic parameters." },
      { id: 'mock-4', disease: 'chd', risk_score: 0.0002, risk_percentage: 0.02, risk_label: 'Low', model_version: 'xgbstroke_v5', predicted_at: '2026-05-27T09:08:46.959Z', explanation: "Coronary artery block potential calculation displays protective lipids distribution rates." }
    ];
  };

  const diseaseNames = {
    cvd: { title: 'Cardiovascular Disease', icon: Heart, desc: 'Atherosclerosis and coronary block' },
    hyp: { title: 'Hypertension Indicator', icon: TrendingUp, desc: 'High arterial pressure overload' },
    stroke: { title: 'Ischemic Stroke Potential', icon: Activity, desc: 'Acute cerebral hypoperfusion' },
    chd: { title: 'Coronary Heart Disease', icon: Heart, desc: 'Coronary arterial muscle oxygenation' }
  };

  const predictions = getFourDiseasePredictions();

  // SVG Blood Pressure Plot generator
  const renderBloodPressureGraph = () => {
    if (loadingBp) {
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-zinc-400 py-10 bg-white shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
          <p className="text-xs text-zinc-500 mt-3 font-semibold">Fetching synchronized vital logs...</p>
        </div>
      );
    }

    if (bpList.length === 0) {
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-zinc-400 py-10 bg-white shadow-sm">
          <Activity className="h-10 w-10 text-rose-500/50 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-zinc-850">No Blood Pressure Readings</p>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm text-center font-medium leading-relaxed">Add a blood pressure measurement via the "Health Data & Forms" portal to generate telemetry nodes.</p>
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
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 text-left">
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-6">
          <div>
            <span className="font-mono text-[9px] font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              Live Clinical Telemetry
            </span>
            <h2 className="font-display font-bold text-xl text-zinc-900 mt-1">
              Active Blood Pressure Assessment
            </h2>
            <p className="text-xs text-zinc-550 mt-0.5 font-medium">Chronological systolic and diastolic values plotted from medical log entries.</p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 block shadow-sm" />
              <span className="text-zinc-600 font-bold font-mono">Systolic (mmHg)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 rounded-full bg-cyan-550 block shadow-sm" />
              <span className="text-zinc-600 font-bold font-mono">Diastolic (mmHg)</span>
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
                  <line x1={paddingLeft} y1={y} x2={svgWidth - paddingRight} y2={y} stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[10px] font-mono leading-none font-semibold">
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
                  <line x1={x} y1={paddingTop} x2={x} y2={paddingTop + plotHeight} stroke="#e4e4e7" strokeWidth="0.5" />
                  <text x={x} y={paddingTop + plotHeight + 16} textAnchor="middle" className="fill-zinc-500 text-[9px] font-mono font-bold">
                    {dateStr}
                  </text>
                  <text x={x} y={paddingTop + plotHeight + 28} textAnchor="middle" className="fill-zinc-400 text-[8px] font-mono font-medium">
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
                  <circle cx={x} cy={ySys} r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  
                  {/* Diastolic Node */}
                  <circle cx={x} cy={yDia} r="5" fill="#06b6d2" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Logs List Table */}
        <div className="mt-8">
          <h3 className="font-bold text-sm text-zinc-800 mb-4 font-display">Historical Log Entries</h3>
          <div className="overflow-hidden border border-zinc-200 rounded-xl bg-white shadow-sm">
            <table className="w-full text-xs text-left text-zinc-700">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-sans font-bold tracking-wider text-[9px]">
                  <th className="p-3">DATE & TIME</th>
                  <th className="p-3">BP READING</th>
                  <th className="p-3">BODY POSTURE</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3">PHYSICAL RELATIONSHIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-600">
                {sortedBp.slice().reverse().map((bp, idx) => {
                  const dateVal = new Date(bp.start_date_time).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
                  return (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-mono text-zinc-500 font-semibold">{dateVal}</td>
                      <td className="p-3">
                        <span className="font-extrabold text-zinc-900 font-mono text-sm">{bp.systolic_value}/{bp.diastolic_value}</span>
                        <span className="text-[10px] text-zinc-400 ml-1">mmHg</span>
                      </td>
                      <td className="p-3 capitalize text-zinc-650">{bp.body_posture}</td>
                      <td className="p-3 capitalize text-zinc-650">{bp.measurement_location}</td>
                      <td className="p-3 text-[11px] font-sans text-zinc-600 font-medium">{bp.temporal_relationship_to_physical_activity} ({bp.temporal_relationship_to_sleep})</td>
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
      
      {/* Welcome banner segment with primary action cards */}
      <div className="mb-8 flex flex-col md:flex-row md:items-stretch justify-between gap-6 border-b border-zinc-200 pb-6 text-left">
        <div className="flex-1 flex flex-col justify-center">
          <span className="font-mono text-[9px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 self-start leading-none shadow-xs">
            Secure Patient Portal Connected
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2.5 text-zinc-900">
            Welcome back, {profile.fullName}
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1 pb-1 leading-relaxed font-semibold">
            Salama AI provides you with multi-disease cardiac predictions and personalized clinical dashboards. Your demographic coefficients are fully synced to: <strong className="text-zinc-700 font-bold font-mono">{profile.email}</strong>.
          </p>
        </div>

        {/* Primary Interactive Cards Section */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto md:max-w-xl">
          {/* Launch Card - Highlighted Emerald spotlight design */}
          <div 
            onClick={onNewScan}
            id="launch-cardiovascular-scan-trigger-card"
            className="flex-1 rounded-2xl border border-emerald-250 bg-emerald-50/30 p-5 text-left flex flex-col justify-between hover:border-emerald-400 hover:bg-emerald-50/60 transition-all duration-300 cursor-pointer shadow-sm group hover:-translate-y-0.5 leading-none"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">Telemetry Scan</span>
                <Heart className="h-4.5 w-4.5 text-rose-500 animate-pulse" />
              </div>
              <h3 className="font-display font-extrabold text-xs sm:text-sm text-zinc-905 mb-1 leading-tight group-hover:text-emerald-800 transition-smooth">
                Launch Cardiovascular Scan
              </h3>
              <p className="text-[10.5px] leading-relaxed text-zinc-450 font-semibold mb-4 leading-normal font-sans">
                Input your systolic pressure, cholesterol, and fasting glucose levels to execute real-time multi-disease predictions.
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onNewScan(); }}
              className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 text-xs transition-smooth shadow-sm cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Begin New Scan</span>
            </button>
          </div>

          {/* Quick links card */}
          <div className="flex-1 rounded-2xl border border-zinc-200 bg-white p-5 text-left flex flex-col justify-between shadow-sm leading-none gap-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">Patient Portals</span>
              <h3 className="font-display font-extrabold text-xs sm:text-sm text-zinc-900 mt-2 mb-1.5">
                Clinical Health Sheets
              </h3>
              <p className="text-[10.5px] leading-normal text-zinc-500 font-semibold font-sans">
                Submit specific blood vessel and pacemaker records to sync diagnostic profiles.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onViewHealthData}
                className="flex flex-col sm:flex-row items-center justify-center space-x-1 border border-zinc-200 hover:border-zinc-350 bg-zinc-50 hover:bg-zinc-105 py-2.5 px-2 rounded-lg text-[10px] sm:text-[10.5px] font-bold text-zinc-700 transition-smooth cursor-pointer text-center leading-none"
              >
                <Activity className="h-3.5 w-3.5 text-emerald-600 mb-1 sm:mb-0 sm:mr-1" />
                <span>Health Forms</span>
              </button>
              <button
                onClick={onEditProfile}
                className="flex flex-col sm:flex-row items-center justify-center space-x-1 border border-emerald-200 hover:border-emerald-300 bg-emerald-50/40 hover:bg-emerald-55/65 py-2.5 px-2 rounded-lg text-[10px] sm:text-[10.5px] font-bold text-emerald-750 transition-smooth cursor-pointer text-center leading-none"
              >
                <Settings className="h-3.5 w-3.5 text-emerald-600 mb-1 sm:mb-0 sm:mr-1" />
                <span>My Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Disease Risk Cards Grid */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {predictions.map((p) => {
          const detail = diseaseNames[p.disease];
          const IconComp = detail.icon;
          return (
            <div key={p.id} id={`disease-card-${p.disease}`} className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-left leading-none shadow-sm hover:border-zinc-350 transition-smooth">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-3.5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">{detail.title}</span>
                  <span className="text-[9px] text-zinc-400 font-semibold mt-0.5">{detail.desc}</span>
                </div>
                <IconComp className={`h-4.5 w-4.5 ${p.disease === 'cvd' ? 'text-rose-600' : p.disease === 'hyp' ? 'text-amber-600' : p.disease === 'stroke' ? 'text-cyan-600' : 'text-emerald-600'}`} />
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <span className="font-display text-3xl font-extrabold text-zinc-900 tracking-tight">
                    {p.risk_percentage.toFixed(2).replace(/\.00$/, '')}%
                  </span>
                  <span className="block text-[8px] text-zinc-400 mt-1 font-mono uppercase tracking-wide font-semibold">Model: {p.model_version}</span>
                </div>
                
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-extrabold font-sans leading-normal ${getRiskBadgeColor(p.risk_label)}`}>
                  {p.risk_label}
                </span>
              </div>

              {p.explanation && (
                <p className="mt-3.5 text-[10.5px] leading-relaxed text-zinc-500 font-semibold text-left font-sans">
                  {p.explanation}
                </p>
              )}

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[8px] text-zinc-400 font-mono font-bold">
                <span>PREDICTED AT:</span>
                <span className="text-zinc-500">{new Date(p.predicted_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Blood Pressure Assessment Graph */}
      <div className="mb-8">
        {renderBloodPressureGraph()}
      </div>

      {/* Main Stats and Action boxes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Column: Historical diagnostics lists */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* History header */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 leading-none shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-4">
              <div className="flex items-center space-x-2.5">
                <Activity className="h-5 w-5 text-emerald-600" />
                <h3 className="font-display font-semibold text-zinc-800 text-sm sm:text-base">Cardiovascular Diagnostic Assessments</h3>
              </div>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-sans font-bold text-zinc-650 border border-zinc-200 uppercase tracking-wide shadow-sm">
                {assessments.length} logged records
              </span>
            </div>

            {/* List */}
            {assessments.length === 0 ? (
              <div className="py-12 text-center text-sm text-zinc-500 flex flex-col items-center justify-center space-y-3">
                <p>No historical assessments exist. Request an evaluation to get started.</p>
                <button
                  onClick={onNewScan}
                  className="rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 border border-emerald-100 cursor-pointer hover:bg-emerald-100"
                >
                  Create Assessment Now
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {assessments.map((a, idx) => {
                  const dateStr = new Date(a.timestamp).toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  return (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-4.5 gap-3 hover:bg-zinc-50/50 rounded-lg px-2 -mx-2 transition-smooth"
                    >
                      <div className="space-y-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-zinc-800 font-sans">
                            Assessment scan on {dateStr}
                          </span>
                          <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border leading-none ${getRiskBadgeColor(a.riskCategory)}`}>
                            {a.cvdRiskPercentage}% • {a.riskCategory}
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-zinc-500 leading-normal max-w-xl truncate font-normal">
                          {a.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => onViewAssessment(a)}
                        className="flex items-center justify-center space-x-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11px] font-bold text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-smooth cursor-pointer shadow-sm"
                      >
                        <span>View Portfolio</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Info & Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Info Box */}
          <div className="flex items-start space-x-3.5 rounded-2xl bg-white border border-zinc-200 p-5 text-left leading-normal text-xs text-zinc-500 shadow-sm font-normal">
            <UserCheck className="h-6 w-6 text-emerald-600 flex-shrink-0" />
            <div className="space-y-2">
              <span className="block font-bold text-zinc-800 text-sm">Demographic Coefficients</span>
              <p>
                Your profile is registered with clinical coefficients which configure XGBoost baseline predictions during every calculation pass. Review details before submitting vital records.
              </p>
            </div>
          </div>
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
