/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Users, User, ArrowRight, HeartPulse, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginRegisterProps {
  onLogin: (email: string, fullName: string, role: UserRole) => void;
}

export default function LoginRegister({ onLogin }: LoginRegisterProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('antonynjuguna502@gmail.com');
  const [fullName, setFullName] = useState('Antony Njuguna');
  const [role, setRole] = useState<UserRole>('patient');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email, fullName || 'Anonymous User', role);
  };

  const loadDemoUser = (demoRole: UserRole) => {
    if (demoRole === 'patient') {
      setEmail('antonynjuguna502@gmail.com');
      setFullName('Antony Njuguna');
      setRole('patient');
    } else if (demoRole === 'clinician') {
      setEmail('dr.sara@salama.ai');
      setFullName('Dr. Sara Vance');
      setRole('clinician');
    } else if (demoRole === 'admin') {
      setEmail('admin@salama.ai');
      setFullName('Super Administrator');
      setRole('admin');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 text-zinc-900">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xl leading-none">
        
        {/* Title / Logo */}
        <div className="text-center space-y-3.5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 ring-4 ring-emerald-50/50">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {isRegister ? 'Create Your Account' : 'Access Salama Portal'}
          </h2>
          <p className="font-sans text-xs sm:text-sm text-zinc-500">
            {isRegister 
              ? 'Complete registration to store health data securely.' 
              : 'Log in using your registered credentials or select a demo user below.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Registered Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 placeholder-zinc-400 outline-none focus:border-emerald-600 focus:bg-zinc-50/50 transition-smooth"
              placeholder="e.g. yourname@gmail.com"
            />
          </div>

          {isRegister && (
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 placeholder-zinc-400 outline-none focus:border-emerald-600 focus:bg-zinc-50/50 transition-smooth"
                placeholder="e.g. Antony Njuguna"
              />
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 text-left">
              Select Operating Role
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-smooth text-center cursor-pointer ${
                  role === 'patient'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                    : 'border-zinc-200 hover:border-zinc-305 text-zinc-550'
                }`}
              >
                <User className="h-4 w-4 mb-1.5" />
                <span className="text-[11px]">Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('clinician')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-smooth text-center cursor-pointer ${
                  role === 'clinician'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold'
                    : 'border-zinc-200 hover:border-zinc-305 text-zinc-550'
                }`}
              >
                <Users className="h-4 w-4 mb-1.5" />
                <span className="text-[11px]">Clinician</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-smooth text-center cursor-pointer ${
                  role === 'admin'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold'
                    : 'border-zinc-200 hover:border-zinc-305 text-zinc-550'
                }`}
              >
                <Shield className="h-4 w-4 mb-1.5" />
                <span className="text-[11px]">Admin</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-smooth group active:scale-95 cursor-pointer mt-2"
          >
            <span>{isRegister ? 'Register & Setup' : 'Log In Securely'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-5 text-sm leading-none">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
          >
            {isRegister ? 'Already registered? Log in here' : "First time? Register account here"}
          </button>
        </div>

        {/* Demo Fast Access Panel */}
        <div className="border-t border-zinc-200 pt-5 mt-4 text-left leading-none space-y-3">
          <div className="flex items-center space-x-1 text-emerald-600">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Demo Quick Access</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-sans leading-normal">
            Bypass standard forms and instantly configure specific medical workspaces to inspect fully developed profiles:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { loadDemoUser('patient'); onLogin('antonynjuguna502@gmail.com', 'Antony Njuguna', 'patient'); }}
              className="text-[10px] font-semibold px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg transition-smooth cursor-pointer shadow-sm"
            >
              Antony (Patient)
            </button>
            <button
              onClick={() => { loadDemoUser('clinician'); onLogin('dr.sara@salama.ai', 'Dr. Sara Vance', 'clinician'); }}
              className="text-[10px] font-semibold px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg transition-smooth cursor-pointer shadow-sm"
            >
              Dr. Sara (Clinician)
            </button>
            <button
              onClick={() => { loadDemoUser('admin'); onLogin('admin@salama.ai', 'System Admin', 'admin'); }}
              className="text-[10px] font-semibold px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 rounded-lg transition-smooth cursor-pointer shadow-sm"
            >
              Admin Console
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
