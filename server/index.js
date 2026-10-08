import express from 'express';
import { apiRouter } from './api.js';
import { initDatabase } from './db.js';

export const app = express();

app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// Initialize DB
initDatabase().catch((e) => console.error('Database initialization error:', e));

// Standalone execution helper
export function startServer(port = process.env.PORT || 3000) {
  app.use(express.static('dist'));
  return app.listen(port, () => {
    console.log(`CineSphere fullstack server running on port ${port}`);
  });
}
