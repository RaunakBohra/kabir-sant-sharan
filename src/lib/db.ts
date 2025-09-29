import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleBetterSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../drizzle/schema';
import path from 'path';

let localDb: ReturnType<typeof drizzleBetterSqlite> | null = null;
let sqliteInstance: Database.Database | null = null;

function getLocalDatabase() {
  if (!localDb) {
    const dbPath = path.join(process.cwd(), 'local.db');
    sqliteInstance = new Database(dbPath);
    localDb = drizzleBetterSqlite(sqliteInstance, { schema });

    // Initialize tables if they don't exist
    initializeTables();
  }
  return localDb;
}

function initializeTables() {
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

export function getDatabase(env?: any) {
  // Use local database for development
  if (process.env.NODE_ENV !== 'production' || !env?.DB) {
    return getLocalDatabase();
  }

  // Use D1 for production
  return drizzle(env.DB, { schema });
}

// Initialize global database for session manager
if (typeof globalThis !== 'undefined') {
  (globalThis as any).db = getDatabase();
}

export type Database = ReturnType<typeof getDatabase>;
export { schema };