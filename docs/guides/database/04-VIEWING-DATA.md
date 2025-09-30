# Viewing Data - Complete Guide

## What You'll Learn
- How to view data from every table in your database
- Understand what each column means
- Filter and search specific data
- Generate useful reports
- Real-world examples for managing Kabir Sant Sharan

**Time required:** 60-90 minutes

---

## Part 1: Setup

### Open Your Database

```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
sqlite3 local.db
```

### Configure Display Settings

```sql
.mode column
.headers on
.width 15 30 20 10
```

**What this does:**
- Display in aligned columns
- Show column headers
- Set initial column widths

---

## Part 2: Viewing Core Content Tables

### Table 1: Teachings

**What it stores:** Sant Kabir's teachings, articles, and spiritual content

#### View All Teachings

```sql
SELECT * FROM teachings;
```

**Too much data?** Let's view specific columns:

```sql
SELECT
  id,
  title,
  author,
  category,
  published,
  views,
  likes,
  created_at
FROM teachings;
```

#### View Only Published Teachings

```sql
SELECT
  title,
  author,
  excerpt,
  views,
  published_at
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
ORDER BY published_at DESC;
```

#### Teaching Categories

```sql
SELECT DISTINCT category FROM teachings;
```

**Example categories you might have:**
- spirituality
- meditation
- philosophy
- daily-wisdom
- bhakti

#### Most Viewed Teachings

```sql
SELECT
  title,
  category,
  views,
  likes,
  published_at
FROM teachings
WHERE published = 1
ORDER BY views DESC
LIMIT 10;
```

#### Teachings by Language

```sql
SELECT
  language,
  COUNT(*) AS count
FROM teachings
WHERE published = 1
GROUP BY language;
```

**Expected languages:** `en` (English), `ne` (Nepali)

#### Featured Teachings

```sql
SELECT
  title,
  excerpt,
  featured,
  views
FROM teachings
WHERE featured = 1 AND published = 1;
```

#### Full Details of One Teaching

```sql
SELECT * FROM teachings WHERE id = 'teach-001';
```

**Or by slug:**
```sql
SELECT * FROM teachings WHERE slug = 'path-to-enlightenment';
```

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique identifier (e.g., 'teach-001') |
| `title` | TEXT | Teaching headline |
| `content` | TEXT | Full teaching text (can be long!) |
| `excerpt` | TEXT | Short summary (150-200 chars) |
| `slug` | TEXT | URL-friendly name (path-to-enlightenment) |
| `category` | TEXT | Content category |
| `tags` | TEXT | Comma-separated tags |
| `author` | TEXT | Writer's name |
| `published` | INTEGER | 1=live, 0=draft |
| `featured` | INTEGER | 1=featured on homepage |
| `views` | INTEGER | Page view count |
| `likes` | INTEGER | Like/favorite count |
| `language` | TEXT | 'en' or 'ne' |
| `translation_of` | TEXT | ID of original if this is translation |
| `cover_image` | TEXT | Image URL/path |
| `reading_time` | INTEGER | Minutes to read |
| `published_at` | TEXT | When it went live |
| `deleted_at` | TEXT | Soft delete timestamp (NULL=active) |
| `created_at` | TEXT | When created |
| `updated_at` | TEXT | Last modified |

---

### Table 2: Events

**What it stores:** Spiritual events, meditation sessions, workshops, online satsangs

#### View All Upcoming Events

```sql
SELECT
  title,
  type,
  start_date,
  start_time,
  location,
  current_attendees,
  max_attendees
FROM events
WHERE start_date >= date('now')
  AND published = 1
  AND deleted_at IS NULL
ORDER BY start_date ASC, start_time ASC;
```

#### Events by Type

```sql
SELECT
  type,
  COUNT(*) AS event_count
FROM events
WHERE published = 1 AND deleted_at IS NULL
GROUP BY type
ORDER BY event_count DESC;
```

**Example types:**
- online (virtual events)
- in-person (physical gatherings)
- hybrid (both online and in-person)

#### Events with Available Spots

```sql
SELECT
  title,
  start_date,
  current_attendees,
  max_attendees,
  (max_attendees - current_attendees) AS available_spots
FROM events
WHERE published = 1
  AND start_date >= date('now')
  AND current_attendees < max_attendees
ORDER BY start_date;
```

#### Past Events (for reporting)

```sql
SELECT
  title,
  start_date,
  current_attendees,
  type
FROM events
WHERE start_date < date('now')
  AND published = 1
ORDER BY start_date DESC
LIMIT 20;
```

