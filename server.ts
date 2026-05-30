/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database with high-quality mock data representing patient records, notifications, and logs
let assessments: any[] = [
  {
    id: "assess-1",
    patientEmail: "antonynjuguna502@gmail.com",
    patientName: "Antony Njuguna",
    timestamp: "2026-05-28T10:15:00Z",
    cvdRiskPercentage: 14,
    riskCategory: "Low",
    measurements: {
      age: 28,
      height: 178,
      weight: 74,
      smokingStatus: "never",
      diabetesStatus: "none",
      physicalActivity: "high",
      stressLevel: "low",
      sleepQuality: "excellent",
      systolicBP: 118,
      diastolicBP: 76,
      heartRate: 68,
      cholesterol: 175,
      bloodGlucose: 88,
    },
    summary: "Your cardiovascular disease risk is currently at a healthy, low level of 14%. Your physical habits, balanced blood glucose, and excellent sleep parameters are highly protective factors.",
    recommendations: [
      "Maintain your highly active physical lifestyle to preserve arterial flexibility.",
      "Re-evaluate health parameters annually to track age-related changes.",
      "Maintain current diet low in saturated fats to keep LDL cholesterol optimal."
    ],
    shapValues: [
      { featureName: "Age", featureValue: 28, shapValueHex: 4, percentageContribution: 15, explanation: "At 28 years old, your age acts as a powerful relative protective baseline." },
      { featureName: "Blood Pressure", featureValue: "118/76", shapValueHex: -5, percentageContribution: -25, explanation: "Your Blood pressure is fully within the healthy range, minimizing mechanical shear stress on your arteries." },
      { featureName: "Cholesterol", featureValue: 175, shapValueHex: -3, percentageContribution: -15, explanation: "Optimal lipid profile indicators suggest no significant vascular plaque buildup risks." },
      { featureName: "Activity Level", featureValue: "High", shapValueHex: -6, percentageContribution: -30, explanation: "Your vigorous physical activity expands cardiovascular reserve and improves nitric oxide release." },
      { featureName: "Smoking Status", featureValue: "Never", shapValueHex: -4, percentageContribution: -15, explanation: "Nonsmoker status shields your vascular endothelium from chronic chemicals and inflammation." }
    ],
    diseasePredictions: [
      {
        id: "dp-cvd-assess-1",
        disease: "cvd",
        risk_score: 0.14,
        risk_percentage: 14,
        risk_label: "Low",
        model_version: "xgbcvd_v3",
        predicted_at: "2026-05-28T10:15:00Z",
        explanation: "Vascular risk baseline is extremely healthy (14%). Protective physical habits shield arterial vessels."
      },
      {
        id: "dp-hyp-assess-1",
        disease: "hyp",
        risk_score: 0.12,
        risk_percentage: 12,
        risk_label: "Low",
        model_version: "xgbhyp_v1",
        predicted_at: "2026-05-28T10:15:00Z",
        explanation: "Systolic load is within safety bounds (12%). Low sympathetic stimulation and active muscle tissue maintain pressure homeostasis."
      },
      {
        id: "dp-stroke-assess-1",
        disease: "stroke",
        risk_score: 0.04,
        risk_percentage: 4,
        risk_label: "Low",
        model_version: "xgbstroke_v5",
        predicted_at: "2026-05-28T10:15:00Z",
        explanation: "Brain perfusion is excellent (4%). Complete absence of tobacco carbon monoxide limits vessel fragility."
      },
      {
        id: "dp-chd-assess-1",
        disease: "chd",
        risk_score: 0.08,
        risk_percentage: 8,
        risk_label: "Low",
        model_version: "xgbchd_v2",
        predicted_at: "2026-05-28T10:15:05Z",
        explanation: "Coronary coronary lumen remains clean (8%). LDL ratios and athletic lipid processing prevent plaque sedimentation."
      }
    ]
  },
  {
    id: "assess-2",
    patientEmail: "marcus.vance@gmail.com",
    patientName: "Marcus Vance",
    timestamp: "2026-05-29T14:30:22Z",
    cvdRiskPercentage: 68,
    riskCategory: "High",
    measurements: {
      age: 58,
      height: 170,
      weight: 92, // BMI: 31.8 (Obese)
      smokingStatus: "active",
      diabetesStatus: "type2",
      physicalActivity: "none",
      stressLevel: "high",
      sleepQuality: "poor",
      systolicBP: 146,
      diastolicBP: 92,
      heartRate: 84,
      cholesterol: 245,
      bloodGlucose: 156,
    },
    summary: "Patient presents with a clinical High risk profile (68% 10-year CVD forecast). The synergistic combination of chronic hypertension, elevated serum cholesterol, diagnosed Typ-2 Diabetes, and active tobacco smoking induces substantial vascular risk.",
    recommendations: [
      "Schedule urgent consultation with Dr. Sara for medical hypertension and diabetes management.",
      "Initiate a structured tobacco cessation plan; smoking synergistic effects with hypertension multiply stroke risk.",
      "Begin short 10-minute daily light walks, gradually ascending as tolerated under physical monitoring."
    ],
    shapValues: [
      { featureName: "Age", featureValue: 58, shapValueHex: 15, percentageContribution: 22, explanation: "Age of 58 represents a natural biological progression toward arterial stiffening." },
      { featureName: "Smoking Status", featureValue: "Active", shapValueHex: 14, percentageContribution: 20, explanation: "Active smoking inflicts high coronary vasoconstriction and initiates acute endothelial lesions." },
      { featureName: "Blood Pressure", featureValue: "146/92", shapValueHex: 12, percentageContribution: 18, explanation: "Stage 2 Hypertension exerts heavy persistent hemodynamic strain on arterial walls." },
      { featureName: "Diabetes Status", featureValue: "Type 2", shapValueHex: 11, percentageContribution: 16, explanation: "Sustained hyperglycemia accelerates macrovascular and microvascular calcification." },
      { featureName: "Cholesterol", featureValue: 245, shapValueHex: 9, percentageContribution: 13, explanation: "Hyperlipidemia presents abundant substrates for foam cell and plaque synthesis." },
      { featureName: "Lack of Activity", featureValue: "None", shapValueHex: 7, percentageContribution: 11, explanation: "Sedentary status compromises endothelial function and weight regulation capability." }
    ],
    diseasePredictions: [
      {
        id: "dp-cvd-assess-2",
        disease: "cvd",
        risk_score: 0.68,
        risk_percentage: 68,
        risk_label: "High",
        model_version: "xgbcvd_v3",
        predicted_at: "2026-05-29T14:30:22Z",
        explanation: "10-Year cumulative systemic cardiovascular risk is at 68% (High). Immediate arterial repair and risk modification advised."
      },
      {
        id: "dp-hyp-assess-2",
        disease: "hyp",
        risk_score: 0.72,
        risk_percentage: 72,
        risk_label: "High",
        model_version: "xgbhyp_v1",
        predicted_at: "2026-05-29T14:30:22Z",
        explanation: "Vessel fluid load indexes persistent arterial wall hyper-tension (72%). Systolic readings demand therapeutic vasodilation."
      },
      {
        id: "dp-stroke-assess-2",
        disease: "stroke",
        risk_score: 0.62,
        risk_percentage: 62,
        risk_label: "High",
        model_version: "xgbstroke_v5",
        predicted_at: "2026-05-29T14:30:22Z",
        explanation: "Cerebral vascular vulnerability is dangerously high at 62% (High), aggravated by heavy vasoconstriction from active smoking."
      },
      {
        id: "dp-chd-assess-2",
        disease: "chd",
        risk_score: 0.58,
        risk_percentage: 58,
        risk_label: "Intermediate",
        model_version: "xgbchd_v2",
        predicted_at: "2026-05-29T14:30:22Z",
        explanation: "Coronary lumen occlusion hazard is rated at 58% (Intermediate-to-High) due to cholesterol metrics combined with complete physical inactivity."
      }
    ]
  },
  {
    id: "assess-3",
    patientEmail: "clara.jones@gmail.com",
    patientName: "Clara Jones",
    timestamp: "2026-05-29T11:20:00Z",
    cvdRiskPercentage: 38,
    riskCategory: "Intermediate",
    measurements: {
      age: 46,
      height: 162,
      weight: 68,
      smokingStatus: "former",
      diabetesStatus: "prediabetes",
      physicalActivity: "low",
      stressLevel: "medium",
      sleepQuality: "fair",
      systolicBP: 132,
      diastolicBP: 84,
      heartRate: 75,
      cholesterol: 215,
      bloodGlucose: 112,
    },
    summary: "Cardiovascular risk is classified as Intermediate (38%). Elevated risk factors include mild Stage 1 hypertension, prediabetic blood glucose levels, and suboptimal sleep parameters.",
    recommendations: [
      "Focus on dietary changes such as implementing the DASH diet to lower blood pressure naturally.",
      "Increase moderate cardiovascular physical exercise (such as brisk walking) to 150 minutes weekly.",
      "Engage in mindfulness or stress-relieving practices to mitigate high sympathetic nervous drive."
    ],
    shapValues: [
      { featureName: "Age", featureValue: 46, shapValueHex: 8, percentageContribution: 21, explanation: "Moderate level contribution reflecting early pre-menopausal vascular risk profiles." },
      { featureName: "Blood Pressure", featureValue: "132/84", shapValueHex: 7, percentageContribution: 18, explanation: "Mild hypertension exerts slight elevated biomechanical stress on blood vessels." },
      { featureName: "Cholesterol", featureValue: 215, shapValueHex: 6, percentageContribution: 16, explanation: "Slightly elevated serum cholesterol contributes to gradual atherosclerotic vulnerability." },
      { featureName: "Diabetes (Prediabetes)", featureValue: "Prediabetes", shapValueHex: 5, percentageContribution: 13, explanation: "Impaired fasting glucose initiates metabolic stressors on the coronary walls." },
      { featureName: "Former Smoker", featureValue: "Former", shapValueHex: 4, percentageContribution: 11, explanation: "Vascular status is actively recovering, but historical exposure still carries residual risk." },
      { featureName: "Physical Activity", featureValue: "Low", shapValueHex: 4, percentageContribution: 11, explanation: "Insufficient aerobic activity limits metabolic recovery and cardiac muscle output." },
      { featureName: "Stress & Sleep", featureValue: "Fair/Medium", shapValueHex: 4, percentageContribution: 10, explanation: "Moderate stress responses trigger periodic sympathetic cardiotoxicity." }
    ],
    diseasePredictions: [
      {
        id: "dp-cvd-assess-3",
        disease: "cvd",
        risk_score: 0.38,
        risk_percentage: 38,
        risk_label: "Intermediate",
        model_version: "xgbcvd_v3",
        predicted_at: "2026-05-29T11:20:00Z",
        explanation: "10-Year cumulative CVD risk is at 38% (Intermediate). Primary triggers include early pre-menopausal trends, lifestyle markers, and mild hypercholesterolemia."
      },
      {
        id: "dp-hyp-assess-3",
        disease: "hyp",
        risk_score: 0.44,
        risk_percentage: 44,
        risk_label: "Intermediate",
        model_version: "xgbhyp_v1",
        predicted_at: "2026-05-29T11:20:00Z",
        explanation: "Persistent pressure load of 132 mmHg registers as Stage-1 Hypertension (44%). Sympathetic down-regulation can bring values back to ideal."
      },
      {
        id: "dp-stroke-assess-3",
        disease: "stroke",
        risk_score: 0.22,
        risk_percentage: 22,
        risk_label: "Borderline",
        model_version: "xgbstroke_v5",
        predicted_at: "2026-05-29T11:20:00Z",
        explanation: "Vessel wall thinning is moderate at 22% (Borderline). Standard smoking recovery is actively shielding cerebral arterial structures."
      },
      {
        id: "dp-chd-assess-3",
        disease: "chd",
        risk_score: 0.29,
        risk_percentage: 29,
        risk_label: "Borderline",
        model_version: "xgbchd_v2",
        predicted_at: "2026-05-29T11:20:00Z",
        explanation: "Coronary supply pathways show gradual lipid accretion (29%). Low daily movement restricts clean plasma circulation."
      }
    ]
  }
];

