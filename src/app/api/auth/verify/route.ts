import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken, extractBearerToken, getUserFromToken, isTokenNearExpiry } from '@/lib/jwt-auth';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { getAdminUser } from '@/lib/db-seed';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const authHeader = request.headers.get('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return createErrorResponse('MISSING_AUTHORIZATION', {
        instance,
        metadata: { traceId }
      });
    }

    const validation = validateAccessToken(token);

    if (!validation.valid || !validation.payload) {
      if (validation.expired) {
        return createErrorResponse('EXPIRED_TOKEN', {
          instance,
          metadata: { traceId }
        });
      }

      return createErrorResponse('INVALID_TOKEN', {
        instance,
        detail: validation.error || 'Token validation failed',
        metadata: { traceId }
      });
    }

    // Get user details from database to ensure user still exists
    const adminUser = await getAdminUser(process.env);

    if (!adminUser || adminUser.id !== validation.payload.userId) {
      return createErrorResponse('INVALID_TOKEN', {
        instance,
        detail: 'User no longer exists',
        metadata: { traceId }
      });
    }

    const user = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      sessionId: validation.payload.sessionId
    };

    // Check if token is near expiry (within 5 minutes)
    const needsRefresh = isTokenNearExpiry(validation.payload);

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      user,
      tokenInfo: {
        expiresAt: validation.payload.exp ? validation.payload.exp * 1000 : undefined,
        needsRefresh
      },
      message: 'Token verified successfully'
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