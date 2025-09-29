/**
 * Validation Schemas Tests
 * Tests for all Zod validation schemas
 */

import {
  LoginSchema,
  RefreshTokenSchema,
  TeachingQuerySchema,
  EventQuerySchema,
  PaginationSchema,
  TeachingCreateSchema,
  EventCreateSchema
} from '@/lib/validation-schemas';

describe('Validation Schemas', () => {
  describe('LoginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'admin@kabirsantsharan.com',
        password: 'admin123'
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('admin@kabirsantsharan.com');
      }
    });

    it('should reject invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'admin123'
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'admin123'
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'admin@kabirsantsharan.com'
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'admin@kabirsantsharan.com',
        password: ''
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject extremely long email', () => {
      const invalidData = {
        email: 'a'.repeat(250) + '@example.com',
        password: 'admin123'
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject extremely long password', () => {
      const invalidData = {
        email: 'admin@kabirsantsharan.com',
        password: 'a'.repeat(150)
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('RefreshTokenSchema', () => {
    it('should validate correct refresh token', () => {
      const validData = {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      };

      const result = RefreshTokenSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing refresh token', () => {
      const invalidData = {};

      const result = RefreshTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject empty refresh token', () => {
      const invalidData = {
        refreshToken: ''
      };

      const result = RefreshTokenSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('PaginationSchema', () => {
    it('should validate correct pagination parameters', () => {
      const validData = {
        limit: 10,
        offset: 0
      };

      const result = PaginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
        expect(result.data.offset).toBe(0);
      }
    });

    it('should apply default values when omitted', () => {
      const validData = {};

      const result = PaginationSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
        expect(result.data.offset).toBe(0);
      }
    });

    it('should reject limit above maximum', () => {
      const invalidData = {
        limit: 150
      };

      const result = PaginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative limit', () => {
      const invalidData = {
        limit: -1
      };

      const result = PaginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative offset', () => {
      const invalidData = {
        offset: -1
      };

      const result = PaginationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('TeachingQuerySchema', () => {
    it('should validate correct teaching query', () => {
      const validData = {
        category: 'Philosophy',
        language: 'en',
        featured: 'true',
        limit: 20,
        offset: 10
      };

      const result = TeachingQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe('Philosophy');
        expect(result.data.featured).toBe(true);
      }
    });

    it('should reject invalid category', () => {
      const invalidData = {
        category: 'InvalidCategory'
      };

      const result = TeachingQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid language', () => {
      const invalidData = {
        language: 'invalid'
      };

      const result = TeachingQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle all valid categories', () => {
      const validCategories = ['Philosophy', 'Unity', 'Spirituality', 'Meditation', 'Life', 'Devotion'];

      validCategories.forEach(category => {
        const result = TeachingQuerySchema.safeParse({ category });
        expect(result.success).toBe(true);
      });
    });

    it('should handle all valid languages', () => {
      const validLanguages = ['en', 'hi', 'ne'];

      validLanguages.forEach(language => {
        const result = TeachingQuerySchema.safeParse({ language });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('EventQuerySchema', () => {
    it('should validate correct event query', () => {
      const validData = {
        type: 'satsang',
        featured: 'false',
        startDate: '2024-10-01',
        endDate: '2024-10-31',
        limit: 15
      };

      const result = EventQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('satsang');
        expect(result.data.featured).toBe(false);
      }
    });

    it('should reject invalid event type', () => {
      const invalidData = {
        type: 'invalid-type'
      };

      const result = EventQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should handle all valid event types', () => {
      const validTypes = ['meditation', 'satsang', 'festival', 'discourse', 'music', 'workshop'];

      validTypes.forEach(type => {
        const result = EventQuerySchema.safeParse({ type });
        expect(result.success).toBe(true);
      });
    });

    it('should validate date format', () => {
      const invalidData = {
        startDate: 'invalid-date'
      };

      const result = EventQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept valid ISO date strings', () => {
      const validData = {
        startDate: '2024-10-01T10:00:00Z',
        endDate: '2024-10-01T12:00:00Z'
      };

      const result = EventQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('TeachingCreateSchema', () => {
    it('should validate correct teaching creation data', () => {
      const validData = {
        title: 'Test Teaching',
        content: 'This is test content for the teaching.',
        excerpt: 'Test excerpt',
        category: 'Philosophy',
        tags: ['test', 'philosophy'],
        author: 'Sant Kabir Das',
        language: 'en',
        published: true,
        featured: false
      };

      const result = TeachingCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Teaching'
        // Missing required fields
      };

      const result = TeachingCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should sanitize HTML in content', () => {
      const dataWithHTML = {
        title: 'Test Teaching',
        content: '<script>alert("xss")</script>Safe content',
        excerpt: 'Test excerpt',
        category: 'Philosophy',
        author: 'Sant Kabir Das',
        language: 'en'
      };

      const result = TeachingCreateSchema.safeParse(dataWithHTML);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.content).not.toContain('<script>');
        expect(result.data.content).toContain('Safe content');
      }
    });
  });

  describe('EventCreateSchema', () => {
    it('should validate correct event creation data', () => {
      const validData = {
        title: 'Test Event',
        description: 'This is a test event.',
        location: 'Test Location',
        startDate: '2024-10-01T10:00:00Z',
        endDate: '2024-10-01T12:00:00Z',
        type: 'workshop',
        maxAttendees: 50,
        registrationRequired: true,
        featured: false
      };

      const result = EventCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Event'
        // Missing required fields
      };

      const result = EventCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should validate virtual link format', () => {
      const validData = {
        title: 'Virtual Event',
        description: 'This is a virtual event.',
        location: 'Online',
        virtualLink: 'https://meet.example.com/event',
        startDate: '2024-10-01T10:00:00Z',
        endDate: '2024-10-01T12:00:00Z',
        type: 'workshop'
      };

      const result = EventCreateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid virtual link', () => {
      const invalidData = {
        title: 'Virtual Event',
        description: 'This is a virtual event.',
        location: 'Online',
        virtualLink: 'not-a-url',
        startDate: '2024-10-01T10:00:00Z',
        endDate: '2024-10-01T12:00:00Z',
        type: 'workshop'
      };

      const result = EventCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject negative maxAttendees', () => {
      const invalidData = {
        title: 'Test Event',
        description: 'This is a test event.',
        location: 'Test Location',
        startDate: '2024-10-01T10:00:00Z',
        endDate: '2024-10-01T12:00:00Z',
        type: 'workshop',
        maxAttendees: -1
      };

      const result = EventCreateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle extremely long strings appropriately', () => {
      const longString = 'a'.repeat(10000);
      const data = {
        email: longString + '@example.com',
        password: 'test123'
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('should sanitize potentially malicious input', () => {
      const maliciousData = {
        title: '<script>alert("xss")</script>Safe Title',
        content: 'javascript:alert("xss")',
        excerpt: 'Safe excerpt',
        category: 'Philosophy',
        author: 'Sant Kabir Das',
        language: 'en'
      };

      const result = TeachingCreateSchema.safeParse(maliciousData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).not.toContain('<script>');
        expect(result.data.content).not.toContain('javascript:');
      }
    });

    it('should handle null and undefined values', () => {
      const nullData = {
        email: null,
        password: undefined
      };

      const result = LoginSchema.safeParse(nullData);
      expect(result.success).toBe(false);
    });
  });
});