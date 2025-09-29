import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminUser, seedAdminUser } from '@/lib/db-seed';
import { generateTokenPair, createAuthMiddleware } from '@/lib/jwt-auth';
import { checkRateLimit, createRateLimitHeaders } from '@/lib/rate-limiter';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { validateRequest, LoginSchema } from '@/lib/validation-schemas';
import { withPerformanceTracking } from '@/lib/middleware/performance-middleware';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

async function loginHandler(request: NextRequest) {
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

    // Generate JWT tokens (no database session for now)
    const userId = 'admin-' + createId();
    const tokenPair = generateTokenPair({ userId });

    const user = {
      id: userId,
      email: adminEmail,
      name: 'Admin',
      role: 'admin'
    };

    // Add security headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      expiresAt: tokenPair.accessExpiresAt,
      refreshExpiresAt: tokenPair.refreshExpiresAt,
      user,
      message: 'Login successful'
    }, { headers });

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