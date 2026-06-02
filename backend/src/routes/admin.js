import express from 'express';
import { adminClient } from '../supabase.js';
import { requireSuperAdmin } from '../middleware/auth.js';
import { recordAuditEvent } from '../lib/audit.js';
import { FEATURE_CATALOG, getBillingState, getPlanFeatureMap, getPlanLimits } from '../saas/features.js';

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
  const [institutionsRes, profilesRes, studentsRes] = await Promise.all([
    adminClient.from('institutions').select('*').order('created_at', { ascending: false }),
    adminClient.from('user_profiles').select('id, institution_id, role, is_active'),
    adminClient.from('students').select('id, institution_id, status'),
  ]);

  if (institutionsRes.error) throw institutionsRes.error;
  if (profilesRes.error) throw profilesRes.error;
  if (studentsRes.error) throw studentsRes.error;

  const userCounts = (profilesRes.data || []).reduce((acc, profile) => {
    if (!profile.institution_id) return acc;
    acc[profile.institution_id] = (acc[profile.institution_id] || 0) + 1;
    return acc;
  }, {});

  const studentCounts = (studentsRes.data || []).reduce((acc, student) => {
    if (!student.institution_id) return acc;
    acc[student.institution_id] = (acc[student.institution_id] || 0) + 1;
    return acc;
  }, {});

  return (institutionsRes.data || []).map(institution => ({
    ...institution,
    user_count: userCounts[institution.id] || 0,
    student_count: studentCounts[institution.id] || 0,
    suspended: institution.settings?.suspended === true,
    billing_state: getBillingState(institution),
    plan_limits: getPlanLimits(institution.subscription_plan || 'free'),
    over_limits: {
      users: getPlanLimits(institution.subscription_plan || 'free').users !== null
        && (userCounts[institution.id] || 0) > getPlanLimits(institution.subscription_plan || 'free').users,
      students: getPlanLimits(institution.subscription_plan || 'free').students !== null
        && (studentCounts[institution.id] || 0) > getPlanLimits(institution.subscription_plan || 'free').students,
    },
    enabled_modules: getPlanFeatureMap(
      institution.subscription_plan || 'free',
      institution.settings?.modules || {}
    ),
  }));
}

router.get('/features', (req, res) => {
  res.json({ features: FEATURE_CATALOG });
});

router.get('/usage', async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await adminClient
      .from('feature_usage_events')
      .select('institution_id, feature_key, event_type, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const institutionUsage = {};
    const featureUsage = {};

    for (const event of data || []) {
      const institutionId = event.institution_id;
      institutionUsage[institutionId] ||= {
        total_events: 0,
        last_seen_at: event.created_at,
        features: {},
      };

      institutionUsage[institutionId].total_events += 1;
      if (new Date(event.created_at) > new Date(institutionUsage[institutionId].last_seen_at)) {
        institutionUsage[institutionId].last_seen_at = event.created_at;
      }

      institutionUsage[institutionId].features[event.feature_key] ||= {
        count: 0,
        last_seen_at: event.created_at,
      };
      institutionUsage[institutionId].features[event.feature_key].count += 1;
      if (new Date(event.created_at) > new Date(institutionUsage[institutionId].features[event.feature_key].last_seen_at)) {
        institutionUsage[institutionId].features[event.feature_key].last_seen_at = event.created_at;
      }

      featureUsage[event.feature_key] ||= {
        count: 0,
        institution_ids: new Set(),
        last_seen_at: event.created_at,
      };
      featureUsage[event.feature_key].count += 1;
      featureUsage[event.feature_key].institution_ids.add(institutionId);
      if (new Date(event.created_at) > new Date(featureUsage[event.feature_key].last_seen_at)) {
        featureUsage[event.feature_key].last_seen_at = event.created_at;
      }
    }

    res.json({
      since,
      institutions: institutionUsage,
      features: Object.fromEntries(
        Object.entries(featureUsage).map(([key, usage]) => [
          key,
          {
            count: usage.count,
            institution_count: usage.institution_ids.size,
            last_seen_at: usage.last_seen_at,
          },
        ])
      ),
      unused_features: FEATURE_CATALOG
        .filter(feature => !featureUsage[feature.key])
        .map(feature => feature.key),
    });
  } catch (err) {
    next(err);
  }
});

