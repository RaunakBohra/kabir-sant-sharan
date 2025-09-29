import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

/**
 * @swagger
 * /api/v1/performance/live:
 *   get:
 *     summary: Get real-time performance metrics
 *     description: Retrieve current system performance metrics and recent statistics
 *     tags: [Admin, Performance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: include
 *         schema:
 *           type: string
 *           enum: [system, requests, database, all]
 *           default: all
 *         description: Which metrics to include in the response
 *     responses:
 *       200:
 *         description: Live performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 system:
 *                   type: object
 *                   properties:
 *                     cpuUsage:
 *                       type: number
 *                     memoryUsage:
 *                       type: object
 *                     heapUsage:
 *                       type: object
 *                     activeConnections:
 *                       type: integer
 *                 requests:
 *                   type: object
 *                   properties:
 *                     last5Minutes:
 *                       type: object
 *                 database:
 *                   type: object
 *                   properties:
 *                     last5Minutes:
 *                       type: object
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

async function getLivePerformanceHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const url = new URL(request.url);
    const include = url.searchParams.get('include') || 'all';

    const response: any = {
      timestamp: new Date().toISOString()
    };

    // Get current system metrics
    if (include === 'system' || include === 'all') {
      response.system = performanceMonitor.getCurrentSystemStats();
    }

    // Get recent request stats (last 5 minutes)
    if (include === 'requests' || include === 'all') {
      const fiveMinutes = 5 * 60 * 1000;
      response.requests = {
        last5Minutes: performanceMonitor.getRequestStats(fiveMinutes)
      };
    }

    // Get recent database stats (last 5 minutes)
    if (include === 'database' || include === 'all') {
      const fiveMinutes = 5 * 60 * 1000;
      response.database = {
        last5Minutes: performanceMonitor.getDatabaseStats(fiveMinutes)
      };
    }

    logger.debug('Live performance metrics retrieved', {
      traceId,
      include,
      userId: request.session?.userId,
      component: 'performance-live-api'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
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

export const GET = withAdminAuth(getLivePerformanceHandler);