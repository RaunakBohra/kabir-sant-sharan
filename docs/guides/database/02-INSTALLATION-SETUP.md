# Installation & Setup Guide (macOS)

## What You'll Learn
- How to check if SQLite is already installed
- Install SQLite command-line tool
- Install DB Browser for SQLite (visual tool)
- Connect to your Kabir Sant Sharan database
- Run your first successful query

**Time required:** 15-20 minutes

---

## Part 1: Check if SQLite is Already Installed

### Step 1: Open Terminal

**What is Terminal?**
Terminal is a text-based way to talk to your Mac. Don't worry - we'll use simple commands!

**How to open it:**
1. Press `Command (⌘) + Space` to open Spotlight
2. Type `Terminal`
3. Press `Enter`

You'll see a window with text that looks like:
```
YourName@MacBook ~ %
```

### Step 2: Check SQLite Version

**Type this command and press Enter:**
```bash
sqlite3 --version
```

**Expected output:**
```
3.43.2 2023-10-10 13:08:14
```

**What does this mean?**
- If you see a version number → SQLite is already installed! ✓
- If you see "command not found" → You need to install it (rare on macOS)

**Good news:** macOS comes with SQLite pre-installed since OS X 10.4!

---

## Part 2: Update SQLite (Optional but Recommended)

The built-in SQLite might be an older version. Let's install the latest version using Homebrew.

### Install Homebrew (if you don't have it)

**What is Homebrew?**
It's a "package manager" - think of it as an App Store for command-line tools.

**Check if you have Homebrew:**
```bash
brew --version
```

**If you see a version number:** You already have it! Skip to "Install Latest SQLite"

**If you see "command not found:", install Homebrew:**
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**What happens:**
- It will ask for your Mac password (typed characters won't show - that's normal!)
- Installation takes 5-10 minutes
- Follow any on-screen instructions

### Install Latest SQLite

```bash
brew install sqlite3
```

**Verify installation:**
```bash
which sqlite3
```

**Expected output:**
```
/opt/homebrew/bin/sqlite3
```

---

## Part 3: Install DB Browser for SQLite (Visual Tool)

### What is DB Browser?
It's a **visual application** with buttons and windows - no command-line needed! Great for:
- Browsing data visually
- Clicking through tables
- Editing data with forms
- Exporting to Excel/CSV

### Installation Steps

#### Option 1: Download from Website (Easiest)

1. **Open your web browser** and go to:
   ```
   https://sqlitebrowser.org/dl/
   ```

2. **Download for macOS:**
   - Click the `.dmg` file for macOS
   - File size: ~40 MB
   - Wait for download to complete

3. **Install the application:**
   - Open the downloaded `.dmg` file
   - Drag "DB Browser for SQLite" to your Applications folder
   - Open Applications folder
   - Double-click "DB Browser for SQLite"

4. **Security prompt:**
   - macOS might say "Cannot open because it's from an unidentified developer"
   - **Fix:** Right-click the app → Select "Open" → Click "Open" again
   - This only happens the first time

#### Option 2: Install via Homebrew (For Advanced Users)

```bash
brew install --cask db-browser-for-sqlite
```

### Verify DB Browser Installation

1. Open "DB Browser for SQLite" from Applications
2. You should see a window with tabs: "Database Structure", "Browse Data", etc.
3. **Success!** Close it for now - we'll use it soon.

---

## Part 4: Connect to Your Database

Now let's connect to your actual Kabir Sant Sharan database!

### Method 1: Using Command Line (sqlite3)

#### Step 1: Navigate to Your Project Folder

```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
```

**What this does:** Changes your location to the project folder

**Verify you're in the right place:**
```bash
pwd
```

**Expected output:**
```
/Users/raunakbohra/Desktop/kabir-sant-sharan
```

**Check the database file exists:**
```bash
ls -lh local.db
```

**Expected output:**
```
-rw-r--r--  1 raunakbohra  staff   128K Sep 30 10:30 local.db
```

#### Step 2: Open the Database

```bash
sqlite3 local.db
```

**What you'll see:**
```
SQLite version 3.43.2 2023-10-10 13:08:14
Enter ".help" for usage hints.
sqlite>
```

