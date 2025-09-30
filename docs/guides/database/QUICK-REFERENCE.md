# SQLite Quick Reference - Cheat Sheet

**One-page reference for daily database tasks**

---

## Opening Database

```bash
# Navigate and open
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
sqlite3 local.db

# Open with alias (if set up)
kabir-db

# Open read-only (safe mode)
sqlite3 file:local.db?mode=ro
```

---

## Essential Dot Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `.help` | Show all commands | `.help` |
| `.tables` | List all tables | `.tables` |
| `.schema TABLE` | Show table structure | `.schema teachings` |
| `.mode column` | Display in columns | `.mode column` |
| `.headers on` | Show column names | `.headers on` |
| `.output FILE` | Save to file | `.output report.txt` |
| `.once FILE` | Save next query only | `.once data.csv` |
| `.quit` | Exit | `.quit` or `Ctrl+D` |

---

## Display Formatting

```sql
-- Best settings for readability
.mode column
.headers on
.width 15 30 20 10

-- Export as CSV
.mode csv
.headers on
.output data.csv

-- Export as JSON
.mode json
.output data.json

-- Return to normal
.output stdout
.mode column
```

---

## SELECT - View Data

```sql
-- All columns
SELECT * FROM teachings;

-- Specific columns
SELECT title, author, views FROM teachings;

-- With filter
SELECT title, views FROM teachings WHERE published = 1;

-- Sorted
SELECT title, views FROM teachings ORDER BY views DESC;

-- Limited results
SELECT title, views FROM teachings LIMIT 10;

-- Count rows
SELECT COUNT(*) FROM teachings;

-- Unique values
SELECT DISTINCT category FROM teachings;
```

---

## WHERE - Filtering

```sql
-- Exact match
WHERE published = 1

-- Text match (case-insensitive)
WHERE author = 'Sant Kabir Das'

-- Number comparison
WHERE views > 100
WHERE views >= 50
WHERE views < 200

-- Date comparison
WHERE start_date >= date('now')
WHERE created_at > '2025-09-01'

-- Multiple conditions
WHERE published = 1 AND views > 100
WHERE category = 'meditation' OR category = 'spirituality'

-- Pattern matching
WHERE title LIKE '%meditation%'
WHERE slug LIKE 'path%'

-- NULL checks
WHERE deleted_at IS NULL
WHERE cover_image IS NOT NULL

-- In list
WHERE category IN ('meditation', 'devotion', 'wisdom')

-- Ranges
WHERE views BETWEEN 100 AND 500
```

---

## INSERT - Add Data

```sql
-- Basic insert
INSERT INTO teachings (id, title, content, excerpt, slug, category, author, published, language, created_at, updated_at)
VALUES ('teach-002', 'Title', 'Content here', 'Brief excerpt', 'title-slug', 'category', 'Author', 1, 'en', datetime('now'), datetime('now'));

-- Multiple rows
INSERT INTO quotes (id, content, translation, author, category, language, active, created_at, updated_at)
VALUES
  ('quote-001', 'Hindi text', 'English translation', 'Sant Kabir Das', 'wisdom', 'hi', 1, datetime('now'), datetime('now')),
  ('quote-002', 'Hindi text', 'English translation', 'Sant Kabir Das', 'devotion', 'hi', 1, datetime('now'), datetime('now'));
```

---

## UPDATE - Modify Data

```sql
-- Update single field
UPDATE teachings
SET published = 1
WHERE id = 'teach-001';

-- Update multiple fields
UPDATE teachings
SET title = 'New Title',
    excerpt = 'New excerpt',
    updated_at = datetime('now')
WHERE id = 'teach-001';

-- Increment counter
UPDATE teachings
SET views = views + 1
WHERE id = 'teach-001';

-- Bulk update
UPDATE teachings
SET featured = 1,
    updated_at = datetime('now')
WHERE category = 'meditation' AND published = 1;

-- Soft delete
UPDATE teachings
SET deleted_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-002';

-- Restore from soft delete
UPDATE teachings
SET deleted_at = NULL,
    updated_at = datetime('now')
WHERE id = 'teach-002';
```

