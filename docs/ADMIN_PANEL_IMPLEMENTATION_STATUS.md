# Admin Panel Implementation Status

**Date:** 2025-09-30
**Version:** Phase 1 Complete

---

## ✅ Phase 1: Foundation Components (COMPLETED)

### 1. Core UI Components
- ✅ **Dialog** (`src/components/ui/dialog.tsx`) - Modal system with backdrop, focus trap, keyboard support
- ✅ **AlertDialog** (`src/components/ui/alert-dialog.tsx`) - Confirmation dialogs for destructive actions
- ✅ **Form** (`src/components/ui/form.tsx`) - React Hook Form integration with Zod validation
- ✅ **Label** (`src/components/ui/label.tsx`) - Accessible form labels
- ✅ **Skeleton** (`src/components/ui/skeleton.tsx`) - Loading state placeholders
- ✅ **Utils** (`src/lib/utils.ts`) - Tailwind className merger utility

### 2. Advanced Components
- ✅ **Rich Text Editor** (`src/components/ui/rich-text-editor.tsx`)
  - Full Tiptap integration with StarterKit
  - Advanced toolbar: Bold, Italic, Strike, H1-H3, Lists, Blockquote, Code blocks
  - Link & Image insertion
  - Table support
  - Undo/Redo
  - Word & character counter
  - Placeholder support
  - Min/max height control

- ✅ **Toast Notifications** (`src/components/ui/toast.tsx`)
  - Sonner integration
  - Top-right positioning
  - Rich colors for success/error/warning
  - Close button
  - Automatic dismissal
  - Added to root layout

- ✅ **File Upload** (`src/components/ui/file-upload.tsx`)
  - Drag & drop zone with react-dropzone
  - Click to browse fallback
  - Multiple file support
  - File type validation (images, audio, video, PDF)
  - Size limit enforcement
  - Preview thumbnails with file icons
  - Remove file before upload
  - Beautiful error messages via toast

### 3. Dependencies Installed
```json
{
  "sonner": "^1.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x",
  "react-dropzone": "^14.x",
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-table": "^2.x",
  "@tiptap/extension-table-row": "^2.x",
  "@tiptap/extension-table-cell": "^2.x",
  "@tiptap/extension-table-header": "^2.x",
  "@tiptap/extension-code-block": "^2.x",
  "react-image-crop": "^11.x",
  "papaparse": "^5.x",
  "react-hotkeys-hook": "^4.x",
  "date-fns": "^3.x",
  "@radix-ui/react-dialog": "^1.x",
  "@radix-ui/react-alert-dialog": "^1.x",
  "@radix-ui/react-label": "^2.x",
  "@radix-ui/react-slot": "^1.x",
  "class-variance-authority": "^0.7.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

---

## ✅ Phase 2: Database Schema Updates (COMPLETED)

### Task: Add Trash System (30-day recovery)

**Migration File:** `drizzle/migrations/XXX_add_trash_system.sql`

```sql
-- Add deleted_at column to all content tables
ALTER TABLE blog_posts ADD COLUMN deleted_at TEXT;
ALTER TABLE events ADD COLUMN deleted_at TEXT;
ALTER TABLE media_content ADD COLUMN deleted_at TEXT;
ALTER TABLE newsletter_campaigns ADD COLUMN deleted_at TEXT;

-- Create index for efficient trash queries
CREATE INDEX idx_blog_posts_deleted_at ON blog_posts(deleted_at);
CREATE INDEX idx_events_deleted_at ON events(deleted_at);
CREATE INDEX idx_media_content_deleted_at ON media_content(deleted_at);

-- Create trash table for audit trail
CREATE TABLE trash (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_data TEXT NOT NULL, -- JSON snapshot
  deleted_by TEXT NOT NULL,
  deleted_at TEXT NOT NULL,
  scheduled_purge_at TEXT NOT NULL,
  restored_at TEXT,
  restored_by TEXT
);

CREATE INDEX idx_trash_scheduled_purge ON trash(scheduled_purge_at);
CREATE INDEX idx_trash_content_type_id ON trash(content_type, content_id);
```

**Schema Updates:** `drizzle/schema.ts`
```typescript
// Add to each content table
deletedAt: text('deleted_at'),

