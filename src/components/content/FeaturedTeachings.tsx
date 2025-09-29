'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Teaching {
  id: string
  title: string
  excerpt: string
  category: string
  readTime?: string
  image?: string
  content?: string
}

export function FeaturedTeachings() {
  const [teachings, setTeachings] = useState<Teaching[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTeachings = async () => {
      try {
        const response = await fetch('/api/teachings?limit=3')
        const data = await response.json()
        setTeachings(data.teachings || [])
      } catch (error) {
        console.error('Failed to load teachings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeachings()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-cream-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Featured Teachings
            </h2>
            <p className="text-lg text-dark-600 max-w-2xl mx-auto">
              Explore the profound wisdom and spiritual insights of Sant Kabir Das
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cream-100 rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-cream-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-cream-300 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-cream-300 rounded mb-4"></div>
                <div className="h-4 bg-cream-300 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className="py-16 bg-cream-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Featured Teachings
          </h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Explore the profound wisdom and spiritual insights of Sant Kabir Das through our curated collection of teachings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teachings.map((teaching) => (
            <div key={teaching.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {teaching.category}
                  </span>
                  <span className="text-sm text-dark-500">
                    {teaching.readTime || '5 min read'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-dark-900 mb-3 hover:text-dark-700 transition-colors duration-200">
                  <Link href={`/teachings/${teaching.id}` as any}>
                    {teaching.title}
                  </Link>
                </h3>

                <p className="text-dark-700 leading-relaxed mb-4">
                  {teaching.excerpt}
                </p>

                <Link
                  href={`/teachings/${teaching.id}` as any}
                  className="inline-flex items-center text-dark-800 font-medium hover:text-dark-900 transition-colors duration-200"
                >
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={"/teachings"}
            className="inline-flex items-center px-8 py-3 bg-dark-900 text-cream-50 font-medium rounded-md hover:bg-dark-800 transition-colors duration-200"
          >
            View All Teachings
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}