# Database Schema Guide

**Complete visual reference of your Kabir Sant Sharan database structure**

---

## Overview

Your database contains **14 tables** organized into 4 categories:

1. **Content Tables** (4) - Public-facing content
2. **User & Community Tables** (5) - User data and interactions
3. **System Tables** (4) - Behind-the-scenes functionality
4. **Utility Tables** (1) - Trash/recovery

**Total estimated size:** ~128KB (will grow with content)

---

## Table Relationships Diagram

```
USERS ────────────────┐
  │                    │
  │ (created_by)       │ (user_id)
  │                    │
  ├──→ TEACHINGS       ├──→ EVENT_REGISTRATIONS
  ├──→ EVENTS          │         │
  ├──→ MEDIA           │         │ (event_id)
  ├──→ NEWSLETTER_     │         ↓
  │    CAMPAIGNS       └──────→ EVENTS
  │
  │ (user_id)
  ├──→ SESSIONS
  ├──→ COMMENTS
  └──→ ANALYTICS

COMMENTS ──(resource_id)──→ TEACHINGS / EVENTS / QUOTES

TRASH ──(content_id)──→ Any deleted content
```

---

## 1. Content Tables

### 1.1 teachings

**Purpose:** Sant Kabir's teachings, articles, spiritual wisdom

**Schema:**
```
teachings
├── id                  TEXT PRIMARY KEY
├── title              TEXT NOT NULL
├── content            TEXT NOT NULL (main teaching text)
├── excerpt            TEXT NOT NULL (summary)
├── slug               TEXT UNIQUE NOT NULL (URL-friendly)
├── category           TEXT NOT NULL
├── tags               TEXT (comma-separated)
├── author             TEXT NOT NULL
├── published          INTEGER (0=draft, 1=live)
├── featured           INTEGER (0=no, 1=yes)
├── views              INTEGER (page views)
├── likes              INTEGER (favorites)
├── language           TEXT (en/ne)
├── translation_of     TEXT (links to original)
├── cover_image        TEXT (image URL)
├── reading_time       INTEGER (minutes)
├── published_at       TEXT (timestamp)
├── deleted_at         TEXT (soft delete)
├── created_at         TEXT DEFAULT CURRENT_TIMESTAMP
└── updated_at         TEXT DEFAULT CURRENT_TIMESTAMP

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on slug
- INDEX on deleted_at
- INDEX on category
- INDEX on published
```

**Relationships:**
- `author` → may link to `users.name` (but stored as text for flexibility)
- Referenced by `comments.resource_id` when `resource_type = 'teaching'`
- Referenced by `analytics.resource_id` when `resource_type = 'teaching'`

**Example Record:**
```sql
id: teach-001
title: Path to Enlightenment
content: (long text)
excerpt: Discover the spiritual journey...
slug: path-to-enlightenment
category: spirituality
author: Sant Kabir Das
published: 1
views: 342
language: en
```

---

### 1.2 events

**Purpose:** Spiritual events, meditation sessions, workshops, satsangs

**Schema:**
```
events
├── id                      TEXT PRIMARY KEY
├── title                   TEXT NOT NULL
├── description             TEXT NOT NULL
├── slug                    TEXT UNIQUE NOT NULL
├── type                    TEXT (online/in-person/hybrid)
├── location                TEXT (physical address)
├── virtual_link            TEXT (Zoom/Meet URL)
├── max_attendees           INTEGER (capacity)
├── current_attendees       INTEGER (registered count)
├── start_date              TEXT (YYYY-MM-DD)
├── end_date                TEXT
├── start_time              TEXT (HH:MM)
├── end_time                TEXT
├── timezone                TEXT DEFAULT 'Asia/Kathmandu'
├── featured                INTEGER (0/1)
├── published               INTEGER (0/1)
├── registration_required   INTEGER (0/1)
├── registration_deadline   TEXT
├── category                TEXT
├── tags                    TEXT
├── cover_image             TEXT
├── organizer               TEXT
├── language                TEXT
├── deleted_at              TEXT
├── created_at              TEXT
└── updated_at              TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on slug
- INDEX on deleted_at
- INDEX on start_date
- INDEX on category
```

**Relationships:**
- Referenced by `event_registrations.event_id`
- Referenced by `comments.resource_id` when `resource_type = 'event'`

**Example Record:**
```sql
id: event-001
title: Meditation Workshop
type: online
virtual_link: https://zoom.us/j/123456789
max_attendees: 50
current_attendees: 23
start_date: 2025-10-15
start_time: 18:00
```

---

### 1.3 quotes