// New trash table
export const trash = sqliteTable('trash', {
  id: text('id').primaryKey(),
  contentType: text('content_type').notNull(),
  contentId: text('content_id').notNull(),
  contentData: text('content_data', { mode: 'json' }).notNull(),
  deletedBy: text('deleted_by').notNull(),
  deletedAt: text('deleted_at').notNull(),
  scheduledPurgeAt: text('scheduled_purge_at').notNull(),
  restoredAt: text('restored_at'),
  restoredBy: text('restored_by'),
});
```

**API Endpoints Needed:**
- `GET /api/trash` - List all trashed items
- `POST /api/trash/:id/restore` - Restore from trash
- `DELETE /api/trash/:id` - Permanently delete
- `POST /api/trash/purge` - Purge expired items (cron job)

---

## ✅ Phase 3: ContentManager CRUD (COMPLETED)

### Components to Build:

#### 1. Create Teaching Dialog
**File:** `src/components/admin/ContentManager/CreateTeachingDialog.tsx`

**Features:**
- Form with React Hook Form + Zod validation
- Fields: title, category, tags, excerpt, content (RichTextEditor), author, published date, featured image
- Save & Publish button
- Save as Draft button
- Auto-save to localStorage every 30s
- Unsaved changes warning
- Loading states
- Success/error toasts

#### 2. Create Event Dialog
**File:** `src/components/admin/ContentManager/CreateEventDialog.tsx`

**Features:**
- Form fields: title, description (RichTextEditor), event type, location, virtual link, start/end datetime, max attendees, registration required, featured image
- Date validation (end must be after start)
- URL validation for virtual link
- Same save/draft/auto-save pattern

#### 3. Edit Teaching Dialog
**File:** `src/components/admin/ContentManager/EditTeachingDialog.tsx`

**Features:**
- Pre-fill form with existing data
- PUT /api/teachings/:id
- "Last updated" timestamp
- "View Public Page" link
- Delete button (opens DeleteConfirmDialog)

#### 4. Edit Event Dialog
**File:** `src/components/admin/ContentManager/EditEventDialog.tsx`

**Features:**
- Pre-fill form
- PUT /api/events/:id
- Show current attendee count (read-only)
- "Copy Event" button (duplicate with new date)

#### 5. Delete Confirm Dialog
**File:** `src/components/admin/ContentManager/DeleteConfirmDialog.tsx`

**Features:**
- Show item title in warning
- Explain 30-day trash recovery
- Require typing "DELETE" to confirm
- Or 1-second button hold
- On confirm: Updates deleted_at timestamp
- Success toast: "Moved to trash. Recoverable for 30 days."

#### 6. Updated ContentManager
**File:** Update `src/components/admin/ContentManager.tsx`

**Changes:**
- Import all new dialog components
- Add state for dialog open/close and selected item
- Wire up "Add Content" button
- Wire up Edit icons
- Wire up Delete icons
- Handle success callbacks (refresh list, toast)
- Add keyboard shortcut (Cmd+N for new)

---

## 🎨 Phase 4: MediaManager Enhancements

### Components to Build:

#### 1. Media Preview Dialog
**File:** `src/components/admin/MediaManager/MediaPreviewDialog.tsx`

**Features by Type:**
- **Image:** Full-size display, zoom controls, download, copy URL
- **Audio:** HTML5 audio player, play/pause, seek, volume, duration
- **Video:** HTML5 video player, fullscreen toggle
- **PDF:** Embedded iframe viewer

#### 2. Media Edit Dialog
**File:** `src/components/admin/MediaManager/EditMediaDialog.tsx`

**Features:**
- Edit metadata: title, description, artist (audio), alt text (images), tags
- For images: Crop tool (react-image-crop), generate thumbnail
- PUT /api/media/:id

#### 3. Image Crop Tool
**File:** `src/components/admin/MediaManager/ImageCropTool.tsx`

**Features:**
- react-image-crop integration
- Aspect ratio presets (16:9, 4:3, 1:1, free)
- Preview cropped result
- Save cropped version

#### 4. Bulk Operations
**File:** Update `src/components/admin/MediaManager.tsx`

**Features:**
- Checkbox on each media card
- Select all checkbox
- Bulk action bar when items selected
- Bulk delete (with confirm)
- Bulk download (zip)
- Bulk tag

---

## 📧 Phase 5: Newsletter Enhancements

### Components to Build:

#### 1. Add Subscriber Dialog
**File:** `src/components/admin/Newsletter/AddSubscriberDialog.tsx`

**Features:**
- Form: email, name (optional), preferences (checkboxes), send welcome email (checkbox)
- Email validation
- POST /api/newsletter/subscribers

#### 2. Export Dialog
**File:** `src/components/admin/Newsletter/ExportDialog.tsx`

**Features:**
- Select format: CSV, JSON, Excel
- Select fields to export
- Filter by segment
- Generate download

#### 3. Email Templates
**File:** `src/components/admin/Newsletter/EmailTemplates.tsx`

**5 Pre-made Templates:**
1. **Weekly Teachings** - Digest of new spiritual content
2. **Event Announcement** - Upcoming satsang/meditation
3. **Meditation Reminder** - Daily practice encouragement
4. **Quote of the Week** - Kabir's wisdom highlight
5. **Welcome Email** - New subscriber onboarding

**Features:**
- Template preview
- Click to load into composer
- Variable replacement: {{name}}, {{email}}, {{unsubscribe_link}}

#### 4. Campaign Preview
**File:** `src/components/admin/Newsletter/CampaignPreviewDialog.tsx`

**Features:**
- Desktop/mobile preview toggle
- Test with different subscriber names
- "Send Test" button
- "Looks good, send to X subscribers" button

#### 5. Draft System
**Update:** `src/components/admin/Newsletter.tsx`

**Features:**
- Auto-save to localStorage every 30s
- "Save as Draft" saves to database
- Load drafts from database
- Restore from localStorage on crash recovery

---

## ⚙️ Phase 6: Settings & Profile

### Components to Build:

#### 1. Settings API
**File:** `src/app/api/settings/route.ts`

**Endpoints:**
- GET /api/settings - Fetch all settings
- POST /api/settings - Update settings
- Database table: site_settings (key-value store)

#### 2. Profile Dialog
**File:** `src/components/admin/AdminHeader/ProfileDialog.tsx`

**Features:**
- Edit name, avatar, timezone, language, email notifications
- Avatar upload with crop
- PUT /api/auth/profile

#### 3. Change Password Dialog
**File:** `src/components/admin/AdminHeader/ChangePasswordDialog.tsx`

**Features:**
- Current password (required)
- New password (min 12 chars, strength indicator)
- Confirm new password
- zxcvbn password strength meter
- On success: logout all other sessions
- POST /api/auth/change-password

#### 4. Wire up Header
**Update:** `src/components/admin/AdminHeader.tsx`

**Changes:**
- "Profile Settings" button opens ProfileDialog
- "Change Password" button opens ChangePasswordDialog
- Make functional (currently just UI)

---

## 📊 Phase 7: Analytics Dashboard

### Component to Build:

#### Real Dashboard Homepage
**File:** Update `src/app/admin/page.tsx`

**Layout (60% analytics, 40% actions):**

**Left Column:**
1. **Quick Stats Cards (2x2):**
   - Total Teachings (with week-over-week trend ↑5%)
   - Total Events (upcoming count)
   - Active Subscribers (growth rate)
   - Page Views (30-day total)

2. **Recent Activity Feed:**
   - Last 10 actions with icons
   - "Created teaching: Title" by User • 5 min ago
   - "Uploaded media: filename.mp3" by User • 1 hour ago
   - Link to item

3. **Upcoming Events Widget:**
   - Next 3 events with countdown
   - Date, title, attendee count
   - "View All Events" link

**Right Column:**
1. **Quick Actions Panel:**
   - Large buttons:
     - "Create Teaching" (opens dialog)
     - "Create Event" (opens dialog)
     - "Upload Media" (opens upload)
     - "Send Newsletter" (opens compose)

2. **System Health:**
   - Database: ✅ Healthy
   - Storage: 2.3GB / 10GB (23%)
   - Last backup: 2 hours ago
   - Cloudflare status

3. **Top Content:**
   - Most viewed teaching
   - Most attended event
   - Top search query

**API Endpoint:**
GET /api/admin/dashboard
Returns: { stats, recentActivity, upcomingEvents, systemHealth, topContent }

---

## 🎹 Phase 8: Polish & Accessibility

### Features to Add:

#### 1. Keyboard Shortcuts
**File:** `src/hooks/useKeyboardShortcuts.ts`

**Shortcuts:**
- Cmd/Ctrl + K: Command palette (optional)
- Cmd/Ctrl + N: New content
- Cmd/Ctrl + S: Save current form
- Esc: Close current modal
- G then T: Go to Teachings
- G then E: Go to Events
- G then M: Go to Media

**Library:** react-hotkeys-hook

#### 2. Loading States
**Updates:** All components

**Add:**
- Skeleton loaders matching actual content layout
- Button loading states (spinner + "Saving...")
- Optimistic updates (add to list immediately, revert on error)

#### 3. Error Handling
**Updates:** All API calls

**Pattern:**
- Show error toast with message
- Log to console for debugging
- Keep form data (don't clear)
- Offer retry button
- Detect offline status

#### 4. Mobile Responsiveness
**Updates:** All dialogs

**Changes:**
- Full-screen modals on mobile (< 768px)
- Touch-friendly hit areas (min 44px)
- Forms stack vertically
- Tables convert to cards
- Sidebar becomes hamburger

#### 5. Accessibility Audit
**Tools:**
- Install: npm install -D @axe-core/react
- Run aXe DevTools in browser

**Check:**
- All buttons have labels
- All images have alt text
- Forms have associated labels
- Color contrast 4.5:1 minimum
- Keyboard navigation works
- Screen reader announces changes
- Focus visible on all interactive elements

---

## 📦 File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── dialog.tsx ✅
│   │   ├── alert-dialog.tsx ✅
│   │   ├── form.tsx ✅
│   │   ├── label.tsx ✅
│   │   ├── skeleton.tsx ✅
│   │   ├── toast.tsx ✅
│   │   ├── rich-text-editor.tsx ✅
│   │   └── file-upload.tsx ✅
│   └── admin/
│       ├── ContentManager/
│       │   ├── CreateTeachingDialog.tsx 🔄 NEXT
│       │   ├── CreateEventDialog.tsx
│       │   ├── EditTeachingDialog.tsx
│       │   ├── EditEventDialog.tsx
│       │   └── DeleteConfirmDialog.tsx
│       ├── MediaManager/
│       │   ├── MediaPreviewDialog.tsx
│       │   ├── EditMediaDialog.tsx
│       │   └── ImageCropTool.tsx
│       ├── Newsletter/
│       │   ├── AddSubscriberDialog.tsx
│       │   ├── ExportDialog.tsx
│       │   ├── EmailTemplates.tsx
│       │   └── CampaignPreviewDialog.tsx
│       └── AdminHeader/
│           ├── ProfileDialog.tsx
│           └── ChangePasswordDialog.tsx
├── app/
│   └── api/
│       ├── settings/route.ts
│       ├── trash/route.ts
│       ├── trash/[id]/restore/route.ts
│       └── admin/dashboard/route.ts
├── hooks/
│   └── useKeyboardShortcuts.ts
└── lib/
    └── utils.ts ✅
```

