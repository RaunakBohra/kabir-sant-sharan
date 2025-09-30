import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import { withPerformanceTracking } from '@/lib/middleware/performance-middleware';
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

async function getLivePerformanceHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    // Get current system metrics
    const system = performanceMonitor.getCurrentSystemStats();

    // Get recent request stats (last 5 minutes)
    const fiveMinutesMs = 5 * 60 * 1000;
    const requestStats = performanceMonitor.getRequestStats(fiveMinutesMs);

    // Get recent database stats (last 5 minutes)
    const databaseStats = performanceMonitor.getDatabaseStats(fiveMinutesMs);

    const response = {
      timestamp: new Date().toISOString(),
      system: system ? {
        cpuUsage: system.cpuUsage,
        memoryUsage: {
          used: system.memoryUsage.used,
          total: system.memoryUsage.total,
          percentage: system.memoryUsage.percentage
        },
        heapUsage: {
          used: system.heapUsage.used,
          total: system.heapUsage.total,
          percentage: system.heapUsage.percentage
        },
        activeConnections: system.activeConnections,
        timestamp: system.timestamp.toISOString()
      } : null,
      requests: {
        last5Minutes: {
          totalRequests: requestStats.totalRequests,
          averageResponseTime: requestStats.averageResponseTime,
          errorRate: requestStats.errorRate,
          requestsPerSecond: requestStats.requestsPerSecond
        }
      },
      database: {
        last5Minutes: {
          totalQueries: databaseStats.totalQueries,
          averageQueryTime: databaseStats.averageQueryTime,
          slowQueriesCount: databaseStats.slowQueriesCount,
          cacheHitRate: databaseStats.cacheHitRate
        }
      }
    };

    logger.info('Live performance metrics retrieved', {
      traceId,
      userId: request.session?.userId,
      hasSystemData: !!system,
      requestCount: requestStats.totalRequests,
      queryCount: databaseStats.totalQueries,
      component: 'performance-live-api'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    };

    return NextResponse.json(response, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      request: {
        method: request.method,
        url: request.url,
        headers: Object.fromEntries(request.headers.entries())
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      detail: 'Failed to retrieve live performance metrics',
      metadata: { traceId }
    });
  }
}

// Apply admin authentication and performance tracking
export const GET = withAdminAuth(
  withPerformanceTracking(getLivePerformanceHandler, {
    trackRequests: true,
    logSlowRequests: true,
    slowRequestThreshold: 200 // Live data should be fast
  })
);
