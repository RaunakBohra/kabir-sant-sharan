# Basic SQLite Commands

## What You'll Learn
- SQLite dot commands (special commands starting with `.`)
- SQL query structure (SELECT, WHERE, ORDER BY)
- How to format and read output
- Real examples using your teachings and events tables
- Practice exercises with solutions

**Time required:** 45-60 minutes

---

## Part 1: Two Types of Commands

SQLite has **two types** of commands:

### 1. Dot Commands (SQLite-specific)
- Start with a period (`.`)
- Control SQLite behavior
- Show database structure
- Format output
- **No semicolon needed**

Examples: `.tables`, `.schema`, `.mode`, `.help`

### 2. SQL Commands (Standard database language)
- Standard SQL syntax
- Query and modify data
- **Must end with semicolon (;)**

Examples: `SELECT * FROM teachings;`, `INSERT INTO events...;`

---

## Part 2: Essential Dot Commands

### Open Your Database First

```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
sqlite3 local.db
```

### .help - Get Help

```sql
.help
```

**What it does:** Shows all available dot commands with descriptions

**When to use:** Forget a command? Run `.help`!

### .tables - List All Tables

```sql
.tables
```

**Output:**
```
analytics             media                 teachings
comments              newsletter_campaigns  trash
contact_messages      newsletters           users
event_registrations   quotes
events                sessions
```

**What it shows:** All 14 tables in your database

### .schema - View Table Structure

**View one table:**
```sql
.schema teachings
```

**Output:**
```sql
CREATE TABLE teachings (
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
```

**View all tables:**
```sql
.schema
```

**Understanding the output:**
- `TEXT PRIMARY KEY` - Unique identifier, text type
- `NOT NULL` - This field is required
- `DEFAULT 0` - If not provided, use 0
- `UNIQUE` - No duplicates allowed
- `INTEGER` - Whole number
- `BOOLEAN` stored as INTEGER (0=false, 1=true)

### .mode - Change Output Format

**Available modes:**

```sql
.mode list      -- Values separated by |
.mode column    -- Aligned columns (easiest to read)
.mode csv       -- Comma-separated (for Excel)
.mode json      -- JSON format
.mode markdown  -- Markdown table
.mode table     -- Pretty box format
```

**Example - Try different modes:**

```sql
-- Column mode (recommended)
.mode column
.headers on
SELECT title, author, views FROM teachings LIMIT 2;
```

**Output:**
```
title                          author          views
-----------------------------  --------------  -----
Path to Enlightenment          Sant Kabir Das  342
```

```sql
-- JSON mode
.mode json
SELECT title, views FROM teachings LIMIT 1;
```

**Output:**
```json
[
  {
    "title": "Path to Enlightenment",
    "views": 342
  }
]
```

```sql
-- CSV mode (for exporting)
.mode csv
.headers on
SELECT title, views FROM teachings;
```

**Output:**
```
title,views
"Path to Enlightenment",342
```

**Pro tip:** Set your preferred mode in `~/.sqliterc` so it's always active!

### .headers - Show/Hide Column Names

```sql
.headers on   -- Show column names
.headers off  -- Hide column names
```

**Example:**
```sql
.headers on
SELECT title, views FROM teachings LIMIT 1;
```

**Output (with headers):**
```
title                    views
-----------------------  -----
Path to Enlightenment    342
```

**Without headers:**
```sql
.headers off
SELECT title, views FROM teachings LIMIT 1;
```

**Output:**
```
Path to Enlightenment    342
```

### .width - Set Column Widths

**Syntax:**
```sql
.width 30 15 10
```

**What it means:** Column 1 = 30 chars, Column 2 = 15 chars, Column 3 = 10 chars

**Example:**
```sql
.mode column
.width 40 20 10
SELECT title, author, views FROM teachings;
```

**Result:** Title gets 40 characters, author gets 20, views gets 10

### .output - Save Results to File

**Save to file:**
```sql
.output teachings_report.txt
SELECT * FROM teachings;
.output stdout
```

**What happened:**
1. `.output teachings_report.txt` - Redirect output to file
2. Query runs - Results go to file instead of screen
3. `.output stdout` - Return output to screen

**Use case:** Generate reports to share with others!

**Export as CSV:**
```sql
.mode csv
.headers on
.output teachings_export.csv
SELECT id, title, author, published, views FROM teachings;
.output stdout
.mode column
```

Now you have a CSV file you can open in Excel!

### .once - Output Next Command Only

**Syntax:**
```sql
.once filename.txt
SELECT * FROM teachings;
```

**What it does:** Only the next query goes to file, then automatically returns to screen

**Difference from .output:**
- `.output` - All subsequent commands go to file (until you reset)
- `.once` - Only next command goes to file

