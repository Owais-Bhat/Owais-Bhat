import { adminClient, authClient } from '../supabase.js';

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export async function requireSuperAdmin(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const { data: userData, error: userError } = await authClient.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .select('id, user_id, institution_id, role, is_active, first_name, last_name')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({ error: 'Profile not found' });
    }

    if (profile.is_active === false || profile.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }

    req.auth = {
      user: userData.user,
      profile,
      token,
    };
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Authentication failed' });
  }
}