**Success!** You're now connected to your database. The `sqlite>` prompt means SQLite is waiting for your commands.

#### Step 3: Run Your First Query

**Type this command:**
```sql
.tables
```

**Expected output:**
```
analytics             media                 teachings
comments              newsletter_campaigns  trash
contact_messages      newsletters           users
event_registrations   quotes
events                sessions
```

**Congratulations!** You just listed all tables in your database!

#### Step 4: View a Table's Structure

```sql
.schema teachings
```

**Expected output:**
```sql
CREATE TABLE teachings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  ...
);
```

#### Step 5: View Some Data

```sql
SELECT title, author, views FROM teachings LIMIT 3;
```

**What this means:**
- `SELECT` - Show me
- `title, author, views` - These specific columns
- `FROM teachings` - From the teachings table
- `LIMIT 3` - Only show 3 rows

**Expected output:**
```
title                          author          views
-----------------------------  --------------  -----
Path to Enlightenment          Sant Kabir Das  342
```

#### Step 6: Exit SQLite

```sql
.quit
```

**Or press:** `Ctrl + D`

You're back to the normal Terminal prompt!

---

### Method 2: Using DB Browser (Visual Tool)

#### Step 1: Open DB Browser

1. Open "DB Browser for SQLite" from Applications
2. You'll see the main window

#### Step 2: Open Your Database

**Click:** "Open Database" button (top-left, folder icon)

**Navigate to:**
```
/Users/raunakbohra/Desktop/kabir-sant-sharan/local.db
```

**Or use keyboard shortcut:** `Command + O`

#### Step 3: Browse Your Data

**Left sidebar:** Shows all 14 tables

**Click on "teachings" table:**
- You'll see all columns and rows
- Data displayed in a spreadsheet-like grid
- You can scroll, sort by clicking column headers

**Click on "Browse Data" tab:**
- Table dropdown: Select which table to view
- Filter box: Search for specific data
- Export button: Save to CSV/JSON

#### Step 4: View Table Structure

**Click "Database Structure" tab:**
- Shows all tables
- Expand a table (click the arrow) to see columns
- Shows data types and constraints

#### Step 5: Run SQL Queries

**Click "Execute SQL" tab:**
- Type: `SELECT * FROM teachings;`
- Click the "Run" button (play icon) or press `F5`
- Results appear below

---

## Part 5: Setup Tips & Configuration

### Terminal Configuration (Optional but Helpful)

#### Make SQLite Output Prettier

**Create a config file:**
```bash
nano ~/.sqliterc
```

**Add these lines:**
```
.mode column
.headers on
.nullvalue NULL
.prompt 'sqlite> '
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter`

**What this does:**
- `.mode column` - Displays data in aligned columns
- `.headers on` - Shows column names
- `.nullvalue NULL` - Shows NULL for empty values
- `.prompt` - Customizes the prompt

**Now every time you open SQLite, these settings apply automatically!**

### DB Browser Configuration

**Settings → Preferences:**

1. **General tab:**
   - ☑ Show row numbers
   - ☑ Track changes
   - ☑ Enable auto-completion

2. **Data Browser tab:**
   - Default encoding: UTF-8
   - Rows per page: 100 (or your preference)
   - ☑ Show images in cells

3. **SQL tab:**
   - ☑ Syntax highlighting
   - Font size: 14 (adjust to your preference)
   - ☑ Query log

---

## Part 6: Create a Workspace Shortcut

### Create an Alias for Quick Access

Instead of typing the full path every time, create a shortcut!

**Edit your shell config:**
```bash
nano ~/.zshrc
```

**Add this line:**
```bash
alias kabir-db="cd /Users/raunakbohra/Desktop/kabir-sant-sharan && sqlite3 local.db"
```

**Save and exit:** `Ctrl + X`, then `Y`, then `Enter`

**Reload your config:**
```bash
source ~/.zshrc
```

**Now you can type this from anywhere:**
```bash
kabir-db
```

**And it will:**
1. Navigate to your project folder
2. Open your database
3. Ready to run queries!

---

## Part 7: Verify Everything Works

### Checklist

Run these commands to make sure everything is set up correctly:

#### Test 1: SQLite Command Line
```bash
sqlite3 --version
```
**Expected:** Version number appears

