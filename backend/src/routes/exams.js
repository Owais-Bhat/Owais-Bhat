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
      'SELECT * FROM exams WHERE institution_id = ? ORDER BY exam_date DESC',
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
    const { title, subject, class_name, exam_date, total_marks, pass_marks, status } = req.body;

    await db.execute(
      `INSERT INTO exams (id, institution_id, title, subject, class_name, exam_date, total_marks, pass_marks, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, institutionId, title, subject || null, class_name || null, exam_date || null,
        total_marks || null, pass_marks || null, status || 'upcoming']
    );

    const [created] = await db.execute('SELECT * FROM exams WHERE id = ?', [id]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const examId = req.params.id;
    const fields = Object.keys(req.body);
    if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });
    const setClause = fields.map(f => `${f} = ?`).join(', ');

    await db.execute(
      `UPDATE exams SET ${setClause} WHERE id = ? AND institution_id = ?`,
      [...fields.map(f => req.body[f]), examId, institutionId]
    );

    const [updated] = await db.execute('SELECT * FROM exams WHERE id = ?', [examId]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exam results
router.get('/:id/results', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT r.*, s.first_name, s.last_name, s.admission_no
       FROM exam_results r JOIN students s ON s.id = r.student_id
       WHERE r.exam_id = ?`,
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/results', async (req, res) => {
  try {
    const { student_id, marks_obtained, grade, remarks } = req.body;
    const id = uuidv4();
    await db.execute(
      'INSERT INTO exam_results (id, exam_id, student_id, marks_obtained, grade, remarks) VALUES (?, ?, ?, ?, ?, ?)',
      [id, req.params.id, student_id, marks_obtained ?? null, grade || null, remarks || null]
    );
    const [created] = await db.execute('SELECT * FROM exam_results WHERE id = ?', [id]);
    res.status(201).json(created[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