**Purpose:** Daily inspirational quotes from Sant Kabir Das

**Schema:**
```
quotes
├── id              TEXT PRIMARY KEY
├── content         TEXT NOT NULL (original language)
├── translation     TEXT (English translation)
├── author          TEXT DEFAULT 'Sant Kabir Das'
├── source          TEXT (book/scripture reference)
├── category        TEXT NOT NULL
├── tags            TEXT
├── language        TEXT (hi/ne)
├── featured        INTEGER (0/1)
├── active          INTEGER (0/1 visible)
├── display_date    TEXT (scheduled date)
├── views           INTEGER
├── likes           INTEGER
├── created_at      TEXT
└── updated_at      TEXT

INDEXES:
- PRIMARY KEY on id
```

**Example Record:**
```sql
id: quote-001
content: बुरा जो देखन मैं चला, बुरा न मिलिया कोय।
translation: I went searching for the wicked, I found none wicked but me.
category: wisdom
language: hi
active: 1
```

---

### 1.4 media

**Purpose:** Audio bhajans, video discourses, spiritual media

**Schema:**
```
media
├── id                TEXT PRIMARY KEY
├── title            TEXT NOT NULL
├── description      TEXT NOT NULL
├── type             TEXT (audio/video/image)
├── category         TEXT
├── tags             TEXT
├── author           TEXT (artist/speaker)
├── duration         TEXT (HH:MM:SS)
├── file_size        INTEGER (bytes)
├── mime_type        TEXT
├── r2_key           TEXT (Cloudflare R2 storage key)
├── r2_bucket        TEXT DEFAULT 'kabir-media'
├── thumbnail_key    TEXT
├── streaming_url    TEXT
├── download_url     TEXT
├── transcription    TEXT (accessibility)
├── featured         INTEGER
├── published        INTEGER
├── views            INTEGER (play count)
├── downloads        INTEGER
├── likes            INTEGER
├── language         TEXT
├── uploaded_by      TEXT → users.id
├── published_at     TEXT
├── deleted_at       TEXT
├── created_at       TEXT
└── updated_at       TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on type
- UNIQUE INDEX on category
- UNIQUE INDEX on r2_key
- FOREIGN KEY uploaded_by → users.id
```

**Relationships:**
- `uploaded_by` → `users.id`

---

## 2. User & Community Tables

### 2.1 users

**Purpose:** Registered community members and administrators

**Schema:**
```
users
├── id               TEXT PRIMARY KEY
├── email            TEXT UNIQUE NOT NULL
├── name             TEXT NOT NULL
├── role             TEXT DEFAULT 'member' (admin/member/moderator)
├── avatar           TEXT (profile image URL)
├── bio              TEXT
├── language         TEXT DEFAULT 'en'
├── email_verified   INTEGER (0/1)
├── newsletter       INTEGER (0/1 subscribed)
├── password_hash    TEXT (encrypted)
├── created_at       TEXT
└── updated_at       TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on email
```

**Relationships:**
- Referenced by `sessions.user_id`
- Referenced by `comments.user_id`
- Referenced by `event_registrations.user_id`
- Referenced by `media.uploaded_by`
- Referenced by `newsletter_campaigns.created_by`

**Example Record:**
```sql
id: admin-YWR0aW5A
email: admin@kabirsantsharan.com
name: Administrator
role: admin
```

---

### 2.2 event_registrations

**Purpose:** Track who registered for which event

**Schema:**
```
event_registrations
├── id                   TEXT PRIMARY KEY
├── event_id             TEXT → events.id
├── user_id              TEXT → users.id (NULL for guests)
├── guest_name           TEXT (if not logged in)
├── guest_email          TEXT (if not logged in)
├── phone                TEXT
├── special_requests     TEXT
├── status               TEXT (confirmed/cancelled/waitlist)
├── attendance_status    TEXT (pending/attended/no-show)
└── registered_at        TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on (event_id, user_id)
- UNIQUE INDEX on (event_id, guest_email)
- FOREIGN KEY event_id → events.id (CASCADE DELETE)
- FOREIGN KEY user_id → users.id (CASCADE DELETE)
```

**Relationships:**
- `event_id` → `events.id` (if event deleted, registrations deleted)
- `user_id` → `users.id` (if user deleted, their registrations deleted)

---

### 2.3 newsletters

**Purpose:** Newsletter subscribers (separate from full users)

