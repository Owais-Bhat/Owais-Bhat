import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import adminRouter from './routes/admin.js';
import usageRouter from './routes/usage.js';
import usersRouter from './routes/users.js';

const app = express();
const port = Number(process.env.PORT || 5000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: frontendOrigin,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'cybermilo-admin-api' });
});

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
