# Service Inventory - Cloudflare Stack

This document maintains a comprehensive list of all Cloudflare services and integrations used in the Kabir Sant Sharan spiritual website.

## Cloudflare Services

### Database (Cloudflare D1)
- **Service**: SQLite database with edge replication
- **Tier**: Free tier (5GB storage, 25M reads/month, 50M writes/month)
- **Usage**: User data, spiritual content storage, event management
- **Integration**: Drizzle ORM with D1 adapter
- **Configuration**: Wrangler configuration and environment bindings

### Hosting (Cloudflare Pages)
- **Service**: Static site hosting with edge deployment
- **Tier**: Free tier (500 builds/month, unlimited bandwidth)
- **Usage**: Frontend hosting, automatic deployments from GitHub
- **Integration**: Direct Git integration with build optimization
- **Configuration**: `wrangler.toml` for build and deployment settings

### Functions (Cloudflare Workers)
- **Service**: Edge computing with V8 runtime
- **Tier**: Free tier (100k requests/day, 10ms CPU time)
- **Usage**: API endpoints, authentication, data processing
- **Integration**: Workers runtime with TypeScript support
- **Configuration**: Worker scripts with environment bindings

### Storage (Cloudflare R2)
- **Service**: S3-compatible object storage
- **Tier**: Free tier (10GB storage, 1M Class A operations/month)
- **Usage**: Spiritual audio/video content, images, media files
- **Integration**: AWS S3 SDK compatibility
- **Configuration**: Bucket policies and CORS settings

### CDN (Cloudflare Global Network)
- **Service**: Global content delivery network
- **Tier**: Included free with all services
- **Usage**: Static asset caching, global performance optimization
- **Integration**: Automatic with Pages and R2
- **Configuration**: Cache rules and optimization settings

## Internal Services

### Database Service
- **Location**: `src/lib/services/database.ts`
- **Purpose**: D1 database operations with edge caching
- **Dependencies**: Drizzle ORM, D1 binding
- **Methods**:
  - `getTeachings(filters)`: Fetch spiritual teachings from D1
  - `getEvents(dateRange)`: Fetch satsang events with caching
  - `getQuotes()`: Daily wisdom quotes with edge optimization
  - `createContent(type, data)`: Create content with validation

### Authentication Service
- **Location**: `src/lib/services/auth.ts`
- **Purpose**: Custom authentication using Workers and D1
- **Dependencies**: Cloudflare Workers, JWT tokens, D1 sessions
- **Methods**:
  - `signIn(email, password)`: User login with edge validation
  - `signUp(email, password, metadata)`: Registration with D1 storage
  - `verifyToken(token)`: JWT verification at the edge
  - `getCurrentUser()`: Session management with D1 lookup

### Media Service
- **Location**: `src/lib/services/media.ts`
- **Purpose**: R2 storage for spiritual audio/video content
- **Dependencies**: R2 binding, signed URLs
- **Methods**:
  - `uploadToR2(file, metadata)`: Upload spiritual content to R2
  - `getMediaLibrary(filters)`: Fetch media from R2 with metadata
  - `generateSignedURL(objectKey)`: Secure streaming URLs
  - `deleteFromR2(objectKey)`: Remove media with cleanup

### Email Service
- **Location**: `src/lib/services/email.ts`
- **Purpose**: Email notifications via Workers
- **Dependencies**: External email API (SendGrid/Resend), Workers
- **Methods**:
  - `sendNewsletterEmail(subscribers)`: Bulk email via Workers
  - `sendEventNotification(eventId)`: Event reminders
  - `subscribeToNewsletter(email)`: Store subscription in D1
  - `unsubscribe(email)`: Manage unsubscriptions

### Cache Service
- **Location**: `src/lib/services/cache.ts`
- **Purpose**: Edge caching for spiritual content
- **Dependencies**: Workers Cache API, KV storage
- **Methods**:
  - `cacheResponse(key, data, ttl)`: Cache at edge locations
  - `getCached(key)`: Retrieve from edge cache
  - `invalidateCache(pattern)`: Cache purging
  - `warmupCache(endpoints)`: Pre-populate cache

