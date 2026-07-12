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
      'SELECT * FROM admissions WHERE institution_id = ? ORDER BY applied_at DESC',
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
    const { applicant_name, email, phone, dob, class_applying, parent_name, parent_phone, address, status, remarks } = req.body;

    await db.execute(
      `INSERT INTO admissions (id, institution_id, applicant_name, email, phone, dob, class_applying, parent_name, parent_phone, address, status, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, institutionId, applicant_name, email || null, phone || null, dob || null, class_applying || null,
        parent_name || null, parent_phone || null, address || null, status || 'pending', remarks || null]
    );

    const [created] = await db.execute('SELECT * FROM admissions WHERE id = ?', [id]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const admissionId = req.params.id;
    const fields = Object.keys(req.body);
    if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await db.execute(
      `UPDATE admissions SET ${setClause} WHERE id = ? AND institution_id = ?`,
      [...fields.map(f => req.body[f]), admissionId, institutionId]
    );

    const [updated] = await db.execute('SELECT * FROM admissions WHERE id = ?', [admissionId]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