#### Test 2: Database Access
```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
sqlite3 local.db ".tables"
```
**Expected:** List of 14 tables

#### Test 3: Query Execution
```bash
sqlite3 local.db "SELECT COUNT(*) FROM teachings;"
```
**Expected:** A number (count of teachings)

#### Test 4: DB Browser
1. Open DB Browser
2. Open `local.db`
3. Browse "teachings" table
**Expected:** See data in spreadsheet view

#### Test 5: Alias (if you created one)
```bash
kabir-db
```
**Expected:** SQLite opens with your database

---

## Part 8: Troubleshooting Installation

### Problem: "sqlite3: command not found"

**Solution:**
```bash
# Install via Homebrew
brew install sqlite3

# Check installation
which sqlite3
```

### Problem: "Permission denied" when opening database

**Solution:**
```bash
# Check file permissions
ls -l local.db

# Fix permissions if needed
chmod 644 local.db
```

### Problem: DB Browser won't open (macOS security)

**Solution:**
1. Go to System Settings → Privacy & Security
2. Scroll down to "Security"
3. Click "Open Anyway" next to DB Browser warning
4. Confirm by clicking "Open"

### Problem: "Database is locked"

**Cause:** Another program is using the database

**Solution:**
```bash
# Close all applications using the database
# Check if your dev server is running
lsof | grep local.db

# Kill processes if necessary
# Then try again
```

### Problem: Can't find local.db file

**Solution:**
```bash
# Search for it
find ~/Desktop -name "local.db"

# Or use full path
ls /Users/raunakbohra/Desktop/kabir-sant-sharan/local.db
```

---

## Part 9: Safety Reminders

### Before You Start Working

**1. Always backup your database:**
```bash
cd /Users/raunakbohra/Desktop/kabir-sant-sharan
cp local.db backups/local.db.$(date +%Y%m%d)
```

**2. Create a backup folder:**
```bash
mkdir -p backups
```

**3. Never edit database while dev server is running:**
```bash
# Stop your dev server first
# Press Ctrl+C in the terminal where it's running
```

### Read-Only Mode (Super Safe!)

**Open database in read-only mode:**
```bash
sqlite3 file:local.db?mode=ro
```

**Or in DB Browser:**
- Hold `Shift` while opening database
- Or: File → Open Database Read Only

**Why?** You can explore and learn without risk of changing anything!

---

## Part 10: Quick Reference

### Essential Commands

| Task | Command Line | DB Browser |
|------|-------------|------------|
| **Open database** | `sqlite3 local.db` | File → Open Database |
| **List tables** | `.tables` | Database Structure tab |
| **View table structure** | `.schema TABLE_NAME` | Expand table in structure view |
| **Browse data** | `SELECT * FROM table;` | Browse Data tab |
| **Run custom query** | Type SQL at `sqlite>` prompt | Execute SQL tab |
| **Exit** | `.quit` or `Ctrl+D` | Command+Q |

### File Locations

```
Database:
/Users/raunakbohra/Desktop/kabir-sant-sharan/local.db

Config file:
~/.sqliterc

Backup location (create this):
/Users/raunakbohra/Desktop/kabir-sant-sharan/backups/
```

---

## What's Next?

Now that you have tools installed and working, let's learn the essential commands!

**→ Continue to [03-BASIC-COMMANDS.md](./03-BASIC-COMMANDS.md)**

In the next guide, you'll learn:
- SQLite special commands (dot commands)
- SQL query syntax
- How to format output
- Your first real queries on teachings and events

---

## Advanced Setup (Optional)

### Install Additional Tools

#### 1. SQLite Viewer (VS Code Extension)

If you use VS Code:
1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X`)
3. Search for "SQLite Viewer"
4. Install "SQLite Viewer" by alexcvzz
5. Right-click `local.db` in VS Code → "Open Database"

#### 2. TablePlus (Premium GUI Alternative)

Free for 2 database connections:
```
https://tableplus.com/
```

Better UI than DB Browser, but costs money for unlimited use.

---

**Ready to start running queries?** Let's learn the basic commands!

**→ [03-BASIC-COMMANDS.md](./03-BASIC-COMMANDS.md)**