router.get('/audit', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const institutionId = cleanText(req.query.institutionId);

    let query = adminClient
      .from('activity_log')
      .select('id, institution_id, user_id, action, description, entity_type, entity_id, severity, ip_address, user_agent, metadata, created_at, institutions(name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (institutionId) {
      query = query.eq('institution_id', institutionId);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ events: data || [] });
  } catch (err) {
    next(err);
  }
});

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
      billingEmail,
      trialDays = 14,
      modules,
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

    const allowedPlans = ['free', 'starter', 'growth', 'pro', 'enterprise'];
    const plan = cleanText(subscription_plan) || 'free';
    if (!allowedPlans.includes(plan)) {
      return res.status(400).json({ error: `Invalid plan. Use one of: ${allowedPlans.join(', ')}` });
    }

    const normalizedTrialDays = Math.max(0, Math.min(Number(trialDays) || 0, 365));
    const requestedModules = modules && typeof modules === 'object' ? modules : {};
    const moduleMap = getPlanFeatureMap(plan, requestedModules);

    const { data: institution, error: institutionError } = await adminClient
      .from('institutions')
      .insert([{
        name: cleanText(name),
        type: cleanText(type),
        address: cleanText(address),
        phone: cleanText(phone),
        email: normalizeEmail(email),
        billing_email: normalizeEmail(billingEmail || email),
        subscription_plan: plan,
        subscription_status: normalizedTrialDays > 0 ? 'trialing' : 'active',
        trial_ends_at: normalizedTrialDays > 0
          ? new Date(Date.now() + normalizedTrialDays * 24 * 60 * 60 * 1000).toISOString()
          : null,
        settings: {
          modules: moduleMap,
          suspended: false,
          onboarding: {
            provisioned_at: new Date().toISOString(),
            provisioned_by: req.auth?.profile?.id || null,
            checklist_dismissed_at: null,
          },
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

    await recordAuditEvent(req, {
      institutionId: institution.id,
      action: 'institution.created',
      description: `Created institution ${institution.name}`,
      entityType: 'institution',
      entityId: institution.id,
      severity: 'success',
      metadata: {
        plan: institution.subscription_plan,
        trial_days: normalizedTrialDays,
        enabled_feature_count: Object.values(moduleMap).filter(Boolean).length,
        admin_profile_id: profile.id,
        admin_email: normalizeEmail(adminEmail),
      },
    });

    res.status(201).json({ institution, adminUser: authData.user, profile });
  } catch (err) {
    next(err);
  }
});

router.post('/subscription', async (req, res, next) => {
  try {
    const {
      institutionId,
      status,
      billingEmail,
      trialEndsAt,
      currentPeriodEndsAt,
    } = req.body || {};

    requireFields({ institutionId, status }, ['institutionId', 'status']);

    const allowedStatuses = ['trialing', 'active', 'past_due', 'suspended', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Use one of: ${allowedStatuses.join(', ')}` });
    }

    const payload = {
      subscription_status: status,
    };

    if (billingEmail !== undefined) payload.billing_email = normalizeEmail(billingEmail);
    if (trialEndsAt !== undefined) payload.trial_ends_at = trialEndsAt || null;
    if (currentPeriodEndsAt !== undefined) payload.current_period_ends_at = currentPeriodEndsAt || null;

    const { data, error } = await adminClient
      .from('institutions')
      .update(payload)
      .eq('id', institutionId)
      .select()
      .single();

    if (error) throw error;

    await recordAuditEvent(req, {
      institutionId,
      action: 'subscription.updated',
      description: `Updated subscription status to ${status}`,
      entityType: 'institution',
      entityId: data.id,
      severity: ['past_due', 'suspended', 'cancelled'].includes(status) ? 'warning' : 'info',
      metadata: {
        status,
        billing_email: payload.billing_email,
        trial_ends_at: payload.trial_ends_at,
        current_period_ends_at: payload.current_period_ends_at,
      },
    });

    res.json({
      institution: {
        ...data,
        billing_state: getBillingState(data),
        plan_limits: getPlanLimits(data.subscription_plan || 'free'),
      },
    });
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

    await recordAuditEvent(req, {
      institutionId,
      action: 'user.invited',
      description: `Invited ${normalizeEmail(email)} as ${cleanText(role)}`,
      entityType: 'user_profile',
      entityId: profile.id,
      severity: 'info',
      metadata: {
        invited_email: normalizeEmail(email),
        invited_role: cleanText(role),
      },
    });

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

    const { data: currentInstitution, error: currentError } = await adminClient
      .from('institutions')
      .select('id, subscription_plan, settings')
      .eq('id', institutionId)
      .single();

    if (currentError || !currentInstitution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const nextSettings = {
      ...(currentInstitution.settings || {}),
      modules: getPlanFeatureMap(plan, currentInstitution.settings?.modules || {}),
    };

    const { data, error } = await adminClient
      .from('institutions')
      .update({ subscription_plan: plan, settings: nextSettings })
      .eq('id', institutionId)
      .select()
      .single();

    if (error) throw error;
    await recordAuditEvent(req, {
      institutionId,
      action: 'plan.changed',
      description: `Changed plan to ${plan}`,
      entityType: 'institution',
      entityId: data.id,
      severity: 'info',
      metadata: {
        previous_plan: currentInstitution.subscription_plan,
        next_plan: plan,
      },
    });
    res.json({ institution: data });
  } catch (err) {
    next(err);
  }
});

router.post('/set-feature', async (req, res, next) => {
  try {
    const { institutionId, featureKey, enabled } = req.body || {};
    requireFields({ institutionId, featureKey }, ['institutionId', 'featureKey']);

    const knownFeature = FEATURE_CATALOG.some(feature => feature.key === featureKey);
    if (!knownFeature) {
      return res.status(400).json({ error: 'Unknown feature key' });
    }

    const { data: institution, error: fetchError } = await adminClient
      .from('institutions')
      .select('id, subscription_plan, settings')
      .eq('id', institutionId)
      .single();

    if (fetchError || !institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    const nextSettings = {
      ...(institution.settings || {}),
      modules: {
        ...getPlanFeatureMap(institution.subscription_plan || 'free', institution.settings?.modules || {}),
        [featureKey]: Boolean(enabled),
      },
    };

    const { data: updatedInstitution, error: updateError } = await adminClient
      .from('institutions')
      .update({ settings: nextSettings })
      .eq('id', institutionId)
      .select()
      .single();

    if (updateError) throw updateError;

    await recordAuditEvent(req, {
      institutionId,
      action: 'feature.updated',
      description: `${Boolean(enabled) ? 'Enabled' : 'Disabled'} feature ${featureKey}`,
      entityType: 'feature',
      entityId: updatedInstitution.id,
      severity: 'info',
      metadata: {
        feature_key: featureKey,
        enabled: Boolean(enabled),
      },
    });

    res.json({
      institution: {
        ...updatedInstitution,
        enabled_modules: getPlanFeatureMap(
          updatedInstitution.subscription_plan || 'free',
          updatedInstitution.settings?.modules || {}
        ),
      },
    });
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

    await recordAuditEvent(req, {
      institutionId,
      action: suspended ? 'institution.suspended' : 'institution.reactivated',
      description: suspended ? 'Suspended institution access' : 'Reactivated institution access',
      entityType: 'institution',
      entityId: updatedInstitution.id,
      severity: suspended ? 'warning' : 'success',
      metadata: {
        suspended: Boolean(suspended),
        reason: cleanText(reason),
      },
    });

    res.json({ institution: updatedInstitution });
  } catch (err) {
    next(err);
  }
});

export default router;
