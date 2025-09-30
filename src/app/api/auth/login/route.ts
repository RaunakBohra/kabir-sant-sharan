import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getAdminUser, seedAdminUser } from '@/lib/db-seed';
import { generateTokenPair, createAuthMiddleware } from '@/lib/jwt-auth';
import { checkRateLimit, createRateLimitHeaders } from '@/lib/rate-limiter';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { validateRequest, LoginSchema } from '@/lib/validation-schemas';
import { withPerformanceTracking } from '@/lib/middleware/performance-middleware';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

/**
 * Extract client IP from request headers
 */
function getClientIP(request: NextRequest): string {
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

  return request.ip || 'unknown';
}

async function loginHandler(request: NextRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    // Check rate limiting first
    const rateLimitResponse = await checkRateLimit(request, 'auth');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = await validateRequest(LoginSchema, body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'Invalid email or password format',
        metadata: {
          errors: validation.errors,
          traceId
        }
      });
    }

    const { email, password } = validation.data;

    // Check if admin credentials match environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kabirsantsharan.com';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return createErrorResponse('CONFIGURATION_ERROR', {
        instance,
        detail: 'Admin credentials not configured',
        metadata: { traceId }
      });
    }

    if (email !== adminEmail) {
      return createErrorResponse('INVALID_CREDENTIALS', {
        instance,
        metadata: { traceId }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);

    if (!isValidPassword) {
      return createErrorResponse('INVALID_CREDENTIALS', {
        instance,
        metadata: { traceId }
      });
    }

    // Create database session with proper user management
    const { createUserSession } = await import('@/lib/session-manager');
    const { getDatabase } = await import('@/lib/db');
    const { users } = await import('@/../drizzle/schema');

    // Use consistent admin user ID based on email
    const adminUserId = `admin-${Buffer.from(adminEmail).toString('base64').slice(0, 8)}`;

    // Ensure admin user exists in database
    try {
      const db = getDatabase();

      // Check if admin user already exists
      const existingUser = await db.select().from(users).where(eq(users.id, adminUserId)).limit(1);

      if (existingUser.length === 0) {
        // Create admin user
        await db.insert(users).values({
          id: adminUserId,
          email: adminEmail,
          name: 'Admin',
          role: 'admin',
          emailVerified: true,
          newsletter: false,
          language: 'en'
        });
      }
    } catch (userError) {
      logError(userError as Error, {
        traceId,
        detail: 'Failed to ensure admin user exists'
      });

      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance,
        detail: 'User management failed',
        metadata: { traceId }
      });
    }

    const sessionResult = await createUserSession(adminUserId, request);

    if (!sessionResult.success || !sessionResult.tokens) {
      logError(new Error(`Failed to create session: ${sessionResult.error}`), {
        traceId,
        userId: adminUserId
      });

      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance,
        detail: 'Session creation failed',
        metadata: { traceId }
      });
    }

    const user = {
      id: adminUserId,
      email: adminEmail,
      name: 'Admin',
      role: 'admin'
    };

    // Create response with tokens
    const response = NextResponse.json({
      accessToken: sessionResult.tokens.accessToken,
      refreshToken: sessionResult.tokens.refreshToken,
      expiresAt: sessionResult.tokens.accessExpiresAt,
      refreshExpiresAt: sessionResult.tokens.refreshExpiresAt,
      user,
      message: 'Login successful'
    });

    // Set cookies for session management
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/'
    };

    // Set access token cookie
    response.cookies.set('accessToken', sessionResult.tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 // 15 minutes
    });

    // Set refresh token cookie
    response.cookies.set('refreshToken', sessionResult.tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Add security headers
    response.headers.set('X-Trace-ID', traceId);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('Pragma', 'no-cache');

    return response;

  } catch (error) {
    logError(error as Error, {
      traceId,
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

// Export with performance tracking
export const POST = withPerformanceTracking(loginHandler, {
  trackRequests: true,
  trackDatabase: true,
  logSlowRequests: true,
  slowRequestThreshold: 2000 // Auth should be fast
});