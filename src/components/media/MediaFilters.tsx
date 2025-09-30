'use client'

import { useState } from 'react'

const mediaTypes = [
  { id: 'all', name: 'All Media', count: 45 },
  { id: 'audio', name: 'Audio Teachings', count: 20 },
  { id: 'video', name: 'Video Satsangs', count: 15 },
  { id: 'bhajan', name: 'Bhajans', count: 10 }
]

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'teachings', name: 'Spiritual Teachings' },
  { id: 'meditation', name: 'Meditation Guides' },
  { id: 'festivals', name: 'Festival Celebrations' },
  { id: 'devotional', name: 'Devotional Songs' }
]

const durations = [
  { id: 'all', name: 'Any Duration' },
  { id: 'short', name: 'Under 10 minutes' },
  { id: 'medium', name: '10-30 minutes' },
  { id: 'long', name: 'Over 30 minutes' }
]

export function MediaFilters() {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  return (
    <div className="mb-8 sm:mb-12">
      {/* Search Bar */}
      <div className="mb-6 sm:mb-8">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 sm:h-5 sm:w-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-cream-300 rounded-md leading-5 bg-cream-100 text-dark-900 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
          />
        </div>
      </div>

      {/* Media Type Filters */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        {mediaTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 min-h-[44px] touch-manipulation ${
              selectedType === type.id
                ? 'bg-dark-900 text-cream-50'
                : 'bg-cream-200 text-dark-700 hover:bg-cream-300 hover:text-dark-900'
            }`}
          >
            {type.name} ({type.count})
          </button>
        ))}
      </div>

      {/* Additional Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="text-dark-700 font-medium text-xs sm:text-sm">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-cream-100 border border-cream-300 text-dark-900 text-xs sm:text-sm rounded-md focus:ring-dark-900 focus:border-dark-900 px-3 py-2 min-h-[44px]"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="text-dark-700 font-medium text-xs sm:text-sm">Duration:</span>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="bg-cream-100 border border-cream-300 text-dark-900 text-xs sm:text-sm rounded-md focus:ring-dark-900 focus:border-dark-900 px-3 py-2 min-h-[44px]"
          >
            {durations.map((duration) => (
              <option key={duration.id} value={duration.id}>
                {duration.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="text-dark-700 font-medium text-xs sm:text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-cream-100 border border-cream-300 text-dark-900 text-xs sm:text-sm rounded-md focus:ring-dark-900 focus:border-dark-900 px-3 py-2 min-h-[44px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="duration-asc">Duration (Short to Long)</option>
            <option value="duration-desc">Duration (Long to Short)</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="text-center">
        <button
          onClick={() => {
            setSelectedType('all')
            setSelectedCategory('all')
            setSelectedDuration('all')
            setSearchTerm('')
            setSortBy('newest')
          }}
          className="text-dark-600 hover:text-dark-800 text-xs sm:text-sm underline transition-colors duration-200 min-h-[44px] px-4"
        >
          Clear all filters
        </button>
      </div>
    </div>
  )
}