/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'patient' | 'clinician' | 'admin';

export interface UserProfile {
  email: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  role: UserRole;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  smokingStatus: 'never' | 'former' | 'active';
  diabetesStatus: 'none' | 'prediabetes' | 'type1' | 'type2';
  physicalActivity: 'none' | 'low' | 'moderate' | 'high';
  stressLevel: 'low' | 'medium' | 'high';
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  on_bp_medication?: boolean;
  bp_medication_type?: string;
  avatarUrl?: string;
}

export interface HealthMeasurements {
  age: number;
  height: number; // cm
  weight: number; // kg
  smokingStatus: 'never' | 'former' | 'active';
  diabetesStatus: 'none' | 'prediabetes' | 'type1' | 'type2';
  physicalActivity: 'none' | 'low' | 'moderate' | 'high';
  stressLevel: 'low' | 'medium' | 'high';
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  cholesterol: number; // mg/dL
  bloodGlucose: number; // mg/dL
}

export interface ShapValue {
  featureName: string;
  featureValue: string | number;
  shapValueHex: number; // Positive increases risk, negative decreases risk
  percentageContribution: number; // Normalized contribution to overall risk
  explanation: string; // Explaining why this feature affected the score
}

export interface DiseasePrediction {
  id: string;
  user_id?: string;
  disease: 'cvd' | 'hyp' | 'stroke' | 'chd';
  risk_score: number;
  risk_percentage: number;
  risk_label: 'Low' | 'Borderline' | 'Intermediate' | 'High';
  model_version: string;
  predicted_at: string;
  explanation?: string;
}

export interface Assessment {
  id: string;
  patientEmail: string;
  patientName: string;
  timestamp: string;
  measurements: HealthMeasurements;
  cvdRiskPercentage: number; // 0 to 100
  riskCategory: 'Low' | 'Borderline' | 'Intermediate' | 'High';
  summary: string;
  recommendations: string[];
  shapValues: ShapValue[];
  diseasePredictions?: DiseasePrediction[];
}

export interface Notification {
  id: string;
  recipientEmail?: string; // empty means broadcast to role
  recipientRole?: UserRole;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'info' | 'warning' | 'alert';
}

export interface SystemLog {
  id: string;
  category: 'authentication' | 'database' | 'ai_prediction' | 'user_management';
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}
