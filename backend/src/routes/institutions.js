import express from 'express';
import db from '../lib/db.js';
import { requireAuthenticatedProfile } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuthenticatedProfile);

// Get current user's institution
router.get('/current', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) {
      return res.json(null);
    }

    const [rows] = await db.execute('SELECT * FROM institutions WHERE id = ?', [institutionId]);
    res.json(rows[0] || null);
  } catch (error) {
    console.error('Institution fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update institution settings
router.put('/settings', async (req, res) => {
  try {
    const institutionId = req.auth.profile.institution_id;
    if (!institutionId) return res.status(400).json({ error: 'No institution' });

    const { settings } = req.body;
    await db.execute('UPDATE institutions SET settings = ? WHERE id = ?', [JSON.stringify(settings), institutionId]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