#### Events This Month

```sql
SELECT
  title,
  start_date,
  start_time,
  location,
  type
FROM events
WHERE strftime('%Y-%m', start_date) = strftime('%Y-%m', 'now')
  AND published = 1
ORDER BY start_date;
```

#### Full Event Details

```sql
SELECT * FROM events WHERE id = 'event-001';
```

**Or by slug:**
```sql
SELECT * FROM events WHERE slug = 'meditation-workshop-september';
```

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique identifier |
| `title` | TEXT | Event name |
| `description` | TEXT | Full event description |
| `slug` | TEXT | URL-friendly name |
| `type` | TEXT | online/in-person/hybrid |
| `location` | TEXT | Physical address (if applicable) |
| `virtual_link` | TEXT | Zoom/Meet link for online events |
| `max_attendees` | INTEGER | Maximum capacity |
| `current_attendees` | INTEGER | Current registration count |
| `start_date` | TEXT | Event date (YYYY-MM-DD) |
| `end_date` | TEXT | End date (for multi-day events) |
| `start_time` | TEXT | Start time (HH:MM) |
| `end_time` | TEXT | End time (HH:MM) |
| `timezone` | TEXT | Default: Asia/Kathmandu |
| `featured` | INTEGER | 1=show on homepage |
| `published` | INTEGER | 1=live, 0=draft |
| `registration_required` | INTEGER | 1=requires registration |
| `registration_deadline` | TEXT | Last day to register |
| `category` | TEXT | Event category |
| `tags` | TEXT | Comma-separated tags |
| `cover_image` | TEXT | Event image URL |
| `organizer` | TEXT | Who's organizing |
| `language` | TEXT | Primary language |

---

### Table 3: Event Registrations

**What it stores:** Who registered for which event

#### View All Registrations for an Event

```sql
SELECT
  r.id,
  COALESCE(u.name, r.guest_name) AS attendee_name,
  COALESCE(u.email, r.guest_email) AS email,
  r.phone,
  r.status,
  r.attendance_status,
  r.registered_at
FROM event_registrations r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.event_id = 'event-001'
ORDER BY r.registered_at;
```

**What `COALESCE` does:** Shows user name if registered user, otherwise guest name

#### Count Registrations per Event

```sql
SELECT
  e.title,
  COUNT(r.id) AS registration_count,
  e.max_attendees,
  (e.max_attendees - COUNT(r.id)) AS spots_remaining
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1 AND e.start_date >= date('now')
GROUP BY e.id
ORDER BY e.start_date;
```

#### Recent Registrations

```sql
SELECT
  e.title AS event,
  COALESCE(u.name, r.guest_name) AS attendee,
  r.registered_at
FROM event_registrations r
LEFT JOIN events e ON r.event_id = e.id
LEFT JOIN users u ON r.user_id = u.id
ORDER BY r.registered_at DESC
LIMIT 20;
```

#### Registrations by Status

```sql
SELECT
  status,
  COUNT(*) AS count
FROM event_registrations
GROUP BY status;
```

**Possible statuses:**
- confirmed
- cancelled
- waitlist

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique registration ID |
| `event_id` | TEXT | Links to events table |
| `user_id` | TEXT | Links to users table (NULL for guests) |
| `guest_name` | TEXT | Name if not logged-in user |
| `guest_email` | TEXT | Email if not logged-in user |
| `phone` | TEXT | Contact number |
| `special_requests` | TEXT | Dietary restrictions, accessibility needs |
| `status` | TEXT | confirmed/cancelled/waitlist |
| `attendance_status` | TEXT | pending/attended/no-show |
| `registered_at` | TEXT | When they registered |

---

### Table 4: Quotes

**What it stores:** Daily inspirational quotes from Sant Kabir Das

#### View All Active Quotes

```sql
SELECT
  content,
  translation,
  author,
  category,
  language
FROM quotes
WHERE active = 1
ORDER BY created_at DESC;
```

#### Featured Quotes

```sql
SELECT
  content AS hindi_text,
  translation AS english_text,
  source,
  views,
  likes
FROM quotes
WHERE featured = 1 AND active = 1
ORDER BY likes DESC;
```

#### Quotes by Category

```sql
SELECT
  category,
  COUNT(*) AS quote_count
FROM quotes
WHERE active = 1
GROUP BY category;
```

