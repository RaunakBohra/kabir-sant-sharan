import { NextRequest } from 'next/server';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, lt, desc } from 'drizzle-orm';
import { sessions, users } from '../../functions/src/drizzle/schema';

// Define session types locally since they're not exported from functions schema
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
import { generateTokenPair, validateAccessToken, validateRefreshToken, type TokenPair } from './jwt-auth';
import { logger } from './logger';
import { trackDatabaseOperation } from './middleware/performance-middleware';
import { nanoid } from 'nanoid';
import { getDatabase } from './db';

export interface SessionData {
  id: string;
  userId: string;
  token: string;
  refreshToken: string | null;
  expiresAt: string;
  refreshExpiresAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastActivity: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface CreateSessionOptions {
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  rememberMe?: boolean;
}

export interface SessionValidationResult {
  valid: boolean;
  session?: SessionData;
  error?: string;
  needsRefresh?: boolean;
}

class SessionManager {
  private db: any;

  constructor(database?: any) {
    this.db = database || getDatabase();
  }

  /**
   * Create a new session in the database
   */
  async createSession(options: CreateSessionOptions): Promise<{
    success: boolean;
    session?: SessionData;
    tokens?: TokenPair;
    error?: string;
  }> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { userId, ipAddress, userAgent, rememberMe = false } = options;

      // Get user information first
      const userResult = await this.db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (userResult.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult[0];

      // Generate JWT tokens with user information
      const tokenPair = generateTokenPair({
        userId,
        email: user.email,
        role: user.role
      });

      // Create session record
      const sessionId = nanoid();
      const now = new Date().toISOString();
      const expiresAt = new Date(tokenPair.accessExpiresAt).toISOString();
      const refreshExpiresAt = new Date(tokenPair.refreshExpiresAt).toISOString();

      const newSession: NewSession = {
        id: sessionId,
        userId,
        token: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        expiresAt,
        refreshExpiresAt,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        lastActivity: now,
        createdAt: now
      };

      // Insert session into database with performance tracking
      const insertTracker = trackDatabaseOperation('INSERT', 'sessions');
      try {
        await this.db.insert(sessions).values(newSession);
        insertTracker.complete({ rows: 1 });
      } catch (error) {
        insertTracker.complete({ rows: 0 });
        throw error;
      }

      // Cleanup old sessions for this user (keep last 5 sessions)
      await this.cleanupUserSessions(userId, 5);

      const sessionData: SessionData = {
        ...newSession,
        lastActivity: now,
        createdAt: now
      } as SessionData;

      logger.info('Session created successfully', {
        sessionId,
        userId,
        ipAddress,
        userAgent,
        component: 'session-manager'
      });

      return {
        success: true,
        session: sessionData,
        tokens: tokenPair
      };

    } catch (error) {
      logger.error('Failed to create session', {
        error: error instanceof Error ? error.message : String(error),
        userId: options.userId,
        component: 'session-manager'
      });

      return {
        success: false,
        error: 'Failed to create session'
      };
    }
  }

  /**
   * Validate and retrieve session from token
   */
  async validateSession(token: string): Promise<SessionValidationResult> {
    try {
      if (!this.db) {
        return { valid: false, error: 'Database not initialized' };
      }

      // First validate the JWT token
      const tokenValidation = validateAccessToken(token);
      if (!tokenValidation.valid || !tokenValidation.payload) {
        return { valid: false, error: 'Invalid token' };
      }

      // Find session in database
      const sessionResults = await this.db
        .select({
          session: sessions,
          user: {
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role
          }
        })
        .from(sessions)
        .leftJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.token, token))
        .limit(1);

      if (sessionResults.length === 0) {
        return { valid: false, error: 'Session not found' };
      }

      const { session, user } = sessionResults[0];

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (now > expiresAt) {
        // Session expired, cleanup
        await this.deleteSession(session.id);
        return { valid: false, error: 'Session expired', needsRefresh: true };
      }

      // Update last activity
      await this.updateLastActivity(session.id);

      const sessionData: SessionData = {
        ...session,
        user: user || undefined
      };