---

## DELETE - Remove Data

```sql
-- ⚠️ Always use WHERE!

-- Delete specific record
DELETE FROM quotes WHERE id = 'quote-spam-001';

-- Delete with condition
DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');

-- Delete old analytics
DELETE FROM analytics WHERE timestamp < date('now', '-90 days');
```

---

## Aggregation Functions

```sql
-- Count
SELECT COUNT(*) FROM teachings;
SELECT COUNT(*) FROM teachings WHERE published = 1;

-- Sum
SELECT SUM(views) FROM teachings;

-- Average
SELECT AVG(views) FROM teachings;

-- Max/Min
SELECT MAX(views) FROM teachings;
SELECT MIN(reading_time) FROM teachings;

-- Multiple aggregations
SELECT
  COUNT(*) AS total,
  SUM(views) AS total_views,
  AVG(views) AS avg_views,
  MAX(views) AS most_viewed
FROM teachings
WHERE published = 1;
```

---

## GROUP BY - Summarize

```sql
-- Count by category
SELECT category, COUNT(*) AS count
FROM teachings
WHERE published = 1
GROUP BY category
ORDER BY count DESC;

-- Stats per category
SELECT
  category,
  COUNT(*) AS teaching_count,
  SUM(views) AS total_views,
  AVG(views) AS avg_views
FROM teachings
WHERE published = 1
GROUP BY category;

-- Filter groups with HAVING
SELECT category, COUNT(*) AS count
FROM teachings
GROUP BY category
HAVING COUNT(*) > 5;
```

---

## JOIN - Combine Tables

```sql
-- Event registrations with user names
SELECT
  e.title AS event,
  u.name AS attendee,
  r.registered_at
FROM event_registrations r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
WHERE e.start_date >= date('now');

-- Events with registration counts
SELECT
  e.title,
  e.start_date,
  COUNT(r.id) AS registrations
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
GROUP BY e.id
ORDER BY e.start_date;
```

---

## Date & Time Functions

```sql
-- Current date/time
SELECT datetime('now');
SELECT date('now');
SELECT time('now');

-- Date arithmetic
SELECT date('now', '+7 days');
SELECT date('now', '-30 days');
SELECT date('now', '+1 month');
SELECT date('now', '-1 year');

-- Date comparisons
WHERE start_date >= date('now')
WHERE created_at >= date('now', '-30 days')

-- Date formatting
SELECT strftime('%Y-%m-%d', created_at);
SELECT strftime('%d %B %Y', published_at);

-- Extract parts
SELECT strftime('%Y', created_at) AS year;
SELECT strftime('%m', created_at) AS month;
SELECT strftime('%w', start_date) AS day_of_week;

-- Month grouping
GROUP BY strftime('%Y-%m', created_at)
```

---

## Transactions (Safe Bulk Changes)

```sql
-- Start transaction
BEGIN TRANSACTION;

-- Make changes
UPDATE teachings SET published = 1 WHERE id = 'teach-001';
UPDATE teachings SET featured = 1 WHERE id = 'teach-001';

-- Preview
SELECT id, title, published, featured FROM teachings WHERE id = 'teach-001';

-- If good: Save
COMMIT;

-- If bad: Undo
ROLLBACK;
```

---

## Common Queries

### View Published Teachings
```sql
SELECT id, title, category, views, published_at
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
ORDER BY published_at DESC;
```

### Upcoming Events
```sql
SELECT title, start_date, start_time, location, current_attendees, max_attendees
FROM events
WHERE start_date >= date('now') AND published = 1 AND deleted_at IS NULL
ORDER BY start_date;
```

### Most Viewed Content
```sql
SELECT title, views, likes FROM teachings
WHERE published = 1
ORDER BY views DESC
LIMIT 10;
```

### Recent Registrations
```sql
SELECT e.title, u.name, r.registered_at
FROM event_registrations r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
ORDER BY r.registered_at DESC
LIMIT 20;
```

### Newsletter Subscribers
```sql
SELECT email, name, language, subscribed_at
FROM newsletters
WHERE status = 'active'
ORDER BY subscribed_at DESC;
```

