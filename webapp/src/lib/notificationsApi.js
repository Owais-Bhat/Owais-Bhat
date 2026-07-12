import supabase from './supabase';

const PAGE_SIZE = 20;

export async function fetchNotifications(profileId, limit = PAGE_SIZE) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id);
  return { error };
}

export async function markAllNotificationsRead(profileId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', profileId)
    .is('read_at', null);
  return { error };
}

export async function createNotification({ institutionId, userId, title, body, type = 'info', link, createdBy }) {
  const { error } = await supabase.from('notifications').insert([{
    institution_id: institutionId,
    user_id: userId,
    title,
    body,
    type,
    link,
    created_by: createdBy,
  }]);
  return { error };
}

/**
 * Fan a notification out to every active user of an institution
 * (excluding the creator). Fire-and-forget from UI code.
 */
export async function notifyInstitution({ institutionId, title, body, type = 'info', link, createdBy }) {
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('institution_id', institutionId)
    .eq('is_active', true);
  if (profileError) return { error: profileError };

  const rows = (profiles || [])
    .filter(p => p.id !== createdBy)
    .map(p => ({
      institution_id: institutionId,
      user_id: p.id,
      title,
      body,
      type,
      link,
      created_by: createdBy,
    }));
  if (rows.length === 0) return { error: null };

  const { error } = await supabase.from('notifications').insert(rows);
  return { error };
}

/**
 * Subscribe to new notifications for a profile. Returns the channel;
 * caller must supabase.removeChannel(channel) on cleanup.
 */
export function subscribeToNotifications(profileId, onInsert) {
  return supabase
    .channel(`notifications-${profileId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${profileId}`,
      },
      (payload) => onInsert(payload.new)
    )
    .subscribe();
}
