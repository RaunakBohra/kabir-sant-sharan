# Managing Content - Add, Update, Delete

## What You'll Learn
- Add new teachings, events, quotes, and more
- Update existing content
- Safely delete content (soft deletes)
- Restore deleted items from trash
- Bulk operations
- Best practices and safety tips

**⚠️ IMPORTANT:** Always backup before modifying data!

**Time required:** 90 minutes

---

## Part 1: Safety First!

### Before You Begin

**1. Always backup your database:**
```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
cp local.db backups/local.db.$(date +%Y%m%d_%H%M%S)
```

**2. Use transactions for safety:**
```sql
BEGIN TRANSACTION;
-- Your changes here
-- Preview results
-- If good: COMMIT;
-- If bad: ROLLBACK;
```

**3. Test with SELECT before UPDATE/DELETE:**
```sql
-- WRONG: Direct UPDATE
UPDATE teachings SET published = 0;  -- DANGER!

-- RIGHT: Preview first
SELECT id, title, published FROM teachings WHERE id = 'teach-001';
-- Then update
UPDATE teachings SET published = 0 WHERE id = 'teach-001';
```

---

## Part 2: INSERT - Adding New Content

### Basic INSERT Syntax

```sql
INSERT INTO table_name (column1, column2, column3)
VALUES ('value1', 'value2', 'value3');
```

### Adding a New Teaching

```sql
INSERT INTO teachings (
  id,
  title,
  content,
  excerpt,
  slug,
  category,
  author,
  published,
  language,
  created_at,
  updated_at
) VALUES (
  'teach-002',
  'The Path of Truth',
  'Full teaching content goes here... (can be very long text)',
  'A brief summary of this teaching about truth and wisdom.',
  'path-of-truth',
  'spirituality',
  'Sant Kabir Das',
  1,
  'en',
  datetime('now'),
  datetime('now')
);
```

**Verify it was added:**
```sql
SELECT id, title, published FROM teachings WHERE id = 'teach-002';
```

### Adding a New Event

```sql
INSERT INTO events (
  id,
  title,
  description,
  slug,
  type,
  location,
  virtual_link,
  max_attendees,
  current_attendees,
  start_date,
  end_date,
  start_time,
  end_time,
  timezone,
  published,
  registration_required,
  category,
  organizer,
  language,
  created_at,
  updated_at
) VALUES (
  'event-002',
  'Evening Meditation Session',
  'Join us for a peaceful evening meditation guided by experienced practitioners.',
  'evening-meditation-session',
  'online',
  NULL,
  'https://zoom.us/j/123456789',
  50,
  0,
  '2025-10-15',
  '2025-10-15',
  '18:00',
  '19:30',
  'Asia/Kathmandu',
  1,
  1,
  'meditation',
  'Kabir Sant Sharan',
  'en',
  datetime('now'),
  datetime('now')
);
```

**Verify:**
```sql
SELECT title, start_date, type FROM events WHERE id = 'event-002';
```

### Adding a New Quote

```sql
INSERT INTO quotes (
  id,
  content,
  translation,
  author,
  category,
  language,
  featured,
  active,
  created_at,
  updated_at
) VALUES (
  'quote-001',
  'बुरा जो देखन मैं चला, बुरा न मिलिया कोय।',
  'I went searching for the wicked, I found none wicked but me.',
  'Sant Kabir Das',
  'wisdom',
  'hi',
  1,
  1,
  datetime('now'),
  datetime('now')
);
```

**Verify:**
```sql
SELECT content, translation FROM quotes WHERE id = 'quote-001';
```

### Adding Multiple Records at Once

```sql
INSERT INTO quotes (id, content, translation, author, category, language, active, created_at, updated_at)
VALUES
  ('quote-002', 'पोथी पढ़ि पढ़ि जग मुआ।', 'Reading books everyone died, none became wise.', 'Sant Kabir Das', 'wisdom', 'hi', 1, datetime('now'), datetime('now')),
  ('quote-003', 'माटी कहे कुम्हार से।', 'The clay says to the potter...', 'Sant Kabir Das', 'truth', 'hi', 1, datetime('now'), datetime('now')),
  ('quote-004', 'जहाँ दया तहाँ धर्म है।', 'Where there is compassion, there is righteousness.', 'Sant Kabir Das', 'devotion', 'hi', 1, datetime('now'), datetime('now'));
```

