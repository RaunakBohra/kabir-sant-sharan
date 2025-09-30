-- Migration: Synchronize D1 schema with local schema
-- Date: 2025-09-30
-- Purpose: Add missing columns to D1 tables to match drizzle/schema.ts

-- ============================================
-- 1. QUOTES TABLE - Add missing columns
-- ============================================

-- Rename 'text' to 'content' (SQLite doesn't support ALTER COLUMN, need to recreate)
CREATE TABLE quotes_new (
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
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

-- Copy data from old table (text -> content)
INSERT INTO quotes_new (id, content, author, language, category, created_at, deleted_at)
SELECT id, text, author, language, category, created_at, deleted_at FROM quotes;

-- Drop old table and rename new one
DROP TABLE quotes;
ALTER TABLE quotes_new RENAME TO quotes;

-- Recreate indexes (non-unique for category, language)
CREATE INDEX IF NOT EXISTS quotes_category_idx ON quotes(category);
CREATE INDEX IF NOT EXISTS quotes_date_idx ON quotes(display_date);
CREATE INDEX IF NOT EXISTS quotes_language_idx ON quotes(language);
CREATE INDEX IF NOT EXISTS idx_quotes_deleted_at ON quotes(deleted_at);

-- ============================================
-- 2. BLOG_POSTS TABLE - Add missing columns
-- ============================================

ALTER TABLE blog_posts ADD COLUMN published INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN featured INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN views INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN likes INTEGER DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN language TEXT NOT NULL DEFAULT 'en';
ALTER TABLE blog_posts ADD COLUMN translation_of TEXT;
ALTER TABLE blog_posts ADD COLUMN reading_time INTEGER;

-- Rename featured_image to cover_image (need to recreate)
CREATE TABLE blog_posts_new (
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
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Copy data
INSERT INTO blog_posts_new
SELECT
  id, title, content, excerpt, slug, category,
  CASE WHEN tags = '[]' THEN NULL ELSE tags END as tags,
  author,
  published, featured, views, likes, language, translation_of,
  featured_image as cover_image,
  reading_time, published_at, deleted_at, created_at, updated_at
FROM blog_posts;

DROP TABLE blog_posts;
ALTER TABLE blog_posts_new RENAME TO blog_posts;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS blog_posts_category_idx ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_deleted_at ON blog_posts(deleted_at);

-- ============================================
-- 3. EVENTS TABLE - Add missing columns & rename
-- ============================================

-- Need to recreate to rename 'date' to 'start_date' and 'featured_image' to 'cover_image'
CREATE TABLE events_new (
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
  end_date TEXT,
  start_time TEXT NOT NULL DEFAULT '00:00',
  end_time TEXT NOT NULL DEFAULT '23:59',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  registration_required INTEGER DEFAULT 1,
  registration_deadline TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT,
  cover_image TEXT,
  organizer TEXT NOT NULL DEFAULT 'Kabir Sant Sharan',
  language TEXT NOT NULL DEFAULT 'en',
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Copy data from old events table
INSERT INTO events_new
SELECT
  id, title, description, slug, type, location,
  NULL as virtual_link,
  max_attendees, current_attendees,
  date as start_date,
  end_date,
  '00:00' as start_time,
  '23:59' as end_time,
  'Asia/Kathmandu' as timezone,
  0 as featured,
  1 as published,
  registration_required,
  NULL as registration_deadline,
  'General' as category,
  NULL as tags,
  featured_image as cover_image,
  'Kabir Sant Sharan' as organizer,
  'en' as language,
  deleted_at, created_at, updated_at
FROM events;

DROP TABLE events;
ALTER TABLE events_new RENAME TO events;

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(start_date);
CREATE INDEX IF NOT EXISTS events_category_idx ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);

-- ============================================
-- Update existing data with better defaults
-- ============================================

-- Set published flag for existing blog posts
UPDATE blog_posts SET published = 1 WHERE published_at IS NOT NULL;

-- Set reading time for existing posts (estimate: 200 words/min)
UPDATE blog_posts SET reading_time =
  CASE
    WHEN LENGTH(content) > 0 THEN MAX(1, LENGTH(content) / 1000)
    ELSE 3
  END
WHERE reading_time IS NULL;