// Database service for connecting to D1 and managing data
import { getDatabase } from './db';
import { eq, desc, gte, isNull, and } from 'drizzle-orm';
import { teachings, events, newsletters } from '@/drizzle/schema';

export interface Teaching {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  published_at: string;
  category: string;
  tags: string[];
  featured_image?: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_type: string;
  is_featured: boolean;
  registration_required: boolean;
  max_attendees?: number;
  current_attendees: number;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
  preferences: {
    teachings: boolean;
    events: boolean;
    meditation: boolean;
  };
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  sentAt?: string;
  scheduledFor?: string;
  recipients: number;
  opens: number;
  clicks: number;
  segment: 'all' | 'teachings' | 'events' | 'meditation';
  created_at: string;
  updated_at: string;
}

export interface AnalyticsOverview {
  totalVisitors: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
}

export interface TopPage {
  path: string;
  title: string;
  views: number;
}

export interface RecentActivity {
  type: 'visit' | 'search';
  page?: string;
  query?: string;
  time: string;
}

export class DatabaseService {
  constructor(private env?: any) {}

  // Get database instance (in Workers environment)
  private getDB() {
    if (this.env?.DB) {
      return getDatabase(this.env);
    }
    throw new Error('Database not available in current environment');
  }

  // Teachings CRUD operations
  async getTeachings(limit = 10, offset = 0): Promise<{ teachings: Teaching[]; total: number }> {
    try {
      const db = getDatabase(this.env);

      // Query published teachings that are not soft-deleted
      const results = await db
        .select()
        .from(teachings)
        .where(and(
          eq(teachings.published, true),
          isNull(teachings.deletedAt)
        ))
        .orderBy(desc(teachings.publishedAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      const countResult = await db
        .select()
        .from(teachings)
        .where(and(
          eq(teachings.published, true),
          isNull(teachings.deletedAt)
        ));

      // Transform database results to Teaching interface
      const transformedTeachings: Teaching[] = results.map(t => ({
        id: t.id,
        title: t.title,
        content: t.content,
        excerpt: t.excerpt,
        author: t.author,
        published_at: t.publishedAt || t.createdAt || '',
        category: t.category,
        tags: t.tags ? t.tags.split(',').map(tag => tag.trim()) : [],
        featured_image: t.coverImage || undefined,
        slug: t.slug,
        created_at: t.createdAt || '',
        updated_at: t.updatedAt || ''
      }));

      return {
        teachings: transformedTeachings,
        total: countResult.length
      };
    } catch (error) {
      console.error('Error fetching teachings:', error);
      return { teachings: [], total: 0 };
    }
  }

  async getTeachingBySlug(slug: string): Promise<Teaching | null> {
    try {
      const db = getDatabase(this.env);

      const results = await db
        .select()
        .from(teachings)
        .where(and(
          eq(teachings.slug, slug),
          eq(teachings.published, true),
          isNull(teachings.deletedAt)
        ))
        .limit(1);

      if (results.length === 0) {
        return null;
      }

      const t = results[0];
      return {
        id: t.id,
        title: t.title,
        content: t.content,
        excerpt: t.excerpt,
        author: t.author,
        published_at: t.publishedAt || t.createdAt || '',
        category: t.category,
        tags: t.tags ? t.tags.split(',').map(tag => tag.trim()) : [],
        featured_image: t.coverImage || undefined,
        slug: t.slug,
        created_at: t.createdAt || '',
        updated_at: t.updatedAt || ''
      };
    } catch (error) {
      console.error('Error fetching teaching by slug:', error);
      return null;
    }
  }

  // Events CRUD operations
  async getEvents(limit = 10, offset = 0, upcoming = false): Promise<{ events: Event[]; total: number }> {
    try {
      const db = getDatabase(this.env);

      // Build where conditions
      const conditions = [
        eq(events.published, true),
        isNull(events.deletedAt)
      ];

      // If upcoming filter is enabled, only show future events
      if (upcoming) {
        const today = new Date().toISOString().split('T')[0];
        conditions.push(gte(events.startDate, today));
      }

      // Query published events that are not soft-deleted
      const results = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(desc(events.startDate))
        .limit(limit)
        .offset(offset);

      // Get total count
      const countResult = await db
        .select()
        .from(events)
        .where(and(...conditions));

      // Transform database results to Event interface
      const transformedEvents: Event[] = results.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        location: e.location || '',
        event_date: e.startDate,
        event_type: e.type,
        is_featured: e.featured || false,
        registration_required: e.registrationRequired || false,
        max_attendees: e.maxAttendees || undefined,
        current_attendees: e.currentAttendees || 0,
        created_at: e.createdAt || '',
        updated_at: e.updatedAt || ''
      }));

      return {
        events: transformedEvents,
        total: countResult.length
      };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { events: [], total: 0 };
    }
  }

  // Search functionality
  async searchContent(query: string, type?: 'teaching' | 'event'): Promise<{
    teachings: Teaching[];
    events: Event[];
  }> {
    const lowerQuery = query.toLowerCase();

    const { teachings } = await this.getTeachings(100);
    const { events } = await this.getEvents(100);

    const filteredTeachings = type === 'event' ? [] : teachings.filter(t =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.content.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    const filteredEvents = type === 'teaching' ? [] : events.filter(e =>
      e.title.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery) ||
      e.event_type.toLowerCase().includes(lowerQuery)
    );

    return {
      teachings: filteredTeachings,
      events: filteredEvents
    };
  }

  // Newsletter CRUD operations
  async getNewsletterSubscribers(limit = 100, offset = 0): Promise<{ subscribers: NewsletterSubscriber[]; total: number }> {
    try {
      const db = getDatabase(this.env);

      // Query active newsletter subscribers
      const results = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.status, 'active'))
        .orderBy(desc(newsletters.subscribedAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      const countResult = await db
        .select()
        .from(newsletters)
        .where(eq(newsletters.status, 'active'));

      // Transform database results to NewsletterSubscriber interface
      const transformedSubscribers: NewsletterSubscriber[] = results.map(n => {
        // Parse interests from comma-separated string to preferences object
        const interests = n.interests ? n.interests.split(',') : [];
        return {
          id: n.id,
          email: n.email,
          name: n.name || undefined,
          subscribedAt: n.subscribedAt || '',
          isActive: n.status === 'active',
          preferences: {
            teachings: interests.includes('teachings'),
            events: interests.includes('events'),
            meditation: interests.includes('meditation')
          }
        };
      });

      return {
        subscribers: transformedSubscribers,
        total: countResult.length
      };
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error);
      return { subscribers: [], total: 0 };
    }
  }

  async addNewsletterSubscriber(email: string, name?: string, preferences?: any): Promise<NewsletterSubscriber> {
    try {
      const db = getDatabase(this.env);
      const { createId } = await import('@paralleldrive/cuid2');
      const crypto = await import('crypto');

      // Convert preferences to interests string
      const interests: string[] = [];
      if (preferences?.teachings) interests.push('teachings');
      if (preferences?.events) interests.push('events');
      if (preferences?.meditation) interests.push('meditation');

      const newSubscriber = {
        id: createId(),
        email,
        name: name || null,
        language: 'en',
        status: 'active',
        source: 'website',
        interests: interests.join(',') || null,
        verified: false,
        verificationToken: createId(),
        unsubscribeToken: crypto.randomBytes(32).toString('hex'),
        subscribedAt: new Date().toISOString()
      };

      await db.insert(newsletters).values(newSubscriber);

      return {
        id: newSubscriber.id,
        email: newSubscriber.email,
        name: newSubscriber.name || undefined,
        subscribedAt: newSubscriber.subscribedAt,
        isActive: true,
        preferences: preferences || { teachings: true, events: true, meditation: true }
      };
    } catch (error) {
      console.error('Error adding newsletter subscriber:', error);
      throw error;
    }
  }

  async getNewsletterCampaigns(limit = 50, offset = 0): Promise<{ campaigns: NewsletterCampaign[]; total: number }> {
    // Mock data - in production, query from newsletter_campaigns table
    const mockCampaigns: NewsletterCampaign[] = [
      {
        id: '1',
        subject: 'Weekly Teachings: Path of Divine Love',
        content: 'This week we explore Kabir\'s teachings on divine love and selfless devotion...',
        status: 'sent',
        sentAt: '2024-09-22T09:00:00Z',
        recipients: 1247,
        opens: 832,
        clicks: 234,
        segment: 'all',
        created_at: '2024-09-20T10:00:00Z',
        updated_at: '2024-09-22T09:00:00Z'
      },
      {
        id: '2',
        subject: 'Upcoming Satsang: Community Gathering',
        content: 'Join us for our monthly satsang gathering with devotional singing and spiritual discussions...',
        status: 'draft',
        recipients: 0,
        opens: 0,
        clicks: 0,
        segment: 'events',
        created_at: '2024-09-28T10:00:00Z',
        updated_at: '2024-09-28T10:00:00Z'
      }
    ];

    const paginatedCampaigns = mockCampaigns.slice(offset, offset + limit);
    return {
      campaigns: paginatedCampaigns,
      total: mockCampaigns.length
    };
  }

  async createNewsletterCampaign(campaign: Partial<NewsletterCampaign>): Promise<NewsletterCampaign> {
    // Mock implementation - in production, INSERT into newsletter_campaigns
    const newCampaign: NewsletterCampaign = {
      id: Date.now().toString(),
      subject: campaign.subject || '',
      content: campaign.content || '',
      status: campaign.status || 'draft',
      sentAt: campaign.status === 'sent' ? new Date().toISOString() : undefined,
      scheduledFor: campaign.scheduledFor,
      recipients: campaign.recipients || 0,
      opens: 0,
      clicks: 0,
      segment: campaign.segment || 'all',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newCampaign;
  }

  // Analytics operations
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    // Mock data - in production, aggregate from analytics_visitors and analytics_page_views
    return {
      totalVisitors: 1247,
      pageViews: 3891,
      avgSessionDuration: '3m 42s',
      bounceRate: '34.2%'
    };
  }

  async getTopPages(limit = 10): Promise<TopPage[]> {
    // Mock data - in production, GROUP BY page and COUNT from analytics_page_views
    return [
      { path: '/', title: 'Home', views: 1234 },
      { path: '/teachings', title: 'Teachings', views: 892 },
      { path: '/events', title: 'Events', views: 567 },
      { path: '/media', title: 'Media', views: 423 }
    ].slice(0, limit);
  }

  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    // Mock data - in production, SELECT from analytics_page_views ORDER BY viewed_at DESC
    return [
      { type: 'visit', page: '/teachings/path-of-divine-love', time: '2 minutes ago' },
      { type: 'search', query: 'kabir doha', time: '5 minutes ago' },
      { type: 'visit', page: '/events', time: '8 minutes ago' }
    ].slice(0, limit);
  }

  async trackPageView(page: string, visitorId: string, title?: string): Promise<void> {
    // Mock implementation - in production, INSERT into analytics_page_views
    console.log(`Tracked page view: ${page} by ${visitorId}`);
  }
}

// Export a singleton instance for use in API routes
export const databaseService = new DatabaseService();