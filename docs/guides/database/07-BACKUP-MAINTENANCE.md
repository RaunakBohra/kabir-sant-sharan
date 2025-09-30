# Backup & Database Maintenance

## What You'll Learn
- Manual and automated backup strategies
- Database integrity checks
- Recovery procedures
- Performance optimization
- Cleaning up old data
- Best practices for long-term database health

**Time required:** 45-60 minutes

---

## Part 1: Backup Strategies

### Why Backup?

**Protect against:**
- Accidental data deletion
- Software bugs
- Hardware failures
- Corruption
- Human error

**Remember:** Your project guidelines say "Never reset DB at any cost!!" - Backups make this possible.

---

## Part 2: Manual Backups

### Method 1: Simple File Copy (Easiest)

```bash
# Navigate to project
cd /Users/raunakbohra/Desktop/kabir-sant-sharan

# Create backups directory if it doesn't exist
mkdir -p backups

# Copy database with timestamp
cp local.db backups/local.db.$(date +%Y%m%d_%H%M%S)
```

**Result:** `local.db.20250930_143022` (YearMonthDay_HourMinuteSec)

**Verify backup:**
```bash
ls -lh backups/
```

### Method 2: SQLite Backup Command

```bash
# Using sqlite3 backup command (more reliable)
sqlite3 local.db ".backup backups/local.db.backup"
```

**Why better?**
- Handles locked databases
- Ensures consistency
- Safer while app is running

### Method 3: Export to SQL (Human-Readable)

```sql
-- Open database
sqlite3 local.db

-- Dump entire database to SQL file
.output backups/full_backup_20250930.sql
.dump

.output stdout
```

**What you get:** SQL commands to recreate entire database

**Restore from SQL dump:**
```bash
sqlite3 new_database.db < backups/full_backup_20250930.sql
```

### Method 4: Selective Backup (Specific Tables)

```sql
-- Backup just teachings table
.mode insert teachings
.output backups/teachings_backup.sql
SELECT * FROM teachings;
.output stdout
```

---

## Part 3: Automated Backups

### Create Backup Script

**Create file:** `~/bin/backup-kabir-db.sh`

```bash
#!/bin/bash

# Configuration
DB_PATH="/Users/raunakbohra/Desktop/kabir-sant-sharan/local.db"
BACKUP_DIR="/Users/raunakbohra/Desktop/kabir-sant-sharan/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/local.db.$TIMESTAMP"

# Create backup directory if needed
mkdir -p "$BACKUP_DIR"

# Create backup
echo "Creating backup: $BACKUP_FILE"
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
  SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
  echo "Backup successful: $SIZE"
else
  echo "ERROR: Backup failed!"
  exit 1
fi

# Keep only last 30 backups
echo "Cleaning old backups..."
cd "$BACKUP_DIR"
ls -t local.db.* | tail -n +31 | xargs rm -f 2>/dev/null

echo "Backup complete!"
```

**Make executable:**
```bash
chmod +x ~/bin/backup-kabir-db.sh
```

**Test it:**
```bash
~/bin/backup-kabir-db.sh
```

### Schedule with Cron (Daily Automatic Backups)

**Edit crontab:**
```bash
crontab -e
```

**Add these lines:**
```cron
# Backup Kabir database daily at 2 AM
0 2 * * * /Users/raunakbohra/bin/backup-kabir-db.sh >> /tmp/kabir-backup.log 2>&1

# Backup before deploying (every Sunday at 1 AM)
0 1 * * 0 /Users/raunakbohra/bin/backup-kabir-db.sh >> /tmp/kabir-backup.log 2>&1
```

**Cron schedule format:**
```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0=Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

**Examples:**
- `0 2 * * *` = Daily at 2 AM
- `0 */6 * * *` = Every 6 hours
- `0 0 * * 0` = Every Sunday at midnight
- `0 9,18 * * *` = Twice daily (9 AM and 6 PM)

**View scheduled jobs:**
```bash
crontab -l
```

---

## Part 4: Restoring from Backup

### Restore Full Database

**⚠️ CAUTION:** This replaces your current database!

```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan

# Step 1: Backup current database (just in case!)
cp local.db local.db.before_restore

# Step 2: Restore from backup
cp backups/local.db.20250930_143022 local.db

# Step 3: Verify
sqlite3 local.db "SELECT COUNT(*) FROM teachings;"
```

### Restore Specific Table

```bash
# Open your database
sqlite3 local.db