**Verify:**
```sql
SELECT COUNT(*) FROM quotes;
SELECT id, LEFT(content, 30) AS preview FROM quotes;
```

### Generating Unique IDs

**Pattern used in your database:**
- Teachings: `teach-001`, `teach-002`, etc.
- Events: `event-001`, `event-002`, etc.
- Quotes: `quote-001`, `quote-002`, etc.

**Find next available ID:**
```sql
-- For teachings
SELECT 'teach-' || PRINTF('%03d', COALESCE(MAX(CAST(SUBSTR(id, 7) AS INTEGER)), 0) + 1) AS next_id
FROM teachings;
```

**Output:** `teach-002` (if you have teach-001)

**For events:**
```sql
SELECT 'event-' || PRINTF('%03d', COALESCE(MAX(CAST(SUBSTR(id, 7) AS INTEGER)), 0) + 1) AS next_id
FROM events;
```

---

## Part 3: UPDATE - Modifying Existing Content

### Basic UPDATE Syntax

```sql
UPDATE table_name
SET column1 = 'new_value', column2 = 'new_value'
WHERE condition;
```

**⚠️ CRITICAL:** Always use WHERE clause! Without it, you'll update ALL rows!

### Update a Teaching Title

```sql
-- Preview first
SELECT id, title FROM teachings WHERE id = 'teach-001';

-- Update
UPDATE teachings
SET title = 'The Enlightened Path',
    updated_at = datetime('now')
WHERE id = 'teach-001';

-- Verify
SELECT id, title, updated_at FROM teachings WHERE id = 'teach-001';
```

### Publish a Draft Teaching

```sql
UPDATE teachings
SET published = 1,
    published_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-002';
```

### Unpublish a Teaching

```sql
UPDATE teachings
SET published = 0,
    updated_at = datetime('now')
WHERE id = 'teach-001';
```

### Update Event Attendance Count

**When someone registers for an event:**
```sql
UPDATE events
SET current_attendees = current_attendees + 1,
    updated_at = datetime('now')
WHERE id = 'event-001';
```

**When someone cancels:**
```sql
UPDATE events
SET current_attendees = current_attendees - 1,
    updated_at = datetime('now')
WHERE id = 'event-001'
  AND current_attendees > 0;  -- Prevent negative numbers
```

### Increment View Count

```sql
UPDATE teachings
SET views = views + 1
WHERE id = 'teach-001';
```

### Update Multiple Columns

```sql
UPDATE teachings
SET title = 'New Title',
    excerpt = 'New excerpt text here',
    category = 'meditation',
    featured = 1,
    updated_at = datetime('now')
WHERE id = 'teach-001';
```

### Bulk Update - Make Multiple Teachings Featured

```sql
-- Preview which ones will be affected
SELECT id, title, featured FROM teachings
WHERE category = 'meditation' AND published = 1;

-- Update them
UPDATE teachings
SET featured = 1,
    updated_at = datetime('now')
WHERE category = 'meditation' AND published = 1;
```

### Update Event Location

```sql
UPDATE events
SET location = 'Kabir Mandir, Kathmandu',
    type = 'in-person',
    virtual_link = NULL,  -- Remove virtual link
    updated_at = datetime('now')
WHERE id = 'event-002';
```

### Update Quote Likes

```sql
UPDATE quotes
SET likes = likes + 1
WHERE id = 'quote-001';
```

---

## Part 4: DELETE - Removing Content

### ⚠️ Two Types of Deletes

Your database uses **soft deletes** for content:

1. **Soft Delete (RECOMMENDED)** - Sets `deleted_at` timestamp, moves to trash
2. **Hard Delete (DANGEROUS)** - Permanently removes from database

### Soft Delete a Teaching (Recommended)

```sql
-- Mark as deleted (goes to trash)
UPDATE teachings
SET deleted_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-002';
```

**What happens:**
- Teaching hidden from website
- Kept in database for 30 days
- Can be restored later
- Should also create trash entry (see below)

### Proper Soft Delete with Trash Entry

