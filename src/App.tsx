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
import { Loader2, Heart, RefreshCw } from 'lucide-react';
import {
  loginUser,
  registerUser,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  runPredictions,
  getPredictionHistory,
  clearStoredToken,
  apiFetch,
  getStoredToken,
} from './api';

export default function App() {
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [session, setSession] = useState<{ email: string; fullName: string; role: UserRole } | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  
  // Patient specific details
  const [patientProfile, setPatientProfile] = useState<UserProfile>({
    email: '',
    first_name: '',
    middle_name: null,
    last_name: '',
    role: 'patient',
    age: 0,
    gender: 'male',
    height: 0,
    weight: 0,
    smokingStatus: 'never',
    diabetesStatus: 'none',
    physicalActivity: 'low',
    stressLevel: 'low',
    sleepQuality: 'average',
    on_bp_medication: false,
    bp_medication_type: 'none',
  });

  // Current subview page indicator
  const [patientTab, setPatientTab] = useState<'dashboard' | 'profile' | 'new_scan' | 'results' | 'health_data'>('dashboard');
  
  // Currently reviewed assessment
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Server state trackers
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  
  // Loading indicators
  const [isSubmittingScan, setIsSubmittingScan] = useState<boolean>(false);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(true);

  const syncFeeds = async () => {
    try {
      const historyRes = await getPredictionHistory();
        if (historyRes.ok) {
        const rawHistory = await historyRes.json();
        // DEBUG: surface raw history and explainability presence for troubleshooting
        try {
          console.debug('Prediction history raw items count:', (rawHistory || []).length);
          console.debug('Prediction history sample:', Array.isArray(rawHistory) ? rawHistory.slice(0, 6) : rawHistory);
          (rawHistory || []).forEach((it: any, idx: number) => {
            if (it && it.explainability) {
              console.debug(`history item[${idx}] has explainability keys:`, Object.keys(it.explainability));
            }
          });
        } catch (e) {
          // non-fatal
        }
        const grouped = new Map<string, Assessment>();

        (rawHistory || []).forEach((item: any) => {
          const timestamp = item.predicted_at || new Date().toISOString();
          const existing = grouped.get(timestamp);
          const explainability = item.explainability;
          const diseasePrediction = {
            id: item.id ? `${item.id}-${item.disease}` : `dp-${item.disease}-${Math.random().toString(36).slice(2)}`,
            disease: item.disease,
            risk_score: typeof item.risk_score === 'number' ? item.risk_score : Number(item.risk_score || 0),
            risk_percentage: typeof item.risk_percentage === 'number' ? item.risk_percentage : Math.round(Number(item.risk_score || 0) * 100),
            risk_label: item.risk_label || 'Low',
            model_version: item.model_version || 'remote-model',
            predicted_at: timestamp,
            explanation: explainability?.clinical_summary
              ? `${explainability.clinical_summary}${explainability.recommendation ? ` ${explainability.recommendation}` : ''}`
              : item.explanation || '',
            explainability: explainability || null,
          };

          if (existing) {
            existing.diseasePredictions = [...(existing.diseasePredictions || []), diseasePrediction];
            if (diseasePrediction.disease === 'cvd') {
              existing.cvdRiskPercentage = diseasePrediction.risk_percentage;
              existing.riskCategory = diseasePrediction.risk_label;
            }
            const isCvdExplain = diseasePrediction.disease === 'cvd' && explainability;
            if (isCvdExplain) {
              existing.explainability = explainability;
              existing.riskAssessmentId = explainability.risk_assessment_id;
              existing.summary = explainability.clinical_summary || existing.summary;
              existing.recommendations = Array.from(new Set([...(existing.recommendations || []), explainability.recommendation].filter(Boolean)));
            } else if (!existing.explainability && explainability) {
              existing.explainability = explainability;
              existing.riskAssessmentId = existing.riskAssessmentId || explainability.risk_assessment_id;
            }
            if (!isCvdExplain) {
              if (explainability?.recommendation) {
                existing.recommendations = Array.from(new Set([...(existing.recommendations || []), explainability.recommendation]));
              }
              if (!existing.summary && explainability?.clinical_summary) {
                existing.summary = explainability.clinical_summary;
              }
            }
          } else {
            grouped.set(timestamp, {
              id: `assessment-${timestamp}-${Math.random().toString(36).slice(2)}`,
              patientEmail: session?.email || 'unknown',
              patientName: session?.fullName || 'Unknown',
              timestamp,
              measurements: patientProfile,
              cvdRiskPercentage: diseasePrediction.disease === 'cvd' ? diseasePrediction.risk_percentage : 0,
              riskCategory: diseasePrediction.disease === 'cvd' ? diseasePrediction.risk_label : 'Low',
              summary: explainability?.clinical_summary || `Prediction history loaded from the remote API at ${timestamp}.`,
              recommendations: [
                ...(explainability?.recommendation ? [explainability.recommendation] : []),
                'Keep your profile and health metrics updated so the backend predictors can stay accurate.'
              ],
              shapValues: [],
              explainability: explainability || undefined,
              riskAssessmentId: explainability?.risk_assessment_id,
              diseasePredictions: [diseasePrediction],
            });
          }
        });

        const sortedAssessments = Array.from(grouped.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAssessments(sortedAssessments);
      }

      const nRes = await apiFetch('/notifications');
      if (nRes.ok) {
        const nData = await nRes.json();
        setNotifications(nData);
      }

      const lRes = await apiFetch('/logs');
      if (lRes.ok) {
        const lData = await lRes.json();
        setLogs(lData);
      }
    } catch (err) {
      console.error('Pipeline feed sync fault:', err);
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    syncFeeds();
    const interval = setInterval(syncFeeds, 6000); // pull notifications/scans updates periodically
    return () => clearInterval(interval);
  }, [session]);

  // On mount, if a stored token exists, try to restore user session/profile
  useEffect(() => {
    const tryRestore = async () => {
      try {
        const token = getStoredToken();
        if (!token) return;
        const userRes = await getCurrentUser();
        if (userRes.ok) {
          const userData = await userRes.json();
          const email = userData.email || '';
          const role = userData.role || 'patient';
          setSession({ email, fullName: email, role });
          const profileData = await loadUserProfile();
          if (profileData) {
            const profileFullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || email;
            setSession((prev) => prev ? { ...prev, fullName: profileFullName } : { email, fullName: profileFullName, role });
          }
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      }
    };
    tryRestore();
  }, []);

  const setAuthenticatedSession = async (email: string, fullName: string, role: UserRole) => {
    setSession({ email, fullName, role });
    const [first, ...rest] = (fullName || '').split(' ');
    const last = rest.join(' ');
    setPatientProfile((prev) => ({
      ...prev,
      email,
      first_name: first || prev.first_name,
      last_name: last || prev.last_name,
      role,
    }));
    setShowLanding(false);
  };

  const handleLogin = (email: string, fullName: string, role: UserRole) => {
    setAuthenticatedSession(email, fullName, role);
  };

  const handleAuthenticate = async ({ email, fullName, password, role, isRegister }: {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    isRegister: boolean;
  }) => {
    setAuthLoading(true);
    try {
      if (isRegister) {
        await registerUser(email, password, role);
      }

      await loginUser(email, password);
      const userRes = await getCurrentUser();
      let actualRole = role;
      if (userRes.ok) {
        const userData = await userRes.json();
        actualRole = userData.role || role;
      }

      await setAuthenticatedSession(email, fullName, actualRole as UserRole);
      const profileData = await loadUserProfile();
      if (profileData) {
        const profileFullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || fullName || email;
        setSession((prev) => prev ? { ...prev, fullName: profileFullName } : { email, fullName: profileFullName, role: actualRole as UserRole });
        setPatientProfile((prev) => ({ ...prev, first_name: profileData.first_name ?? prev.first_name, last_name: profileData.last_name ?? prev.last_name }));
      }
    } catch (err: any) {
      console.error('Authentication failed:', err);
      alert(err.message || 'Authentication failed. Check your credentials or backend status.');
    } finally {
      setAuthLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profileRes = await getUserProfile();
      if (!profileRes.ok) return null;
      const profileData = await profileRes.json();

      setPatientProfile((prev) => ({
        ...prev,
        email: profileData.email ?? prev.email,
        first_name: profileData.first_name ?? prev.first_name,
        middle_name: profileData.middle_name ?? prev.middle_name ?? null,
        last_name: profileData.last_name ?? prev.last_name,
        age: profileData.age ?? prev.age,
        gender: profileData.sex === 'female' ? 'female' : profileData.sex === 'other' ? 'other' : 'male',
        height: profileData.height ?? prev.height,
        weight: profileData.weight ?? prev.weight,
        smokingStatus: profileData.smoking ?? prev.smokingStatus,
        diabetesStatus: profileData.diabetes ? 'type2' : prev.diabetesStatus,
        physicalActivity: profileData.physical_activity_level ?? prev.physicalActivity,
        stressLevel: prev.stressLevel,
        sleepQuality: profileData.sleep_quality ?? prev.sleepQuality,
        on_bp_medication: profileData.on_bp_medication ?? prev.on_bp_medication,
        bp_medication_type: profileData.bp_medication_type ?? prev.bp_medication_type,
      }));

      const profileFullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ');
      if (profileFullName) setSession((prev) => prev ? { ...prev, fullName: profileFullName } : null);

      return profileData;
    } catch (err) {
      console.error('Failed to load user profile:', err);
      return null;
    }
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setPatientProfile(updated);
    if (session) {
      const displayName = `${updated.first_name || ''} ${updated.last_name || ''}`.trim();
      setSession({
        ...session,
        fullName: displayName || session.fullName,
      });
    }

    try {
      await updateUserProfile({
        first_name: updated.first_name,
        last_name: updated.last_name,
        email: updated.email,
        sex: updated.gender,
        age: updated.age,
        height: updated.height,
        weight: updated.weight,
        smoking: updated.smokingStatus,
        diabetes: updated.diabetesStatus !== 'none',
        physical_activity_level: updated.physicalActivity,
        sleep_quality: updated.sleepQuality,
        bp_history: updated.on_bp_medication ? 'hypertension' : 'normal',
      });
    } catch (err) {
      console.error('Failed to sync profile to server:', err);
    }
  };

  const handleLaunchScanPredict = async (vitals: HealthMeasurements) => {
    if (!session) return;
    setIsSubmittingScan(true);

    try {
      const response = await runPredictions(['cvd', 'hyp', 'stroke', 'chd']);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prediction API error ${response.status}: ${errorText}`);
      }

      const apiData = await response.json();
      const diseasePredictions = (apiData.results || []).map((item: any) => {
        const score = typeof item.risk_score === 'number' ? item.risk_score : Number(item.risk_score || 0);
        const percentage = typeof item.risk_percentage === 'number'
          ? item.risk_percentage
          : Math.round(score * 100);

        return {
          id: item.id ? `${item.id}-${item.disease}` : `dp-${item.disease}-${Date.now()}`,
          disease: item.disease,
          risk_score: score,
          risk_percentage: percentage,
          risk_label: item.risk_label || (percentage >= 60 ? 'High' : percentage >= 35 ? 'Intermediate' : percentage >= 15 ? 'Borderline' : 'Low'),
          model_version: item.model_version || 'remote-model',
          predicted_at: apiData.predicted_at || new Date().toISOString(),
          explanation: item.explanation || `Remote API predicted ${item.disease} risk.`,
        };
      });

      const cvdPrediction = diseasePredictions.find((d) => d.disease === 'cvd') || diseasePredictions[0];
      const generatedReport: Assessment = {
        id: `assessment-${Date.now()}`,
        patientEmail: session.email,
        patientName: session.fullName,
        timestamp: apiData.predicted_at || new Date().toISOString(),
        cvdRiskPercentage: cvdPrediction?.risk_percentage ?? 0,
        riskCategory: cvdPrediction?.risk_label ?? 'Low',
        measurements: vitals,
        summary: `Remote model predictions returned for ${session.fullName}.`,
        recommendations: [
          'Review the results with your clinician.',
          'Continue updating your measurements regularly.',
          'Use this prediction as a clinical decision support signal.',
        ],
        shapValues: [],
        diseasePredictions,
      };

      setAssessments(prev => [generatedReport, ...prev]);
      setSelectedAssessment(generatedReport);
      setPatientTab('results');
      syncFeeds();
    } catch (err) {
      console.error('AI diagnostics fail:', err);
      alert('Prediction request failed. See console for details.');
    } finally {
      setIsSubmittingScan(false);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await apiFetch('/notifications/read', {
        method: 'POST',
        body: JSON.stringify({ id }),
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
      const res = await apiFetch('/reset', { method: 'POST' });
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
        />
      </div>
    );
  }

  // 3. User login/registration form
  if (!session) {
    return <LoginRegister onAuthenticate={handleAuthenticate} />;
  }

  // Filter lists matching active session parameters or triage rules
  const patientAssessments = assessments.filter(
    a => a.patientEmail.toLowerCase() === session.email.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-950 leading-none">
      
      {/* Top navbar */}
      <Navigation
        currentRole={session?.role || 'patient'}
        currentUserEmail={session?.email}
        currentUserName={session?.fullName}
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
                currentUserName={session?.fullName}
                currentUserEmail={session?.email}
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
                assessments={patientAssessments}
                onViewAssessment={(a) => setSelectedAssessment(a)}
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
              assessments={assessments.filter(a => a.patientEmail.toLowerCase() === selectedAssessment.patientEmail.toLowerCase())}
              onViewAssessment={(a) => setSelectedAssessment(a)}
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
