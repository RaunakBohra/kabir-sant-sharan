# Advanced Queries & Reports

## What You'll Learn
- Complex multi-table queries (JOINs)
- Advanced searching and filtering
- Analytics and statistics
- Report generation
- Data aggregation
- Performance optimization
- Real-world reporting scenarios

**Time required:** 90 minutes

---

## Part 1: JOIN - Combining Multiple Tables

### Understanding JOINs

JOINs let you combine data from multiple tables based on relationships.

**Types of JOINs:**
- `INNER JOIN` - Only matching rows from both tables
- `LEFT JOIN` - All rows from left table + matching from right
- `RIGHT JOIN` - Not supported in SQLite (use LEFT JOIN reversed)
- `CROSS JOIN` - Every combination (rarely used)

### Event Registrations with User Names

```sql
SELECT
  e.title AS event_name,
  e.start_date,
  u.name AS attendee_name,
  u.email,
  r.registered_at
FROM event_registrations r
INNER JOIN events e ON r.event_id = e.id
INNER JOIN users u ON r.user_id = u.id
WHERE e.start_date >= date('now')
ORDER BY e.start_date, r.registered_at;
```

**Explanation:**
- `r` = alias for event_registrations
- `e` = alias for events
- `u` = alias for users
- Shows event name, date, who registered, and when

### Events with Registration Counts

```sql
SELECT
  e.title,
  e.start_date,
  e.max_attendees,
  COUNT(r.id) AS registered_count,
  (e.max_attendees - COUNT(r.id)) AS available_spots
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1 AND e.start_date >= date('now')
GROUP BY e.id
ORDER BY e.start_date;
```

**Why LEFT JOIN?** Includes events with zero registrations

### Teachings with Author User Info

```sql
SELECT
  t.title,
  t.category,
  t.views,
  t.published_at,
  u.name AS author_name,
  u.email AS author_email
FROM teachings t
LEFT JOIN users u ON t.author = u.name
WHERE t.published = 1
ORDER BY t.published_at DESC;
```

### Comments with Related Content

```sql
SELECT
  c.author_name,
  LEFT(c.content, 50) AS comment_preview,
  c.resource_type,
  CASE
    WHEN c.resource_type = 'teaching' THEN t.title
    WHEN c.resource_type = 'event' THEN e.title
    ELSE 'Unknown'
  END AS content_title,
  c.status,
  c.created_at
FROM comments c
LEFT JOIN teachings t ON c.resource_type = 'teaching' AND c.resource_id = t.id
LEFT JOIN events e ON c.resource_type = 'event' AND c.resource_id = e.id
WHERE c.status = 'pending'
ORDER BY c.created_at ASC;
```

---

## Part 2: Advanced Filtering

### Multiple Conditions with AND/OR

```sql
SELECT title, category, views, published_at
FROM teachings
WHERE (category = 'meditation' OR category = 'spirituality')
  AND published = 1
  AND views > 100
  AND published_at >= date('now', '-30 days')
ORDER BY views DESC;
```

### BETWEEN for Ranges

```sql
-- Events in next 7-30 days
SELECT title, start_date, type
FROM events
WHERE start_date BETWEEN date('now', '+7 days') AND date('now', '+30 days')
  AND published = 1
ORDER BY start_date;
```

### IN for Multiple Values

```sql
-- Teachings in specific categories
SELECT title, category, views
FROM teachings
WHERE category IN ('meditation', 'devotion', 'wisdom')
  AND published = 1
ORDER BY category, views DESC;
```

### NOT IN to Exclude Values

```sql
-- Events that are NOT online
SELECT title, type, location
FROM events
WHERE type NOT IN ('online')
  AND published = 1;
```

### LIKE for Pattern Matching

```sql
-- Find teachings about "kabir" (case-insensitive)
SELECT title, excerpt
FROM teachings
WHERE (title LIKE '%kabir%' OR content LIKE '%kabir%')
  AND published = 1;
```

**Wildcards:**
- `%` = any characters
- `_` = single character

**Examples:**
- `'%meditation%'` = contains "meditation"
- `'Path%'` = starts with "Path"
- `'%enlightenment'` = ends with "enlightenment"
- `'Path_'` = "Path" followed by one character

