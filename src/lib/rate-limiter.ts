/**
 * Edge Runtime Compatible Rate Limiter
 * Uses in-memory Map for Edge Runtime compatibility (no Redis needed)
 * Implements sliding window rate limiting algorithm
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

interface RateLimitConfig {
  max: number;        // Maximum requests allowed
  window: number;     // Time window in milliseconds
  keyGenerator?: (request: Request) => string;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * In-memory rate limiter using Map
 * Automatically cleans up expired entries
 */
class EdgeRateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.startCleanup();
  }

  private startCleanup() {
    if (this.cleanupInterval) return;

    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (now > entry.resetTime) {
          this.store.delete(key);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Check if request should be rate limited
   */
  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const resetTime = now + config.window;

    let entry = this.store.get(key);

    // If no entry exists or window has expired, create new entry
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime,
        lastRequest: now
      };
      this.store.set(key, entry);

      return {
        success: true,
        limit: config.max,
        remaining: config.max - 1,
        resetTime
      };
    }

    // Increment request count
    entry.count++;
    entry.lastRequest = now;

    const remaining = Math.max(0, config.max - entry.count);
    const success = entry.count <= config.max;

    if (!success) {
      return {
        success: false,
        limit: config.max,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000)
      };
    }

    this.store.set(key, entry);

    return {
      success: true,
      limit: config.max,
      remaining,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get current status for a key without incrementing
   */
  status(key: string, config: RateLimitConfig): RateLimitResult {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetTime) {
      return {
        success: true,
        limit: config.max,
        remaining: config.max,
        resetTime: now + config.window
      };
    }

    const remaining = Math.max(0, config.max - entry.count);
    const success = entry.count < config.max;

    return {
      success,
      limit: config.max,
      remaining,
      resetTime: entry.resetTime,
      retryAfter: success ? undefined : Math.ceil((entry.resetTime - now) / 1000)
    };
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}

// Singleton rate limiter instance
const rateLimiter = new EdgeRateLimiter();

/**
 * Default key generators for different types of requests
 */
export const keyGenerators = {
  /**
   * Generate key based on IP address
   */
  ip: (request: Request): string => {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() :
               request.headers.get('x-real-ip') ||
               'unknown';
    return `ip:${ip}`;
  },

  /**
   * Generate key based on user agent (for additional bot protection)
   */
  userAgent: (request: Request): string => {
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return `ua:${userAgent.slice(0, 50)}`;
  },

  /**
   * Generate key based on IP and endpoint
   */
  ipEndpoint: (request: Request): string => {
    const ip = keyGenerators.ip(request).replace('ip:', '');
    const url = new URL(request.url);
    return `${ip}:${url.pathname}`;
  },

  /**
   * Generate key for authenticated requests (by user ID)
   */
  user: (userId: string): string => {
    return `user:${userId}`;
  }
};

/**
 * Rate limiting middleware for API routes
 */
export async function rateLimitMiddleware(
  request: Request,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const keyGen = config.keyGenerator || keyGenerators.ip;
  const key = keyGen(request);

  return rateLimiter.check(key, config);
}

/**
 * Create rate limit response headers
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };

  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitConfigs = {
  auth: {
    max: 5,
    window: 60 * 1000, // 1 minute
    keyGenerator: keyGenerators.ip
  },
  api: {
    max: 100,
    window: 15 * 60 * 1000, // 15 minutes
    keyGenerator: keyGenerators.ipEndpoint
  },
  search: {
    max: 50,
    window: 60 * 1000, // 1 minute
    keyGenerator: keyGenerators.ip
  }
} satisfies Record<string, RateLimitConfig>;

/**
 * Check rate limit and return appropriate response if exceeded
 */
export async function checkRateLimit(
  request: Request,
  configKey: keyof typeof rateLimitConfigs
): Promise<Response | null> {
  const config = rateLimitConfigs[configKey];
  const result = await rateLimitMiddleware(request, config);

  if (!result.success) {
    const headers = createRateLimitHeaders(result);

    return new Response(
      JSON.stringify({
        type: 'https://kabirsantsharan.com/errors/rate-limit-exceeded',
        title: 'Rate Limit Exceeded',
        status: 429,
        detail: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
        instance: new URL(request.url).pathname,
        timestamp: new Date().toISOString()
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }
    );
  }

  return null;
}

export { rateLimiter };