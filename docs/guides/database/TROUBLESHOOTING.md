# Troubleshooting Guide

**Common SQLite errors and how to fix them**

---

## Error Categories

1. [Connection & File Errors](#connection--file-errors)
2. [Syntax Errors](#syntax-errors)
3. [Constraint Errors](#constraint-errors)
4. [Data Type Errors](#data-type-errors)
5. [Performance Issues](#performance-issues)
6. [Corruption Issues](#corruption-issues)

---

## Connection & File Errors

### Error: "unable to open database file"

**Cause:** Database file doesn't exist or wrong path

**Solution:**
```bash
# Check if file exists
ls -l /Users/raunakbohra/Desktop/kabir-sant-sharan/local.db

# Verify current directory
pwd

# Navigate to correct location
cd /Users/raunakbohra/Desktop/kabir-sant-sharan

# Then open
sqlite3 local.db
```

---

### Error: "database is locked"

**Cause:** Another process is using the database

**Common causes:**
1. Dev server is running (`npm run dev`)
2. Another SQLite session is open
3. DB Browser is open with the database
4. Previous connection didn't close properly

**Solution:**

**Step 1: Find what's using it**
```bash
lsof | grep local.db
```

**Step 2: Close interfering programs**
- Close DB Browser
- Stop dev server: Press `Ctrl+C` in terminal where it's running
- Close other SQLite sessions

**Step 3: If nothing works, wait**
```bash
# SQLite auto-releases locks after timeout
# Wait 30 seconds and try again
```

**Step 4: Force kill if necessary**
```bash
# Find process ID
lsof | grep local.db
# Output shows PID (process ID)

# Kill it (replace 12345 with actual PID)
kill 12345
```

**Prevention:**
- Always use `.quit` to exit SQLite properly
- Don't edit database while dev server runs
- Close DB Browser when using command line

---

### Error: "disk I/O error"

**Cause:** Disk full, permissions issue, or corrupted file

**Solution:**

**Check disk space:**
```bash
df -h ~/Desktop
```

**Check permissions:**
```bash
ls -l local.db
# Should show: -rw-r--r-- or similar

# Fix if needed:
chmod 644 local.db
```

**Check ownership:**
```bash
ls -l local.db
# Should show your username

# Fix if needed:
chown $(whoami) local.db
```

---

## Syntax Errors

### Error: "near 'FROM': syntax error"

**Cause:** Missing or extra keywords

**Common mistakes:**
```sql
-- WRONG: Missing SELECT
FROM teachings;

-- RIGHT:
SELECT * FROM teachings;

-- WRONG: Extra comma
SELECT title, author, FROM teachings;

-- RIGHT:
SELECT title, author FROM teachings;
```

---

### Error: "incomplete input"

**Cause:** Missing semicolon or unclosed quotes

**Examples:**
```sql
-- WRONG: No semicolon
SELECT * FROM teachings
sqlite>  ← Still waiting for ;

-- RIGHT:
SELECT * FROM teachings;

-- WRONG: Unclosed quote
SELECT * FROM teachings WHERE title = 'Path to Enlightenment;

-- RIGHT:
SELECT * FROM teachings WHERE title = 'Path to Enlightenment';
```

**Fix:** Add semicolon or close quotes, press Enter

---

### Error: "no such table: Teachings"

**Cause:** Table name is case-sensitive or typo

**Solution:**
```sql
-- WRONG: Capital T
SELECT * FROM Teachings;

-- RIGHT: Lowercase
SELECT * FROM teachings;

-- Check exact table names:
.tables
```

**Note:** Table names in SQLite are case-sensitive!

---

### Error: "no such column: Title"

**Cause:** Column name wrong or doesn't exist

**Solution:**
```sql
-- Check actual column names:
.schema teachings

-- Or:
PRAGMA table_info(teachings);

-- Common issue - wrong case:
-- WRONG: SELECT Title FROM teachings;
-- RIGHT: SELECT title FROM teachings;
```

---

## Constraint Errors

### Error: "UNIQUE constraint failed: users.email"

**Cause:** Trying to insert duplicate unique value

**Example:**
```sql
-- This fails if email already exists:
INSERT INTO users (id, email, name, role)
VALUES ('user-002', 'admin@kabirsantsharan.com', 'Admin', 'admin');
```

**Solution:**

**Check if exists first:**
```sql
SELECT * FROM users WHERE email = 'admin@kabirsantsharan.com';
```

**Use different email OR update existing:**
```sql
UPDATE users
SET name = 'New Name'
WHERE email = 'admin@kabirsantsharan.com';
```

**Or use INSERT OR REPLACE:**
```sql
INSERT OR REPLACE INTO users (id, email, name, role)
VALUES ('user-002', 'admin@kabirsantsharan.com', 'Admin', 'admin');
```

---

### Error: "NOT NULL constraint failed: teachings.title"

**Cause:** Required field is missing

**Example:**
```sql
-- WRONG: Missing required field
INSERT INTO teachings (id, content)
VALUES ('teach-002', 'Some content');
```

**Solution:** Include all required (NOT NULL) fields
```sql
-- RIGHT:
INSERT INTO teachings (id, title, content, excerpt, slug, category, author, language)
VALUES ('teach-002', 'Title', 'Content', 'Excerpt', 'slug', 'category', 'Author', 'en');
```

**Check required fields:**
```sql
.schema teachings
-- Look for "NOT NULL"
```

---

### Error: "FOREIGN KEY constraint failed"

**Cause:** Referenced record doesn't exist

**Example:**
```sql
-- This fails if event-999 doesn't exist:
INSERT INTO event_registrations (id, event_id, guest_name, guest_email)
VALUES ('reg-001', 'event-999', 'Name', 'email@example.com');
```

**Solution:** Check referenced record exists first
```sql
-- Verify event exists:
SELECT id FROM events WHERE id = 'event-999';

-- If not, use valid event_id
SELECT id, title FROM events WHERE published = 1 LIMIT 5;
```

---

### Error: "CHECK constraint failed"

**Cause:** Value doesn't meet check constraint (if defined)

**Solution:** Ensure values match constraints (e.g., dates, ranges)

---

## Data Type Errors

### Error: Expected number, got text

**Cause:** Wrong data type for column

**Example:**
```sql
-- WRONG: Text in INTEGER column
INSERT INTO teachings (id, title, content, excerpt, slug, category, author, language, views)
VALUES ('teach-002', 'Title', 'Content', 'Excerpt', 'slug', 'cat', 'Author', 'en', 'many');
--                                                                                    ^^^^^^ WRONG!

-- RIGHT:
VALUES ('teach-002', 'Title', 'Content', 'Excerpt', 'slug', 'cat', 'Author', 'en', 0);
```

**Solution:** Check column types
```sql
PRAGMA table_info(teachings);
-- Look at "type" column
```

---

### Error: Date format issues

**Cause:** Wrong date format

**Examples:**
```sql
-- WRONG formats:
'09/30/2025'        -- US format
'30-09-2025'        -- European format
'2025.09.30'        -- Dot separator

-- RIGHT format:
'2025-09-30'        -- ISO format YYYY-MM-DD

-- Or use function:
date('now')
datetime('now')
```

---

## Performance Issues

### Problem: Query is very slow

**Diagnosis:**
```sql
-- Check query plan
EXPLAIN QUERY PLAN
SELECT * FROM teachings WHERE category = 'meditation';
```

**Common causes & fixes:**

**1. Missing WHERE clause (scanning entire table)**
```sql
-- SLOW: No filter
SELECT * FROM teachings ORDER BY views DESC;

-- FASTER: Add filter
SELECT * FROM teachings WHERE published = 1 ORDER BY views DESC;
```

**2. Using LIKE '%term%' (can't use index)**
```sql
-- SLOW: Leading wildcard
SELECT * FROM teachings WHERE title LIKE '%meditation%';

-- FASTER if possible: No leading wildcard
SELECT * FROM teachings WHERE title LIKE 'meditation%';

-- OR: Use full-text search (requires setup)
```

**3. Selecting unnecessary data**
```sql
-- SLOW: Getting everything
SELECT * FROM teachings;

-- FASTER: Only what you need
SELECT id, title, views FROM teachings WHERE published = 1;
```

**4. Not using LIMIT**
```sql
-- SLOW: Returns all results
SELECT * FROM analytics;

-- FASTER: Limit results
SELECT * FROM analytics LIMIT 100;
```

**General fixes:**
```sql
-- Update statistics
ANALYZE;

-- Rebuild indexes
REINDEX;

-- Optimize storage
VACUUM;
```

---

### Problem: Database file is huge

**Diagnosis:**
```bash
du -h local.db
```

**Causes & fixes:**

**1. Need to VACUUM**
```sql
-- Reclaim space from deleted records
VACUUM;
```

**2. Analytics table too large**
```sql
-- Check size
SELECT COUNT(*) FROM analytics;

-- Delete old entries
DELETE FROM analytics WHERE timestamp < date('now', '-90 days');

-- Then vacuum
VACUUM;
```

**3. Check table sizes**
```sql
SELECT
  name,
  ROUND(SUM(pgsize) / 1024.0 / 1024.0, 2) AS size_mb
FROM dbstat
GROUP BY name
ORDER BY SUM(pgsize) DESC;
```

---

## Corruption Issues

### Error: "database disk image is malformed"

**This is serious!** Database may be corrupted.

**Recovery steps:**

**Step 1: Backup immediately**
```bash
cp local.db local.db.corrupted_$(date +%Y%m%d)
```

**Step 2: Try integrity check**
```bash
sqlite3 local.db "PRAGMA integrity_check;"
```

**Step 3: Try quick_check**
```bash
sqlite3 local.db "PRAGMA quick_check;"
```

**Step 4: Dump what you can**
```bash
sqlite3 local.db ".dump" > recovered_data.sql 2>&1
```

**Step 5: Create new database**
```bash
# Rename corrupted
mv local.db local.db.corrupted

# Import recovered data
sqlite3 local.db < recovered_data.sql
```

**Step 6: If that fails, restore from backup**
```bash
# Use latest backup
ls -lt backups/
cp backups/local.db.20250930_020000 local.db
```

**Prevention:**
- Regular backups (automated!)
- Use transactions for bulk operations
- Don't kill processes while writing
- Ensure sufficient disk space
- Use good hardware (no failing disk)

---

## Common Logic Errors

### Problem: UPDATE affected 0 rows

**Cause:** WHERE clause matched nothing

**Debug:**
```sql
-- First, verify record exists
SELECT * FROM teachings WHERE id = 'teach-999';

-- If empty result, check ID:
SELECT id FROM teachings LIMIT 5;
```

---

### Problem: Deleted more than intended

**Cause:** WHERE clause was too broad or missing

**Example:**
```sql
-- DANGER: Deletes ALL teachings!
DELETE FROM teachings;

-- SAFER: Specific ID
DELETE FROM teachings WHERE id = 'teach-002';
```

**Recovery:**
If you just did this:
```sql
-- Try rollback if still in transaction
ROLLBACK;
```

If committed:
```bash
# Restore from backup
cp backups/local.db.latest local.db
```

**Prevention:**
1. Always backup before DELETE/UPDATE
2. Test with SELECT first
3. Use transactions
4. Double-check WHERE clause

---

### Problem: JOIN returns no results

**Causes:**
1. No matching records
2. Wrong join column
3. NULL values in join column

**Debug:**
```sql
-- Check both tables have data
SELECT COUNT(*) FROM events;
SELECT COUNT(*) FROM event_registrations;

-- Check join columns match
SELECT DISTINCT event_id FROM event_registrations;
SELECT id FROM events;

-- Try LEFT JOIN to see unmatched
SELECT e.title, r.id
FROM events e
LEFT JOIN event_registrations r ON e.id = r.event_id;
```

---

## Permission Errors

### Error: "attempt to write a readonly database"

**Cause:** No write permission

**Solution:**
```bash
# Check permissions
ls -l local.db

# Fix if needed
chmod 644 local.db
```

**Or you opened in read-only mode:**
```bash
# Don't use this if you want to write:
sqlite3 file:local.db?mode=ro
```

---

## Encoding/Character Issues

### Problem: Special characters appear as ???

**Cause:** Encoding mismatch

**Solution:**
```sql
-- Ensure UTF-8
PRAGMA encoding = "UTF-8";
```

**For Hindi/Nepali characters:**
```sql
-- Should work fine with UTF-8
-- Example:
SELECT * FROM quotes WHERE content LIKE '%बुरा%';
```

**If problems persist:**
- Check terminal encoding
- macOS Terminal should default to UTF-8
- iTerm2: Preferences → Profiles → Terminal → Character Encoding: UTF-8

---

## Emergency Recovery Procedures

### Scenario: "I deleted important data!"

**Immediate actions:**

1. **Don't panic, don't modify anything else**

2. **Check trash table:**
```sql
SELECT * FROM trash
WHERE content_type = 'teaching'
ORDER BY deleted_at DESC;
```

3. **Restore from trash if there:**
```sql
-- See 05-MANAGING-CONTENT.md for restore procedure
```

4. **Restore from backup:**
```bash
# Find recent backup
ls -lt backups/

# Check backup has data
sqlite3 backups/local.db.20250930_020000 "SELECT COUNT(*) FROM teachings;"

# If good, restore
cp backups/local.db.20250930_020000 local.db
```

---

### Scenario: "Database won't open at all"

**Try these in order:**

```bash
# 1. Check file integrity
file local.db
# Should say: "SQLite 3.x database"

# 2. Try opening
sqlite3 local.db ".tables"

# 3. If that fails, try recovery
sqlite3 local.db ".recover" | sqlite3 recovered.db

# 4. Restore from backup
cp backups/local.db.latest local.db

# 5. Contact support (with backup!)
```

---

## Getting Help

### Information to gather before asking:

```bash
# SQLite version
sqlite3 --version

# Error message (exact text)
# Copy the full error

# Query that caused error
# Include exact SQL

# Database state
sqlite3 local.db "PRAGMA integrity_check;"
sqlite3 local.db "SELECT COUNT(*) FROM teachings;"

# Recent changes
# What were you doing when error occurred?
```

### Where to ask:

1. **SQLite Documentation:** https://sqlite.org/docs.html
2. **Stack Overflow:** Tag questions with `[sqlite]`
3. **SQLite Forum:** https://sqlite.org/forum/forummain
4. **Project maintainer:** If specific to Kabir Sant Sharan

---

## Prevention Checklist

Daily:
- ✓ Use transactions for multi-step operations
- ✓ Test SELECT before UPDATE/DELETE
- ✓ Backup before major changes

Weekly:
- ✓ Run integrity check
- ✓ Monitor disk space
- ✓ Clean old sessions/analytics

Monthly:
- ✓ Test backup restoration
- ✓ Review and fix any recurring errors
- ✓ Update SQLite if needed

---

## Quick Fix Reference

| Problem | Quick Fix |
|---------|-----------|
| Database locked | Close other connections, wait 30s |
| Table not found | Check name with `.tables` |
| Column not found | Check schema with `.schema tablename` |
| Syntax error | Check for semicolon, closed quotes |
| Unique constraint | Record already exists, use UPDATE |
| NOT NULL error | Include all required fields |
| Slow query | Add WHERE, LIMIT, check indexes |
| Large file size | Run `VACUUM;` |
| Corrupted | Restore from backup |
| Can't write | Check permissions `chmod 644` |

---

**When in doubt: Backup first, then experiment!**

**Remember:** Every error is a learning opportunity. Read error messages carefully - they usually tell you exactly what's wrong!