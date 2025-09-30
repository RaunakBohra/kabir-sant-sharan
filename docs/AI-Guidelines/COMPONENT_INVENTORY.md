# Component Inventory - Kabir Sant Sharan

**Last Updated:** 2025-09-30
**Total Components:** 63
**Purpose:** Track all React components to prevent duplication and enable reuse

---

## UI Components (Core Design System)

### Navigation & Layout (5 components)
- **BottomNav** `src/components/ui/BottomNav.tsx`
  - Fixed bottom navigation for mobile (Amazon/Flipkart style)
  - Props: `items: NavItem[]` with id, label, href, icon, activeIcon
  - Features: Active state detection, filled/outline icon variants, `lg:hidden`
  - Touch targets: 44px+ height

- **NavBar** `src/components/navigation/NavBar.tsx`
  - Main desktop navigation with dropdown menus
  - Mobile hamburger menu support

- **Footer** `src/components/layout/Footer.tsx`
  - Site-wide footer with links and social

- **LayoutContent** `src/components/layout/LayoutContent.tsx`
  - Main layout wrapper with responsive padding

- **FloatingActionButtons** `src/components/ui/floating-buttons/FloatingActionButtons.tsx`
  - FAB expandable menu (not currently used, bottom nav preferred)

### Buttons & Actions (1 component)
- **Button** `src/components/ui/button.tsx`
  - Base button with variants (primary, secondary, outline)

### Data Display (4 components)
- **Card** `src/components/ui/card.tsx` - Content card with header/body/footer
- **Badge** `src/components/ui/badge.tsx` - Status/label badges
- **Skeleton** `src/components/ui/skeleton.tsx` - Loading placeholders
- **Toast** `src/components/ui/toast.tsx` - Notifications (success/error/info)

### Forms & Input (5 components)
- **Form** `src/components/ui/form.tsx` - Form wrapper with validation
- **Label** `src/components/ui/label.tsx` - Accessible form labels
- **Select** `src/components/ui/select.tsx` - Dropdown select
- **FileUpload** `src/components/ui/file-upload.tsx` - File upload with drag-drop
- **RichTextEditor** `src/components/ui/rich-text-editor.tsx` - WYSIWYG editor

### Modals & Dialogs (2 components)
- **Dialog** `src/components/ui/dialog.tsx` - Base modal
- **AlertDialog** `src/components/ui/alert-dialog.tsx` - Confirmation/alert dialogs

### Utilities (2 components)
- **ErrorBoundary** `src/components/ui/error-boundary.tsx` - Error boundary with fallback
- **LanguageSwitcher** `src/components/ui/LanguageSwitcher.tsx` - EN/HI/NE toggle

---

## Spiritual Content Components (3 components)

- **HeroSection** `src/components/spiritual/HeroSection.tsx`
  - Homepage hero with logo, title, Kabir quote, CTA buttons
  - Responsive: `text-4xl md:text-6xl lg:text-7xl`

- **DailyQuote** `src/components/spiritual/DailyQuote.tsx`
  - Daily wisdom from `/api/quotes/daily/`
  - Share and "More Quotes" actions

- **FeaturedTeachings** `src/components/content/FeaturedTeachings.tsx`
  - Grid of 3 featured teachings
  - Responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## Events Components (5 components)

- **UpcomingEvents** `src/components/events/UpcomingEvents.tsx`
  - Grid of 3 upcoming events
  - Database fields: `startDate`, `location`, `type` (camelCase)

- **EventsList** `src/components/events/EventsList.tsx` - Full list with filtering
- **EventsCalendar** `src/components/events/EventsCalendar.tsx` - Calendar view
- **EventsFilters** `src/components/events/EventsFilters.tsx`
  - Mobile: `flex-col sm:flex-row`, `gap-2 sm:gap-3`
  - View toggle: Calendar/List

- **EventRegistrationModal** `src/components/events/EventRegistrationModal.tsx`
  - Theme: `ring-dark-900`, `bg-cream-*`

---

## Media Components (6 components)

- **MediaGrid** `src/components/media/MediaGrid.tsx`
  - Card layout with type indicators (`bg-dark-600/700`)
  - R2 streaming integration

- **FeaturedMedia** `src/components/media/FeaturedMedia.tsx` - Highlighted media
- **MediaFilters** `src/components/media/MediaFilters.tsx`
  - Mobile: `flex-col sm:flex-row`, `min-h-[44px]`

- **AudioPlayer** `src/components/media/AudioPlayer.tsx` - Custom audio UI
- **VideoPlayer** `src/components/media/VideoPlayer.tsx` - Custom video UI

---

## Blog & Content (2 components)

- **BlogList** `src/components/blog/BlogList.tsx` - Posts with pagination
- **BlogFilters** `src/components/blog/BlogFilters.tsx`
  - Mobile: `text-xs sm:text-sm`, `flex-col sm:flex-row`

---

## Community Components (3 components)

- **CommunityHighlights** `src/components/community/CommunityHighlights.tsx`
  - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

