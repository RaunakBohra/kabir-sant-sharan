/**
 * Secure Configuration Management
 * Following industry best practices for environment variable handling
 */

interface SecurityConfig {
  jwt: {
    secret: string;
    refreshSecret: string;
    accessExpiry: string;
    refreshExpiry: string;
    algorithm: string;
    issuer: string;
  };
  auth: {
    adminEmail: string;
    adminPasswordHash: string;
    bcryptSaltRounds: number;
  };
  rateLimit: {
    auth: { max: number; window: number };
    api: { max: number; window: number };
    search: { max: number; window: number };
  };
  cors: {
    origins: string[];
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  monitoring: {
    sentryDsn?: string;
  };
}

/**
 * Validates that all required environment variables are present
 */
function validateEnvironment(): void {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  // Validate JWT secret strength (minimum 32 characters)
  if (process.env.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
  }

  if (process.env.JWT_REFRESH_SECRET!.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long for security');
  }

  // Warn about default/weak secrets
  const weakSecrets = [
    'your-secret-key-change-this-in-production',
    'your-256-bit-random-secret-key-change-this-in-production',
    'change-me',
    'secret'
  ];

  if (weakSecrets.includes(process.env.JWT_SECRET!)) {
    console.warn('⚠️  WARNING: Using a weak JWT_SECRET. Please generate a strong random secret for production!');
  }
}

/**
 * Creates and validates the security configuration
 */
export function createSecurityConfig(): SecurityConfig {
  // Only validate in server-side environments
  if (typeof window === 'undefined') {
    validateEnvironment();
  }

  return {
    jwt: {
      secret: process.env.JWT_SECRET || '',
      refreshSecret: process.env.JWT_REFRESH_SECRET || '',
      accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
      refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
      algorithm: 'HS256',
      issuer: 'kabirsantsharan.com'
    },
    auth: {
      adminEmail: process.env.ADMIN_EMAIL || '',
      adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
      bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10)
    },
    rateLimit: {
      auth: {
        max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5', 10),
        window: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW || '60000', 10)
      },
      api: {
        max: parseInt(process.env.RATE_LIMIT_API_MAX || '100', 10),
        window: parseInt(process.env.RATE_LIMIT_API_WINDOW || '900000', 10)
      },
      search: {
        max: parseInt(process.env.RATE_LIMIT_SEARCH_MAX || '50', 10),
        window: parseInt(process.env.RATE_LIMIT_SEARCH_WINDOW || '60000', 10)
      }
    },
    cors: {
      origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5002']
    },
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info'
    },
    monitoring: {
      sentryDsn: process.env.SENTRY_DSN
    }
  };
}

/**
 * Singleton configuration instance
 */
export const securityConfig = createSecurityConfig();

/**
 * Helper function to check if we're in production
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Helper function to check if we're in development
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Generate a secure random string for secrets
 * Use this function to generate JWT secrets
 */
export function generateSecureSecret(length: number = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';

  // Use crypto.getRandomValues in browser or crypto.randomBytes in Node.js
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Node.js environment
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
  }

  return result;
}

/**
 * Hash a password using bcrypt with configured salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, securityConfig.auth.bcryptSaltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}