**Example categories:**
- wisdom
- devotion
- truth
- liberation
- unity

#### Random Quote (for daily quote feature)

```sql
SELECT
  content,
  translation,
  author
FROM quotes
WHERE active = 1
ORDER BY RANDOM()
LIMIT 1;
```

#### Most Popular Quotes

```sql
SELECT
  content,
  translation,
  likes,
  views
FROM quotes
WHERE active = 1
ORDER BY likes DESC, views DESC
LIMIT 10;
```

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique identifier |
| `content` | TEXT | Quote in original language |
| `translation` | TEXT | English translation |
| `author` | TEXT | Default: Sant Kabir Das |
| `source` | TEXT | Book/scripture reference |
| `category` | TEXT | Theme category |
| `tags` | TEXT | Searchable tags |
| `language` | TEXT | Original language (hi/ne) |
| `featured` | INTEGER | 1=show on homepage |
| `active` | INTEGER | 1=visible, 0=hidden |
| `display_date` | TEXT | Scheduled display date |
| `views` | INTEGER | View count |
| `likes` | INTEGER | Like count |

---

### Table 5: Media

**What it stores:** Audio bhajans, video discourses, spiritual music

#### View All Published Media

```sql
SELECT
  title,
  type,
  category,
  duration,
  views,
  downloads,
  published_at
FROM media
WHERE published = 1 AND deleted_at IS NULL
ORDER BY published_at DESC;
```

#### Media by Type

```sql
SELECT
  type,
  COUNT(*) AS count,
  SUM(views) AS total_views
FROM media
WHERE published = 1
GROUP BY type;
```

**Expected types:**
- audio (bhajans, kirtans)
- video (discourses, documentaries)
- image (spiritual art)

#### Most Downloaded Content

```sql
SELECT
  title,
  type,
  downloads,
  views,
  duration
FROM media
WHERE published = 1
ORDER BY downloads DESC
LIMIT 10;
```

#### Featured Media

```sql
SELECT
  title,
  type,
  description,
  streaming_url,
  views
FROM media
WHERE featured = 1 AND published = 1;
```

#### Media Storage Info

```sql
SELECT
  title,
  type,
  ROUND(file_size / 1024.0 / 1024.0, 2) AS size_mb,
  r2_key,
  mime_type
FROM media
WHERE published = 1;
```

**What `ROUND(file_size / 1024.0 / 1024.0, 2)` does:** Converts bytes to MB with 2 decimal places

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique identifier |
| `title` | TEXT | Media title |
| `description` | TEXT | Description |
| `type` | TEXT | audio/video/image |
| `category` | TEXT | Content category |
| `author` | TEXT | Artist/speaker name |
| `duration` | TEXT | Length (HH:MM:SS) |
| `file_size` | INTEGER | File size in bytes |
| `mime_type` | TEXT | File type (audio/mpeg, video/mp4) |
| `r2_key` | TEXT | Cloudflare R2 storage key |
| `r2_bucket` | TEXT | Storage bucket name |
| `thumbnail_key` | TEXT | Preview image key |
| `streaming_url` | TEXT | Playback URL |
| `download_url` | TEXT | Download link |
| `transcription` | TEXT | Text transcript (for accessibility) |
| `featured` | INTEGER | 1=featured |
| `published` | INTEGER | 1=live |
| `views` | INTEGER | Play count |
| `downloads` | INTEGER | Download count |
| `likes` | INTEGER | Favorite count |
| `uploaded_by` | TEXT | User ID who uploaded |

---

## Part 3: Viewing User & Community Tables

### Table 6: Users

**What it stores:** Registered community members

**⚠️ PRIVACY WARNING:** User data is sensitive. Never share publicly!

#### View All Users (Admin Only)

```sql
SELECT
  id,
  name,
  email,
  role,
  language,
  email_verified,
  newsletter,
  created_at
FROM users
ORDER BY created_at DESC;
```

#### Count Users by Role

```sql
SELECT
  role,
  COUNT(*) AS user_count
FROM users
GROUP BY role;
```

**Expected roles:**
- admin (site administrators)
- member (regular users)
- moderator (content moderators)

#### Newsletter Subscribers (from users table)

```sql
SELECT
  name,
  email,
  language
FROM users
WHERE newsletter = 1
ORDER BY created_at DESC;
```

#### Recently Joined Users

```sql
SELECT
  name,
  email,
  role,
  created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;
```

#### User Preferences Summary

