'use client'

import { useState } from 'react'
import { EventsCalendar } from '@/components/events/EventsCalendar'
import { EventsList } from '@/components/events/EventsList'
import { EventsFilters } from '@/components/events/EventsFilters'

interface EventFilters {
  type: string
  timeRange: string
  viewMode: 'calendar' | 'list'
}

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>({
    type: 'all',
    timeRange: 'upcoming',
    viewMode: 'calendar'
  })

  const handleFiltersChange = (newFilters: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }
  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            Spiritual Events & Gatherings
          </h1>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Join our spiritual community in various events, satsangs, and celebrations.
            Experience the divine teachings of Sant Kabir Das through collective worship and learning.
          </p>
        </div>

        {/* Event Filters */}
        <EventsFilters
          selectedType={filters.type}
          selectedTime={filters.timeRange}
          viewMode={filters.viewMode}
          onFiltersChange={handleFiltersChange}
        />

        {/* Conditional View Based on Filter */}
        {filters.viewMode === 'calendar' ? (
          <div className="mb-12">
            <EventsCalendar filters={{ type: filters.type, timeRange: filters.timeRange }} />
          </div>
        ) : (
          <EventsList filters={{ type: filters.type, timeRange: filters.timeRange }} />
        )}
      </div>
    </div>
  )
}