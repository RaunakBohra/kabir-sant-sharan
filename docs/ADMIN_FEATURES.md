# Admin Features Documentation

## Overview
This document describes the admin authentication, layout, and content management features implemented for the Kabir Sant Sharan platform.

## Admin Layout System

### Separate Admin Layout
Admin pages now use a dedicated layout that excludes user-facing navigation components.

**File**: `src/app/admin/layout.tsx`

**Features**:
- No user-side NavBar or Footer
- Admin-specific header with navigation
- Built-in authentication protection
- Loading state during auth verification
- Automatic redirect to `/login` if unauthenticated

**Usage**:
```typescript
// All pages under /admin/* automatically use this layout
// Place admin pages in src/app/admin/ directory
```

### Admin Header
The admin header includes:
- Logo and branding
- Admin navigation menu
- User profile dropdown
- Logout functionality

## Authentication System

### Session Authentication

#### Session Check Endpoint
**Endpoint**: `GET /api/auth/session`

**Purpose**: Validate current session and retrieve user information

**Response** (authenticated):
```json
{
  "userId": "admin-YWRtaW5A",
  "user": {
    "id": "admin-YWRtaW5A",
    "email": "admin@kabirsantsharan.com",
    "role": "admin"
  }
}
```

**Response** (unauthenticated):
```json
{
  "error": "No session found"
}
```
**Status**: `401 Unauthorized`

#### Cookie-Based Sessions

**Login Endpoint**: `POST /api/auth/login`

**Cookies Set**:
- `accessToken`: Short-lived (15 minutes), httpOnly, secure in production
- `refreshToken`: Long-lived (7 days), httpOnly, secure in production

**Cookie Attributes**:
```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: <duration in seconds>
}
```

**Security Features**:
- HTTP-only cookies prevent XSS attacks
- Secure flag ensures HTTPS-only transmission in production
- SameSite protection against CSRF
- Separate secrets for access and refresh tokens

### JWT Token Structure

**Access Token Payload**:
```typescript
{
  userId: string;
  email: string;
  role: string;
  sessionId: string;
  type: 'access';
  iat: number;  // issued at
  exp: number;  // expiration
  iss: string;  // issuer
}
```

**Token Validation**:
- Validates signature using JWT secret
- Checks token expiration
- Verifies token type (access vs refresh)
- Returns structured validation result

## Event Management API

### Create Event
**Endpoint**: `POST /api/events`

**Request Body**:
```json
{
  "title": "Meditation Session",
  "description": "Weekly meditation practice",
  "type": "meditation",
  "startDate": "2025-10-15",
  "endDate": "2025-10-15",
  "startTime": "18:00",
  "endTime": "19:00",
  "timezone": "Asia/Kathmandu",
  "location": "Virtual",
  "virtualLink": "https://zoom.us/...",
  "category": "meditation",
  "tags": ["meditation", "weekly"],
  "organizer": "Kabir Sant Sharan",
  "language": "en",
  "published": false,
  "featured": false,
  "registrationRequired": true,
  "maxAttendees": 50
}
```

**Features**:
- Persists to SQLite database
- Auto-generates slug from title
- Handles camelCase to snake_case field mapping
- Validates required fields
- Returns created event with ID

### Get Event
**Endpoint**: `GET /api/events/[id]`

**Response**:
```json
{
  "event": {
    "id": "1759202435416",
    "title": "Meditation Session",
    "description": "...",
    // ... full event details
  }
}
```

### Update Event
**Endpoint**: `PUT /api/events/[id]`

**Request**: Same structure as create, all fields optional

### Delete Event
**Endpoint**: `DELETE /api/events/[id]`

**Response**:
```json
{
  "message": "Event deleted successfully",
  "id": "1759202435416"
}
```

**Note**: Currently hard deletes. Soft delete implementation pending.

## UI Components

### Delete Confirmation Dialog

**File**: `src/components/admin/ContentManager/DeleteConfirmDialog.tsx`

**Features**:
- Type confirmation (user must type "DELETE")
- Visual warnings with amber alert icon
- 30-day recovery period notice
- Loading state during deletion
- Prevents accidental deletions

**HTML Structure Fix**:
- Uses `asChild` prop on `AlertDialogDescription`
- Prevents invalid HTML nesting (p > div, p > p)
- Maintains semantic structure
- Fixes React hydration warnings

**Usage**:
```tsx
<DeleteConfirmDialog
  open={deleteDialogOpen}
  onOpenChange={setDeleteDialogOpen}
  onConfirm={handleDeleteConfirm}
  itemType="teaching" // or "event"
  itemTitle="Event Title"
/>
```

## E2E Testing

