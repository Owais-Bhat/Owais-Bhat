import jwt from 'jsonwebtoken';
import db from '../lib/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cybermilo-super-secret-key-change-me';

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export async function requireAuthenticatedProfile(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Missing bearer token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const [profiles] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [decoded.userId]);
    const profile = profiles[0];

    if (!profile) {
      return res.status(403).json({ error: 'Profile not found' });
    }

    if (profile.is_active === 0 || profile.is_active === false) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    req.auth = {
      user: { id: decoded.userId },
      profile,
      token,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Authentication failed' });
  }
}

export async function requireSuperAdmin(req, res, next) {
  return requireAuthenticatedProfile(req, res, () => {
    if (req.auth.profile.role !== 'super_admin') {
      return res.status(403).json({ error: 'Super admin access required' });
    }
    next();
  });
}

export function requireTenantAdmin(req, res, next) {
  const role = req.auth?.profile?.role;
  if (!['super_admin', 'institution_admin', 'principal'].includes(role)) {
    return res.status(403).json({ error: 'Tenant admin access required' });
  }
  return next();
}
