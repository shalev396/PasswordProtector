import type { Handler } from 'aws-lambda';
import { initDB, syncDB } from '../../config/bootstrap.js';
import { disconnectDB } from '../../config/database.js';

/**
 * Standalone Lambda that runs database schema sync (`sequelize.sync({ alter: true })`).
 * Deployed in ALL stages (including prod) but has NO HTTP event — only invocable
 * via `aws lambda invoke` with proper IAM credentials (used by CI/CD after deploy).
 */
export const handler: Handler = async () => {
  try {
    await initDB();
    const results = await syncDB();
    await disconnectDB();
    return { statusCode: 200, body: JSON.stringify({ results }) };
  } catch (error) {
    console.error('sync-db failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    await disconnectDB();
    return { statusCode: 500, body: JSON.stringify({ error: message }) };
  }
};