**Schema:**
```
newsletters
├── id                   TEXT PRIMARY KEY
├── email                TEXT UNIQUE NOT NULL
├── name                 TEXT
├── language             TEXT DEFAULT 'en'
├── status               TEXT (active/unsubscribed/bounced)
├── source               TEXT (website/event/teaching)
├── interests            TEXT (topic preferences)
├── verified             INTEGER (email verified)
├── verification_token   TEXT
├── unsubscribe_token    TEXT UNIQUE
├── last_email_sent      TEXT
├── emails_sent          INTEGER
├── subscribed_at        TEXT
└── unsubscribed_at      TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on email
- UNIQUE INDEX on unsubscribe_token
```

---

### 2.4 newsletter_campaigns

**Purpose:** Sent newsletters and their analytics

**Schema:**
```
newsletter_campaigns
├── id               TEXT PRIMARY KEY
├── subject          TEXT NOT NULL
├── content          TEXT (HTML email body)
├── status           TEXT (draft/scheduled/sent/failed)
├── segment          TEXT (all/teachings/events/meditation)
├── scheduled_for    TEXT
├── sent_at          TEXT
├── recipients       INTEGER
├── opens            INTEGER
├── clicks           INTEGER
├── bounces          INTEGER
├── unsubscribes     INTEGER
├── created_by       TEXT → users.id
├── created_at       TEXT
└── updated_at       TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on status
- UNIQUE INDEX on sent_at
- FOREIGN KEY created_by → users.id
```

---

### 2.5 comments

**Purpose:** Comments on teachings, events, quotes

**Schema:**
```
comments
├── id               TEXT PRIMARY KEY
├── content          TEXT NOT NULL
├── author_name      TEXT NOT NULL
├── author_email     TEXT NOT NULL
├── author_website   TEXT
├── user_id          TEXT → users.id (if logged in)
├── parent_id        TEXT (for threaded replies)
├── resource_type    TEXT (teaching/event/quote)
├── resource_id      TEXT (points to specific content)
├── status           TEXT (pending/approved/spam/rejected)
├── ip_address       TEXT (security)
├── user_agent       TEXT (browser info)
├── spam             INTEGER (0/1)
├── likes            INTEGER
├── created_at       TEXT
└── updated_at       TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on (resource_type, resource_id)
- UNIQUE INDEX on parent_id
- UNIQUE INDEX on status
- FOREIGN KEY user_id → users.id (CASCADE DELETE)
```

**Relationships:**
- `user_id` → `users.id`
- `resource_id` → dynamic (teachings.id, events.id, quotes.id depending on resource_type)

---

### 2.6 contact_messages

**Purpose:** Messages from contact form

**Schema:**
```
contact_messages
├── id               TEXT PRIMARY KEY
├── name             TEXT NOT NULL
├── email            TEXT NOT NULL
├── phone            TEXT
├── subject          TEXT NOT NULL
├── message          TEXT NOT NULL
├── category         TEXT (general/technical/feedback/content)
├── priority         TEXT (urgent/high/normal/low)
├── status           TEXT (new/read/replied/closed)
├── language         TEXT
├── source           TEXT (website/event)
├── ip_address       TEXT
├── user_agent       TEXT
├── responded        INTEGER (0/1)
├── response_date    TEXT
├── assigned_to      TEXT → users.id
├── notes            TEXT (internal)
├── created_at       TEXT
└── updated_at       TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on status
- UNIQUE INDEX on category
- UNIQUE INDEX on email
- FOREIGN KEY assigned_to → users.id
```

---

## 3. System Tables

### 3.1 sessions

**Purpose:** User login sessions and authentication

**Schema:**
```
sessions
├── id                   TEXT PRIMARY KEY
├── user_id              TEXT → users.id
├── token                TEXT UNIQUE (access token)
├── refresh_token        TEXT UNIQUE
├── expires_at           TEXT
├── refresh_expires_at   TEXT
├── ip_address           TEXT
├── user_agent           TEXT
├── last_activity        TEXT
└── created_at           TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on token
- UNIQUE INDEX on user_id
- FOREIGN KEY user_id → users.id (CASCADE DELETE)
```

**Relationships:**
- `user_id` → `users.id`

---

### 3.2 analytics

**Purpose:** Website usage tracking and statistics

**Schema:**
```
analytics
├── id               TEXT PRIMARY KEY
├── event            TEXT (page_view/click/download)
├── resource_type    TEXT (teaching/event/media)
├── resource_id      TEXT
├── user_id          TEXT → users.id
├── session_id       TEXT
├── ip_address       TEXT
├── user_agent       TEXT
├── referrer         TEXT
├── country          TEXT
├── region           TEXT
├── city             TEXT
├── device           TEXT (mobile/desktop/tablet)
├── browser          TEXT
├── os               TEXT
├── language         TEXT
├── metadata         TEXT (JSON)
└── timestamp        TEXT

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on event
- UNIQUE INDEX on (resource_type, resource_id)
- UNIQUE INDEX on timestamp
- FOREIGN KEY user_id → users.id
```

