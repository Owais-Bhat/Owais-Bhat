import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import adminRouter from './routes/admin.js';
import usageRouter from './routes/usage.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import institutionsRouter from './routes/institutions.js';
import studentsRouter from './routes/students.js';
import teachersRouter from './routes/teachers.js';
import classesRouter from './routes/classes.js';
import attendanceRouter from './routes/attendance.js';
import feesRouter from './routes/fees.js';
import examsRouter from './routes/exams.js';
import admissionsRouter from './routes/admissions.js';
import activityRouter from './routes/activity.js';

const app = express();
const port = Number(process.env.PORT || 5000);

// FRONTEND_ORIGIN accepts a comma-separated list, e.g.
// "http://localhost:5173,https://school.networkingexperts.in,https://springgreen-weasel-932117.hostingersite.com"
// Hostinger's Web App gets a new random *.hostingersite.com subdomain every
// time it's recreated, so keep this list updated (or add the custom domain
// once DNS is connected, and drop the hostingersite.com fallback).
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow no-origin requests (curl, server-to-server) and any listed origin
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'cybermilo-admin-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/institutions', institutionsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/fees', feesRouter);
app.use('/api/exams', examsRouter);
app.use('/api/admissions', admissionsRouter);
app.use('/api/activity', activityRouter);
app.use('/api/admin', adminRouter);
app.use('/api/usage', usageRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`CyberMilo admin API running on http://localhost:${port}`);
});
