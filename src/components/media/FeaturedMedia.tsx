import Link from 'next/link'
import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'

interface FeaturedMediaItem {
  id: string
  title: string
  description: string
  type: 'audio' | 'video'
  src: string
  poster?: string
  duration: string
  category: string
  author: string
  featured: boolean
}

const featuredMediaItems: FeaturedMediaItem[] = [
  {
    id: '1',
    title: 'The Divine Within - Sant Kabir\'s Core Teaching',
    description: 'Discover the profound truth that the divine resides within every soul through this enlightening spiritual discourse.',
    type: 'audio',
    src: '/audio/divine-within.mp3',
    duration: '28:45',
    category: 'Spiritual Teachings',
    author: 'Sant Kabir Das',
    featured: true
  },
  {
    id: '2',
    title: 'Weekly Satsang - Path of Love and Devotion',
    description: 'Experience the transformative power of bhakti (devotion) as taught by Sant Kabir in this beautiful satsang recording.',
    type: 'video',
    src: '/video/satsang-love.mp4',
    poster: '/images/satsang-love-poster.jpg',
    duration: '52:15',
    category: 'Satsang Recordings',
    author: 'Community Elders',
    featured: true
  }
]

export function FeaturedMedia() {
  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Featured Spiritual Media
          </h2>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Immerse yourself in the sacred teachings of Sant Kabir Das through our carefully curated
            collection of spiritual audio and video content.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredMediaItems.map((media) => (
            <div key={media.id} className="bg-cream-50 rounded-xl shadow-lg overflow-hidden border border-cream-200">
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {media.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      media.type === 'audio' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-dark-500 font-medium">{media.duration}</span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-3">
                  {media.title}
                </h3>

                <p className="text-dark-700 leading-relaxed mb-6">
                  {media.description}
                </p>

                {/* Media Player */}
                <div className="mb-6">
                  {media.type === 'audio' ? (
                    <AudioPlayer
                      title={media.title}
                      artist={media.author}
                      src={media.src}
                      duration={media.duration}
                    />
                  ) : (
                    <div className="rounded-lg overflow-hidden">
                      <VideoPlayer
                        title={media.title}
                        src={media.src}
                        poster={media.poster}
                        duration={media.duration}
                      />
                    </div>
                  )}
                </div>

                {/* Media Metadata */}
                <div className="flex items-center justify-between text-sm text-dark-600 border-t border-cream-300 pt-4">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">By {media.author}</span>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>Featured</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="hover:text-dark-800 transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                    <button className="hover:text-dark-800 transition-colors duration-200">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spiritual Quote Section */}
        <div className="bg-cream-200 rounded-xl p-8 md:p-12 text-center mb-12 border border-cream-300">
          <blockquote className="text-xl md:text-2xl italic text-dark-800 mb-4 leading-relaxed">
            "सुरति निरति की रेख मिलाई, गुरु शिष्य का भेद मिटाई।"
          </blockquote>
          <cite className="text-dark-700 font-medium">
            - Sant Kabir Das
          </cite>
          <p className="text-dark-600 text-sm mt-3 max-w-2xl mx-auto">
            "The line between consciousness and attention is merged, and the difference between guru and disciple is dissolved."
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link
            href="/media"
            className="inline-flex items-center px-8 py-4 bg-dark-900 text-cream-50 font-semibold rounded-md hover:bg-dark-800 transition-colors duration-200"
          >
            Explore Complete Media Library
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-10V7a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h12a2 2 0 012 2z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}