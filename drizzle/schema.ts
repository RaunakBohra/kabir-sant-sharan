import { sql } from 'drizzle-orm'
import { text, integer, sqliteTable, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('member'),
  avatar: text('avatar'),
  bio: text('bio'),
  language: text('language').notNull().default('en'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
  newsletter: integer('newsletter', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (users) => ({
  emailIdx: uniqueIndex('email_idx').on(users.email)
}))

export const teachings = sqliteTable('teachings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  excerpt: text('excerpt').notNull(),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  tags: text('tags'),
  author: text('author').notNull(),
  published: integer('published', { mode: 'boolean' }).default(false),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  language: text('language').notNull().default('en'),
  translationOf: text('translation_of'),
  coverImage: text('cover_image'),
  readingTime: integer('reading_time'),
  publishedAt: text('published_at'),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (teachings) => ({
  slugIdx: uniqueIndex('slug_idx').on(teachings.slug)
}))

export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  slug: text('slug').notNull().unique(),
  type: text('type').notNull(),
  location: text('location'),
  virtualLink: text('virtual_link'),
  maxAttendees: integer('max_attendees'),
  currentAttendees: integer('current_attendees').default(0),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  timezone: text('timezone').notNull().default('Asia/Kathmandu'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  published: integer('published', { mode: 'boolean' }).default(false),
  registrationRequired: integer('registration_required', { mode: 'boolean' }).default(true),
  registrationDeadline: text('registration_deadline'),
  category: text('category').notNull(),
  tags: text('tags'),
  coverImage: text('cover_image'),
  organizer: text('organizer').notNull(),
  language: text('language').notNull().default('en'),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (events) => ({
  slugIdx: uniqueIndex('events_slug_idx').on(events.slug)
}))

export const eventRegistrations = sqliteTable('event_registrations', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  guestName: text('guest_name'),
  guestEmail: text('guest_email'),
  phone: text('phone'),
  specialRequests: text('special_requests'),
  status: text('status').notNull().default('confirmed'),
  attendanceStatus: text('attendance_status').default('pending'),
  registeredAt: text('registered_at').default(sql`CURRENT_TIMESTAMP`)
}, (registrations) => ({
  eventUserIdx: uniqueIndex('event_user_idx').on(registrations.eventId, registrations.userId),
  eventGuestIdx: uniqueIndex('event_guest_idx').on(registrations.eventId, registrations.guestEmail)
}))

export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(),
  category: text('category').notNull(),
  tags: text('tags'),
  author: text('author').notNull(),
  duration: text('duration'),
  fileSize: integer('file_size'),
  mimeType: text('mime_type'),
  r2Key: text('r2_key').notNull(),
  r2Bucket: text('r2_bucket').notNull().default('kabir-media'),
  thumbnailKey: text('thumbnail_key'),
  streamingUrl: text('streaming_url'),
  downloadUrl: text('download_url'),
  transcription: text('transcription'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  published: integer('published', { mode: 'boolean' }).default(false),
  views: integer('views').default(0),
  downloads: integer('downloads').default(0),
  likes: integer('likes').default(0),
  language: text('language').notNull().default('en'),
  uploadedBy: text('uploaded_by').notNull().references(() => users.id),
  publishedAt: text('published_at'),
  deletedAt: text('deleted_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (media) => ({
  typeIdx: index('media_type_idx').on(media.type),
  categoryIdx: index('media_category_idx').on(media.category),
  r2KeyIdx: uniqueIndex('media_r2_key_idx').on(media.r2Key)
}))

export const quotes = sqliteTable('quotes', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  translation: text('translation'),
  author: text('author').notNull().default('Sant Kabir Das'),
  source: text('source'),
  category: text('category').notNull(),
  tags: text('tags'),
  language: text('language').notNull().default('hi'),
  featured: integer('featured', { mode: 'boolean' }).default(false),
  active: integer('active', { mode: 'boolean' }).default(true),
  displayDate: text('display_date'),
  views: integer('views').default(0),
  likes: integer('likes').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
})

export const newsletters = sqliteTable('newsletters', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  language: text('language').notNull().default('en'),
  status: text('status').notNull().default('active'),
  source: text('source').notNull().default('website'),
  interests: text('interests'),
  verified: integer('verified', { mode: 'boolean' }).default(false),
  verificationToken: text('verification_token'),
  unsubscribeToken: text('unsubscribe_token').notNull(),
  lastEmailSent: text('last_email_sent'),
  emailsSent: integer('emails_sent').default(0),
  subscribedAt: text('subscribed_at').default(sql`CURRENT_TIMESTAMP`),
  unsubscribedAt: text('unsubscribed_at')
}, (newsletters) => ({
  emailIdx: uniqueIndex('newsletter_email_idx').on(newsletters.email),
  tokenIdx: uniqueIndex('newsletter_token_idx').on(newsletters.unsubscribeToken)
}))