### .quit or .exit - Exit SQLite

```sql
.quit
```

**Or press:** `Ctrl + D`

**What it does:** Closes SQLite and returns to Terminal

---

## Part 3: SQL Query Basics

### SELECT - Retrieve Data

**Syntax:**
```sql
SELECT column1, column2 FROM table_name;
```

**Select all columns:**
```sql
SELECT * FROM teachings;
```

**Select specific columns:**
```sql
SELECT title, author, views FROM teachings;
```

**Real example:**
```sql
SELECT title, category, published FROM teachings;
```

**Output:**
```
title                          category        published
-----------------------------  --------------  ---------
Path to Enlightenment          spirituality    1
```

### WHERE - Filter Results

**Syntax:**
```sql
SELECT columns FROM table WHERE condition;
```

**Example 1: Published teachings only**
```sql
SELECT title, views
FROM teachings
WHERE published = 1;
```

**Example 2: Specific category**
```sql
SELECT title, author
FROM teachings
WHERE category = 'meditation';
```

**Example 3: High views**
```sql
SELECT title, views
FROM teachings
WHERE views > 100;
```

**Example 4: Multiple conditions (AND)**
```sql
SELECT title, views
FROM teachings
WHERE published = 1 AND views > 50;
```

**Example 5: Multiple conditions (OR)**
```sql
SELECT title
FROM teachings
WHERE category = 'meditation' OR category = 'spirituality';
```

### ORDER BY - Sort Results

**Syntax:**
```sql
SELECT columns FROM table ORDER BY column ASC/DESC;
```

**Ascending (A→Z, 0→9):**
```sql
SELECT title, views
FROM teachings
ORDER BY views ASC;
```

**Descending (Z→A, 9→0):**
```sql
SELECT title, views
FROM teachings
ORDER BY views DESC;
```

**Multiple columns:**
```sql
SELECT title, category, views
FROM teachings
ORDER BY category ASC, views DESC;
```

**What it does:** Sort by category first, then within each category, sort by views (highest first)

### LIMIT - Limit Number of Results

**Syntax:**
```sql
SELECT columns FROM table LIMIT number;
```

**Top 5 most viewed teachings:**
```sql
SELECT title, views
FROM teachings
WHERE published = 1
ORDER BY views DESC
LIMIT 5;
```

**Skip and limit (pagination):**
```sql
SELECT title, views
FROM teachings
LIMIT 10 OFFSET 20;
```

**What it does:** Skip first 20 rows, then show next 10 (useful for page 3 of results)

### COUNT - Count Rows

**Count all teachings:**
```sql
SELECT COUNT(*) FROM teachings;
```

**Count published teachings:**
```sql
SELECT COUNT(*) FROM teachings WHERE published = 1;
```

**Count with alias (named result):**
```sql
SELECT COUNT(*) AS total_teachings FROM teachings;
```

**Output:**
```
total_teachings
---------------
1
```

### Other Aggregate Functions

**SUM - Total of numeric column:**
```sql
SELECT SUM(views) AS total_views FROM teachings;
```

**AVG - Average:**
```sql
SELECT AVG(views) AS average_views FROM teachings;
```

**MAX - Highest value:**
```sql
SELECT MAX(views) AS most_viewed FROM teachings;
```

**MIN - Lowest value:**
```sql
SELECT MIN(views) AS least_viewed FROM teachings WHERE views > 0;
```

**Example combining them:**
```sql
SELECT
  COUNT(*) AS total,
  SUM(views) AS total_views,
  AVG(views) AS avg_views,
  MAX(views) AS max_views
FROM teachings
WHERE published = 1;
```

---

## Part 4: Working with Dates

Your database stores dates as TEXT in format: `2025-09-30 10:30:00`

### Current date/time:
```sql
SELECT datetime('now');
```

**Output:** `2025-09-30 14:23:45`

### Date comparisons:

**Events happening today or later:**
```sql
SELECT title, start_date
FROM events
WHERE start_date >= date('now');
```

**Events from last 30 days:**
```sql
SELECT title, created_at
FROM events
WHERE created_at >= date('now', '-30 days');
```

**Events in September 2025:**
```sql
SELECT title, start_date
FROM events
WHERE start_date LIKE '2025-09%';
```

**Format dates nicely:**
```sql
SELECT
  title,
  strftime('%d %B %Y', start_date) AS formatted_date
FROM events;
```

**Output:** `30 September 2025`

---

## Part 5: Real Examples with Your Database

### Example 1: View All Published Teachings

```sql
SELECT
  title,
  author,
  category,
  views,
  published_at
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
ORDER BY published_at DESC;
```

