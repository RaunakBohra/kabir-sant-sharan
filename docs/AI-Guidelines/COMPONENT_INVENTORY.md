# Component Inventory

## Layout Components

### Navigation
- **NavBar**: Main navigation with dropdown menus and mobile support
  - Location: `src/components/navigation/NavBar.tsx`
  - Props: No props (uses internal state)
  - Features: Dropdown menus, mobile hamburger menu, SVG spiritual logo
  - Usage: Site-wide navigation

### Footer
- **Footer**: Site footer with spiritual branding and links
  - Location: `src/components/layout/Footer.tsx`
  - Props: No props
  - Features: Professional SVG logo, organized link sections, spiritual quotes
  - Usage: Site-wide footer

## Spiritual Components

### Homepage
- **HeroSection**: Main landing hero with spiritual branding
  - Location: `src/components/spiritual/HeroSection.tsx`
  - Props: No props
  - Features: Large spiritual logo, Kabir quotes, CTA buttons
  - Usage: Homepage hero section

- **DailyQuote**: Daily rotating spiritual quotes
  - Location: `src/components/spiritual/DailyQuote.tsx`
  - Props: No props (rotates based on date)
  - Features: English/Nepali quotes, sharing buttons, interactive UI
  - Usage: Homepage daily wisdom section

## Content Components

### Teachings/Blog
- **FeaturedTeachings**: Curated spiritual teachings preview
  - Location: `src/components/content/FeaturedTeachings.tsx`
  - Props: No props (uses sample data)
  - Features: Category tags, read time, spiritual content cards
  - Usage: Homepage featured content

- **BlogList**: Complete blog listing with pagination
  - Location: `src/components/blog/BlogList.tsx`
  - Props: No props (uses sample data)
  - Features: Featured posts, grid layout, pagination
  - Usage: `/teachings` page main content

- **BlogFilters**: Search and filtering for spiritual content
  - Location: `src/components/blog/BlogFilters.tsx`
  - Props: No props (manages internal state)
  - Features: Category filters, search, sorting options
  - Usage: `/teachings` page filtering

### Events
- **UpcomingEvents**: Event preview cards for homepage
  - Location: `src/components/events/UpcomingEvents.tsx`
  - Props: No props (uses sample data)
  - Features: Event cards with date/time, registration info
  - Usage: Homepage events section

- **EventsCalendar**: Interactive monthly calendar view
  - Location: `src/components/events/EventsCalendar.tsx`
  - Props: No props (manages calendar state)
  - Features: Month navigation, event popups, color coding
  - Usage: `/events` page calendar view

- **EventsList**: Detailed event listings
  - Location: `src/components/events/EventsList.tsx`
  - Props: No props (uses sample data)
  - Features: Detailed event cards, registration tracking, sharing
  - Usage: `/events` page list view

- **EventsFilters**: Event filtering and view controls
  - Location: `src/components/events/EventsFilters.tsx`
  - Props: No props (manages filter state)
  - Features: Category filters, time filters, calendar/list toggle
  - Usage: `/events` page filtering

### Media Components
- **AudioPlayer**: Professional audio player with full controls
  - Location: `src/components/media/AudioPlayer.tsx`
  - Props: `{ title: string, artist?: string, src: string, duration?: string, onPlayStateChange?: (isPlaying: boolean) => void }`
  - Features: Play/pause, seek, volume, progress tracking
  - Usage: Spiritual audio content playback

- **VideoPlayer**: Professional video player with overlay controls
  - Location: `src/components/media/VideoPlayer.tsx`
  - Props: `{ title: string, src: string, poster?: string, duration?: string, onPlayStateChange?: (isPlaying: boolean) => void }`
  - Features: Play/pause, seek, volume, fullscreen, overlay controls
  - Usage: Satsang and spiritual video content

- **MediaFilters**: Media library filtering system
  - Location: `src/components/media/MediaFilters.tsx`
  - Props: No props (manages filter state)
  - Features: Media type filters, category filters, duration filters, search
  - Usage: `/media` page filtering

### Community Components
- **CommunityHighlights**: Community features showcase
  - Location: `src/components/community/CommunityHighlights.tsx`
  - Props: No props (uses sample data)
  - Features: Community feature cards with SVG icons, member counts
  - Usage: Homepage community section

## Usage Guidelines

### Component Creation Rules
1. Max 200 lines per component
2. Props interface with JSDoc
3. Default export with named type export
4. Consistent file naming: PascalCase.tsx
5. Colocate styles with Tailwind classes

### Import Patterns
```tsx
// Preferred import pattern
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Component composition over inheritance
<Card>
  <Button variant="primary">Action</Button>
</Card>
```

### Before Creating New Components
1. Check this inventory first
2. Search existing codebase: `grep -r "ComponentName" src/`
3. Consider composition of existing components
4. Update this inventory when adding new components