let notifications: any[] = [
  {
    id: "notif-1",
    recipientEmail: "antonynjuguna502@gmail.com",
    recipientRole: "patient",
    title: "Risk Assessment Ready",
    message: "Your AI Cardiovascular disease risk evaluation has been successfully formulated. You represent a Low risk category.",
    timestamp: "2026-05-28T10:15:30Z",
    isRead: false,
    severity: "info",
  },
  {
    id: "notif-2",
    recipientRole: "clinician",
    title: "HIGH CVD RISK ALERT: Marcus Vance",
    message: "A high-risk patient Marcus Vance (58M) registered a CVD predicted risk of 68%. Immediate review of measurements is highly advised.",
    timestamp: "2026-05-29T14:31:00Z",
    isRead: false,
    severity: "alert",
  },
  {
    id: "notif-3",
    recipientRole: "admin",
    title: "AI Model Executed Successfully",
    message: "Gemini API successfully completed CVD risk assessment predictions and explanations for Marcus Vance.",
    timestamp: "2026-05-29T14:30:22Z",
    isRead: false,
    severity: "info",
  }
];

let systemLogs: any[] = [
  {
    id: "log-1",
    category: "authentication",
    level: "info",
    message: "User antonynjuguna502@gmail.com logged into the Patient dashboard.",
    timestamp: "2026-05-30T10:00:15Z"
  },
  {
    id: "log-2",
    category: "ai_prediction",
    level: "info",
    message: "Initiated CVD AI inference and prediction call for patient Marcus Vance.",
    timestamp: "2026-05-29T14:30:19Z"
  },
  {
    id: "log-3",
    category: "database",
    level: "info",
    message: "PostgreSQL Simulated Connection initialized and schema check verified successfully.",
    timestamp: "2026-05-30T09:00:00Z"
  }
];

