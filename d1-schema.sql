-- Kabir Sant Sharan D1 Database Schema
-- SQLite/D1 compatible version

-- 1. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  published_at TEXT DEFAULT (datetime('now')),
  category TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  end_date TEXT,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  registration_required INTEGER DEFAULT 0,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  featured_image TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 3. Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Sant Kabir Das',
  language TEXT NOT NULL DEFAULT 'en',
  category TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 4. Media Content Table
CREATE TABLE IF NOT EXISTS media_content (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'audio', 'video', 'document'
  duration INTEGER, -- in seconds
  category TEXT NOT NULL,
  uploaded_at TEXT DEFAULT (datetime('now')),
  featured_image TEXT
);

-- 5. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'member',
  joined_at TEXT DEFAULT (datetime('now')),
  preferences TEXT DEFAULT '{"language": "en", "emailNotifications": true, "eventReminders": true, "newsletter": true}'
);

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TEXT DEFAULT (datetime('now')),
  is_active INTEGER DEFAULT 1,
  preferences TEXT DEFAULT '{"teachings": true, "events": true, "meditation": true}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 7. Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft', -- 'draft', 'sent', 'scheduled'
  sent_at TEXT,
  scheduled_for TEXT,
  recipients INTEGER DEFAULT 0,
  opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  segment TEXT DEFAULT 'all', -- 'all', 'teachings', 'events', 'meditation'
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 8. Analytics Page Views Table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  page TEXT NOT NULL,
  title TEXT,
  visitor_id TEXT,
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TEXT DEFAULT (datetime('now'))
);

-- 9. Analytics Visitors Table
CREATE TABLE IF NOT EXISTS analytics_visitors (
  id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
  visitor_id TEXT UNIQUE NOT NULL,
  session_id TEXT,
  first_visit TEXT DEFAULT (datetime('now')),
  last_visit TEXT DEFAULT (datetime('now')),
  page_views INTEGER DEFAULT 1,
  total_duration INTEGER DEFAULT 0, -- in seconds
  referrer TEXT,
  country TEXT,
  device_type TEXT,
  browser TEXT
);

-- 6. Insert Sample Data
INSERT OR IGNORE INTO quotes (text, author, language, category) VALUES
('जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।', 'Sant Kabir Das', 'ne', 'wisdom'),
('दो कोस प्यार के, ना मिल तो क्या गम? मन दीपक जलाइए, यदि सुमिरन केर नाम।', 'Sant Kabir Das', 'ne', 'devotion'),
('Truth is one, the wise call it by many names.', 'Sant Kabir Das', 'en', 'truth'),
('The path of love is not about finding the perfect person, but about finding the divine in every soul.', 'Sant Kabir Das', 'en', 'wisdom'),
('माला फेरत जुग भया, फिरा न मन का फेर। कर का मन का डार दे, मन का मन का फेर।', 'Sant Kabir Das', 'ne', 'meditation'),
('Love is the bridge between two hearts, and the divine is the river that flows beneath.', 'Sant Kabir Das', 'en', 'devotion');

-- Add some sample events
INSERT OR IGNORE INTO events (title, description, date, location, type, slug) VALUES
('Weekly Satsang', 'Join us for our weekly gathering of spiritual seekers. We will sing bhajans, share teachings, and meditate together.', '2024-10-06 18:00:00', 'Main Hall, Kabir Ashram', 'satsang', 'weekly-satsang-oct-6'),
('Kabir Jayanti Celebration', 'Celebrate the birth anniversary of Sant Kabir Das with special programs, devotional singing, and community feast.', '2024-10-24 10:00:00', 'Kabir Ashram Grounds', 'festival', 'kabir-jayanti-2024'),
('Meditation Workshop', 'Learn the fundamentals of meditation and inner contemplation as taught in Kabir''s philosophy.', '2024-11-10 14:00:00', 'Meditation Hall', 'workshop', 'meditation-workshop-nov-10');

-- Add sample blog posts for the dynamic routes
INSERT OR IGNORE INTO blog_posts (id, title, content, excerpt, author, category, tags, slug) VALUES
('1', 'The Path of Inner Truth: Understanding Kabir''s Philosophy', 'Sant Kabir Das, the 15th-century mystic poet and saint, revolutionized spiritual thought with his profound teachings on inner truth and self-realization...', 'Explore Sant Kabir''s revolutionary teachings on inner truth and self-realization.', 'Sant Kabir Das', 'Philosophy', '["truth", "philosophy", "self-realization"]', '1'),
('2', 'Unity in Diversity: The Universal Message of Love', 'Sant Kabir Das emerged during a time of religious conflict and social division in medieval India. His revolutionary message of unity transcended the boundaries...', 'Discover how Kabir''s message of unity transcends religious and social boundaries.', 'Sant Kabir Das', 'Unity', '["unity", "love", "religion", "oneness"]', '2');

-- Sample newsletter subscribers
INSERT OR IGNORE INTO newsletter_subscribers (email, name, preferences) VALUES
('devotee1@example.com', 'Ram Krishna', '{"teachings": true, "events": true, "meditation": false}'),
('seeker2@example.com', 'Maya Devi', '{"teachings": true, "events": false, "meditation": true}'),
('spiritual.path@example.com', 'Hari Om', '{"teachings": true, "events": true, "meditation": true}');

-- Sample newsletter campaigns
INSERT OR IGNORE INTO newsletter_campaigns (subject, content, status, sent_at, recipients, opens, clicks, segment) VALUES
('Weekly Teachings: Path of Divine Love', 'This week we explore Kabir''s teachings on divine love and selfless devotion...', 'sent', '2024-09-22 09:00:00', 1247, 832, 234, 'all'),
('Upcoming Satsang: Community Gathering', 'Join us for our monthly satsang gathering with devotional singing and spiritual discussions...', 'draft', NULL, 0, 0, 0, 'events');

-- Sample analytics data
INSERT OR IGNORE INTO analytics_page_views (page, title, visitor_id, viewed_at) VALUES
('/', 'Home', 'visitor_001', datetime('now', '-2 hours')),
('/teachings', 'Teachings', 'visitor_001', datetime('now', '-1 hour')),
('/teachings/path-of-divine-love', 'Path of Divine Love', 'visitor_002', datetime('now', '-30 minutes')),
('/events', 'Events', 'visitor_003', datetime('now', '-10 minutes')),
('/media', 'Media', 'visitor_002', datetime('now', '-5 minutes'));

INSERT OR IGNORE INTO analytics_visitors (visitor_id, page_views, referrer, device_type) VALUES
('visitor_001', 5, 'https://google.com', 'desktop'),
('visitor_002', 3, 'https://facebook.com', 'mobile'),
('visitor_003', 2, 'direct', 'tablet');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS quotes_language_idx ON quotes(language);
CREATE INDEX IF NOT EXISTS quotes_category_idx ON quotes(category);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_campaigns_status_idx ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS analytics_page_views_page_idx ON analytics_page_views(page);
CREATE INDEX IF NOT EXISTS analytics_page_views_viewed_at_idx ON analytics_page_views(viewed_at);
CREATE INDEX IF NOT EXISTS analytics_visitors_visitor_id_idx ON analytics_visitors(visitor_id);