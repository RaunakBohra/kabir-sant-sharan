# SQLite Database Guide for Kabir Sant Sharan

**Complete guide to managing your spiritual community database**

---

## What's Inside

This comprehensive guide teaches you everything about working with your Kabir Sant Sharan SQLite database, from basics to advanced operations.

**Total Content:** ~10,000 words across 12 guides
**Time to Master:** 1-2 days of focused learning
**Skill Level:** No coding experience required

---

## Quick Start

**New to databases?** Start here:

1. **[01-GETTING-STARTED.md](./01-GETTING-STARTED.md)** (30 min)
   - Understand what a database is
   - Learn your database structure
   - Key concepts explained simply

2. **[02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md)** (20 min)
   - Install SQLite tools on macOS
   - Connect to your database
   - Run your first query

3. **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** (bookmark this!)
   - One-page cheat sheet
   - Common commands
   - Quick solutions

---

## Learning Path

### Beginner Track (4-5 hours)

**Goal:** View and understand your data

1. [01-GETTING-STARTED.md](./01-GETTING-STARTED.md) - Database basics
2. [02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md) - Tools setup
3. [03-BASIC-COMMANDS.md](./03-BASIC-COMMANDS.md) - Essential commands
4. [04-VIEWING-DATA.md](./04-VIEWING-DATA.md) - Query all tables
5. [EXERCISES.md](./EXERCISES.md) - Practice Level 1 & 2

**After this track, you can:**
- Browse all teachings, events, quotes
- Search for specific content
- Generate simple reports
- Export data to Excel

---

### Intermediate Track (4-5 hours)

**Goal:** Manage and modify content

1. [05-MANAGING-CONTENT.md](./05-MANAGING-CONTENT.md) - Add/update/delete
2. [07-BACKUP-MAINTENANCE.md](./07-BACKUP-MAINTENANCE.md) - Backup strategies
3. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Fix common errors
4. [EXERCISES.md](./EXERCISES.md) - Practice Level 3 & 4

**After this track, you can:**
- Add new teachings and events
- Update existing content
- Safely delete and restore
- Backup and recover data
- Handle common errors

---

### Advanced Track (6-8 hours)

**Goal:** Master advanced operations

1. [06-ADVANCED-QUERIES.md](./06-ADVANCED-QUERIES.md) - Complex queries
2. [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) - Complete schema reference
3. [EXERCISES.md](./EXERCISES.md) - Practice Level 5 & Bonus

**After this track, you can:**
- Write complex multi-table queries
- Generate custom reports
- Perform data analysis
- Optimize performance
- Automate maintenance

---

## Guide Reference

### Step-by-Step Tutorials

| Guide | Topic | Time | Difficulty |
|-------|-------|------|------------|
| [01-GETTING-STARTED](./01-GETTING-STARTED.md) | Database basics & concepts | 30 min | ⭐ Beginner |
| [02-INSTALLATION-SETUP](./02-INSTALLATION-SETUP.md) | Install tools (macOS) | 20 min | ⭐ Beginner |
| [03-BASIC-COMMANDS](./03-BASIC-COMMANDS.md) | Essential SQL commands | 45 min | ⭐ Beginner |
| [04-VIEWING-DATA](./04-VIEWING-DATA.md) | Query all tables | 60 min | ⭐⭐ Easy |
| [05-MANAGING-CONTENT](./05-MANAGING-CONTENT.md) | Add/update/delete data | 90 min | ⭐⭐ Medium |
| [06-ADVANCED-QUERIES](./06-ADVANCED-QUERIES.md) | JOINs, reports, analytics | 90 min | ⭐⭐⭐ Advanced |
| [07-BACKUP-MAINTENANCE](./07-BACKUP-MAINTENANCE.md) | Backup & recovery | 60 min | ⭐⭐ Medium |

### Quick References

| Reference | Purpose | When to Use |
|-----------|---------|-------------|
| [QUICK-REFERENCE](./QUICK-REFERENCE.md) | One-page cheat sheet | Daily reference |
| [DATABASE-SCHEMA](./DATABASE-SCHEMA.md) | Table structure guide | Understanding relationships |
| [TROUBLESHOOTING](./TROUBLESHOOTING.md) | Error solutions | When things go wrong |
| [EXERCISES](./EXERCISES.md) | Hands-on practice | Learning by doing |

---

## Your Database

### What's in Your Database

**Content Tables:**
- **teachings** - Sant Kabir's wisdom (articles, teachings)
- **events** - Spiritual events and gatherings
- **quotes** - Daily inspirational quotes
- **media** - Audio/video bhajans and discourses

**Community Tables:**
- **users** - Community members
- **event_registrations** - Event attendees
- **newsletters** - Newsletter subscribers
- **comments** - User comments
- **contact_messages** - Contact form submissions

