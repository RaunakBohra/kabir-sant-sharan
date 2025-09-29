import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'

interface MediaItem {
  id: string
  title: string
  description: string
  type: 'audio' | 'video'
  src: string
  poster?: string
  duration: string
  category: string
  author: string
  uploadDate: string
  views: number
  featured?: boolean
}

const sampleMediaItems: MediaItem[] = [
  {
    id: '1',
    title: 'Sant Kabir\'s Teaching on Inner Truth',
    description: 'A profound discourse on discovering the divine truth within oneself, exploring the path of self-realization through Kabir\'s timeless wisdom.',
    type: 'audio',
    src: '/audio/sample-teaching.mp3',
    duration: '25:30',
    category: 'Spiritual Teachings',
    author: 'Sant Kabir Das',
    uploadDate: '2024-09-25',
    views: 1250,
    featured: true
  },
  {
    id: '2',
    title: 'Weekly Satsang - Unity in Diversity',
    description: 'Complete recording of our weekly satsang discussing Kabir\'s revolutionary teachings on the oneness of all religions and spiritual paths.',
    type: 'video',
    src: '/video/sample-satsang.mp4',
    poster: '/images/satsang-poster.jpg',
    duration: '45:15',
    category: 'Satsang Recordings',
    author: 'Community Leader',
    uploadDate: '2024-09-28',
    views: 890,
    featured: true
  },
  {
    id: '3',
    title: 'Devotional Bhajan - Sab Dharti Kagad',
    description: 'Beautiful rendition of Kabir\'s famous doha "Sab Dharti Kagad Karun" with traditional musical accompaniment and spiritual interpretation.',
    type: 'audio',
    src: '/audio/sample-bhajan.mp3',
    duration: '8:45',
    category: 'Devotional Music',
    author: 'Spiritual Musicians',
    uploadDate: '2024-09-26',
    views: 650,
    featured: false
  },
  {
    id: '4',
    title: 'Meditation Guide - Kabir\'s Simple Path',
    description: 'Guided meditation session based on Sant Kabir\'s teachings on inner contemplation and connecting with the divine presence within.',
    type: 'audio',
    src: '/audio/sample-meditation.mp3',
    duration: '15:20',
    category: 'Meditation Guides',
    author: 'Meditation Teacher',
    uploadDate: '2024-09-24',
    views: 1100,
    featured: false
  },
  {
    id: '5',
    title: 'Festival Celebration - Kabir Jayanti 2024',
    description: 'Complete video recording of our Kabir Jayanti celebration with spiritual discourses, kirtan, and community participation.',
    type: 'video',
    src: '/video/sample-festival.mp4',
    poster: '/images/festival-poster.jpg',
    duration: '1:20:30',
    category: 'Festival Recordings',
    author: 'Community',
    uploadDate: '2024-09-20',
    views: 2100,
    featured: false
  },
  {
    id: '6',
    title: 'Daily Wisdom - Morning Reflection',
    description: 'Short daily reflection on one of Kabir\'s dohas, providing spiritual insight for starting the day with divine consciousness.',
    type: 'audio',
    src: '/audio/sample-daily.mp3',
    duration: '5:12',
    category: 'Daily Wisdom',
    author: 'Spiritual Guide',
    uploadDate: '2024-09-29',
    views: 420,
    featured: false
  }
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatViews(views: number) {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k'
  }
  return views.toString()
}

export function MediaGrid() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">Spiritual Media Library</h2>

      {/* Featured Media Section */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-dark-900 mb-6">Featured Content</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sampleMediaItems.filter(item => item.featured).map((item) => (
            <div key={item.id} className="bg-cream-100 rounded-lg shadow-lg overflow-hidden border border-cream-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-sm text-dark-500">{item.duration}</span>
                </div>

                <h4 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h4>
                <p className="text-dark-700 text-sm mb-4 leading-relaxed">{item.description}</p>

                {/* Media Player */}
                <div className="mb-4">
                  {item.type === 'audio' ? (
                    <AudioPlayer
                      title={item.title}
                      artist={item.author}
                      src={item.src}
                      duration={item.duration}
                    />
                  ) : (
                    <VideoPlayer
                      title={item.title}
                      src={item.src}
                      poster={item.poster}
                      duration={item.duration}
                    />
                  )}
                </div>

                {/* Media Info */}
                <div className="flex items-center justify-between text-xs text-dark-600">
                  <div className="flex items-center space-x-4">
                    <span>By {item.author}</span>
                    <span>{formatDate(item.uploadDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{formatViews(item.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Media Grid */}
      <div>
        <h3 className="text-xl font-bold text-dark-900 mb-6">All Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleMediaItems.map((item) => (
            <div key={item.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-dark-600 bg-cream-200 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'audio' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-dark-500">{item.duration}</span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-dark-900 mb-2 line-clamp-2">{item.title}</h4>
                <p className="text-dark-700 text-xs mb-3 leading-relaxed line-clamp-2">{item.description}</p>

                {/* Compact Media Player */}
                <div className="mb-3">
                  {item.type === 'audio' ? (
                    <AudioPlayer
                      title={item.title}
                      artist={item.author}
                      src={item.src}
                      duration={item.duration}
                    />
                  ) : (
                    <div className="aspect-video bg-dark-100 rounded overflow-hidden">
                      <VideoPlayer
                        title={item.title}
                        src={item.src}
                        poster={item.poster}
                        duration={item.duration}
                      />
                    </div>
                  )}
                </div>

                {/* Media Footer */}
                <div className="flex items-center justify-between text-xs text-dark-600">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">{item.author}</span>
                    <span>{formatDate(item.uploadDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{formatViews(item.views)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-6 py-3 rounded-md transition-colors duration-200 font-medium">
          Load More Spiritual Content
        </button>
      </div>
    </div>
  )
}