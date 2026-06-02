import supabase from './supabase';
import { API_BASE_URL } from '../config';

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) throw new Error('You must be signed in as a super admin');
  return token;
}

async function adminRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Admin API failed with ${response.status}`);
  }
  return payload;
}

export function fetchAdminInstitutions() {
  return adminRequest('/institutions');
}

export function fetchAdminFeatures() {
  return adminRequest('/features');
}

export function fetchAdminUsage() {
  return adminRequest('/usage');
}

export function fetchAdminAudit(params = {}) {
  const query = new URLSearchParams();
  if (params.limit) query.set('limit', params.limit);
  if (params.institutionId) query.set('institutionId', params.institutionId);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return adminRequest(`/audit${suffix}`);
}

export function createAdminInstitution(data) {
  return adminRequest('/institutions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function inviteInstitutionUser(data) {
  return adminRequest('/invite-user', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function changeInstitutionPlan(data) {
  return adminRequest('/change-plan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateInstitutionSubscription(data) {
  return adminRequest('/subscription', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function suspendInstitution(data) {
  return adminRequest('/suspend-institution', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function setInstitutionFeature(data) {
  return adminRequest('/set-feature', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
