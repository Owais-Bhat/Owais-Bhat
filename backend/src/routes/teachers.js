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
      'SELECT * FROM teachers WHERE institution_id = ? ORDER BY created_at DESC',
      [institutionId]
    );
    res.json(rows.map(r => ({ ...r, subjects: r.subjects ? JSON.parse(r.subjects) : [] })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const id = uuidv4();
    const { employee_id, first_name, last_name, email, phone, subjects, qualification, status } = req.body;

    await db.execute(
      `INSERT INTO teachers (id, institution_id, employee_id, first_name, last_name, email, phone, subjects, qualification, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, institutionId, employee_id || null, first_name, last_name || null, email || null, phone || null,
        subjects ? JSON.stringify(subjects) : null, qualification || null, status || 'active']
    );

    const [created] = await db.execute('SELECT * FROM teachers WHERE id = ?', [id]);
    const row = created[0];
    res.status(201).json({ ...row, subjects: row.subjects ? JSON.parse(row.subjects) : [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const teacherId = req.params.id;
    const body = { ...req.body };
    if (body.subjects) body.subjects = JSON.stringify(body.subjects);

    const fields = Object.keys(body);
    if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await db.execute(
      `UPDATE teachers SET ${setClause} WHERE id = ? AND institution_id = ?`,
      [...fields.map(f => body[f]), teacherId, institutionId]
    );

    const [updated] = await db.execute('SELECT * FROM teachers WHERE id = ?', [teacherId]);
    const row = updated[0];
    res.json({ ...row, subjects: row.subjects ? JSON.parse(row.subjects) : [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    await db.execute('DELETE FROM teachers WHERE id = ? AND institution_id = ?', [req.params.id, institutionId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
