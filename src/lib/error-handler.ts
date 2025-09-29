/**
 * RFC 9457 Compliant Error Response System
 * Implements Problem Details for HTTP APIs standard
 * Provides consistent, structured error responses
 */

import { NextResponse } from 'next/server';
import { createId } from '@paralleldrive/cuid2';

/**
 * RFC 9457 Problem Details interface
 */
export interface ProblemDetails {
  type: string;           // URI reference that identifies the problem type
  title: string;          // Human-readable summary of the problem type
  status: number;         // HTTP status code
  detail: string;         // Human-readable explanation specific to this problem
  instance: string;       // URI reference that identifies the specific occurrence
  timestamp: string;      // ISO 8601 timestamp when the error occurred
  traceId: string;        // Unique identifier for tracing/debugging
  [key: string]: any;     // Additional properties for specific error types
}

/**
 * Standard error types following RFC 9457
 */
export const ErrorTypes = {
  // Authentication & Authorization (4xx)
  MISSING_AUTHORIZATION: 'https://kabirsantsharan.com/errors/missing-authorization',
  INVALID_CREDENTIALS: 'https://kabirsantsharan.com/errors/invalid-credentials',
  INVALID_TOKEN: 'https://kabirsantsharan.com/errors/invalid-token',
  EXPIRED_TOKEN: 'https://kabirsantsharan.com/errors/expired-token',
  INSUFFICIENT_PERMISSIONS: 'https://kabirsantsharan.com/errors/insufficient-permissions',

  // Validation & Input (4xx)
  VALIDATION_ERROR: 'https://kabirsantsharan.com/errors/validation-error',
  MISSING_REQUIRED_FIELD: 'https://kabirsantsharan.com/errors/missing-required-field',
  INVALID_INPUT_FORMAT: 'https://kabirsantsharan.com/errors/invalid-input-format',
  DUPLICATE_RESOURCE: 'https://kabirsantsharan.com/errors/duplicate-resource',

  // Rate Limiting (4xx)
  RATE_LIMIT_EXCEEDED: 'https://kabirsantsharan.com/errors/rate-limit-exceeded',

  // Resource Management (4xx)
  RESOURCE_NOT_FOUND: 'https://kabirsantsharan.com/errors/resource-not-found',
  RESOURCE_CONFLICT: 'https://kabirsantsharan.com/errors/resource-conflict',
  UNSUPPORTED_MEDIA_TYPE: 'https://kabirsantsharan.com/errors/unsupported-media-type',
  PAYLOAD_TOO_LARGE: 'https://kabirsantsharan.com/errors/payload-too-large',

  // Server & System (5xx)
  INTERNAL_SERVER_ERROR: 'https://kabirsantsharan.com/errors/internal-server-error',
  DATABASE_ERROR: 'https://kabirsantsharan.com/errors/database-error',
  EXTERNAL_SERVICE_ERROR: 'https://kabirsantsharan.com/errors/external-service-error',
  CONFIGURATION_ERROR: 'https://kabirsantsharan.com/errors/configuration-error'
} as const;

/**
 * Predefined error templates
 */
export const ErrorTemplates = {
  [ErrorTypes.MISSING_AUTHORIZATION]: {
    title: 'Missing Authorization',
    status: 401,
    detail: 'Authorization header with Bearer token is required to access this resource.'
  },
  [ErrorTypes.INVALID_CREDENTIALS]: {
    title: 'Invalid Credentials',
    status: 401,
    detail: 'The provided email or password is incorrect.'
  },
  [ErrorTypes.INVALID_TOKEN]: {
    title: 'Invalid Token',
    status: 401,
    detail: 'The provided authentication token is invalid or malformed.'
  },
  [ErrorTypes.EXPIRED_TOKEN]: {
    title: 'Token Expired',
    status: 401,
    detail: 'The authentication token has expired. Please refresh your token.'
  },
  [ErrorTypes.INSUFFICIENT_PERMISSIONS]: {
    title: 'Insufficient Permissions',
    status: 403,
    detail: 'You do not have sufficient permissions to access this resource.'
  },
  [ErrorTypes.VALIDATION_ERROR]: {
    title: 'Validation Error',
    status: 400,
    detail: 'The request contains invalid or incomplete data.'
  },
  [ErrorTypes.RATE_LIMIT_EXCEEDED]: {
    title: 'Rate Limit Exceeded',
    status: 429,
    detail: 'Too many requests. Please wait before making additional requests.'
  },
  [ErrorTypes.RESOURCE_NOT_FOUND]: {
    title: 'Resource Not Found',
    status: 404,
    detail: 'The requested resource could not be found.'
  },
  [ErrorTypes.INTERNAL_SERVER_ERROR]: {
    title: 'Internal Server Error',
    status: 500,
    detail: 'An unexpected error occurred. Please try again later.'
  },
  [ErrorTypes.DATABASE_ERROR]: {
    title: 'Database Error',
    status: 500,
    detail: 'A database operation failed. Please try again later.'
  }
} as const;

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  type: keyof typeof ErrorTypes,
  options: {
    detail?: string;
    instance?: string;
    metadata?: Record<string, any>;
    status?: number;
    title?: string;
  } = {}
): NextResponse {
  const errorType = ErrorTypes[type];
  const template = ErrorTemplates[errorType];
  const traceId = createId();

  const problemDetails: ProblemDetails = {
    type: errorType,
    title: options.title || template.title,
    status: options.status || template.status,
    detail: options.detail || template.detail,
    instance: options.instance || '/unknown',
    timestamp: new Date().toISOString(),
    traceId,
    ...options.metadata
  };

  return NextResponse.json(problemDetails, {
    status: problemDetails.status,
    headers: {
      'Content-Type': 'application/problem+json',
      'X-Trace-ID': traceId
    }
  });
}

