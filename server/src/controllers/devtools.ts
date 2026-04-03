import { type RequestHandler } from 'express';
import { environment } from '../config/environment.js';
import { resetDatabase as resetDb, syncDB } from '../config/database.js';

const syncDatabase: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const results = await syncDB();

    res.success({
      provider: environment.databaseProvider,
      results,
    });
  } catch (error) {
    console.error('Database sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Database sync failed';
    res.error(errorMessage, 500);
  }
};

const resetDatabase: RequestHandler = async (_req, res): Promise<void> => {
  try {
    await resetDb();

    res.success({
      provider: environment.databaseProvider,
      message: 'Database reset complete',
    });
  } catch (error) {
    console.error('Reset error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Reset failed';
    res.error(errorMessage, 500);
  }
};

export const DevtoolsController = {
  resetDatabase,
  syncDatabase,
} as const;
