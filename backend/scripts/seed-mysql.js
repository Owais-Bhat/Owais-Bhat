import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import db from '../src/lib/db.js';

async function seed() {
  try {
    const email = 'superadmin@cybermilo.test';
    const password = 'CyberMilo@123';
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Super admin already exists');
      process.exit(0);
    }

    const userId = uuidv4();
    await db.execute('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [userId, email, passwordHash]);

    const profileId = uuidv4();
    await db.execute(
      'INSERT INTO user_profiles (id, user_id, role, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [profileId, userId, 'super_admin', 'CyberMilo', 'Admin']
    );

    console.log('Successfully seeded super admin: superadmin@cybermilo.test / CyberMilo@123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
