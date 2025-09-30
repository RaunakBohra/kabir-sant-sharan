-- Migration: Add newsletter_campaigns table
-- Date: 2025-09-30
-- Purpose: Add table for managing newsletter campaigns

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  segment TEXT NOT NULL DEFAULT 'all',
  scheduled_for TEXT,
  sent_at TEXT,
  recipients INTEGER DEFAULT 0,
  opens INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  bounces INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  created_by TEXT NOT NULL REFERENCES users(id),
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS campaign_status_idx ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS campaign_sent_at_idx ON newsletter_campaigns(sent_at);