## API Endpoints (Cloudflare Workers)

### Spiritual Content API
- **Base Path**: `/api/content`
- **Worker**: `content-worker.ts`
- **Endpoints**:
  - `GET /api/content/teachings`: Fetch teachings from D1 with caching
  - `GET /api/content/teachings/[id]`: Cached teaching details
  - `POST /api/content/teachings`: Admin content creation
  - `GET /api/content/quotes/daily`: Daily quote with edge caching

### Event Management API
- **Base Path**: `/api/events`
- **Worker**: `events-worker.ts`
- **Endpoints**:
  - `GET /api/events`: Cached event listings
  - `GET /api/events/calendar/[month]`: Calendar with D1 queries
  - `POST /api/events/register`: Registration with D1 storage
  - `GET /api/events/[id]`: Event details with caching

### Media Library API
- **Base Path**: `/api/media`
- **Worker**: `media-worker.ts`
- **Endpoints**:
  - `GET /api/media`: Browse R2 media with metadata from D1
  - `POST /api/media/upload`: Upload to R2 with Worker processing
  - `GET /api/media/[id]/stream`: Signed R2 URLs for streaming
  - `DELETE /api/media/[id]`: R2 deletion with D1 cleanup

### Community API
- **Base Path**: `/api/community`
- **Worker**: `community-worker.ts`
- **Endpoints**:
  - `POST /api/community/contact`: Contact form with D1 storage
  - `POST /api/community/newsletter`: Newsletter signup to D1
  - `GET /api/community/stats`: Cached community statistics
  - `POST /api/community/feedback`: Feedback storage in D1

## Configuration Files

### Wrangler Configuration
```toml
# wrangler.toml
name = "kabir-sant-sharan"
main = "src/index.ts"
compatibility_date = "2024-09-29"

[[d1_databases]]
binding = "DB"
database_name = "kabir-sant-sharan"
database_id = "your-database-id"

[[r2_buckets]]
binding = "MEDIA_BUCKET"
bucket_name = "kabir-media"

[vars]
ENVIRONMENT = "production"
```

### Environment Variables
```bash
# Cloudflare
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-d1-database-id

# External Services
RESEND_API_KEY=re_... # For email notifications
```

## Service Limits (Free Tiers)

### Cloudflare D1
- **Storage**: 5GB database size
- **Reads**: 25M reads per month
- **Writes**: 50M writes per month
- **Time Travel**: 30 days point-in-time recovery

### Cloudflare Workers
- **Requests**: 100k requests per day
- **CPU Time**: 10ms per invocation
- **Memory**: 128MB per worker
- **Duration**: 30 seconds maximum

### Cloudflare R2
- **Storage**: 10GB per month
- **Class A Operations**: 1M per month (PUT, COPY, POST, LIST)
- **Class B Operations**: 10M per month (GET, SELECT)
- **Egress**: Free from R2 to Cloudflare network

### Cloudflare Pages
- **Builds**: 500 builds per month
- **Functions**: 100k function invocations per day
- **Bandwidth**: Unlimited
- **Sites**: Unlimited

## Performance Optimizations

### Edge Caching Strategy
- **Static Content**: 30-day browser cache, 7-day edge cache
- **Spiritual Teachings**: 24-hour cache with stale-while-revalidate
- **Daily Quotes**: Cache until midnight with automatic refresh
- **Event Data**: 1-hour cache with instant purging on updates

### Database Optimization
- **Read Replicas**: Automatic with D1 edge replication
- **Query Optimization**: Indexed spiritual content categories
- **Connection Pooling**: Built-in with D1 Workers integration
- **Prepared Statements**: All queries use prepared statements

### Media Delivery
- **R2 Integration**: Direct streaming from edge locations
- **Video Optimization**: Automatic transcoding for web delivery
- **Audio Compression**: Optimized bitrates for spiritual content
- **Progressive Loading**: Chunked delivery for large media files