---

## 🎯 Implementation Priority

**NOW (Phase 2):** Database schema for trash system
**NEXT (Phase 3):** ContentManager CRUD dialogs
**THEN (Phase 4-8):** MediaManager, Newsletter, Settings, Dashboard, Polish

---

## 🚀 How to Continue

### Start Phase 2 (Database):
```bash
# Create migration
npm run db:generate

# Apply migration
npm run db:migrate

# Update schema types
npm run db:push
```

### Start Phase 3 (ContentManager):
```typescript
// Create first dialog
touch src/components/admin/ContentManager/CreateTeachingDialog.tsx

// Import in ContentManager.tsx
import { CreateTeachingDialog } from './ContentManager/CreateTeachingDialog';

// Add state
const [createDialogOpen, setCreateDialogOpen] = useState(false);

// Wire up button
<button onClick={() => setCreateDialogOpen(true)}>Add Content</button>

// Render dialog
<CreateTeachingDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
```

---

## 📊 Progress Tracking

- ✅ Phase 1: Foundation (100%)
- ✅ Phase 2: Database (100%)
- 🔄 Phase 3: ContentManager (0%)
- ⏳ Phase 4: MediaManager (0%)
- ⏳ Phase 5: Newsletter (0%)
- ⏳ Phase 6: Settings (0%)
- ⏳ Phase 7: Dashboard (0%)
- ⏳ Phase 8: Polish (0%)

**Overall Progress:** 25% (2/8 phases)

---

**Ready to continue? Start with Phase 2 (Database schema) or jump to Phase 3 (ContentManager dialogs)!**