### IS NULL / IS NOT NULL

```sql
-- Teachings without cover images
SELECT title, category
FROM teachings
WHERE cover_image IS NULL
  AND published = 1;
```

```sql
-- Events with location (not online)
SELECT title, location, start_date
FROM events
WHERE location IS NOT NULL
  AND published = 1;
```

### CASE Statements (If/Then Logic)

```sql
SELECT
  title,
  type,
  CASE
    WHEN type = 'online' THEN 'Virtual Event'
    WHEN type = 'in-person' THEN 'Physical Event'
    WHEN type = 'hybrid' THEN 'Hybrid Event'
    ELSE 'Unknown'
  END AS event_format,
  start_date
FROM events
WHERE published = 1;
```

---

## Part 3: Aggregation & Statistics

### GROUP BY - Summarizing Data

```sql
-- Teachings per category with stats
SELECT
  category,
  COUNT(*) AS teaching_count,
  SUM(views) AS total_views,
  AVG(views) AS avg_views,
  MAX(views) AS max_views,
  MIN(reading_time) AS min_reading_time
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
GROUP BY category
ORDER BY teaching_count DESC;
```

### HAVING - Filter Grouped Results

```sql
-- Categories with more than 5 teachings
SELECT
  category,
  COUNT(*) AS count
FROM teachings
WHERE published = 1
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY count DESC;
```

**Difference:**
- `WHERE` filters rows before grouping
- `HAVING` filters groups after aggregation

### Percentiles and Rankings

```sql
-- Top 10% most viewed teachings
SELECT
  title,
  views,
  ROUND((RANK() OVER (ORDER BY views DESC) * 100.0) / COUNT(*) OVER (), 2) AS percentile
FROM teachings
WHERE published = 1
HAVING percentile <= 10
ORDER BY views DESC;
```

---

## Part 4: Real-World Reports

### Report 1: Monthly Content Performance

```sql
SELECT
  strftime('%Y-%m', published_at) AS month,
  COUNT(*) AS teachings_published,
  SUM(views) AS total_views,
  AVG(views) AS avg_views_per_teaching,
  SUM(likes) AS total_likes
FROM teachings
WHERE published = 1
  AND published_at IS NOT NULL
GROUP BY strftime('%Y-%m', published_at)
ORDER BY month DESC
LIMIT 12;
```

**Export to CSV:**
```sql
.mode csv
.headers on
.output monthly_content_report.csv

-- Run the query above

.output stdout
.mode column
```

### Report 2: Event Attendance Summary

```sql
SELECT
  e.title AS event_name,
  e.start_date,
  e.type,
  e.max_attendees AS capacity,
  COUNT(r.id) AS registrations,
  ROUND((COUNT(r.id) * 100.0 / e.max_attendees), 1) AS fill_rate,
  SUM(CASE WHEN r.attendance_status = 'attended' THEN 1 ELSE 0 END) AS actual_attendance,
  ROUND((SUM(CASE WHEN r.attendance_status = 'attended' THEN 1 ELSE 0 END) * 100.0 / COUNT(r.id)), 1) AS attendance_rate
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
  AND e.start_date < date('now')
GROUP BY e.id
ORDER BY e.start_date DESC
LIMIT 20;
```

### Report 3: Newsletter Subscriber Growth

```sql
SELECT
  strftime('%Y-%m', subscribed_at) AS month,
  COUNT(*) AS new_subscribers,
  SUM(COUNT(*)) OVER (ORDER BY strftime('%Y-%m', subscribed_at)) AS cumulative_total
FROM newsletters
WHERE status = 'active'
GROUP BY strftime('%Y-%m', subscribed_at)
ORDER BY month DESC
LIMIT 12;
```

### Report 4: Top Performing Content

```sql
SELECT
  'Teaching' AS content_type,
  title AS name,
  category,
  views,
  likes,
  ROUND((likes * 100.0 / NULLIF(views, 0)), 2) AS engagement_rate
FROM teachings
WHERE published = 1 AND views > 0
UNION ALL
SELECT
  'Quote',
  LEFT(content, 40),
  category,
  views,
  likes,
  ROUND((likes * 100.0 / NULLIF(views, 0)), 2)
FROM quotes
WHERE active = 1 AND views > 0
ORDER BY views DESC
LIMIT 20;
```

