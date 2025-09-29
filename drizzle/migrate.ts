import { createId } from '@paralleldrive/cuid2'

type SupabaseTeaching = {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  tags: string[]
  author: string
  published: boolean
  featured: boolean
  views: number
  likes: number
  cover_image?: string
  reading_time?: number
  published_at?: string
  created_at: string
  updated_at: string
}

type SupabaseEvent = {
  id: string
  title: string
  description: string
  slug: string
  type: string
  location?: string
  virtual_link?: string
  max_attendees?: number
  current_attendees: number
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  timezone: string
  featured: boolean
  published: boolean
  registration_required: boolean
  registration_deadline?: string
  category: string
  tags?: string[]
  cover_image?: string
  organizer: string
  created_at: string
  updated_at: string
}

type SupabaseQuote = {
  id: string
  content: string
  translation?: string
  author: string
  source?: string
  category: string
  tags?: string[]
  featured: boolean
  active: boolean
  display_date?: string
  views: number
  likes: number
  created_at: string
  updated_at: string
}

export class SupabaseToD1Migrator {
  private supabaseUrl: string
  private supabaseKey: string
  private d1Database: any

  constructor(supabaseUrl: string, supabaseKey: string, d1Database: any) {
    this.supabaseUrl = supabaseUrl
    this.supabaseKey = supabaseKey
    this.d1Database = d1Database
  }

  async migrateTeachings(): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/teachings?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch teachings: ${response.statusText}`)
      }

      const teachings: SupabaseTeaching[] = await response.json()

      for (const teaching of teachings) {
        try {
          await this.d1Database.prepare(`
            INSERT INTO teachings (
              id, title, content, excerpt, slug, category, tags, author,
              published, featured, views, likes, language, cover_image,
              reading_time, published_at, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            teaching.id,
            teaching.title,
            teaching.content,
            teaching.excerpt,
            teaching.slug,
            teaching.category,
            JSON.stringify(teaching.tags || []),
            teaching.author,
            teaching.published ? 1 : 0,
            teaching.featured ? 1 : 0,
            teaching.views || 0,
            teaching.likes || 0,
            'en',
            teaching.cover_image || null,
            teaching.reading_time || null,
            teaching.published_at || null,
            teaching.created_at,
            teaching.updated_at
          ).run()

          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Teaching ${teaching.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to fetch teachings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return results
  }

  async migrateEvents(): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/events?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`)
      }

      const events: SupabaseEvent[] = await response.json()

      for (const event of events) {
        try {
          await this.d1Database.prepare(`
            INSERT INTO events (
              id, title, description, slug, type, location, virtual_link,
              max_attendees, current_attendees, start_date, end_date,
              start_time, end_time, timezone, featured, published,
              registration_required, registration_deadline, category,
              tags, cover_image, organizer, language, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            event.id,
            event.title,
            event.description,
            event.slug,
            event.type,
            event.location || null,
            event.virtual_link || null,
            event.max_attendees || null,
            event.current_attendees || 0,
            event.start_date,
            event.end_date,
            event.start_time,
            event.end_time,
            event.timezone || 'Asia/Kathmandu',
            event.featured ? 1 : 0,
            event.published ? 1 : 0,
            event.registration_required ? 1 : 0,
            event.registration_deadline || null,
            event.category,
            JSON.stringify(event.tags || []),
            event.cover_image || null,
            event.organizer,
            'en',
            event.created_at,
            event.updated_at
          ).run()

          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Event ${event.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to fetch events: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return results
  }

