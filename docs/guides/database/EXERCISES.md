# Hands-On Exercises

**Practice SQLite with real scenarios from Kabir Sant Sharan**

Work through these exercises to master database operations. Each exercise includes:
- Clear objective
- Difficulty level
- Step-by-step hints
- Complete solution
- Expected results

---

## Setup

```bash
# Open your database
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
sqlite3 local.db

# Configure display
.mode column
.headers on
```

**Important:** Backup before exercises that modify data!
```bash
cp local.db backups/local.db.exercises_$(date +%Y%m%d)
```

---

## Level 1: Beginner (Viewing Data)

### Exercise 1.1: List All Tables
**Objective:** See what tables exist in the database

**Difficulty:** ⭐ Very Easy

**Your Task:**
Show all tables in the database.

<details>
<summary>Hint</summary>
Use a dot command that starts with `.t`
</details>

<details>
<summary>Solution</summary>

```sql
.tables
```

**Expected Output:**
```
analytics             media                 teachings
comments              newsletter_campaigns  trash
contact_messages      newsletters           users
event_registrations   quotes
events                sessions
```
</details>

---

### Exercise 1.2: Count Total Teachings
**Objective:** Find out how many teachings you have

**Difficulty:** ⭐ Very Easy

**Your Task:**
Count all records in the teachings table.

<details>
<summary>Hint</summary>
Use `COUNT(*)` function with SELECT
</details>

<details>
<summary>Solution</summary>

```sql
SELECT COUNT(*) AS total_teachings FROM teachings;
```

**Expected Output:**
```
total_teachings
---------------
1
```
</details>

---

### Exercise 1.3: View Teaching Titles
**Objective:** See all teaching titles and authors

**Difficulty:** ⭐ Easy

**Your Task:**
Show only the title and author columns from the teachings table.

<details>
<summary>Hint</summary>
`SELECT column1, column2 FROM table_name;`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, author FROM teachings;
```

**Expected Output:**
```
title                          author
-----------------------------  --------------
Path to Enlightenment          Sant Kabir Das
```
</details>

---

### Exercise 1.4: Find Published Teachings
**Objective:** Show only teachings that are live on the website

**Difficulty:** ⭐ Easy

**Your Task:**
Select all teachings where published = 1 and show their title, category, and views.

<details>
<summary>Hint</summary>
Use WHERE clause: `WHERE published = 1`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, category, views
FROM teachings
WHERE published = 1;
```
</details>

---

### Exercise 1.5: Sort by Most Viewed
**Objective:** Find which teachings are most popular

**Difficulty:** ⭐ Easy

**Your Task:**
Show teaching titles and view counts, sorted from highest to lowest views.

<details>
<summary>Hint</summary>
Use `ORDER BY views DESC` (DESC = descending)
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, views
FROM teachings
WHERE published = 1
ORDER BY views DESC;
```
</details>

---

## Level 2: Intermediate (Filtering & Searching)

### Exercise 2.1: Find Upcoming Events
**Objective:** Show events that haven't happened yet

**Difficulty:** ⭐⭐ Medium

**Your Task:**
List events where start_date is today or later, showing title, start_date, and location.

<details>
<summary>Hint</summary>
Use `WHERE start_date >= date('now')`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, start_date, location
FROM events
WHERE start_date >= date('now')
  AND published = 1
ORDER BY start_date;
```
</details>

---

### Exercise 2.2: Search Teachings by Keyword
**Objective:** Find teachings about meditation

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Find all teachings where the title contains the word "meditation" (case-insensitive).

<details>
<summary>Hint</summary>
Use `LIKE '%meditation%'` - the % means "any characters"
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, category, excerpt
FROM teachings
WHERE title LIKE '%meditation%'
  AND published = 1;
```

**Alternative:** Search in both title and content
```sql
SELECT title, category
FROM teachings
WHERE (title LIKE '%meditation%' OR content LIKE '%meditation%')
  AND published = 1;
```
</details>

---

### Exercise 2.3: Count by Category
**Objective:** See how many teachings exist in each category

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Group teachings by category and count how many are in each.

<details>
<summary>Hint</summary>
Use `GROUP BY category` with `COUNT(*)`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  category,
  COUNT(*) AS teaching_count
FROM teachings
WHERE published = 1
GROUP BY category
ORDER BY teaching_count DESC;
```
</details>

---

### Exercise 2.4: Find Events This Month
**Objective:** Show events happening in the current month

**Difficulty:** ⭐⭐ Medium

**Your Task:**
List events where start_date is in the current year-month.

