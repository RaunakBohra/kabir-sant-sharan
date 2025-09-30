# Architectural Decisions - Kabir Sant Sharan

**Last Updated:** 2025-09-30

## Stack: Next.js 14 + SQLite + Cloudflare
- Zero hosting costs, simple local dev, edge-first

## Theme: Cream + Dark (No Colors)
- Professional spiritual aesthetic, cream/dark only

## Navigation: Bottom Nav (Not FAB)
- User request: "like Amazon/Flipkart apps"
- Always visible tabs > hidden FAB menu

## Database: camelCase Fields
- Drizzle ORM default, matches JavaScript/TypeScript conventions
- `startDate`, `type`, `featured` (NOT snake_case)

## Session: localStorage (No Cookies)
- Simple admin-only auth, no server-side sessions

## Storage: Cloudflare R2
- 10GB free, global CDN, S3-compatible

## Components: Max 200 Lines
- Atomic thinking, single responsibility

## Responsive: Mobile-First
- Default mobile, progressive enhancement
- Touch targets 44px+

## Admin: Off-Canvas Sidebar
- Mobile: Overlay, Desktop: Fixed

## Git: Commit Immediately
- Fine-grained history, clear messages

See full details in docs/MOBILE_RESPONSIVENESS_UPDATE.md