**System Tables:**
- **sessions** - Login sessions
- **analytics** - Usage statistics
- **trash** - Deleted content (recoverable)

**Total:** 14 tables | Current size: ~128KB | Location: `local.db`

---

## Common Tasks

### I Want To...

**View Content**
- See all teachings → [04-VIEWING-DATA.md#teachings](./04-VIEWING-DATA.md)
- Check upcoming events → [04-VIEWING-DATA.md#events](./04-VIEWING-DATA.md)
- Browse quotes → [04-VIEWING-DATA.md#quotes](./04-VIEWING-DATA.md)

**Manage Content**
- Add new teaching → [05-MANAGING-CONTENT.md#adding-a-new-teaching](./05-MANAGING-CONTENT.md)
- Update event → [05-MANAGING-CONTENT.md#update-event](./05-MANAGING-CONTENT.md)
- Delete content safely → [05-MANAGING-CONTENT.md#soft-delete](./05-MANAGING-CONTENT.md)

**Generate Reports**
- Most viewed teachings → [06-ADVANCED-QUERIES.md#report-1](./06-ADVANCED-QUERIES.md)
- Event attendance → [06-ADVANCED-QUERIES.md#report-2](./06-ADVANCED-QUERIES.md)
- Newsletter growth → [06-ADVANCED-QUERIES.md#report-3](./06-ADVANCED-QUERIES.md)

**Maintenance**
- Backup database → [07-BACKUP-MAINTENANCE.md#manual-backups](./07-BACKUP-MAINTENANCE.md)
- Restore from backup → [07-BACKUP-MAINTENANCE.md#restoring](./07-BACKUP-MAINTENANCE.md)
- Fix errors → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

**Learn**
- Practice queries → [EXERCISES.md](./EXERCISES.md)
- Quick command lookup → [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

---

## Key Concepts

### What You'll Learn

**Database Fundamentals**
- Tables, rows, columns
- Primary keys, foreign keys
- Data types (TEXT, INTEGER, BOOLEAN)
- Relationships between tables

**SQL Commands**
- `SELECT` - View data
- `INSERT` - Add data
- `UPDATE` - Modify data
- `DELETE` - Remove data
- `JOIN` - Combine tables

**Best Practices**
- Always backup before changes
- Use transactions for safety
- Test with SELECT before UPDATE/DELETE
- Soft delete instead of hard delete
- Regular maintenance

---

## Safety Rules

**Golden Rules:**

1. **Always backup before modifying data**
   ```bash
   cp local.db backups/local.db.$(date +%Y%m%d)
   ```

2. **Never UPDATE/DELETE without WHERE clause**
   ```sql
   -- WRONG: Updates ALL rows!
   UPDATE teachings SET published = 0;

   -- RIGHT: Updates specific row
   UPDATE teachings SET published = 0 WHERE id = 'teach-001';
   ```

3. **Test with SELECT first**
   ```sql
   -- Step 1: Preview
   SELECT * FROM teachings WHERE id = 'teach-001';

   -- Step 2: If correct, then update
   UPDATE teachings SET published = 1 WHERE id = 'teach-001';
   ```

4. **Use soft deletes for content**
   ```sql
   -- Don't permanently delete
   -- Instead, mark as deleted:
   UPDATE teachings SET deleted_at = datetime('now') WHERE id = 'teach-001';
   ```

5. **Never reset the database**
   - Project rule: "Never reset DB at any cost!!"
   - Backups make this possible

---

## Troubleshooting

**Common Issues:**

| Problem | Quick Fix | Full Guide |
|---------|-----------|------------|
| Database locked | Close other connections | [TROUBLESHOOTING.md#database-locked](./TROUBLESHOOTING.md) |
| Syntax error | Check semicolon & quotes | [TROUBLESHOOTING.md#syntax-errors](./TROUBLESHOOTING.md) |
| Can't find table | Use `.tables` to list all | [TROUBLESHOOTING.md#no-such-table](./TROUBLESHOOTING.md) |
| Slow query | Add WHERE, LIMIT | [TROUBLESHOOTING.md#performance](./TROUBLESHOOTING.md) |
| Corrupted database | Restore from backup | [TROUBLESHOOTING.md#corruption](./TROUBLESHOOTING.md) |

**Getting Help:**
- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) first
- Search error message in guides
- Review [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)

---

## Tools & Setup

### What You Need

**Command Line (Built-in)**
- SQLite3 (pre-installed on macOS)
- Terminal app
- [Setup Guide →](./02-INSTALLATION-SETUP.md)

**Visual Tool (Optional)**
- DB Browser for SQLite (free)
- Easier for beginners
- [Installation →](./02-INSTALLATION-SETUP.md#install-db-browser)

**Your Database File**
```
Location: /Users/raunakbohra/Desktop/kabir-sant-sharan/local.db
Size: ~128KB
Tables: 14
```

---

## Practice & Exercises

### Hands-On Learning

[**EXERCISES.md**](./EXERCISES.md) contains 20+ real-world exercises:

**Level 1: Beginner (Viewing)**
- List tables
- Count records
- Filter results
- Sort data

**Level 2: Intermediate (Searching)**
- Find upcoming events
- Search by keyword
- Group by category
- Date filtering

**Level 3: Advanced (JOINs)**
- Event registrations with names
- Multi-table reports
- Complex analytics

**Level 4: Data Manipulation**
- Add quotes
- Update views
- Register attendees
- Soft delete/restore

**Level 5: Real-World Scenarios**
- Dashboard stats
- Event attendance reports
- Content audits
- Growth analysis

**Bonus Challenges**
- Test your skills
- Build custom solutions

---

## Maintenance Schedule

### Keep Your Database Healthy

**Daily:**
- Automated backups run automatically (set up in Guide 07)
- Monitor for errors

**Weekly:**
- Clean old sessions
- Check backup logs
- Review new content

**Monthly:**
- Run VACUUM to optimize storage
- Run ANALYZE for query performance
- Test backup restoration
- Archive old analytics data

**Before Major Changes:**
- Manual backup
- Test in staging if available
- Document changes

[Full Maintenance Guide →](./07-BACKUP-MAINTENANCE.md)

---

## Tips for Success

### Learning Tips

1. **Start with basics** - Don't skip to advanced topics
2. **Practice regularly** - Use exercises
3. **Keep notes** - Document useful queries
4. **Experiment safely** - Use backups and transactions
5. **Read error messages** - They tell you what's wrong
6. **Build gradually** - Complex queries from simple ones

### Working Tips

1. **Bookmark [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** for daily use
2. **Use `.headers on` and `.mode column`** for readable output
3. **Always backup before bulk operations**
4. **Test SELECT before UPDATE/DELETE**
5. **Use descriptive IDs** (teach-001, event-002)
6. **Comment complex queries** for future reference

---

## Additional Resources

### Official Documentation
- SQLite Official: https://sqlite.org/
- SQL Tutorial: https://sqlitetutorial.net/
- Command Line: https://sqlite.org/cli.html

### Learning SQL
- W3Schools SQL: https://www.w3schools.com/sql/
- SQLBolt Interactive: https://sqlbolt.com/
- Practice Online: https://sqliteonline.com/

### Tools
- DB Browser: https://sqlitebrowser.org/
- VS Code SQLite Viewer: Search "SQLite" in extensions

---

## What's Next?

### After Completing These Guides

**You'll be able to:**
- Manage all content (teachings, events, quotes)
- Generate custom reports
- Perform data analysis
- Maintain database health
- Backup and recover data
- Troubleshoot issues

**Next Steps:**
1. Set up automated backups (Guide 07)
2. Create your own custom reports (Guide 06)
3. Build dashboard queries (Exercises Level 5)
4. Optimize your workflow (Quick Reference)

---

## File Structure

```
docs/guides/database/
├── README.md                    ← You are here
│
├── 01-GETTING-STARTED.md        Step-by-step guides
├── 02-INSTALLATION-SETUP.md
├── 03-BASIC-COMMANDS.md
├── 04-VIEWING-DATA.md
├── 05-MANAGING-CONTENT.md
├── 06-ADVANCED-QUERIES.md
├── 07-BACKUP-MAINTENANCE.md
│
├── QUICK-REFERENCE.md           Quick references
├── DATABASE-SCHEMA.md
├── TROUBLESHOOTING.md
└── EXERCISES.md
```

---

## Getting Started Now

**Absolute Beginner?**
1. Read [01-GETTING-STARTED.md](./01-GETTING-STARTED.md)
2. Follow [02-INSTALLATION-SETUP.md](./02-INSTALLATION-SETUP.md)
3. Practice with [EXERCISES.md](./EXERCISES.md) Level 1

**Some SQL experience?**
1. Skim [03-BASIC-COMMANDS.md](./03-BASIC-COMMANDS.md)
2. Study [04-VIEWING-DATA.md](./04-VIEWING-DATA.md)
3. Jump to [06-ADVANCED-QUERIES.md](./06-ADVANCED-QUERIES.md)

**Just need quick reference?**
1. Bookmark [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
2. Check [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) for table structure

---

## Feedback & Questions

**Found an error?** Please report it so we can improve!

**Have questions?** Check:
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. [QUICK-REFERENCE.md](./QUICK-REFERENCE.md)
3. Relevant guide's Q&A section

---

**Ready to begin?** Start with [01-GETTING-STARTED.md](./01-GETTING-STARTED.md)

**Good luck on your database journey!** 🙏