<details>
<summary>Hint</summary>
Use `strftime('%Y-%m', start_date)` to extract year-month
</details>

<details>
<summary>Solution</summary>

```sql
SELECT title, start_date, type
FROM events
WHERE strftime('%Y-%m', start_date) = strftime('%Y-%m', 'now')
  AND published = 1
ORDER BY start_date;
```
</details>

---

### Exercise 2.5: Top 5 Most Liked Quotes
**Objective:** Find the most popular quotes

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Show the 5 quotes with the highest like count, including their content and translation.

<details>
<summary>Hint</summary>
Use `ORDER BY likes DESC LIMIT 5`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  content,
  translation,
  likes,
  views
FROM quotes
WHERE active = 1
ORDER BY likes DESC
LIMIT 5;
```
</details>

---

## Level 3: Advanced (JOINs & Complex Queries)

### Exercise 3.1: Event Registrations with Names
**Objective:** Show who registered for which event

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Join event_registrations, events, and users tables to show:
- Event title
- Attendee name
- Registration date

<details>
<summary>Hint</summary>
Use JOIN to connect tables: `FROM table1 JOIN table2 ON table1.id = table2.foreign_key`
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  e.title AS event_name,
  u.name AS attendee_name,
  r.registered_at
FROM event_registrations r
JOIN events e ON r.event_id = e.id
JOIN users u ON r.user_id = u.id
ORDER BY r.registered_at DESC;
```

**Note:** This only shows registered users, not guests. For guests too:
```sql
SELECT
  e.title AS event_name,
  COALESCE(u.name, r.guest_name) AS attendee_name,
  COALESCE(u.email, r.guest_email) AS email,
  r.registered_at
FROM event_registrations r
JOIN events e ON r.event_id = e.id
LEFT JOIN users u ON r.user_id = u.id
ORDER BY r.registered_at DESC;
```
</details>

---

### Exercise 3.2: Events with Registration Counts
**Objective:** Show how many people registered for each event

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
For each event, show:
- Event title
- Max attendees
- Number of registrations
- Available spots

<details>
<summary>Hint</summary>
Use LEFT JOIN and GROUP BY
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  e.title,
  e.start_date,
  e.max_attendees,
  COUNT(r.id) AS registrations,
  (e.max_attendees - COUNT(r.id)) AS available_spots
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
GROUP BY e.id
ORDER BY e.start_date;
```
</details>

---

### Exercise 3.3: Content Performance Report
**Objective:** Compare teachings and quotes by popularity

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Create a combined report showing top content from both teachings and quotes, with:
- Content type
- Title/content preview
- Views
- Likes

<details>
<summary>Hint</summary>
Use UNION ALL to combine two SELECT statements
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  'Teaching' AS content_type,
  title AS name,
  views,
  likes
FROM teachings
WHERE published = 1
UNION ALL
SELECT
  'Quote' AS content_type,
  LEFT(content, 40) AS name,
  views,
  likes
FROM quotes
WHERE active = 1
ORDER BY views DESC
LIMIT 20;
```
</details>

---

### Exercise 3.4: Monthly Activity Report
**Objective:** See content created each month

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Show how many teachings were published each month for the last 12 months.

<details>
<summary>Hint</summary>
Use `strftime('%Y-%m', date)` and GROUP BY
</details>

<details>
<summary>Solution</summary>

```sql
SELECT
  strftime('%Y-%m', published_at) AS month,
  COUNT(*) AS teachings_published,
  SUM(views) AS total_views
FROM teachings
WHERE published = 1
  AND published_at IS NOT NULL
  AND published_at >= date('now', '-12 months')
GROUP BY month
ORDER BY month DESC;
```
</details>

---

## Level 4: Data Manipulation

**⚠️ WARNING:** These exercises modify data. Backup first!

```bash
cp local.db backups/local.db.before_manipulation
```

### Exercise 4.1: Add a New Quote
**Objective:** Insert a new quote into the database

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Add this quote:
- Content: "माया महा ठगनी हम जानी।"
- Translation: "I've realized that Maya (illusion) is the great deceiver."
- Category: wisdom
- Language: hi

<details>
<summary>Hint</summary>
Use INSERT INTO with all required fields
</details>

<details>
<summary>Solution</summary>

```sql
INSERT INTO quotes (
  id,
  content,
  translation,
  author,
  category,
  language,
  active,
  created_at,
  updated_at
) VALUES (
  'quote-' || datetime('now', 'unixepoch'),
  'माया महा ठगनी हम जानी।',
  'I''ve realized that Maya (illusion) is the great deceiver.',
  'Sant Kabir Das',
  'wisdom',
  'hi',
  1,
  datetime('now'),
  datetime('now')
);
```

