'use client'

import { useState, useEffect } from 'react'
import { AudioPlayer } from './AudioPlayer'
import { VideoPlayer } from './VideoPlayer'

interface MediaItem {
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
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 12

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const currentOffset = loadMore ? offset : 0
      const response = await fetch(`/api/media?limit=${limit}&offset=${currentOffset}&published=true`)
      const data = await response.json() as { media?: MediaItem[] }

      if (data.media) {
        if (loadMore) {
          setMediaItems(prev => [...prev, ...(data.media || [])])
        } else {
          setMediaItems(data.media || [])
        }
        setHasMore((data.media || []).length === limit)
        setOffset(currentOffset + (data.media || []).length)
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMedia(true)
    }
  }

  const incrementViewCount = async (mediaId: string) => {
    try {
      await fetch(`/api/media/${mediaId}/view`, { method: 'POST' })
      // Update local state to reflect the incremented view count
      setMediaItems(prev => prev.map(item =>
        item.id === mediaId ? { ...item, views: item.views + 1 } : item
      ))
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">Spiritual Media Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-cream-100 rounded-lg shadow-lg overflow-hidden border border-cream-200 animate-pulse">
              <div className="p-4 space-y-3">
                <div className="h-4 bg-cream-200 rounded w-1/3"></div>
                <div className="h-6 bg-cream-200 rounded w-3/4"></div>
                <div className="h-12 bg-cream-200 rounded"></div>
                <div className="h-16 bg-cream-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const featuredItems = mediaItems.filter(item => item.featured)
  const regularItems = mediaItems.filter(item => !item.featured)

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">Spiritual Media Library</h2>

      {/* Featured Media Section */}
      {featuredItems.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xl font-bold text-dark-900 mb-6">Featured Content</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-cream-100 rounded-lg shadow-lg overflow-hidden border border-cream-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm text-dark-500">{item.duration || 'Unknown'}</span>
                  </div>

                  <h4 className="text-lg font-bold text-dark-900 mb-2">{item.title}</h4>
                  <p className="text-dark-700 text-sm mb-4 leading-relaxed">{item.description}</p>

                  {/* Media Player */}
                  <div className="mb-4">
                    {item.type === 'audio' && item.streamingUrl ? (
                      <AudioPlayer
                        title={item.title}
                        artist={item.author}
                        src={item.streamingUrl}
                        duration={item.duration}
                        onPlayStateChange={(isPlaying) => {
                          if (isPlaying) {
                            incrementViewCount(item.id)
                          }
                        }}
                      />
                    ) : item.type === 'video' && item.streamingUrl ? (
                      <VideoPlayer
                        title={item.title}
                        src={item.streamingUrl}
                        duration={item.duration}
                      />
                    ) : (
                      <div className="bg-cream-200 rounded-lg p-4 text-center text-dark-600">
                        Media not available
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="flex items-center justify-between text-xs text-dark-600">
                    <div className="flex items-center space-x-4">
                      <span>By {item.author}</span>
                      <span>{formatDate(item.publishedAt || item.createdAt)}</span>
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
      )}

      {/* All Media Grid */}
      <div>
        <h3 className="text-xl font-bold text-dark-900 mb-6">{featuredItems.length > 0 ? 'More Media' : 'All Media'}</h3>
        {regularItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularItems.map((item) => (
              <div key={item.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-dark-600 bg-cream-200 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.type === 'audio' ? 'bg-dark-600' : 'bg-dark-700'
                      }`}></div>
                      <span className="text-xs text-dark-500">{item.duration || 'Unknown'}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-dark-900 mb-2 line-clamp-2">{item.title}</h4>
                  <p className="text-dark-700 text-xs mb-3 leading-relaxed line-clamp-2">{item.description}</p>

                  {/* Compact Media Player */}
                  <div className="mb-3">
                    {item.type === 'audio' && item.streamingUrl ? (
                      <AudioPlayer
                        title={item.title}
                        artist={item.author}
                        src={item.streamingUrl}
                        duration={item.duration}
                        onPlayStateChange={(isPlaying) => {
                          if (isPlaying) {
                            incrementViewCount(item.id)
                          }
                        }}
                      />
                    ) : item.type === 'video' && item.streamingUrl ? (
                      <div className="aspect-video bg-dark-100 rounded overflow-hidden">
                        <VideoPlayer
                          title={item.title}
                          src={item.streamingUrl}
                          duration={item.duration}
                        />
                      </div>
                    ) : (
                      <div className="bg-cream-200 rounded-lg p-2 text-center text-dark-600 text-xs">
                        Media not available
                      </div>
                    )}
                  </div>

                  {/* Media Footer */}
                  <div className="flex items-center justify-between text-xs text-dark-600">
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{item.author}</span>
                      <span>{formatDate(item.publishedAt || item.createdAt)}</span>
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
        ) : (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark-900 mb-2">No Media Found</h3>
            <p className="text-dark-600">Check back later for spiritual teachings and content.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      {hasMore && regularItems.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-cream-200 hover:bg-cream-300 disabled:opacity-50 text-dark-800 px-6 py-3 rounded-md transition-colors duration-200 font-medium"
          >
            {loadingMore ? 'Loading...' : 'Load More Spiritual Content'}
          </button>
        </div>
      )}
    </div>
  )
}