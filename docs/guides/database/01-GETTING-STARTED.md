# Getting Started with SQLite

## What You'll Learn
By the end of this guide, you'll understand:
- What a database is and why you need it
- How SQLite works
- Your Kabir Sant Sharan database structure
- Basic database concepts without technical jargon

---

## Part 1: Database Basics (Simple Explanation)

### What is a Database?
Think of a database as a **digital filing cabinet**. Instead of paper folders, you have **tables**. Each table stores related information in an organized way.

**Real-world analogy:**
- **Filing Cabinet** = Your entire database (`local.db`)
- **Folders** = Tables (like `teachings`, `events`, `users`)
- **Papers in folders** = Rows of data (individual teachings, events, users)
- **Labels on papers** = Columns (title, date, email, etc.)

### What is SQLite?
SQLite is a **lightweight database system** that stores everything in a single file. For your project:
- Your database file: `local.db` (located in your project root)
- No server needed - it's just a file on your computer
- Perfect for small to medium projects like Kabir Sant Sharan

**Why SQLite for this project?**
- Free and simple
- Works with Cloudflare D1 (your hosting platform)
- Fast enough for thousands of teachings and events
- Easy to backup (just copy the file!)

---

## Part 2: Understanding Your Database

### Your Kabir Sant Sharan Database Structure

Your database contains **14 tables**. Here's what each one does:

#### Core Content Tables (What visitors see)
1. **teachings** - Sant Kabir's teachings and articles
2. **events** - Spiritual events and gatherings
3. **quotes** - Daily inspirational quotes
4. **media** - Audio/video recordings of bhajans and discourses

#### User & Community Tables
5. **users** - Registered community members
6. **comments** - Comments on teachings and events
7. **newsletters** - Newsletter subscribers
8. **newsletter_campaigns** - Sent newsletters
9. **contact_messages** - Contact form submissions

#### System Tables (Behind the scenes)
10. **sessions** - User login sessions
11. **analytics** - Website usage statistics
12. **event_registrations** - Who registered for which event
13. **trash** - Deleted content (recoverable for 30 days)

### How Tables Connect

Tables are **related** to each other. Example:

```
USER (John)
    ↓
    registers for → EVENT (Meditation Workshop)
    ↓
    creates → EVENT_REGISTRATION (John's registration)
```

**Real example from your database:**
- A teaching has an `author` field
- An event has `current_attendees` count
- Event registrations link to both `events` and `users` tables

---

## Part 3: Key Concepts You Need to Know

### 1. Tables
A table stores similar data in rows and columns.

**Example: `teachings` table**
```
| id          | title                    | author      | published |
|-------------|--------------------------|-------------|-----------|
| teach-001   | Path to Enlightenment    | Kabir Das   | 1         |
| teach-002   | Divine Love              | Kabir Das   | 1         |
```

### 2. Columns (Fields)
Columns define what information each row can store.

**The `teachings` table has these columns:**
- `id` - Unique identifier
- `title` - Teaching title
- `content` - Full text of the teaching
- `author` - Who wrote it
- `published` - Is it live on the website? (1=yes, 0=no)
- `created_at` - When it was created
- `views` - How many times it's been viewed

### 3. Rows (Records)
Each row is one item (one teaching, one event, one user).

**Example: One teaching row**
```
id: teach-001
title: Path to Enlightenment
author: Sant Kabir Das
published: 1
views: 342
created_at: 2025-09-15 10:30:00
```

### 4. Primary Keys
Every row needs a unique identifier called a **primary key**. In your database, most tables use `id` as the primary key.

**Why?** So you can say "Show me teaching with id='teach-001'" and get exactly one result.

### 5. Data Types

Your database uses these main types:

| Type    | What it stores              | Example                    |
|---------|-----------------------------|-----------------------------|
| TEXT    | Words, sentences            | "Path to Enlightenment"     |
| INTEGER | Whole numbers               | 342 (views)                 |
| BOOLEAN | True/False (stored as 0/1)  | 1 (published=yes)           |

**Note:** SQLite stores dates as TEXT in format: `2025-09-15 10:30:00`

---

## Part 4: Your Database File Location

### Where is Your Database?

```
/Users/raunakbohra/Desktop/kabir-sant-sharan/
    └── local.db  ← Your database is here!
```

**Important files in your project:**
```
kabir-sant-sharan/
├── local.db              ← The actual database
├── drizzle/
│   └── schema.ts         ← Defines table structure (for developers)
└── src/
    └── lib/
        └── database-service.ts  ← Code that talks to database
```

### Database vs Code
- **Database (`local.db`)**: Stores the actual data (teachings, events, users)
- **Schema (`drizzle/schema.ts`)**: Blueprint of how tables are structured
- **Code (`database-service.ts`)**: Application code that reads/writes to database

**Analogy:**
- Database = The library building with books
- Schema = Floor plan of the library
- Code = Librarian who helps you find books

---

## Part 5: What You Can Do with Your Database