```sql
BEGIN TRANSACTION;

-- Get the teaching data
-- Then insert into trash table
INSERT INTO trash (
  id,
  content_type,
  content_id,
  content_data,
  deleted_by,
  deleted_at,
  scheduled_purge_at
)
SELECT
  'trash-' || datetime('now', 'unixepoch'),
  'teaching',
  id,
  json_object(
    'id', id,
    'title', title,
    'content', content,
    'author', author
  ),
  'admin-YWR0aW5A',  -- Your admin user ID
  datetime('now'),
  datetime('now', '+30 days')
FROM teachings
WHERE id = 'teach-002';

-- Mark teaching as deleted
UPDATE teachings
SET deleted_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-002';

COMMIT;
```

### Hard Delete (Permanent - Use with Caution!)

```sql
-- Only use for spam, test data, or confirmed unwanted content
DELETE FROM quotes WHERE id = 'quote-spam-001';
```

**⚠️ WARNING:** This is PERMANENT! No undo!

### Delete with Conditions

```sql
-- Delete old sessions (hard delete is OK for system data)
DELETE FROM sessions
WHERE expires_at < datetime('now', '-7 days');
```

### Delete Spam Comments

```sql
-- Preview first
SELECT id, author_name, content FROM comments WHERE spam = 1;

-- Delete
DELETE FROM comments WHERE spam = 1 AND created_at < datetime('now', '-30 days');
```

---

## Part 5: Restoring Deleted Content

### View Items in Trash

```sql
SELECT
  content_type,
  content_id,
  deleted_at,
  scheduled_purge_at,
  (julianday(scheduled_purge_at) - julianday('now')) AS days_until_purge
FROM trash
WHERE restored_at IS NULL
ORDER BY deleted_at DESC;
```

### Restore a Teaching from Trash

```sql
BEGIN TRANSACTION;

-- Restore the teaching
UPDATE teachings
SET deleted_at = NULL,
    updated_at = datetime('now')
WHERE id = 'teach-002';

-- Mark trash entry as restored
UPDATE trash
SET restored_at = datetime('now'),
    restored_by = 'admin-YWR0aW5A'
WHERE content_type = 'teaching' AND content_id = 'teach-002';

COMMIT;
```

### Verify Restoration

```sql
SELECT id, title, deleted_at FROM teachings WHERE id = 'teach-002';
-- deleted_at should be NULL now
```

---

## Part 6: Working with Related Data

### Add Event Registration

```sql
INSERT INTO event_registrations (
  id,
  event_id,
  user_id,
  status,
  attendance_status,
  registered_at
) VALUES (
  'reg-001',
  'event-001',
  'admin-YWR0aW5A',
  'confirmed',
  'pending',
  datetime('now')
);

-- Update event attendee count
UPDATE events
SET current_attendees = current_attendees + 1,
    updated_at = datetime('now')
WHERE id = 'event-001';
```

### Cancel Event Registration

```sql
BEGIN TRANSACTION;

-- Update registration status
UPDATE event_registrations
SET status = 'cancelled'
WHERE id = 'reg-001';

-- Decrease event count
UPDATE events
SET current_attendees = current_attendees - 1,
    updated_at = datetime('now')
WHERE id = (SELECT event_id FROM event_registrations WHERE id = 'reg-001');

COMMIT;
```

### Add Newsletter Subscriber

```sql
INSERT INTO newsletters (
  id,
  email,
  name,
  language,
  status,
  source,
  unsubscribe_token,
  subscribed_at
) VALUES (
  'news-' || datetime('now', 'unixepoch'),
  'devotee@example.com',
  'Ram Krishna',
  'en',
  'active',
  'website',
  lower(hex(randomblob(16))),  -- Generates random token
  datetime('now')
);
```

### Add Comment

```sql
INSERT INTO comments (
  id,
  content,
  author_name,
  author_email,
  resource_type,
  resource_id,
  status,
  created_at,
  updated_at
) VALUES (
  'comment-' || datetime('now', 'unixepoch'),
  'Beautiful teaching! Very inspiring.',
  'Devotee Name',
  'devotee@example.com',
  'teaching',
  'teach-001',
  'pending',
  datetime('now'),
  datetime('now')
);
```

### Approve Comment

```sql
UPDATE comments
SET status = 'approved',
    updated_at = datetime('now')
WHERE id = 'comment-123';
```

---

## Part 7: Bulk Operations

### Publish Multiple Teachings at Once

