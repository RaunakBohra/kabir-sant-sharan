-- Initial database schema for Kabir Sant Sharan application
-- Compatible with D1 SQLite

-- Users table
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

CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users(email);

-- Sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  refresh_token TEXT UNIQUE,
  expires_at TEXT NOT NULL,
  refresh_expires_at TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS session_token_idx ON sessions(token);
CREATE INDEX IF NOT EXISTS session_user_idx ON sessions(user_id);

-- Teachings table
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
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS slug_idx ON teachings(slug);
CREATE INDEX IF NOT EXISTS teachings_published_idx ON teachings(published);
CREATE INDEX IF NOT EXISTS teachings_category_idx ON teachings(category);

-- Events table
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
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_idx ON events(slug);
CREATE INDEX IF NOT EXISTS events_published_idx ON events(published);
CREATE INDEX IF NOT EXISTS events_start_date_idx ON events(start_date);

-- Event registrations table
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
  FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS event_user_idx ON event_registrations(event_id, user_id);
CREATE UNIQUE INDEX IF NOT EXISTS event_guest_idx ON event_registrations(event_id, guest_email);

-- Media table
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
  file_format TEXT,
  r2_key TEXT NOT NULL,
  streaming_url TEXT,
  download_url TEXT,
  thumbnail_url TEXT,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  language TEXT NOT NULL DEFAULT 'en',
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS media_type_idx ON media(type);
CREATE INDEX IF NOT EXISTS media_category_idx ON media(category);
CREATE INDEX IF NOT EXISTS media_published_idx ON media(published);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  language TEXT NOT NULL DEFAULT 'en',
  interests TEXT,
  source TEXT,
  subscribed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TEXT,
  last_email_sent TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_status_idx ON newsletter_subscribers(status);

-- Analytics/metrics table for performance tracking
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  ip_address TEXT,
  country TEXT,
  session_id TEXT,
  user_id TEXT,
  viewed_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS page_views_path_idx ON page_views(page_path);
CREATE INDEX IF NOT EXISTS page_views_date_idx ON page_views(viewed_at);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
  id TEXT PRIMARY KEY,
  page_path TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value REAL NOT NULL,
  user_agent TEXT,
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS perf_metrics_path_idx ON performance_metrics(page_path);
CREATE INDEX IF NOT EXISTS perf_metrics_name_idx ON performance_metrics(metric_name);