# Drop existing table (DANGEROUS - backup first!)
DROP TABLE teachings;

# Restore from SQL dump
.read backups/teachings_backup.sql
```

### Restore Deleted Records

If you have a recent backup with the deleted data:

```sql
-- Attach backup as separate database
ATTACH DATABASE 'backups/local.db.20250930_143022' AS backup;

-- Copy specific record back
INSERT INTO main.teachings
SELECT * FROM backup.teachings
WHERE id = 'teach-005';

-- Detach backup
DETACH DATABASE backup;
```

---

## Part 5: Database Integrity Checks

### Check Database Integrity

```sql
PRAGMA integrity_check;
```

**Expected output:** `ok`

**If corrupted:** You'll see error messages

### Quick Health Check

```sql
PRAGMA quick_check;
```

**Faster than integrity_check, but less thorough**

### Check Foreign Key Constraints

```sql
PRAGMA foreign_key_check;
```

**Empty result = All foreign keys are valid**

### View Database Size

```bash
du -h local.db
```

### Analyze Database Statistics

```sql
ANALYZE;
```

**What it does:** Updates query optimizer statistics for better performance

### Database Info

```sql
-- Schema version
PRAGMA schema_version;

-- Page size
PRAGMA page_size;

-- Database file format
PRAGMA application_id;

-- All settings
PRAGMA compile_options;
```

---

## Part 6: Database Optimization

### Vacuum (Reclaim Space)

```sql
VACUUM;
```

**What it does:**
- Removes empty space from deleted records
- Reorganizes data for better performance
- Reduces file size
- Can take several minutes on large databases

**When to run:**
- After deleting many records
- Monthly maintenance
- Before backing up for long-term storage

**Warning:** Requires free disk space equal to database size

### Reindex

```sql
REINDEX;
```

**What it does:** Rebuilds all indexes for optimal performance

**When to run:**
- After major data changes
- If queries are slow
- After corruption repair

### Analyze for Query Optimization

```sql
ANALYZE;
```

**When to run:**
- After adding lots of data
- Weekly or monthly
- If query performance degrades

---

## Part 7: Cleanup Operations

### Remove Old Sessions

```sql
-- Preview what will be deleted
SELECT COUNT(*) FROM sessions WHERE expires_at < datetime('now', '-7 days');

-- Delete expired sessions
DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');
```

### Clean Old Analytics Data

```sql
-- Keep only last 90 days of analytics
DELETE FROM analytics WHERE timestamp < date('now', '-90 days');
```

### Purge Old Trash

```sql
-- Find items scheduled for purge
SELECT content_type, content_id, scheduled_purge_at
FROM trash
WHERE scheduled_purge_at < datetime('now')
  AND restored_at IS NULL;

-- Permanently delete
DELETE FROM trash
WHERE scheduled_purge_at < datetime('now')
  AND restored_at IS NULL;
```

### Archive Old Events

```sql
-- Mark old events as unpublished (soft archive)
UPDATE events
SET published = 0,
    updated_at = datetime('now')
WHERE end_date < date('now', '-1 year')
  AND published = 1;
```

---

## Part 8: Monitoring Database Health

### Database Size Over Time

Create a simple tracking table:

```sql
CREATE TABLE IF NOT EXISTS db_stats (
  recorded_at TEXT DEFAULT CURRENT_TIMESTAMP,
  db_size_bytes INTEGER,
  teaching_count INTEGER,
  event_count INTEGER,
  user_count INTEGER
);
```

**Record stats (run weekly):**
```sql
INSERT INTO db_stats (db_size_bytes, teaching_count, event_count, user_count)
SELECT
  (SELECT page_count * page_size FROM pragma_page_count(), pragma_page_size()),
  (SELECT COUNT(*) FROM teachings WHERE deleted_at IS NULL),
  (SELECT COUNT(*) FROM events WHERE deleted_at IS NULL),
  (SELECT COUNT(*) FROM users);
```

**View growth:**
```sql
SELECT
  recorded_at,
  ROUND(db_size_bytes / 1024.0 / 1024.0, 2) AS size_mb,
  teaching_count,
  event_count,
  user_count
FROM db_stats
ORDER BY recorded_at DESC
LIMIT 12;
```

### Table Size Report

```sql
SELECT
  name AS table_name,
  ROUND(SUM(pgsize) / 1024.0 / 1024.0, 2) AS size_mb
