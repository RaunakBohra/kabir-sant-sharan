'use client'

import { useState } from 'react'
import { BlogList } from '@/components/blog/BlogList'
import { BlogFilters } from '@/components/blog/BlogFilters'

interface TeachingFilters {
  category: string
  search: string
}

export default function TeachingsPage() {
  const [filters, setFilters] = useState<TeachingFilters>({
    category: 'all',
    search: ''
  })

  const handleFiltersChange = (newFilters: Partial<TeachingFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }
  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            Teachings & Wisdom
          </h1>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Explore the profound spiritual insights and timeless teachings of Sant Kabir Das.
            Each post contains wisdom to guide you on your spiritual journey toward truth and enlightenment.
          </p>
        </div>

        {/* Filters and Search */}
        <BlogFilters
          selectedCategory={filters.category}
          searchQuery={filters.search}
          onFiltersChange={handleFiltersChange}
        />

        {/* Blog Posts List */}
        <BlogList filters={filters} />
      </div>
    </div>
  )
}