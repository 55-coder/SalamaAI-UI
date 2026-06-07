/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Shield, Users, Database, Terminal, CheckCircle2, RotateCcw } from 'lucide-react';
import { SystemLog } from '../types';
import { getUsers } from '../api';

interface AdminDashboardProps {
  logs: SystemLog[];
  onResetDatabase: () => void;
  assessmentsCount: number;
}

export default function AdminDashboard({ logs, onResetDatabase, assessmentsCount }: AdminDashboardProps) {
  const [selectedLogsCategory, setSelectedLogsCategory] = useState<'all' | 'ai_prediction' | 'authentication' | 'database'>('all');
  const [resetSuccess, setResetSuccess] = useState(false);

  // System users loaded from backend
  const [systemUsers, setSystemUsers] = useState<Array<any>>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getUsers();
        if (!active) return;
        if (res.ok) {
          const users = await res.json();
          setSystemUsers(Array.isArray(users) ? users : []);
        }
      } catch (err) {
        console.error('Failed to load users for admin dashboard:', err);
      }
    })();
    return () => { active = false; };
  }, []);

  const handleToggleUserRole = (email: string) => {
    setSystemUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        const nextRole = u.role === 'patient' ? 'clinician' : u.role === 'clinician' ? 'admin' : 'patient';
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to restore the PostgreSQL simulated container database schemas to baseline stock values? This resets newly created diagnostics.')) {
      onResetDatabase();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const filteredLogs = logs.filter(
    l => selectedLogsCategory === 'all' || l.category === selectedLogsCategory
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      
      {/* Title */}
      <div className="mb-8 border-b border-zinc-200 pb-6 text-left leading-none font-normal">
        <span className="font-mono text-[9px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-150">
          Executive Administrative Center
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-2.5">
          Admin Control Panel
        </h1>
        <p className="font-sans text-xs sm:text-sm text-zinc-500 mt-1 font-semibold leading-normal">
          Manage user configurations, audit database telemetry, review system parameters, and stream live diagnostic server-side logs.
        </p>
      </div>

      {resetSuccess && (
        <div className="mb-6 flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-150 px-4 py-3.5 text-xs text-emerald-700 font-bold leading-normal text-left">
          <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 flex-shrink-0" />
          <span>PostgreSQL simulation resets completed successfully! Default EMR registries restored.</span>
        </div>
      )}

      {/* Overview stats indicators Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 text-left font-normal">
        
        {/* Core database metrics */}
        <div className="border border-zinc-200 p-4.5 rounded-2xl bg-white shadow-xl leading-none">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">System Database</span>
            <Database className="h-4 w-4 text-amber-600 animate-pulse" />
          </div>
          <span className="font-display text-2xl font-black text-zinc-900 tracking-tight">Active EMR</span>
          <span className="block text-[9px] text-zinc-500 mt-1 font-mono font-bold">Postgres VM: Port 5432</span>
        </div>

        {/* Inference counters */}
        <div className="border border-zinc-200 p-4.5 rounded-2xl bg-white shadow-xl leading-none">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Total Diagnostics</span>
            <RotateCcw className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="font-display text-2xl font-black text-zinc-900 tracking-tight">{assessmentsCount} Processed</span>
          <span className="block text-[9px] text-zinc-500 mt-1 font-mono font-bold">ML inference runs successful</span>
        </div>

        {/* Gemini status */}
        <div className="border border-zinc-200 p-4.5 rounded-2xl bg-white shadow-xl leading-none">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-mono">Explainable AI Node</span>
            <Shield className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="font-display text-2xl font-black text-zinc-900 tracking-tight">Gemini Flash</span>
          <span className="block text-[9px] text-emerald-650 tracking-normal font-mono font-extrabold mt-1">
            Core @google/genai SDK Integration
          </span>
        </div>

        {/* Settings action list */}
        <div className="border border-zinc-200 p-4.5 bg-zinc-50/50 rounded-2xl shadow-xl leading-none flex flex-col justify-between hover:border-zinc-300 transition-smooth">
          <div className="text-[10.5px] text-zinc-500 font-semibold leading-normal pt-1 text-left">
            Reset EMR databases dynamically to default sample diagnostic logs.
          </div>
          <button
            onClick={handleResetClick}
            className="w-full flex items-center justify-center space-x-1.5 rounded-xl bg-zinc-850 border border-zinc-700 text-white font-bold py-2.5 text-[10px] hover:bg-zinc-950 transition-smooth cursor-pointer mt-2 shadow-md"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo Registries</span>
          </button>
        </div>

      </div>

      {/* Main grids: User table vs Streaming terminal logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Users lists */}
        <div className="lg:col-span-6 rounded-3xl border border-zinc-200 bg-white p-5 leading-none shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-3 mb-1">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-amber-600" />
              <h3 className="font-display font-semibold text-zinc-900 text-sm sm:text-base">Identity & Access Console</h3>
            </div>
            <span className="text-[9px] font-mono font-bold text-zinc-405">Total: {systemUsers.length}</span>
          </div>

          <div className="divide-y divide-zinc-100 max-h-[460px] overflow-y-auto pr-1">
            {systemUsers.map((u) => (
              <div key={u.email} className="py-4.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                <div className="space-y-1 truncate text-left">
                  <div className="flex items-center space-x-2">
                    <strong className="text-zinc-900 font-bold">{u.name}</strong>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[8px] font-mono font-bold uppercase border border-zinc-150 text-zinc-500">
                      {u.tier}
                    </span>
                  </div>
                  <span className="block font-mono text-[9px] text-zinc-400 font-bold truncate">{u.email}</span>
                </div>

                <div className="flex items-center space-x-4 sm:self-center flex-shrink-0">
                  <span className={`px-2 py-1.5 rounded text-[9px] uppercase font-bold border leading-none ${
                    u.role === 'admin' 
                      ? 'text-amber-800 bg-amber-50 border border-amber-200/50' 
                      : u.role === 'clinician' 
                      ? 'text-emerald-800 bg-emerald-50 border border-emerald-200/50' 
                      : 'text-zinc-650 bg-zinc-50 border border-zinc-200'
                  }`}>
                    {u.role}
                  </span>
                  <button
                    onClick={() => handleToggleUserRole(u.email)}
                    className="text-[9px] font-bold px-2 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded text-zinc-600 cursor-pointer transition-smooth shadow-xs font-sans"
                  >
                    Cycle Role
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: logs Terminal */}
        <div className="lg:col-span-6 rounded-3xl border border-zinc-200 bg-white p-5 leading-none shadow-xl text-left space-y-4">
          
          <div className="flex items-center justify-between border-b border-zinc-150 pb-3.5">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4.5 w-4.5 text-zinc-700" />
              <h3 className="font-display font-semibold text-zinc-900 text-sm">PostgreSQL Logs Dynamic Audit</h3>
            </div>
            
            {/* Category check dropdown */}
            <select
              value={selectedLogsCategory}
              onChange={(e) => setSelectedLogsCategory(e.target.value as any)}
              className="bg-zinc-100 text-zinc-750 outline-none border border-zinc-200 rounded-lg text-[9px] px-2.5 py-1.5 font-mono font-bold cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="ai_prediction">AI_PREDICTION</option>
              <option value="authentication">AUTHENTICATION</option>
              <option value="database">DATABASE</option>
            </select>
          </div>

          <div className="rounded-2xl bg-zinc-950 p-4 font-mono text-[10px] text-zinc-300 shadow-inner">
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="text-zinc-550 text-[10px] text-center py-12">
                  No telemetry log records recorded matching selection.
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isErr = log.level === 'error';
                  const isWarn = log.level === 'warning';
                  return (
                    <div key={log.id} className="text-[10px] leading-relaxed border-b border-zinc-900/60 pb-2">
                      <div className="flex justify-between text-zinc-500 text-[9px] font-bold mb-1">
                        <span className={`${isErr ? 'text-rose-500' : isWarn ? 'text-amber-500' : 'text-emerald-500'}`}>
                          [{log.category.toUpperCase()}]
                        </span>
                        <span>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-zinc-350 leading-relaxed font-normal">
                        {log.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
