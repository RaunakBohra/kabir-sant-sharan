// Database service for connecting to D1 and managing data
import { getDatabase } from './db';
import { eq, desc, gte, isNull, and, sql as drizzleSql } from 'drizzle-orm';
import { teachings, events, newsletters, newsletterCampaigns, analytics } from '@/drizzle/schema';

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
  startDate: string;
  type: string;
  featured: boolean;
  published: boolean;
  registrationRequired: boolean;
  registrationDeadline?: string;
  maxAttendees?: number;
  currentAttendees: number;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
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
        startDate: e.startDate,
        type: e.type,
        featured: e.featured || false,
        published: e.published || false,
        registrationRequired: e.registrationRequired || false,
        registrationDeadline: e.registrationDeadline || undefined,
        maxAttendees: e.maxAttendees || undefined,
        currentAttendees: e.currentAttendees || 0,
        startTime: e.startTime,
        endTime: e.endTime,
        createdAt: e.createdAt || '',
        updatedAt: e.updatedAt || ''
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
      e.type.toLowerCase().includes(lowerQuery)
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
    try {
      const db = getDatabase(this.env);

      // Query campaigns ordered by creation date
      const results = await db
        .select()
        .from(newsletterCampaigns)
        .orderBy(desc(newsletterCampaigns.createdAt))
        .limit(limit)
        .offset(offset);

      // Get total count
      const countResult = await db
        .select()
        .from(newsletterCampaigns);

      // Transform to NewsletterCampaign interface
      const transformedCampaigns: NewsletterCampaign[] = results.map(c => ({
        id: c.id,
        subject: c.subject,
        content: c.content,
        status: c.status as 'draft' | 'sent' | 'scheduled',
        sentAt: c.sentAt || undefined,
        scheduledFor: c.scheduledFor || undefined,
        recipients: c.recipients || 0,
        opens: c.opens || 0,
        clicks: c.clicks || 0,
        segment: c.segment as 'all' | 'teachings' | 'events' | 'meditation',
        created_at: c.createdAt || '',
        updated_at: c.updatedAt || ''
      }));

      return {
        campaigns: transformedCampaigns,
        total: countResult.length
      };
    } catch (error) {
      console.error('Error fetching newsletter campaigns:', error);
      return { campaigns: [], total: 0 };
    }
  }

  async createNewsletterCampaign(campaign: Partial<NewsletterCampaign>): Promise<NewsletterCampaign> {
    try {
      const db = getDatabase(this.env);
      const { createId } = await import('@paralleldrive/cuid2');

      const newCampaign = {
        id: createId(),
        subject: campaign.subject || '',
        content: campaign.content || '',
        status: campaign.status || 'draft',
        segment: campaign.segment || 'all',
        scheduledFor: campaign.scheduledFor || null,
        sentAt: campaign.status === 'sent' ? new Date().toISOString() : null,
        recipients: campaign.recipients || 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        unsubscribes: 0,
        createdBy: 'admin-YWRtaW5A', // TODO: Get from session
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.insert(newsletterCampaigns).values(newCampaign);

      return {
        id: newCampaign.id,
        subject: newCampaign.subject,
        content: newCampaign.content,
        status: newCampaign.status as 'draft' | 'sent' | 'scheduled',
        sentAt: newCampaign.sentAt || undefined,
        scheduledFor: newCampaign.scheduledFor || undefined,
        recipients: newCampaign.recipients,
        opens: newCampaign.opens,
        clicks: newCampaign.clicks,
        segment: newCampaign.segment as 'all' | 'teachings' | 'events' | 'meditation',
        created_at: newCampaign.createdAt,
        updated_at: newCampaign.updatedAt
      };
    } catch (error) {
      console.error('Error creating newsletter campaign:', error);
      throw error;
    }
  }

  // Analytics operations
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    try {
      const db = getDatabase(this.env);

      // Get unique visitors (unique sessionIds) in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const visitorsResult = await db
        .select({ count: drizzleSql<number>`COUNT(DISTINCT ${analytics.sessionId})` })
        .from(analytics)
        .where(and(
          eq(analytics.event, 'page_view'),
          gte(analytics.timestamp, oneDayAgo)
        ));

      // Get total page views in last 24 hours
      const pageViewsResult = await db
        .select({ count: drizzleSql<number>`COUNT(*)` })
        .from(analytics)
        .where(and(
          eq(analytics.event, 'page_view'),
          gte(analytics.timestamp, oneDayAgo)
        ));

      const totalVisitors = (visitorsResult[0] as any)?.count || 0;
      const pageViews = (pageViewsResult[0] as any)?.count || 0;

      return {
        totalVisitors,
        pageViews,
        avgSessionDuration: '3m 42s', // TODO: Calculate from session data
        bounceRate: '34.2%' // TODO: Calculate from session data
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      return {
        totalVisitors: 0,
        pageViews: 0,
        avgSessionDuration: '0m 0s',
        bounceRate: '0%'
      };
    }
  }

  async getTopPages(limit = 10): Promise<TopPage[]> {
    try {
      const db = getDatabase(this.env);

      // Get top pages by view count in last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const results = await db
        .select({
          path: analytics.resourceId,
          views: drizzleSql<number>`COUNT(*)`
        })
        .from(analytics)
        .where(and(
          eq(analytics.event, 'page_view'),
          eq(analytics.resourceType, 'page'),
          gte(analytics.timestamp, sevenDaysAgo)
        ))
        .groupBy(analytics.resourceId)
        .orderBy(desc(drizzleSql`COUNT(*)`))
        .limit(limit);

      return results.map(r => ({
        path: r.path || '/',
        title: r.path?.split('/').pop()?.replace(/-/g, ' ') || 'Home',
        views: r.views
      }));
    } catch (error) {
      console.error('Error fetching top pages:', error);
      return [];
    }
  }

  async getRecentActivity(limit = 10): Promise<RecentActivity[]> {
    try {
      const db = getDatabase(this.env);

      const results = await db
        .select()
        .from(analytics)
        .where(eq(analytics.event, 'page_view'))
        .orderBy(desc(analytics.timestamp))
        .limit(limit);

      return results.map(r => {
        const timestamp = new Date(r.timestamp || '');
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

        let timeAgo = '';
        if (diffMinutes < 1) timeAgo = 'just now';
        else if (diffMinutes < 60) timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        else timeAgo = `${Math.floor(diffMinutes / 60)} hour${Math.floor(diffMinutes / 60) > 1 ? 's' : ''} ago`;

        return {
          type: r.event === 'search' ? 'search' : 'visit' as 'visit' | 'search',
          page: r.resourceId || undefined,
          query: r.event === 'search' ? r.metadata : undefined,
          time: timeAgo
        };
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }

  async trackPageView(page: string, visitorId: string, title?: string): Promise<void> {
    try {
      const db = getDatabase(this.env);
      const { createId } = await import('@paralleldrive/cuid2');

      await db.insert(analytics).values({
        id: createId(),
        event: 'page_view',
        resourceType: 'page',
        resourceId: page,
        sessionId: visitorId,
        metadata: title || null,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
}

// Export a singleton instance for use in API routes
export const databaseService = new DatabaseService();