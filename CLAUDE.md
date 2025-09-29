# Kabir Sant Sharan - Development Guidelines

## Core Principles
- Never use emojis, use professional SVG icons only
- Follow component-first architecture
- Maintain cream/black spiritual theme consistently
- Prioritize mobile-first responsive design
- Keep operational costs at $0/month using Cloudflare free tiers

## Cloudflare Stack Guidelines

### Database (Cloudflare D1)
- Use SQLite syntax, not PostgreSQL
- Leverage D1's edge replication for global performance
- Maximum 5GB storage and 25M reads/month on free tier
- Use prepared statements for security and performance
- Example connection pattern:
```typescript
import { drizzle } from 'drizzle-orm/d1'
const db = drizzle(env.DB)
```

### Functions (Cloudflare Workers)
- Keep Workers under 10ms execution time when possible
- Use edge caching for spiritual content that doesn't change often
- 100k requests/day limit on free tier
- Example Worker structure:
```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle API endpoints for spiritual content
    return new Response('Success')
  }
}
```

### Storage (Cloudflare R2)
- Use R2 for spiritual audio/video content
- 10GB storage and 1M Class A operations/month free
- Implement proper CORS for media streaming
- Use signed URLs for private spiritual content

### Hosting (Cloudflare Pages)
- Static site generation with Next.js
- 500 builds/month limit on free tier
- Automatic edge deployment globally
- Configure build command: `npm run build && npm run export`

## Theme Guidelines
- **Primary**: Cream (#f9f9f9) backgrounds
- **Secondary**: Dark (#000000) for text and emphasis
- **Professional SVG icons only** - no emojis ever
- Spiritual lamp/diya icon for branding
- Consistent spacing using Tailwind utilities

## Component Standards
- Maximum 200 lines per component
- Always include TypeScript interfaces
- Use composition over inheritance
- Colocate styles with Tailwind classes
- Include proper accessibility attributes

## Performance Requirements
- LCP < 1.5s (enhanced by Cloudflare CDN)
- FID < 50ms (optimized with Workers)
- Bundle size: Main < 150KB, Vendor < 400KB
- Global response time < 200ms

## Spiritual Content Guidelines
- Respect for Sant Kabir Das teachings
- Bilingual support (English/Nepali)
- Inclusive community values
- Accessible design for all devotees
- Professional presentation of sacred content