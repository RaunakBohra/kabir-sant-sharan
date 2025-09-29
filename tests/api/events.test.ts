/**
 * Events API Endpoint Tests
 * Tests for events CRUD operations and validation
 */

import { NextRequest } from 'next/server';
import { GET as getEvents } from '@/app/api/events/route';

// Mock the database service
jest.mock('@/lib/database-service', () => ({
  getEvents: jest.fn(),
  createEvent: jest.fn(),
  updateEvent: jest.fn(),
  deleteEvent: jest.fn(),
  registerForEvent: jest.fn()
}));

import { getEvents as mockGetEvents } from '@/lib/database-service';

describe('Events API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sampleEvents = [
    {
      id: 'event1',
      title: 'Weekly Satsang',
      description: 'Join us for our weekly spiritual gathering',
      location: 'Community Hall, Kabir Ashram',
      virtualLink: 'https://meet.example.com/kabir-satsang',
      startDate: '2024-10-01T06:00:00Z',
      endDate: '2024-10-01T08:00:00Z',
      type: 'satsang',
      maxAttendees: 100,
      currentAttendees: 45,
      registrationRequired: false,
      featured: true
    },
    {
      id: 'event2',
      title: 'Meditation Workshop',
      description: 'Learn the fundamentals of meditation',
      location: 'Meditation Center',
      startDate: '2024-10-05T09:00:00Z',
      endDate: '2024-10-05T11:00:00Z',
      type: 'workshop',
      maxAttendees: 30,
      currentAttendees: 12,
      registrationRequired: true,
      featured: false
    }
  ];

  describe('GET /api/events', () => {
    it('should return upcoming events with default pagination', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(2);
      expect(data.total).toBe(2);
      expect(data.hasMore).toBe(false);
      expect(data.events[0]).toHaveProperty('title');
      expect(data.events[0]).toHaveProperty('startDate');
    });

    it('should filter by event type', async () => {
      const satsangEvents = [sampleEvents[0]];
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: satsangEvents,
        total: 1,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events?type=satsang');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(1);
      expect(data.events[0].type).toBe('satsang');
    });

    it('should filter by featured status', async () => {
      const featuredEvents = [sampleEvents[0]];
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: featuredEvents,
        total: 1,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events?featured=true');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(1);
      expect(data.events[0].featured).toBe(true);
    });

    it('should filter by date range', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const startDate = '2024-10-01';
      const endDate = '2024-10-31';
      const request = new NextRequest(
        `http://localhost:3000/api/events?startDate=${startDate}&endDate=${endDate}`
      );
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(mockGetEvents).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      );
    });

    it('should handle pagination correctly', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: [sampleEvents[0]],
        total: 2,
        hasMore: true
      });

      const request = new NextRequest('http://localhost:3000/api/events?limit=1&offset=0');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(1);
      expect(data.total).toBe(2);
      expect(data.hasMore).toBe(true);
    });

    it('should validate event type values', async () => {
      const request = new NextRequest('http://localhost:3000/api/events?type=invalid-type');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Validation Error');
    });

    it('should validate date format', async () => {
      const request = new NextRequest('http://localhost:3000/api/events?startDate=invalid-date');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
    });

    it('should validate pagination limits', async () => {
      const request = new NextRequest('http://localhost:3000/api/events?limit=200');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveValidProblemDetails();
    });

    it('should include availability status', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.events.forEach((event: any) => {
        expect(event).toHaveProperty('maxAttendees');
        expect(event).toHaveProperty('currentAttendees');
        if (event.maxAttendees) {
          expect(event.currentAttendees).toBeLessThanOrEqual(event.maxAttendees);
        }
      });
    });

    it('should handle virtual events correctly', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      const virtualEvent = data.events.find((e: any) => e.virtualLink);
      expect(virtualEvent).toBeTruthy();
      expect(virtualEvent.virtualLink).toMatch(/^https?:\/\//);
    });

    it('should return empty array when no events found', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: [],
        total: 0,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events?type=nonexistent');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.events).toHaveLength(0);
      expect(data.total).toBe(0);
    });

    it('should handle database errors gracefully', async () => {
      (mockGetEvents as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveValidProblemDetails();
      expect(data.title).toBe('Internal Server Error');
    });
  });

  describe('API Response Structure', () => {
    it('should return consistent response structure', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(data).toHaveProperty('events');
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('hasMore');
      expect(data).toHaveProperty('filters');
      expect(Array.isArray(data.events)).toBe(true);
      expect(typeof data.total).toBe('number');
      expect(typeof data.hasMore).toBe('boolean');
    });

    it('should include filter metadata', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events?type=satsang&limit=10');
      const response = await getEvents(request);
      const data = await response.json();

      expect(data.filters).toHaveProperty('type');
      expect(data.filters).toHaveProperty('limit');
      expect(data.filters.type).toBe('satsang');
      expect(data.filters.limit).toBe(10);
    });

    it('should include proper date formatting', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      data.events.forEach((event: any) => {
        expect(event.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        expect(event.endDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      });
    });
  });

  describe('Security and Performance', () => {
    it('should include security headers', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should include caching headers for performance', async () => {
      (mockGetEvents as jest.Mock).mockResolvedValue({
        events: sampleEvents,
        total: 2,
        hasMore: false
      });

      const request = new NextRequest('http://localhost:3000/api/events');
      const response = await getEvents(request);

      expect(response.headers.get('Cache-Control')).toBeTruthy();
    });
  });
});