export const newsletterCampaigns = sqliteTable('newsletter_campaigns', {
  id: text('id').primaryKey(),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('draft'), // draft, scheduled, sent, failed
  segment: text('segment').notNull().default('all'), // all, teachings, events, meditation
  scheduledFor: text('scheduled_for'),
  sentAt: text('sent_at'),
  recipients: integer('recipients').default(0),
  opens: integer('opens').default(0),
  clicks: integer('clicks').default(0),
  bounces: integer('bounces').default(0),
  unsubscribes: integer('unsubscribes').default(0),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (campaigns) => ({
  statusIdx: uniqueIndex('campaign_status_idx').on(campaigns.status),
  sentAtIdx: uniqueIndex('campaign_sent_at_idx').on(campaigns.sentAt)
}))

export const comments: any = sqliteTable('comments', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  authorWebsite: text('author_website'),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  status: text('status').notNull().default('pending'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  spam: integer('spam', { mode: 'boolean' }).default(false),
  likes: integer('likes').default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (comments) => ({
  resourceIdx: uniqueIndex('comments_resource_idx').on(comments.resourceType, comments.resourceId),
  parentIdx: uniqueIndex('comments_parent_idx').on(comments.parentId),
  statusIdx: uniqueIndex('comments_status_idx').on(comments.status)
}))

export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  category: text('category').notNull().default('general'),
  priority: text('priority').notNull().default('normal'),
  status: text('status').notNull().default('new'),
  language: text('language').notNull().default('en'),
  source: text('source').notNull().default('website'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  responded: integer('responded', { mode: 'boolean' }).default(false),
  responseDate: text('response_date'),
  assignedTo: text('assigned_to').references(() => users.id),
  notes: text('notes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
}, (messages) => ({
  statusIdx: uniqueIndex('contact_status_idx').on(messages.status),
  categoryIdx: uniqueIndex('contact_category_idx').on(messages.category),
  emailIdx: uniqueIndex('contact_email_idx').on(messages.email)
}))

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  refreshToken: text('refresh_token').unique(),
  expiresAt: text('expires_at').notNull(),
  refreshExpiresAt: text('refresh_expires_at'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  lastActivity: text('last_activity').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
}, (sessions) => ({
  tokenIdx: uniqueIndex('session_token_idx').on(sessions.token),
  userIdx: uniqueIndex('session_user_idx').on(sessions.userId)
}))

export const analytics = sqliteTable('analytics', {
  id: text('id').primaryKey(),
  event: text('event').notNull(),
  resourceType: text('resource_type'),
  resourceId: text('resource_id'),
  userId: text('user_id').references(() => users.id),
  sessionId: text('session_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  country: text('country'),
  region: text('region'),
  city: text('city'),
  device: text('device'),
  browser: text('browser'),
  os: text('os'),
  language: text('language'),
  metadata: text('metadata'),
  timestamp: text('timestamp').default(sql`CURRENT_TIMESTAMP`)
}, (analytics) => ({
  eventIdx: uniqueIndex('analytics_event_idx').on(analytics.event),
  resourceIdx: uniqueIndex('analytics_resource_idx').on(analytics.resourceType, analytics.resourceId),
  timestampIdx: uniqueIndex('analytics_timestamp_idx').on(analytics.timestamp)
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Teaching = typeof teachings.$inferSelect
export type NewTeaching = typeof teachings.$inferInsert
export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert
export type EventRegistration = typeof eventRegistrations.$inferSelect
export type NewEventRegistration = typeof eventRegistrations.$inferInsert
export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
export type Quote = typeof quotes.$inferSelect
export type NewQuote = typeof quotes.$inferInsert
export type Newsletter = typeof newsletters.$inferSelect
export type NewNewsletter = typeof newsletters.$inferInsert
export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type ContactMessage = typeof contactMessages.$inferSelect
export type NewContactMessage = typeof contactMessages.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Analytics = typeof analytics.$inferSelect
export type NewAnalytics = typeof analytics.$inferInsert

export const trash = sqliteTable('trash', {
  id: text('id').primaryKey(),
  contentType: text('content_type').notNull(),
  contentId: text('content_id').notNull(),
  contentData: text('content_data').notNull(),
  deletedBy: text('deleted_by').notNull().references(() => users.id),
  deletedAt: text('deleted_at').notNull(),
  scheduledPurgeAt: text('scheduled_purge_at').notNull(),
  restoredAt: text('restored_at'),
  restoredBy: text('restored_by').references(() => users.id)
}, (trash) => ({
  scheduledPurgeIdx: uniqueIndex('trash_scheduled_purge_idx').on(trash.scheduledPurgeAt),
  contentTypeIdIdx: uniqueIndex('trash_content_type_id_idx').on(trash.contentType, trash.contentId)
}))

export type Trash = typeof trash.$inferSelect
export type NewTrash = typeof trash.$inferInsert