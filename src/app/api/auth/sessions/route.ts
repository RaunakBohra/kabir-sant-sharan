import { NextRequest, NextResponse } from 'next/server';
import { withSessionValidation, type AuthenticatedRequest } from '@/lib/middleware/session-middleware';
import { sessionManager, logoutUser } from '@/lib/session-manager';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { logger } from '@/lib/logger';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

/**
 * @swagger
 * /api/auth/sessions:
 *   get:
 *     summary: Get user's active sessions
 *     description: Retrieve all active sessions for the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [sessions, current]
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       ipAddress:
 *                         type: string
 *                       userAgent:
 *                         type: string
 *                       lastActivity:
 *                         type: string
 *                         format: date-time
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       isCurrent:
 *                         type: boolean
 *                 current:
 *                   type: string
 *                   description: ID of the current session
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete a specific session
 *     description: Delete a specific session by ID (logout from that device)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID of the session to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [message]
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Session deleted successfully"
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

// GET /api/auth/sessions - List user's active sessions
async function getSessionsHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const userId = request.session?.userId;
    const currentSessionId = request.session?.id;

    if (!userId || !currentSessionId) {
      return createErrorResponse('UNAUTHORIZED', {
        instance,
        detail: 'No active session found',
        metadata: { traceId }
      });
    }

    // Get all active sessions for the user
    const sessions = await sessionManager.getUserSessions(userId);

    // Format sessions for response (remove sensitive data)
    const formattedSessions = sessions.map(session => ({
      id: session.id,
      ipAddress: session.ipAddress || 'Unknown',
      userAgent: session.userAgent || 'Unknown',
      lastActivity: session.lastActivity,
      createdAt: session.createdAt,
      isCurrent: session.id === currentSessionId
    }));

    logger.info('User sessions retrieved', {
      userId,
      sessionCount: sessions.length,
      traceId,
      component: 'sessions-api'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'no-cache'
    };

    return NextResponse.json({
      sessions: formattedSessions,
      current: currentSessionId
    }, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      request: {
        method: request.method,
        url: request.url
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}

// DELETE /api/auth/sessions - Delete a specific session
async function deleteSessionHandler(request: AuthenticatedRequest): Promise<NextResponse> {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const userId = request.session?.userId;
    const currentSessionId = request.session?.id;

    if (!userId || !currentSessionId) {
      return createErrorResponse('UNAUTHORIZED', {
        instance,
        detail: 'No active session found',
        metadata: { traceId }
      });
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'Invalid JSON in request body',
        metadata: { traceId }
      });
    }

    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return createErrorResponse('VALIDATION_ERROR', {
        instance,
        detail: 'sessionId is required and must be a string',
        metadata: { traceId }
      });
    }

    // Verify the session belongs to the user
    const userSessions = await sessionManager.getUserSessions(userId);
    const sessionToDelete = userSessions.find(s => s.id === sessionId);

    if (!sessionToDelete) {
      return createErrorResponse('NOT_FOUND', {
        instance,
        detail: 'Session not found or does not belong to user',
        metadata: { traceId }
      });
    }

    // Delete the session
    const success = await logoutUser(sessionId);

    if (!success) {
      return createErrorResponse('INTERNAL_SERVER_ERROR', {
        instance,
        detail: 'Failed to delete session',
        metadata: { traceId }
      });
    }

    logger.info('Session deleted by user', {
      userId,
      deletedSessionId: sessionId,
      currentSessionId,
      traceId,
      component: 'sessions-api'
    });

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId
    };

    return NextResponse.json({
      message: sessionId === currentSessionId
        ? 'Current session deleted successfully'
        : 'Session deleted successfully'
    }, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      userId: request.session?.userId,
      request: {
        method: request.method,
        url: request.url
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}

// Route handlers with session validation
export const GET = withSessionValidation(getSessionsHandler, {
  required: true
});

export const DELETE = withSessionValidation(deleteSessionHandler, {
  required: true
});