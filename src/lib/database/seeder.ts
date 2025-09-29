import { createId } from '@paralleldrive/cuid2';
import { logger } from '../logger';
import bcrypt from 'bcryptjs';

export interface SeedData {
  users?: any[];
  teachings?: any[];
  events?: any[];
  quotes?: any[];
  media?: any[];
  newsletters?: any[];
}

export interface SeedResult {
  success: boolean;
  results: {
    [key: string]: {
      inserted: number;
      skipped: number;
      errors: string[];
    };
  };
}

class DatabaseSeeder {
  private db: any;

  constructor(database?: any) {
    this.db = database || (globalThis as any).db;
  }

  /**
   * Seed the database with initial data
   */
  async seed(environment: 'development' | 'production' = 'development'): Promise<SeedResult> {
    const result: SeedResult = {
      success: true,
      results: {}
    };

    try {
      logger.info('Starting database seeding', {
        environment,
        component: 'database-seeder'
      });

      // Seed users first (other tables depend on it)
      result.results.users = await this.seedUsers(environment);

      // Seed other tables
      result.results.teachings = await this.seedTeachings(environment);
      result.results.events = await this.seedEvents(environment);
      result.results.quotes = await this.seedQuotes(environment);
      result.results.media = await this.seedMedia(environment);
      result.results.newsletters = await this.seedNewsletters(environment);

      // Check overall success
      const hasErrors = Object.values(result.results).some(r => r.errors.length > 0);
      result.success = !hasErrors;

      logger.info('Database seeding completed', {
        environment,
        success: result.success,
        results: result.results,
        component: 'database-seeder'
      });

    } catch (error) {
      result.success = false;
      logger.error('Database seeding failed', {
        error: error instanceof Error ? error.message : String(error),
        environment,
        component: 'database-seeder'
      });
    }

    return result;
  }

