import { adminClient } from '../supabase.js';

function getRequestIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

export async function recordAuditEvent(req, {
  institutionId,
  action,
  description,
  entityType = null,
  entityId = null,
  severity = 'info',
  metadata = {},
}) {
  if (!institutionId || !action) return null;

  const { data, error } = await adminClient
    .from('activity_log')
    .insert([{
      institution_id: institutionId,
      user_id: req.auth?.user?.id || null,
      action,
      description,
      entity_type: entityType,
      entity_id: entityId,
      severity,
      ip_address: getRequestIp(req),
      user_agent: req.headers['user-agent'] || null,
      metadata: {
        actor_profile_id: req.auth?.profile?.id || null,
        actor_role: req.auth?.profile?.role || null,
        ...metadata,
      },
    }])
    .select()
    .single();

  if (error) {
    console.warn('recordAuditEvent failed:', error.message);
    return null;
  }

  return data;
}
