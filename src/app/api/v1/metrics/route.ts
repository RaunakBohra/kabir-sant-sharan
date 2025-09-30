import { NextRequest, NextResponse } from 'next/server';
import { healthMonitor } from '@/lib/monitoring/health-monitor';
import { errorTracker } from '@/lib/monitoring/error-tracker';
import { logger } from '@/lib/logger';
import { withErrorTracking } from '@/lib/monitoring/error-tracker';
import { createErrorResponse } from '@/lib/error-handler';

export const runtime = 'edge';

async function metricsHandler(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const format = url.searchParams.get('format') || 'json';
  const timeRange = url.searchParams.get('range') || '1h';
  const metricName = url.searchParams.get('metric');

  try {
    // Get system health and metrics
    const systemHealth = await healthMonitor.getSystemHealth();
    const errorStats = errorTracker.getErrorStats();

    // Calculate time range
    const now = new Date();
    const timeRangeMs = parseTimeRange(timeRange);
    const startTime = new Date(now.getTime() - timeRangeMs);

    // Get historical metrics
    const historicalMetrics = healthMonitor.getMetricsHistory(metricName || undefined, 100);
    const recentErrors = errorTracker.getErrorsByTimeRange(startTime, now);
    const alerts = errorTracker.getAlerts().slice(0, 20); // Last 20 alerts

    const metricsData = {
      timestamp: systemHealth.timestamp,
      timeRange: {
        start: startTime.toISOString(),
        end: now.toISOString(),
        duration: timeRangeMs
      },
      system: {
        status: systemHealth.status,
        uptime: systemHealth.uptime,
        version: process.env.APP_VERSION || '1.0.0'
      },
      metrics: {
        current: systemHealth.metrics,
        historical: historicalMetrics
      },
      errors: {
        stats: errorStats,
        recent: recentErrors.slice(0, 50), // Last 50 errors
        alerts: alerts
      },
      healthChecks: systemHealth.checks
    };

    // Handle different output formats
    if (format === 'prometheus') {
      return handlePrometheusFormat(metricsData);
    }

    // JSON format
    logger.info('Metrics data requested', {
      format,
      timeRange,
      metricName,
      component: 'metrics-endpoint'
    });

    return NextResponse.json(metricsData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Metrics-Count': String(historicalMetrics.length)
      }
    });

  } catch (error) {
    logger.error('Metrics endpoint failed', {
      error: error instanceof Error ? error.message : String(error),
      component: 'metrics-endpoint'
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      detail: 'Failed to retrieve system metrics',
      instance: request.url
    });
  }
}

function parseTimeRange(range: string): number {
  const timeRanges: Record<string, number> = {
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000
  };

  return timeRanges[range] || timeRanges['1h'];
}

function handlePrometheusFormat(data: any): NextResponse {
  // Convert metrics to Prometheus format
  let prometheusMetrics = '';

  // System metrics
  prometheusMetrics += `# HELP kabir_sant_uptime_seconds System uptime in seconds\n`;
  prometheusMetrics += `# TYPE kabir_sant_uptime_seconds counter\n`;
  prometheusMetrics += `kabir_sant_uptime_seconds ${Math.floor(data.system.uptime / 1000)}\n\n`;

  // Current metrics
  data.metrics.current.forEach((metric: any) => {
    const metricName = `kabir_sant_${metric.name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const value = metric.status === 'healthy' ? metric.value :
                  metric.status === 'warning' ? metric.value :
                  metric.value;

    prometheusMetrics += `# HELP ${metricName} ${metric.name}\n`;
    prometheusMetrics += `# TYPE ${metricName} gauge\n`;
    prometheusMetrics += `${metricName}{status="${metric.status}",unit="${metric.unit}"} ${value}\n\n`;
  });

  // Error metrics
  prometheusMetrics += `# HELP kabir_sant_errors_total Total number of errors\n`;
  prometheusMetrics += `# TYPE kabir_sant_errors_total counter\n`;
  prometheusMetrics += `kabir_sant_errors_total ${data.errors.stats.total}\n\n`;

  // Error by status code
  Object.entries(data.errors.stats.byStatusCode).forEach(([statusCode, count]) => {
    prometheusMetrics += `kabir_sant_errors_by_status{status_code="${statusCode}"} ${count}\n`;
  });

  prometheusMetrics += '\n';

  // Health check metrics
  data.healthChecks.forEach((check: any) => {
    const checkName = `kabir_sant_health_check_${check.name.replace(/[^a-zA-Z0-9_]/g, '_')}`;
    const value = check.status === 'pass' ? 1 : check.status === 'warn' ? 0.5 : 0;

    prometheusMetrics += `# HELP ${checkName} Health check status\n`;
    prometheusMetrics += `# TYPE ${checkName} gauge\n`;
    prometheusMetrics += `${checkName} ${value}\n`;
    prometheusMetrics += `${checkName}_duration_ms ${check.duration}\n\n`;
  });

  return new NextResponse(prometheusMetrics, {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}

// Route handlers
export async function GET(request: NextRequest): Promise<NextResponse> {
  return withErrorTracking(metricsHandler)(request);
}

// Metrics summary endpoint
async function metricsSummaryHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const errorStats = errorTracker.getErrorStats();
    const isHealthy = errorTracker.isHealthy();

    const summary = {
      timestamp: new Date().toISOString(),
      status: isHealthy ? 'healthy' : 'unhealthy',
      summary: {
        totalErrors: errorStats.total,
        recentAlerts: errorTracker.getAlerts().length,
        criticalIssues: errorStats.bySeverity.critical || 0,
        warningIssues: errorStats.bySeverity.warning || 0
      },
      quickStats: {
        mostCommonErrors: errorStats.mostCommon.slice(0, 3),
        errorsByStatus: errorStats.byStatusCode
      }
    };

    return NextResponse.json(summary, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=30' // Cache for 30 seconds
      }
    });

  } catch (error) {
    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      detail: 'Failed to retrieve metrics summary',
      instance: request.url
    });
  }
}

// Alternative endpoint for metrics summary
export async function HEAD(request: NextRequest): Promise<NextResponse> {
  const isHealthy = errorTracker.isHealthy();

  return new NextResponse(null, {
    status: isHealthy ? 200 : 503,
    headers: {
      'X-Metrics-Status': isHealthy ? 'healthy' : 'unhealthy',
      'X-Error-Count': String(errorTracker.getErrorStats().total)
    }
  });
}