- **CommunityStats** `src/components/community/CommunityStats.tsx`
- **SocialShare** `src/components/community/SocialShare.tsx`

---

## Search Components (2 components)

- **SearchBar** `src/components/search/SearchBar.tsx` - Simple search input
- **AdvancedSearch** `src/components/search/AdvancedSearch.tsx`
  - **Mobile:** `text-2xl sm:text-3xl`, `pl-9 sm:pl-10`, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - **Theme:** All `cream-*`/`dark-*`, icons `text-dark-600`, highlights `bg-cream-300`

---

## Forms (2 components)

- **ContactForm** `src/components/forms/ContactForm.tsx`
- **NewsletterSignup** `src/components/forms/NewsletterSignup.tsx`

---

## Authentication (1 component)

- **ProtectedRoute** `src/components/ProtectedRoute.tsx`
  - Route guard for admin pages, redirects to `/login`

---

## Admin Components (22 components)

### Admin Layout (2 components)
- **AdminSidebar** `src/components/admin/AdminSidebar.tsx`
  - Mobile: Off-canvas with overlay (`lg:hidden`)
  - Desktop: Fixed sidebar

- **AdminHeader** `src/components/admin/AdminHeader.tsx`
  - Hamburger menu: `lg:hidden`
  - Theme: `text-dark-700 hover:bg-cream-200` (no red)
  - Touch: `touch-manipulation`, `min-h-[44px]`

### Content Management (3 components)
- **ContentManager** `src/components/admin/ContentManager.tsx` - Main dashboard with tabs
- **TeachingsManager** `src/components/admin/TeachingsManager.tsx` - Manage teachings
- **EventsManager** `src/components/admin/EventsManager.tsx` - Manage events (card layout)

### Event Forms (1 component)
- **EventForm** `src/components/admin/EventForm.tsx`
  - All focus rings: `ring-dark-900`
  - Used by `/admin/events/new` and `/admin/events/[id]/edit`

### Media Management (4 components)
- **MediaManager** `src/components/admin/MediaManager.tsx` - Library management with R2
- **MediaUpload** `src/components/admin/MediaUpload.tsx`
- **EditMediaDialog** `src/components/admin/MediaManager/EditMediaDialog.tsx`
- **MediaPreviewDialog** `src/components/admin/MediaManager/MediaPreviewDialog.tsx`

### Newsletter (3 components)
- **Newsletter** `src/components/admin/Newsletter.tsx`
  - Tabs: Subscribers, Campaigns, Settings, Analytics
  - Mobile: `overflow-x-auto`, `text-xs sm:text-sm`

- **AddSubscriberDialog** `src/components/admin/Newsletter/AddSubscriberDialog.tsx`
- **ExportDialog** `src/components/admin/Newsletter/ExportDialog.tsx`

### Analytics & Monitoring (3 components)
- **Analytics** `src/components/admin/Analytics.tsx` - Page views, user stats
- **PerformanceMonitor** `src/components/admin/PerformanceMonitor.tsx` - System metrics
- **Settings** `src/components/admin/Settings.tsx` - Admin settings

### Admin Dialogs (3 components)
- **CreateTeachingDialog** `src/components/admin/ContentManager/CreateTeachingDialog.tsx`
- **CreateEventDialog** `src/components/admin/ContentManager/CreateEventDialog.tsx`
- **DeleteConfirmDialog** `src/components/admin/ContentManager/DeleteConfirmDialog.tsx`

---

## Responsive Patterns

### Text Sizing
```tsx
text-2xl sm:text-3xl md:text-4xl lg:text-5xl  // Headings
text-sm sm:text-base lg:text-lg                // Body
text-xs sm:text-sm                             // Labels
```

### Layout
```tsx
flex flex-col sm:flex-row gap-3 sm:gap-6              // Stacking
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4       // Grid
px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4            // Spacing
min-h-[44px] touch-manipulation                       // Touch targets
```

---

## Theme Consistency

### Colors (Strict)
- **Backgrounds:** `cream-50/100/200/300/500`
- **Text:** `dark-500/600/700/800/900`
- **Borders:** `cream-200/300`, `dark-200/300`
- **Icons:** `dark-600` (never colored)
- **Focus:** `ring-dark-900`
- **Spinners:** `border-dark-900`

### Anti-Patterns
❌ `teal-*`, `amber-*`, `blue-*`, `green-*`, `yellow-*`, `red-*`, `purple-*`
❌ Multiple fonts, gradients, emojis

---

## Database Conventions

Event fields (camelCase):
```typescript
startDate, endDate, type, featured, registrationRequired, currentAttendees
```

---

## Component Creation Checklist

1. ✅ Search this inventory
2. ✅ Check existing patterns
3. ✅ Mobile-first responsive
4. ✅ Theme consistency (cream/dark)
5. ✅ Touch targets (44px+)
6. ✅ Document here
7. ✅ Commit immediately

---

## File Size Compliance

All components under 200 lines ✓

---

## Notes

- Always check this file before creating components
- Update immediately after creating/modifying
- Prefer composition over new components
- Mobile-first is mandatory