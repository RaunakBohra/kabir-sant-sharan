import { NextRequest, NextResponse } from 'next/server';
import { performanceMonitor } from '../monitoring/performance-monitor';
import { logger } from '../logger';
import { createId } from '@paralleldrive/cuid2';

export interface PerformanceMiddlewareOptions {
  trackRequests?: boolean;
  trackDatabase?: boolean;
  logSlowRequests?: boolean;
  slowRequestThreshold?: number;
}

/**
 * Middleware to automatically track request performance
 */
export function withPerformanceTracking<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T,
  options: PerformanceMiddlewareOptions = {}
): T {
  const {
    trackRequests = true,
    trackDatabase = true,
    logSlowRequests = true,
    slowRequestThreshold = 1000
  } = options;

  return (async (request: NextRequest, ...args: any[]) => {
    const startTime = Date.now();
    const requestId = createId();

    // Add request ID to headers for tracing
    const requestWithId = new Proxy(request, {
      get(target, prop) {
        if (prop === 'headers') {
          const headers = new Headers(target.headers);
          headers.set('x-request-id', requestId);
          return headers;
        }
        return target[prop as keyof NextRequest];
      }
    });

    let response: NextResponse;
    let responseSize: number | undefined;

    try {
      // Call the original handler
      response = await handler(requestWithId, ...args);

      // Calculate response size if available
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        responseSize = parseInt(contentLength, 10);
      }

    } catch (error) {
      // Handle errors and still track performance
      const duration = Date.now() - startTime;

      if (trackRequests) {
        performanceMonitor.recordRequest({
          method: request.method,
          path: new URL(request.url).pathname,
          statusCode: 500,
          duration,
          userAgent: request.headers.get('user-agent') || undefined,
          ip: getClientIP(request)
        });
      }

      logger.error('Request handler error during performance tracking', {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        duration,
        error: error instanceof Error ? error.message : String(error),
        component: 'performance-middleware'
      });

      throw error;
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Track request performance
    if (trackRequests) {
      performanceMonitor.recordRequest({
        method: request.method,
        path: new URL(request.url).pathname,
        statusCode: response.status,
        duration,
        responseSize,
        userAgent: request.headers.get('user-agent') || undefined,
        ip: getClientIP(request)
      });
    }

    // Log slow requests
    if (logSlowRequests && duration > slowRequestThreshold) {
      logger.warn('Slow request detected', {
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        duration,
        statusCode: response.status,
        component: 'performance-middleware'
      });
    }

    // Add performance headers to response
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('x-request-id', requestId);
    responseHeaders.set('x-response-time', `${duration}ms`);
    responseHeaders.set('x-timestamp', new Date().toISOString());

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });

  }) as T;
}

/**
 * Database operation performance tracker
 */
export class DatabasePerformanceTracker {
  private operation: string;
  private table?: string;
  private startTime: number;
  private queryId: string;

  constructor(operation: string, table?: string) {
    this.operation = operation;
    this.table = table;
    this.startTime = Date.now();
    this.queryId = createId();
  }

  /**
   * Complete the tracking and record the performance
   */
  complete(options: { rows?: number; cached?: boolean } = {}): string {
    const duration = Date.now() - this.startTime;

    performanceMonitor.recordDatabaseOperation({
      operation: this.operation,
      table: this.table,
      duration,
      rows: options.rows,
      cached: options.cached || false
    });

    if (duration > 500) {
      logger.warn('Slow database operation', {
        queryId: this.queryId,
        operation: this.operation,
        table: this.table,
        duration,
        rows: options.rows,
        component: 'database-performance'
      });
    }

    return this.queryId;
  }
}

/**
 * Utility to create a database performance tracker
 */
export function trackDatabaseOperation(operation: string, table?: string): DatabasePerformanceTracker {
  return new DatabasePerformanceTracker(operation, table);
}

/**
 * Extract client IP from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback - this will be undefined in serverless environments
  return (request as any).ip || 'unknown';
}

/**
 * Performance middleware for API routes that measures execution time
 */
export function measureExecutionTime<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  metricName: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now();

    try {
      const result = await fn(...args);
      const duration = Date.now() - startTime;

      performanceMonitor.recordMetric({
        name: metricName,
        value: duration,
        unit: 'ms',
        context: {
          success: true,
          args: args.length
        }
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      performanceMonitor.recordMetric({
        name: metricName,
        value: duration,
        unit: 'ms',
        context: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          args: args.length
        }
      });

      throw error;
    }
  }) as T;
}

/**
 * Decorator for automatic performance tracking of class methods
 */
export function PerformanceTracked(metricName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const trackingName = metricName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();

      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;

        performanceMonitor.recordMetric({
          name: trackingName,
          value: duration,
          unit: 'ms',
          context: {
            success: true,
            className: target.constructor.name,
            methodName: propertyName
          }
        });

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        performanceMonitor.recordMetric({
          name: trackingName,
          value: duration,
          unit: 'ms',
          context: {
            success: false,
            error: error instanceof Error ? error.message : String(error),
            className: target.constructor.name,
            methodName: propertyName
          }
        });

        throw error;
      }
    };

    return descriptor;
  };
}