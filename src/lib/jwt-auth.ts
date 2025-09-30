/**
 * JWT Authentication System with Refresh Tokens
 * Implements industry-standard JWT authentication with:
 * - Short-lived access tokens (15 minutes)
 * - Long-lived refresh tokens (7 days)
 * - Token rotation on refresh
 * - Secure token validation
 */

import jwt from 'jsonwebtoken';
import { securityConfig } from './config';
import { createId } from '@paralleldrive/cuid2';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  iss?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
  expired?: boolean;
}

/**
 * Generate a pair of access and refresh tokens
 */
export function generateTokenPair(payload: {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}): TokenPair {
  const sessionId = payload.sessionId || createId();
  const now = Math.floor(Date.now() / 1000);

  // Access token payload (short-lived)
  const accessPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    sessionId,
    type: 'access'
  };

  // Refresh token payload (long-lived)
  const refreshPayload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    sessionId,
    type: 'refresh'
  };

  // Generate tokens
  const accessToken = jwt.sign(accessPayload, securityConfig.jwt.secret, {
    expiresIn: securityConfig.jwt.accessExpiry,
    issuer: securityConfig.jwt.issuer,
    algorithm: securityConfig.jwt.algorithm as jwt.Algorithm
  });

  const refreshToken = jwt.sign(refreshPayload, securityConfig.jwt.refreshSecret, {
    expiresIn: securityConfig.jwt.refreshExpiry,
    issuer: securityConfig.jwt.issuer,
    algorithm: securityConfig.jwt.algorithm as jwt.Algorithm
  });

  // Calculate expiration times
  const accessExpiresAt = now + parseExpiry(securityConfig.jwt.accessExpiry);
  const refreshExpiresAt = now + parseExpiry(securityConfig.jwt.refreshExpiry);

  return {
    accessToken,
    refreshToken,
    accessExpiresAt: accessExpiresAt * 1000, // Convert to milliseconds
    refreshExpiresAt: refreshExpiresAt * 1000
  };
}

/**
 * Validate an access token
 */
export function validateAccessToken(token: string): TokenValidationResult {
  try {
    const decoded = jwt.verify(token, securityConfig.jwt.secret, {
      issuer: securityConfig.jwt.issuer,
      algorithms: [securityConfig.jwt.algorithm as jwt.Algorithm]
    }) as TokenPayload;

    // Verify token type
    if (decoded.type !== 'access') {
      return {
        valid: false,
        error: 'Invalid token type. Expected access token.'
      };
    }

    return {
      valid: true,
      payload: decoded
    };

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: 'Access token expired',
        expired: true
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        error: 'Invalid access token'
      };
    }

    return {
      valid: false,
      error: 'Token validation failed'
    };
  }
}

/**
 * Validate a refresh token
 */
export function validateRefreshToken(token: string): TokenValidationResult {
  try {
    const decoded = jwt.verify(token, securityConfig.jwt.refreshSecret, {
      issuer: securityConfig.jwt.issuer,
      algorithms: [securityConfig.jwt.algorithm as jwt.Algorithm]
    }) as TokenPayload;

    // Verify token type
    if (decoded.type !== 'refresh') {
      return {
        valid: false,
        error: 'Invalid token type. Expected refresh token.'
      };
    }

    return {
      valid: true,
      payload: decoded
    };

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: 'Refresh token expired',
        expired: true
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        error: 'Invalid refresh token'
      };
    }

    return {
      valid: false,
      error: 'Token validation failed'
    };
  }
}

/**
 * Extract and validate bearer token from Authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Refresh access token using refresh token
 */
export function refreshAccessToken(refreshToken: string): {
  success: boolean;
  tokens?: TokenPair;
  error?: string;
} {
  const validation = validateRefreshToken(refreshToken);

  if (!validation.valid || !validation.payload) {
    return {
      success: false,
      error: validation.error || 'Invalid refresh token'
    };
  }

  // Generate new token pair with same session ID
  const tokens = generateTokenPair({
    userId: validation.payload.userId,
    email: validation.payload.email,
    role: validation.payload.role,
    sessionId: validation.payload.sessionId
  });

  return {
    success: true,
    tokens
  };
}

/**
 * Parse expiry string to seconds
 * Supports: '15m', '1h', '7d', etc.
 */
function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiry format: ${expiry}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: throw new Error(`Invalid expiry unit: ${unit}`);
  }
}

/**
 * Create JWT authentication middleware for API routes
 */
export function createAuthMiddleware(requiredRole?: string) {
  return (request: Request): {
    authenticated: boolean;
    user?: TokenPayload;
    error?: string;
  } => {
    const authHeader = request.headers.get('Authorization');
    const token = extractBearerToken(authHeader);

    if (!token) {
      return {
        authenticated: false,
        error: 'Authorization header missing or invalid'
      };
    }

    const validation = validateAccessToken(token);

    if (!validation.valid || !validation.payload) {
      return {
        authenticated: false,
        error: validation.error || 'Invalid token'
      };
    }

    // Check role if required
    if (requiredRole && validation.payload.role !== requiredRole) {
      return {
        authenticated: false,
        error: 'Insufficient permissions'
      };
    }

    return {
      authenticated: true,
      user: validation.payload
    };
  };
}

/**
 * Get user information from token payload
 */
export function getUserFromToken(payload: TokenPayload): {
  id: string;
  email: string;
  name: string;
  role: string;
} {
  return {
    id: payload.userId,
    email: payload.email,
    name: 'Administrator', // This would come from database in full implementation
    role: payload.role
  };
}

/**
 * Check if token is close to expiry (within 5 minutes)
 */
export function isTokenNearExpiry(payload: TokenPayload): boolean {
  if (!payload.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;

  return (payload.exp - now) <= fiveMinutes;
}

/**
 * Create standardized auth error responses
 */
export const authErrors = {
  missingToken: {
    type: 'https://kabirsantsharan.com/errors/missing-authorization',
    title: 'Missing Authorization',
    status: 401,
    detail: 'Authorization header with Bearer token is required'
  },
  invalidToken: {
    type: 'https://kabirsantsharan.com/errors/invalid-token',
    title: 'Invalid Token',
    status: 401,
    detail: 'The provided token is invalid or malformed'
  },
  expiredToken: {
    type: 'https://kabirsantsharan.com/errors/expired-token',
    title: 'Token Expired',
    status: 401,
    detail: 'The provided token has expired. Please refresh your token.'
  },
  insufficientPermissions: {
    type: 'https://kabirsantsharan.com/errors/insufficient-permissions',
    title: 'Insufficient Permissions',
    status: 403,
    detail: 'You do not have sufficient permissions to access this resource'
  }
} as const;

// Export alias for backward compatibility
export const verifyAccessToken = validateAccessToken;