### Report 5: User Engagement Dashboard

```sql
SELECT
  'Total Users' AS metric,
  COUNT(*) AS value,
  NULL AS percentage
FROM users
UNION ALL
SELECT
  'Newsletter Subscribers',
  COUNT(*),
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)), 1)
FROM users
WHERE newsletter = 1
UNION ALL
SELECT
  'Event Registrations',
  COUNT(*),
  NULL
FROM event_registrations
UNION ALL
SELECT
  'Comments Submitted',
  COUNT(*),
  NULL
FROM comments
UNION ALL
SELECT
  'Active Sessions',
  COUNT(*),
  NULL
FROM sessions
WHERE expires_at > datetime('now');
```

### Report 6: Content Audit

```sql
SELECT
  'Published Teachings' AS content_category,
  COUNT(*) AS count
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
UNION ALL
SELECT 'Draft Teachings', COUNT(*) FROM teachings WHERE published = 0 AND deleted_at IS NULL
UNION ALL
SELECT 'Deleted Teachings', COUNT(*) FROM teachings WHERE deleted_at IS NOT NULL
UNION ALL
SELECT 'Published Events', COUNT(*) FROM events WHERE published = 1 AND deleted_at IS NULL
UNION ALL
SELECT 'Draft Events', COUNT(*) FROM events WHERE published = 0 AND deleted_at IS NULL
UNION ALL
SELECT 'Active Quotes', COUNT(*) FROM quotes WHERE active = 1
UNION ALL
SELECT 'Inactive Quotes', COUNT(*) FROM quotes WHERE active = 0;
```

---

## Part 5: Time-Based Analysis

### Daily Activity Log

```sql
SELECT
  date(timestamp) AS date,
  event AS activity_type,
  COUNT(*) AS count
FROM analytics
WHERE timestamp >= date('now', '-30 days')
GROUP BY date(timestamp), event
ORDER BY date DESC, count DESC;
```

### Teaching Views Over Time

```sql
SELECT
  t.title,
  date(a.timestamp) AS date,
  COUNT(*) AS views_on_date
FROM analytics a
JOIN teachings t ON a.resource_id = t.id
WHERE a.event = 'page_view'
  AND a.resource_type = 'teaching'
  AND a.timestamp >= date('now', '-30 days')
GROUP BY t.id, date(a.timestamp)
ORDER BY date DESC, views_on_date DESC;
```

### Peak Activity Hours

```sql
SELECT
  CAST(strftime('%H', timestamp) AS INTEGER) AS hour,
  COUNT(*) AS activity_count
FROM analytics
WHERE timestamp >= datetime('now', '-7 days')
GROUP BY hour
ORDER BY hour;
```

### Weekly Comparison

```sql
SELECT
  strftime('%Y-W%W', created_at) AS week,
  COUNT(*) AS new_teachings
FROM teachings
WHERE created_at >= date('now', '-12 weeks')
GROUP BY week
ORDER BY week DESC;
```

---

## Part 6: Search Functionality

### Full-Text Search Across Multiple Fields

```sql
-- Search for "devotion" in teachings
SELECT
  title,
  excerpt,
  category,
  views,
  CASE
    WHEN title LIKE '%devotion%' THEN 'Title Match'
    WHEN excerpt LIKE '%devotion%' THEN 'Excerpt Match'
    WHEN content LIKE '%devotion%' THEN 'Content Match'
  END AS match_location
FROM teachings
WHERE (title LIKE '%devotion%'
   OR excerpt LIKE '%devotion%'
   OR content LIKE '%devotion%')
  AND published = 1
ORDER BY
  CASE
    WHEN title LIKE '%devotion%' THEN 1
    WHEN excerpt LIKE '%devotion%' THEN 2
    ELSE 3
  END,
  views DESC;
```

### Tag-Based Search

