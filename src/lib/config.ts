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
function validateEnvironment(envVars: Record<string, string | undefined>): void {
  const required = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH'
  ];

  const missing = required.filter(key => !envVars[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  // Validate JWT secret strength (minimum 32 characters)
  if (envVars.JWT_SECRET!.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long for security');
  }

  if (envVars.JWT_REFRESH_SECRET!.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long for security');
  }

  // Warn about default/weak secrets
  const weakSecrets = [
    'your-secret-key-change-this-in-production',
    'your-256-bit-random-secret-key-change-this-in-production',
    'change-me',
    'secret'
  ];

  if (weakSecrets.includes(envVars.JWT_SECRET!)) {
    console.warn('⚠️  WARNING: Using a weak JWT_SECRET. Please generate a strong random secret for production!');
  }
}

/**
 * Creates and validates the security configuration
 */
export function createSecurityConfig(envOverride?: Record<string, string | undefined>): SecurityConfig {
  // Use either provided env vars or process.env
  const envVars = envOverride || (typeof process !== 'undefined' ? process.env : {});

  // Only validate in server-side environments
  if (typeof window === 'undefined') {
    validateEnvironment(envVars);
  }

  return {
    jwt: {
      secret: envVars.JWT_SECRET || '',
      refreshSecret: envVars.JWT_REFRESH_SECRET || '',
      accessExpiry: envVars.JWT_ACCESS_EXPIRY || '15m',
      refreshExpiry: envVars.JWT_REFRESH_EXPIRY || '7d',
      algorithm: 'HS256',
      issuer: 'kabirsantsharan.com'
    },
    auth: {
      adminEmail: envVars.ADMIN_EMAIL || '',
      adminPasswordHash: envVars.ADMIN_PASSWORD_HASH || '',
      bcryptSaltRounds: parseInt(envVars.BCRYPT_SALT_ROUNDS || '12', 10)
    },
    rateLimit: {
      auth: {
        max: parseInt(envVars.RATE_LIMIT_AUTH_MAX || '5', 10),
        window: parseInt(envVars.RATE_LIMIT_AUTH_WINDOW || '60000', 10)
      },
      api: {
        max: parseInt(envVars.RATE_LIMIT_API_MAX || '100', 10),
        window: parseInt(envVars.RATE_LIMIT_API_WINDOW || '900000', 10)
      },
      search: {
        max: parseInt(envVars.RATE_LIMIT_SEARCH_MAX || '50', 10),
        window: parseInt(envVars.RATE_LIMIT_SEARCH_WINDOW || '60000', 10)
      }
    },
    cors: {
      origins: envVars.CORS_ORIGIN?.split(',') || ['http://localhost:5002']
    },
    logging: {
      level: (envVars.LOG_LEVEL as any) || 'info'
    },
    monitoring: {
      sentryDsn: envVars.SENTRY_DSN
    }
  };
}

/**
 * Singleton configuration instance - lazy loaded to avoid process.env issues in Workers
 */
let _securityConfig: SecurityConfig | null = null;

export function getSecurityConfig(envOverride?: Record<string, string | undefined>): SecurityConfig {
  if (!_securityConfig || envOverride) {
    _securityConfig = createSecurityConfig(envOverride);
  }
  return _securityConfig;
}

// For backward compatibility
export const securityConfig = new Proxy({} as SecurityConfig, {
  get(target, prop) {
    return getSecurityConfig()[prop as keyof SecurityConfig];
  }
});

/**
 * Helper function to check if we're in production
 */
export function isProduction(envVars?: Record<string, string | undefined>): boolean {
  const env = envVars || (typeof process !== 'undefined' ? process.env : {});
  return env.NODE_ENV === 'production';
}

/**
 * Helper function to check if we're in development
 */
export function isDevelopment(envVars?: Record<string, string | undefined>): boolean {
  const env = envVars || (typeof process !== 'undefined' ? process.env : {});
  return env.NODE_ENV === 'development';
}

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