import { NextRequest, NextResponse } from 'next/server';
import { refreshAccessToken } from '@/lib/jwt-auth';
import { checkRateLimit } from '@/lib/rate-limiter';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { validateRequest, RefreshTokenSchema } from '@/lib/validation-schemas';
import { getAdminUser } from '@/lib/db-seed';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    // Check rate limiting
    const rateLimitResponse = await checkRateLimit(request, 'auth');
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = await validateRequest(RefreshTokenSchema, body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'Invalid refresh token format',
        metadata: {
          errors: validation.errors,
          traceId
        }
      });
    }

    const { refreshToken } = validation.data;

    // Attempt to refresh the session
    const { refreshUserSession } = await import('@/lib/session-manager');
    const refreshResult = await refreshUserSession(refreshToken);

    if (!refreshResult.success || !refreshResult.tokens) {
      return createErrorResponse('INVALID_TOKEN', {
        instance,
        detail: refreshResult.error || 'Invalid or expired refresh token',
        metadata: { traceId }
      });
    }

    // Get admin user data (since this is admin-only system)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kabirsantsharan.com';
    const adminUserId = `admin-${Buffer.from(adminEmail).toString('base64').slice(0, 8)}`;

    const user = {
      id: adminUserId,
      email: adminEmail,
      name: 'Admin',
      role: 'admin'
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      accessToken: refreshResult.tokens.accessToken,
      refreshToken: refreshResult.tokens.refreshToken,
      expiresAt: refreshResult.tokens.accessExpiresAt,
      refreshExpiresAt: refreshResult.tokens.refreshExpiresAt,
      user: user,
      message: 'Token refreshed successfully'
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