```sql
-- Find teachings with specific tags
SELECT
  title,
  category,
  tags,
  views
FROM teachings
WHERE (',' || tags || ',') LIKE '%,meditation,%'
  AND published = 1
ORDER BY views DESC;
```

**Note:** Tags are stored as comma-separated text

### Multi-Criteria Search

```sql
-- Search events by multiple criteria
SELECT
  title,
  type,
  location,
  start_date,
  category
FROM events
WHERE published = 1
  AND start_date >= date('now')
  AND (
    title LIKE '%meditation%'
    OR description LIKE '%meditation%'
    OR category = 'meditation'
    OR tags LIKE '%meditation%'
  )
ORDER BY start_date;
```

### Search with Relevance Scoring

```sql
SELECT
  title,
  excerpt,
  (
    (CASE WHEN title LIKE '%truth%' THEN 10 ELSE 0 END) +
    (CASE WHEN excerpt LIKE '%truth%' THEN 5 ELSE 0 END) +
    (CASE WHEN category = 'truth' THEN 3 ELSE 0 END) +
    (CASE WHEN tags LIKE '%truth%' THEN 2 ELSE 0 END)
  ) AS relevance_score,
  views
FROM teachings
WHERE published = 1
  AND (
    title LIKE '%truth%'
    OR excerpt LIKE '%truth%'
    OR category = 'truth'
    OR tags LIKE '%truth%'
  )
ORDER BY relevance_score DESC, views DESC;
```

---

## Part 7: Analytics Queries

### Most Popular Days for Events

```sql
SELECT
  strftime('%w', start_date) AS day_of_week,
  CASE strftime('%w', start_date)
    WHEN '0' THEN 'Sunday'
    WHEN '1' THEN 'Monday'
    WHEN '2' THEN 'Tuesday'
    WHEN '3' THEN 'Wednesday'
    WHEN '4' THEN 'Thursday'
    WHEN '5' THEN 'Friday'
    WHEN '6' THEN 'Saturday'
  END AS day_name,
  COUNT(*) AS event_count,
  AVG(current_attendees) AS avg_attendance
FROM events
WHERE published = 1
GROUP BY day_of_week
ORDER BY event_count DESC;
```

### Content Freshness Report

```sql
SELECT
  CASE
    WHEN updated_at >= date('now', '-7 days') THEN 'This Week'
    WHEN updated_at >= date('now', '-30 days') THEN 'This Month'
    WHEN updated_at >= date('now', '-90 days') THEN 'Last 3 Months'
    WHEN updated_at >= date('now', '-365 days') THEN 'This Year'
    ELSE 'Older'
  END AS freshness,
  COUNT(*) AS teaching_count
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
GROUP BY freshness
ORDER BY
  CASE freshness
    WHEN 'This Week' THEN 1
    WHEN 'This Month' THEN 2
    WHEN 'Last 3 Months' THEN 3
    WHEN 'This Year' THEN 4
    ELSE 5
  END;
```

### Conversion Funnel

```sql
SELECT
  'Page Views' AS stage,
  COUNT(*) AS count,
  100.0 AS percentage
FROM analytics
WHERE event = 'page_view' AND resource_type = 'event'
UNION ALL
SELECT
  'Registration Starts',
  COUNT(*),
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analytics WHERE event = 'page_view' AND resource_type = 'event')), 2)
FROM analytics
WHERE event = 'registration_start'
UNION ALL
SELECT
  'Registrations Completed',
  COUNT(*),
  ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM analytics WHERE event = 'page_view' AND resource_type = 'event')), 2)
FROM event_registrations;
```

---

## Part 8: Performance Optimization

### Using Indexes (Read-Only for You)

Your database already has indexes on:
- Primary keys (id columns)
- Unique fields (email, slug)
- Foreign keys (user_id, event_id)

**View existing indexes:**
```sql
SELECT name, tbl_name, sql
FROM sqlite_master
WHERE type = 'index'
ORDER BY tbl_name;
```

### Optimizing Queries

**EXPLAIN QUERY PLAN shows how SQLite executes your query:**
```sql
EXPLAIN QUERY PLAN
SELECT title, views FROM teachings WHERE published = 1 ORDER BY views DESC;
```