FROM dbstat
GROUP BY name
ORDER BY SUM(pgsize) DESC;
```

---

## Part 9: Recovery Procedures

### If Database Won't Open

**Error:** "database disk image is malformed"

**Solution 1: Try backup:**
```bash
cp local.db local.db.corrupted
cp backups/local.db.$(ls backups/ | tail -1) local.db
```

**Solution 2: Export and reimport:**
```bash
# Dump what you can
sqlite3 local.db.corrupted ".dump" > recovered_data.sql

# Create new database
mv local.db local.db.corrupted
sqlite3 local.db < recovered_data.sql
```

### If Table is Corrupted

```sql
-- Create new table with same structure
CREATE TABLE teachings_new AS SELECT * FROM teachings WHERE 1=0;

-- Copy good data
INSERT INTO teachings_new SELECT * FROM teachings;

-- Swap tables
DROP TABLE teachings;
ALTER TABLE teachings_new RENAME TO teachings;

-- Recreate indexes
-- (see schema file for index definitions)
```

### Emergency: Recover from Trash

```sql
-- Find recently deleted item
SELECT content_type, content_id, content_data, deleted_at
FROM trash
WHERE content_type = 'teaching'
ORDER BY deleted_at DESC;

-- Extract data from JSON
SELECT json_extract(content_data, '$.title') FROM trash WHERE content_id = 'teach-005';
```

---

## Part 10: Best Practices

### Daily
- ✓ Automated backups run (check logs)
- ✓ Monitor application errors
- ✓ Check disk space

### Weekly
- ✓ Manual backup before major changes
- ✓ Review backup logs
- ✓ Clean old sessions: `DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');`
- ✓ Check database size

### Monthly
- ✓ Run `VACUUM;` to optimize storage
- ✓ Run `ANALYZE;` to optimize queries
- ✓ Review and clean old analytics data
- ✓ Test restore procedure
- ✓ Archive backups to external storage
- ✓ Purge expired trash

### Before Major Changes
- ✓ Create manual backup
- ✓ Test in staging if available
- ✓ Document changes
- ✓ Have rollback plan

### Annual
- ✓ Review backup retention policy
- ✓ Test full disaster recovery
- ✓ Archive important backups permanently
- ✓ Review database performance trends

---

## Part 11: Backup Retention Strategy

### Recommended Strategy (3-2-1 Rule)

**3 copies:** Production + 2 backups
**2 different media:** Local disk + Cloud/External drive
**1 offsite:** Cloud storage or external location

**Example retention:**
- **Hourly:** Keep last 24 (if high-traffic)
- **Daily:** Keep last 30
- **Weekly:** Keep last 12 (3 months)
- **Monthly:** Keep last 12 (1 year)
- **Yearly:** Keep forever (archive)

### Storage Locations

1. **Local (Fast recovery):** `/backups/` directory
2. **External Drive:** Time Machine or manual copy
3. **Cloud Storage:**
   - iCloud Drive
   - Dropbox
   - Google Drive
   - Cloudflare R2 (since you use Cloudflare)

**Sync to cloud:**
```bash
# Example: Copy to Dropbox
cp backups/local.db.$(date +%Y%m%d) ~/Dropbox/kabir-backups/
```

---

## Part 12: Testing Your Backups

**CRITICAL:** Untested backups are useless!

### Monthly Backup Test

```bash
# 1. Create test directory
mkdir -p /tmp/backup-test

# 2. Copy backup
cp backups/local.db.20250930_143022 /tmp/backup-test/test.db

# 3. Try to open and query
sqlite3 /tmp/backup-test/test.db "SELECT COUNT(*) FROM teachings;"

# 4. Check a few critical tables
sqlite3 /tmp/backup-test/test.db ".tables"

# 5. Verify data integrity
sqlite3 /tmp/backup-test/test.db "PRAGMA integrity_check;"

# 6. Clean up
rm -rf /tmp/backup-test
```

**If all commands work: Backup is good!**

---

## Part 13: Disaster Recovery Plan

### Scenario 1: Accidentally Deleted All Teachings

**Recovery:**
```bash
# 1. Stop application immediately
# 2. Backup current state (even if damaged)
cp local.db local.db.damaged_$(date +%Y%m%d_%H%M%S)

# 3. Find most recent backup
ls -lt backups/local.db.* | head -1

# 4. Restore
cp backups/local.db.20250930_020000 local.db

# 5. Verify
sqlite3 local.db "SELECT COUNT(*) FROM teachings WHERE deleted_at IS NULL;"

# 6. Restart application
```

