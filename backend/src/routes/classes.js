import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

router.get('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const [rows] = await db.execute(
      'SELECT * FROM classes WHERE institution_id = ? ORDER BY name',
      [institutionId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const id = uuidv4();
    const { name, section, teacher_id, capacity } = req.body;

    await db.execute(
      'INSERT INTO classes (id, institution_id, name, section, teacher_id, capacity) VALUES (?, ?, ?, ?, ?, ?)',
      [id, institutionId, name, section || null, teacher_id || null, capacity || null]
    );

    const [created] = await db.execute('SELECT * FROM classes WHERE id = ?', [id]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    await db.execute('DELETE FROM classes WHERE id = ? AND institution_id = ?', [req.params.id, institutionId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
