'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'

interface FeaturedMediaItem {
  id: string
  title: string
  description: string
  type: string
  category: string
  tags?: string
  author: string
  duration?: string
  streamingUrl?: string
  downloadUrl?: string
  featured: boolean
  published: boolean
  views: number
  downloads: number
  likes: number
  language: string
  publishedAt?: string
  createdAt: string
}

export function FeaturedMedia() {
  const [featuredMediaItems, setFeaturedMediaItems] = useState<FeaturedMediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedMedia()
  }, [])

  const fetchFeaturedMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/media?limit=4&offset=0&published=true')
      const data = await response.json() as { media?: FeaturedMediaItem[] }

      if (data.media) {
        // Filter for featured items only
        const featured = data.media.filter((item: FeaturedMediaItem) => item.featured)
        setFeaturedMediaItems(featured)
      }
    } catch (error) {
      console.error('Error fetching featured media:', error)
    } finally {
      setLoading(false)
    }
  }

  const incrementViewCount = async (mediaId: string) => {
    try {
      await fetch(`/api/media/${mediaId}/view`, { method: 'POST' })
      // Update local state to reflect the incremented view count
      setFeaturedMediaItems(prev => prev.map(item =>
        item.id === mediaId ? { ...item, views: item.views + 1 } : item
      ))
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  if (loading) {
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
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-cream-50 rounded-xl shadow-lg overflow-hidden border border-cream-200 animate-pulse">
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-cream-200 rounded w-1/3"></div>
                  <div className="h-8 bg-cream-200 rounded w-3/4"></div>
                  <div className="h-20 bg-cream-200 rounded"></div>
                  <div className="h-16 bg-cream-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Don't render the section if there are no featured items
  if (featuredMediaItems.length === 0) {
    return null
  }

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
                      media.type === 'audio' ? 'bg-dark-600' : 'bg-dark-700'
                    }`}></div>
                    <span className="text-sm text-dark-500 font-medium">{media.duration || 'Unknown'}</span>
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
                  {media.type === 'audio' && media.streamingUrl ? (
                    <AudioPlayer
                      title={media.title}
                      artist={media.author}
                      src={media.streamingUrl}
                      duration={media.duration}
                      onPlayStateChange={(isPlaying) => {
                        if (isPlaying) {
                          incrementViewCount(media.id)
                        }
                      }}
                    />
                  ) : media.type === 'video' && media.streamingUrl ? (
                    <div className="rounded-lg overflow-hidden">
                      <VideoPlayer
                        title={media.title}
                        src={media.streamingUrl}
                        duration={media.duration}
                      />
                    </div>
                  ) : (
                    <div className="bg-cream-200 rounded-lg p-6 text-center text-dark-600">
                      Media not available
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
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{media.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{media.likes}</span>
                    </div>
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