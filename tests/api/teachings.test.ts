/**
 * Teachings API Endpoint Tests
 * Tests for teachings CRUD operations and validation
 */

import { NextRequest } from 'next/server';
import { GET as getTeachings } from '@/app/api/teachings/route';

// Mock the database service
jest.mock('@/lib/database-service', () => ({
  getTeachings: jest.fn(),
  createTeaching: jest.fn(),
  updateTeaching: jest.fn(),
  deleteTeaching: jest.fn(),
  getTeachingBySlug: jest.fn()
}));

import { getTeachings as mockGetTeachings } from '@/lib/database-service';

describe('Teachings API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleTeachings = [
    {
      id: 'teaching1',
      title: 'The Path of Divine Love',
      content: 'Sant Kabir teaches us about divine love...',
      excerpt: 'A teaching about divine love',
      category: 'Philosophy',
      tags: ['love', 'spirituality'],
      author: 'Sant Kabir Das',
      language: 'en',
      published: true,
      featured: false,
      slug: 'path-of-divine-love',
      publishedAt: '2024-09-29T10:00:00Z',
      createdAt: '2024-09-29T09:00:00Z'
    },
    {
      id: 'teaching2',
      title: 'Unity in Diversity',
      content: 'All paths lead to the same truth...',
      excerpt: 'A teaching about unity',
      category: 'Unity',
      tags: ['unity', 'truth'],
      author: 'Sant Kabir Das',
      language: 'en',
      published: true,
      featured: true,
      slug: 'unity-in-diversity',
      publishedAt: '2024-09-28T10:00:00Z',
      createdAt: '2024-09-28T09:00:00Z'
    }
  ];

  describe('GET /api/teachings', () => {
    it('should return published teachings with default pagination', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings).toHaveLength(2);
      expect(data.total).toBe(2);
      expect(data.hasMore).toBe(false);
      expect(data.teachings[0]).toHaveProperty('title');
      expect(data.teachings[0]).toHaveProperty('slug');
    });

    it('should filter by category', async () => {
      const philosophyTeachings = [sampleTeachings[0]];
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: philosophyTeachings,
        total: 1,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?category=Philosophy');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings).toHaveLength(1);
      expect(data.teachings[0].category).toBe('Philosophy');
    });

    it('should filter by language', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?language=en');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings.every((t: any) => t.language === 'en')).toBe(true);
    });

    it('should return only featured teachings when requested', async () => {
      const featuredTeachings = [sampleTeachings[1]];
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: featuredTeachings,
        total: 1,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?featured=true');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings).toHaveLength(1);
      expect(data.teachings[0].featured).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: [sampleTeachings[0]],
        total: 2,
        hasMore: true
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?limit=1&offset=0');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings).toHaveLength(1);
      expect(data.total).toBe(2);
      expect(data.hasMore).toBe(true);
    });

    it('should validate pagination limits', async () => {
      const request = new NextRequest('http://localhost:3000/api/teachings?limit=150');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Validation Error');
    });

    it('should validate category values', async () => {
      const request = new NextRequest('http://localhost:3000/api/teachings?category=InvalidCategory');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
    });

    it('should validate language codes', async () => {
      const request = new NextRequest('http://localhost:3000/api/teachings?language=invalid');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
    });

    it('should include proper caching headers', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings');
      const response = await getTeachings(request);

      expect(response.headers.get('Cache-Control')).toBeTruthy();
    });

    it('should handle database errors gracefully', async () => {
      (mockGetTeachings as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/teachings');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Internal Server Error');
    });

    it('should return empty array when no teachings found', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: [],
        total: 0,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?category=NonExistent');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.teachings).toHaveLength(0);
      expect(data.total).toBe(0);
    });
  });

  describe('API Response Structure', () => {
    it('should return consistent response structure', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(data).toHaveProperty('teachings');
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('hasMore');
      expect(data).toHaveProperty('filters');
      expect(Array.isArray(data.teachings)).toBe(true);
      expect(typeof data.total).toBe('number');
      expect(typeof data.hasMore).toBe('boolean');
    });

    it('should include metadata in response', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings?category=Philosophy&limit=10');
      const response = await getTeachings(request);
      const data = await response.json();

      expect(data.filters).toHaveProperty('category');
      expect(data.filters).toHaveProperty('limit');
      expect(data.filters.category).toBe('Philosophy');
      expect(data.filters.limit).toBe(10);
    });
  });

  describe('Security and Performance', () => {
    it('should include security headers', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/teachings');
      const response = await getTeachings(request);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should handle concurrent requests', async () => {
      (mockGetTeachings as jest.Mock).mockResolvedValue({
        teachings: sampleTeachings,
        total: 2,
        hasMore: false
      });

      const requests = Array(5).fill(null).map(() =>
        new NextRequest('http://localhost:3000/api/teachings')
      );

      const responses = await Promise.all(
        requests.map(req => getTeachings(req))
      );

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});