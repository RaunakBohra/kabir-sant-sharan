import { NextRequest, NextResponse } from 'next/server';
import { withSessionValidation, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import { logoutUser } from '@/lib/session-manager';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and invalidate session
 *     description: Logs out the current user by invalidating their session and removing it from the database
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logoutAll:
 *                 type: boolean
 *                 description: If true, logout from all devices (invalidate all sessions)
 *                 default: false
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message, timestamp]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout successful"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 loggedOutSessions:
 *                   type: integer
 *                   description: Number of sessions invalidated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
async function logoutHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const sessionId = request.session?.id;
    const userId = request.session?.userId;

    if (!sessionId || !userId) {
      return createErrorResponse('INVALID_TOKEN', {
        instance,
        detail: 'No active session found',
        metadata: { traceId }
      });
    }

    // Parse request body for logout options
    let logoutAll = false;
    try {
      const body = await request.json() as { logoutAll?: boolean };
      logoutAll = body?.logoutAll === true;
    } catch {
      // Body parsing failed, use default values
    }

    let loggedOutSessions = 0;

    if (logoutAll) {
      // Logout from all devices
      const success = await logoutUser(undefined, userId);
      if (success) {
        // Get count of sessions before logout (approximate)
        loggedOutSessions = 1; // At least current session
        logger.info('User logged out from all devices', {
          userId,
          traceId,
          component: 'logout'
        });
      }
    } else {
      // Logout from current session only
      const success = await logoutUser(sessionId);
      if (success) {
        loggedOutSessions = 1;
        logger.info('User logged out from current session', {
          userId,
          sessionId,
          traceId,
          component: 'logout'
        });
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    };

    return NextResponse.json({
      message: logoutAll ? 'Logged out from all devices' : 'Logout successful',
      timestamp: new Date().toISOString(),
      loggedOutSessions
    }, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      sessionId: request.session?.id,
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

// Apply session validation middleware
export const POST = withSessionValidation(logoutHandler, {
  required: true
});