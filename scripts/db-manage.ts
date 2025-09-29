#!/usr/bin/env tsx

/**
 * Database Management CLI Tool
 *
 * Usage:
 *   npm run db:migrate              # Run pending migrations
 *   npm run db:seed                 # Seed database with sample data
 *   npm run db:init                 # Initialize database (migrate + seed)
 *   npm run db:status               # Show database status
 *   npm run db:validate             # Validate migrations
 *   npm run db:rollback             # Rollback last migration
 */

import { initializeDatabase, runMigrations, rollbackLastMigration, getMigrationStatus, validateMigrations, seedDatabase, checkDatabaseHealth, getDatabaseStats } from '../src/lib/database';

interface CLIOptions {
  environment?: 'development' | 'production';
  force?: boolean;
  verbose?: boolean;
}

async function parseArgs(): Promise<{ command: string; options: CLIOptions }> {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  const options: CLIOptions = {
    environment: 'development',
    force: false,
    verbose: false
  };

  // Parse flags
  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--production' || arg === '-p') {
      options.environment = 'production';
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    }
  }

  return { command, options };
}

function log(message: string, level: 'info' | 'warn' | 'error' | 'success' = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    success: '\x1b[32m', // Green
    reset: '\x1b[0m'     // Reset
  };

  const prefix = {
    info: 'ℹ',
    warn: '⚠',
    error: '✗',
    success: '✓'
  };

  console.log(`${colors[level]}${prefix[level]} ${message}${colors.reset}`);
}

async function setupDatabase() {
  // Mock database setup for CLI
  const mockDb = {
    prepare: (sql: string) => ({
      bind: (...args: any[]) => ({
        run: async () => ({ success: true, meta: {} }),
        first: async () => null,
        all: async () => ({ results: [] })
      }),
      run: async () => ({ success: true, meta: {} }),
      first: async () => null,
      all: async () => ({ results: [] })
    }),
    exec: async (sql: string) => ({ success: true })
  };

  (globalThis as any).db = mockDb;
}

async function runCommand(command: string, options: CLIOptions) {
  log(`Running command: ${command}`, 'info');

  if (options.verbose) {
    log(`Environment: ${options.environment}`, 'info');
    log(`Force: ${options.force}`, 'info');
  }

  // Setup mock database
  await setupDatabase();

  switch (command) {
    case 'migrate':
      await handleMigrate(options);
      break;

    case 'seed':
      await handleSeed(options);
      break;

    case 'init':
    case 'initialize':
      await handleInitialize(options);
      break;

    case 'status':
      await handleStatus(options);
      break;

    case 'validate':
      await handleValidate(options);
      break;

    case 'rollback':
      await handleRollback(options);
      break;

    case 'health':
      await handleHealth(options);
      break;

    case 'stats':
      await handleStats(options);
      break;

    case 'help':
    default:
      showHelp();
      break;
  }
}

