# Component Inventory

## Layout Components

### Navigation
- **NavBar**: Main navigation component
  - Location: `src/components/navigation/NavBar.tsx`
  - Props: `{ items: NavItem[], currentPath: string }`
  - Usage: Site-wide navigation

### Containers
- **Container**: Max-width wrapper
  - Location: `src/components/layout/Container.tsx`
  - Props: `{ size?: 'sm' | 'md' | 'lg' | 'xl', children: ReactNode }`
  - Usage: Content wrapping with responsive max-widths

## UI Components

### Buttons
- **Button**: Primary button component
  - Location: `src/components/ui/Button.tsx`
  - Props: `{ variant?: 'primary' | 'secondary' | 'outline', size?: 'sm' | 'md' | 'lg', children: ReactNode }`
  - Variants: Teal primary, amber secondary, outline

### Typography
- **Heading**: Semantic heading component
  - Location: `src/components/ui/Heading.tsx`
  - Props: `{ level: 1 | 2 | 3 | 4 | 5 | 6, children: ReactNode, className?: string }`
  - Usage: All headings with consistent typography scale

### Cards
- **Card**: Base card component
  - Location: `src/components/ui/Card.tsx`
  - Props: `{ children: ReactNode, className?: string }`
  - Usage: Content containers with subtle shadow

## Content Components

### Blog
- **BlogPost**: Individual blog post display
  - Location: `src/components/content/BlogPost.tsx`
  - Props: `{ post: BlogPost, variant?: 'full' | 'preview' }`
  - Usage: Blog post rendering

### Events
- **EventCard**: Event display component
  - Location: `src/components/content/EventCard.tsx`
  - Props: `{ event: Event, variant?: 'list' | 'grid' }`
  - Usage: Event listings and details

### Media
- **AudioPlayer**: Custom audio player
  - Location: `src/components/media/AudioPlayer.tsx`
  - Props: `{ src: string, title?: string, autoPlay?: boolean }`
  - Usage: Spiritual teachings and bhajans

- **VideoPlayer**: Custom video player
  - Location: `src/components/media/VideoPlayer.tsx`
  - Props: `{ src: string, poster?: string, title?: string }`
  - Usage: Satsang recordings and teachings

## Form Components

### Inputs
- **Input**: Text input component
  - Location: `src/components/forms/Input.tsx`
  - Props: `{ label: string, error?: string, ...inputProps }`
  - Usage: Form fields with validation

### Community
- **ContactForm**: Contact form component
  - Location: `src/components/forms/ContactForm.tsx`
  - Props: `{ onSubmit: (data: ContactData) => void }`
  - Usage: Contact and inquiry forms

## Spiritual Components

### Quotes
- **DailyQuote**: Daily wisdom display
  - Location: `src/components/spiritual/DailyQuote.tsx`
  - Props: `{ quote: Quote, showAuthor?: boolean }`
  - Usage: Daily Kabir quotes

### Calendar
- **EventCalendar**: Satsang and event calendar
  - Location: `src/components/calendar/EventCalendar.tsx`
  - Props: `{ events: Event[], view?: 'month' | 'list' }`
  - Usage: Event scheduling display

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