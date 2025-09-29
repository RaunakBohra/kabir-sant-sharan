import Link from 'next/link'

interface BlogPost {
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

const samplePosts: BlogPost[] = [
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

export function BlogList() {
  return (
    <div className="space-y-8">
      {/* Featured Posts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-dark-900 mb-6">Featured Teachings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {samplePosts.filter(post => post.featured).map((post) => (
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
          {samplePosts.map((post) => (
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