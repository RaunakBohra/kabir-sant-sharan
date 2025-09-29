import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import {
  initializeDatabase,
  checkDatabaseHealth,
  getDatabaseStats,
  runMigrations,
  getMigrationStatus,
  validateMigrations
} from '@/lib/database';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

/**
 * @swagger
 * /api/admin/database:
 *   get:
 *     summary: Get database status and statistics
 *     description: Retrieve comprehensive database health status, migration information, and table statistics
 *     tags: [Admin, Database]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           enum: [health, stats, migrations, all]
 *           default: all
 *         description: What information to include in the response
 *     responses:
 *       200:
 *         description: Database status information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 health:
 *                   type: object
 *                   properties:
 *                     healthy:
 *                       type: boolean
 *                     details:
 *                       type: object
 *                 stats:
 *                   type: object
 *                   properties:
 *                     tables:
 *                       type: array
 *                     migrations:
 *                       type: object
 *                 migrations:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: object
 *                     validation:
 *                       type: object
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   post:
 *     summary: Perform database operations
 *     description: Run database migrations, seeding, or initialization
 *     tags: [Admin, Database]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [migrate, seed, initialize, validate]
 *                 description: The database operation to perform
 *               options:
 *                 type: object
 *                 properties:
 *                   environment:
 *                     type: string
 *                     enum: [development, production]
 *                     default: development
 *                   force:
 *                     type: boolean
 *                     default: false
 *     responses:
 *       200:
 *         description: Operation completed successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

// GET /api/admin/database - Get database status
async function getDatabaseStatusHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const url = new URL(request.url);
    const include = url.searchParams.get('include') || 'all';

    const response: any = {
      timestamp: new Date().toISOString()
    };

    // Get health information
    if (include === 'health' || include === 'all') {
      response.health = await checkDatabaseHealth();
    }

    // Get statistics
    if (include === 'stats' || include === 'all') {
      response.stats = await getDatabaseStats();
    }

    // Get migration information
    if (include === 'migrations' || include === 'all') {
      const [migrationStatus, migrationValidation] = await Promise.all([
        getMigrationStatus(),
        validateMigrations()
      ]);

      response.migrations = {
        status: migrationStatus,
        validation: migrationValidation
      };
    }

    logger.info('Database status retrieved', {
      traceId,
      include,
      userId: request.session?.userId,
      component: 'database-admin'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-cache'
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      request: {
        method: request.method,
        url: request.url
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}

// POST /api/admin/database - Perform database operations
async function databaseOperationHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'Invalid JSON in request body',
        metadata: { traceId }
      });
    }

    const { action, options = {} } = body;

    if (!action || typeof action !== 'string') {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'Action is required and must be a string',
        metadata: { traceId }
      });
    }

    const validActions = ['migrate', 'seed', 'initialize', 'validate'];
    if (!validActions.includes(action)) {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: `Invalid action. Must be one of: ${validActions.join(', ')}`,
        metadata: { traceId }
      });
    }

    const {
      environment = 'development',
      force = false
    } = options;

    logger.info('Database operation requested', {
      action,
      environment,
      force,
      traceId,
      userId: request.session?.userId,
      component: 'database-admin'
    });

    let result: any;

    switch (action) {
      case 'migrate':
        result = await runMigrations();
        break;

      case 'seed':
        const { seedDatabase } = await import('@/lib/database/seeder');
        result = await seedDatabase(environment);
        break;

      case 'initialize':
        result = await initializeDatabase({
          runMigrations: true,
          runSeeding: true,
          environment
        });
        break;

      case 'validate':
        result = await validateMigrations();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    logger.info('Database operation completed', {
      action,
      success: result.success,
      traceId,
      userId: request.session?.userId,
      component: 'database-admin'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId
    };

    return NextResponse.json({
      action,
      result,
      timestamp: new Date().toISOString(),
      success: result.success || result.valid || false
    }, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      request: {
        method: request.method,
        url: request.url
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      detail: 'Database operation failed',
      metadata: { traceId }
    });
  }
}

// Route handlers with admin authentication
export const GET = withAdminAuth(getDatabaseStatusHandler);
export const POST = withAdminAuth(databaseOperationHandler);