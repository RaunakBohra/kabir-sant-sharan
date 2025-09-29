/**
 * Comprehensive Zod Validation Schemas
 * Provides type-safe validation for all API endpoints
 * Includes input sanitization and security checks
 */

import { z } from 'zod';
import { sanitizer } from './input-sanitizer';

/**
 * Common validation utilities with enhanced sanitization
 */
const sanitizeString = (str: string) => sanitizer.sanitizeText(str);
const sanitizeHTML = (str: string) => sanitizer.sanitizeHTML(str);
const sanitizeEmail = (str: string) => sanitizer.sanitizeEmail(str);
const sanitizeURL = (str: string) => sanitizer.sanitizeURL(str);

const createStringSchema = (minLength: number = 1, maxLength: number = 255) =>
  z.string()
    .min(minLength, `Must be at least ${minLength} character(s)`)
    .max(maxLength, `Must be no more than ${maxLength} characters`)
    .transform(sanitizeString);

const createOptionalStringSchema = (maxLength: number = 255) =>
  z.string()
    .max(maxLength, `Must be no more than ${maxLength} characters`)
    .transform(sanitizeString)
    .optional();

/**
 * Authentication Schemas
 */
export const LoginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be no more than 255 characters')
    .transform(sanitizeEmail),
  password: z.string()
    .min(1, 'Password is required')
    .max(128, 'Password must be no more than 128 characters')
    .transform(str => str.trim()) // Don't sanitize passwords, just trim
});

export const RefreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required')
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'New password must be no more than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
           'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

/**
 * Teaching Schemas
 */
export const CreateTeachingSchema = z.object({
  title: createStringSchema(1, 200),
  content: createStringSchema(10, 50000),
  excerpt: createStringSchema(10, 500),
  category: z.enum(['Philosophy', 'Unity', 'Spirituality', 'Meditation', 'Life', 'Devotion'], {
    errorMap: () => ({ message: 'Category must be one of: Philosophy, Unity, Spirituality, Meditation, Life, Devotion' })
  }),
  tags: z.array(z.string().min(1).max(50))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
  author: createStringSchema(1, 100).default('Sant Kabir Das'),
  language: z.enum(['en', 'hi', 'ne']).default('en'),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  coverImage: createOptionalStringSchema(500),
  translationOf: createOptionalStringSchema(50)
});

export const UpdateTeachingSchema = CreateTeachingSchema.partial().extend({
  id: z.string().min(1, 'Teaching ID is required')
});

export const TeachingQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? Math.min(Math.max(parseInt(val) || 10, 1), 100) : 10),
  offset: z.string().optional().transform(val => val ? Math.max(parseInt(val) || 0, 0) : 0),
  category: z.string().optional(),
  language: z.enum(['en', 'hi', 'ne']).optional(),
  published: z.string().optional().transform(val => val === 'true'),
  featured: z.string().optional().transform(val => val === 'true')
});

/**
 * Event Schemas
 */
export const CreateEventSchema = z.object({
  title: createStringSchema(1, 200),
  description: createStringSchema(10, 2000),
  location: createStringSchema(1, 200),
  virtualLink: createOptionalStringSchema(500)
    .refine(val => !val || val.startsWith('http'), 'Virtual link must be a valid URL'),
  startDate: z.string()
    .datetime('Invalid start date format. Use ISO 8601 format.'),
  endDate: z.string()
    .datetime('Invalid end date format. Use ISO 8601 format.'),
  startTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM format.'),
  endTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:MM format.'),
  timezone: createStringSchema(1, 50).default('Asia/Kathmandu'),
  type: z.enum(['meditation', 'satsang', 'festival', 'discourse', 'music', 'workshop'], {
    errorMap: () => ({ message: 'Event type must be one of: meditation, satsang, festival, discourse, music, workshop' })
  }),
  category: createStringSchema(1, 50),
  maxAttendees: z.number()
    .int('Max attendees must be an integer')
    .min(1, 'Max attendees must be at least 1')
    .max(10000, 'Max attendees cannot exceed 10,000')
    .optional(),
  registrationRequired: z.boolean().default(true),
  registrationDeadline: z.string()
    .datetime('Invalid registration deadline format. Use ISO 8601 format.')
    .optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  coverImage: createOptionalStringSchema(500),
  organizer: createStringSchema(1, 100).default('Kabir Sant Sharan'),
  language: z.enum(['en', 'hi', 'ne']).default('en')
}).refine(data => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
}).refine(data => {
  if (!data.registrationDeadline) return true;
  const deadline = new Date(data.registrationDeadline);
  const start = new Date(data.startDate);
  return deadline <= start;
}, {
  message: "Registration deadline must be before event start date",
  path: ["registrationDeadline"]
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  id: z.string().min(1, 'Event ID is required')
});

export const EventQuerySchema = z.object({
  limit: z.string().optional().transform(val => val ? Math.min(Math.max(parseInt(val) || 10, 1), 100) : 10),
  offset: z.string().optional().transform(val => val ? Math.max(parseInt(val) || 0, 0) : 0),
  upcoming: z.string().optional().transform(val => val === 'true'),
  type: z.string().optional(),
  category: z.string().optional(),
  featured: z.string().optional().transform(val => val === 'true')
});

