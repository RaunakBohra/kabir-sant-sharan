-- Migration: Add trash system with 30-day recovery
-- Date: 2025-09-30

-- Add deleted_at column to content tables for soft delete
ALTER TABLE teachings ADD COLUMN deleted_at TEXT;
ALTER TABLE events ADD COLUMN deleted_at TEXT;
ALTER TABLE media ADD COLUMN deleted_at TEXT;
ALTER TABLE newsletters ADD COLUMN deleted_at TEXT;

-- Create indexes for efficient trash queries
CREATE INDEX IF NOT EXISTS idx_teachings_deleted_at ON teachings(deleted_at);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at);
CREATE INDEX IF NOT EXISTS idx_media_deleted_at ON media(deleted_at);
CREATE INDEX IF NOT EXISTS idx_newsletters_deleted_at ON newsletters(deleted_at);

-- Create trash audit table for tracking deleted items and recovery
CREATE TABLE IF NOT EXISTS trash (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_data TEXT NOT NULL,
  deleted_by TEXT NOT NULL REFERENCES users(id),
  deleted_at TEXT NOT NULL,
  scheduled_purge_at TEXT NOT NULL,
  restored_at TEXT,
  restored_by TEXT REFERENCES users(id)
);

-- Create indexes for trash table
CREATE INDEX IF NOT EXISTS idx_trash_scheduled_purge ON trash(scheduled_purge_at);
CREATE INDEX IF NOT EXISTS idx_trash_content_type_id ON trash(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_trash_deleted_by ON trash(deleted_by);