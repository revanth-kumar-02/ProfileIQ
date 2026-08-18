import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import analysisRoutes from './routes/analysis.routes.js';

const app = express();

// CORS setup
app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || origin === ENV.CLIENT_ORIGIN || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));

// API Routes
app.use('/api', healthRoutes);
app.use('/api', analysisRoutes);

// Catch-all for non-existing endpoints
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found.',
    },
  });
});

export default app;
