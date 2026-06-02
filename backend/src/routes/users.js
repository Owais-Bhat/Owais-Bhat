import express from 'express';
import { adminClient } from '../supabase.js';
import { requireAuthenticatedProfile, requireTenantAdmin } from '../middleware/auth.js';
import { recordAuditEvent } from '../lib/audit.js';

const router = express.Router();

const ALLOWED_ROLES = ['institution_admin', 'principal', 'teacher', 'student', 'parent', 'staff'];

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail(email) {
  return cleanText(email)?.toLowerCase();
}

function getInstitutionScope(req) {
  const requestedInstitutionId = req.query.institutionId || req.body?.institutionId;
  if (req.auth.profile.role === 'super_admin') return requestedInstitutionId;
  return req.auth.profile.institution_id;
}

router.use(requireAuthenticatedProfile);
router.use(requireTenantAdmin);

router.get('/', async (req, res, next) => {
  try {
    const institutionId = getInstitutionScope(req);
    if (!institutionId) return res.status(400).json({ error: 'institutionId is required' });

    const { data, error } = await adminClient
      .from('user_profiles')
      .select('id, user_id, institution_id, role, first_name, last_name, phone, is_active, created_at')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ users: data || [] });
  } catch (err) {
    next(err);
  }
});

router.post('/invite', async (req, res, next) => {
  try {
    const {
      email,
      role = 'teacher',
      firstName,
      lastName = '',
      temporaryPassword,
      redirectTo,
    } = req.body || {};
    const institutionId = getInstitutionScope(req);

    if (!institutionId || !email || !firstName) {
      return res.status(400).json({ error: 'institutionId, email, and firstName are required' });
    }
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Use one of: ${ALLOWED_ROLES.join(', ')}` });
    }

    const userPayload = {
      email: normalizeEmail(email),
      email_confirm: Boolean(temporaryPassword),
      user_metadata: {
        first_name: cleanText(firstName),
        last_name: cleanText(lastName),
        role,
        institution_id: institutionId,
      },
    };
    if (temporaryPassword) userPayload.password = temporaryPassword;

    const { data: authData, error: userError } = temporaryPassword
      ? await adminClient.auth.admin.createUser(userPayload)
      : await adminClient.auth.admin.inviteUserByEmail(normalizeEmail(email), {
        redirectTo,
        data: userPayload.user_metadata,
      });

    if (userError) throw userError;

    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .upsert(
        [{
          user_id: authData.user.id,
          institution_id: institutionId,
          role,
          first_name: cleanText(firstName),
          last_name: cleanText(lastName),
          is_active: true,
        }],
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (profileError) throw profileError;
    await recordAuditEvent(req, {
      institutionId,
      action: 'user.invited',
      description: `Invited ${normalizeEmail(email)} as ${role}`,
      entityType: 'user_profile',
      entityId: profile.id,
      severity: 'info',
      metadata: {
        invited_email: normalizeEmail(email),
        invited_role: role,
        created_with_password: Boolean(temporaryPassword),
      },
    });

    res.status(201).json({ user: authData.user, profile });
  } catch (err) {
    next(err);
  }
});

router.patch('/:profileId', async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const { role, isActive, firstName, lastName, phone } = req.body || {};
    const institutionId = getInstitutionScope(req);

    if (!institutionId) return res.status(400).json({ error: 'institutionId is required' });
    if (role && !ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Use one of: ${ALLOWED_ROLES.join(', ')}` });
    }

    const { data: previousProfile, error: previousError } = await adminClient
      .from('user_profiles')
      .select('id, role, is_active, first_name, last_name')
      .eq('id', profileId)
      .eq('institution_id', institutionId)
      .single();

    if (previousError) throw previousError;

    const updates = {};
    if (role !== undefined) updates.role = role;
    if (isActive !== undefined) updates.is_active = Boolean(isActive);
    if (firstName !== undefined) updates.first_name = cleanText(firstName);
    if (lastName !== undefined) updates.last_name = cleanText(lastName);
    if (phone !== undefined) updates.phone = cleanText(phone);

    const { data, error } = await adminClient
      .from('user_profiles')
      .update(updates)
      .eq('id', profileId)
      .eq('institution_id', institutionId)
      .select()
      .single();

    if (error) throw error;
    await recordAuditEvent(req, {
      institutionId,
      action: 'user.updated',
      description: `Updated user ${[data.first_name, data.last_name].filter(Boolean).join(' ') || data.id}`,
      entityType: 'user_profile',
      entityId: data.id,
      severity: isActive === false ? 'warning' : 'info',
      metadata: {
        previous_role: previousProfile.role,
        next_role: data.role,
        previous_is_active: previousProfile.is_active,
        next_is_active: data.is_active,
        changed_fields: Object.keys(updates),
      },
    });

    res.json({ profile: data });
  } catch (err) {
    next(err);
  }
});

export default router;
