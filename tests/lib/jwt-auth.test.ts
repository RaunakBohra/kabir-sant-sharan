/**
 * JWT Authentication Tests
 * Tests for JWT token generation, verification, and refresh logic
 */

import { generateTokenPair, verifyAccessToken, verifyRefreshToken } from '@/lib/jwt-auth';

describe('JWT Authentication', () => {
  const samplePayload = {
    userId: 'user123',
    email: 'admin@kabirsantsharan.com',
    role: 'admin' as const
  };

  describe('generateTokenPair', () => {
    it('should generate valid token pair', () => {
      const result = generateTokenPair(samplePayload);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('expiresAt');
      expect(result).toHaveProperty('refreshExpiresAt');

      expect(result.accessToken).toBeValidJWT();
      expect(result.refreshToken).toBeValidJWT();
      expect(result.expiresAt).toBeGreaterThan(Date.now());
      expect(result.refreshExpiresAt).toBeGreaterThan(result.expiresAt);
    });

    it('should generate different tokens each time', () => {
      const result1 = generateTokenPair(samplePayload);
      const result2 = generateTokenPair(samplePayload);

      expect(result1.accessToken).not.toBe(result2.accessToken);
      expect(result1.refreshToken).not.toBe(result2.refreshToken);
    });

    it('should set correct expiration times', () => {
      const before = Date.now();
      const result = generateTokenPair(samplePayload);
      const after = Date.now();

      // Access token should expire in ~15 minutes (allowing for test execution time)
      const accessTokenExpiry = result.expiresAt - before;
      expect(accessTokenExpiry).toBeGreaterThan(14 * 60 * 1000); // 14 minutes
      expect(accessTokenExpiry).toBeLessThan(16 * 60 * 1000); // 16 minutes

      // Refresh token should expire in ~7 days
      const refreshTokenExpiry = result.refreshExpiresAt - before;
      expect(refreshTokenExpiry).toBeGreaterThan(6.9 * 24 * 60 * 60 * 1000); // 6.9 days
      expect(refreshTokenExpiry).toBeLessThan(7.1 * 24 * 60 * 60 * 1000); // 7.1 days
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', () => {
      const { accessToken } = generateTokenPair(samplePayload);
      const result = verifyAccessToken(accessToken);

      expect(result.valid).toBe(true);
      expect(result.payload).toMatchObject({
        userId: samplePayload.userId,
        email: samplePayload.email,
        role: samplePayload.role,
        type: 'access'
      });
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid token format', () => {
      const result = verifyAccessToken('invalid.token.format');

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should reject refresh token when verifying access token', () => {
      const { refreshToken } = generateTokenPair(samplePayload);
      const result = verifyAccessToken(refreshToken);

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toContain('refresh');
    });

    it('should reject malformed JWT', () => {
      const result = verifyAccessToken('not.a.jwt');

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should reject empty token', () => {
      const result = verifyAccessToken('');

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token', () => {
      const { refreshToken } = generateTokenPair(samplePayload);
      const result = verifyRefreshToken(refreshToken);

      expect(result.valid).toBe(true);
      expect(result.payload).toMatchObject({
        userId: samplePayload.userId,
        email: samplePayload.email,
        role: samplePayload.role,
        type: 'refresh'
      });
      expect(result.error).toBeUndefined();
    });

    it('should reject access token when verifying refresh token', () => {
      const { accessToken } = generateTokenPair(samplePayload);
      const result = verifyRefreshToken(accessToken);

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBeTruthy();
    });

    it('should reject invalid refresh token', () => {
      const result = verifyRefreshToken('invalid.refresh.token');

      expect(result.valid).toBe(false);
      expect(result.payload).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('Token Security', () => {
    it('should include token type in payload', () => {
      const { accessToken, refreshToken } = generateTokenPair(samplePayload);

      const accessResult = verifyAccessToken(accessToken);
      const refreshResult = verifyRefreshToken(refreshToken);

      expect(accessResult.payload?.type).toBe('access');
      expect(refreshResult.payload?.type).toBe('refresh');
    });

    it('should include issued at timestamp', () => {
      const before = Math.floor(Date.now() / 1000);
      const { accessToken } = generateTokenPair(samplePayload);
      const after = Math.floor(Date.now() / 1000);

      const result = verifyAccessToken(accessToken);

      expect(result.payload?.iat).toBeGreaterThanOrEqual(before);
      expect(result.payload?.iat).toBeLessThanOrEqual(after);
    });

    it('should include expiration timestamp', () => {
      const { accessToken } = generateTokenPair(samplePayload);
      const result = verifyAccessToken(accessToken);

      expect(result.payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('should prevent token type confusion', () => {
      const { accessToken, refreshToken } = generateTokenPair(samplePayload);

      // Access token should not work as refresh token
      const accessAsRefresh = verifyRefreshToken(accessToken);
      expect(accessAsRefresh.valid).toBe(false);

      // Refresh token should not work as access token
      const refreshAsAccess = verifyAccessToken(refreshToken);
      expect(refreshAsAccess.valid).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JWT gracefully', () => {
      const malformedTokens = [
        'not.a.jwt',
        'header.payload', // Missing signature
        'too.many.parts.here', // Too many parts
        '', // Empty string
        'invalid-characters!@#', // Invalid characters
      ];

      malformedTokens.forEach(token => {
        const accessResult = verifyAccessToken(token);
        const refreshResult = verifyRefreshToken(token);

        expect(accessResult.valid).toBe(false);
        expect(refreshResult.valid).toBe(false);
        expect(accessResult.error).toBeTruthy();
        expect(refreshResult.error).toBeTruthy();
      });
    });

    it('should handle token with invalid signature', () => {
      const { accessToken } = generateTokenPair(samplePayload);

      // Modify the signature part
      const parts = accessToken.split('.');
      const invalidToken = parts[0] + '.' + parts[1] + '.invalid-signature';

      const result = verifyAccessToken(invalidToken);

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should work end-to-end: generate -> verify -> refresh', () => {
      // Generate initial token pair
      const initial = generateTokenPair(samplePayload);

      // Verify access token
      const accessVerification = verifyAccessToken(initial.accessToken);
      expect(accessVerification.valid).toBe(true);

      // Verify refresh token
      const refreshVerification = verifyRefreshToken(initial.refreshToken);
      expect(refreshVerification.valid).toBe(true);

      // Generate new token pair using refresh token payload
      if (refreshVerification.payload) {
        const newPair = generateTokenPair({
          userId: refreshVerification.payload.userId,
          email: refreshVerification.payload.email,
          role: refreshVerification.payload.role
        });

        // Verify new tokens
        const newAccessVerification = verifyAccessToken(newPair.accessToken);
        const newRefreshVerification = verifyRefreshToken(newPair.refreshToken);

        expect(newAccessVerification.valid).toBe(true);
        expect(newRefreshVerification.valid).toBe(true);

        // New tokens should be different from original
        expect(newPair.accessToken).not.toBe(initial.accessToken);
        expect(newPair.refreshToken).not.toBe(initial.refreshToken);
      }
    });
  });
});