**Explanation:**
- Show title, author, category, views, publish date
- Only published teachings (`published = 1`)
- Not deleted (`deleted_at IS NULL`)
- Newest first (`ORDER BY published_at DESC`)

### Example 2: Upcoming Events

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

**What it shows:** All upcoming published events, sorted by date/time

### Example 3: Most Popular Teachings

```sql
SELECT
  title,
  views,
  likes,
  category
FROM teachings
WHERE published = 1
ORDER BY views DESC
LIMIT 10;
```

**Use case:** See which teachings resonate most with visitors

### Example 4: Event Registration Summary

```sql
SELECT
  e.title AS event_name,
  e.start_date,
  e.current_attendees,
  e.max_attendees,
  (e.max_attendees - e.current_attendees) AS spots_left
FROM events e
WHERE e.published = 1
  AND e.start_date >= date('now')
ORDER BY e.start_date;
```

**What it shows:** Each event with attendee counts and spots remaining

### Example 5: Newsletter Subscriber Growth

```sql
SELECT
  date(subscribed_at) AS signup_date,
  COUNT(*) AS new_subscribers
FROM newsletters
WHERE status = 'active'
GROUP BY date(subscribed_at)
ORDER BY signup_date DESC
LIMIT 30;
```

**What it shows:** Daily newsletter signups for last 30 days

### Example 6: Content by Category

```sql
SELECT
  category,
  COUNT(*) AS teaching_count,
  SUM(views) AS total_views,
  AVG(views) AS avg_views
FROM teachings
WHERE published = 1 AND deleted_at IS NULL
GROUP BY category
ORDER BY teaching_count DESC;
```

**What it shows:** How many teachings per category and their performance

---

## Part 6: Combining Commands

### Example: Generate CSV Report of All Events

```sql
-- Set up output format
.mode csv
.headers on
.output events_report.csv

-- Run query
SELECT
  title,
  type,
  start_date,
  start_time,
  location,
  current_attendees,
  max_attendees,
  organizer
FROM events
WHERE published = 1 AND deleted_at IS NULL
ORDER BY start_date;

-- Reset output
.output stdout
.mode column
```

**Result:** `events_report.csv` file ready to open in Excel!

### Example: Quick Database Health Check

```sql
.mode column
.headers on

-- Count records in each table
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Teachings', COUNT(*) FROM teachings
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Quotes', COUNT(*) FROM quotes
UNION ALL
SELECT 'Newsletters', COUNT(*) FROM newsletters
ORDER BY count DESC;
```

**Output:**
```
table_name   count
-----------  -----
Teachings    1
Events       1
Users        1
Quotes       0
Newsletters  0
```

---

## Part 7: Safe Practices

### Always Preview Before Modifying

**WRONG:**
```sql
DELETE FROM teachings WHERE views < 10;  -- Deletes immediately!
```

**RIGHT:**
```sql
-- Step 1: Preview what will be deleted
SELECT title, views FROM teachings WHERE views < 10;

-- Step 2: If it looks correct, then delete
-- (We'll cover DELETE in the next guide)
```

### Use Transactions for Multiple Changes

```sql
BEGIN TRANSACTION;

-- Make your changes here
UPDATE teachings SET featured = 1 WHERE id = 'teach-001';
UPDATE teachings SET featured = 0 WHERE id = 'teach-002';

-- Check if it looks good
SELECT id, title, featured FROM teachings;

-- If good:
COMMIT;

-- If something's wrong:
-- ROLLBACK;
```

**What this does:**
- `BEGIN TRANSACTION` - Start tracking changes
- Make changes
- `COMMIT` - Save all changes
- `ROLLBACK` - Undo all changes (if needed)

---

## Part 8: Practice Exercises

### Exercise 1: Count Published Content
**Task:** Count how many published teachings you have

**Solution:**
```sql
SELECT COUNT(*) AS published_teachings
FROM teachings
WHERE published = 1 AND deleted_at IS NULL;
```

### Exercise 2: List All Event Types
**Task:** See what types of events you're hosting

**Solution:**
```sql
SELECT DISTINCT type FROM events;
```

### Exercise 3: Find Most Liked Teaching
**Task:** Which teaching has the most likes?

**Solution:**
```sql
SELECT title, likes, views
FROM teachings
WHERE published = 1
ORDER BY likes DESC
LIMIT 1;
```

### Exercise 4: Events This Month
**Task:** Show all events happening in the current month

**Solution:**
```sql
SELECT title, start_date, location
FROM events
WHERE strftime('%Y-%m', start_date) = strftime('%Y-%m', 'now')
  AND published = 1
ORDER BY start_date;
```

### Exercise 5: Average Reading Time
**Task:** What's the average reading time for teachings?

