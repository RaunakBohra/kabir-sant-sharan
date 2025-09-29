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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);
CREATE INDEX IF NOT EXISTS quotes_language_idx ON quotes(language);
CREATE INDEX IF NOT EXISTS quotes_category_idx ON quotes(category);