import { NextRequest, NextResponse } from 'next/server';
import { sessionManager, type SessionValidationResult } from '../session-manager';
import { createErrorResponse } from '../api/error-handler';
import { logger } from '../logger';

export interface SessionMiddlewareOptions {
  required?: boolean;
  roles?: string[];
  redirectOnUnauth?: string;
  skipPaths?: string[];
}

export interface AuthenticatedRequest extends NextRequest {
  session?: {
    id: string;
    userId: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
}

/**
 * Session middleware for protecting routes and handling authentication
 */
export function withSessionValidation(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: SessionMiddlewareOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const {
      required = true,
      roles = [],
      redirectOnUnauth,
      skipPaths = []
    } = options;

    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Skip validation for specified paths
      if (skipPaths.some(path => pathname.startsWith(path))) {
        return handler(request as AuthenticatedRequest);
      }

      // Validate session
      const validation = await sessionManager.validateSessionFromRequest(request);

      // Handle authentication based on requirements
      if (required && !validation.valid) {
        return handleAuthenticationFailure(validation, redirectOnUnauth, request);
      }

      // Check role authorization if roles are specified
      if (validation.valid && validation.session && roles.length > 0) {
        const userRole = validation.session.user?.role;
        if (!userRole || !roles.includes(userRole)) {
          logger.warn('User lacks required role', {
            userId: validation.session.userId,
            userRole,
            requiredRoles: roles,
            path: pathname,
            component: 'session-middleware'
          });

          return createErrorResponse({
            title: 'Forbidden',
            detail: 'Insufficient permissions to access this resource',
            status: 403,
            instance: request.url
          });
        }
      }

      // Add session information to request
      const authenticatedRequest = request as AuthenticatedRequest;
      if (validation.valid && validation.session) {
        authenticatedRequest.session = {
          id: validation.session.id,
          userId: validation.session.userId,
          user: validation.session.user
        };
      }

      // Proceed with the request
      return handler(authenticatedRequest);

    } catch (error) {
      logger.error('Session middleware error', {
        error: error instanceof Error ? error.message : String(error),
        url: request.url,
        component: 'session-middleware'
      });

      return createErrorResponse({
        title: 'Authentication Error',
        detail: 'Failed to validate session',
        status: 500,
        instance: request.url
      });
    }
  };
}

/**
 * Handle authentication failures
 */
function handleAuthenticationFailure(
  validation: SessionValidationResult,
  redirectUrl?: string,
  request?: NextRequest
): NextResponse {
  if (redirectUrl) {
    // Redirect to login or specified URL
    const redirectTo = new URL(redirectUrl, request?.url || 'http://localhost:3000');
    return NextResponse.redirect(redirectTo);
  }

  // Return JSON error response
  if (validation.needsRefresh) {
    return createErrorResponse({
      title: 'Token Expired',
      detail: 'Access token has expired. Please refresh your token.',
      status: 401,
      instance: request?.url || '',
      type: 'https://tools.ietf.org/html/rfc6750#section-3.1'
    }, {
      'WWW-Authenticate': 'Bearer error="invalid_token", error_description="Token expired"'
    });
  }

  return createErrorResponse({
    title: 'Unauthorized',
    detail: validation.error || 'Authentication required',
    status: 401,
    instance: request?.url || '',
    type: 'https://tools.ietf.org/html/rfc6750#section-3.1'
  }, {
    'WWW-Authenticate': 'Bearer'
  });
}

/**
 * Middleware for admin routes (requires admin role)
 */
export function withAdminAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withSessionValidation(handler, {
    required: true,
    roles: ['admin']
  });
}

/**
 * Middleware for optional authentication (doesn't fail if no session)
 */
export function withOptionalAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withSessionValidation(handler, {
    required: false
  });
}

/**
 * Middleware for user-specific routes (requires any authenticated user)
 */
export function withUserAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withSessionValidation(handler, {
    required: true,
    roles: ['admin', 'member', 'moderator']
  });
}

/**
 * Create a session cleanup middleware (for periodic cleanup)
 */
export function withSessionCleanup(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Run cleanup in background (don't await)
      setImmediate(async () => {
        try {
          const deletedCount = await sessionManager.cleanupExpiredSessions();
          if (deletedCount > 0) {
            logger.info('Expired sessions cleaned up', {
              deletedCount,
              component: 'session-cleanup'
            });
          }
        } catch (error) {
          logger.error('Session cleanup failed', {
            error: error instanceof Error ? error.message : String(error),
            component: 'session-cleanup'
          });
        }
      });

      return handler(request);

    } catch (error) {
      logger.error('Session cleanup middleware error', {
        error: error instanceof Error ? error.message : String(error),
        component: 'session-cleanup'
      });

      return handler(request);
    }
  };
}

/**
 * Extract user information from authenticated request
 */
export function getSessionUser(request: AuthenticatedRequest): {
  id: string;
  email: string;
  name: string;
  role: string;
} | null {
  return request.session?.user || null;
}

/**
 * Extract session ID from authenticated request
 */
export function getSessionId(request: AuthenticatedRequest): string | null {
  return request.session?.id || null;
}

/**
 * Extract user ID from authenticated request
 */
export function getUserId(request: AuthenticatedRequest): string | null {
  return request.session?.userId || null;
}

/**
 * Check if user has specific role
 */
export function hasRole(request: AuthenticatedRequest, role: string): boolean {
  return request.session?.user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(request: AuthenticatedRequest, roles: string[]): boolean {
  const userRole = request.session?.user?.role;
  return userRole ? roles.includes(userRole) : false;
}

/**
 * Rate limiting middleware that uses session information
 */
export function withSessionRateLimit(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  options: {
    maxRequests: number;
    windowMs: number;
    skipIfAuthenticated?: boolean;
  }
) {
  const requestCounts = new Map<string, { count: number; resetTime: number }>();

  return withOptionalAuth(async (request: AuthenticatedRequest): Promise<NextResponse> => {
    const { maxRequests, windowMs, skipIfAuthenticated = false } = options;

    // Skip rate limiting for authenticated users if configured
    if (skipIfAuthenticated && request.session) {
      return handler(request);
    }

    // Use session ID if available, otherwise fall back to IP address
    const identifier = request.session?.id ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const now = Date.now();
    const userCount = requestCounts.get(identifier);

    if (!userCount || now > userCount.resetTime) {
      // First request or window expired
      requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return handler(request);
    }

    if (userCount.count >= maxRequests) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((userCount.resetTime - now) / 1000);

      logger.warn('Rate limit exceeded', {
        identifier,
        count: userCount.count,
        maxRequests,
        retryAfter,
        component: 'session-rate-limit'
      });

      return createErrorResponse({
        title: 'Too Many Requests',
        detail: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        status: 429,
        instance: request.url
      }, {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Limit': String(maxRequests),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(userCount.resetTime)
      });
    }

    // Increment count
    userCount.count++;
    requestCounts.set(identifier, userCount);

    // Add rate limit headers
    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', String(maxRequests));
    response.headers.set('X-RateLimit-Remaining', String(maxRequests - userCount.count));
    response.headers.set('X-RateLimit-Reset', String(userCount.resetTime));

    return response;
  });
}