**Solution:**
```sql
SELECT AVG(reading_time) AS avg_minutes
FROM teachings
WHERE reading_time IS NOT NULL;
```

### Exercise 6: Contact Messages by Category
**Task:** Group contact messages by category and count them

**Solution:**
```sql
SELECT category, COUNT(*) AS message_count
FROM contact_messages
GROUP BY category
ORDER BY message_count DESC;
```

### Exercise 7: Recent Activity
**Task:** Show 10 most recently created teachings

**Solution:**
```sql
SELECT title, author, created_at
FROM teachings
ORDER BY created_at DESC
LIMIT 10;
```

### Exercise 8: Search by Keyword
**Task:** Find all teachings with "meditation" in the title

**Solution:**
```sql
SELECT title, category
FROM teachings
WHERE title LIKE '%meditation%'
  AND published = 1;
```

**Note:** `LIKE` is case-insensitive in SQLite. `%` means "any characters"

---

## Part 9: Common Mistakes to Avoid

### Mistake 1: Forgetting Semicolon on SQL Commands

**WRONG:**
```sql
SELECT * FROM teachings
sqlite>
```
**Nothing happens! SQLite is waiting for more input or a semicolon**

**RIGHT:**
```sql
SELECT * FROM teachings;
```

### Mistake 2: Using Dot Commands with Semicolons

**WRONG:**
```sql
.tables;
```
**Error!**

**RIGHT:**
```sql
.tables
```

### Mistake 3: Comparing Boolean as Text

**WRONG:**
```sql
SELECT * FROM teachings WHERE published = 'true';
```
**Won't work! Booleans are stored as 0/1**

**RIGHT:**
```sql
SELECT * FROM teachings WHERE published = 1;
```

### Mistake 4: Missing Quotes on Text Values

**WRONG:**
```sql
SELECT * FROM teachings WHERE category = meditation;
```
**Error: no such column: meditation**

**RIGHT:**
```sql
SELECT * FROM teachings WHERE category = 'meditation';
```

### Mistake 5: Using = Instead of LIKE for Partial Matches

**WRONG:**
```sql
SELECT * FROM teachings WHERE title = '%enlightenment%';
```
**This looks for exact match including the % symbols**

**RIGHT:**
```sql
SELECT * FROM teachings WHERE title LIKE '%enlightenment%';
```

---

## Part 10: Quick Command Reference

### Dot Commands Cheat Sheet

| Command | Purpose | Example |
|---------|---------|---------|
| `.tables` | List all tables | `.tables` |
| `.schema TABLE` | Show table structure | `.schema teachings` |
| `.mode MODE` | Set output format | `.mode column` |
| `.headers on/off` | Show/hide column names | `.headers on` |
| `.width N N N` | Set column widths | `.width 30 15 10` |
| `.output FILE` | Save to file | `.output report.txt` |
| `.once FILE` | Save next query only | `.once data.csv` |
| `.help` | Show all commands | `.help` |
| `.quit` | Exit SQLite | `.quit` |

### SQL Commands Cheat Sheet

| Command | Purpose | Example |
|---------|---------|---------|
| `SELECT` | Retrieve data | `SELECT * FROM teachings;` |
| `WHERE` | Filter results | `WHERE published = 1` |
| `ORDER BY` | Sort results | `ORDER BY views DESC` |
| `LIMIT` | Limit results | `LIMIT 10` |
| `COUNT()` | Count rows | `SELECT COUNT(*) FROM events;` |
| `SUM()` | Total | `SELECT SUM(views) FROM teachings;` |
| `AVG()` | Average | `SELECT AVG(views) FROM teachings;` |
| `GROUP BY` | Group results | `GROUP BY category` |
| `LIKE` | Pattern match | `WHERE title LIKE '%kabir%'` |

---

## What's Next?

You now know the essential commands! Let's put them to work viewing your actual data.

**→ Continue to [04-VIEWING-DATA.md](./04-VIEWING-DATA.md)**

In the next guide, you'll:
- Explore every table in your database
- View and understand your teachings data
- Browse events and registrations
- Check user information
- Generate your first real reports

---

## Additional Resources

### SQLite Official Documentation
- https://sqlite.org/lang.html (SQL syntax)
- https://sqlite.org/cli.html (Command-line reference)

### Practice SQL Online
- https://sqliteonline.com/ (Try queries without risk)

### SQL Learning Sites
- https://www.sqlitetutorial.net/
- https://www.w3schools.com/sql/

---

**Keep this guide handy as a reference!** You'll use these commands constantly.

**Ready to explore your data?** → [04-VIEWING-DATA.md](./04-VIEWING-DATA.md)