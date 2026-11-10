import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { seedDemoDataIfEmpty } from './services/seedDemoData.js';
import { authRouter } from './routes/authRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';
import { runRouter } from './routes/runRoutes.js';
import { contactRouter } from './routes/contactRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Body Parsers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TestTruth Backend API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    aiProvider: ENV.AI_PROVIDER,
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/runs', runRouter);
app.use('/api/contact', contactRouter);

// Global Error Handler
app.use(errorHandler);

export async function startServer() {
  try {
    const dbUri = await connectDB();
    console.log(`[TestTruth API] Database initialized: ${dbUri}`);

    await seedDemoDataIfEmpty();

    const server = app.listen(ENV.PORT, () => {
      console.log(`[TestTruth API] Server listening on http://localhost:${ENV.PORT}`);
    });

    return server;
  } catch (err) {
    console.error('[TestTruth API] Failed to start server:', err);
    process.exit(1);
  }
}

// Only auto-start when executed directly as entrypoint
const isDirectEntry = process.argv[1] && (process.argv[1].endsWith('index.ts') || process.argv[1].endsWith('index.js'));
if (isDirectEntry && process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