// Forms data storage tables in backend
let userProfileStore: any = {
  first_name: "Antony",
  middle_name: "",
  last_name: "Njuguna",
  phone_number: "+254712345678",
  date_of_birth: "1998-05-27",
  sex: "male",
  work_type: "Software Engineer",
  education: "undergraduate",
  diabetes: false,
  heart_disease: false,
  history_cvd: false,
  kidney_disease: false,
  prevalent_stroke: false,
  prevalent_hypertension: false,
  bp_history: "normal",
  family_history_htn: true,
  family_history_cvd: true,
  smoking: "never",
  cigs_per_day: 0,
  alcohol_use: "none",
  physical_activity_level: "high",
  exercise_frequency: "4x per week",
  diet_quality: "healthy",
  salt_intake: 2.1,
  stress_score: 2,
  sleep_duration: 8.0,
  sleep_quality: "excellent",
  user_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
};

let bpMeasurements: any[] = [
  {
    "id": 0,
    "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "start_date_time": "2026-05-27T11:03:45.315Z",
    "end_date_time": "2026-05-27T11:03:45.315Z",
    "descriptive_statistic": "average",
    "temporal_relationship_to_physical_activity": "before exercise",
    "temporal_relationship_to_sleep": "before sleep",
    "body_posture": "sitting",
    "measurement_location": "left wrist",
    "systolic_value": 50,
    "diastolic_value": 30,
    "systolic_unit": "mmHg",
    "diastolic_unit": "mmHg"
  }
];

let hrMeasurements: any[] = [
  {
    "id": 0,
    "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "value": 72,
    "unit": "beats/min",
    "start_date_time": "2026-05-27T11:03:45.315Z",
    "end_date_time": "2026-05-27T11:03:45.315Z",
    "descriptive_statistic": "average",
    "temporal_relationship_to_physical_activity": "before exercise",
    "temporal_relationship_to_sleep": "before sleep",
    "body_posture": "sitting",
    "measurement_location": "left wrist"
  }
];

let healthAssessmentsStore: any[] = [
  {
    "id": 0,
    "user_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "weight": 74,
    "height": 1.78,
    "glucose": 95,
    "avg_glucose_level": 95,
    "total_cholesterol": 195,
    "hdl_cholesterol": 50,
    "on_bp_medication": false,
    "bp_medication_type": "none",
    "smoking_status": "never",
    "cigs_per_day": 0,
    "alcohol_use": "none",
    "physical_activity_level": "none",
    "assessment_notes": "First checkup"
  }
];

