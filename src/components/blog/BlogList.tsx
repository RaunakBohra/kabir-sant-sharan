'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  tags: string | null
  coverImage: string | null
  author: string
  published: boolean
  featured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface BlogPostDisplay {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  tags: string[]
  featured: boolean
}

interface BlogListProps {
  filters?: {
    category?: string
    search?: string
  }
}

// Legacy interface for display purposes
interface LegacyBlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  tags: string[]
  image?: string
  featured: boolean
}

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(' ').length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Helper function to parse tags
function parseTags(tags: string | null): string[] {
  if (!tags) return []
  return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
}

// Convert API response to display format
function convertToDisplayFormat(post: BlogPost): BlogPostDisplay {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || post.content.substring(0, 200) + '...',
    category: post.category,
    author: post.author,
    publishedAt: post.publishedAt,
    readTime: calculateReadTime(post.content),
    tags: parseTags(post.tags),
    featured: post.featured
  }
}

const samplePosts: LegacyBlogPost[] = [
  {
    id: '1',
    title: 'The Path of Inner Truth: Understanding Kabir\'s Philosophy',
    excerpt: 'Explore the fundamental principles of Sant Kabir\'s teachings on self-realization and the journey toward inner truth.',
    content: 'Full content here...',
    category: 'Philosophy',
    author: 'Sant Kabir Das',
    publishedAt: '2024-10-01',
    readTime: '8 min read',
    tags: ['truth', 'philosophy', 'self-realization'],
    featured: true
  },
  {
    id: '2',
    title: 'Unity in Diversity: The Universal Message of Love',
    excerpt: 'Discover how Kabir\'s revolutionary teachings transcend religious boundaries to embrace the oneness of all creation.',
    content: 'Full content here...',
    category: 'Unity',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-28',
    readTime: '6 min read',
    tags: ['unity', 'love', 'religion', 'oneness'],
    featured: true
  },
  {
    id: '3',
    title: 'The Weaver\'s Wisdom: Lessons from Kabir\'s Humble Profession',
    excerpt: 'Learn profound spiritual lessons from Kabir\'s daily work as a weaver, teaching us about patience and dedication.',
    content: 'Full content here...',
    category: 'Life Stories',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-25',
    readTime: '5 min read',
    tags: ['weaving', 'profession', 'patience', 'dedication'],
    featured: false
  },
  {
    id: '4',
    title: 'Beyond Rituals: The True Meaning of Devotion',
    excerpt: 'Understanding Kabir\'s critique of empty rituals and his emphasis on genuine devotion and love for the divine.',
    content: 'Full content here...',
    category: 'Devotion',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-22',
    readTime: '7 min read',
    tags: ['devotion', 'rituals', 'spirituality', 'divine'],
    featured: false
  },
  {
    id: '5',
    title: 'The Simple Path: Kabir\'s Guide to Meditation',
    excerpt: 'Discover the simple yet profound meditation techniques taught by Sant Kabir for connecting with the divine within.',
    content: 'Full content here...',
    category: 'Meditation',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-19',
    readTime: '4 min read',
    tags: ['meditation', 'simplicity', 'divine', 'inner-peace'],
    featured: false
  },
  {
    id: '6',
    title: 'Love Without Boundaries: Kabir\'s Universal Compassion',
    excerpt: 'Exploring Kabir\'s teachings on unconditional love that transcends caste, creed, and social divisions.',
    content: 'Full content here...',
    category: 'Unity',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-16',
    readTime: '6 min read',
    tags: ['love', 'compassion', 'equality', 'society'],
    featured: false
  }
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function BlogList({ filters }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPostDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (filters?.category && filters.category !== 'all') {
          params.append('category', filters.category)
        }
        if (filters?.search) {
          params.append('search', filters.search)
        }
        params.append('limit', '50') // Get more posts for pagination

        const url = `/api/teachings${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch teachings')
        }

        const data = await response.json()
        const teachings = data.teachings || []

        // Convert to display format
        const displayPosts = teachings.map(convertToDisplayFormat)
        setPosts(displayPosts)

      } catch (err) {
        console.error('Error fetching teachings:', err)
        setError(err instanceof Error ? err.message : 'Failed to load teachings')
        // Fallback to sample data on error
        const fallbackPosts = samplePosts.map(post => ({
          ...post,
          tags: typeof post.tags === 'string' ? post.tags.split(',') : post.tags
        }))
        setPosts(fallbackPosts as BlogPostDisplay[])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [filters])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="mb-12">
          <div className="h-8 bg-cream-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-cream-100 rounded-lg p-6 animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-20 h-6 bg-cream-200 rounded-full"></div>
                  <div className="w-16 h-4 bg-cream-200 rounded"></div>
                </div>
                <div className="w-full h-6 bg-cream-200 rounded mb-4"></div>
                <div className="w-full h-4 bg-cream-200 rounded mb-2"></div>
                <div className="w-3/4 h-4 bg-cream-200 rounded mb-4"></div>
                <div className="flex justify-between items-center mb-4">
                  <div className="w-24 h-4 bg-cream-200 rounded"></div>
                  <div className="w-20 h-4 bg-cream-200 rounded"></div>
                </div>
                <div className="flex gap-2 mb-4">
                  <div className="w-12 h-4 bg-cream-200 rounded"></div>
                  <div className="w-16 h-4 bg-cream-200 rounded"></div>
                </div>
                <div className="w-32 h-4 bg-cream-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load teachings</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const featuredPosts = posts.filter(post => post.featured)
  const regularPosts = posts.filter(post => !post.featured)
  return (
    <div className="space-y-8">
      {/* Featured Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-dark-900 mb-6">Featured Teachings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredPosts.map((post) => (
            <article key={post.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-dark-500">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-dark-900 mb-3 hover:text-dark-700 transition-colors duration-200">
                  <Link href={`/teachings/${post.id}` as any}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-dark-700 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-dark-600 mb-4">
                  <span>By {post.author}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-cream-200 text-dark-600 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/teachings/${post.id}` as any}
                  className="inline-flex items-center text-dark-800 font-medium hover:text-dark-900 transition-colors duration-200"
                >
                  Read Full Teaching
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* All Posts */}
      <div>
        <h2 className="text-2xl font-bold text-dark-900 mb-6">All Teachings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <article key={post.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-sm text-dark-500">
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-dark-900 mb-3 hover:text-dark-700 transition-colors duration-200">
                  <Link href={`/teachings/${post.id}` as any}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-dark-700 leading-relaxed text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-dark-600 mb-3">
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <Link
                  href={`/teachings/${post.id}` as any}
                  className="inline-flex items-center text-dark-800 font-medium hover:text-dark-900 transition-colors duration-200 text-sm"
                >
                  Read More
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 text-dark-600 border border-cream-300 rounded-md hover:bg-cream-200 transition-colors duration-200">
            Previous
          </button>
          <button className="px-3 py-2 bg-dark-900 text-cream-50 rounded-md">1</button>
          <button className="px-3 py-2 text-dark-700 border border-cream-300 rounded-md hover:bg-cream-200 transition-colors duration-200">2</button>
          <button className="px-3 py-2 text-dark-700 border border-cream-300 rounded-md hover:bg-cream-200 transition-colors duration-200">3</button>
          <span className="px-3 py-2 text-dark-500">...</span>
          <button className="px-3 py-2 text-dark-700 border border-cream-300 rounded-md hover:bg-cream-200 transition-colors duration-200">8</button>
          <button className="px-3 py-2 text-dark-600 border border-cream-300 rounded-md hover:bg-cream-200 transition-colors duration-200">
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}