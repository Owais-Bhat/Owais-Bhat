import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../lib/db.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

// Get all students
router.get('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const [rows] = await db.execute(
      'SELECT * FROM students WHERE institution_id = ? ORDER BY created_at DESC', 
      [institutionId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a student
router.post('/', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const id = uuidv4();
    const { 
      admission_no, first_name, last_name, email, phone, dob, 
      gender, address, class_name, section, parent_name, 
      parent_phone, parent_email, status 
    } = req.body;

    await db.execute(`
      INSERT INTO students (
        id, institution_id, admission_no, first_name, last_name, email, phone, 
        dob, gender, address, class_name, section, parent_name, parent_phone, 
        parent_email, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, institutionId, admission_no || null, first_name, last_name || null, email || null, phone || null,
      dob || null, gender || null, address || null, class_name || null, section || null, parent_name || null,
      parent_phone || null, parent_email || null, status || 'active'
    ]);

    const [newStudent] = await db.execute('SELECT * FROM students WHERE id = ?', [id]);
    res.status(201).json(newStudent[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a student
router.put('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const studentId = req.params.id;

    // Build update query dynamically
    const fields = Object.keys(req.body);
    const values = Object.values(req.body);

    if (fields.length === 0) return res.status(400).json({ error: 'No data provided' });

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    await db.execute(
      `UPDATE students SET ${setClause} WHERE id = ? AND institution_id = ?`,
      [...values, studentId, institutionId]
    );

    const [updated] = await db.execute('SELECT * FROM students WHERE id = ?', [studentId]);
    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    const studentId = req.params.id;

    await db.execute(
      'DELETE FROM students WHERE id = ? AND institution_id = ?',
      [studentId, institutionId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