## Security Implementation

### Authentication Security
- **JWT Tokens**: Signed with Workers Crypto API
- **Session Management**: Secure storage in D1 with expiration
- **Password Hashing**: bcrypt with Workers Web Crypto
- **Rate Limiting**: Built-in Workers rate limiting

### API Security
- **CORS Configuration**: Restricted to spiritual website domain
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Prevention**: Prepared statements with Drizzle
- **DDoS Protection**: Automatic with Cloudflare network

### Content Security
- **Media Upload Validation**: File type and size restrictions
- **Content Moderation**: Automated scanning for inappropriate content
- **Access Controls**: Role-based permissions in D1
- **Audit Logging**: All admin actions logged to D1

## Monitoring and Analytics

### Cloudflare Analytics
- **Workers Analytics**: Request volume, error rates, performance
- **R2 Analytics**: Storage usage, bandwidth consumption
- **Pages Analytics**: Page views, geographic distribution
- **D1 Analytics**: Query performance, storage growth

### Custom Metrics
- **Spiritual Content Engagement**: Teaching views, download counts
- **Community Activity**: Event registrations, newsletter signups
- **Performance Tracking**: Edge response times, cache hit rates
- **Error Monitoring**: Structured logging with Workers

### Alerting
- **Service Health**: Automated alerts for service degradation
- **Quota Monitoring**: Warnings before free tier limits
- **Performance Thresholds**: Alerts for response time increases
- **Security Events**: Notifications for unusual activity patterns

## Service Pattern Guidelines

### Worker Service Structure
```typescript
// Standard Cloudflare Worker service pattern
export interface WorkerService {
  handleRequest(request: Request, env: Env): Promise<Response>
  validateInput(data: unknown): boolean
  cacheResponse(key: string, data: any, ttl: number): Promise<void>
  logActivity(action: string, metadata: object): Promise<void>
}

class SpiritualContentWorker implements WorkerService {
  async handleRequest(request: Request, env: Env): Promise<Response> {
    try {
      // Request validation
      // D1 database operations
      // Response caching
      // Error handling
      return new Response(JSON.stringify(result))
    } catch (error) {
      return new Response('Error', { status: 500 })
    }
  }
}
```

### D1 Database Patterns
```typescript
// Drizzle ORM with D1 pattern
import { drizzle } from 'drizzle-orm/d1'

export async function getTeachings(env: Env, filters: TeachingFilters) {
  const db = drizzle(env.DB)
  return await db.select().from(teachings).where(eq(teachings.published, true))
}
```

### R2 Storage Patterns
```typescript
// R2 storage operations
export async function uploadMedia(env: Env, file: File, metadata: MediaMetadata) {
  const key = `spiritual-content/${Date.now()}-${file.name}`
  await env.MEDIA_BUCKET.put(key, file.stream(), {
    customMetadata: metadata
  })
  return generateSignedURL(env, key)
}
```

## Error Handling

### Worker Error Responses
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Spiritual content not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Worker execution error

### Database Error Handling
- **Connection Errors**: Automatic retry with exponential backoff
- **Query Errors**: Detailed logging with sanitized error messages
- **Constraint Violations**: User-friendly validation messages
- **Transaction Failures**: Rollback and error reporting

### Media Upload Error Handling
- **File Size Limits**: Client-side and server-side validation
- **File Type Validation**: MIME type checking
- **Storage Quota**: Graceful handling of storage limits
- **Upload Failures**: Retry logic with progress tracking

## Before Creating New Services
1. Check this inventory for existing Cloudflare services
2. Search codebase: `grep -r "ServiceName" src/`
3. Consider Cloudflare-native solutions first (D1, R2, Workers)
4. Ensure compliance with free tier limits
5. Follow Cloudflare Worker patterns and best practices
6. Update this inventory when adding new services

This Cloudflare-native architecture provides a robust, scalable, and cost-effective foundation for the Kabir Sant Sharan spiritual website, ensuring global performance while maintaining zero operational costs.