import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

// Get attendance for a specific date, joined with student names
router.get('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const { date } = req.query;
    if (!institutionId || !date) return res.status(400).json({ error: 'institution and date are required' });

    const [rows] = await db.execute(
      `SELECT a.*, s.first_name, s.last_name, s.admission_no
       FROM attendance a
       JOIN students s ON s.id = a.student_id
       WHERE a.institution_id = ? AND a.date = ?`,
      [institutionId, date]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance status/date rows within a date range (for overviews/trends)
router.get('/range', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const { from, to } = req.query;
    if (!institutionId || !from || !to) return res.status(400).json({ error: 'institution, from, and to are required' });

    const [rows] = await db.execute(
      'SELECT date, status FROM attendance WHERE institution_id = ? AND date >= ? AND date <= ?',
      [institutionId, from, to]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk mark attendance (upsert on institution_id+student_id+date)
router.post('/mark', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const { records } = req.body; // [{ student_id, class_name, date, status }]
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'records array is required' });
    }

    const markedBy = req.auth.profile.id;
    for (const r of records) {
      await db.execute(
        `INSERT INTO attendance (id, institution_id, student_id, class_name, date, status, marked_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), class_name = VALUES(class_name), marked_by = VALUES(marked_by)`,
        [uuidv4(), institutionId, r.student_id, r.class_name || null, r.date, r.status, markedBy]
      );
    }

    res.json({ success: true, count: records.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