```sql
SELECT
  language,
  COUNT(*) AS user_count
FROM users
GROUP BY language;
```

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique user ID |
| `email` | TEXT | Email address (unique) |
| `name` | TEXT | Full name |
| `role` | TEXT | admin/member/moderator |
| `avatar` | TEXT | Profile picture URL |
| `bio` | TEXT | User biography |
| `language` | TEXT | Preferred language |
| `email_verified` | INTEGER | 1=verified email |
| `newsletter` | INTEGER | 1=subscribed to newsletter |
| `created_at` | TEXT | When account created |
| `password_hash` | TEXT | Encrypted password (never readable!) |

---

### Table 7: Newsletters

**What it stores:** Newsletter-only subscribers (not full users)

#### All Active Subscribers

```sql
SELECT
  email,
  name,
  language,
  source,
  subscribed_at
FROM newsletters
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

#### Subscriber Growth Over Time

```sql
SELECT
  date(subscribed_at) AS date,
  COUNT(*) AS new_subscribers
FROM newsletters
WHERE status = 'active'
GROUP BY date(subscribed_at)
ORDER BY date DESC
LIMIT 30;
```

#### Subscribers by Language

```sql
SELECT
  language,
  COUNT(*) AS count
FROM newsletters
GROUP BY language;
```

#### Recent Unsubscribes

```sql
SELECT
  email,
  unsubscribed_at
FROM newsletters
WHERE status = 'unsubscribed'
ORDER BY unsubscribed_at DESC
LIMIT 20;
```

#### Subscribers by Source

```sql
SELECT
  source,
  COUNT(*) AS count
FROM newsletters
GROUP BY source;
```

**Example sources:**
- website (homepage signup)
- event (event registration signup)
- teaching (from teaching page)

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Unique subscriber ID |
| `email` | TEXT | Email address |
| `name` | TEXT | Optional name |
| `language` | TEXT | Preferred language |
| `status` | TEXT | active/unsubscribed/bounced |
| `source` | TEXT | Where they signed up |
| `interests` | TEXT | Topic preferences |
| `verified` | INTEGER | Email verified? |
| `verification_token` | TEXT | Email verification code |
| `unsubscribe_token` | TEXT | Unique unsubscribe link |
| `last_email_sent` | TEXT | Last campaign date |
| `emails_sent` | INTEGER | Total emails received |
| `subscribed_at` | TEXT | When they subscribed |
| `unsubscribed_at` | TEXT | When they left |

---

### Table 8: Newsletter Campaigns

**What it stores:** Sent newsletters and their performance

#### All Campaigns

```sql
SELECT
  subject,
  status,
  segment,
  recipients,
  opens,
  clicks,
  sent_at
FROM newsletter_campaigns
ORDER BY sent_at DESC;
```

#### Campaign Performance

```sql
SELECT
  subject,
  recipients,
  opens,
  clicks,
  ROUND((opens * 100.0 / recipients), 2) AS open_rate,
  ROUND((clicks * 100.0 / opens), 2) AS click_through_rate,
  sent_at
FROM newsletter_campaigns
WHERE status = 'sent'
ORDER BY sent_at DESC;
```

#### Campaigns by Status

```sql
SELECT
  status,
  COUNT(*) AS count
FROM newsletter_campaigns
GROUP BY status;
```

**Possible statuses:**
- draft (not sent yet)
- scheduled (queued to send)
- sent (delivered)
- failed (error occurred)

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Campaign ID |
| `subject` | TEXT | Email subject line |
| `content` | TEXT | Email body (HTML) |
| `status` | TEXT | draft/scheduled/sent/failed |
| `segment` | TEXT | Who receives it (all/teachings/events) |
| `scheduled_for` | TEXT | When to send |
| `sent_at` | TEXT | When actually sent |
| `recipients` | INTEGER | Number sent to |
| `opens` | INTEGER | How many opened |
| `clicks` | INTEGER | How many clicked links |
| `bounces` | INTEGER | Failed deliveries |
| `unsubscribes` | INTEGER | Opt-outs from this campaign |
| `created_by` | TEXT | Admin user who created it |

---

### Table 9: Comments

**What it stores:** Comments on teachings and events

#### Recent Comments

```sql
SELECT
  author_name,
  LEFT(content, 50) || '...' AS preview,
  resource_type,
  status,
  created_at