/**
 * Search Schemas
 */
export const SearchQuerySchema = z.object({
  q: z.string()
    .min(1, 'Search query is required')
    .max(200, 'Search query must be no more than 200 characters')
    .transform(sanitizeString),
  type: z.enum(['teaching', 'event', 'media']).optional(),
  category: z.string().max(50).optional(),
  language: z.enum(['en', 'hi', 'ne']).optional(),
  limit: z.string().optional().transform(val => val ? Math.min(Math.max(parseInt(val) || 20, 1), 100) : 20),
  offset: z.string().optional().transform(val => val ? Math.max(parseInt(val) || 0, 0) : 0)
});

/**
 * Media Upload Schemas
 */
export const MediaUploadSchema = z.object({
  type: z.enum(['audio', 'video', 'image', 'document'], {
    errorMap: () => ({ message: 'Media type must be one of: audio, video, image, document' })
  }),
  title: createStringSchema(1, 200).optional(),
  description: createStringSchema(1, 1000).optional(),
  category: createStringSchema(1, 50).optional()
});

export const MediaQuerySchema = z.object({
  type: z.enum(['audio', 'video', 'image', 'document']).optional(),
  category: z.string().optional(),
  limit: z.string().optional().transform(val => val ? Math.min(Math.max(parseInt(val) || 20, 1), 100) : 20),
  featured: z.string().optional().transform(val => val === 'true')
});

/**
 * Newsletter Schemas
 */
export const NewsletterSubscribeSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be no more than 255 characters')
    .transform(str => str.toLowerCase().trim()),
  name: createOptionalStringSchema(100),
  language: z.enum(['en', 'hi', 'ne']).default('en'),
  interests: z.array(z.string().max(50))
    .max(5, 'Maximum 5 interests allowed')
    .optional()
});

export const NewsletterUnsubscribeSchema = z.object({
  token: z.string().min(1, 'Unsubscribe token is required')
});

/**
 * Contact Schemas
 */
export const ContactMessageSchema = z.object({
  name: createStringSchema(1, 100),
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be no more than 255 characters')
    .transform(str => str.toLowerCase().trim()),
  phone: createOptionalStringSchema(20)
    .refine(val => !val || /^[\d\s\-\+\(\)]+$/.test(val), 'Invalid phone number format'),
  subject: createStringSchema(1, 200),
  message: createStringSchema(10, 2000),
  category: z.enum(['general', 'technical', 'spiritual', 'event', 'media'], {
    errorMap: () => ({ message: 'Category must be one of: general, technical, spiritual, event, media' })
  }).default('general'),
  language: z.enum(['en', 'hi', 'ne']).default('en')
});

/**
 * User Management Schemas
 */
export const CreateUserSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email must be no more than 255 characters')
    .transform(str => str.toLowerCase().trim()),
  name: createStringSchema(1, 100),
  role: z.enum(['admin', 'moderator', 'member']).default('member'),
  language: z.enum(['en', 'hi', 'ne']).default('en'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be no more than 128 characters')
});

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().min(1, 'User ID is required')
}).omit({ password: true });

/**
 * Analytics Schemas
 */
export const AnalyticsEventSchema = z.object({
  event: z.enum(['page_view', 'teaching_view', 'event_view', 'media_play', 'search', 'download']),
  resourceType: z.enum(['teaching', 'event', 'media', 'page']).optional(),
  resourceId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * File Upload Validation
 */
export const FileUploadSchema = z.object({
  size: z.number()
    .max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
  type: z.string()
    .refine(type => {
      const allowedTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        // Audio
        'audio/mpeg', 'audio/wav', 'audio/ogg',
        // Video
        'video/mp4', 'video/webm', 'video/ogg',
        // Documents
        'application/pdf', 'text/plain'
      ];
      return allowedTypes.includes(type);
    }, 'Unsupported file type')
});

/**
 * Common Query Parameters
 */
export const PaginationSchema = z.object({
  limit: z.string().optional().transform(val => val ? Math.min(Math.max(parseInt(val) || 10, 1), 100) : 10),
  offset: z.string().optional().transform(val => val ? Math.max(parseInt(val) || 0, 0) : 0)
});

export const SortSchema = z.object({
  sortBy: z.enum(['created_at', 'updated_at', 'title', 'views', 'likes']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * Validation utility functions
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Array<{ field: string; message: string; code?: string }> }> {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }));
      return { success: false, errors };
    }
    throw error;
  }
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(content: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Export type definitions
 */
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateTeachingInput = z.infer<typeof CreateTeachingSchema>;
export type UpdateTeachingInput = z.infer<typeof UpdateTeachingSchema>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;
export type MediaUploadInput = z.infer<typeof MediaUploadSchema>;
export type NewsletterSubscribeInput = z.infer<typeof NewsletterSubscribeSchema>;
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;