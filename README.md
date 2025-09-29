# Kabir Sant Sharan

A spiritual website dedicated to sharing the divine teachings of Sant Kabir Das and fostering a community of devotees and spiritual seekers.

## 🕉️ Project Overview

This website serves the Kabir Ashram community with:
- **Teachings**: Blog posts, daily wisdom, and spiritual content
- **Events**: Satsang schedules, festivals, and community gatherings
- **Media**: Audio teachings, bhajans, and video content
- **Community**: Member interaction and spiritual discussions
- **Bilingual Support**: English and Nepali content

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom teal/amber theme
- **Deployment**: Vercel (free tier)
- **Database**: Railway PostgreSQL (free tier)
- **Media**: Cloudinary (free tier)
- **Email**: Kit/ConvertKit (free tier)

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── content/        # Content-specific components
│   ├── forms/          # Form components
│   ├── spiritual/      # Spiritual/religious components
│   ├── media/          # Audio/video components
│   ├── navigation/     # Navigation components
│   └── calendar/       # Calendar/event components
├── lib/
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles

docs/
├── templates/          # Documentation templates
└── AI-Guidelines/      # Development guidelines
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kabir-sant-sharan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎨 Design System

### Colors
- **Primary**: Teal (#14b8a6) - Spiritual serenity
- **Accent**: Amber (#f59e0b) - Divine warmth
- **Gray Scale**: Modern gray palette for text and backgrounds

### Typography
- System font stack for optimal performance
- Consistent scale: text-sm, text-base, text-lg, text-xl, etc.

### Components
- Mobile-first responsive design
- Accessible (WCAG 2.1 AA compliant)
- Consistent spacing and typography
- Reusable component library

## 📚 Documentation

- **Component Inventory**: See `docs/AI-Guidelines/COMPONENT_INVENTORY.md`
- **Service Inventory**: See `docs/AI-Guidelines/SERVICE_INVENTORY.md`
- **Patterns**: See `docs/AI-Guidelines/PATTERNS.md`
- **Decisions**: See `docs/AI-Guidelines/DECISIONS.md`

## 🌐 Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push to main

## 🤝 Contributing

1. Follow the 11-Rule System in development guidelines
2. Check component inventory before creating new components
3. Update documentation when adding new features
4. Maintain mobile-first responsive design
5. Ensure accessibility compliance

## 📊 Performance Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: Main < 200KB, Vendor < 500KB (gzipped)

## 🔒 Security

- HTTPS everywhere
- Secure headers configured
- Input validation and sanitization
- No hardcoded secrets

## 💰 Budget Constraints

- Total operational cost: $0-5/month
- Free tier services only
- No premium dependencies
- Optimized for cost efficiency

## 🌍 Accessibility

- WCAG 2.1 AA compliant
- Screen reader support
- Keyboard navigation
- Color contrast compliance
- Alternative text for images

## 🙏 Spiritual Guidelines

This website is built with reverence and devotion to Sant Kabir Das and his timeless teachings. All content and development should reflect:

- Respect for spiritual traditions
- Inclusive community values
- Accessibility for all devotees
- Peace and harmony in design

---

*"जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।" - Sant Kabir Das*