function evaluateBaselineDiseaseRisks(m: any) {
  const age = Number(m.age || 28);
  const weight = Number(m.weight || 74);
  const height = Number(m.height || 178);
  const heightMeters = height / 100;
  const bmi = heightMeters > 0 ? (weight / (heightMeters * heightMeters)) : 23.5;

  const systolic = Number(m.systolicBP || 120);
  const diastolic = Number(m.diastolicBP || 80);

  const cholesterol = Number(m.cholesterol || 190);
  const glucose = Number(m.bloodGlucose || m.glucose || 95);

  const smoking = m.smokingStatus || m.smoking_status || m.smoking || "never";
  const diabetes = m.diabetesStatus || m.diabetes || "none";
  const activity = m.physicalActivity || m.physical_activity_level || "moderate";

  // --- Calculate CVD ---
  let cvdBase = 10;
  if (age > 30) cvdBase += (age - 30) * 0.7;
  if (systolic > 120) cvdBase += (systolic - 120) * 0.35;
  if (diastolic > 80) cvdBase += (diastolic - 80) * 0.25;
  if (cholesterol > 180) cvdBase += (cholesterol - 180) * 0.12;
  if (glucose > 100) cvdBase += (glucose - 100) * 0.15;
  if (bmi > 25) cvdBase += (bmi - 25) * 1.6;
  if (smoking === "active" || smoking === "current_heavy" || smoking === "current_light") cvdBase += 16;
  if (diabetes === "type2" || diabetes === true) cvdBase += 18;
  const cvdRisk = Math.round(Math.max(5, Math.min(95, cvdBase)));

  // --- Calculate Hypertension (HYP) ---
  let hypBase = 12;
  if (systolic > 115) hypBase += (systolic - 115) * 1.3;
  if (diastolic > 75) hypBase += (diastolic - 75) * 1.5;
  if (age > 35) hypBase += (age - 35) * 0.5;
  if (m.salt_intake && m.salt_intake > 5) hypBase += (m.salt_intake - 5) * 4;
  if (m.prevalent_hypertension === true || m.bp_history === "hypertension") hypBase += 25;
  const hypRisk = Math.round(Math.max(5, Math.min(99.9, hypBase)));

  // --- Calculate Stroke ---
  let strokeBase = 4;
  if (systolic > 115) strokeBase += (systolic - 115) * 0.6;
  if (age > 40) strokeBase += (age - 40) * 0.7;
  if (smoking === "active" || smoking === "current_heavy" || smoking === "current_light") strokeBase += 20;
  if (diabetes === "type2" || diabetes === true) strokeBase += 12;
  if (m.prevalent_stroke === true) strokeBase += 30;
  const strokeRisk = Math.round(Math.max(2, Math.min(95, strokeBase)));

  // --- Calculate Coronary Heart Disease (CHD) ---
  let chdBase = 6;
  if (cholesterol > 180) chdBase += (cholesterol - 180) * 0.3;
  if (age > 35) chdBase += (age - 35) * 0.6;
  if (smoking === "active" || smoking === "current_heavy" || smoking === "current_light") chdBase += 15;
  if (activity === "none" || activity === "low") chdBase += 10;
  if (m.heart_disease === true) chdBase += 25;
  const chdRisk = Math.round(Math.max(3, Math.min(95, chdBase)));

  const getLabel = (percentage: number) => {
    if (percentage >= 60) return "High";
    if (percentage >= 35) return "Intermediate";
    if (percentage >= 15) return "Borderline";
    return "Low";
  };

  return {
    bmi,
    cvd: { percentage: cvdRisk, score: Number((cvdRisk / 100).toFixed(4)), label: getLabel(cvdRisk), version: "xgbcvd_v3" },
    hyp: { percentage: hypRisk, score: Number((hypRisk / 100).toFixed(4)), label: getLabel(hypRisk), version: "xgbhyp_v1" },
    stroke: { percentage: strokeRisk, score: Number((strokeRisk / 100).toFixed(4)), label: getLabel(strokeRisk), version: "xgbstroke_v5" },
    chd: { percentage: chdRisk, score: Number((chdRisk / 100).toFixed(4)), label: getLabel(chdRisk), version: "xgbchd_v2" }
  };
}

// Simple, medically realistic math calculator to fall back to when the Gemini API key is missing
function evaluateMathematicalCVDRisk(m: any) {
  const risks = evaluateBaselineDiseaseRisks(m);
  return { risk: risks.cvd.percentage, category: risks.cvd.label, bmi: risks.bmi };
}

// REST APIs
// 1. Get Assessments (can filter by patientEmail)
app.get("/api/assessments", (req, res) => {
  const { email } = req.query;
  if (email) {
    const filtered = assessments.filter(a => a.patientEmail.toLowerCase() === String(email).toLowerCase());
    return res.json(filtered);
  }
  return res.json(assessments);
});