```sql
-- Preview
SELECT id, title, published FROM teachings
WHERE category = 'meditation' AND published = 0;

-- Execute
UPDATE teachings
SET published = 1,
    published_at = datetime('now'),
    updated_at = datetime('now')
WHERE category = 'meditation' AND published = 0;
```

### Feature Top Viewed Teachings

```sql
-- Feature teachings with more than 500 views
UPDATE teachings
SET featured = 1,
    updated_at = datetime('now')
WHERE views > 500 AND published = 1;
```

### Archive Old Events

```sql
UPDATE events
SET published = 0,
    updated_at = datetime('now')
WHERE end_date < date('now', '-90 days');
```

### Clean Up Expired Sessions

```sql
DELETE FROM sessions
WHERE expires_at < datetime('now');
```

### Mark Old Comments as Read

```sql
UPDATE contact_messages
SET status = 'read',
    updated_at = datetime('now')
WHERE status = 'new' AND created_at < datetime('now', '-7 days');
```

---

## Part 8: Using Transactions Safely

### What are Transactions?

Transactions let you group multiple changes together. Either ALL succeed or ALL fail (rollback).

### Basic Transaction Pattern

```sql
BEGIN TRANSACTION;

-- Change 1
UPDATE teachings SET published = 1 WHERE id = 'teach-001';

-- Change 2
UPDATE teachings SET featured = 1 WHERE id = 'teach-001';

-- Preview the changes
SELECT id, title, published, featured FROM teachings WHERE id = 'teach-001';

-- If everything looks good:
COMMIT;

-- If something's wrong:
-- ROLLBACK;
```

### Complex Transaction Example

```sql
BEGIN TRANSACTION;

-- Add a new event
INSERT INTO events (id, title, description, slug, type, start_date, end_date, start_time, end_time, category, organizer, language, published, created_at, updated_at)
VALUES ('event-003', 'Kabir Jayanti Celebration', 'Annual celebration of Sant Kabir birth anniversary', 'kabir-jayanti-2025', 'in-person', '2025-06-15', '2025-06-15', '09:00', '18:00', 'festival', 'Kabir Sant Sharan', 'en', 1, datetime('now'), datetime('now'));

-- Add a teaching about Kabir Jayanti
INSERT INTO teachings (id, title, content, excerpt, slug, category, author, published, language, created_at, updated_at)
VALUES ('teach-003', 'Celebrating Kabir Jayanti', 'Full article content here...', 'Learn about Kabir Jayanti significance', 'celebrating-kabir-jayanti', 'festival', 'Sant Kabir Das', 1, 'en', datetime('now'), datetime('now'));

-- Verify both were created
SELECT 'Event' AS type, title FROM events WHERE id = 'event-003'
UNION ALL
SELECT 'Teaching', title FROM teachings WHERE id = 'teach-003';

-- If both look good:
COMMIT;
```

---

## Part 9: Common Tasks

### Task 1: Add New Teaching (Complete Workflow)

```sql
BEGIN TRANSACTION;

-- Generate next ID
SELECT 'teach-' || PRINTF('%03d', COALESCE(MAX(CAST(SUBSTR(id, 7) AS INTEGER)), 0) + 1) AS next_id FROM teachings;
-- Let's say it returns 'teach-005'

-- Insert teaching
INSERT INTO teachings (
  id, title, content, excerpt, slug, category, author, published, featured,
  language, reading_time, created_at, updated_at
) VALUES (
  'teach-005',
  'The Ocean of Compassion',
  'Full teaching content... (very long text)',
  'Discover the boundless nature of divine compassion',
  'ocean-of-compassion',
  'devotion',
  'Sant Kabir Das',
  0,  -- Draft first
  0,
  'en',
  8,  -- minutes
  datetime('now'),
  datetime('now')
);

-- Verify
SELECT id, title, published FROM teachings WHERE id = 'teach-005';

COMMIT;
```

### Task 2: Update Teaching and Publish

```sql
BEGIN TRANSACTION;

-- Make edits
UPDATE teachings
SET title = 'The Boundless Ocean of Compassion',  -- Updated title
    excerpt = 'Explore the infinite depths of divine compassion in this profound teaching',
    featured = 1,  -- Make it featured
    published = 1,  -- Publish it
    published_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-005';

-- Verify
SELECT id, title, published, featured, published_at FROM teachings WHERE id = 'teach-005';

COMMIT;
```

