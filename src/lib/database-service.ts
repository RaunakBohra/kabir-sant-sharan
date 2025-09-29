// Database service for connecting to D1 and managing data
import { getDatabase } from './db';

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
    // For now, return enhanced mock data with more spiritual content
    const mockTeachings: Teaching[] = [
      {
        id: '1',
        title: 'The Path of Divine Love (प्रेम का मार्ग)',
        content: `Sant Kabir teaches us that the path to the divine is through pure love and devotion.

        "प्रेम गली अति सांकरी, ता में दो न समाहिं।
        जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं॥"

        The lane of love is very narrow, two cannot walk together. When I existed, God was not there; now God exists, I am not there. This beautiful doha explains that divine love requires complete surrender of the ego.`,
        excerpt: 'Discover the essence of divine love through Sant Kabir\'s timeless wisdom and the path of selfless devotion.',
        author: 'Sant Kabir Das',
        published_at: '2024-09-29T10:00:00Z',
        category: 'Philosophy',
        tags: ['love', 'devotion', 'spirituality', 'ego', 'surrender'],
        featured_image: '/images/divine-love.jpg',
        slug: 'path-of-divine-love',
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '2',
        title: 'Unity in Diversity (एकता में अनेकता)',
        content: `Sant Kabir's message transcends all religious boundaries. He believed all paths lead to the same divine source.

        "कस्तूरी कुंडल बसे, मृग ढूंढे बन माहि।
        ऐसे घट घट राम है, दुनिया देखे नाहि॥"

        The musk is in the deer's own navel, but it searches for it in the forest. Similarly, God resides in every heart, but the world fails to see this truth. Whether Hindu, Muslim, or any faith - the divine essence is one.`,
        excerpt: 'Understanding the universal message of unity beyond religious boundaries and finding the divine within.',
        author: 'Sant Kabir Das',
        published_at: '2024-09-28T10:00:00Z',
        category: 'Unity',
        tags: ['unity', 'religion', 'peace', 'universality', 'inner-divine'],
        featured_image: '/images/unity.jpg',
        slug: 'unity-in-diversity',
        created_at: '2024-09-28T10:00:00Z',
        updated_at: '2024-09-28T10:00:00Z'
      },
      {
        id: '3',
        title: 'The Illusion of Maya (माया का भ्रम)',
        content: `Kabir warns us about the illusions that keep us away from spiritual truth.

        "माया मरी न मन मरा, मर मर गए शरीर।
        आशा तृष्णा न मरी, कह गए दास कबीर॥"

        Neither Maya (illusion) died nor the mind died, only the body perished. Hope and desire never died, says Kabir. This teaches us that spiritual death of desires is more important than physical death.`,
        excerpt: 'Learn about the spiritual concept of Maya and how to overcome the illusions that bind us.',
        author: 'Sant Kabir Das',
        published_at: '2024-09-27T10:00:00Z',
        category: 'Spirituality',
        tags: ['maya', 'illusion', 'mind', 'desires', 'spiritual-death'],
        featured_image: '/images/maya.jpg',
        slug: 'illusion-of-maya',
        created_at: '2024-09-27T10:00:00Z',
        updated_at: '2024-09-27T10:00:00Z'
      }
    ];

    const paginatedTeachings = mockTeachings.slice(offset, offset + limit);
    return {
      teachings: paginatedTeachings,
      total: mockTeachings.length
    };
  }

  async getTeachingBySlug(slug: string): Promise<Teaching | null> {
    const { teachings } = await this.getTeachings(100); // Get all for searching
    return teachings.find(t => t.slug === slug) || null;
  }

  // Events CRUD operations
  async getEvents(limit = 10, offset = 0, upcoming = false): Promise<{ events: Event[]; total: number }> {
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Daily Satsang - Morning Meditation (प्रातःकालीन सत्संग)',
        description: 'Join us for daily morning meditation and spiritual discourse based on Sant Kabir\'s teachings. Experience the peace of collective prayer and meditation in the early hours when the mind is most receptive to divine grace.',
        location: 'Community Hall, Kabir Ashram',
        event_date: '2024-10-01T06:00:00Z',
        event_type: 'meditation',
        is_featured: true,
        registration_required: false,
        max_attendees: 100,
        current_attendees: 45,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '2',
        title: 'Kabir Jayanti Celebration (कबीर जयंती महोत्सव)',
        description: 'Annual celebration of Sant Kabir\'s birth anniversary with special programs including bhajan sessions, community feast, and spiritual discourses. Join the entire community in honoring the great saint\'s teachings.',
        location: 'Main Temple Complex',
        event_date: '2024-10-15T09:00:00Z',
        event_type: 'festival',
        is_featured: true,
        registration_required: true,
        max_attendees: 500,
        current_attendees: 234,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '3',
        title: 'Weekly Bhajan Session (साप्ताहिक भजन संध्या)',
        description: 'Community singing of devotional songs and Kabir\'s dohas with musical accompaniment. Experience the joy of collective devotion through music and singing.',
        location: 'Music Hall',
        event_date: '2024-10-05T18:00:00Z',
        event_type: 'music',
        is_featured: false,
        registration_required: false,
        max_attendees: 75,
        current_attendees: 32,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '4',
        title: 'Spiritual Discourse on Divine Names (हरि नाम चर्चा)',
        description: 'Deep discussion on the power of divine names and the practice of remembering God through various spiritual names. Learn the significance of different forms of divine remembrance.',
        location: 'Study Hall',
        event_date: '2024-10-12T19:00:00Z',
        event_type: 'discourse',
        is_featured: false,
        registration_required: true,
        max_attendees: 50,
        current_attendees: 28,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      }
    ];

    let filteredEvents = mockEvents;
    if (upcoming) {
      const now = new Date().toISOString();
      filteredEvents = mockEvents.filter(event => event.event_date > now);
    }

    const paginatedEvents = filteredEvents.slice(offset, offset + limit);
    return {
      events: paginatedEvents,
      total: filteredEvents.length
    };
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
    // Mock data - in production, query from newsletter_subscribers table
    const mockSubscribers: NewsletterSubscriber[] = [
      {
        id: '1',
        email: 'devotee1@example.com',
        name: 'Ram Krishna',
        subscribedAt: '2024-01-15T10:30:00Z',
        isActive: true,
        preferences: { teachings: true, events: true, meditation: false }
      },
      {
        id: '2',
        email: 'seeker2@example.com',
        name: 'Maya Devi',
        subscribedAt: '2024-02-01T14:20:00Z',
        isActive: true,
        preferences: { teachings: true, events: false, meditation: true }
      },
      {
        id: '3',
        email: 'spiritual.path@example.com',
        name: 'Hari Om',
        subscribedAt: '2024-03-12T08:45:00Z',
        isActive: true,
        preferences: { teachings: true, events: true, meditation: true }
      }
    ];

    const paginatedSubscribers = mockSubscribers.slice(offset, offset + limit);
    return {
      subscribers: paginatedSubscribers,
      total: mockSubscribers.length
    };
  }

  async addNewsletterSubscriber(email: string, name?: string, preferences?: any): Promise<NewsletterSubscriber> {
    // Mock implementation - in production, INSERT into newsletter_subscribers
    const newSubscriber: NewsletterSubscriber = {
      id: Date.now().toString(),
      email,
      name,
      subscribedAt: new Date().toISOString(),
      isActive: true,
      preferences: preferences || { teachings: true, events: true, meditation: true }
    };
    return newSubscriber;
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