  /**
   * Seed users table
   */
  private async seedUsers(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    try {
      // Check if admin user already exists
      const existingAdmin = await this.db.prepare(
        'SELECT id FROM users WHERE email = ? LIMIT 1'
      ).bind('admin@kabirsantsharan.com').first();

      if (existingAdmin) {
        result.skipped++;
        logger.info('Admin user already exists, skipping', {
          component: 'database-seeder'
        });
      } else {
        // Create admin user
        const adminPasswordHash = await bcrypt.hash('admin123', 12);

        await this.db.prepare(`
          INSERT INTO users (id, email, name, role, language, email_verified, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          createId(),
          'admin@kabirsantsharan.com',
          'Admin User',
          'admin',
          'en',
          1,
          new Date().toISOString(),
          new Date().toISOString()
        ).run();

        result.inserted++;
        logger.info('Admin user created', {
          component: 'database-seeder'
        });
      }

      // Add sample users for development
      if (environment === 'development') {
        const sampleUsers = [
          {
            id: createId(),
            email: 'moderator@kabirsantsharan.com',
            name: 'Spiritual Moderator',
            role: 'moderator',
            language: 'en',
            email_verified: 1,
            bio: 'Dedicated to sharing Sant Kabir\'s wisdom and moderating community discussions.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: createId(),
            email: 'member@kabirsantsharan.com',
            name: 'Community Member',
            role: 'member',
            language: 'hi',
            email_verified: 1,
            bio: 'Devoted follower of Sant Kabir\'s teachings.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        for (const user of sampleUsers) {
          try {
            const existing = await this.db.prepare(
              'SELECT id FROM users WHERE email = ? LIMIT 1'
            ).bind(user.email).first();

            if (!existing) {
              await this.db.prepare(`
                INSERT INTO users (id, email, name, role, language, email_verified, bio, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(...Object.values(user)).run();

              result.inserted++;
            } else {
              result.skipped++;
            }
          } catch (error) {
            result.errors.push(`User ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }

    } catch (error) {
      result.errors.push(`Users seeding error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Seed teachings table
   */
  private async seedTeachings(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    const teachings = [
      {
        id: createId(),
        title: 'The Inner Light - Antarjyoti',
        content: `Sant Kabir Das spoke extensively about the divine light that resides within every soul. This inner light, or Antarjyoti, is the true essence of our being and the path to liberation.

"जब मैं था तब हरि नहीं, अब हरि हैं मैं नाही।
सब अंधियारा मिट गया, जब दीपक देख्या माही।।"

When I existed, God was not there; now God exists and I am not. All darkness vanished when I saw the lamp within.

This profound teaching reminds us that spiritual realization comes when the ego dissolves and we recognize the divine presence within ourselves. The inner light is not something external to be found, but rather our own true nature to be unveiled.

Through meditation, contemplation, and surrender, we can experience this inner radiance that Kabir so beautifully described. It is the light of consciousness, the flame of awareness that burns eternally within the heart of every being.`,
        excerpt: 'Discover the divine light within through Kabir\'s timeless wisdom on inner contemplation and spiritual awakening.',
        slug: 'the-inner-light-antarjyoti',
        category: 'Spiritual Teachings',
        tags: JSON.stringify(['inner-light', 'antarjyoti', 'divine-consciousness', 'meditation']),
        author: 'Sant Kabir Das',
        published: 1,
        featured: 1,
        views: 234,
        likes: 45,
        language: 'en',
        reading_time: 12,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        title: 'Unity of All Religions - Sarva Dharma Sambhav',
        content: `One of Sant Kabir's most revolutionary teachings was his emphasis on the unity of all religions. He taught that all spiritual paths, when followed with sincerity and devotion, lead to the same divine truth.

"राम रहीम करीम केशव, हरि हजरत नाम अनेक।
एक ही सत परमेश्वर, जान भेद सब टेक।।"

Ram, Rahim, Karim, Keshav, Hari, Hazrat - names are many. There is only one true Supreme Being, abandon all differences and know this truth.

Kabir challenged the religious orthodoxy of his time by proclaiming that God is neither Hindu nor Muslim, but the eternal truth that transcends all divisions. He criticized both religious communities for their rigid practices while missing the essence of spirituality.

His message of religious harmony is particularly relevant today, as we continue to witness conflicts based on religious differences. Kabir showed us that love, compassion, and devotion are the universal languages of the divine, regardless of the path we choose to follow.`,
        excerpt: 'Explore Kabir\'s revolutionary message of religious unity and the common thread that connects all spiritual paths.',
        slug: 'unity-of-all-religions',
        category: 'Religious Unity',
        tags: JSON.stringify(['unity', 'religions', 'ram-rahim', 'harmony', 'tolerance']),
        author: 'Sant Kabir Das',
        published: 1,
        featured: 0,
        views: 156,
        likes: 32,
        language: 'en',
        reading_time: 10,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        title: 'The Path of Devotion - Bhakti Marg',
        content: `Sant Kabir emphasized that true devotion is not about external rituals or ceremonies, but about the sincere love and surrender of the heart to the divine.

"भक्ति भाव भंडारणी, नाम पदारथ सार।
तजि सकल अभिमान तू, होहि भक्त भगवान।।"

Devotion is the treasure house of emotions, and the Name is the essence of all substances. Abandon all pride and ego, and become a devotee of God.

True bhakti involves complete surrender of the ego and the cultivation of love, humility, and service. Kabir taught that this path is open to all, regardless of caste, creed, or social status. What matters is the purity of intention and the sincerity of the heart.

The practice of devotion includes remembrance of the divine name (nama simran), meditation, and living a life guided by dharmic principles. Through such practice, the devotee gradually purifies the mind and prepares for the ultimate union with the divine.`,
        excerpt: 'Learn about the path of devotion as taught by Sant Kabir, emphasizing love, surrender, and genuine spiritual practice.',
        slug: 'path-of-devotion-bhakti-marg',
        category: 'Spiritual Practice',
        tags: JSON.stringify(['bhakti', 'devotion', 'surrender', 'nama-simran', 'spiritual-practice']),
        author: 'Sant Kabir Das',
        published: 1,
        featured: 1,
        views: 189,
        likes: 38,
        language: 'en',
        reading_time: 8,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const teaching of teachings) {
      try {
        const existing = await this.db.prepare(
          'SELECT id FROM teachings WHERE slug = ? LIMIT 1'
        ).bind(teaching.slug).first();

        if (!existing) {
          await this.db.prepare(`
            INSERT INTO teachings (
              id, title, content, excerpt, slug, category, tags, author,
              published, featured, views, likes, language, reading_time,
              published_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(...Object.values(teaching)).run();

          result.inserted++;
        } else {
          result.skipped++;
        }
      } catch (error) {
        result.errors.push(`Teaching ${teaching.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  }

  /**
   * Seed events table
   */
  private async seedEvents(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    const events = [
      {
        id: createId(),
        title: 'Weekly Satsang - Kabir\'s Wisdom',
        description: 'Join us for our weekly spiritual gathering where we explore Sant Kabir\'s teachings through discourse, kirtan, and meditation. A sacred space for community reflection and spiritual growth.',
        slug: 'weekly-satsang-kabir-wisdom',
        type: 'satsang',
        location: 'Community Hall, Spiritual Center',
        max_attendees: 100,
        current_attendees: 0,
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '18:00',
        end_time: '20:00',
        timezone: 'Asia/Kathmandu',
        featured: 1,
        published: 1,
        registration_required: 1,
        category: 'Satsang',
        tags: JSON.stringify(['satsang', 'weekly', 'kabir-wisdom', 'meditation', 'community']),
        organizer: 'Kabir Sant Sharan Community',
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        title: 'Kabir Jayanti Celebration',
        description: 'Annual celebration of Sant Kabir\'s birth anniversary with special programs including bhajan sessions, community feast, and spiritual discourses by learned speakers.',
        slug: 'kabir-jayanti-celebration',
        type: 'festival',
        location: 'Main Temple Complex',
        max_attendees: 500,
        current_attendees: 0,
        start_date: '2024-06-15', // Traditional Kabir Jayanti date
        end_date: '2024-06-15',
        start_time: '09:00',
        end_time: '18:00',
        timezone: 'Asia/Kathmandu',
        featured: 1,
        published: 1,
        registration_required: 0,
        category: 'Festival',
        tags: JSON.stringify(['kabir-jayanti', 'festival', 'celebration', 'bhajan', 'community-feast']),
        organizer: 'Kabir Sant Sharan Community',
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const event of events) {
      try {
        const existing = await this.db.prepare(
          'SELECT id FROM events WHERE slug = ? LIMIT 1'
        ).bind(event.slug).first();

        if (!existing) {
          await this.db.prepare(`
            INSERT INTO events (
              id, title, description, slug, type, location, max_attendees,
              current_attendees, start_date, end_date, start_time, end_time,
              timezone, featured, published, registration_required, category,
              tags, organizer, language, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(...Object.values(event)).run();

          result.inserted++;
        } else {
          result.skipped++;
        }
      } catch (error) {
        result.errors.push(`Event ${event.slug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  }

  /**
   * Seed quotes table
   */
  private async seedQuotes(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    const quotes = [
      {
        id: createId(),
        content: 'जब मैं था तब हरि नहीं, अब हरि हैं मैं नाही। सब अंधियारा मिट गया, जब दीपक देख्या माही।।',
        translation: 'When I existed, God was not there; now God exists and I am not. All darkness vanished when I saw the lamp within.',
        author: 'Sant Kabir Das',
        category: 'Self-Realization',
        tags: JSON.stringify(['self-realization', 'divine-light', 'ego-dissolution', 'inner-awakening']),
        language: 'hi',
        featured: 1,
        active: 1,
        display_date: new Date().toISOString().split('T')[0],
        views: 67,
        likes: 23,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        content: 'सुरति निरति की रेख मिलाई, गुरु शिष्य का भेद मिटाई।',
        translation: 'The line between consciousness and attention is merged, and the difference between guru and disciple is dissolved.',
        author: 'Sant Kabir Das',
        category: 'Guru-Disciple',
        tags: JSON.stringify(['guru-disciple', 'consciousness', 'unity', 'spiritual-guidance']),
        language: 'hi',
        featured: 1,
        active: 1,
        display_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        views: 45,
        likes: 18,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        content: 'राम रहीम करीम केशव, हरि हजरत नाम अनेक। एक ही सत परमेश्वर, जान भेद सब टेक।।',
        translation: 'Ram, Rahim, Karim, Keshav, Hari, Hazrat - names are many. There is only one true Supreme Being, abandon all differences.',
        author: 'Sant Kabir Das',
        category: 'Religious Unity',
        tags: JSON.stringify(['unity', 'religions', 'oneness', 'divine-names', 'tolerance']),
        language: 'hi',
        featured: 1,
        active: 1,
        display_date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0], // Day after tomorrow
        views: 78,
        likes: 31,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const quote of quotes) {
      try {
        const existing = await this.db.prepare(
          'SELECT id FROM quotes WHERE content = ? LIMIT 1'
        ).bind(quote.content).first();

        if (!existing) {
          await this.db.prepare(`
            INSERT INTO quotes (
              id, content, translation, author, category, tags, language,
              featured, active, display_date, views, likes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(...Object.values(quote)).run();

          result.inserted++;
        } else {
          result.skipped++;
        }
      } catch (error) {
        result.errors.push(`Quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return result;
  }

  /**
   * Seed media table
   */
  private async seedMedia(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    // Only add sample media in development
    if (environment === 'development') {
      const adminUser = await this.db.prepare(
        'SELECT id FROM users WHERE role = ? LIMIT 1'
      ).bind('admin').first();

      if (!adminUser) {
        result.errors.push('Admin user not found for media seeding');
        return result;
      }

      const mediaItems = [
        {
          id: createId(),
          title: 'Introduction to Sant Kabir\'s Teachings',
          description: 'A comprehensive introduction to the spiritual philosophy and teachings of Sant Kabir Das.',
          type: 'audio',
          category: 'Spiritual Discourse',
          tags: JSON.stringify(['introduction', 'philosophy', 'teachings', 'kabir']),
          author: 'Spiritual Teacher',
          duration: '45:30',
          file_size: 52428800, // 50MB
          mime_type: 'audio/mpeg',
          r2_key: 'sample/kabir-teachings-intro.mp3',
          r2_bucket: 'kabir-media',
          featured: 1,
          published: 1,
          views: 125,
          downloads: 34,
          likes: 28,
          language: 'en',
          uploaded_by: adminUser.id,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      for (const media of mediaItems) {
        try {
          const existing = await this.db.prepare(
            'SELECT id FROM media WHERE r2_key = ? LIMIT 1'
          ).bind(media.r2_key).first();

          if (!existing) {
            await this.db.prepare(`
              INSERT INTO media (
                id, title, description, type, category, tags, author, duration,
                file_size, mime_type, r2_key, r2_bucket, featured, published,
                views, downloads, likes, language, uploaded_by, published_at,
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(...Object.values(media)).run();

            result.inserted++;
          } else {
            result.skipped++;
          }
        } catch (error) {
          result.errors.push(`Media ${media.title}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return result;
  }

  /**
   * Seed newsletters table
   */
  private async seedNewsletters(environment: string) {
    const result = { inserted: 0, skipped: 0, errors: [] as string[] };

    // Only add sample newsletters in development
    if (environment === 'development') {
      const newsletters = [
        {
          id: createId(),
          email: 'subscriber@example.com',
          name: 'Spiritual Seeker',
          language: 'en',
          status: 'active',
          source: 'website',
          interests: JSON.stringify(['teachings', 'events', 'quotes']),
          verified: 1,
          unsubscribe_token: createId(),
          subscribed_at: new Date().toISOString()
        }
      ];

      for (const newsletter of newsletters) {
        try {
          const existing = await this.db.prepare(
            'SELECT id FROM newsletters WHERE email = ? LIMIT 1'
          ).bind(newsletter.email).first();

          if (!existing) {
            await this.db.prepare(`
              INSERT INTO newsletters (
                id, email, name, language, status, source, interests,
                verified, unsubscribe_token, subscribed_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(...Object.values(newsletter)).run();

            result.inserted++;
          } else {
            result.skipped++;
          }
        } catch (error) {
          result.errors.push(`Newsletter ${newsletter.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    }

    return result;
  }

  /**
   * Clear all data from tables (for testing)
   */
  async clearAll(): Promise<void> {
    const tables = [
      'analytics', 'sessions', 'contact_messages', 'comments',
      'newsletters', 'quotes', 'media', 'event_registrations',
      'events', 'teachings', 'users'
    ];

    for (const table of tables) {
      try {
        await this.db.exec(`DELETE FROM ${table};`);
        logger.info(`Cleared table: ${table}`, {
          component: 'database-seeder'
        });
      } catch (error) {
        logger.warn(`Failed to clear table ${table}`, {
          error: error instanceof Error ? error.message : String(error),
          component: 'database-seeder'
        });
      }
    }
  }
}

// Global seeder instance
export const databaseSeeder = new DatabaseSeeder();

// Export utility functions
export async function seedDatabase(environment: 'development' | 'production' = 'development'): Promise<SeedResult> {
  return databaseSeeder.seed(environment);
}

export async function clearDatabase(): Promise<void> {
  return databaseSeeder.clearAll();
}