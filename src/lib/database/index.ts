import { migrationManager, registerMigration, runMigrations, type MigrationResult } from './migration-manager';
import { databaseSeeder, seedDatabase, type SeedResult } from './seeder';
import { initialSchemaMigration } from './migrations/001-initial-schema';
import { logger } from '../logger';

// Register all migrations
registerMigration(initialSchemaMigration);

export interface DatabaseInitResult {
  migrations: MigrationResult;
  seeding?: SeedResult;
  success: boolean;
  errors: string[];
}

/**
 * Initialize the database with migrations and seeding
 */
export async function initializeDatabase(options: {
  runMigrations?: boolean;
  runSeeding?: boolean;
  environment?: 'development' | 'production';
} = {}): Promise<DatabaseInitResult> {
  const {
    runMigrations: shouldRunMigrations = true,
    runSeeding: shouldRunSeeding = true,
    environment = 'development'
  } = options;

  const result: DatabaseInitResult = {
    migrations: {
      success: true,
      migrationsRun: 0,
      errors: [],
      details: []
    },
    success: true,
    errors: []
  };

  try {
    logger.info('Starting database initialization', {
      runMigrations: shouldRunMigrations,
      runSeeding: shouldRunSeeding,
      environment,
      component: 'database-init'
    });

    // Run migrations
    if (shouldRunMigrations) {
      logger.info('Running database migrations', {
        component: 'database-init'
      });

      result.migrations = await runMigrations();

      if (!result.migrations.success) {
        result.success = false;
        result.errors.push(...result.migrations.errors);
        logger.error('Database migrations failed', {
          errors: result.migrations.errors,
          component: 'database-init'
        });
      } else {
        logger.info('Database migrations completed successfully', {
          migrationsRun: result.migrations.migrationsRun,
          component: 'database-init'
        });
      }
    }

    // Run seeding (only if migrations succeeded)
    if (shouldRunSeeding && result.success) {
      logger.info('Running database seeding', {
        environment,
        component: 'database-init'
      });

      result.seeding = await seedDatabase(environment);

      if (!result.seeding.success) {
        result.success = false;
        result.errors.push('Database seeding failed');
        logger.error('Database seeding failed', {
          seedingResults: result.seeding.results,
          component: 'database-init'
        });
      } else {
        logger.info('Database seeding completed successfully', {
          seedingResults: result.seeding.results,
          component: 'database-init'
        });
      }
    }

    logger.info('Database initialization completed', {
      success: result.success,
      migrationsRun: result.migrations.migrationsRun,
      seedingSuccess: result.seeding?.success,
      errors: result.errors,
      component: 'database-init'
    });

  } catch (error) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Database initialization error: ${errorMessage}`);

    logger.error('Database initialization failed', {
      error: errorMessage,
      component: 'database-init'
    });
  }

  return result;
}

/**
 * Check database health and readiness
 */
export async function checkDatabaseHealth(): Promise<{
  healthy: boolean;
  details: {
    connected: boolean;
    migrationsUpToDate: boolean;
    tablesExist: boolean;
  };
  errors: string[];
}> {
  const result = {
    healthy: true,
    details: {
      connected: false,
      migrationsUpToDate: false,
      tablesExist: false
    },
    errors: [] as string[]
  };

  try {
    const db = (globalThis as any).db;

    if (!db) {
      result.healthy = false;
      result.errors.push('Database connection not available');
      return result;
    }

    // Test database connection
    try {
      await db.prepare('SELECT 1').first();
      result.details.connected = true;
    } catch (error) {
      result.healthy = false;
      result.errors.push('Database connection failed');
      return result;
    }

    // Check if core tables exist
    try {
      await db.prepare('SELECT COUNT(*) FROM users LIMIT 1').first();
      await db.prepare('SELECT COUNT(*) FROM sessions LIMIT 1').first();
      result.details.tablesExist = true;
    } catch (error) {
      result.healthy = false;
      result.errors.push('Core database tables missing');
    }

    // Check migration status
    try {
      const migrationStatus = await migrationManager.getMigrationStatus();
      result.details.migrationsUpToDate = migrationStatus.pending === 0;

      if (migrationStatus.pending > 0) {
        result.healthy = false;
        result.errors.push(`${migrationStatus.pending} pending migrations`);
      }
    } catch (error) {
      result.errors.push('Unable to check migration status');
    }

  } catch (error) {
    result.healthy = false;
    result.errors.push(`Health check error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(): Promise<{
  tables: Array<{
    name: string;
    count: number;
  }>;
  migrations: {
    total: number;
    executed: number;
    pending: number;
  };
  diskUsage?: number;
}> {
  const stats = {
    tables: [] as Array<{ name: string; count: number }>,
    migrations: {
      total: 0,
      executed: 0,
      pending: 0
    },
    diskUsage: undefined as number | undefined
  };

  try {
    const db = (globalThis as any).db;

    if (!db) {
      throw new Error('Database not available');
    }

    // Get table counts
    const tables = [
      'users', 'teachings', 'events', 'event_registrations',
      'media', 'quotes', 'newsletters', 'comments',
      'contact_messages', 'sessions', 'analytics'
    ];

    for (const table of tables) {
      try {
        const result = await db.prepare(`SELECT COUNT(*) as count FROM ${table}`).first();
        stats.tables.push({
          name: table,
          count: result?.count || 0
        });
      } catch (error) {
        // Table might not exist
        stats.tables.push({
          name: table,
          count: 0
        });
      }
    }

    // Get migration statistics
    const migrationStatus = await migrationManager.getMigrationStatus();
    stats.migrations = {
      total: migrationStatus.total,
      executed: migrationStatus.executed,
      pending: migrationStatus.pending
    };

  } catch (error) {
    logger.error('Failed to get database statistics', {
      error: error instanceof Error ? error.message : String(error),
      component: 'database-stats'
    });
  }

  return stats;
}

// Export everything
export * from './migration-manager';
export * from './seeder';
export { migrationManager, databaseSeeder };