/**
 * Create validation error response with field details
 */
export function createValidationErrorResponse(
  validationErrors: Array<{
    field: string;
    message: string;
    code?: string;
  }>,
  instance: string
): NextResponse {
  return createErrorResponse('VALIDATION_ERROR', {
    instance,
    detail: `Validation failed for ${validationErrors.length} field(s).`,
    metadata: {
      errors: validationErrors,
      errorCount: validationErrors.length
    }
  });
}

/**
 * Create rate limit error response with retry information
 */
export function createRateLimitErrorResponse(
  instance: string,
  retryAfter: number,
  limit: number,
  windowMs: number
): NextResponse {
  const response = createErrorResponse('RATE_LIMIT_EXCEEDED', {
    instance,
    detail: `Rate limit of ${limit} requests per ${Math.ceil(windowMs / 1000)} seconds exceeded. Try again in ${retryAfter} seconds.`,
    metadata: {
      limit,
      retryAfter,
      windowMs
    }
  });

  // Add rate limit headers
  response.headers.set('Retry-After', retryAfter.toString());
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', '0');
  response.headers.set('X-RateLimit-Reset', Math.ceil((Date.now() + (retryAfter * 1000)) / 1000).toString());

  return response;
}

/**
 * Extract instance path from request
 */
export function getInstancePath(request: Request): string {
  try {
    const url = new URL(request.url);
    return url.pathname + (url.search || '');
  } catch {
    return '/unknown';
  }
}

/**
 * Centralized error logger
 */
export interface ErrorContext {
  traceId: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
  request?: {
    method: string;
    url: string;
    headers: Record<string, string>;
  };
}

export function logError(
  error: Error | ProblemDetails,
  context: Partial<ErrorContext> = {}
): void {
  const traceId = context.traceId || createId();
  const timestamp = context.timestamp || new Date().toISOString();

  const logEntry = {
    level: 'error',
    traceId,
    timestamp,
    message: error instanceof Error ? error.message : error.detail,
    stack: error instanceof Error ? error.stack : undefined,
    problemDetails: error instanceof Error ? undefined : error,
    context: {
      userId: context.userId,
      sessionId: context.sessionId,
      userAgent: context.userAgent,
      ip: context.ip,
      request: context.request
    }
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error Log Entry:', JSON.stringify(logEntry, null, 2));
  }

  // In production, this would integrate with monitoring services
  // like Sentry, LogRocket, or Cloudflare's analytics
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service
    // Example: Sentry.captureException(error, { extra: context });
  }
}

/**
 * Error boundary for API routes
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  context: Partial<ErrorContext> = {}
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      const traceId = createId();

      logError(error as Error, {
        ...context,
        traceId,
        timestamp: new Date().toISOString()
      });

      // Don't expose internal error details in production
      if (process.env.NODE_ENV === 'production') {
        return createErrorResponse('INTERNAL_SERVER_ERROR', {
          instance: context.request?.url || '/unknown',
          metadata: { traceId }
        });
      }

      // In development, provide more details
      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance: context.request?.url || '/unknown',
        detail: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          traceId,
          stack: error instanceof Error ? error.stack : undefined
        }
      });
    }
  };
}

/**
 * Middleware to add error handling to API routes
 */
export function createErrorHandlerMiddleware() {
  return (request: Request, handler: (req: Request) => Promise<Response>) => {
    return withErrorHandling(
      handler,
      {
        request: {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers.entries())
        },
        userAgent: request.headers.get('user-agent') || undefined,
        ip: request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            undefined
      }
    )(request);
  };
}