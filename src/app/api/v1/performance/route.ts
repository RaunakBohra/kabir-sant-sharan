import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import { withPerformanceTracking } from '@/lib/middleware/performance-middleware';
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

/**
 * @swagger
 * /api/v1/performance:
 *   get:
 *     summary: Get comprehensive performance metrics and statistics
 *     description: Retrieve detailed performance metrics including request stats, database performance, system metrics, and alerts
 *     tags: [Admin, Performance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeWindow
 *         schema:
 *           type: integer
 *           minimum: 60000
 *           maximum: 86400000
 *           default: 3600000
 *         description: Time window in milliseconds for metrics aggregation (1 minute to 24 hours)
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, prometheus]
 *           default: json
 *         description: Response format (JSON or Prometheus metrics)
 *       - in: query
 *         name: metric
 *         schema:
 *           type: string
 *         description: Specific metric name to retrieve statistics for
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: object
 *                   description: Comprehensive performance report
 *                 metricStats:
 *                   type: object
 *                   description: Statistics for specific metric (if requested)
 *           text/plain:
 *             schema:
 *               type: string
 *               description: Prometheus format metrics
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

async function getPerformanceMetricsHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const url = new URL(request.url);
    const timeWindowParam = url.searchParams.get('timeWindow');
    const format = url.searchParams.get('format') || 'json';
    const specificMetric = url.searchParams.get('metric');

    // Validate time window
    let timeWindow = 60 * 60 * 1000; // Default: 1 hour
    if (timeWindowParam) {
      const parsed = parseInt(timeWindowParam, 10);
      if (isNaN(parsed) || parsed < 60000 || parsed > 86400000) {
        return createErrorResponse('VALIDATION_ERROR', {
          instance,
          detail: 'timeWindow must be between 60000 (1 minute) and 86400000 (24 hours)',
          metadata: { traceId }
        });
      }
      timeWindow = parsed;
    }

    // Handle Prometheus format
    if (format === 'prometheus') {
      const prometheusMetrics = performanceMonitor.exportPrometheusMetrics();

      logger.info('Performance metrics exported in Prometheus format', {
        traceId,
        timeWindow,
        userId: request.session?.userId,
        component: 'performance-api'
      });

      return new NextResponse(prometheusMetrics, {
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
          'X-Trace-ID': traceId
        }
      });
    }

    // Get comprehensive performance report
    const report = performanceMonitor.getPerformanceReport(timeWindow);

    // Get specific metric stats if requested
    let metricStats = null;
    if (specificMetric) {
      metricStats = performanceMonitor.getMetricStats(specificMetric, timeWindow);
      if (!metricStats) {
        return createErrorResponse('RESOURCE_NOT_FOUND', {
          instance,
          detail: `Metric '${specificMetric}' not found or has no data in the specified time window`,
          metadata: { traceId }
        });
      }
    }

    logger.info('Performance metrics retrieved', {
      traceId,
      timeWindow,
      format,
      specificMetric,
      alertsCount: report.alerts.length,
      userId: request.session?.userId,
      component: 'performance-api'
    });

    const response = {
      timestamp: new Date().toISOString(),
      timeWindow: `${timeWindow / 1000}s`,
      report,
      ...(metricStats && { metricStats: { [specificMetric!]: metricStats } })
    };

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
        url: request.url,
        headers: Object.fromEntries(request.headers.entries())
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}

// Apply admin authentication and performance tracking
export const GET = withAdminAuth(
  withPerformanceTracking(getPerformanceMetricsHandler, {
    trackRequests: true,
    logSlowRequests: true,
    slowRequestThreshold: 500
  })
);