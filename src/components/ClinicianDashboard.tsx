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

  const getRiskBadgeColor = (cat: string) => {
    switch (cat) {
      case 'High': return 'text-rose-700 bg-rose-50 border-rose-150 font-bold';
      case 'Intermediate': return 'text-amber-700 bg-amber-50 border-amber-150 font-bold';
      case 'Borderline': return 'text-yellow-700 bg-yellow-50 border-yellow-150 font-bold';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-150 font-bold';
    }
  };

  // Use API-provided diseasePredictions if available; otherwise return empty list
  const getFourDiseasePredictions = (assessment: Assessment): any[] => {
    if (assessment.diseasePredictions && assessment.diseasePredictions.length > 0) {
      return assessment.diseasePredictions;
    }
    return [];
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