      return {
        valid: true,
        session: sessionData
      };

    } catch (error) {
      logger.error('Session validation failed', {
        error: error instanceof Error ? error.message : String(error),
        component: 'session-manager'
      });

      return { valid: false, error: 'Session validation failed' };
    }
  }

  /**
   * Refresh session using refresh token
   */
  async refreshSession(refreshToken: string): Promise<{
    success: boolean;
    session?: SessionData;
    tokens?: TokenPair;
    error?: string;
  }> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      // Validate refresh token
      const tokenValidation = validateRefreshToken(refreshToken);
      if (!tokenValidation.valid || !tokenValidation.payload) {
        return { success: false, error: 'Invalid refresh token' };
      }

      // Find session by refresh token
      const sessionResults = await this.db
        .select({
          session: sessions,
          user: {
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role
          }
        })
        .from(sessions)
        .leftJoin(users, eq(sessions.userId, users.id))
        .where(eq(sessions.refreshToken, refreshToken))
        .limit(1);

      if (sessionResults.length === 0) {
        return { success: false, error: 'Session not found' };
      }

      const { session, user } = sessionResults[0];

      // Check if refresh token is expired
      const now = new Date();
      const refreshExpiresAt = session.refreshExpiresAt
        ? new Date(session.refreshExpiresAt)
        : null;

      if (refreshExpiresAt && now > refreshExpiresAt) {
        // Refresh token expired, cleanup session
        await this.deleteSession(session.id);
        return { success: false, error: 'Refresh token expired' };
      }

      // Generate new token pair with user information
      const newTokenPair = generateTokenPair({
        userId: session.userId,
        email: user?.email || '',
        role: user?.role || 'member'
      });

      // Update session with new tokens
      const newExpiresAt = new Date(newTokenPair.accessExpiresAt).toISOString();
      const newRefreshExpiresAt = new Date(newTokenPair.refreshExpiresAt).toISOString();

      await this.db
        .update(sessions)
        .set({
          token: newTokenPair.accessToken,
          refreshToken: newTokenPair.refreshToken,
          expiresAt: newExpiresAt,
          refreshExpiresAt: newRefreshExpiresAt,
          lastActivity: new Date().toISOString()
        })
        .where(eq(sessions.id, session.id));

      const updatedSessionData: SessionData = {
        ...session,
        token: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
        expiresAt: newExpiresAt,
        refreshExpiresAt: newRefreshExpiresAt,
        lastActivity: new Date().toISOString(),
        user: user || undefined
      };

      logger.info('Session refreshed successfully', {
        sessionId: session.id,
        userId: session.userId,
        component: 'session-manager'
      });

      return {
        success: true,
        session: updatedSessionData,
        tokens: newTokenPair
      };

    } catch (error) {
      logger.error('Session refresh failed', {
        error: error instanceof Error ? error.message : String(error),
        component: 'session-manager'
      });

      return {
        success: false,
        error: 'Session refresh failed'
      };
    }
  }

  /**
   * Delete a specific session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      if (!this.db) {
        return false;
      }

      await this.db
        .delete(sessions)
        .where(eq(sessions.id, sessionId));

      logger.info('Session deleted', {
        sessionId,
        component: 'session-manager'
      });

      return true;
    } catch (error) {
      logger.error('Failed to delete session', {
        error: error instanceof Error ? error.message : String(error),
        sessionId,
        component: 'session-manager'
      });

      return false;
    }
  }

  /**
   * Delete all sessions for a user (logout from all devices)
   */
  async deleteAllUserSessions(userId: string): Promise<boolean> {
    try {
      if (!this.db) {
        return false;
      }

      const result = await this.db
        .delete(sessions)
        .where(eq(sessions.userId, userId));

      logger.info('All user sessions deleted', {
        userId,
        component: 'session-manager'
      });

      return true;
    } catch (error) {
      logger.error('Failed to delete all user sessions', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        component: 'session-manager'
      });

      return false;
    }
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionData[]> {
    try {
      if (!this.db) {
        return [];
      }

      const results = await this.db
        .select()
        .from(sessions)
        .where(and(
          eq(sessions.userId, userId),
          lt(sessions.expiresAt, new Date().toISOString())
        ))
        .orderBy(desc(sessions.lastActivity));

      return results;
    } catch (error) {
      logger.error('Failed to get user sessions', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        component: 'session-manager'
      });

      return [];
    }
  }

  /**
   * Update last activity timestamp for a session
   */
  private async updateLastActivity(sessionId: string): Promise<void> {
    try {
      if (!this.db) {
        return;
      }

      await this.db
        .update(sessions)
        .set({ lastActivity: new Date().toISOString() })
        .where(eq(sessions.id, sessionId));

    } catch (error) {
      // Non-critical error, just log it
      logger.warn('Failed to update session activity', {
        error: error instanceof Error ? error.message : String(error),
        sessionId,
        component: 'session-manager'
      });
    }
  }

  /**
   * Cleanup old sessions for a user (keep only the specified number of most recent)
   */
  private async cleanupUserSessions(userId: string, keepCount: number = 5): Promise<void> {
    try {
      if (!this.db) {
        return;
      }

      // Get all sessions for user, ordered by creation date (newest first)
      const userSessions = await this.db
        .select({ id: sessions.id })
        .from(sessions)
        .where(eq(sessions.userId, userId))
        .orderBy(desc(sessions.createdAt));

      // If we have more sessions than we want to keep, delete the oldest ones
      if (userSessions.length > keepCount) {
        const sessionsToDelete = userSessions.slice(keepCount);
        const sessionIdsToDelete = sessionsToDelete.map((s: any) => s.id);

        for (const sessionId of sessionIdsToDelete) {
          await this.db
            .delete(sessions)
            .where(eq(sessions.id, sessionId));
        }

        logger.info('Cleaned up old user sessions', {
          userId,
          deletedCount: sessionIdsToDelete.length,
          component: 'session-manager'
        });
      }

    } catch (error) {
      logger.warn('Failed to cleanup old sessions', {
        error: error instanceof Error ? error.message : String(error),
        userId,
        component: 'session-manager'
      });
    }
  }

  /**
   * Cleanup all expired sessions (should be run periodically)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      if (!this.db) {
        return 0;
      }

      const now = new Date().toISOString();

      // Delete sessions where both access token and refresh token are expired
      const result = await this.db
        .delete(sessions)
        .where(and(
          lt(sessions.expiresAt, now),
          lt(sessions.refreshExpiresAt, now)
        ));

      logger.info('Cleaned up expired sessions', {
        deletedCount: result.changes || 0,
        component: 'session-manager'
      });

      return result.changes || 0;

    } catch (error) {
      logger.error('Failed to cleanup expired sessions', {
        error: error instanceof Error ? error.message : String(error),
        component: 'session-manager'
      });

      return 0;
    }
  }

  /**
   * Extract session information from request headers
   */
  getSessionInfoFromRequest(request: NextRequest): {
    token?: string;
    ipAddress?: string;
    userAgent?: string;
  } {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    const ipAddress = request.headers.get('x-forwarded-for')
      || request.headers.get('x-real-ip')
      || 'unknown';

    const userAgent = request.headers.get('user-agent') || 'unknown';

    return { token, ipAddress, userAgent };
  }

  /**
   * Middleware helper to validate session from request
   */
  async validateSessionFromRequest(request: NextRequest): Promise<SessionValidationResult> {
    const { token } = this.getSessionInfoFromRequest(request);

    if (!token) {
      return { valid: false, error: 'No token provided' };
    }

    return this.validateSession(token);
  }
}