  async migrateQuotes(): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/quotes?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch quotes: ${response.statusText}`)
      }

      const quotes: SupabaseQuote[] = await response.json()

      for (const quote of quotes) {
        try {
          await this.d1Database.prepare(`
            INSERT INTO quotes (
              id, content, translation, author, source, category, tags,
              language, featured, active, display_date, views, likes,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            quote.id,
            quote.content,
            quote.translation || null,
            quote.author,
            quote.source || null,
            quote.category,
            JSON.stringify(quote.tags || []),
            'hi',
            quote.featured ? 1 : 0,
            quote.active ? 1 : 0,
            quote.display_date || null,
            quote.views || 0,
            quote.likes || 0,
            quote.created_at,
            quote.updated_at
          ).run()

          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Quote ${quote.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    } catch (error) {
      results.errors.push(`Failed to fetch quotes: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return results
  }

  async createSampleData(): Promise<{ success: number; failed: number; errors: string[] }> {
    const results = { success: 0, failed: 0, errors: [] as string[] }

    const sampleTeachings = [
      {
        id: createId(),
        title: 'The Path of Inner Truth',
        content: 'Sant Kabir taught that the divine light resides within every soul. Through contemplation and surrender, we can discover this eternal truth...',
        excerpt: 'Discover the divine light within through Kabir\'s timeless wisdom on inner contemplation and spiritual awakening.',
        slug: 'path-of-inner-truth',
        category: 'Spiritual Teachings',
        tags: JSON.stringify(['inner-truth', 'divine-light', 'contemplation']),
        author: 'Sant Kabir Das',
        published: 1,
        featured: 1,
        views: 150,
        likes: 25,
        language: 'en',
        reading_time: 8,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        title: 'Unity of All Religions',
        content: 'Kabir\'s revolutionary teaching emphasized that all religions lead to the same divine truth. Ram and Rahim are one...',
        excerpt: 'Explore Kabir\'s message of religious unity and the common thread that connects all spiritual paths.',
        slug: 'unity-of-all-religions',
        category: 'Religious Unity',
        tags: JSON.stringify(['unity', 'religions', 'ram-rahim']),
        author: 'Sant Kabir Das',
        published: 1,
        featured: 0,
        views: 89,
        likes: 15,
        language: 'en',
        reading_time: 6,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const sampleEvents = [
      {
        id: createId(),
        title: 'Weekly Satsang - Kabir\'s Wisdom',
        description: 'Join us for our weekly spiritual gathering where we explore Sant Kabir\'s teachings through discourse, kirtan, and meditation.',
        slug: 'weekly-satsang-kabir-wisdom',
        type: 'satsang',
        location: 'Community Hall, Varanasi',
        max_attendees: 100,
        current_attendees: 0,
        start_date: '2024-10-05',
        end_date: '2024-10-05',
        start_time: '18:00',
        end_time: '20:00',
        timezone: 'Asia/Kathmandu',
        featured: 1,
        published: 1,
        registration_required: 1,
        category: 'Satsang',
        tags: JSON.stringify(['satsang', 'weekly', 'kabir-wisdom']),
        organizer: 'Kabir Sant Sharan Community',
        language: 'en',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    const sampleQuotes = [
      {
        id: createId(),
        content: 'जब मैं था तब हरि नहीं, अब हरि हैं मैं नाही। सब अंधियारा मिट गया, जब दीपक देख्या माही।।',
        translation: 'When I existed, God was not there; now God exists and I am not. All darkness vanished when I saw the lamp within.',
        author: 'Sant Kabir Das',
        category: 'Self-Realization',
        tags: JSON.stringify(['self-realization', 'divine-light', 'ego-dissolution']),
        language: 'hi',
        featured: 1,
        active: 1,
        display_date: new Date().toISOString().split('T')[0],
        views: 45,
        likes: 12,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: createId(),
        content: 'सुरति निरति की रेख मिलाई, गुरु शिष्य का भेद मिटाई।',
        translation: 'The line between consciousness and attention is merged, and the difference between guru and disciple is dissolved.',
        author: 'Sant Kabir Das',
        category: 'Guru-Disciple',
        tags: JSON.stringify(['guru-disciple', 'consciousness', 'unity']),
        language: 'hi',
        featured: 1,
        active: 1,
        display_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        views: 32,
        likes: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ]

    try {
      for (const teaching of sampleTeachings) {
        await this.d1Database.prepare(`
          INSERT INTO teachings (
            id, title, content, excerpt, slug, category, tags, author,
            published, featured, views, likes, language, reading_time,
            published_at, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(...Object.values(teaching)).run()
        results.success++
      }

      for (const event of sampleEvents) {
        await this.d1Database.prepare(`
          INSERT INTO events (
            id, title, description, slug, type, location, max_attendees,
            current_attendees, start_date, end_date, start_time, end_time,
            timezone, featured, published, registration_required, category,
            tags, organizer, language, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(...Object.values(event)).run()
        results.success++
      }

      for (const quote of sampleQuotes) {
        await this.d1Database.prepare(`
          INSERT INTO quotes (
            id, content, translation, author, category, tags, language,
            featured, active, display_date, views, likes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(...Object.values(quote)).run()
        results.success++
      }
    } catch (error) {
      results.failed++
      results.errors.push(`Sample data creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    return results
  }

  async fullMigration(): Promise<{
    teachings: { success: number; failed: number; errors: string[] }
    events: { success: number; failed: number; errors: string[] }
    quotes: { success: number; failed: number; errors: string[] }
    sampleData: { success: number; failed: number; errors: string[] }
  }> {
    console.log('Starting full migration from Supabase to Cloudflare D1...')

    const teachingsResult = await this.migrateTeachings()
    console.log(`Teachings migration: ${teachingsResult.success} success, ${teachingsResult.failed} failed`)

    const eventsResult = await this.migrateEvents()
    console.log(`Events migration: ${eventsResult.success} success, ${eventsResult.failed} failed`)

    const quotesResult = await this.migrateQuotes()
    console.log(`Quotes migration: ${quotesResult.success} success, ${quotesResult.failed} failed`)

    const sampleDataResult = await this.createSampleData()
    console.log(`Sample data creation: ${sampleDataResult.success} success, ${sampleDataResult.failed} failed`)

    return {
      teachings: teachingsResult,
      events: eventsResult,
      quotes: quotesResult,
      sampleData: sampleDataResult
    }
  }
}

export async function runMigration(env: any): Promise<void> {
  const supabaseUrl = 'https://mfzrpbwffgufnzxgqixt.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1menJwYndmZmd1Zm56eGdxaXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MDU1ODcsImV4cCI6MjA0MzE4MTU4N30.Kf0FLrwP-Qg9CDUY0wT5ht5jtfJvZp6PCYIT7-ULJt4'

  const migrator = new SupabaseToD1Migrator(supabaseUrl, supabaseKey, env.DB)
  const results = await migrator.fullMigration()

  console.log('Migration completed!')
  console.log('Results:', JSON.stringify(results, null, 2))
}