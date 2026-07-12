import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'cybermilo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Return DATE/DATETIME/TIMESTAMP as plain strings (e.g. "2026-07-12"),
  // not JS Date objects — avoids server-timezone shifting the date by a
  // day when serialized to JSON (Date always serializes to UTC).
  dateStrings: true,
});

export default pool;
