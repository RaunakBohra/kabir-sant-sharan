'use client'

import { useState } from 'react'

const categories = [
  { id: 'all', name: 'All Teachings', count: 24 },
  { id: 'philosophy', name: 'Philosophy', count: 8 },
  { id: 'unity', name: 'Unity & Love', count: 6 },
  { id: 'life-stories', name: 'Life Stories', count: 5 },
  { id: 'devotion', name: 'Devotion', count: 3 },
  { id: 'meditation', name: 'Meditation', count: 2 }
]

export function BlogFilters() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  return (
    <div className="mb-12">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search teachings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-cream-300 rounded-md leading-5 bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-dark-900 text-cream-50'
                : 'bg-cream-200 text-dark-700 hover:bg-cream-300 hover:text-dark-900'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Sort Options */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          <span className="text-dark-700 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-cream-100 border border-cream-300 text-dark-900 text-sm rounded-md focus:ring-dark-500 focus:border-dark-500 px-3 py-2"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>
    </div>
  )
}