**Verify:**
```sql
SELECT id, content, translation FROM quotes ORDER BY created_at DESC LIMIT 1;
```
</details>

---

### Exercise 4.2: Update Teaching View Count
**Objective:** Increment the view count for a teaching

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Increase the views by 1 for teaching 'teach-001'.

<details>
<summary>Hint</summary>
Use UPDATE with `views = views + 1`
</details>

<details>
<summary>Solution</summary>

```sql
-- Check current count
SELECT id, title, views FROM teachings WHERE id = 'teach-001';

-- Increment
UPDATE teachings
SET views = views + 1
WHERE id = 'teach-001';

-- Verify
SELECT id, title, views FROM teachings WHERE id = 'teach-001';
```
</details>

---

### Exercise 4.3: Publish Multiple Quotes
**Objective:** Bulk activate quotes

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Set active = 1 for all quotes in the 'wisdom' category.

<details>
<summary>Hint</summary>
Use UPDATE with WHERE clause
</details>

<details>
<summary>Solution</summary>

```sql
-- Preview what will be affected
SELECT id, LEFT(content, 30) AS preview, category, active
FROM quotes
WHERE category = 'wisdom';

-- Update
UPDATE quotes
SET active = 1,
    updated_at = datetime('now')
WHERE category = 'wisdom';

-- Verify
SELECT COUNT(*) FROM quotes WHERE category = 'wisdom' AND active = 1;
```
</details>

---

### Exercise 4.4: Add Event Registration
**Objective:** Register a guest for an event

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Register a guest named "Devotee Kumar" (email: devotee@example.com) for event 'event-001'.

<details>
<summary>Hint</summary>
- Insert into event_registrations
- Don't forget to update events.current_attendees!
</details>

<details>
<summary>Solution</summary>

```sql
BEGIN TRANSACTION;

-- Add registration
INSERT INTO event_registrations (
  id,
  event_id,
  guest_name,
  guest_email,
  status,
  attendance_status,
  registered_at
) VALUES (
  'reg-' || datetime('now', 'unixepoch'),
  'event-001',
  'Devotee Kumar',
  'devotee@example.com',
  'confirmed',
  'pending',
  datetime('now')
);

-- Update event count
UPDATE events
SET current_attendees = current_attendees + 1,
    updated_at = datetime('now')
WHERE id = 'event-001';

-- Verify
SELECT e.title, e.current_attendees, r.guest_name
FROM events e
JOIN event_registrations r ON e.id = r.event_id
WHERE e.id = 'event-001';

COMMIT;
```
</details>

---

### Exercise 4.5: Soft Delete and Restore
**Objective:** Practice safe content deletion

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
1. Soft delete a teaching (set deleted_at)
2. Verify it's hidden
3. Restore it

<details>
<summary>Hint</summary>
- Soft delete: SET deleted_at = datetime('now')
- Restore: SET deleted_at = NULL
</details>

<details>
<summary>Solution</summary>

```sql
-- Step 1: Soft delete
UPDATE teachings
SET deleted_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-001';

-- Step 2: Verify it's marked deleted
SELECT id, title, deleted_at FROM teachings WHERE id = 'teach-001';

-- Step 3: Check it won't appear in active queries
SELECT COUNT(*) FROM teachings
WHERE deleted_at IS NULL;  -- Should not include teach-001

-- Step 4: Restore
UPDATE teachings
SET deleted_at = NULL,
    updated_at = datetime('now')
WHERE id = 'teach-001';

-- Step 5: Verify restoration
SELECT id, title, deleted_at FROM teachings WHERE id = 'teach-001';
```
</details>

---

## Level 5: Real-World Scenarios

### Exercise 5.1: Dashboard Stats
**Objective:** Create a complete dashboard summary

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Create a single query that shows:
- Total published teachings
- Total upcoming events
- Total active quotes
- Total newsletter subscribers
- Total users

<details>
<summary>Solution</summary>

```sql
SELECT
  'Published Teachings' AS metric,
  COUNT(*) AS count
FROM teachings
WHERE published = 1 AND deleted_at IS NULL

UNION ALL

SELECT
  'Upcoming Events',
  COUNT(*)
FROM events
WHERE start_date >= date('now') AND published = 1

UNION ALL

SELECT
  'Active Quotes',
  COUNT(*)
FROM quotes
WHERE active = 1

UNION ALL

SELECT
  'Newsletter Subscribers',
  COUNT(*)
FROM newsletters
WHERE status = 'active'

UNION ALL

SELECT
  'Total Users',
  COUNT(*)
FROM users;
```
</details>

