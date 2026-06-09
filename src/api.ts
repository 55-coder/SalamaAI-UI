const env = (import.meta as any).env as Record<string, string | undefined>;

export const API_BASE = env.VITE_API_URL || 'https://nestor014-salamaai-api.hf.space';
export const API_TOKEN = env.VITE_API_TOKEN;
export const AUTH_STORAGE_KEY = 'salama_ai_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return API_TOKEN || null;
  }
  return window.localStorage.getItem(AUTH_STORAGE_KEY) || API_TOKEN || null;
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_STORAGE_KEY, token);
  }
}

export function clearStoredToken() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function buildHeaders(customHeaders?: HeadersInit, forceContentType?: string) {
  const headers = new Headers(customHeaders);
  if (forceContentType) {
    headers.set('Content-Type', forceContentType);
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = buildHeaders(init.headers, undefined);
  const response = await fetch(url, { ...init, headers });
  return response;
}

export async function loginUser(email: string, password: string) {
  const form = new URLSearchParams();
  form.set('username', email);
  form.set('password', password);

  const response = await apiFetch('/auth/jwt/login', {
    method: 'POST',
    headers: buildHeaders(undefined, 'application/x-www-form-urlencoded'),
    body: form.toString(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `Login failed with status ${response.status}`);
  }

  if (data.access_token) {
    saveToken(data.access_token);
  }

  return data;
}

export async function registerUser(email: string, password: string, role: string) {
  const response = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      role,
      is_active: true,
      is_verified: true,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || `Registration failed with status ${response.status}`);
  }

  return data;
}

export async function getCurrentUser() {
  return apiFetch('/users/me');
}

export async function getUsers() {
  return apiFetch('/users');
}

export async function getUserProfile() {
  return apiFetch('/profiles/profiles');
}

export async function createUserProfile(payload: any) {
  return apiFetch('/profiles/profiles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUserProfile(payload: any) {
  return apiFetch('/profiles/profiles', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getBloodPressure() {
  return apiFetch('/health_data/blood-pressure/');
}

export async function createBloodPressure(payload: any) {
  return apiFetch('/health_data/blood-pressure/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getHeartRate() {
  return apiFetch('/health_data/heart-rate/');
}

export async function createHeartRate(payload: any) {
  return apiFetch('/health_data/heart-rate/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getHealthAssessments() {
  return apiFetch('/health_data/health-assessment/');
}

export async function createHealthAssessment(payload: any) {
  return apiFetch('/health_data/health-assessment/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function runPredictions(diseases: string[] = ['cvd', 'hyp', 'stroke', 'chd']) {
  return apiFetch('/predictions/predictions/run', {
    method: 'POST',
    body: JSON.stringify({ diseases }),
  });
}

export async function getPredictionHistory() {
  return apiFetch('/predictions/predictions/history');
}

export async function getPredictionExplainability(riskAssessmentId: string) {
  return apiFetch(`/predictions/predictions/explain/${riskAssessmentId}`);
}

export async function diagnosePredictions() {
  return apiFetch('/predictions/predictions/diagnose');
}
