// Global type definitions for Kabir Ashram website

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  category: BlogCategory
  tags: string[]
  featuredImage?: string
  slug: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  location: string
  type: EventType
  registrationRequired: boolean
  maxAttendees?: number
  currentAttendees: number
  featuredImage?: string
  slug: string
}

export interface Quote {
  id: string
  text: string
  author: string
  language: 'en' | 'ne'
  category: QuoteCategory
}

export interface MediaContent {
  id: string
  title: string
  description: string
  url: string
  type: MediaType
  duration?: number
  category: MediaCategory
  uploadedAt: string
  featuredImage?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  joinedAt: string
  preferences: UserPreferences
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  message: string
  type: ContactType
}

// Enums
export type BlogCategory =
  | 'philosophy'
  | 'daily-wisdom'
  | 'stories'
  | 'community'

export type EventType =
  | 'satsang'
  | 'festival'
  | 'workshop'
  | 'retreat'
  | 'community'

export type QuoteCategory =
  | 'wisdom'
  | 'devotion'
  | 'meditation'
  | 'truth'

export type MediaType =
  | 'audio'
  | 'video'
  | 'document'

export type MediaCategory =
  | 'teachings'
  | 'bhajans'
  | 'satsang'
  | 'lectures'

export type UserRole =
  | 'admin'
  | 'moderator'
  | 'member'
  | 'visitor'

export type ContactType =
  | 'general'
  | 'support'
  | 'collaboration'
  | 'media'

export interface UserPreferences {
  language: 'en' | 'ne'
  emailNotifications: boolean
  eventReminders: boolean
  newsletter: boolean
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Navigation
export interface NavItem {
  id: string
  label: string
  href: string
  children?: NavItem[]
}