### Task 3: Create Event with Initial Settings

```sql
INSERT INTO events (
  id, title, description, slug, type, location, max_attendees, current_attendees,
  start_date, end_date, start_time, end_time, timezone, category, organizer,
  language, published, featured, registration_required, created_at, updated_at
) VALUES (
  'event-004',
  'Morning Meditation Retreat',
  'Three-day residential retreat focusing on meditation and inner peace',
  'morning-meditation-retreat',
  'in-person',
  'Kabir Ashram, Varanasi',
  30,
  0,
  '2025-11-01',
  '2025-11-03',
  '06:00',
  '20:00',
  'Asia/Kolkata',
  'retreat',
  'Kabir Sant Sharan',
  'en',
  1,
  1,
  1,
  datetime('now'),
  datetime('now')
);
```

### Task 4: Add Quote of the Day

```sql
INSERT INTO quotes (
  id, content, translation, author, category, language,
  featured, active, display_date, created_at, updated_at
) VALUES (
  'quote-' || datetime('now', 'unixepoch'),
  'जो तोको काँटा बुवै, ताहि बोय तू फूल।',
  'If someone plants thorns for you, plant flowers for them.',
  'Sant Kabir Das',
  'wisdom',
  'hi',
  1,
  1,
  date('now'),
  datetime('now'),
  datetime('now')
);
```

---

## Part 10: Best Practices

### DO's ✓

✓ **Always backup before bulk operations**
✓ **Use transactions for related changes**
✓ **Preview with SELECT before UPDATE/DELETE**
✓ **Use soft deletes for content (set deleted_at)**
✓ **Always include WHERE clause in UPDATE/DELETE**
✓ **Set updated_at when modifying records**
✓ **Verify changes after executing**
✓ **Use meaningful IDs (teach-001, event-002)**
✓ **Keep trash entries for 30 days**

### DON'Ts ✗

✗ **Never UPDATE/DELETE without WHERE clause**
✗ **Don't hard delete content (use soft delete)**
✗ **Don't skip backups**
✗ **Don't forget to update related tables**
✗ **Don't modify database while dev server is running**
✗ **Don't use special characters in IDs**
✗ **Don't delete user data without consent**
✗ **Don't forget to set updated_at timestamp**

---

## Part 11: Practice Exercises

### Exercise 1: Add a New Quote
**Task:** Add a quote about unity

**Solution:**
```sql
INSERT INTO quotes (id, content, translation, author, category, language, active, created_at, updated_at)
VALUES (
  'quote-unity-001',
  'हिन्दू कहें राम हमारा, मुसलमान रहमाना।',
  'Hindus call Him Ram, Muslims call Him Rahman.',
  'Sant Kabir Das',
  'unity',
  'hi',
  1,
  datetime('now'),
  datetime('now')
);
```

### Exercise 2: Update Event Capacity
**Task:** Increase max_attendees for event-001 to 100

**Solution:**
```sql
UPDATE events
SET max_attendees = 100,
    updated_at = datetime('now')
WHERE id = 'event-001';
```

### Exercise 3: Soft Delete a Teaching
**Task:** Mark teaching 'teach-003' as deleted

**Solution:**
```sql
UPDATE teachings
SET deleted_at = datetime('now'),
    updated_at = datetime('now')
WHERE id = 'teach-003';
```

### Exercise 4: Restore a Teaching
**Task:** Restore teaching 'teach-003'

**Solution:**
```sql
UPDATE teachings
SET deleted_at = NULL,
    updated_at = datetime('now')
WHERE id = 'teach-003';
```

### Exercise 5: Bulk Publish Quotes
**Task:** Publish all quotes in 'wisdom' category

**Solution:**
```sql
UPDATE quotes
SET active = 1,
    updated_at = datetime('now')
WHERE category = 'wisdom';
```

---

## What's Next?

You can now add, update, and delete content! Let's learn advanced querying and reporting.

**→ Continue to [06-ADVANCED-QUERIES.md](./06-ADVANCED-QUERIES.md)**

In the next guide, you'll learn:
- Complex searches across multiple tables
- Generate detailed reports
- Analytics and statistics
- Export data for analysis
- Performance optimization

---

**Remember:** With great power comes great responsibility. Always backup, always preview, always verify!