### Test Script
**File**: `e2e-admin-test.sh`

**Test Coverage**:
1. ✅ Session authentication endpoint
2. ✅ Admin login with credentials
3. ✅ Authenticated session check
4. ✅ Event creation (database persistence)
5. ✅ Event retrieval by ID
6. ✅ Event list endpoint
7. ✅ Event deletion
8. ✅ Teaching list endpoint
9. ✅ Admin layout separation

**Running Tests**:
```bash
chmod +x scripts/testing/e2e-admin-test.sh
./scripts/testing/e2e-admin-test.sh
```

**Test Results**: 9/9 passing (100%)

**Features**:
- Comprehensive API testing
- Cookie-based session testing
- Database CRUD verification
- Layout validation
- Color-coded output (green/red/yellow)
- Detailed error reporting

## Database Schema

### Events Table (relevant columns)
```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  location TEXT,
  virtual_link TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
  category TEXT NOT NULL,
  organizer TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  published INTEGER DEFAULT 0,
  featured INTEGER DEFAULT 0,
  registration_required INTEGER DEFAULT 1,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Field Mapping (API → Database)
Drizzle ORM handles camelCase → snake_case conversion:
- `startDate` → `start_date`
- `endDate` → `end_date`
- `startTime` → `start_time`
- `virtualLink` → `virtual_link`
- `maxAttendees` → `max_attendees`
- `currentAttendees` → `current_attendees`

## Configuration

### Environment Variables
```bash
# JWT Configuration
JWT_SECRET=<your-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Admin Credentials
ADMIN_EMAIL=admin@kabirsantsharan.com
ADMIN_PASSWORD_HASH=$2b$12$...

# Application
NODE_ENV=development|production
```

### Admin Credentials (Development)
- Email: `admin@kabirsantsharan.com`
- Password: `admin123`
- Role: `admin`

**Note**: Change these in production!

## Security Best Practices

### Implemented
- ✅ HTTP-only cookies for tokens
- ✅ Secure cookies in production
- ✅ SameSite CSRF protection
- ✅ Separate JWT secrets for access/refresh
- ✅ Short-lived access tokens (15 min)
- ✅ Server-side session validation
- ✅ Protected admin routes
- ✅ Input validation on API endpoints

### Recommendations
- Set up rate limiting on auth endpoints
- Implement CORS policies
- Add request logging
- Set up monitoring alerts
- Implement 2FA for admin accounts
- Regular security audits
- Password complexity requirements

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin-specific layout
│   │   ├── content/
│   │   ├── settings/
│   │   └── ...
│   └── api/
│       ├── auth/
│       │   ├── session/
│       │   │   └── route.ts    # Session validation
│       │   └── login/
│       │       └── route.ts    # Login with cookies
│       └── events/
│           ├── route.ts         # List/Create events
│           └── [id]/
│               └── route.ts     # Get/Update/Delete event
├── components/
│   └── admin/
│       └── ContentManager/
│           └── DeleteConfirmDialog.tsx
└── lib/
    └── jwt-auth.ts              # JWT utilities

tests/
└── e2e-admin-test.sh            # E2E test suite
```

## Next Steps

### Recommended Enhancements
1. **Soft Delete Implementation**
   - Add trash table
   - Implement 30-day recovery period
   - Auto-purge after 30 days

2. **Event Edit UI**
   - Create edit modal/page
   - Pre-fill form with existing data
   - Handle image uploads

3. **Permissions System**
   - Role-based access control
   - Granular permissions
   - Permission middleware

4. **Audit Logging**
   - Log all admin actions
   - Track who changed what and when
   - Compliance reporting

5. **Batch Operations**
   - Bulk delete/publish
   - Export to CSV
   - Import from CSV

6. **Real-time Updates**
   - WebSocket for live updates
   - Optimistic UI updates
   - Conflict resolution

## Troubleshooting

### Common Issues

**1. Session not persisting**
- Check if cookies are enabled
- Verify cookie domain matches
- Check secure flag in production

**2. Event creation fails**
- Verify all required fields
- Check date format (YYYY-MM-DD)
- Ensure time format (HH:mm)
- Validate category exists

**3. Layout not applying**
- Clear Next.js cache (.next folder)
- Restart dev server
- Check file location under /admin

**4. E2E tests failing**
- Ensure dev server is running on port 5002
- Check admin credentials are correct
- Verify database has test data
- Check curl is installed

## Support

For issues or questions:
1. Check the error logs in browser console
2. Review server logs in terminal
3. Run E2E tests to verify functionality
4. Check database state with `sqlite3 local.db`

---

**Last Updated**: September 30, 2025
**Version**: 1.0.0
**Author**: Kabir Sant Sharan Development Team