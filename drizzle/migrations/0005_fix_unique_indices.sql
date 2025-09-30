-- Migration: Fix incorrect UNIQUE indices
-- Date: 2025-09-30
-- Purpose: Remove UNIQUE constraint from indices that should allow duplicates

-- Drop incorrect unique indices from blog_posts table (D1 uses old name)
DROP INDEX IF EXISTS blog_posts_category_idx;
DROP INDEX IF EXISTS category_idx;
DROP INDEX IF EXISTS published_idx;

-- Drop incorrect unique indices from events table
DROP INDEX IF EXISTS events_date_idx;
DROP INDEX IF EXISTS events_category_idx;

-- Drop incorrect unique indices from quotes table
DROP INDEX IF EXISTS quotes_category_idx;
DROP INDEX IF EXISTS quotes_date_idx;
DROP INDEX IF EXISTS quotes_language_idx;

-- Recreate as regular (non-unique) indices for blog_posts (D1)
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

-- Regular indices for events
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Regular indices for quotes
CREATE INDEX IF NOT EXISTS idx_quotes_category ON quotes(category);
CREATE INDEX IF NOT EXISTS idx_quotes_display_date ON quotes(display_date);
CREATE INDEX IF NOT EXISTS idx_quotes_language ON quotes(language);