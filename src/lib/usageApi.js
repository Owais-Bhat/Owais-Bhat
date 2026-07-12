import supabase from './supabase';
import { API_BASE_URL } from '../config';

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data?.session?.access_token;
}

export async function trackFeatureUsage(featureKey, eventType = 'view', metadata = {}) {
  const token = await getAccessToken();
  if (!token || !featureKey) return null;

  const response = await fetch(`${API_BASE_URL}/usage/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ featureKey, eventType, metadata }),
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
