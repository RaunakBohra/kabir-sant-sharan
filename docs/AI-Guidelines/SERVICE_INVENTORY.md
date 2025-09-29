# Service Inventory

## Frontend Services

### API Services
- **BlogService**: Blog post management
  - Location: `src/lib/services/blog.ts`
  - Methods: `getPosts(), getPost(id), createPost(), updatePost(), deletePost()`
  - Usage: Blog CRUD operations

- **EventService**: Event management
  - Location: `src/lib/services/events.ts`
  - Methods: `getEvents(), getEvent(id), registerForEvent(), getCalendarEvents()`
  - Usage: Event listings and registration

- **MediaService**: Audio/video management
  - Location: `src/lib/services/media.ts`
  - Methods: `getAudioFiles(), getVideoFiles(), uploadMedia()`
  - Usage: Spiritual content delivery

### Utility Services
- **AuthService**: Authentication management
  - Location: `src/lib/services/auth.ts`
  - Methods: `login(), logout(), getCurrentUser(), isAuthenticated()`
  - Usage: User session management

- **EmailService**: Email communication
  - Location: `src/lib/services/email.ts`
  - Methods: `sendContactForm(), subscribeNewsletter(), sendEventReminder()`
  - Usage: Community communication

### Data Services
- **StorageService**: Local/session storage
  - Location: `src/lib/services/storage.ts`
  - Methods: `get(), set(), remove(), clear()`
  - Usage: Client-side data persistence

- **CacheService**: Client-side caching
  - Location: `src/lib/services/cache.ts`
  - Methods: `get(), set(), invalidate(), clear()`
  - Usage: Performance optimization

## Backend Services (Future)

### Express.js Routes
- **POST /api/contact**: Contact form submission
  - Handler: Contact form processing and email sending
  - Validation: Email format, required fields
  - Response: Success/error status

- **GET /api/events**: Event listings
  - Handler: Event data retrieval with filtering
  - Query params: `date`, `type`, `limit`
  - Response: Paginated event list

- **POST /api/newsletter**: Newsletter subscription
  - Handler: Email list management
  - Validation: Email format validation
  - Integration: Email marketing service

### Middleware Services
- **AuthMiddleware**: Route protection
  - Location: `backend/middleware/auth.ts`
  - Usage: Protecting admin routes
  - JWT token validation

- **ValidationMiddleware**: Request validation
  - Location: `backend/middleware/validation.ts`
  - Usage: Input sanitization and validation
  - Schema-based validation

### Database Services
- **UserService**: User management
  - Location: `backend/services/users.ts`
  - Methods: CRUD operations for users
  - Usage: Community member management

- **ContentService**: Content management
  - Location: `backend/services/content.ts`
  - Methods: Blog posts, events, media management
  - Usage: CMS backend operations

## Third-Party Integrations

### Email Marketing
- **ConvertKit/Kit Integration**
  - Service: Newsletter management
  - Usage: Community communication
  - Cost: Free tier (up to 10k subscribers)

### Payment Processing
- **Stripe Integration**
  - Service: Donations and event payments
  - Usage: Secure payment processing
  - Cost: 2.9% + 30¢ per transaction

### Calendar Integration
- **Google Calendar API**
  - Service: Event synchronization
  - Usage: Community calendar display
  - Cost: Free with rate limits

### Media Storage
- **Cloudinary Integration**
  - Service: Audio/video hosting and optimization
  - Usage: Spiritual content delivery
  - Cost: Free tier (25 credits/month)

## Service Pattern Guidelines

### Service Structure
```typescript
// Standard service pattern
export interface ServiceInterface {
  get(id: string): Promise<Entity>
  list(filters?: FilterOptions): Promise<Entity[]>
  create(data: CreateEntityData): Promise<Entity>
  update(id: string, data: UpdateEntityData): Promise<Entity>
  delete(id: string): Promise<boolean>
}

class ServiceImplementation implements ServiceInterface {
  // Implementation with error handling
  // Consistent response formatting
  // Proper TypeScript typing
}
```

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Client-friendly error messages
- Logging for debugging

### API Design Principles
- RESTful endpoint naming
- Consistent response structure
- Proper HTTP methods
- Rate limiting implementation

## Before Creating New Services
1. Check this inventory first
2. Search existing services: `grep -r "ServiceName" src/`
3. Consider extending existing services vs creating new ones
4. Update this inventory when adding new services
5. Follow established patterns and interfaces