---

### Exercise 5.2: Event Attendance Report
**Objective:** Generate report for event organizers

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
For each upcoming event, show:
- Event name
- Date
- Total capacity
- Registrations
- Fill rate (%)
- Status (Available/Almost Full/Full)

<details>
<summary>Solution</summary>

```sql
SELECT
  e.title,
  e.start_date,
  e.max_attendees AS capacity,
  COUNT(r.id) AS registrations,
  ROUND((COUNT(r.id) * 100.0 / e.max_attendees), 1) AS fill_rate,
  CASE
    WHEN COUNT(r.id) >= e.max_attendees THEN 'FULL'
    WHEN COUNT(r.id) >= e.max_attendees * 0.8 THEN 'Almost Full'
    ELSE 'Available'
  END AS status
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id
WHERE e.published = 1
  AND e.start_date >= date('now')
GROUP BY e.id
ORDER BY e.start_date;
```
</details>

---

### Exercise 5.3: Content Freshness Audit
**Objective:** Find old content that needs updating

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Show teachings that haven't been updated in over 6 months, with their:
- Title
- Last updated date
- Days since last update
- View count

<details>
<summary>Solution</summary>

```sql
SELECT
  title,
  updated_at,
  CAST((julianday('now') - julianday(updated_at)) AS INTEGER) AS days_since_update,
  views
FROM teachings
WHERE published = 1
  AND deleted_at IS NULL
  AND updated_at < date('now', '-6 months')
ORDER BY updated_at ASC;
```
</details>

---

### Exercise 5.4: Newsletter Subscriber Growth
**Objective:** Visualize newsletter growth over time

**Difficulty:** ⭐⭐⭐ Hard

**Your Task:**
Show new subscribers per month for the last 12 months, with cumulative total.

<details>
<summary>Solution</summary>

```sql
SELECT
  strftime('%Y-%m', subscribed_at) AS month,
  COUNT(*) AS new_subscribers,
  SUM(COUNT(*)) OVER (ORDER BY strftime('%Y-%m', subscribed_at)) AS cumulative_total
FROM newsletters
WHERE status = 'active'
  AND subscribed_at >= date('now', '-12 months')
GROUP BY month
ORDER BY month DESC;
```
</details>

---

### Exercise 5.5: Complete Backup Export
**Objective:** Export data for Excel analysis

**Difficulty:** ⭐⭐ Medium

**Your Task:**
Export all published teachings to CSV with relevant columns.

<details>
<summary>Solution</summary>

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
  ROUND((likes * 100.0 / NULLIF(views, 0)), 2) AS engagement_rate,
  reading_time,
  published_at,
  created_at
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
ORDER BY views DESC;

.output stdout
.mode column
```

**Result:** File `teachings_export.csv` ready for Excel!
</details>

---

## Bonus Challenges

### Challenge 1: Find Inactive Users
Find users who haven't registered for any events and haven't commented.

### Challenge 2: Event Popularity Prediction
Calculate which event types (online/in-person/hybrid) get the most registrations on average.

### Challenge 3: Content Engagement Score
Create a formula combining views, likes, and comments to rank content by engagement.

### Challenge 4: Automated Cleanup Script
Write a query that cleans up:
- Expired sessions (> 7 days old)
- Old analytics (> 90 days)
- Purge-ready trash items

### Challenge 5: Monthly Growth Report
Create one query that shows month-over-month growth for:
- New teachings
- New users
- Newsletter subscribers
- Event registrations

---

## Practice Tips

1. **Work through exercises in order** - they build on each other
2. **Try before looking at hints** - struggle is how you learn
3. **Understand, don't just copy** - modify queries to experiment
4. **Break complex queries into steps** - build gradually
5. **Use transactions for safety** - BEGIN/COMMIT/ROLLBACK
6. **Keep notes** - document queries you find useful

---

## Next Steps

After completing these exercises:

1. **Review guides you struggled with**
2. **Practice with your own queries**
3. **Set up automated backups** (Guide 07)
4. **Create custom reports** (Guide 06)
5. **Build database maintenance routine** (Guide 07)

---

**Congratulations on completing the exercises!** You now have practical SQLite skills for managing Kabir Sant Sharan database.

**Keep the [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) handy for daily work!**