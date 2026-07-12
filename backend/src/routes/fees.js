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
      `SELECT f.*, s.first_name, s.last_name, s.admission_no
       FROM fee_payments f
       JOIN students s ON s.id = f.student_id
       WHERE f.institution_id = ?
       ORDER BY f.created_at DESC`,
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
    const { student_id, fee_type, total_amount, paid_amount, due_date, payment_date, status, receipt_no } = req.body;

    await db.execute(
      `INSERT INTO fee_payments (id, institution_id, student_id, fee_type, total_amount, paid_amount, due_date, payment_date, status, receipt_no)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, institutionId, student_id, fee_type || null, total_amount || 0, paid_amount || 0,
        due_date || null, payment_date || null, status || 'pending', receipt_no || null]
    );

    const [created] = await db.execute(
      `SELECT f.*, s.first_name, s.last_name, s.admission_no FROM fee_payments f JOIN students s ON s.id = f.student_id WHERE f.id = ?`,
      [id]
    );
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const feeId = req.params.id;
    const fields = Object.keys(req.body);
    if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await db.execute(
      `UPDATE fee_payments SET ${setClause} WHERE id = ? AND institution_id = ?`,
      [...fields.map(f => req.body[f]), feeId, institutionId]
    );

    const [updated] = await db.execute(
      `SELECT f.*, s.first_name, s.last_name, s.admission_no FROM fee_payments f JOIN students s ON s.id = f.student_id WHERE f.id = ?`,
      [feeId]
    );
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
