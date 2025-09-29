'use client'

import { useState, useEffect } from 'react'

  const eventTypes = [
    { id: 'all', name: 'All Events', count: eventCounts.all },
    { id: 'satsang', name: 'Satsang', count: eventCounts.satsang },
    { id: 'festival', name: 'Festivals', count: eventCounts.festival },
    { id: 'workshop', name: 'Workshops', count: eventCounts.workshop },
    { id: 'meditation', name: 'Meditation', count: eventCounts.meditation }
  ]

const timeFilters = [
  { id: 'upcoming', name: 'Upcoming' },
  { id: 'this-week', name: 'This Week' },
  { id: 'this-month', name: 'This Month' },
  { id: 'past', name: 'Past Events' }
]

interface EventsFiltersProps {
  selectedType: string
  selectedTime: string
  viewMode: 'calendar' | 'list'
  onFiltersChange: (filters: { type?: string, timeRange?: string, viewMode?: 'calendar' | 'list' }) => void
}

export function EventsFilters({ selectedType, selectedTime, viewMode, onFiltersChange }: EventsFiltersProps) {
  const [eventCounts, setEventCounts] = useState({
    all: 0,
    satsang: 0,
    festival: 0,
    workshop: 0,
    meditation: 0
  })

  // Fetch event counts for each type
  useEffect(() => {
    async function fetchEventCounts() {
      try {
        const response = await fetch('/api/events/counts')
        if (response.ok) {
          const counts = await response.json()
          setEventCounts(counts)
        }
      } catch (error) {
        console.error('Error fetching event counts:', error)
        // Set default counts if API fails
        setEventCounts({
          all: 15,
          satsang: 6,
          festival: 4,
          workshop: 3,
          meditation: 2
        })
      }
    }

    fetchEventCounts()
  }, [])

  return (
    <div className="mb-12">
      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-cream-200 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              viewMode === 'calendar'
                ? 'bg-dark-900 text-cream-50'
                : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Calendar View</span>
            </div>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-6 py-2 rounded-md transition-colors duration-200 ${
              viewMode === 'list'
                ? 'bg-dark-900 text-cream-50'
                : 'text-dark-700 hover:text-dark-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>List View</span>
            </div>
          </button>
        </div>
      </div>

      {/* Event Type Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {eventTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedType === type.id
                ? 'bg-dark-900 text-cream-50'
                : 'bg-cream-200 text-dark-700 hover:bg-cream-300 hover:text-dark-900'
            }`}
          >
            {type.name} ({type.count})
          </button>
        ))}
      </div>

      {/* Time Filters */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          <span className="text-dark-700 font-medium">Show:</span>
          <div className="flex space-x-2">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedTime(filter.id)}
                className={`px-3 py-1 rounded-md text-sm transition-colors duration-200 ${
                  selectedTime === filter.id
                    ? 'bg-cream-200 text-dark-900 font-medium'
                    : 'text-dark-600 hover:text-dark-800'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}