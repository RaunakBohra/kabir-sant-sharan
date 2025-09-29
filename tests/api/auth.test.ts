/**
 * Authentication API Endpoint Tests
 * Comprehensive testing for all auth-related endpoints
 */

import { NextRequest } from 'next/server';
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { POST as refreshHandler } from '@/app/api/auth/refresh/route';
import { GET as verifyHandler } from '@/app/api/auth/verify/route';
import { generateTokenPair } from '@/lib/jwt-auth';

// Mock the database
jest.mock('@/lib/database-service', () => ({
  getUserByEmail: jest.fn(),
  createUser: jest.fn()
}));

import { getUserByEmail } from '@/lib/database-service';

describe('Authentication API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    const validUser = {
      id: 'user123',
      email: 'admin@kabirsantsharan.com',
      name: 'Admin User',
      password: '$2b$12$hashed.password.here',
      role: 'admin' as const
    };

    it('should successfully login with valid credentials', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(validUser);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        })
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data).toHaveProperty('user');
      expect(data.accessToken).toBeValidJWT();
      expect(data.refreshToken).toBeValidJWT();
      expect(data.user.email).toBe('admin@kabirsantsharan.com');
      expect(data.message).toBe('Login successful');
    });

    it('should reject invalid email format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'admin123'
        })
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Validation Error');
    });

    it('should reject missing credentials', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
      expect(data.detail).toContain('required');
    });

    it('should reject non-existent user', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'admin123'
        })
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Authentication Failed');
    });

    it('should include rate limiting headers', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(validUser);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        })
      });

      const response = await loginHandler(request);

      expect(response.headers.get('X-RateLimit-Limit')).toBeTruthy();
      expect(response.headers.get('X-RateLimit-Remaining')).toBeTruthy();
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh valid token', async () => {
      const { refreshToken } = generateTokenPair({
        userId: 'user123',
        email: 'admin@kabirsantsharan.com',
        role: 'admin'
      });

      const request = new NextRequest('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      const response = await refreshHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('accessToken');
      expect(data).toHaveProperty('refreshToken');
      expect(data.accessToken).toBeValidJWT();
      expect(data.refreshToken).toBeValidJWT();
    });

    it('should reject invalid refresh token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'invalid.token.here' })
      });

      const response = await refreshHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveValidProblemDetails();
    });

    it('should reject missing refresh token', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const response = await refreshHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
    });
  });

  describe('GET /api/auth/verify', () => {
    it('should verify valid access token', async () => {
      const { accessToken } = generateTokenPair({
        userId: 'user123',
        email: 'admin@kabirsantsharan.com',
        role: 'admin'
      });

      const request = new NextRequest('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.valid).toBe(true);
      expect(data.user.email).toBe('admin@kabirsantsharan.com');
    });

    it('should reject missing authorization header', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/verify');

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveValidProblemDetails();
    });

    it('should reject invalid token format', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': 'Bearer invalid.token'
        }
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveValidProblemDetails();
    });

    it('should detect refresh tokens and suggest refresh', async () => {
      const { refreshToken } = generateTokenPair({
        userId: 'user123',
        email: 'admin@kabirsantsharan.com',
        role: 'admin'
      });

      const request = new NextRequest('http://localhost:3000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      const response = await verifyHandler(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.detail).toContain('refresh');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in all responses', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123'
        })
      });

      const response = await loginHandler(request);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
    });
  });

  describe('Error Response Format', () => {
    it('should return RFC 9457 compliant errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' })
      });

      const response = await loginHandler(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
      expect(data.type).toMatch(/^https?:\/\//);
      expect(data.instance).toBe('/api/auth/login');
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(data.traceId).toBeTruthy();
    });
  });
});