import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cybermilo-super-secret-key-change-me';

import { v4 as uuidv4 } from 'uuid';

// Register User
router.post('/register', async (req, res) => {
  try {
    const {
      email, password, firstName, lastName,
      institutionName, institutionType, institutionAddress,
      institutionPhone, institutionEmail,
    } = req.body;
    if (!email || !password || !firstName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await db.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [userId, email, passwordHash]);

    let institutionId = null;
    let role = 'user';

    if (institutionName) {
      institutionId = uuidv4();
      await db.execute(
        'INSERT INTO institutions (id, name, type, address, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
        [institutionId, institutionName, institutionType || 'School', institutionAddress || null, institutionPhone || null, institutionEmail || null]
      );
      role = 'institution_admin'; // First user creating an institution is its admin
    }

    const profileId = uuidv4();
    await db.execute(
      'INSERT INTO user_profiles (id, user_id, institution_id, role, first_name, last_name) VALUES (?, ?, ?, ?, ?, ?)',
      [profileId, userId, institutionId, role, firstName, lastName || '']
    );

    const token = jwt.sign(
      { userId, institutionId, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: userId,
        email,
        profile: { id: profileId, user_id: userId, institution_id: institutionId, role, first_name: firstName, last_name: lastName }
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const [profiles] = await db.execute('SELECT * FROM user_profiles WHERE user_id = ?', [user.id]);
    const profile = profiles[0] || {};

    const token = jwt.sign(
      { userId: user.id, institutionId: profile.institution_id, role: profile.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        profile
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

import { requireAuthenticatedProfile } from '../middleware/auth.js';

// Get Current User
router.get('/me', requireAuthenticatedProfile, (req, res) => {
  res.json({
    user: req.auth.user,
    profile: req.auth.profile
  });
});

// Update Current User's Profile
router.put('/me', requireAuthenticatedProfile, async (req, res) => {
  try {
    const allowed = ['first_name', 'last_name', 'phone', 'avatar_url'];
    const fields = Object.keys(req.body).filter(f => allowed.includes(f));
    if (fields.length === 0) return res.status(400).json({ error: 'No updatable fields provided' });

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => req.body[f]);

    await db.execute(
      `UPDATE user_profiles SET ${setClause} WHERE id = ?`,
      [...values, req.auth.profile.id]
    );

    const [updated] = await db.execute('SELECT * FROM user_profiles WHERE id = ?', [req.auth.profile.id]);
    res.json({ profile: updated[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change Password
router.put('/password', requireAuthenticatedProfile, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters' });
    }

    const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.auth.user.id]);
    const user = users[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, user.id]);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