---

## Backup & Restore

```bash
# Backup
cp local.db backups/local.db.$(date +%Y%m%d_%H%M%S)

# SQLite backup command
sqlite3 local.db ".backup backups/backup.db"

# SQL dump
sqlite3 local.db ".dump" > backups/full_backup.sql

# Restore
cp backups/local.db.20250930_143022 local.db

# Restore from SQL dump
sqlite3 new_db.db < backups/full_backup.sql
```

---

## Maintenance

```sql
-- Check integrity
PRAGMA integrity_check;

-- Optimize
VACUUM;

-- Update statistics
ANALYZE;

-- Clean old sessions
DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');

-- Clean old analytics
DELETE FROM analytics WHERE timestamp < date('now', '-90 days');
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + D` | Exit SQLite |
| `Ctrl + C` | Cancel current command |
| `Ctrl + L` | Clear screen (in some terminals) |
| Up Arrow | Previous command |
| Down Arrow | Next command |

---

## Export Data

```sql
-- To CSV
.mode csv
.headers on
.output data.csv
SELECT * FROM teachings WHERE published = 1;
.output stdout

-- To JSON
.mode json
.output data.json
SELECT * FROM teachings WHERE published = 1;
.output stdout

-- To SQL
.mode insert teachings
.output teachings_backup.sql
SELECT * FROM teachings;
.output stdout
```

---

## Common Patterns

### Generate Next ID
```sql
SELECT 'teach-' || PRINTF('%03d', COALESCE(MAX(CAST(SUBSTR(id, 7) AS INTEGER)), 0) + 1)
FROM teachings;
```

### Check if Record Exists
```sql
SELECT EXISTS(SELECT 1 FROM teachings WHERE id = 'teach-001');
```

### Copy Record
```sql
INSERT INTO teachings
SELECT * FROM teachings WHERE id = 'teach-001';
-- Then update the ID
```

### Count Records by Status
```sql
SELECT
  CASE published
    WHEN 1 THEN 'Published'
    WHEN 0 THEN 'Draft'
  END AS status,
  COUNT(*) AS count
FROM teachings
GROUP BY published;
```

---

## Troubleshooting Quick Fixes

```sql
-- "database is locked"
-- Close all connections, wait, try again

-- "no such table"
.tables  -- Verify table name

-- "no such column"
.schema teachings  -- Check column names

-- "syntax error"
-- Check for missing semicolon
-- Check quotes around text values

-- "UNIQUE constraint failed"
-- ID or unique field already exists

-- "NOT NULL constraint failed"
-- Required field is missing
```

---

## Safety Checklist

Before running UPDATE/DELETE:
1. ✓ Backup database
2. ✓ Preview with SELECT first
3. ✓ Use WHERE clause (never update all rows!)
4. ✓ Use transaction for bulk changes
5. ✓ Verify results after committing

---

## File Locations

```
Database:
/Users/raunakbohra/Desktop/kabir-sant-sharan/local.db

Backups:
/Users/raunakbohra/Desktop/kabir-sant-sharan/backups/

Config:
~/.sqliterc

Scripts:
~/bin/backup-kabir-db.sh
~/bin/maintain-kabir-db.sh
```

---

## Need More Help?

**Full Guides:**
- [01-GETTING-STARTED.md](./01-GETTING-STARTED.md) - Database basics
- [02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md) - Tools setup
- [03-BASIC-COMMANDS.md](./03-BASIC-COMMANDS.md) - Essential commands
- [04-VIEWING-DATA.md](./04-VIEWING-DATA.md) - Query all tables
- [05-MANAGING-CONTENT.md](./05-MANAGING-CONTENT.md) - Add/update/delete
- [06-ADVANCED-QUERIES.md](./06-ADVANCED-QUERIES.md) - Complex queries
- [07-BACKUP-MAINTENANCE.md](./07-BACKUP-MAINTENANCE.md) - Backup strategies

**References:**
- [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Table structure explained
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common errors
- [EXERCISES.md](./EXERCISES.md) - Practice problems

---

**Print this page for daily reference!**