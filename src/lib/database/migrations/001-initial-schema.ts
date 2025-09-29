import { Migration } from '../migration-manager';

export const initialSchemaMigration: Migration = {
  id: '001-initial-schema',
  name: 'initial_schema',
  version: '1.0.0',
  description: 'Create initial database schema with all required tables',
  createdAt: '2024-01-01T00:00:00.000Z',

  async up(db: any): Promise<void> {
    // Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        avatar TEXT,
        bio TEXT,
        language TEXT NOT NULL DEFAULT 'en',
        email_verified INTEGER DEFAULT 0,
        newsletter INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users(email);
    `);

    // Teachings table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS teachings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        tags TEXT,
        author TEXT NOT NULL,
        published INTEGER DEFAULT 0,
        featured INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        language TEXT NOT NULL DEFAULT 'en',
        translation_of TEXT,
        cover_image TEXT,
        reading_time INTEGER,
        published_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS slug_idx ON teachings(slug);
      CREATE INDEX IF NOT EXISTS category_idx ON teachings(category);
      CREATE INDEX IF NOT EXISTS published_idx ON teachings(published);
    `);

    // Events table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        location TEXT,
        virtual_link TEXT,
        max_attendees INTEGER,
        current_attendees INTEGER DEFAULT 0,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        timezone TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
        featured INTEGER DEFAULT 0,
        published INTEGER DEFAULT 0,
        registration_required INTEGER DEFAULT 1,
        registration_deadline TEXT,
        category TEXT NOT NULL,
        tags TEXT,
        cover_image TEXT,
        organizer TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
      CREATE INDEX IF NOT EXISTS events_date_idx ON events(start_date);
      CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
    `);

    // Event registrations table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        user_id TEXT,
        guest_name TEXT,
        guest_email TEXT,
        phone TEXT,
        special_requests TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        attendance_status TEXT DEFAULT 'pending',
        registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS event_user_idx ON event_registrations(event_id, user_id);
      CREATE UNIQUE INDEX IF NOT EXISTS event_guest_idx ON event_registrations(event_id, guest_email);
    `);

    // Media table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        tags TEXT,
        author TEXT NOT NULL,
        duration TEXT,
        file_size INTEGER,
        mime_type TEXT,
        r2_key TEXT NOT NULL,
        r2_bucket TEXT NOT NULL DEFAULT 'kabir-media',
        thumbnail_key TEXT,
        streaming_url TEXT,
        download_url TEXT,
        transcription TEXT,
        featured INTEGER DEFAULT 0,
        published INTEGER DEFAULT 0,
        views INTEGER DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        language TEXT NOT NULL DEFAULT 'en',
        uploaded_by TEXT NOT NULL,
        published_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
      );
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS media_type_idx ON media(type);
      CREATE INDEX IF NOT EXISTS media_category_idx ON media(category);
      CREATE UNIQUE INDEX IF NOT EXISTS media_r2_key_idx ON media(r2_key);
    `);

    // Quotes table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        translation TEXT,
        author TEXT NOT NULL DEFAULT 'Sant Kabir Das',
        source TEXT,
        category TEXT NOT NULL,
        tags TEXT,
        language TEXT NOT NULL DEFAULT 'hi',
        featured INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1,
        display_date TEXT,
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS quotes_category_idx ON quotes(category);
      CREATE INDEX IF NOT EXISTS quotes_date_idx ON quotes(display_date);
      CREATE INDEX IF NOT EXISTS quotes_language_idx ON quotes(language);
    `);

    // Newsletters table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS newsletters (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        language TEXT NOT NULL DEFAULT 'en',
        status TEXT NOT NULL DEFAULT 'active',
        source TEXT NOT NULL DEFAULT 'website',
        interests TEXT,
        verified INTEGER DEFAULT 0,
        verification_token TEXT,
        unsubscribe_token TEXT NOT NULL,
        last_email_sent TEXT,
        emails_sent INTEGER DEFAULT 0,
        subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at TEXT
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx ON newsletters(email);
      CREATE UNIQUE INDEX IF NOT EXISTS newsletter_token_idx ON newsletters(unsubscribe_token);
    `);

    // Comments table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        author_website TEXT,
        user_id TEXT,
        parent_id TEXT,
        resource_type TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        ip_address TEXT,
        user_agent TEXT,
        spam INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS comments_resource_idx ON comments(resource_type, resource_id);
      CREATE INDEX IF NOT EXISTS comments_parent_idx ON comments(parent_id);
      CREATE INDEX IF NOT EXISTS comments_status_idx ON comments(status);
    `);

    // Contact messages table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'general',
        priority TEXT NOT NULL DEFAULT 'normal',
        status TEXT NOT NULL DEFAULT 'new',
        language TEXT NOT NULL DEFAULT 'en',
        source TEXT NOT NULL DEFAULT 'website',
        ip_address TEXT,
        user_agent TEXT,
        responded INTEGER DEFAULT 0,
        response_date TEXT,
        assigned_to TEXT,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assigned_to) REFERENCES users(id)
      );
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS contact_status_idx ON contact_messages(status);
      CREATE INDEX IF NOT EXISTS contact_category_idx ON contact_messages(category);
      CREATE INDEX IF NOT EXISTS contact_email_idx ON contact_messages(email);
    `);

    // Sessions table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        refresh_token TEXT UNIQUE,
        expires_at TEXT NOT NULL,
        refresh_expires_at TEXT,
        ip_address TEXT,
        user_agent TEXT,
        last_activity TEXT DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS session_token_idx ON sessions(token);
      CREATE INDEX IF NOT EXISTS session_user_idx ON sessions(user_id);
    `);

    // Analytics table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        event TEXT NOT NULL,
        resource_type TEXT,
        resource_id TEXT,
        user_id TEXT,
        session_id TEXT,
        ip_address TEXT,
        user_agent TEXT,
        referrer TEXT,
        country TEXT,
        region TEXT,
        city TEXT,
        device TEXT,
        browser TEXT,
        os TEXT,
        language TEXT,
        metadata TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await db.exec(`
      CREATE INDEX IF NOT EXISTS analytics_event_idx ON analytics(event);
      CREATE INDEX IF NOT EXISTS analytics_resource_idx ON analytics(resource_type, resource_id);
      CREATE INDEX IF NOT EXISTS analytics_timestamp_idx ON analytics(timestamp);
    `);
  },

  async down(db: any): Promise<void> {
    // Drop tables in reverse dependency order
    await db.exec('DROP TABLE IF EXISTS analytics;');
    await db.exec('DROP TABLE IF EXISTS sessions;');
    await db.exec('DROP TABLE IF EXISTS contact_messages;');
    await db.exec('DROP TABLE IF EXISTS comments;');
    await db.exec('DROP TABLE IF EXISTS newsletters;');
    await db.exec('DROP TABLE IF EXISTS quotes;');
    await db.exec('DROP TABLE IF EXISTS media;');
    await db.exec('DROP TABLE IF EXISTS event_registrations;');
    await db.exec('DROP TABLE IF EXISTS events;');
    await db.exec('DROP TABLE IF EXISTS teachings;');
    await db.exec('DROP TABLE IF EXISTS users;');
  }
};