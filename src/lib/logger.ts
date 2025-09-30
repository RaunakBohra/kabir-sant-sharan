/**
 * Structured Logging System with Request Tracing
 * Provides production-ready logging with correlation IDs and structured data
 * Integrates with monitoring services like Sentry, CloudWatch, etc.
 */

import { createId } from '@paralleldrive/cuid2';
import { securityConfig, isDevelopment, isProduction } from './config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  traceId?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  responseTime?: number;
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: LogContext;
  stack?: string;
  service: string;
  environment: string;
  version?: string;
}

/**
 * Logger class with structured logging capabilities
 */
class StructuredLogger {
  private serviceName = 'kabir-sant-sharan';
  private version = process.env.npm_package_version || '1.0.0';
  private environment = process.env.NODE_ENV || 'development';

  /**
   * Create a log entry with structured data
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context: LogContext = {},
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        traceId: context.traceId || createId(),
        ...context
      },
      stack: error?.stack,
      service: this.serviceName,
      environment: this.environment,
      version: this.version
    };
  }

  /**
   * Output log entry to appropriate destination
   */
  private output(entry: LogEntry): void {
    if (isDevelopment()) {
      // Pretty print for development
      const colorMap = {
        debug: '\x1b[36m', // cyan
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m'  // red
      };
      const reset = '\x1b[0m';
      const color = colorMap[entry.level];

      console.log(
        `${color}[${entry.timestamp}] ${entry.level.toUpperCase()}${reset} ${entry.message}`,
        entry.context.traceId ? `(${entry.context.traceId})` : '',
        entry.context
      );

      if (entry.stack) {
        console.error(entry.stack);
      }
    } else {
      // JSON format for production
      console.log(JSON.stringify(entry));
    }

    // Send to external monitoring services in production
    if (isProduction()) {
      this.sendToMonitoring(entry);
    }
  }

  /**
   * Send logs to external monitoring services
   */
  private sendToMonitoring(entry: LogEntry): void {
    // Sentry integration
    if (securityConfig.monitoring.sentryDsn && entry.level === 'error') {
      // In a real implementation, integrate with Sentry SDK
      // Sentry.captureException(new Error(entry.message), {
      //   tags: { service: entry.service },
      //   extra: entry.context
      // });
    }

    // CloudWatch Logs integration (for AWS deployments)
    // In a real implementation, send to CloudWatch or other log aggregation service

    // Custom analytics endpoint
    if (entry.level === 'error' || entry.level === 'warn') {
      // Send critical logs to internal monitoring endpoint
      // fetch('/api/internal/logs', {
      //   method: 'POST',
      //   body: JSON.stringify(entry)
      // }).catch(() => {}); // Fail silently to avoid logging loops
    }
  }

  /**
   * Debug level logging
   */
  debug(message: string, context: LogContext = {}): void {
    if (securityConfig.logging.level === 'debug') {
      this.output(this.createLogEntry('debug', message, context));
    }
  }