FROM comments
ORDER BY created_at DESC
LIMIT 20;
```

**What `LEFT(content, 50) || '...'` does:** Shows first 50 characters + "..."

#### Comments Pending Moderation

```sql
SELECT
  author_name,
  author_email,
  content,
  resource_type,
  resource_id,
  created_at
FROM comments
WHERE status = 'pending'
ORDER BY created_at ASC;
```

#### Approved Comments on a Teaching

```sql
SELECT
  author_name,
  content,
  likes,
  created_at
FROM comments
WHERE resource_type = 'teaching'
  AND resource_id = 'teach-001'
  AND status = 'approved'
ORDER BY created_at ASC;
```

#### Comment Statistics

```sql
SELECT
  status,
  COUNT(*) AS count
FROM comments
GROUP BY status;
```

**Possible statuses:**
- pending (awaiting moderation)
- approved (visible)
- spam (marked as spam)
- rejected (not shown)

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Comment ID |
| `content` | TEXT | Comment text |
| `author_name` | TEXT | Commenter name |
| `author_email` | TEXT | Contact email |
| `author_website` | TEXT | Optional website |
| `user_id` | TEXT | If registered user, their ID |
| `parent_id` | TEXT | For replies (NULL if top-level) |
| `resource_type` | TEXT | teaching/event/quote |
| `resource_id` | TEXT | Which item commented on |
| `status` | TEXT | pending/approved/spam/rejected |
| `ip_address` | TEXT | Security tracking |
| `user_agent` | TEXT | Browser info |
| `spam` | INTEGER | 1=detected as spam |
| `likes` | INTEGER | Upvotes |

---

### Table 10: Contact Messages

**What it stores:** Messages from contact form

#### Recent Messages

```sql
SELECT
  name,
  email,
  subject,
  category,
  status,
  created_at
FROM contact_messages
ORDER BY created_at DESC
LIMIT 20;
```

#### Unread Messages

```sql
SELECT
  name,
  email,
  subject,
  message,
  category,
  created_at
FROM contact_messages
WHERE status = 'new'
ORDER BY created_at ASC;
```

#### Messages by Category

```sql
SELECT
  category,
  COUNT(*) AS count
FROM contact_messages
GROUP BY category
ORDER BY count DESC;
```

**Example categories:**
- general (general inquiries)
- technical (website issues)
- feedback (suggestions)
- content (teaching requests)

#### Messages Needing Response

```sql
SELECT
  name,
  email,
  subject,
  priority,
  created_at
FROM contact_messages
WHERE responded = 0
ORDER BY priority DESC, created_at ASC;
```

**Priority levels:**
- urgent
- high
- normal
- low

#### Column Explanation

| Column | Type | What It Means |
|--------|------|---------------|
| `id` | TEXT | Message ID |
| `name` | TEXT | Sender name |
| `email` | TEXT | Contact email |
| `phone` | TEXT | Optional phone |
| `subject` | TEXT | Message subject |
| `message` | TEXT | Full message text |
| `category` | TEXT | Message type |
| `priority` | TEXT | urgent/high/normal/low |
| `status` | TEXT | new/read/replied/closed |
| `responded` | INTEGER | 1=reply sent |
| `response_date` | TEXT | When replied |
| `assigned_to` | TEXT | Staff member handling it |
| `notes` | TEXT | Internal notes |

---

## Part 4: Viewing System Tables

### Table 11: Sessions

**What it stores:** Active user login sessions

#### Active Sessions

```sql
SELECT
  u.name,
  u.email,
  s.ip_address,
  s.last_activity,
  s.created_at
FROM sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > datetime('now')
ORDER BY s.last_activity DESC;
```

#### Expired Sessions (cleanup needed)

```sql
SELECT COUNT(*) AS expired_sessions
FROM sessions
WHERE expires_at < datetime('now');
```

---

### Table 12: Analytics

**What it stores:** Website usage tracking

#### Page Views Today

```sql
SELECT
  event,
  COUNT(*) AS count
FROM analytics
WHERE date(timestamp) = date('now')
GROUP BY event
ORDER BY count DESC;
```

#### Most Viewed Content

```sql
SELECT
  resource_type,
  resource_id,
  COUNT(*) AS views
FROM analytics
WHERE event = 'page_view'
  AND resource_type IS NOT NULL
GROUP BY resource_type, resource_id
ORDER BY views DESC
LIMIT 20;
```

#### Traffic by Country

```sql
SELECT
  country,
  COUNT(*) AS visits
