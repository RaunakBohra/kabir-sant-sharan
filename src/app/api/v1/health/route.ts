import { NextRequest, NextResponse } from 'next/server';
import { healthMonitor } from '@/lib/monitoring/health-monitor';
import { errorTracker } from '@/lib/monitoring/error-tracker';
import { logger } from '@/lib/logger';
import { withErrorTracking } from '@/lib/monitoring/error-tracker';

export const runtime = 'edge';

async function healthHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Get detailed health information
    const healthData = await healthMonitor.getHealthEndpointData();

    // Set appropriate HTTP status based on health
    let statusCode = 200;
    if (healthData.status === 'degraded') {
      statusCode = 200; // Still operational
    } else if (healthData.status === 'unhealthy') {
      statusCode = 503; // Service unavailable
    }

    // Log health check
    logger.info('Health check performed', {
      status: healthData.status,
      uptime: healthData.uptime,
      component: 'health-endpoint'
    });

    return NextResponse.json(healthData, {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Status': healthData.status
      }
    });

  } catch (error) {
    logger.error('Health check failed', {
      error: error instanceof Error ? error.message : String(error),
      component: 'health-endpoint'
    });

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      version: process.env.APP_VERSION || '1.0.0'
    }, {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}

// Basic health check endpoint
async function basicHealthHandler(request: NextRequest): Promise<NextResponse> {
  try {
    const uptime = Date.now() - parseInt(process.env.START_TIME || '0', 10);
    const isHealthy = errorTracker.isHealthy();

    const basicHealth = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime,
      version: process.env.APP_VERSION || '1.0.0'
    };

    return NextResponse.json(basicHealth, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Basic health check failed'
    }, { status: 503 });
  }
}

// Route handlers
export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const detailed = url.searchParams.get('detailed') === 'true';

  if (detailed) {
    return withErrorTracking(healthHandler)(request);
  } else {
    return withErrorTracking(basicHealthHandler)(request);
  }
}

// Support for HEAD requests (common for load balancers)
export async function HEAD(request: NextRequest): Promise<NextResponse> {
  try {
    const isHealthy = errorTracker.isHealthy();

    return new NextResponse(null, {
      status: isHealthy ? 200 : 503,
      headers: {
        'X-Health-Status': isHealthy ? 'healthy' : 'unhealthy',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}