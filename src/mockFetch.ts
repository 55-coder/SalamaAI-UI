/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Initial static mock data
const INITIAL_ASSESSMENTS = [
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
      weight: 92,
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
    summary: "Patient presents with a clinical High risk profile (68% 10-year CVD forecast). The synergistic combination of chronic hypertension, elevated serum cholesterol, diagnosed Type-2 Diabetes, and active tobacco smoking induces substantial vascular risk.",
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

const INITIAL_NOTIFICATIONS = [
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
    message: "In-browser simulation successfully completed CVD risk assessment predictions and explanations for Marcus Vance.",
    timestamp: "2026-05-29T14:30:22Z",
    isRead: false,
    severity: "info",
  }
];

const INITIAL_SYSTEM_LOGS = [
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
    message: "In-memory database initialized and schema check verified successfully.",
    timestamp: "2026-05-30T09:00:00Z"
  }
];

const INITIAL_USER_PROFILE_STORE = {
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

const INITIAL_BP_MEASUREMENTS = [
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
    "systolic_value": 118,
    "diastolic_value": 76,
    "systolic_unit": "mmHg",
    "diastolic_unit": "mmHg"
  }
];

const INITIAL_HR_MEASUREMENTS = [
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

const INITIAL_HEALTH_ASSESSMENTS_STORE = [
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

// Helper to calculate mathematical CVD risks
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

// In-memory Database Managers with LocalStorage read/write capabilities
class LocalDB {
  static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(`salama_${key}`);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`salama_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Local storage set issue", e);
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem("salama_assessments");
      localStorage.removeItem("salama_notifications");
      localStorage.removeItem("salama_systemLogs");
      localStorage.removeItem("salama_profile");
      localStorage.removeItem("salama_bpMeasurements");
      localStorage.removeItem("salama_hrMeasurements");
      localStorage.removeItem("salama_healthAssessmentsStore");
    } catch (e) {
      console.error(e);
    }
  }
}

// Intercept window.fetch completely
export function setupMockApiInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    
    // We only intercept '/api/' routes
    if (!urlStr.includes("/api/")) {
      return originalFetch(input, init);
    }

    const pathPart = urlStr.split("/api/")[1].split("?")[0];
    const method = (init?.method || "GET").toUpperCase();

    // 1-to-1 parsing of parameters
    const getQueryParam = (name: string): string | null => {
      try {
        const urlObj = new URL(urlStr, window.location.href);
        return urlObj.searchParams.get(name);
      } catch {
        const matches = urlStr.match(new RegExp(`[?&]${name}=([^&]*)`));
        return matches ? decodeURIComponent(matches[1]) : null;
      }
    };

    const getBodyData = (): any => {
      if (init?.body && typeof init.body === "string") {
        try {
          return JSON.parse(init.body);
        } catch {
          return {};
        }
      }
      return {};
    };

    // Helper to simulate network response
    const jsonResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" }
      });
    };

    // Load active DB
    let assessments = LocalDB.get("assessments", INITIAL_ASSESSMENTS);
    let notifications = LocalDB.get("notifications", INITIAL_NOTIFICATIONS);
    let systemLogs = LocalDB.get("systemLogs", INITIAL_SYSTEM_LOGS);
    let userProfileStore = LocalDB.get("profile", INITIAL_USER_PROFILE_STORE);
    let bpMeasurements = LocalDB.get("bpMeasurements", INITIAL_BP_MEASUREMENTS);
    let hrMeasurements = LocalDB.get("hrMeasurements", INITIAL_HR_MEASUREMENTS);
    let healthAssessmentsStore = LocalDB.get("healthAssessmentsStore", INITIAL_HEALTH_ASSESSMENTS_STORE);

    // Routes Matchers
    switch (pathPart) {
      case "assessments": {
        if (method === "GET") {
          const email = getQueryParam("email");
          if (email) {
            const filtered = assessments.filter(a => a.patientEmail.toLowerCase() === email.toLowerCase());
            return jsonResponse(filtered);
          }
          return jsonResponse(assessments);
        }
        break;
      }

      case "notifications": {
        if (method === "GET") {
          const email = getQueryParam("email");
          const role = getQueryParam("role");
          let filtered = [...notifications];
          if (email) {
            filtered = notifications.filter(n => !n.recipientEmail || n.recipientEmail.toLowerCase() === email.toLowerCase());
          } else if (role) {
            filtered = notifications.filter(n => n.recipientRole && n.recipientRole.toLowerCase() === role.toLowerCase());
          }
          return jsonResponse(filtered);
        }
        break;
      }

      case "notifications/read": {
        if (method === "POST") {
          const { id } = getBodyData();
          if (id) {
            notifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
            LocalDB.set("notifications", notifications);
            return jsonResponse({ success: true });
          }
          return jsonResponse({ error: "Missing notification id" }, 400);
        }
        break;
      }

      case "logs": {
        if (method === "GET") {
          return jsonResponse(systemLogs);
        }
        break;
      }

      case "profile": {
        if (method === "GET") {
          return jsonResponse(userProfileStore);
        }
        if (method === "POST") {
          userProfileStore = { ...userProfileStore, ...getBodyData() };
          LocalDB.set("profile", userProfileStore);

          systemLogs.unshift({
            id: `log-${Date.now()}`,
            category: "database",
            level: "info",
            message: "User Profile fields updated (Patient Form 1).",
            timestamp: new Date().toISOString()
          });
          LocalDB.set("systemLogs", systemLogs);

          return jsonResponse({ success: true, profile: userProfileStore });
        }
        break;
      }

      case "bp": {
        if (method === "GET") {
          return jsonResponse(bpMeasurements);
        }
        if (method === "POST") {
          const body = getBodyData();
          const newBP = {
            id: bpMeasurements.length,
            user_id: body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            ...body,
            systolic_value: Number(body.systolic_value || 120),
            diastolic_value: Number(body.diastolic_value || 80),
            start_date_time: body.start_date_time || new Date().toISOString()
          };
          bpMeasurements.unshift(newBP);
          LocalDB.set("bpMeasurements", bpMeasurements);

          systemLogs.unshift({
            id: `log-${Date.now()}`,
            category: "database",
            level: "info",
            message: `Blood Pressure reading submitted (Form 2): ${newBP.systolic_value}/${newBP.diastolic_value} mmHg`,
            timestamp: new Date().toISOString()
          });
          LocalDB.set("systemLogs", systemLogs);

          return jsonResponse({ success: true, bp: newBP });
        }
        break;
      }

      case "hr": {
        if (method === "GET") {
          return jsonResponse(hrMeasurements);
        }
        if (method === "POST") {
          const body = getBodyData();
          const newHR = {
            id: hrMeasurements.length,
            user_id: body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            ...body,
            value: Number(body.value || 72),
            start_date_time: body.start_date_time || new Date().toISOString()
          };
          hrMeasurements.unshift(newHR);
          LocalDB.set("hrMeasurements", hrMeasurements);

          systemLogs.unshift({
            id: `log-${Date.now()}`,
            category: "database",
            level: "info",
            message: `Heart Rate reading submitted (Form 3): ${newHR.value} BPM`,
            timestamp: new Date().toISOString()
          });
          LocalDB.set("systemLogs", systemLogs);

          return jsonResponse({ success: true, hr: newHR });
        }
        break;
      }

      case "health_assessment": {
        if (method === "GET") {
          return jsonResponse(healthAssessmentsStore);
        }
        if (method === "POST") {
          const body = getBodyData();
          const newHA = {
            id: healthAssessmentsStore.length,
            user_id: body.user_id || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            ...body,
            weight: body.weight ? Number(body.weight) : 74,
            height: body.height ? Number(body.height) : 178,
            glucose: body.glucose ? Number(body.glucose) : 95,
            avg_glucose_level: body.avg_glucose_level ? Number(body.avg_glucose_level) : 95,
            total_cholesterol: body.total_cholesterol ? Number(body.total_cholesterol) : 195,
            hdl_cholesterol: body.hdl_cholesterol ? Number(body.hdl_cholesterol) : 50,
          };
          healthAssessmentsStore.unshift(newHA);
          LocalDB.set("healthAssessmentsStore", healthAssessmentsStore);

          systemLogs.unshift({
            id: `log-${Date.now()}`,
            category: "database",
            level: "info",
            message: `Clinical Health Assessment form recorded (Form 4).`,
            timestamp: new Date().toISOString()
          });
          LocalDB.set("systemLogs", systemLogs);

          return jsonResponse({ success: true, assessment: newHA });
        }
        break;
      }

      case "reset": {
        if (method === "POST") {
          LocalDB.clear();
          return jsonResponse({ success: true, status: "resetted" });
        }
        break;
      }

      case "predict": {
        if (method === "POST") {
          const { patientEmail, patientName, measurements } = getBodyData();
          if (!patientEmail || !patientName || !measurements) {
            return jsonResponse({ error: "Missing required parameters: patientEmail, patientName, measurements" }, 400);
          }

          // Evaluate risk mathematically
          const diseaseRisks = evaluateBaselineDiseaseRisks(measurements);
          const bmiStr = diseaseRisks.bmi.toFixed(1);

          // Build SHAP explanations
          const shapList: any[] = [];
          
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
              ? `Blood pressure parameters indicate hypertensive mechanical strain on arterial tissues.`
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

          // Recommendations generator
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

          const nowStr = new Date().toISOString();
          const generatedReport = {
            id: `assess-${Date.now()}`,
            patientEmail,
            patientName,
            timestamp: nowStr,
            cvdRiskPercentage: diseaseRisks.cvd.percentage,
            riskCategory: diseaseRisks.cvd.label,
            measurements,
            summary: `Clinical Assessment yields a classified ${diseaseRisks.cvd.label} cardiovascular risk of ${diseaseRisks.cvd.percentage}% over a 10-year cycle. ${
              diseaseRisks.cvd.percentage >= 60 
                ? "Heavy cardiometabolic risk values aggregated (high blood pressure/cholesterol) require direct medical therapy." 
                : diseaseRisks.cvd.percentage >= 35 
                ? "Intermediate clinical findings demand key focal lifestyle improvements in nutrition, sleep hygiene, and aerobic density." 
                : "Healthy arterial baseline values matched. Keep up protective routines to defend excellent vascular metrics."
            }`,
            recommendations: recs,
            shapValues: shapList,
            diseasePredictions: [
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
                explanation: `Persistent blood fluid load index registers simulated hypertension risk profile of ${diseaseRisks.hyp.percentage}% (${diseaseRisks.hyp.label}).`
              },
              {
                id: `dp-stroke-${Date.now()}`,
                disease: "stroke",
                risk_score: diseaseRisks.stroke.score,
                risk_percentage: diseaseRisks.stroke.percentage,
                risk_label: diseaseRisks.stroke.label,
                model_version: diseaseRisks.stroke.version,
                predicted_at: nowStr,
                explanation: `Cerebral stroke vulnerability risk assessed at ${diseaseRisks.stroke.percentage}% (${diseaseRisks.stroke.label}) based on age profiles and vascular active hazards.`
              },
              {
                id: `dp-chd-${Date.now()}`,
                disease: "chd",
                risk_score: diseaseRisks.chd.score,
                risk_percentage: diseaseRisks.chd.percentage,
                risk_label: diseaseRisks.chd.label,
                model_version: diseaseRisks.chd.version,
                predicted_at: nowStr,
                explanation: `Coronary supply pathways obstruction potential is rated at ${diseaseRisks.chd.percentage}% (${diseaseRisks.chd.label}) influenced directly by exercise rate and cholesterol markers.`
              }
            ]
          };

          // Save to local db
          assessments.unshift(generatedReport);
          LocalDB.set("assessments", assessments);

          systemLogs.unshift({
            id: `log-${Date.now()}`,
            category: "ai_prediction",
            level: "info",
            message: `In-browser mathematical inference executed. Generated CVD risk score of ${diseaseRisks.cvd.percentage}% for ${patientName}`,
            timestamp: nowStr
          });
          LocalDB.set("systemLogs", systemLogs);

          // Push patient notification of results ready
          const newNotif = {
            id: `notif-${Date.now()}`,
            recipientEmail: patientEmail,
            recipientRole: "patient",
            title: "Analysis Completed",
            message: `Your newest risk evaluation report is now available. Calculated 10-year CVD risk: ${diseaseRisks.cvd.percentage}% (${diseaseRisks.cvd.label}).`,
            timestamp: nowStr,
            isRead: false,
            severity: (diseaseRisks.cvd.percentage >= 60 ? "alert" : "info") as any
          };
          notifications.unshift(newNotif);
          LocalDB.set("notifications", notifications);

          // Push clinician alert if High Risk
          if (diseaseRisks.cvd.percentage >= 60) {
            const clinAlert = {
              id: `notif-clin-${Date.now()}`,
              recipientRole: "clinician",
              title: `HIGH CVD RISK ALERT: ${patientName}`,
              message: `Patient ${patientName} (${measurements.age}M/F) registered a high CVD risk score of ${diseaseRisks.cvd.percentage}%. Immediate review is recommended.`,
              timestamp: nowStr,
              isRead: false,
              severity: "alert" as any
            };
            notifications.unshift(clinAlert);
            LocalDB.set("notifications", notifications);
          }

          return jsonResponse(generatedReport);
        }
        break;
      }

      default:
        break;
    }

    // Default to fallback
    return originalFetch(input, init);
  };
}
