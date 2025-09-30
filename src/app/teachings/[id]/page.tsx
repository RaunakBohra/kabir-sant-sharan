'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Teaching {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  category: string
  tags: string[] | string | null
  author: string
  published: boolean
  featured: boolean
  language: string
  coverImage: string | null
  readingTime: number
  publishedAt: string | null
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function TeachingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [teaching, setTeaching] = useState<Teaching | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeaching() {
      try {
        setLoading(true)
        const resolvedParams = await params
        const response = await fetch(`/api/teachings/${resolvedParams.id}/`)

        if (!response.ok) {
          throw new Error('Teaching not found')
        }

        const data = await response.json() as Teaching
        setTeaching(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teaching')
      } finally {
        setLoading(false)
      }
    }

    fetchTeaching()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-500">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-cream-200 rounded mb-6"></div>
              <div className="h-12 bg-cream-200 rounded mb-6"></div>
              <div className="h-64 bg-cream-200 rounded mb-6"></div>
              <div className="h-32 bg-cream-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !teaching) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-dark-600">
            <Link href="/" className="hover:text-dark-800">Home</Link>
            <span>/</span>
            <Link href="/teachings" className="hover:text-dark-800">Teachings</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">{teaching.title}</span>
          </div>
        </nav>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-cream-200 text-dark-700 px-3 py-1 rounded-full text-sm font-medium">
                {teaching.category}
              </span>
              <span className="text-dark-600 text-sm">{teaching.readingTime} min read</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 leading-tight">
              {teaching.title}
            </h1>

            <div className="flex items-center justify-between text-dark-600 mb-6">
              <span>By {teaching.author}</span>
              <span>{teaching.publishedAt ? formatDate(teaching.publishedAt) : formatDate(teaching.createdAt)}</span>
            </div>

            {teaching.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {(Array.isArray(teaching.tags) ? teaching.tags : teaching.tags.split(',')).map((tag, index) => (
                  <span key={index} className="bg-cream-200 text-dark-700 px-3 py-1 rounded text-sm">
                    #{typeof tag === 'string' ? tag.trim() : tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="bg-cream-100 rounded-lg p-8 md:p-12 shadow-lg border border-cream-200">
            <div
              className="prose prose-lg max-w-none text-dark-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: teaching.content }}
              style={{
                lineHeight: '1.8'
              }}
            />
          </div>

          {/* Share and Navigation */}
          <div className="mt-12 pt-8 border-t border-cream-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-dark-700 mb-2">Share this teaching:</p>
                <div className="flex space-x-3">
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    Facebook
                  </button>
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    Twitter
                  </button>
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    WhatsApp
                  </button>
                </div>
              </div>

              <Link
                href="/teachings"
                className="bg-dark-900 hover:bg-dark-800 text-cream-50 px-6 py-3 rounded transition-colors duration-200 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Teachings
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}