### Scenario 2: Database Corrupted

**Recovery:**
```bash
# 1. Backup corrupted file
cp local.db local.db.corrupted

# 2. Try repair
sqlite3 local.db "PRAGMA integrity_check;"

# 3. If repair fails, restore from backup
cp backups/local.db.20250929_020000 local.db

# 4. Verify
sqlite3 local.db "PRAGMA integrity_check;"
```

### Scenario 3: Lost Last 24 Hours of Data

**Recovery:**
```bash
# 1. Restore yesterday's backup
cp backups/local.db.20250929_020000 local.db.restored

# 2. Compare with current (corrupted)
sqlite3 local.db.restored "SELECT MAX(created_at) FROM teachings;"
sqlite3 local.db "SELECT MAX(created_at) FROM teachings;"

# 3. Manually re-enter missing data or extract from logs
```

---

## Part 14: Maintenance Scripts

### Complete Maintenance Script

**Create:** `~/bin/maintain-kabir-db.sh`

```bash
#!/bin/bash

DB_PATH="/Users/raunakbohra/Desktop/kabir-sant-sharan/local.db"
LOG_FILE="/tmp/kabir-maintenance.log"

echo "=== Database Maintenance: $(date) ===" | tee -a "$LOG_FILE"

# 1. Backup first
echo "Creating backup..." | tee -a "$LOG_FILE"
sqlite3 "$DB_PATH" ".backup backups/local.db.maintenance_$(date +%Y%m%d)"

# 2. Integrity check
echo "Checking integrity..." | tee -a "$LOG_FILE"
INTEGRITY=$(sqlite3 "$DB_PATH" "PRAGMA integrity_check;")
if [ "$INTEGRITY" != "ok" ]; then
  echo "ERROR: Integrity check failed: $INTEGRITY" | tee -a "$LOG_FILE"
  exit 1
fi

# 3. Clean old sessions
echo "Cleaning old sessions..." | tee -a "$LOG_FILE"
sqlite3 "$DB_PATH" "DELETE FROM sessions WHERE expires_at < datetime('now', '-7 days');"

# 4. Purge old trash
echo "Purging old trash..." | tee -a "$LOG_FILE"
sqlite3 "$DB_PATH" "DELETE FROM trash WHERE scheduled_purge_at < datetime('now') AND restored_at IS NULL;"

# 5. Analyze
echo "Analyzing database..." | tee -a "$LOG_FILE"
sqlite3 "$DB_PATH" "ANALYZE;"

# 6. Vacuum (optional, heavy operation)
# echo "Vacuuming database..." | tee -a "$LOG_FILE"
# sqlite3 "$DB_PATH" "VACUUM;"

# 7. Report
SIZE=$(du -h "$DB_PATH" | cut -f1)
TEACHINGS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM teachings WHERE deleted_at IS NULL;")
EVENTS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM events WHERE deleted_at IS NULL;")

echo "Maintenance complete!" | tee -a "$LOG_FILE"
echo "Database size: $SIZE" | tee -a "$LOG_FILE"
echo "Teachings: $TEACHINGS" | tee -a "$LOG_FILE"
echo "Events: $EVENTS" | tee -a "$LOG_FILE"
```

**Run monthly:**
```bash
chmod +x ~/bin/maintain-kabir-db.sh
~/bin/maintain-kabir-db.sh
```

---

## Part 15: Quick Reference

### Backup Commands

| Task | Command |
|------|---------|
| Manual backup | `cp local.db backups/local.db.$(date +%Y%m%d)` |
| SQLite backup | `sqlite3 local.db ".backup backups/backup.db"` |
| SQL dump | `sqlite3 local.db ".dump" > backup.sql` |
| Restore | `cp backups/backup.db local.db` |

### Maintenance Commands

| Task | Command |
|------|---------|
| Integrity check | `sqlite3 local.db "PRAGMA integrity_check;"` |
| Optimize | `sqlite3 local.db "VACUUM; ANALYZE;"` |
| Size | `du -h local.db` |
| Table sizes | `sqlite3 local.db ".schema" | grep CREATE` |

---

## What's Next?

You now know how to protect and maintain your database! Let's wrap up with quick references.

**→ Continue to [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)**

Quick-reference cheat sheet for daily use!

---

**Remember:** A backup you haven't tested is not a backup. Test monthly!