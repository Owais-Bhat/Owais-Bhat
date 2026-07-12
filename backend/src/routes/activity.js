import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

router.post('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const { action, description, entity_type, entity_id } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO activity_log (id, institution_id, user_id, action, description, entity_type, entity_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, institutionId, req.auth.profile.id, action, description || null, entity_type || null, entity_id || null]
    );

    res.status(201).json({ success: true, id });
  } catch (error) {
    // Activity logging is non-critical
    res.status(200).json({ success: false });
  }
});

export default router;