async function handleMigrate(options: CLIOptions) {
  try {
    log('Running database migrations...', 'info');

    const result = await runMigrations();

    if (result.success) {
      log(`Migrations completed successfully! ${result.migrationsRun} migrations run.`, 'success');

      if (options.verbose && result.details.length > 0) {
        console.log('\nMigration Details:');
        result.details.forEach(detail => {
          const status = detail.status === 'success' ? '✓' : detail.status === 'failed' ? '✗' : '→';
          console.log(`  ${status} ${detail.name} (${detail.version})`);
          if (detail.error) {
            log(`    Error: ${detail.error}`, 'error');
          }
        });
      }
    } else {
      log('Migrations failed!', 'error');
      result.errors.forEach(error => log(`  ${error}`, 'error'));
      process.exit(1);
    }
  } catch (error) {
    log(`Migration error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleSeed(options: CLIOptions) {
  try {
    log(`Seeding database with ${options.environment} data...`, 'info');

    const result = await seedDatabase(options.environment);

    if (result.success) {
      log('Database seeding completed successfully!', 'success');

      if (options.verbose) {
        console.log('\nSeeding Results:');
        Object.entries(result.results).forEach(([table, stats]) => {
          console.log(`  ${table}: ${stats.inserted} inserted, ${stats.skipped} skipped`);
          if (stats.errors.length > 0) {
            stats.errors.forEach(error => log(`    Error: ${error}`, 'error'));
          }
        });
      }
    } else {
      log('Database seeding failed!', 'error');
      Object.entries(result.results).forEach(([table, stats]) => {
        if (stats.errors.length > 0) {
          log(`${table} errors:`, 'error');
          stats.errors.forEach(error => log(`  ${error}`, 'error'));
        }
      });
      process.exit(1);
    }
  } catch (error) {
    log(`Seeding error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleInitialize(options: CLIOptions) {
  try {
    log('Initializing database...', 'info');

    const result = await initializeDatabase({
      runMigrations: true,
      runSeeding: true,
      environment: options.environment
    });

    if (result.success) {
      log('Database initialization completed successfully!', 'success');
      log(`Migrations: ${result.migrations.migrationsRun} run`, 'info');

      if (result.seeding) {
        const totalInserted = Object.values(result.seeding.results)
          .reduce((sum, stats) => sum + stats.inserted, 0);
        log(`Seeding: ${totalInserted} records inserted`, 'info');
      }
    } else {
      log('Database initialization failed!', 'error');
      result.errors.forEach(error => log(`  ${error}`, 'error'));
      process.exit(1);
    }
  } catch (error) {
    log(`Initialization error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleStatus(options: CLIOptions) {
  try {
    log('Checking migration status...', 'info');

    const status = await getMigrationStatus();

    console.log('\nMigration Status:');
    console.log(`  Total migrations: ${status.total}`);
    console.log(`  Executed: ${status.executed}`);
    console.log(`  Pending: ${status.pending}`);

    if (status.lastExecuted) {
      console.log(`  Last executed: ${status.lastExecuted.name} (${status.lastExecuted.version})`);
    }

    if (status.nextPending) {
      console.log(`  Next pending: ${status.nextPending.name} (${status.nextPending.version})`);
    }

    if (status.pending > 0) {
      log(`${status.pending} migrations are pending`, 'warn');
    } else {
      log('All migrations are up to date', 'success');
    }
  } catch (error) {
    log(`Status check error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleValidate(options: CLIOptions) {
  try {
    log('Validating migrations...', 'info');

    const validation = await validateMigrations();

    if (validation.valid) {
      log('All migrations are valid', 'success');
    } else {
      log('Migration validation failed!', 'error');
      validation.issues.forEach(issue => log(`  ${issue}`, 'error'));
      process.exit(1);
    }
  } catch (error) {
    log(`Validation error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleRollback(options: CLIOptions) {
  try {
    if (!options.force) {
      log('Rollback requires --force flag for safety', 'warn');
      process.exit(1);
    }

    log('Rolling back last migration...', 'info');

    const result = await rollbackLastMigration();

    if (result.success) {
      log('Rollback completed successfully!', 'success');
      if (result.details.length > 0) {
        const detail = result.details[0];
        console.log(`  Rolled back: ${detail.name} (${detail.version})`);
      }
    } else {
      log('Rollback failed!', 'error');
      result.errors.forEach(error => log(`  ${error}`, 'error'));
      process.exit(1);
    }
  } catch (error) {
    log(`Rollback error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleHealth(options: CLIOptions) {
  try {
    log('Checking database health...', 'info');

    const health = await checkDatabaseHealth();

    console.log('\nDatabase Health:');
    console.log(`  Overall: ${health.healthy ? '✓ Healthy' : '✗ Unhealthy'}`);
    console.log(`  Connected: ${health.details.connected ? '✓' : '✗'}`);
    console.log(`  Tables exist: ${health.details.tablesExist ? '✓' : '✗'}`);
    console.log(`  Migrations up to date: ${health.details.migrationsUpToDate ? '✓' : '✗'}`);

    if (health.errors.length > 0) {
      console.log('\nErrors:');
      health.errors.forEach(error => log(`  ${error}`, 'error'));
    }
  } catch (error) {
    log(`Health check error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

async function handleStats(options: CLIOptions) {
  try {
    log('Getting database statistics...', 'info');

    const stats = await getDatabaseStats();

    console.log('\nDatabase Statistics:');
    console.log('  Tables:');
    stats.tables.forEach(table => {
      console.log(`    ${table.name}: ${table.count} records`);
    });

    console.log('\n  Migrations:');
    console.log(`    Total: ${stats.migrations.total}`);
    console.log(`    Executed: ${stats.migrations.executed}`);
    console.log(`    Pending: ${stats.migrations.pending}`);

    if (stats.diskUsage) {
      console.log(`\n  Disk Usage: ${(stats.diskUsage / 1024 / 1024).toFixed(2)} MB`);
    }
  } catch (error) {
    log(`Stats error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🕉️  Kabir Sant Sharan - Database Management CLI

Usage:
  npm run db:manage <command> [options]

Commands:
  migrate         Run pending database migrations
  seed            Seed database with sample data
  init            Initialize database (migrate + seed)
  status          Show migration status
  validate        Validate migration integrity
  rollback        Rollback last migration (requires --force)
  health          Check database health
  stats           Show database statistics
  help            Show this help message

Options:
  -p, --production    Use production environment
  -f, --force         Force operation (required for rollback)
  -v, --verbose       Verbose output

Examples:
  npm run db:manage migrate
  npm run db:manage seed --production
  npm run db:manage init --verbose
  npm run db:manage rollback --force
  npm run db:manage status

🙏 May the wisdom of Sant Kabir guide your database journey.
`);
}

// Main execution
async function main() {
  try {
    const { command, options } = await parseArgs();
    await runCommand(command, options);
  } catch (error) {
    log(`CLI Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { main, runCommand };