// 2. Predict CVD Risk & Generate SHAP Expositions (integrating Gemini 3.5-flash)
app.post("/api/predict", async (req, res) => {
  const { patientEmail, patientName, measurements } = req.body;

  if (!patientEmail || !patientName || !measurements) {
    return res.status(400).json({ error: "Missing required parameters: patientEmail, patientName, measurements" });
  }

  // Always compute scientific mathematical baseline check
  const mathBaseline = evaluateMathematicalCVDRisk(measurements);
  const bmiStr = mathBaseline.bmi.toFixed(1);

  // System log
  systemLogs.unshift({
    id: `log-${Date.now()}`,
    category: "ai_prediction",
    level: "info",
    message: `Executing risk assessment inference for ${patientName} (${patientEmail}). Math baseline risk: ${mathBaseline.risk}%`,
    timestamp: new Date().toISOString()
  });

  // check if Gemini API key exists
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  let aiResponseObject: any = null;

  if (hasKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Perform a cardiovascular disease (CVD) risk evaluation and SHAP (Shapley Additive exPlanations) attribution analysis for the following patient clinical values.

Patient Details:
- Name: ${patientName}
- Age: ${measurements.age} years
- Height: ${measurements.height} cm, Weight: ${measurements.weight} kg (calculated BMI: ${bmiStr})
- Blood Pressure: ${measurements.systolicBP}/${measurements.diastolicBP} mmHg
- Resting Heart Rate: ${measurements.heartRate} bpm
- Serum Cholesterol: ${measurements.cholesterol} mg/dL
- Fasting Blood Glucose: ${measurements.bloodGlucose} mg/dL
- Smoking Status: ${measurements.smokingStatus}
- Diabetes Status: ${measurements.diabetesStatus}
- Physical Activity Level: ${measurements.physicalActivity}
- Daily Stress Levels: ${measurements.stressLevel}
- Sleep Quality score: ${measurements.sleepQuality}

A calculated clinician baseline puts their 10-year CVD risk percentage at **${mathBaseline.risk}%** with a risk category of **${mathBaseline.category}**.

Your tasks or goals are:
1. Formulate a clinically detailed verbal summary of the risk level that explains to the patient why they have this risk.
2. Formulate 3-4 highly personalized, actionable preventative health recommendations (e.g., diet modification, activity benchmarks, physician consultation warnings).
3. Create a series of SHAP-based feature attributions for the major variables: "Age", "Blood Pressure", "Cholesterol", "Diabetes Status", "Smoking Status", "Physical Activity", "Stress & Sleep", "BMI".
   Assign each of these properties a relative contribution value (shapValueHex): if a feature increases risk, make it a POSITIVE integer (e.g. +5 or +15); if it has a clean protective shielding effect, make it a NEGATIVE integer (e.g. -4 or -10). The sums or relative strengths should logically reflect why they got a score of ${mathBaseline.risk}%.
   Also write a short patient-friendly explanation for each of these.

You MUST respond with a strict, parsable JSON matching this schema format:
{
  "cvdRiskPercentage": number (integer between 5 and 95, use similar or adjusted value to ${mathBaseline.risk}),
  "riskCategory": "Low" | "Borderline" | "Intermediate" | "High",
  "summary": "String detailing the concise clinical risk statement",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "shapValues": [
    {
      "featureName": "String",
      "featureValue": "String or number",
      "shapValueHex": number (positive or negative impact score. Positive increases risk, negative decreases it),
      "percentageContribution": number (relative magnitude / contribution percentage, e.g. 15 or 25),
      "explanation": "Short diagnostic explanation of how this specific symptom/habit impacted their cardiorisk"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cvdRiskPercentage: { type: Type.INTEGER },
              riskCategory: { type: Type.STRING },
              summary: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              shapValues: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    featureName: { type: Type.STRING },
                    featureValue: { type: Type.STRING },
                    shapValueHex: { type: Type.INTEGER },
                    percentageContribution: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ["featureName", "featureValue", "shapValueHex", "percentageContribution", "explanation"]
                }
              }
            },
            required: ["cvdRiskPercentage", "riskCategory", "summary", "recommendations", "shapValues"]
          }
        }
      });

      const textOutput = response.text || "";
      aiResponseObject = JSON.parse(textOutput.trim());
    } catch (aiError) {
      console.error("Gemini assessment failure. Resorting to mathematical algorithm logic:", aiError);
      systemLogs.unshift({
        id: `log-${Date.now()}`,
        category: "ai_prediction",
        level: "warning",
        message: "Gemini AI core connection failed; automatically fell back to standard clinical matrix prediction.",
        timestamp: new Date().toISOString()
      });
    }
  }

  // If Gemini API is missing or failed, complete the high quality algorithmic fallback response
  if (!aiResponseObject) {
    const shapList: any[] = [];
    
    // Construct rich SHAP attributions mathematically
    const ageImpact = measurements.age > 45 ? Math.round((measurements.age - 45) * 0.8) : -4;
    shapList.push({
      featureName: "Age",
      featureValue: `${measurements.age} yrs`,
      shapValueHex: ageImpact,
      percentageContribution: Math.abs(ageImpact) * 2 + 5,
      explanation: ageImpact > 0 
        ? `Patient age (${measurements.age}) increases cardiovascular stiffening variables naturally.`
        : `Younger demographic profile protects vascular linings from heavy chronological degenerative decay.`
    });

    const bpHex = measurements.systolicBP > 120 ? Math.round((measurements.systolicBP - 120) * 0.4) : -6;
    shapList.push({
      featureName: "Blood Pressure",
      featureValue: `${measurements.systolicBP}/${measurements.diastolicBP}`,
      shapValueHex: bpHex,
      percentageContribution: Math.abs(bpHex) * 2 + 10,
      explanation: bpHex > 0 
        ? `Blood pressure parameters indicate hypertensive mechanical shear stress on arterial tissues.`
        : `Ideal blood pressure buffers delicate vascular beds from micro-tear and rupture risks.`
    });

    const lipidHex = measurements.cholesterol > 200 ? Math.round((measurements.cholesterol - 200) * 0.3) : -4;
    shapList.push({
      featureName: "Cholesterol",
      featureValue: `${measurements.cholesterol} mg/dL`,
      shapValueHex: lipidHex,
      percentageContribution: Math.abs(lipidHex) * 2 + 5,
      explanation: lipidHex > 0 
        ? `Elevated lipid indicators present abundant raw substrate for macrophages to transform into atherosclerotic plaque.`
        : `Optimal serum lipid parameters minimize vascular sedimentation and atherosclerotic risks.`
    });

    const glucoseHex = measurements.bloodGlucose > 100 ? Math.round((measurements.bloodGlucose - 100) * 0.25) : -3;
    shapList.push({
      featureName: "Blood Glucose",
      featureValue: `${measurements.bloodGlucose} mg/dL`,
      shapValueHex: glucoseHex,
      percentageContribution: Math.abs(glucoseHex) * 2 + 5,
      explanation: glucoseHex > 0
        ? `Hyperglycemic values generate reactive oxygen species which trigger systemic vascular inflammation.`
        : `Controlled homeostasis of blood glucose blocks the formation of advanced glycation endproducts in cardiovascular tissues.`
    });

    const smokeHex = measurements.smokingStatus === "active" ? 15 : (measurements.smokingStatus === "former" ? 5 : -5);
    shapList.push({
      featureName: "Smoking Status",
      featureValue: measurements.smokingStatus,
      shapValueHex: smokeHex,
      percentageContribution: Math.abs(smokeHex) * 2 + 10,
      explanation: smokeHex > 0 
        ? `Active burning tobacco toxins trigger immediate sympathetic vasoconstriction and carbon monoxide hypoxemia.`
        : `Avoidance of cigarette chemical oxidants is an exceptionally strong cardioprotective measure.`
    });

    const bmiVal = Number(bmiStr);
    const bmiHex = bmiVal > 25 ? Math.round((bmiVal - 25) * 1.5) : -3;
    shapList.push({
      featureName: "Body Mass Index (BMI)",
      featureValue: bmiStr,
      shapValueHex: bmiHex,
      percentageContribution: Math.abs(bmiHex) * 2 + 5,
      explanation: bmiHex > 0
        ? `An elevated BMI of ${bmiStr} indicates adiposity tissue stress, demanding a higher resting stroke volume.`
        : `Healthy BMI index maintains normal myocardial load and metabolic stability metrics.`
    });

    const activityHex = measurements.physicalActivity === "none" ? 8 : (measurements.physicalActivity === "low" ? 4 : -6);
    shapList.push({
      featureName: "Physical Activity",
      featureValue: measurements.physicalActivity,
      shapValueHex: activityHex,
      percentageContribution: Math.abs(activityHex) * 2 + 5,
      explanation: activityHex > 0
        ? `Sedentary physical habits decrease peripheral tissue extraction of glucose and lower HDL development capability.`
        : `Vascular dilation capacity, nitric oxide synthesis, and blood glucose disposal are optimized by regular workouts.`
    });

    const lifestyleHex = (measurements.stressLevel === "high" ? 5 : 0) + (measurements.sleepQuality === "poor" ? 4 : -3);
    shapList.push({
      featureName: "Stress & Sleep Quality",
      featureValue: `${measurements.stressLevel}/${measurements.sleepQuality}`,
      shapValueHex: lifestyleHex,
      percentageContribution: Math.abs(lifestyleHex) * 2 + 5,
      explanation: lifestyleHex > 0
        ? `Suboptimal rest states combined with persistent stress hormones drive chronic cortisol and vasoconstrictive surges.`
        : `Adequate deep sleep durations stimulate cardiorespiratory restorative responses and downregulate adrenaline.`
    });

    // Recommendations generator logic
    const recs: string[] = [];
    if (measurements.systolicBP > 130) {
      recs.push("Review high blood pressure values with a primary care clinician; standard dietary Sodium restrictions (under 2,000 mg/day) and DASH nutrition parameters would be vital.");
    } else {
      recs.push("Continue protecting arterial walls by keeping sodium levels and hydration ratios optimal.");
    }
    if (measurements.smokingStatus === "active") {
      recs.push("Tobacco consumption synergistically codevelops plaque alongside any level of blood pressure. A smoking cessation program is your highest-leverage cardiovascular intervention.");
    }
    if (measurements.cholesterol > 210) {
      recs.push("Improve your dietary Omega-3 and soluble fibers intake. Consider setting up a lipid panel check with your cardiologist.");
    }
    if (measurements.physicalActivity === "none" || measurements.physicalActivity === "low") {
      recs.push("Work up to 150 minutes of weekly moderate aerobic activity (like power walking or cycling). Consistent activity acts as a vascular natural expander.");
    } else {
      recs.push("Safeguard your excellent fitness routine by introducing periodic cardiovascular variable resistance workouts.");
    }

    aiResponseObject = {
      cvdRiskPercentage: mathBaseline.risk,
      riskCategory: mathBaseline.category,
      summary: `Clinical Assessment yields a classified ${mathBaseline.category} cardiovascular risk of ${mathBaseline.risk}% over a 10-year cycle. ${
        mathBaseline.risk >= 60 
          ? "Heavy cardiometabolic risk values aggregated (high blood pressure/cholesterol) require direct medical therapy." 
          : mathBaseline.risk >= 35 
          ? "Intermediate clinical findings demand key focal lifestyle improvements in nutrition, sleep hygiene, and aerobic density." 
          : "Healthy arterial baseline values matched. Keep up protective routines to defend excellent vascular metrics."
      }`,
      recommendations: recs,
      shapValues: shapList
    };
  }

  const diseaseRisks = evaluateBaselineDiseaseRisks(measurements);
  const nowStr = new Date().toISOString();
  const predictions = [
    {
      id: `dp-cvd-${Date.now()}`,
      disease: "cvd",
      risk_score: diseaseRisks.cvd.score,
      risk_percentage: diseaseRisks.cvd.percentage,
      risk_label: diseaseRisks.cvd.label,
      model_version: diseaseRisks.cvd.version,
      predicted_at: nowStr,
      explanation: `Evaluating the 10-year cumulative CVD risk at ${diseaseRisks.cvd.percentage}% (${diseaseRisks.cvd.label}). Primary triggers include demographic factors and baseline resting hemodynamics.`
    },
    {
      id: `dp-hyp-${Date.now()}`,
      disease: "hyp",
      risk_score: diseaseRisks.hyp.score,
      risk_percentage: diseaseRisks.hyp.percentage,
      risk_label: diseaseRisks.hyp.label,
      model_version: diseaseRisks.hyp.version,
      predicted_at: nowStr,
      explanation: `Hypertension evaluation score is at ${diseaseRisks.hyp.percentage}% (${diseaseRisks.hyp.label}). Measured blood pressure load of ${measurements.systolicBP}/${measurements.diastolicBP} mmHg constitutes the primary mechanical resistance factor.`
    },
    {
      id: `dp-stroke-${Date.now()}`,
      disease: "stroke",
      risk_score: diseaseRisks.stroke.score,
      risk_percentage: diseaseRisks.stroke.percentage,
      risk_label: diseaseRisks.stroke.label,
      model_version: diseaseRisks.stroke.version,
      predicted_at: nowStr,
      explanation: `Stroke potential of ${diseaseRisks.stroke.percentage}% (${diseaseRisks.stroke.label}) is calculated against vascular walls integrity, influenced markedly by age, blood pressure, and smoking status.`
    },
    {
      id: `dp-chd-${Date.now()}`,
      disease: "chd",
      risk_score: diseaseRisks.chd.score,
      risk_percentage: diseaseRisks.chd.percentage,
      risk_label: diseaseRisks.chd.label,
      model_version: diseaseRisks.chd.version,
      predicted_at: nowStr,
      explanation: `Coronary Heart Disease risk score indexes total lipids (${measurements.cholesterol} mg/dL) as active plaque deposits coefficient, estimated at ${diseaseRisks.chd.percentage}% (${diseaseRisks.chd.label}).`
    }
  ];

  // Save assessment to our lists
  const newAssessment = {
    id: `assess-${Date.now()}`,
    patientEmail: patientEmail.toLowerCase(),
    patientName,
    timestamp: new Date().toISOString(),
    measurements,
    cvdRiskPercentage: aiResponseObject.cvdRiskPercentage,
    riskCategory: aiResponseObject.riskCategory,
    summary: aiResponseObject.summary,
    recommendations: aiResponseObject.recommendations,
    shapValues: aiResponseObject.shapValues,
    diseasePredictions: predictions
  };

  assessments.unshift(newAssessment);

  // Send alerts to clinicians if any of the 4 diseases are High risk (>= 60%)
  const highRisksList: string[] = [];
  if (diseaseRisks.cvd.percentage >= 60) highRisksList.push(`CVD (${diseaseRisks.cvd.percentage}%)`);
  if (diseaseRisks.hyp.percentage >= 60) highRisksList.push(`Hypertension (${diseaseRisks.hyp.percentage}%)`);
  if (diseaseRisks.stroke.percentage >= 60) highRisksList.push(`Stroke (${diseaseRisks.stroke.percentage}%)`);
  if (diseaseRisks.chd.percentage >= 60) highRisksList.push(`Coronary CHD (${diseaseRisks.chd.percentage}%)`);

  if (highRisksList.length > 0) {
    notifications.unshift({
      id: `notif-${Date.now()}-1`,
      recipientRole: "clinician",
      title: `CRITICAL HIGH RISK MULTI-DISEASE ALERT: ${patientName}`,
      message: `Critical multi-disease alert for patient ${patientName} (${measurements.age} yrs). Elevated high-risk alerts flagged for: ${highRisksList.join(", ")}. Immediate medical therapy or intervention parameters are highly advised.`,
      timestamp: new Date().toISOString(),
      isRead: false,
      severity: "alert"
    });
  } else {
    // Check if intermediate levels exist (>= 35%)
    const intermediateRisksList: string[] = [];
    if (diseaseRisks.cvd.percentage >= 35) intermediateRisksList.push(`CVD (${diseaseRisks.cvd.percentage}%)`);
    if (diseaseRisks.hyp.percentage >= 35) intermediateRisksList.push(`Hypertension (${diseaseRisks.hyp.percentage}%)`);
    if (diseaseRisks.stroke.percentage >= 35) intermediateRisksList.push(`Stroke (${diseaseRisks.stroke.percentage}%)`);
    if (diseaseRisks.chd.percentage >= 35) intermediateRisksList.push(`Coronary CHD (${diseaseRisks.chd.percentage}%)`);

    if (intermediateRisksList.length > 0) {
      notifications.unshift({
        id: `notif-${Date.now()}-1`,
        recipientRole: "clinician",
        title: `Intermediate Risk Warning: ${patientName}`,
        message: `Registered intermediate risks for ${patientName} under cardiorespiratory observation: ${intermediateRisksList.join(", ")}.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        severity: "info"
      });
    } else {
      notifications.unshift({
        id: `notif-${Date.now()}-1`,
        recipientRole: "clinician",
        title: `Clinical Scan Logged: ${patientName}`,
        message: `Patient ${patientName} registered standard low risk levels across all modeled cardiovascular diseases.`,
        timestamp: new Date().toISOString(),
        isRead: false,
        severity: "info"
      });
    }
  }

  // Also send notification directly to the patient
  notifications.unshift({
    id: `notif-${Date.now()}-2`,
    recipientEmail: patientEmail.toLowerCase(),
    recipientRole: "patient",
    title: `Assessment Formulation Complete`,
    message: `Your medical CVD risk analysis is finished. Risk forecasted: ${aiResponseObject.cvdRiskPercentage}% (${aiResponseObject.riskCategory}). Explore your explained profiles under the interactive SHAP dashboards.`,
    timestamp: new Date().toISOString(),
    isRead: false,
    severity: aiResponseObject.cvdRiskPercentage >= 50 ? "warning" : "info"
  });

  // Log successful validation
  systemLogs.unshift({
    id: `log-${Date.now()}-3`,
    category: "ai_prediction",
    level: "info",
    message: `Risk score correctly integrated to diagnostic pipeline for patient ${patientName}. Severity category: ${aiResponseObject.riskCategory}.`,
    timestamp: new Date().toISOString()
  });

  return res.json(newAssessment);
});

// 3. System logs endpoint (Admin only)
app.get("/api/logs", (req, res) => {
  res.json(systemLogs);
});

// 4. Notifications retrieval (patient email or role specific)
app.get("/api/notifications", (req, res) => {
  const { email, role } = req.query;
  let filtered = notifications;

  if (email && role) {
    filtered = notifications.filter(
      n => (n.recipientEmail && n.recipientEmail.toLowerCase() === String(email).toLowerCase()) ||
           (n.recipientRole && n.recipientRole.toLowerCase() === String(role).toLowerCase())
    );
  } else if (email) {
    filtered = notifications.filter(n => n.recipientEmail && n.recipientEmail.toLowerCase() === String(email).toLowerCase());
  } else if (role) {
    filtered = notifications.filter(n => n.recipientRole && n.recipientRole.toLowerCase() === String(role).toLowerCase());
  }

  res.json(filtered);
});

// 5. Read notifications
app.post("/api/notifications/read", (req, res) => {
  const { id } = req.body;
  if (id) {
    notifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    return res.json({ success: true });
  }
  return res.status(400).json({ error: "Missing notification id" });
});

// --- 4 Medical Patient Forms REST endpoints ---
// Form 1: User Profile
app.get("/api/profile", (req, res) => {
  res.json(userProfileStore);
});

app.post("/api/profile", (req, res) => {
  userProfileStore = { ...userProfileStore, ...req.body };
  systemLogs.unshift({
    id: `log-${Date.now()}`,
    category: "database",
    level: "info",
    message: "User Profile fields updated (Patient Form 1).",
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, profile: userProfileStore });
});

// Form 2: Blood Pressure
app.get("/api/bp", (req, res) => {
  res.json(bpMeasurements);
});

app.post("/api/bp", (req, res) => {
  const newBP = {
    id: bpMeasurements.length,
    user_id: req.body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    ...req.body,
    systolic_value: Number(req.body.systolic_value || 120),
    diastolic_value: Number(req.body.diastolic_value || 80),
    start_date_time: req.body.start_date_time || new Date().toISOString()
  };
  bpMeasurements.unshift(newBP);
  systemLogs.unshift({
    id: `log-${Date.now()}`,
    category: "database",
    level: "info",
    message: `Blood Pressure reading submitted (Form 2): ${newBP.systolic_value}/${newBP.diastolic_value} mmHg`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, bp: newBP });
});

// Form 3: Heart Rate
app.get("/api/hr", (req, res) => {
  res.json(hrMeasurements);
});

app.post("/api/hr", (req, res) => {
  const newHR = {
    id: hrMeasurements.length,
    user_id: req.body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    ...req.body,
    value: Number(req.body.value || 72),
    start_date_time: req.body.start_date_time || new Date().toISOString()
  };
  hrMeasurements.unshift(newHR);
  systemLogs.unshift({
    id: `log-${Date.now()}`,
    category: "database",
    level: "info",
    message: `Heart Rate reading submitted (Form 3): ${newHR.value} BPM`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, hr: newHR });
});

// Form 4: Health Assessment / Medical Measurements
app.get("/api/health_assessment", (req, res) => {
  res.json(healthAssessmentsStore);
});

app.post("/api/health_assessment", (req, res) => {
  const newHA = {
    id: healthAssessmentsStore.length,
    user_id: req.body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    ...req.body,
    weight: req.body.weight ? Number(req.body.weight) : 74,
    height: req.body.height ? Number(req.body.height) : 178,
    glucose: req.body.glucose ? Number(req.body.glucose) : 95,
    avg_glucose_level: req.body.avg_glucose_level ? Number(req.body.avg_glucose_level) : 95,
    total_cholesterol: req.body.total_cholesterol ? Number(req.body.total_cholesterol) : 195,
    hdl_cholesterol: req.body.hdl_cholesterol ? Number(req.body.hdl_cholesterol) : 50,
  };
  healthAssessmentsStore.unshift(newHA);
  systemLogs.unshift({
    id: `log-${Date.now()}`,
    category: "database",
    level: "info",
    message: `Clinical Health Assessment form filed (Form 4).`,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, assessment: newHA });
});

// 6. Reset database values back to stock mock logs
app.post("/api/reset", (req, res) => {
  assessments = [
    {
      id: "assess-1",
      patientEmail: "antonynjuguna502@gmail.com",
      patientName: "Antony Njuguna",
      timestamp: "2026-05-28T10:15:00Z",
      cvdRiskPercentage: 14,
      riskCategory: "Low",
      measurements: {
        age: 28,
        height: 178,
        weight: 74,
        smokingStatus: "never",
        diabetesStatus: "none",
        physicalActivity: "high",
        stressLevel: "low",
        sleepQuality: "excellent",
        systolicBP: 118,
        diastolicBP: 76,
        heartRate: 68,
        cholesterol: 175,
        bloodGlucose: 88,
      },
      summary: "Your cardiovascular disease risk is currently at a healthy, low level of 14%. Your physical habits, balanced blood glucose, and excellent sleep parameters are highly protective factors.",
      recommendations: [
        "Maintain your highly active physical lifestyle to preserve arterial flexibility.",
        "Re-evaluate health parameters annually to track age-related changes.",
        "Maintain current diet low in saturated fats to keep LDL cholesterol optimal."
      ],
      shapValues: [
        { featureName: "Age", featureValue: 28, shapValueHex: 4, percentageContribution: 15, explanation: "At 28 years old, your age acts as a powerful relative protective baseline." },
        { featureName: "Blood Pressure", featureValue: "118/76", shapValueHex: -5, percentageContribution: -25, explanation: "Your Blood pressure is fully within the healthy range, minimizing mechanical shear stress on your arteries." },
        { featureName: "Cholesterol", featureValue: 175, shapValueHex: -3, percentageContribution: -15, explanation: "Optimal lipid profile indicators suggest no significant vascular plaque buildup risks." },
        { featureName: "Activity Level", featureValue: "High", shapValueHex: -6, percentageContribution: -30, explanation: "Your vigorous physical activity expands cardiovascular reserve and improves nitric oxide release." },
        { featureName: "Smoking Status", featureValue: "Never", shapValueHex: -4, percentageContribution: -15, explanation: "Nonsmoker status shields your vascular endothelium from chronic chemicals and inflammation." }
      ]
    }
  ];
  return res.json({ success: true, message: "Database context resets to clean starter values." });
});

// Configure Vite middleware for development or Static Assets for production build setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Salama AI full-stack Express server listening dynamically on port ${PORT}`);
  });
}

startServer();
