/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile, Assessment, Notification, SystemLog, HealthMeasurements } from './types';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import LoginRegister from './components/LoginRegister';
import PatientDashboard from './components/PatientDashboard';
import ProfileManagement from './components/ProfileManagement';
import HealthMeasurementForms from './components/HealthMeasurementForms';
import RiskAssessmentResults from './components/RiskAssessmentResults';
import ClinicianDashboard from './components/ClinicianDashboard';
import AdminDashboard from './components/AdminDashboard';
import HealthDataAndForms from './components/HealthDataAndForms';
import AppointmentsSection from './components/AppointmentsSection';
import { Loader2, Heart, RefreshCw } from 'lucide-react';

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [session, setSession] = useState<{ email: string; fullName: string; role: UserRole } | null>(null);
  
  // Patient specific details
  const [patientProfile, setPatientProfile] = useState<UserProfile>({
    email: 'antonynjuguna502@gmail.com',
    fullName: 'Antony Njuguna',
    role: 'patient',
    age: 28,
    gender: 'male',
    height: 178,
    weight: 74,
    smokingStatus: 'never',
    diabetesStatus: 'none',
    physicalActivity: 'high',
    stressLevel: 'low',
    sleepQuality: 'excellent',
    on_bp_medication: false,
    bp_medication_type: 'none',
  });

  // Current subview page indicator
  const [patientTab, setPatientTab] = useState<'dashboard' | 'profile' | 'new_scan' | 'results' | 'health_data' | 'appointments'>('dashboard');
  
  // Currently reviewed assessment
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Server state trackers
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  // Loading indicators
  const [isSubmittingScan, setIsSubmittingScan] = useState<boolean>(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);

  // Sync API feeds
  const syncFeeds = async () => {
    try {
      // 1. Fetch Assessments
      const aRes = await fetch('/api/assessments');
      if (aRes.ok) {
        const aData = await aRes.json();
        setAssessments(aData);
      }

      // 2. Fetch Notifications
      const nRes = await fetch('/api/notifications');
      if (nRes.ok) {
        const nData = await nRes.json();
        setNotifications(nData);
      }

      // 3. Fetch system logs
      const lRes = await fetch('/api/logs');
      if (lRes.ok) {
        const lData = await lRes.json();
        setLogs(lData);
      }
    } catch (err) {
      console.error("Pipeline feed sync fault:", err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    syncFeeds();
    const interval = setInterval(syncFeeds, 6000); // pull notifications/scans updates periodically
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (email: string, fullName: string, role: UserRole) => {
    setSession({ email, fullName, role });
    setPatientProfile(prev => ({
      ...prev,
      email,
      fullName,
      role
    }));
    setShowLanding(false);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setPatientProfile(updated);
    if (session) {
      setSession({
        ...session,
        fullName: updated.fullName
      });
    }
  };

  const handleLaunchScanPredict = async (vitals: HealthMeasurements) => {
    if (!session) return;
    setIsSubmittingScan(true);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail: session.email,
          patientName: session.fullName,
          measurements: vitals
        })
      });

      if (response.ok) {
        const generatedReport = await response.json();
        // Update local arrays immediately
        setAssessments(prev => [generatedReport, ...prev]);
        setSelectedAssessment(generatedReport);
        setPatientTab('results');
        
        // Sync administrative panels logs
        syncFeeds();
      } else {
        alert("Diagnostics processing failed. Check console variables.");
      }
    } catch (err) {
      console.error("AI diagnostics fail:", err);
      alert("Network or model timeout. Reset PostgreSQL simulated instances.");
    } finally {
      setIsSubmittingScan(false);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        syncFeeds();
        setPatientTab('dashboard');
        setSelectedAssessment(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setShowLanding(true);
  };

  // 1. Loading screen
  if (isLoadingFeed) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 animate-pulse">
          <Heart className="h-6 w-6 stroke-emerald-600 fill-emerald-500/10" />
        </div>
        <div className="flex items-center space-x-1.5 font-sans text-xs text-zinc-650 font-medium">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-650" />
          <span>Synchronizing Clinical EMR Feeds...</span>
        </div>
      </div>
    );
  }

  // 2. Landing page
  if (showLanding && !session) {
    return (
      <div className="min-h-screen bg-slate-50 text-zinc-900">
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/60 ring-4 ring-emerald-100/50">
                <Heart className="h-5.5 w-5.5 fill-emerald-500/5" />
              </div>
              <div className="text-left leading-none">
                <span className="font-display text-base font-bold tracking-tight text-zinc-900 block">
                  Salama <span className="font-medium text-emerald-600">AI</span>
                </span>
                <span className="block font-sans text-[9px] uppercase tracking-wider text-zinc-400 font-medium mt-0.5">
                  Explainable Cardiology
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowLanding(false)}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-smooth shadow-sm cursor-pointer"
            >
              Log In Portal
            </button>
          </div>
        </header>

        <LandingPage
          onStart={() => setShowLanding(false)}
          onClinicianDemo={() => handleLogin('dr.sara@salama.ai', 'Dr. Sara Vance', 'clinician')}
        />
      </div>
    );
  }

  // 3. User login/registration form
  if (!session) {
    return <LoginRegister onLogin={handleLogin} />;
  }

  // Filter lists matching active session parameters or triage rules
  const patientAssessments = assessments.filter(
    a => a.patientEmail.toLowerCase() === session.email.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-950 leading-none">
      
      {/* Top navbar */}
      <Navigation
        currentRole={session.role}
        setCurrentRole={(role) => setSession({ ...session, role })}
        currentUserEmail={session.email}
        notifications={notifications}
        onMarkRead={handleMarkNotificationRead}
        onLogout={handleLogout}
      />

      {/* Structured work view layouts based on toggle role */}
      <main className="pb-16">
        
        {session.role === 'patient' && (
          <>
            {patientTab === 'dashboard' && (
              <PatientDashboard
                profile={patientProfile}
                assessments={patientAssessments}
                onNewScan={() => setPatientTab('new_scan')}
                onEditProfile={() => setPatientTab('profile')}
                onViewAssessment={(a) => {
                  setSelectedAssessment(a);
                  setPatientTab('results');
                }}
                onViewHealthData={() => setPatientTab('health_data')}
                onViewAppointments={() => setPatientTab('appointments')}
              />
            )}

            {patientTab === 'appointments' && (
              <AppointmentsSection
                profile={patientProfile}
                onBack={() => setPatientTab('dashboard')}
              />
            )}

            {patientTab === 'profile' && (
              <ProfileManagement
                profile={patientProfile}
                onSave={handleSaveProfile}
                onBack={() => setPatientTab('dashboard')}
              />
            )}

            {patientTab === 'new_scan' && (
              <HealthMeasurementForms
                profile={patientProfile}
                onSubmit={handleLaunchScanPredict}
                isSubmitting={isSubmittingScan}
              />
            )}

            {patientTab === 'results' && selectedAssessment && (
              <RiskAssessmentResults
                assessment={selectedAssessment}
                onBack={() => {
                  setSelectedAssessment(null);
                  setPatientTab('dashboard');
                }}
              />
            )}

            {patientTab === 'health_data' && (
              <HealthDataAndForms
                onBackToDashboard={() => setPatientTab('dashboard')}
              />
            )}
          </>
        )}

        {session.role === 'clinician' && (
          // If a clinician clicked on a patient profile and wants to view their portfolio
          selectedAssessment ? (
            <RiskAssessmentResults
              assessment={selectedAssessment}
              onBack={() => setSelectedAssessment(null)}
            />
          ) : (
            <ClinicianDashboard
              assessments={assessments}
              notifications={notifications}
              onViewAssessment={(a) => setSelectedAssessment(a)}
              onMarkNotificationRead={handleMarkNotificationRead}
            />
          )
        )}

        {session.role === 'admin' && (
          <AdminDashboard
            logs={logs}
            onResetDatabase={handleResetDatabase}
            assessmentsCount={assessments.length}
          />
        )}

      </main>

    </div>
  );
}