**Relationships:**
- `user_id` → `users.id`
- `resource_id` → dynamic (teachings.id, events.id, media.id)

---

### 3.3 trash

**Purpose:** Soft-deleted content (recoverable for 30 days)

**Schema:**
```
trash
├── id                   TEXT PRIMARY KEY
├── content_type         TEXT (teaching/event/quote)
├── content_id           TEXT (original ID)
├── content_data         TEXT (JSON of original data)
├── deleted_by           TEXT → users.id
├── deleted_at           TEXT
├── scheduled_purge_at   TEXT (30 days later)
├── restored_at          TEXT
└── restored_by          TEXT → users.id

INDEXES:
- PRIMARY KEY on id
- UNIQUE INDEX on scheduled_purge_at
- UNIQUE INDEX on (content_type, content_id)
- FOREIGN KEY deleted_by → users.id
- FOREIGN KEY restored_by → users.id
```

**Relationships:**
- `deleted_by` → `users.id`
- `restored_by` → `users.id`
- `content_id` → dynamic (original table ID)

---

## Data Type Reference

### TEXT
- Stores any length of text
- Used for strings, dates (ISO format), JSON
- No maximum length in SQLite

### INTEGER
- Whole numbers (-9223372036854775808 to 9223372036854775807)
- Used for IDs, counts, boolean (0/1)

### BOOLEAN (stored as INTEGER)
- `0` = false
- `1` = true
- Examples: `published`, `featured`, `active`

### Date/Time (stored as TEXT)
- Format: `YYYY-MM-DD HH:MM:SS`
- Example: `2025-09-30 14:30:00`
- Use `datetime('now')` for current timestamp

---

## Key Constraints

### PRIMARY KEY
- Unique identifier for each row
- Cannot be NULL
- One per table

### UNIQUE
- Value must be unique across all rows
- Can be NULL (unless also NOT NULL)
- Examples: email, slug, token

### NOT NULL
- Field is required
- Must have a value

### DEFAULT
- Value used if not provided
- Examples: `DEFAULT 'en'`, `DEFAULT 0`, `DEFAULT CURRENT_TIMESTAMP`

### FOREIGN KEY
- Links to another table
- `ON DELETE CASCADE` = delete related records when parent deleted
- Example: `user_id → users.id`

---

## Storage Estimates

| Table | Est. Rows | Est. Size | Growth Rate |
|-------|-----------|-----------|-------------|
| teachings | 100-500 | 10-50 MB | Slow |
| events | 50-200 | 2-10 MB | Medium |
| quotes | 500-1000 | 5-10 MB | Slow |
| media | 50-200 | 5-20 MB | Medium |
| users | 100-5000 | 1-5 MB | Medium |
| event_registrations | 1000+ | 5-20 MB | Fast |
| newsletters | 1000+ | 2-10 MB | Medium |
| comments | 500-5000 | 5-20 MB | Medium |
| analytics | 10,000+ | 50-200 MB | Very Fast |
| sessions | 10-100 | <1 MB | Fast (but cleaned) |

**Total estimated:** 100-350 MB after 1 year of active use

---

## Query Performance Notes

### Indexed Fields (Fast Queries)
- All `id` (PRIMARY KEY)
- `slug` (UNIQUE)
- `email` (UNIQUE)
- `deleted_at`
- `category`
- `published`
- `start_date`

### Non-Indexed Fields (Slower)
- `content` (full-text search is slow)
- `tags` (comma-separated, not optimized)
- `views`, `likes` (but usually filtered after, so OK)

**Tip:** Always use indexed fields in WHERE clauses when possible

---

## Schema Version

**Current Version:** 0004 (as of 2025-09-30)

**Migration Files:**
- `drizzle/migrations/0001_*.sql` - Initial schema
- `drizzle/migrations/0002_*.sql` - Added indexes
- `drizzle/migrations/0003_*.sql` - Added trash table
- `drizzle/migrations/0004_add_newsletter_campaigns.sql` - Added campaigns

---

## Viewing Schema in SQLite

```sql
-- All tables
.tables

-- Specific table
.schema teachings

-- All schemas
.schema

-- Table info
PRAGMA table_info(teachings);

-- Indexes on a table
SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='teachings';

-- Foreign keys
PRAGMA foreign_key_list(event_registrations);
```

---

**This schema is your database blueprint!** Refer to it when writing queries or understanding relationships.