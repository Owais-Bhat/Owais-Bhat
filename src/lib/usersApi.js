import supabase from './supabase';
import { API_BASE_URL } from '../config';

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const token = data?.session?.access_token;
  if (!token) throw new Error('You must be signed in');
  return token;
}

async function userRequest(path, options = {}) {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE_URL}/users${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Users API failed with ${response.status}`);
  }
  return payload;
}

export function fetchInstitutionUsers(institutionId) {
  const query = institutionId ? `?institutionId=${encodeURIComponent(institutionId)}` : '';
  return userRequest(`/${query}`);
}

export function inviteInstitutionUser(data) {
  return userRequest('/invite', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateInstitutionUser(profileId, data) {
  return userRequest(`/${profileId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