  /**
   * Info level logging
   */
  info(message: string, context: LogContext = {}): void {
    if (['debug', 'info'].includes(securityConfig.logging.level)) {
      this.output(this.createLogEntry('info', message, context));
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, context: LogContext = {}): void {
    if (['debug', 'info', 'warn'].includes(securityConfig.logging.level)) {
      this.output(this.createLogEntry('warn', message, context));
    }
  }

  /**
   * Error level logging
   */
  error(message: string, context: LogContext = {}, error?: Error): void {
    this.output(this.createLogEntry('error', message, context, error));
  }

  /**
   * Create a child logger with additional context
   */
  child(childContext: LogContext): StructuredLogger {
    const childLogger = new StructuredLogger();

    // Override output method to include child context
    const originalOutput = childLogger.output.bind(childLogger);
    childLogger.output = (entry: LogEntry) => {
      entry.context = { ...childContext, ...entry.context };
      originalOutput(entry);
    };

    return childLogger;
  }

  /**
   * Log HTTP request details
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    context: LogContext = {}
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;

    this[level](message, {
      ...context,
      method,
      endpoint: url,
      statusCode,
      responseTime
    });
  }

  /**
   * Log authentication events
   */
  logAuth(
    event: 'login_attempt' | 'login_success' | 'login_failure' | 'token_refresh' | 'logout',
    context: LogContext = {}
  ): void {
    const level = event.includes('failure') ? 'warn' : 'info';
    const message = `Authentication event: ${event}`;

    this[level](message, {
      ...context,
      authEvent: event
    });
  }

  /**
   * Log security events
   */
  logSecurity(
    event: 'rate_limit_exceeded' | 'invalid_token' | 'unauthorized_access' | 'suspicious_activity',
    context: LogContext = {}
  ): void {
    const message = `Security event: ${event}`;

    this.warn(message, {
      ...context,
      securityEvent: event
    });
  }

  /**
   * Log database operations
   */
  logDatabase(
    operation: 'query' | 'insert' | 'update' | 'delete',
    table: string,
    duration: number,
    context: LogContext = {}
  ): void {
    const message = `Database ${operation} on ${table} - ${duration}ms`;

    this.debug(message, {
      ...context,
      dbOperation: operation,
      dbTable: table,
      dbDuration: duration
    });
  }

  /**
   * Log application performance metrics
   */
  logPerformance(
    metric: string,
    value: number,
    unit: 'ms' | 'bytes' | 'count',
    context: LogContext = {}
  ): void {
    const message = `Performance metric: ${metric} = ${value}${unit}`;

    this.info(message, {
      ...context,
      performanceMetric: metric,
      performanceValue: value,
      performanceUnit: unit
    });
  }
}

/**
 * Request context middleware for tracing
 */
export class RequestTracer {
  private static contexts = new Map<string, LogContext>();

  /**
   * Create a new request context with trace ID
   */
  static createContext(request: Request): LogContext {
    const traceId = createId();
    const url = new URL(request.url);

    const context: LogContext = {
      traceId,
      requestId: createId(),
      method: request.method,
      endpoint: url.pathname,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          undefined
    };

    this.contexts.set(traceId, context);
    return context;
  }

  /**
   * Get context by trace ID
   */
  static getContext(traceId: string): LogContext | undefined {
    return this.contexts.get(traceId);
  }

  /**
   * Update context with additional information
   */
  static updateContext(traceId: string, updates: Partial<LogContext>): void {
    const context = this.contexts.get(traceId);
    if (context) {
      Object.assign(context, updates);
    }
  }

  /**
   * Clean up context (call at end of request)
   */
  static cleanupContext(traceId: string): void {
    this.contexts.delete(traceId);
  }

  /**
   * Create logger with request context
   */
  static createLogger(traceId: string): StructuredLogger {
    const context = this.getContext(traceId) || {};
    return logger.child(context);
  }
}

/**
 * Singleton logger instance
 */
export const logger = new StructuredLogger();

/**
 * Create request-scoped logger
 */
export function createRequestLogger(request: Request): {
  logger: StructuredLogger;
  context: LogContext;
} {
  const context = RequestTracer.createContext(request);
  const requestLogger = logger.child(context);

  return { logger: requestLogger, context };
}

/**
 * Express-style logging middleware for Next.js API routes
 */
export function withLogging<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  handlerName: string = 'api-handler'
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now();
    let request: Request | undefined;
    let context: LogContext = {};

    // Try to extract request from arguments
    if (args[0] && typeof args[0] === 'object' && 'url' in args[0]) {
      request = args[0] as Request;
      const requestContext = createRequestLogger(request);
      context = requestContext.context;
    }

    const requestLogger = logger.child(context);

    try {
      requestLogger.info(`Starting ${handlerName}`, context);

      const result = await handler(...args);

      const duration = Date.now() - startTime;
      requestLogger.info(`Completed ${handlerName}`, {
        ...context,
        duration,
        success: true
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      requestLogger.error(`Failed ${handlerName}`, {
        ...context,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, error instanceof Error ? error : undefined);

      throw error;
    } finally {
      // Cleanup trace context
      if (context.traceId) {
        RequestTracer.cleanupContext(context.traceId);
      }
    }
  };
}

