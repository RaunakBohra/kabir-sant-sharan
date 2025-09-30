# Kabir Sant Sharan 🕉️

A modern, secure spiritual platform dedicated to sharing the divine teachings of Sant Kabir Das and fostering a community of devotees and spiritual seekers. Built with enterprise-grade security and comprehensive monitoring.

## ✨ Project Overview

This platform serves the Kabir Ashram community with:
- **📖 Teachings**: Searchable repository of Sant Kabir's wisdom and daily spiritual insights
- **🎪 Events**: Satsang schedules, festivals, and community gatherings with registration
- **🎵 Media**: Audio teachings, bhajans, video content, and image galleries
- **👥 Community**: Member interaction, spiritual discussions, and newsletter system
- **🌐 Bilingual Support**: English and Nepali content with i18n
- **🔐 Admin Panel**: Comprehensive content management and analytics dashboard
- **📊 Performance Monitoring**: Real-time system monitoring and metrics

## 🛠️ Technology Stack

### Core Technologies
- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom cream/black spiritual theme
- **Database**: SQLite (development) / PostgreSQL (production) with Drizzle ORM
- **Authentication**: JWT with secure refresh token rotation
- **Hosting**: Cloudflare Pages (free tier) / Vercel (recommended)

### Security & Monitoring
- **🔒 Enterprise Security**: JWT auth, RBAC, rate limiting, input sanitization
- **📈 Performance Monitoring**: Real-time metrics, alerts, Prometheus integration
- **🛡️ Security Headers**: CSRF protection, XSS prevention, content security policy
- **📝 Structured Logging**: Request tracing, error tracking, performance insights
- **✅ Input Validation**: Comprehensive Zod schemas for all endpoints

### Infrastructure
- **Database**: Cloudflare D1 SQLite (free tier) / PostgreSQL (production)
- **Functions**: Cloudflare Workers (free tier) / Serverless functions
- **Storage**: Cloudflare R2 (free tier) / AWS S3
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
wrangler d1 execute kabir-sant-sharan --file=./scripts/database/database-setup.sql
```

## 🚀 Development Commands

### Core Development
```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking
```

### Database Management
```bash
npm run db:init         # Initialize database (migrate + seed)
npm run db:migrate      # Run pending migrations
npm run db:seed         # Seed database with sample data
npm run db:status       # Show migration status
npm run db:validate     # Validate migration integrity
npm run db:rollback     # Rollback last migration (with --force)
npm run db:health       # Check database health
npm run db:stats        # Show database statistics
```

### Environment Setup
```bash
npm run setup:env       # Interactive environment configuration
npm run setup:admin     # Create admin user
npm run setup:security  # Generate security keys
```

### Testing & Quality
```bash
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run end-to-end tests
npm run test:coverage   # Generate coverage report
```

### Cloudflare (if using)
```bash
wrangler dev            # Start Cloudflare Workers development
wrangler deploy         # Deploy to Cloudflare Workers
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

## 🔐 Security Features

This platform implements enterprise-grade security:

### Authentication & Authorization
- **JWT Tokens**: Secure authentication with refresh token rotation
- **Role-Based Access Control**: Admin and user role separation
- **Session Management**: Database-backed session persistence
- **Multi-Factor Ready**: Extensible for 2FA implementation

### API Security
- **Rate Limiting**: Configurable limits per endpoint and user
- **Input Validation**: Comprehensive Zod schemas for all inputs
- **XSS Protection**: Input sanitization and CSP headers
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Error Handling**: Secure error responses (RFC 9457 compliant)

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing protection)
- Referrer-Policy (referrer information control)
- Permissions-Policy (feature access control)

## 📊 Performance Monitoring

Comprehensive real-time monitoring system:

### Request Monitoring
- **Response Times**: Track P50, P90, P95, P99 percentiles
- **Error Rates**: Monitor HTTP error rates and patterns
- **Throughput**: Requests per second tracking
- **Slow Request Detection**: Automatic alerts for performance issues

### Database Performance
- **Query Performance**: Track slow queries and optimization opportunities
- **Cache Hit Rates**: Monitor database query caching effectiveness
- **Connection Pooling**: Active connection monitoring

### System Metrics
- **Memory Usage**: Heap and process memory tracking
- **CPU Usage**: Process CPU utilization monitoring
- **Resource Alerts**: Automatic warnings for resource constraints

### Admin Dashboard
- **Real-time Metrics**: Live performance data with auto-refresh
- **Performance Alerts**: Visual indicators for critical issues
- **Historical Analysis**: Configurable time windows (5min to 24hrs)
- **Prometheus Export**: Metrics export for external monitoring tools

### API Endpoints
- `GET /api/v1/performance` - Comprehensive performance metrics
- `GET /api/v1/performance/live` - Real-time performance data
- `GET /api/v1/health` - System health checks
- `GET /api/v1/metrics` - Prometheus format metrics

## 📚 Documentation

### Technical Documentation
- **[Performance Monitoring](./docs/performance-monitoring.md)**: Complete performance monitoring guide
- **[API Documentation](./docs/api-documentation.md)**: Comprehensive API reference
- **[Security Guide](./docs/security-guide.md)**: Security implementation details
- **[Database Guide](./docs/database-guide.md)**: Database schema and migrations
- **[Development Setup](./docs/development-setup.md)**: Detailed development environment setup
- **[Deployment Guide](./docs/deployment-guide.md)**: Production deployment instructions
- **[Environment Configuration](./docs/environment-configuration.md)**: Environment variables reference

### Architecture Documentation
- **[System Architecture](./docs/architecture.md)**: System design and components
- **[Error Handling](./docs/error-handling.md)**: Error management strategy
- **[Monitoring & Logging](./docs/monitoring-logging.md)**: Observability setup

### Legacy Documentation
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