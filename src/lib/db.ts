import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../functions/src/drizzle/schema';

let localDb: any = null;

async function getLocalDatabase() {
  if (!localDb) {
    // Dynamic import for Node.js-only dependencies
    const { drizzle: drizzleBetterSqlite } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    const path = await import('path');

    const dbPath = path.join(process.cwd(), 'local.db');
    const sqliteInstance = new Database(dbPath);
    localDb = drizzleBetterSqlite(sqliteInstance, { schema });

    // Initialize tables if they don't exist
    await initializeTables(sqliteInstance);
  }
  return localDb;
}

async function initializeTables(sqliteInstance: any) {
  if (!sqliteInstance) return;

  try {
    sqliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        avatar TEXT,
        bio TEXT,
        language TEXT NOT NULL DEFAULT 'en',
        email_verified INTEGER DEFAULT 0,
        newsletter INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    sqliteInstance.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        refresh_token TEXT UNIQUE,
        expires_at TEXT NOT NULL,
        refresh_expires_at TEXT,
        ip_address TEXT,
        user_agent TEXT,
        last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    sqliteInstance.exec(`
      CREATE INDEX IF NOT EXISTS session_token_idx ON sessions(token)
    `);

    sqliteInstance.exec(`
      CREATE INDEX IF NOT EXISTS session_user_idx ON sessions(user_id)
    `);

  } catch (error) {
    console.warn('Database table initialization warning:', error);
  }
}

export async function getDatabase(env?: any) {
  // Check if we're in Cloudflare Workers/Pages environment with D1 binding
  if (env?.DB) {
    console.log('Using Cloudflare D1 database');
    return drizzle(env.DB, { schema });
  }

  // Check if we're in Next.js API route context with platform bindings
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.CF_PAGES) {
    const cloudflareEnv = (globalThis as any).cloudflare?.env;
    if (cloudflareEnv?.DB) {
      console.log('Using Cloudflare D1 database from platform context');
      return drizzle(cloudflareEnv.DB, { schema });
    }
  }

  // Fall back to local SQLite for development
  console.log('Using local SQLite database');
  return await getLocalDatabase();
}

export type Database = Awaited<ReturnType<typeof getDatabase>>;
export { schema };