// Global session manager instance
export const sessionManager = new SessionManager();

// Utility functions for common operations
export async function createUserSession(
  userId: string,
  request: NextRequest
): Promise<{ success: boolean; tokens?: TokenPair; error?: string }> {
  const { ipAddress, userAgent } = sessionManager.getSessionInfoFromRequest(request);

  const result = await sessionManager.createSession({
    userId,
    ipAddress,
    userAgent
  });

  return {
    success: result.success,
    tokens: result.tokens,
    error: result.error
  };
}

export async function validateUserSession(
  request: NextRequest
): Promise<SessionValidationResult> {
  return sessionManager.validateSessionFromRequest(request);
}

export async function refreshUserSession(
  refreshToken: string
): Promise<{ success: boolean; tokens?: TokenPair; error?: string }> {
  const result = await sessionManager.refreshSession(refreshToken);

  return {
    success: result.success,
    tokens: result.tokens,
    error: result.error
  };
}

export async function logoutUser(sessionId?: string, userId?: string): Promise<boolean> {
  if (sessionId) {
    return sessionManager.deleteSession(sessionId);
  } else if (userId) {
    return sessionManager.deleteAllUserSessions(userId);
  }
  return false;
}

// Cleanup job (should be called periodically, e.g., via cron job)
export async function cleanupExpiredSessions(): Promise<number> {
  return sessionManager.cleanupExpiredSessions();
}