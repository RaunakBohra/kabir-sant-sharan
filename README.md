# Kabir Sant Sharan

A spiritual website dedicated to sharing the divine teachings of Sant Kabir Das and fostering a community of devotees and spiritual seekers.

## Project Overview

This website serves the Kabir Ashram community with:
- **Teachings**: Blog posts, daily wisdom, and spiritual content
- **Events**: Satsang schedules, festivals, and community gatherings
- **Media**: Audio teachings, bhajans, and video content
- **Community**: Member interaction and spiritual discussions
- **Bilingual Support**: English and Nepali content

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cream/black spiritual theme
- **Hosting**: Cloudflare Pages (free tier)
- **Database**: Cloudflare D1 SQLite (free tier)
- **Functions**: Cloudflare Workers (free tier)
- **Storage**: Cloudflare R2 (free tier)
- **CDN**: Cloudflare Global Network (free tier)

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

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account (free tier)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RaunakBohra/kabir-sant-sharan.git
cd kabir-sant-sharan
```

2. Install dependencies:
```bash
npm install
```

3. Set up Cloudflare:
   - Create account at [cloudflare.com](https://cloudflare.com)
   - Install Wrangler CLI: `npm install -g wrangler`
   - Authenticate: `wrangler login`

4. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Cloudflare credentials to .env.local:
# CLOUDFLARE_API_TOKEN=your-api-token
# CLOUDFLARE_ACCOUNT_ID=your-account-id
# CLOUDFLARE_DATABASE_ID=your-d1-database-id
```

5. Create Cloudflare D1 database:
```bash
wrangler d1 create kabir-sant-sharan
# Copy the database ID to your .env.local
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:5002](http://localhost:5002) in your browser

8. (Optional) Initialize database with spiritual content:
```bash
wrangler d1 execute kabir-sant-sharan --file=./database-setup.sql
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
wrangler dev         # Start Cloudflare Workers development
wrangler deploy      # Deploy to Cloudflare Workers
wrangler d1 migrations apply kabir-sant-sharan  # Run database migrations
```

## Design System

### Colors
- **Primary**: Cream (#f9f9f9) - Pure spiritual light
- **Accent**: Dark (#000000) - Grounded wisdom
- **Cream Scale**: Light cream palette for backgrounds and cards
- **Dark Scale**: Black to gray for text and emphasis

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

## Deployment

This project is optimized for deployment on Cloudflare Pages:

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings: `npm run build` with output directory `out`
3. Set environment variables in Cloudflare dashboard
4. Deploy automatically on every push to main
5. Configure custom domain and SSL through Cloudflare

### Manual Deployment
```bash
wrangler pages deploy out --project-name=kabir-sant-sharan
```

## Contributing

1. Follow component-first architecture patterns
2. Check component inventory before creating new components
3. Update documentation when adding new features
4. Maintain mobile-first responsive design
5. Ensure accessibility compliance
6. Use professional SVG icons instead of emojis
7. Follow cream/black spiritual theme consistently

## Performance Targets

- **LCP**: < 1.5s (Largest Contentful Paint) - Enhanced by Cloudflare CDN
- **FID**: < 50ms (First Input Delay) - Optimized with Workers
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: Main < 150KB, Vendor < 400KB (gzipped)
- **Global Response Time**: < 200ms (Cloudflare edge network)

## Security

- HTTPS everywhere with Cloudflare SSL
- DDoS protection included
- WAF (Web Application Firewall) protection
- Input validation and sanitization
- Environment variables secured in Cloudflare

## Budget & Cost

- **Total operational cost**: $0/month
- **Cloudflare Pages**: Free tier (500 builds/month)
- **Cloudflare D1**: Free tier (5GB storage, 25M reads/month)
- **Cloudflare Workers**: Free tier (100k requests/day)
- **Cloudflare R2**: Free tier (10GB storage)
- **No premium dependencies required**

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