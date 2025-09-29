import { drizzle } from 'drizzle-orm/d1';
import { eq, desc } from 'drizzle-orm';
import { logger } from '../logger';
import { createId } from '@paralleldrive/cuid2';

export interface Migration {
  id: string;
  name: string;
  version: string;
  description: string;
  up: (db: any) => Promise<void>;
  down: (db: any) => Promise<void>;
  createdAt: string;
}

export interface MigrationRecord {
  id: string;
  name: string;
  version: string;
  description: string;
  executedAt: string;
  checksum: string;
}

export interface MigrationResult {
  success: boolean;
  migrationsRun: number;
  errors: string[];
  details: Array<{
    name: string;
    version: string;
    status: 'success' | 'failed' | 'skipped';
    error?: string;
  }>;
}

class MigrationManager {
  private db: any;
  private migrations: Migration[] = [];

  constructor(database?: any) {
    this.db = database || (globalThis as any).db;
  }

  /**
   * Initialize the migrations table
   */
  async initializeMigrationsTable(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          version TEXT NOT NULL,
          description TEXT,
          executed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          checksum TEXT NOT NULL
        );
      `);

      logger.info('Migrations table initialized', {
        component: 'migration-manager'
      });
    } catch (error) {
      logger.error('Failed to initialize migrations table', {
        error: error instanceof Error ? error.message : String(error),
        component: 'migration-manager'
      });
      throw error;
    }
  }

  /**
   * Register a migration
   */
  registerMigration(migration: Migration): void {
    // Check for duplicate names or versions
    const existingByName = this.migrations.find(m => m.name === migration.name);
    const existingByVersion = this.migrations.find(m => m.version === migration.version);

    if (existingByName) {
      throw new Error(`Migration with name '${migration.name}' already exists`);
    }

    if (existingByVersion) {
      throw new Error(`Migration with version '${migration.version}' already exists`);
    }

    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version.localeCompare(b.version));

    logger.info('Migration registered', {
      name: migration.name,
      version: migration.version,
      component: 'migration-manager'
    });
  }

  /**
   * Get executed migrations from database
   */
  async getExecutedMigrations(): Promise<MigrationRecord[]> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const result = await this.db.prepare(`
        SELECT id, name, version, description, executed_at, checksum
        FROM _migrations
        ORDER BY version ASC
      `).all();

      return result.results || [];
    } catch (error) {
      // If table doesn't exist, return empty array
      if (error instanceof Error && error.message.includes('no such table')) {
        return [];
      }
      throw error;
    }
  }

  /**
   * Get pending migrations
   */
  async getPendingMigrations(): Promise<Migration[]> {
    const executedMigrations = await this.getExecutedMigrations();
    const executedNames = new Set(executedMigrations.map(m => m.name));

    return this.migrations.filter(migration => !executedNames.has(migration.name));
  }

  /**
   * Calculate migration checksum
   */
  private calculateChecksum(migration: Migration): string {
    const content = `${migration.name}-${migration.version}-${migration.description}`;
    // Simple checksum - in production, use a proper hash function
    return Buffer.from(content).toString('base64').slice(0, 16);
  }

  /**
   * Record migration execution
   */
  private async recordMigration(migration: Migration): Promise<void> {
    const checksum = this.calculateChecksum(migration);

    await this.db.prepare(`
      INSERT INTO _migrations (id, name, version, description, executed_at, checksum)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      createId(),
      migration.name,
      migration.version,
      migration.description,
      new Date().toISOString(),
      checksum
    ).run();
  }

  /**
   * Run pending migrations
   */
  async runMigrations(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrationsRun: 0,
      errors: [],
      details: []
    };

    try {
      // Initialize migrations table
      await this.initializeMigrationsTable();

      // Get pending migrations
      const pendingMigrations = await this.getPendingMigrations();

      if (pendingMigrations.length === 0) {
        logger.info('No pending migrations to run', {
          component: 'migration-manager'
        });
        return result;
      }

      logger.info('Running migrations', {
        pendingCount: pendingMigrations.length,
        component: 'migration-manager'
      });

      // Run each migration
      for (const migration of pendingMigrations) {
        try {
          logger.info('Running migration', {
            name: migration.name,
            version: migration.version,
            component: 'migration-manager'
          });

          // Execute migration
          await migration.up(this.db);

          // Record successful execution
          await this.recordMigration(migration);

          result.migrationsRun++;
          result.details.push({
            name: migration.name,
            version: migration.version,
            status: 'success'
          });

          logger.info('Migration completed successfully', {
            name: migration.name,
            version: migration.version,
            component: 'migration-manager'
          });

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          result.success = false;
          result.errors.push(`Migration ${migration.name}: ${errorMessage}`);
          result.details.push({
            name: migration.name,
            version: migration.version,
            status: 'failed',
            error: errorMessage
          });

          logger.error('Migration failed', {
            name: migration.name,
            version: migration.version,
            error: errorMessage,
            component: 'migration-manager'
          });

          // Stop on first failure
          break;
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Migration system error: ${error instanceof Error ? error.message : String(error)}`);

      logger.error('Migration system error', {
        error: error instanceof Error ? error.message : String(error),
        component: 'migration-manager'
      });
    }

    return result;
  }

  /**
   * Rollback last migration
   */
  async rollbackLastMigration(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      migrationsRun: 0,
      errors: [],
      details: []
    };

    try {
      // Get executed migrations
      const executedMigrations = await this.getExecutedMigrations();

      if (executedMigrations.length === 0) {
        logger.info('No migrations to rollback', {
          component: 'migration-manager'
        });
        return result;
      }

      // Get the last executed migration
      const lastMigration = executedMigrations[executedMigrations.length - 1];
      const migrationToRollback = this.migrations.find(m => m.name === lastMigration.name);

      if (!migrationToRollback) {
        throw new Error(`Migration ${lastMigration.name} not found in registered migrations`);
      }

      logger.info('Rolling back migration', {
        name: migrationToRollback.name,
        version: migrationToRollback.version,
        component: 'migration-manager'
      });

      // Execute rollback
      await migrationToRollback.down(this.db);

      // Remove from migrations table
      await this.db.prepare(`
        DELETE FROM _migrations WHERE name = ?
      `).bind(migrationToRollback.name).run();

      result.migrationsRun = 1;
      result.details.push({
        name: migrationToRollback.name,
        version: migrationToRollback.version,
        status: 'success'
      });

      logger.info('Migration rollback completed', {
        name: migrationToRollback.name,
        version: migrationToRollback.version,
        component: 'migration-manager'
      });

    } catch (error) {
      result.success = false;
      result.errors.push(`Rollback error: ${error instanceof Error ? error.message : String(error)}`);

      logger.error('Migration rollback failed', {
        error: error instanceof Error ? error.message : String(error),
        component: 'migration-manager'
      });
    }

    return result;
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<{
    total: number;
    executed: number;
    pending: number;
    lastExecuted?: MigrationRecord;
    nextPending?: Migration;
  }> {
    const executedMigrations = await this.getExecutedMigrations();
    const pendingMigrations = await this.getPendingMigrations();

    return {
      total: this.migrations.length,
      executed: executedMigrations.length,
      pending: pendingMigrations.length,
      lastExecuted: executedMigrations[executedMigrations.length - 1],
      nextPending: pendingMigrations[0]
    };
  }

  /**
   * Validate migration integrity
   */
  async validateMigrations(): Promise<{
    valid: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      const executedMigrations = await this.getExecutedMigrations();

      // Check for missing migrations
      for (const executed of executedMigrations) {
        const migration = this.migrations.find(m => m.name === executed.name);
        if (!migration) {
          issues.push(`Executed migration '${executed.name}' not found in registered migrations`);
        } else {
          // Check checksum if migration exists
          const expectedChecksum = this.calculateChecksum(migration);
          if (executed.checksum !== expectedChecksum) {
            issues.push(`Migration '${executed.name}' checksum mismatch - migration may have been modified`);
          }
        }
      }

      // Check for version conflicts
      const versions = this.migrations.map(m => m.version);
      const duplicateVersions = versions.filter((v, i) => versions.indexOf(v) !== i);
      if (duplicateVersions.length > 0) {
        issues.push(`Duplicate migration versions: ${duplicateVersions.join(', ')}`);
      }

    } catch (error) {
      issues.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return {
      valid: issues.length === 0,
      issues
    };
  }
}

// Global migration manager instance
export const migrationManager = new MigrationManager();

// Export utility functions
export async function runMigrations(): Promise<MigrationResult> {
  return migrationManager.runMigrations();
}

export async function rollbackLastMigration(): Promise<MigrationResult> {
  return migrationManager.rollbackLastMigration();
}

export async function getMigrationStatus() {
  return migrationManager.getMigrationStatus();
}

export async function validateMigrations() {
  return migrationManager.validateMigrations();
}

export function registerMigration(migration: Migration): void {
  migrationManager.registerMigration(migration);
}

export { MigrationManager };