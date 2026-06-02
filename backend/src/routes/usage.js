import express from 'express';
import { adminClient } from '../supabase.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';
import { FEATURE_CATALOG } from '../saas/features.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

router.post('/track', async (req, res, next) => {
  try {
    const { featureKey, eventType = 'view', metadata = {} } = req.body || {};
    const { profile } = req.auth;

    if (!profile.institution_id) {
      return res.status(400).json({ error: 'Usage events require an institution account' });
    }

    const knownFeature = FEATURE_CATALOG.some(feature => feature.key === featureKey);
    if (!knownFeature) {
      return res.status(400).json({ error: 'Unknown feature key' });
    }

    const { data, error } = await adminClient
      .from('feature_usage_events')
      .insert([{
        institution_id: profile.institution_id,
        user_id: profile.user_id,
        feature_key: featureKey,
        event_type: eventType,
        metadata,
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ event: data });
  } catch (err) {
    next(err);
  }
});

export default router;
