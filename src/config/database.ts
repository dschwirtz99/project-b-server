import { Pool, QueryResult } from 'pg';
import { env } from './env';

let pool: Pool;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query(text: string, params?: any[]): Promise<QueryResult> {
  return getPool().query(text, params);
}

export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
  }
}
