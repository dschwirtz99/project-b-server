import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { getDatabase } from './config/database';
import { playerRoutes } from './routes/players';
import { eventRoutes } from './routes/events';
import { newsRoutes } from './routes/news';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { initCronJobs } from './jobs/cron';
import { logger } from './utils/logger';
import fs from 'fs';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/players', playerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
function initDatabase(): void {
  const db = getDatabase();

  // Auto-run migrations
  const migrationsDir = path.resolve(__dirname, '../migrations');
  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir).sort();
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        db.exec(sql);
      }
    }
    logger.info('Migrations applied.');
  }

  // Always run seeds (uses INSERT OR REPLACE to update existing data)
  const seedsDir = path.resolve(__dirname, '../seeds');
  if (fs.existsSync(seedsDir)) {
    const files = fs.readdirSync(seedsDir).sort();
    for (const file of files) {
      if (file.endsWith('.sql')) {
        const sql = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
        db.exec(sql);
      }
    }
    logger.info('Seeds applied.');
  }
}

initDatabase();
initCronJobs();

app.listen(env.PORT, () => {
  logger.info(`Project B Server running on http://localhost:${env.PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});

export default app;
