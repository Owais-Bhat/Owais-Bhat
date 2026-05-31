import express from 'express';
import { adminClient } from '../supabase.js';
import { requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireSuperAdmin);

function requireFields(body, fields) {
  const missing = fields.filter(field => !String(body[field] ?? '').trim());
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail(email) {
  return cleanText(email)?.toLowerCase();
}

async function getInstitutionsWithUserCounts() {
  const [institutionsRes, profilesRes] = await Promise.all([
    adminClient.from('institutions').select('*').order('created_at', { ascending: false }),
    adminClient.from('user_profiles').select('id, institution_id, role, is_active'),
  ]);

  if (institutionsRes.error) throw institutionsRes.error;
  if (profilesRes.error) throw profilesRes.error;

  const userCounts = (profilesRes.data || []).reduce((acc, profile) => {
    if (!profile.institution_id) return acc;
    acc[profile.institution_id] = (acc[profile.institution_id] || 0) + 1;
    return acc;
  }, {});

  return (institutionsRes.data || []).map(institution => ({
    ...institution,
    user_count: userCounts[institution.id] || 0,
    suspended: institution.settings?.suspended === true,
  }));
}

router.get('/institutions', async (req, res, next) => {
  try {
    const institutions = await getInstitutionsWithUserCounts();
    res.json({ institutions });
  } catch (err) {
    next(err);
  }
});

router.post('/institutions', async (req, res, next) => {
  try {
    const {
      name,
      type = 'School',
      address = '',
      phone = '',
      email,
      subscription_plan = 'free',
      adminEmail,
      adminPassword,
      adminFirstName,
      adminLastName = '',
    } = req.body || {};

    requireFields(
      {
        name,
        email,
        adminEmail,
        adminPassword,
        adminFirstName,
      },
      ['name', 'email', 'adminEmail', 'adminPassword', 'adminFirstName']
    );

    const { data: institution, error: institutionError } = await adminClient
      .from('institutions')
      .insert([{
        name: cleanText(name),
        type: cleanText(type),
        address: cleanText(address),
        phone: cleanText(phone),
        email: normalizeEmail(email),
        subscription_plan: cleanText(subscription_plan) || 'free',
        settings: {
          modules: {},
          suspended: false,
        },
      }])
      .select()
      .single();

    if (institutionError) throw institutionError;

    const { data: authData, error: createUserError } = await adminClient.auth.admin.createUser({
      email: normalizeEmail(adminEmail),
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: cleanText(adminFirstName),
        last_name: cleanText(adminLastName),
        role: 'institution_admin',
      },
    });

    if (createUserError) {
      await adminClient.from('institutions').delete().eq('id', institution.id);
      throw createUserError;
    }

    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .insert([{
        user_id: authData.user.id,
        institution_id: institution.id,
        role: 'institution_admin',
        first_name: cleanText(adminFirstName),
        last_name: cleanText(adminLastName),
        is_active: true,
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ institution, adminUser: authData.user, profile });
  } catch (err) {
    next(err);
  }
});

router.post('/invite-user', async (req, res, next) => {
  try {
    const {
      institutionId,
      email,
      role = 'teacher',
      firstName,
      lastName = '',
      redirectTo,
    } = req.body || {};

    requireFields({ institutionId, email, firstName }, ['institutionId', 'email', 'firstName']);

    const { data: institution, error: institutionError } = await adminClient
      .from('institutions')
      .select('id, name')
      .eq('id', institutionId)
      .single();

    if (institutionError || !institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
      normalizeEmail(email),
      {
        redirectTo,
        data: {
          first_name: cleanText(firstName),
          last_name: cleanText(lastName),
          role: cleanText(role),
          institution_id: institutionId,
        },
      }
    );

    if (inviteError) throw inviteError;

    const { data: profile, error: profileError } = await adminClient
      .from('user_profiles')
      .upsert(
        [{
          user_id: inviteData.user.id,
          institution_id: institutionId,
          role: cleanText(role),
          first_name: cleanText(firstName),
          last_name: cleanText(lastName),
          is_active: true,
        }],
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ user: inviteData.user, profile });
  } catch (err) {
    next(err);
  }
});

router.post('/change-plan', async (req, res, next) => {
  try {
    const { institutionId, plan } = req.body || {};
    requireFields({ institutionId, plan }, ['institutionId', 'plan']);

    const allowedPlans = ['free', 'starter', 'growth', 'pro', 'enterprise'];
    if (!allowedPlans.includes(plan)) {
      return res.status(400).json({ error: `Invalid plan. Use one of: ${allowedPlans.join(', ')}` });
    }

    const { data, error } = await adminClient
      .from('institutions')
      .update({ subscription_plan: plan })
      .eq('id', institutionId)
      .select()
      .single();

    if (error) throw error;
    res.json({ institution: data });
  } catch (err) {
    next(err);
  }
});

router.post('/suspend-institution', async (req, res, next) => {
  try {
    const { institutionId, suspended = true, reason = '' } = req.body || {};
    requireFields({ institutionId }, ['institutionId']);

    const { data: institution, error: fetchError } = await adminClient
      .from('institutions')
      .select('id, settings')
      .eq('id', institutionId)
      .single();

    if (fetchError || !institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const nextSettings = {
      ...(institution.settings || {}),
      suspended: Boolean(suspended),
      suspension_reason: cleanText(reason),
      suspended_at: suspended ? new Date().toISOString() : null,
    };

    const { data: updatedInstitution, error: updateError } = await adminClient
      .from('institutions')
      .update({ settings: nextSettings })
      .eq('id', institutionId)
      .select()
      .single();

    if (updateError) throw updateError;

    const { error: usersError } = await adminClient
      .from('user_profiles')
      .update({ is_active: !suspended })
      .eq('institution_id', institutionId);

    if (usersError) throw usersError;

    res.json({ institution: updatedInstitution });
  } catch (err) {
    next(err);
  }
});

export default router;