### View-Only Operations (Safe)
✓ See all teachings
✓ Count how many events you have
✓ Search for specific quotes
✓ Generate reports (e.g., "most viewed teachings")
✓ Export data to Excel/CSV

### Modification Operations (Be Careful!)
⚠️ Add new teaching
⚠️ Update event details
⚠️ Delete quotes
⚠️ Change user information

**Golden Rule:** Always backup before modifying data!

---

## Part 6: Two Ways to Work with Your Database

### Method 1: Command Line (sqlite3)
- Text-based interface
- Fast and powerful
- Preferred by developers
- **This is what we'll focus on in these guides**

```bash
# Open your database
sqlite3 /Users/raunakbohra/Desktop/kabir-sant-sharan/local.db

# Run a command
SELECT * FROM teachings;
```

### Method 2: Visual Tool (DB Browser for SQLite)
- Graphical interface with buttons
- Easier for beginners
- Great for browsing data
- We'll set this up in the next guide

---

## Part 7: Understanding Current Database State

### What's in Your Database Right Now?

Based on your current setup:

**Tables:** 14 tables
**Current Data:**
- Users: 1 admin user
- Teachings: 1 teaching (your first one!)
- Events: 1 event
- Other tables: Currently empty or with minimal test data

**This is perfect for learning!** You have:
✓ A working database structure
✓ Sample data to practice with
✓ Room to add more content

---

## Part 8: Database Workflow for Kabir Sant Sharan

### Typical Tasks You'll Do:

#### Daily Content Management
1. **Add new teaching**
   - Write content in your CMS
   - It gets saved to `teachings` table
   - Set `published=1` to make it live

2. **Create event**
   - Add event details
   - Saved to `events` table
   - Users can register (saves to `event_registrations`)

3. **View analytics**
   - Check most viewed teachings
   - See event registration counts
   - Review contact form messages

#### Weekly Maintenance
1. Check newsletter subscriber growth
2. Review and respond to contact messages
3. Monitor trash table for accidentally deleted content

#### Monthly Tasks
1. Backup database
2. Generate monthly reports
3. Clean up old analytics data

---

## Part 9: Safety Tips (VERY IMPORTANT!)

### Before You Start:

1. **Always backup before making changes**
   ```bash
   cp local.db local.db.backup
   ```

2. **Test queries with SELECT first**
   - Wrong: `DELETE FROM teachings` (deletes everything!)
   - Right: `SELECT * FROM teachings WHERE id='teach-001'` (just view it first)

3. **Never delete the database file itself**
   - Your project instructions say: "Never reset DB at any cost!!"
   - You can delete rows inside tables, but never the whole file

4. **Use soft deletes when possible**
   - Set `deleted_at` timestamp instead of actually deleting
   - Content goes to `trash` table for 30 days
   - Can be restored if you make a mistake

### Common Mistakes to Avoid:
❌ Running DELETE without WHERE clause (deletes everything!)
❌ Forgetting to backup before updates
❌ Modifying production database directly (always use staging)
❌ Sharing database file publicly (contains user emails!)

---

## Part 10: Your Learning Path

### Suggested Order:

1. **✓ You are here:** Understanding database basics
2. **Next:** Install SQLite tools (Guide 02)
3. **Then:** Learn basic commands (Guide 03)
4. **After that:** View your data (Guide 04)
5. **Practice:** Manage content (Guide 05)
6. **Advanced:** Search and reports (Guide 06)
7. **Master:** Backup and maintenance (Guide 07)

### Time Estimate:
- Reading all guides: 2-3 hours
- Practicing exercises: 3-4 hours
- **Total to basic proficiency:** 1 day
- **Master level:** 1 week of practice

---

## Quick Glossary

| Term | Simple Explanation | Example |
|------|-------------------|---------|
| **Database** | File that stores all your data | `local.db` |
| **Table** | Collection of similar items | `teachings`, `events` |
| **Row** | One item in a table | One teaching |
| **Column** | Property of an item | `title`, `author` |
| **Query** | Question you ask the database | "Show all published teachings" |
| **SQL** | Language to talk to database | `SELECT * FROM teachings` |
| **Primary Key** | Unique ID for each row | `id` column |
| **Foreign Key** | Link to another table | `user_id` in registrations |

---

## What's Next?

Now that you understand the basics, let's get your tools set up!

**→ Continue to [02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md)**

In the next guide, you'll:
- Install SQLite command-line tool
- Install DB Browser (visual tool)
- Connect to your database
- Run your first query!

---

## Questions & Troubleshooting

### "Is my database file safe to open?"
Yes! Opening and reading (`SELECT`) is completely safe. Your database is designed to be accessed.

### "What if I break something?"
That's why we backup first! You can always restore from backup. Also, the `trash` table keeps deleted content for 30 days.

### "Do I need to know programming?"
No! These guides teach you database skills, not programming. You'll use simple commands like `SELECT`, `INSERT`, and `UPDATE`.

### "Will this work on Windows?"
The concepts are identical. Commands are 99% the same. Installation steps differ slightly (covered in Guide 02).

---

**Ready to install tools and start practicing?** Let's go!

**→ [02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md)**