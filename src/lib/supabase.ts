// Re-export from client for backwards compatibility
export { createClient } from './supabase/client'

// Types for database tables
export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          author: string
          published_at: string
          category: string
          tags: string[]
          featured_image: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          author: string
          published_at?: string
          category: string
          tags?: string[]
          featured_image?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          author?: string
          published_at?: string
          category?: string
          tags?: string[]
          featured_image?: string | null
          slug?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          end_date: string | null
          location: string
          type: string
          registration_required: boolean
          max_attendees: number | null
          current_attendees: number
          featured_image: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          end_date?: string | null
          location: string
          type: string
          registration_required?: boolean
          max_attendees?: number | null
          current_attendees?: number
          featured_image?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          end_date?: string | null
          location?: string
          type?: string
          registration_required?: boolean
          max_attendees?: number | null
          current_attendees?: number
          featured_image?: string | null
          slug?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          text: string
          author: string
          language: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          text: string
          author: string
          language: string
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          text?: string
          author?: string
          language?: string
          category?: string
        }
      }
      media_content: {
        Row: {
          id: string
          title: string
          description: string
          url: string
          type: string
          duration: number | null
          category: string
          uploaded_at: string
          featured_image: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          url: string
          type: string
          duration?: number | null
          category: string
          uploaded_at?: string
          featured_image?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          url?: string
          type?: string
          duration?: number | null
          category?: string
          featured_image?: string | null
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          joined_at: string
          preferences: Record<string, any>
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: string
          joined_at?: string
          preferences?: Record<string, any>
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          preferences?: Record<string, any>
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}