**Tips for faster queries:**
1. Use indexes (already set up for you)
2. Limit results when possible (`LIMIT 100`)
3. Avoid `SELECT *` when you only need specific columns
4. Use `WHERE` to filter early
5. Be careful with `LIKE '%term%'` (can't use indexes)

### Query Benchmarking

```sql
-- Enable timing
.timer on

-- Run your query
SELECT COUNT(*) FROM teachings;

-- Shows execution time
.timer off
```

---

## Part 9: Exporting for External Analysis

### Export to CSV for Excel

```sql
.mode csv
.headers on
.output data_export.csv

SELECT
  t.title,
  t.category,
  t.views,
  t.likes,
  t.published_at,
  ROUND((t.likes * 100.0 / NULLIF(t.views, 0)), 2) AS engagement_rate
FROM teachings t
WHERE t.published = 1
ORDER BY t.views DESC;

.output stdout
.mode column
```

### Export to JSON

```sql
.mode json
.output teachings_data.json

SELECT
  id,
  title,
  category,
  views,
  likes,
  published_at
FROM teachings
WHERE published = 1
ORDER BY views DESC
LIMIT 50;

.output stdout
.mode column
```

### Export for Backup

```sql
.mode insert teachings
.output teachings_backup.sql

SELECT * FROM teachings;

.output stdout
```

---

## Part 10: Practice Exercises

### Exercise 1: Top Events by Registration Rate
**Task:** Show events with highest registration rates

**Solution:**
```sql
SELECT
  e.title,
  e.max_attendees,
  COUNT(r.id) AS registrations,
  ROUND((COUNT(r.id) * 100.0 / e.max_attendees), 1) AS fill_rate
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
GROUP BY e.id
ORDER BY fill_rate DESC
LIMIT 10;
```

### Exercise 2: Search Teachings by Keyword
**Task:** Find all teachings containing "compassion"

**Solution:**
```sql
SELECT title, excerpt, category, views
FROM teachings
WHERE (title LIKE '%compassion%' OR content LIKE '%compassion%')
  AND published = 1
ORDER BY views DESC;
```

### Exercise 3: Monthly Newsletter Subscriber Growth
**Task:** Show new subscribers per month for last 12 months

**Solution:**
```sql
SELECT
  strftime('%Y-%m', subscribed_at) AS month,
  COUNT(*) AS new_subscribers
FROM newsletters
WHERE status = 'active'
  AND subscribed_at >= date('now', '-12 months')
GROUP BY month
ORDER BY month DESC;
```

### Exercise 4: Content Performance by Category
**Task:** Compare different content categories by views and likes

**Solution:**
```sql
SELECT
  category,
  COUNT(*) AS count,
  SUM(views) AS total_views,
  SUM(likes) AS total_likes,
  ROUND(AVG(views), 0) AS avg_views,
  ROUND((SUM(likes) * 100.0 / SUM(views)), 2) AS like_rate
FROM teachings
WHERE published = 1 AND views > 0
GROUP BY category
ORDER BY total_views DESC;
```

### Exercise 5: Upcoming Events Summary
**Task:** List next month's events with registration status

**Solution:**
```sql
SELECT
  e.title,
  e.start_date,
  e.type,
  COUNT(r.id) AS registered,
  e.max_attendees,
  (e.max_attendees - COUNT(r.id)) AS spots_left,
  CASE
    WHEN COUNT(r.id) >= e.max_attendees THEN 'FULL'
    WHEN COUNT(r.id) >= e.max_attendees * 0.8 THEN 'Almost Full'
    ELSE 'Available'
  END AS status
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
  AND e.start_date BETWEEN date('now') AND date('now', '+30 days')
GROUP BY e.id
ORDER BY e.start_date;
```

---

## What's Next?

You now have advanced query skills! Let's learn how to backup and maintain your database.

**→ Continue to [07-BACKUP-MAINTENANCE.md](./07-BACKUP-MAINTENANCE.md)**

In the next guide, you'll learn:
- Automated backup strategies
- Database maintenance
- Integrity checks
- Recovery procedures
- Optimization techniques
- Best practices for long-term health

---

**These queries are powerful!** Save your favorites for regular reporting.