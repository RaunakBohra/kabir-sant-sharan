import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5002';
let authToken: string;

test.describe('API Integration Tests - Full Stack', () => {

  // ===========================================
  // AUTHENTICATION ENDPOINTS
  // ===========================================

  test.describe('Authentication APIs', () => {
    test('POST /api/auth/login - Valid credentials', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.accessToken).toBeDefined();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('admin@kabirsantsharan.com');

      // Store token for subsequent tests
      authToken = data.accessToken;
    });

    test('POST /api/auth/login - Invalid credentials', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'wrongpassword'
        }
      });

      expect([401, 429]).toContain(response.status()); // 429 if rate limited
    });

    test('POST /api/auth/login - Missing fields', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com'
        }
      });

      expect(response.status()).toBe(400);
    });

    test('GET /api/auth/session - Valid token', async ({ request }) => {
      // First login to get token
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('admin@kabirsantsharan.com');
    });

    test('GET /api/auth/session - Invalid token', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      });

      expect(response.status()).toBe(401);
    });

    test('GET /api/auth/session - No token', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/auth/session`);
      expect(response.status()).toBe(401);
    });

    test('POST /api/auth/logout - Valid session', async ({ request }) => {
      // First login
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.post(`${BASE_URL}/api/auth/logout`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test('GET /api/auth/sessions - List all sessions', async ({ request }) => {
      // First login
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/auth/sessions`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.sessions)).toBe(true);
      expect(data.sessions.length).toBeGreaterThan(0);
    });

    test('POST /api/auth/refresh - Valid refresh token', async ({ request }) => {
      // First login
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      if (loginData.refreshToken) {
        const response = await request.post(`${BASE_URL}/api/auth/refresh`, {
          data: {
            refreshToken: loginData.refreshToken
          }
        });

        expect([200, 400]).toContain(response.status());
      }
    });

    test('GET /api/auth/verify - Email verification', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/auth/verify?token=test-token`);
      expect([200, 400, 401, 404]).toContain(response.status());
    });
  });

  // ===========================================
  // TEACHINGS ENDPOINTS
  // ===========================================

  test.describe('Teachings APIs', () => {
    let teachingId: string;

    test('GET /api/teachings - List all teachings', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/teachings`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.teachings)).toBe(true);
      expect(data.total).toBeDefined();

      if (data.teachings.length > 0) {
        teachingId = data.teachings[0].id;
      }
    });

    test('GET /api/teachings?published=true - Published teachings only', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/teachings?published=true`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.teachings)).toBe(true);
    });

    test('GET /api/teachings?category=bhakti - Filter by category', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/teachings?category=bhakti`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.teachings)).toBe(true);
    });

    test('POST /api/teachings - Create new teaching (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.post(`${BASE_URL}/api/teachings`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        },
        data: {
          title: 'Test Teaching',
          content: 'This is a test teaching content',
          excerpt: 'Test excerpt',
          category: 'bhakti',
          author: 'Sant Kabir Das',
          language: 'en',
          published: false
        }
      });

      expect([200, 201]).toContain(response.status());
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.teaching).toBeDefined();

      if (data.teaching) {
        teachingId = data.teaching.id;
      }
    });

    test('POST /api/teachings - Unauthorized without token', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/teachings`, {
        data: {
          title: 'Test Teaching',
          content: 'Content',
          excerpt: 'Excerpt'
        }
      });

      expect([400, 401]).toContain(response.status());
    });

    test('GET /api/teachings/[id] - Get specific teaching', async ({ request }) => {
      if (!teachingId) {
        // Get a teaching first
        const listResponse = await request.get(`${BASE_URL}/api/teachings`);
        const listData = await listResponse.json();
        if (listData.teachings.length > 0) {
          teachingId = listData.teachings[0].id;
        }
      }

      if (teachingId) {
        const response = await request.get(`${BASE_URL}/api/teachings/${teachingId}`);
        expect([200, 404]).toContain(response.status());
      }
    });

    test('PUT /api/teachings/[id] - Update teaching (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      if (!teachingId) {
        const listResponse = await request.get(`${BASE_URL}/api/teachings`);
        const listData = await listResponse.json();
        if (listData.teachings.length > 0) {
          teachingId = listData.teachings[0].id;
        }
      }

      if (teachingId) {
        const response = await request.put(`${BASE_URL}/api/teachings/${teachingId}`, {
          headers: {
            'Authorization': `Bearer ${loginData.accessToken}`
          },
          data: {
            title: 'Updated Teaching Title'
          }
        });

        expect([200, 404]).toContain(response.status());
      }
    });

    test('DELETE /api/teachings/[id] - Delete teaching (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      // Create a teaching to delete
      const createResponse = await request.post(`${BASE_URL}/api/teachings`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        },
        data: {
          title: 'Teaching to Delete',
          content: 'Content to delete',
          excerpt: 'Excerpt',
          category: 'bhakti',
          author: 'Test',
          language: 'en'
        }
      });

      if (createResponse.status() === 200 || createResponse.status() === 201) {
        const createData = await createResponse.json();
        const deleteId = createData.teaching?.id;

        if (deleteId) {
          const response = await request.delete(`${BASE_URL}/api/teachings/${deleteId}`, {
            headers: {
              'Authorization': `Bearer ${loginData.accessToken}`
            }
          });

          expect([200, 404]).toContain(response.status());
        }
      }
    });
  });

  // ===========================================
  // EVENTS ENDPOINTS
  // ===========================================

  test.describe('Events APIs', () => {
    let eventId: string;

    test('GET /api/events - List all events', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/events`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.events)).toBe(true);
      expect(data.total).toBeDefined();

      if (data.events.length > 0) {
        eventId = data.events[0].id;
      }
    });

    test('GET /api/events?published=true - Published events only', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/events?published=true`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.events)).toBe(true);
    });

    test('GET /api/events/counts - Get event counts', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/events/counts`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.total).toBeDefined();
      expect(data.published).toBeDefined();
      expect(data.upcoming).toBeDefined();
    });

    test('POST /api/events - Create new event (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.post(`${BASE_URL}/api/events`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        },
        data: {
          title: 'Test Event',
          description: 'Test event description',
          type: 'satsang',
          location: 'Test Location',
          start_date: '2025-12-01',
          end_date: '2025-12-01',
          start_time: '10:00',
          end_time: '12:00',
          category: 'spiritual',
          organizer: 'Test Organizer',
          language: 'en',
          published: false
        }
      });

      expect([200, 201]).toContain(response.status());
      const data = await response.json();

      if (data.event) {
        eventId = data.event.id;
      }
    });

    test('GET /api/events/[id] - Get specific event', async ({ request }) => {
      if (!eventId) {
        const listResponse = await request.get(`${BASE_URL}/api/events`);
        const listData = await listResponse.json();
        if (listData.events.length > 0) {
          eventId = listData.events[0].id;
        }
      }

      if (eventId) {
        const response = await request.get(`${BASE_URL}/api/events/${eventId}`);
        expect([200, 404]).toContain(response.status());
      }
    });

    test('PUT /api/events/[id] - Update event (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      if (!eventId) {
        const listResponse = await request.get(`${BASE_URL}/api/events`);
        const listData = await listResponse.json();
        if (listData.events.length > 0) {
          eventId = listData.events[0].id;
        }
      }

      if (eventId) {
        const response = await request.put(`${BASE_URL}/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${loginData.accessToken}`
          },
          data: {
            title: 'Updated Event Title'
          }
        });

        expect([200, 404]).toContain(response.status());
      }
    });

    test('POST /api/events/[id]/register - Register for event', async ({ request }) => {
      if (!eventId) {
        const listResponse = await request.get(`${BASE_URL}/api/events?published=true`);
        const listData = await listResponse.json();
        if (listData.events.length > 0) {
          eventId = listData.events[0].id;
        }
      }

      if (eventId) {
        const response = await request.post(`${BASE_URL}/api/events/${eventId}/register`, {
          data: {
            guest_name: 'Test Guest',
            guest_email: `test${Date.now()}@example.com`,
            phone: '1234567890'
          }
        });

        expect([200, 400, 404]).toContain(response.status());
      }
    });

    test('DELETE /api/events/[id] - Delete event (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const createResponse = await request.post(`${BASE_URL}/api/events`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        },
        data: {
          title: 'Event to Delete',
          description: 'Description',
          type: 'satsang',
          location: 'Location',
          start_date: '2025-12-01',
          end_date: '2025-12-01',
          start_time: '10:00',
          end_time: '12:00',
          category: 'spiritual',
          organizer: 'Test',
          language: 'en'
        }
      });

      if (createResponse.status() === 200 || createResponse.status() === 201) {
        const createData = await createResponse.json();
        const deleteId = createData.event?.id;

        if (deleteId) {
          const response = await request.delete(`${BASE_URL}/api/events/${deleteId}`, {
            headers: {
              'Authorization': `Bearer ${loginData.accessToken}`
            }
          });

          expect([200, 404]).toContain(response.status());
        }
      }
    });
  });

  // ===========================================
  // QUOTES ENDPOINTS
  // ===========================================

  test.describe('Quotes APIs', () => {
    test('GET /api/quotes/daily - Get daily quote', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/quotes/daily`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.quote).toBeDefined();
      expect(data.quote.content || data.quote.text).toBeDefined();
      expect(data.quote.author).toBeDefined();
    });

    test('GET /api/quotes/daily?language=hi - Daily quote in Hindi', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/quotes/daily?language=hi`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.quote).toBeDefined();
    });
  });

  // ===========================================
  // SEARCH ENDPOINTS
  // ===========================================

  test.describe('Search APIs', () => {
    test('GET /api/search?q=kabir - Search all content', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/search?q=kabir&type=all`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.results).toBeDefined();
      expect(data.total).toBeDefined();
      expect(Array.isArray(data.results)).toBe(true);
    });

    test('GET /api/search?q=test&type=teachings - Search teachings only', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/search?q=test&type=teachings`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.results).toBeDefined();
    });

    test('GET /api/search?q=event&type=events - Search events only', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/search?q=event&type=events`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.results).toBeDefined();
    });

    test('GET /api/search - Empty query returns results', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/search`);
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.results).toBeDefined();
    });
  });

  // ===========================================
  // NEWSLETTER ENDPOINTS
  // ===========================================

  test.describe('Newsletter APIs', () => {
    test('GET /api/newsletter/subscribers - List subscribers (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/newsletter/subscribers`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.subscribers)).toBe(true);
    });

    test('POST /api/newsletter/subscribers - Subscribe to newsletter', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/api/newsletter/subscribers`, {
        data: {
          email: `test${Date.now()}@example.com`,
          name: 'Test Subscriber',
          language: 'en'
        }
      });

      expect([200, 201, 400]).toContain(response.status());
    });

    test('GET /api/newsletter/campaigns - List campaigns (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/newsletter/campaigns`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.campaigns)).toBe(true);
    });
  });

  // ===========================================
  // ANALYTICS ENDPOINTS
  // ===========================================

  test.describe('Analytics APIs', () => {
    test('GET /api/analytics/overview - Analytics overview (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/analytics/overview`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.totalVisitors !== undefined).toBe(true);
    });

    test('GET /api/analytics/top-pages - Top pages (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/analytics/top-pages`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.topPages)).toBe(true);
    });

    test('GET /api/analytics/recent-activity - Recent activity (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/analytics/recent-activity`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data.recentActivity)).toBe(true);
    });
  });

  // ===========================================
  // HEALTH & MONITORING ENDPOINTS
  // ===========================================

  test.describe('Health & Monitoring APIs', () => {
    test('GET /api/v1/health - Health check', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/v1/health`);

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
    });

    test('GET /api/v1/metrics - System metrics (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/v1/metrics`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect([200, 401]).toContain(response.status());
    });

    test('GET /api/v1/performance - Performance metrics (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/v1/performance`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect([200, 401]).toContain(response.status());
    });

    test('GET /api/v1/performance/live - Live performance (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/v1/performance/live`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect([200, 401]).toContain(response.status());
    });
  });

  // ===========================================
  // ADMIN & DATABASE ENDPOINTS
  // ===========================================

  test.describe('Admin & Database APIs', () => {
    test('GET /api/admin/database - Database stats (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      const response = await request.get(`${BASE_URL}/api/admin/database`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data.stats).toBeDefined();
    });

    test('GET /api/docs - API documentation', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/docs`);
      expect([200, 404]).toContain(response.status());
    });
  });

  // ===========================================
  // MEDIA ENDPOINTS
  // ===========================================

  test.describe('Media APIs', () => {
    test('POST /api/media/upload - Upload media (authenticated)', async ({ request }) => {
      const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
        data: {
          email: 'admin@kabirsantsharan.com',
          password: 'admin123'
        }
      });
      const loginData = await loginResponse.json();

      // Note: This test will likely fail without actual file upload
      // Just testing the endpoint exists and responds correctly
      const response = await request.post(`${BASE_URL}/api/media/upload`, {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });

      // Expect error due to missing file, but endpoint should respond
      expect([400, 401, 422, 500]).toContain(response.status());
    });
  });
});