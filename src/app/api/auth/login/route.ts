import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdminUser, seedAdminUser } from '@/lib/db-seed';
import { generateTokenPair, createAuthMiddleware } from '@/lib/jwt-auth';
import { checkRateLimit, createRateLimitHeaders } from '@/lib/rate-limiter';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { validateRequest, LoginSchema } from '@/lib/validation-schemas';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
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

    // Get admin user from database (or create if doesn't exist)
    let adminUser = await getAdminUser(process.env);

    if (!adminUser) {
      // Try to seed admin user if not found
      const seedResult = await seedAdminUser(process.env);
      if (!seedResult.success) {
        logError(new Error('Failed to initialize admin user'), {
          traceId,
          request: {
            method: request.method,
            url: request.url,
            headers: Object.fromEntries(request.headers.entries())
          }
        });

        return createErrorResponse('CONFIGURATION_ERROR', {
          instance,
          detail: 'Authentication system not properly configured',
          metadata: { traceId }
        });
      }

      adminUser = await getAdminUser(process.env);
    }

    if (!adminUser || email !== adminUser.email) {
      // Log failed attempt for monitoring
      logError(new Error('Invalid login attempt'), {
        traceId,
        request: {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers.entries())
        }
      });

      return createErrorResponse('INVALID_CREDENTIALS', {
        instance,
        metadata: { traceId }
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);

    if (!isValidPassword) {
      logError(new Error('Invalid password attempt'), {
        traceId,
        userId: adminUser.id,
        request: {
          method: request.method,
          url: request.url,
          headers: Object.fromEntries(request.headers.entries())
        }
      });

      return createErrorResponse('INVALID_CREDENTIALS', {
        instance,
        metadata: { traceId }
      });
    }

    // Generate token pair (access + refresh tokens)
    const tokenPair = generateTokenPair({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    const user = {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role
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