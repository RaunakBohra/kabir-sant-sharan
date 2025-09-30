# Service Inventory - Kabir Sant Sharan API

**Last Updated:** 2025-09-30
**Total Routes:** 29
**Architecture:** Next.js 14 App Router API Routes
**Database:** SQLite with Drizzle ORM
**Storage:** Cloudflare R2

---

## Authentication & Session (6 routes)

### POST `/api/auth/login`
Auth with email/password → `{ success, user?, accessToken? }`

### POST `/api/auth/logout`
Clear session → `{ success }`

### GET `/api/auth/session`
Current session → `{ user?, isAuthenticated }`

### GET `/api/auth/verify`
Verify JWT → `{ valid, user? }` (Header: Authorization Bearer)

### POST `/api/auth/refresh`
Refresh token → `{ accessToken }`

### GET `/api/auth/sessions`
List sessions → `{ sessions[] }`

---

## Teachings (3 routes)

### GET `/api/teachings`
List teachings (Query: `limit?, published?, category?`) → `{ teachings[] }`

### GET `/api/teachings/[id]`
Single teaching → `{ teaching }`

### POST `/api/teachings`
Create (Admin) → `{ teaching }`

### PUT `/api/teachings/[id]`
Update (Admin) → `{ teaching }`

### DELETE `/api/teachings/[id]`
Delete (Admin) → `{ success }`

---

## Events (5 routes)

### GET `/api/events`
List events → `{ events[] }` (camelCase: `startDate`, `type`, `featured`, `registrationRequired`)

### GET `/api/events/[id]`
Single event → `{ event }`

### POST `/api/events`
Create (Admin) → `{ event }`

### PUT `/api/events/[id]`
Update (Admin) → `{ event }`

### DELETE `/api/events/[id]`
Delete (Admin) → `{ success }`

### POST `/api/events/[id]/register`
Register → `{ success, registration }`

### GET `/api/events/counts`
Stats → `{ total, upcoming, past }`

---

## Media (5 routes)

### GET `/api/media`
List media → `{ media[] }` (R2 integration)

### GET `/api/media/[id]`
Metadata → `{ media }`

### GET `/api/media/[id]/view`
Signed URL → `{ url, expiresIn }`

### GET `/api/media/stream/[id]`
Stream with range support → Media stream

### POST `/api/media/upload`
Upload (Admin, max 100MB) → `{ media }` (Cloudflare R2)

### PUT `/api/media/[id]`
Update metadata (Admin) → `{ media }`

### DELETE `/api/media/[id]`
Delete (Admin) → `{ success }` (DB + R2)

---

## Newsletter (2 routes)

### GET `/api/newsletter/subscribers`
List (Admin) → `{ subscribers[] }`

### POST `/api/newsletter/subscribers`
Subscribe → `{ subscriber }`

### GET `/api/newsletter/campaigns`
List campaigns (Admin) → `{ campaigns[] }`

### POST `/api/newsletter/campaigns`
Send campaign (Admin) → `{ campaign, sent }`

---

## Search (1 route)

### GET `/api/search`
Search all (Query: `q, type?, limit?`) → `{ results[], total }`

---

## Quotes (1 route)

### GET `/api/quotes/daily`
Daily quote → `{ quote: { text, author, language, category? } }`

---

## Analytics (3 routes)

### GET `/api/analytics/overview`
Dashboard (Admin) → `{ totalViews, totalTeachings, totalEvents, totalSubscribers }`

### GET `/api/analytics/top-pages`
Top pages (Admin) → `{ pages[] }`

### GET `/api/analytics/recent-activity`
Activity (Admin) → `{ activities[] }`

---

## Performance (3 routes)

### GET `/api/v1/performance`
Metrics (Admin) → `{ cpu, memory, requests, responseTime }`

### GET `/api/v1/performance/live`
Real-time SSE (Admin)

### GET `/api/v1/metrics`
Detailed metrics (Admin) → `{ metrics[] }`

---

## System (3 routes)

### GET `/api/v1/health`
Health check → `{ status, timestamp, database }`

### GET `/api/docs`
API documentation → HTML

### GET `/api/admin/database`
DB tools (Admin) → `{ tables[], recordCounts }`

---

## Database Schema (camelCase)

```typescript
// Events
{ startDate, endDate, type, featured, registrationRequired, currentAttendees }

// Teachings
{ createdAt, updatedAt, coverImage }

// Media
{ fileUrl, fileSize, mimeType }
```

---

## Auth Pattern

```typescript
const { user } = await getSession()
if (!user || !user.isAdmin) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

Session: localStorage, `{ user, accessToken, expiresAt }`

---

## Error Format

```typescript
{ error: string, code?: string, details?: any }
```

Status: 200/201 (success), 400/401/403/404/500 (errors)

---

## Media Upload Specs

- Max 100MB
- Types: mp3, wav, m4a (audio), mp4, webm (video)
- Storage: Cloudflare R2
- Streaming: Range requests supported

---

## Rate Limiting

TODO: Add for auth (5/min), search (30/min), upload (10/hour)

---

## Testing

```bash
# Health
curl http://localhost:3000/api/v1/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kabirsantsharan.com","password":"admin123"}'

# Teachings
curl http://localhost:3000/api/teachings?limit=5
```

---

## Checklist

1. ✅ Search this inventory
2. ✅ Check `drizzle/schema.ts`
3. ✅ Use camelCase
4. ✅ Add error handling
5. ✅ Auth checks if needed
6. ✅ Test with curl
7. ✅ Document here
8. ✅ Commit immediately

---

## Notes

- camelCase for all fields/responses
- Admin routes require auth
- R2 for media storage
- localStorage sessions (no cookies)
- SQLite + Drizzle (not PostgreSQL)