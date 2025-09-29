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
    if (isDevelopment) {
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
    if (isProduction) {
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
      // Sentry.captureException(new Error(entry.message), {\n      //   tags: { service: entry.service },\n      //   extra: entry.context\n      // });\n    }\n\n    // CloudWatch Logs integration (for AWS deployments)\n    // In a real implementation, send to CloudWatch or other log aggregation service\n\n    // Custom analytics endpoint\n    if (entry.level === 'error' || entry.level === 'warn') {\n      // Send critical logs to internal monitoring endpoint\n      // fetch('/api/internal/logs', {\n      //   method: 'POST',\n      //   body: JSON.stringify(entry)\n      // }).catch(() => {}); // Fail silently to avoid logging loops\n    }\n  }\n\n  /**\n   * Debug level logging\n   */\n  debug(message: string, context: LogContext = {}): void {\n    if (securityConfig.logging.level === 'debug') {\n      this.output(this.createLogEntry('debug', message, context));\n    }\n  }\n\n  /**\n   * Info level logging\n   */\n  info(message: string, context: LogContext = {}): void {\n    if (['debug', 'info'].includes(securityConfig.logging.level)) {\n      this.output(this.createLogEntry('info', message, context));\n    }\n  }\n\n  /**\n   * Warning level logging\n   */\n  warn(message: string, context: LogContext = {}): void {\n    if (['debug', 'info', 'warn'].includes(securityConfig.logging.level)) {\n      this.output(this.createLogEntry('warn', message, context));\n    }\n  }\n\n  /**\n   * Error level logging\n   */\n  error(message: string, context: LogContext = {}, error?: Error): void {\n    this.output(this.createLogEntry('error', message, context, error));\n  }\n\n  /**\n   * Create a child logger with additional context\n   */\n  child(childContext: LogContext): StructuredLogger {\n    const childLogger = new StructuredLogger();\n    \n    // Override output method to include child context\n    const originalOutput = childLogger.output.bind(childLogger);\n    childLogger.output = (entry: LogEntry) => {\n      entry.context = { ...childContext, ...entry.context };\n      originalOutput(entry);\n    };\n\n    return childLogger;\n  }\n\n  /**\n   * Log HTTP request details\n   */\n  logRequest(\n    method: string,\n    url: string,\n    statusCode: number,\n    responseTime: number,\n    context: LogContext = {}\n  ): void {\n    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';\n    const message = `${method} ${url} ${statusCode} - ${responseTime}ms`;\n\n    this[level](message, {\n      ...context,\n      method,\n      endpoint: url,\n      statusCode,\n      responseTime\n    });\n  }\n\n  /**\n   * Log authentication events\n   */\n  logAuth(\n    event: 'login_attempt' | 'login_success' | 'login_failure' | 'token_refresh' | 'logout',\n    context: LogContext = {}\n  ): void {\n    const level = event.includes('failure') ? 'warn' : 'info';\n    const message = `Authentication event: ${event}`;\n\n    this[level](message, {\n      ...context,\n      authEvent: event\n    });\n  }\n\n  /**\n   * Log security events\n   */\n  logSecurity(\n    event: 'rate_limit_exceeded' | 'invalid_token' | 'unauthorized_access' | 'suspicious_activity',\n    context: LogContext = {}\n  ): void {\n    const message = `Security event: ${event}`;\n\n    this.warn(message, {\n      ...context,\n      securityEvent: event\n    });\n  }\n\n  /**\n   * Log database operations\n   */\n  logDatabase(\n    operation: 'query' | 'insert' | 'update' | 'delete',\n    table: string,\n    duration: number,\n    context: LogContext = {}\n  ): void {\n    const message = `Database ${operation} on ${table} - ${duration}ms`;\n\n    this.debug(message, {\n      ...context,\n      dbOperation: operation,\n      dbTable: table,\n      dbDuration: duration\n    });\n  }\n\n  /**\n   * Log application performance metrics\n   */\n  logPerformance(\n    metric: string,\n    value: number,\n    unit: 'ms' | 'bytes' | 'count',\n    context: LogContext = {}\n  ): void {\n    const message = `Performance metric: ${metric} = ${value}${unit}`;\n\n    this.info(message, {\n      ...context,\n      performanceMetric: metric,\n      performanceValue: value,\n      performanceUnit: unit\n    });\n  }\n}\n\n/**\n * Request context middleware for tracing\n */\nexport class RequestTracer {\n  private static contexts = new Map<string, LogContext>();\n\n  /**\n   * Create a new request context with trace ID\n   */\n  static createContext(request: Request): LogContext {\n    const traceId = createId();\n    const url = new URL(request.url);\n    \n    const context: LogContext = {\n      traceId,\n      requestId: createId(),\n      method: request.method,\n      endpoint: url.pathname,\n      userAgent: request.headers.get('user-agent') || undefined,\n      ip: request.headers.get('x-forwarded-for') || \n          request.headers.get('x-real-ip') || \n          undefined\n    };\n\n    this.contexts.set(traceId, context);\n    return context;\n  }\n\n  /**\n   * Get context by trace ID\n   */\n  static getContext(traceId: string): LogContext | undefined {\n    return this.contexts.get(traceId);\n  }\n\n  /**\n   * Update context with additional information\n   */\n  static updateContext(traceId: string, updates: Partial<LogContext>): void {\n    const context = this.contexts.get(traceId);\n    if (context) {\n      Object.assign(context, updates);\n    }\n  }\n\n  /**\n   * Clean up context (call at end of request)\n   */\n  static cleanupContext(traceId: string): void {\n    this.contexts.delete(traceId);\n  }\n\n  /**\n   * Create logger with request context\n   */\n  static createLogger(traceId: string): StructuredLogger {\n    const context = this.getContext(traceId) || {};\n    return logger.child(context);\n  }\n}\n\n/**\n * Singleton logger instance\n */\nexport const logger = new StructuredLogger();\n\n/**\n * Create request-scoped logger\n */\nexport function createRequestLogger(request: Request): {\n  logger: StructuredLogger;\n  context: LogContext;\n} {\n  const context = RequestTracer.createContext(request);\n  const requestLogger = logger.child(context);\n\n  return { logger: requestLogger, context };\n}\n\n/**\n * Express-style logging middleware for Next.js API routes\n */\nexport function withLogging<T extends any[], R>(\n  handler: (...args: T) => Promise<R>,\n  handlerName: string = 'api-handler'\n) {\n  return async (...args: T): Promise<R> => {\n    const startTime = Date.now();\n    let request: Request | undefined;\n    let context: LogContext = {};\n\n    // Try to extract request from arguments\n    if (args[0] && typeof args[0] === 'object' && 'url' in args[0]) {\n      request = args[0] as Request;\n      const requestContext = createRequestLogger(request);\n      context = requestContext.context;\n    }\n\n    const requestLogger = logger.child(context);\n\n    try {\n      requestLogger.info(`Starting ${handlerName}`, context);\n      \n      const result = await handler(...args);\n      \n      const duration = Date.now() - startTime;\n      requestLogger.info(`Completed ${handlerName}`, {\n        ...context,\n        duration,\n        success: true\n      });\n\n      return result;\n    } catch (error) {\n      const duration = Date.now() - startTime;\n      requestLogger.error(`Failed ${handlerName}`, {\n        ...context,\n        duration,\n        error: error instanceof Error ? error.message : 'Unknown error'\n      }, error instanceof Error ? error : undefined);\n      \n      throw error;\n    } finally {\n      // Cleanup trace context\n      if (context.traceId) {\n        RequestTracer.cleanupContext(context.traceId);\n      }\n    }\n  };\n}\n\n/**\n * Export types for external use\n */\nexport type { LogLevel, LogContext, LogEntry };