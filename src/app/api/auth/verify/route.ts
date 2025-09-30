import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken, extractBearerToken, getUserFromToken, isTokenNearExpiry } from '@/lib/jwt-auth';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { sessionManager } from '@/lib/session-manager';
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

    // Validate session using session manager (includes JWT validation and database check)
    const sessionValidation = await sessionManager.validateSession(token);

    if (!sessionValidation.valid || !sessionValidation.session) {
      if (sessionValidation.needsRefresh) {
        return createErrorResponse('EXPIRED_TOKEN', {
          instance,
          detail: 'Session expired. Please refresh your token.',
          metadata: { traceId }
        });
      }

      return createErrorResponse('INVALID_TOKEN', {
        instance,
        detail: sessionValidation.error || 'Session validation failed',
        metadata: { traceId }
      });
    }

    const session = sessionValidation.session;
    const user = {
      id: session.userId,
      email: session.user?.email || '',
      name: session.user?.name || '',
      role: session.user?.role || 'member',
      sessionId: session.id
    };

    // Validate the JWT payload to check for near expiry
    const jwtValidation = validateAccessToken(token);
    const needsRefresh = jwtValidation.valid && jwtValidation.payload
      ? isTokenNearExpiry(jwtValidation.payload)
      : false;

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      user,
      tokenInfo: {
        expiresAt: jwtValidation.payload?.exp ? jwtValidation.payload.exp * 1000 : undefined,
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