FROM analytics
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visits DESC
LIMIT 10;
```

---

### Table 13: Trash

**What it stores:** Deleted content (recoverable for 30 days)

#### View Deleted Items

```sql
SELECT
  content_type,
  content_id,
  deleted_at,
  scheduled_purge_at
FROM trash
WHERE restored_at IS NULL
ORDER BY deleted_at DESC;
```

#### Items Expiring Soon

```sql
SELECT
  content_type,
  content_id,
  deleted_at,
  scheduled_purge_at
FROM trash
WHERE restored_at IS NULL
  AND scheduled_purge_at <= date('now', '+7 days')
ORDER BY scheduled_purge_at ASC;
```

---

## Part 5: Useful Combined Queries

### Dashboard Summary

```sql
SELECT
  'Users' AS metric,
  COUNT(*) AS count
FROM users
UNION ALL
SELECT 'Published Teachings', COUNT(*) FROM teachings WHERE published = 1
UNION ALL
SELECT 'Upcoming Events', COUNT(*) FROM events WHERE start_date >= date('now') AND published = 1
UNION ALL
SELECT 'Active Quotes', COUNT(*) FROM quotes WHERE active = 1
UNION ALL
SELECT 'Newsletter Subscribers', COUNT(*) FROM newsletters WHERE status = 'active'
UNION ALL
SELECT 'Pending Comments', COUNT(*) FROM comments WHERE status = 'pending';
```

### Content Performance Report

```sql
SELECT
  'Teaching' AS type,
  title AS name,
  views,
  likes
FROM teachings
WHERE published = 1
UNION ALL
SELECT
  'Quote',
  LEFT(content, 40),
  views,
  likes
FROM quotes
WHERE active = 1
ORDER BY views DESC
LIMIT 20;
```

### Event Attendance Report

```sql
SELECT
  e.title,
  e.start_date,
  COUNT(r.id) AS registered,
  e.max_attendees AS capacity,
  ROUND((COUNT(r.id) * 100.0 / e.max_attendees), 1) AS fill_rate
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
GROUP BY e.id
ORDER BY e.start_date DESC;
```

---

## Part 6: Exporting Data

### Export to CSV

```sql
.mode csv
.headers on
.output teachings_export.csv

SELECT
  id,
  title,
  author,
  category,
  views,
  likes,
  published_at
FROM teachings
WHERE published = 1;

.output stdout
.mode column
```

### Export Event List

```sql
.mode csv
.headers on
.output events_schedule.csv

SELECT
  title,
  type,
  start_date,
  start_time,
  location,
  current_attendees,
  max_attendees
FROM events
WHERE start_date >= date('now')
  AND published = 1
ORDER BY start_date;

.output stdout
.mode column
```

---

## Part 7: Practice Exercises

### Exercise 1: Find Your Most Popular Teaching
**Task:** Show the teaching with the highest view count

**Solution:**
```sql
SELECT title, views, likes FROM teachings
ORDER BY views DESC LIMIT 1;
```

### Exercise 2: Count Total Event Registrations
**Task:** How many people registered for all events?

**Solution:**
```sql
SELECT COUNT(*) AS total_registrations FROM event_registrations;
```

### Exercise 3: Upcoming Events This Week
**Task:** Show events happening in the next 7 days

**Solution:**
```sql
SELECT title, start_date, start_time
FROM events
WHERE start_date BETWEEN date('now') AND date('now', '+7 days')
  AND published = 1
ORDER BY start_date;
```

### Exercise 4: Newsletter Growth This Month
**Task:** How many new subscribers this month?

**Solution:**
```sql
SELECT COUNT(*) AS new_subscribers
FROM newsletters
WHERE strftime('%Y-%m', subscribed_at) = strftime('%Y-%m', 'now')
  AND status = 'active';
```

### Exercise 5: Comments Needing Attention
**Task:** Show pending and spam comments

**Solution:**
```sql
SELECT author_name, LEFT(content, 50) AS preview, status, created_at
FROM comments
WHERE status IN ('pending', 'spam')
ORDER BY created_at DESC;
```

---

## What's Next?

Now you can view all your data! Let's learn how to add, update, and delete content.

**→ Continue to [05-MANAGING-CONTENT.md](./05-MANAGING-CONTENT.md)**

In the next guide, you'll learn:
- How to add new teachings, events, and quotes
- Update existing content
- Safely delete content (soft deletes)
- Restore from trash
- Bulk operations

---

**Keep this guide as a reference!** You'll use these viewing queries constantly for managing your spiritual community.