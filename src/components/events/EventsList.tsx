'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { EventRegistrationModal } from './EventRegistrationModal'

interface Event {
  id: string
  title: string
  description: string
  slug: string
  type: string
  location: string | null
  virtualLink: string | null
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  timezone: string
  maxAttendees: number | null
  currentAttendees: number
  registrationRequired: boolean
  registrationDeadline: string | null
  category: string
  tags: string | null
  coverImage: string | null
  organizer: string
  language: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

interface EventsListProps {
  filters?: {
    type?: string
    timeRange?: string
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'satsang':
      return 'bg-blue-100 border-blue-300 text-blue-800'
    case 'festival':
      return 'bg-orange-100 border-orange-300 text-orange-800'
    case 'workshop':
      return 'bg-green-100 border-green-300 text-green-800'
    case 'meditation':
      return 'bg-purple-100 border-purple-300 text-purple-800'
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}

function calculateDuration(startTime: string, endTime: string): string {
  try {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours === 0) {
      return `${diffMinutes} minutes`
    } else if (diffMinutes === 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`
    } else {
      return `${diffHours}h ${diffMinutes}m`
    }
  } catch {
    return 'Duration not available'
  }
}

export function EventsList({ filters }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)

        // Build query parameters
        const params = new URLSearchParams()
        if (filters?.type && filters.type !== 'all') {
          params.append('type', filters.type)
        }

        const url = `/api/events/${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        // Transform API response to match component interface
        const transformedEvents = (data.events || []).map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          slug: event.slug || event.id,
          type: event.event_type || 'general',
          location: event.location,
          virtualLink: event.virtual_link,
          startDate: event.event_date || '',
          endDate: event.end_date || event.event_date || '',
          startTime: event.event_time || '00:00',
          endTime: event.end_time || '23:59',
          timezone: event.timezone || 'UTC',
          maxAttendees: event.max_attendees,
          currentAttendees: event.current_attendees || 0,
          registrationRequired: event.registration_required || false,
          registrationDeadline: event.registration_deadline,
          category: event.category || 'general',
          tags: event.tags,
          coverImage: event.cover_image,
          organizer: event.organizer || 'Kabir Sant Sharan',
          language: event.language || 'en',
          featured: event.is_featured || false,
          published: event.published !== false,
          createdAt: event.created_at || '',
          updatedAt: event.updated_at || ''
        }))
        setEvents(transformedEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [filters])

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event)
    setIsRegistrationModalOpen(true)
  }

  const handleRegistrationSuccess = () => {
    // Refresh events to get updated attendee count
    window.location.reload()
  }

  const handleCloseModal = () => {
    setIsRegistrationModalOpen(false)
    setSelectedEvent(null)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-cream-100 rounded-lg p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="w-24 h-6 bg-cream-200 rounded"></div>
              <div className="w-16 h-4 bg-cream-200 rounded"></div>
            </div>
            <div className="w-3/4 h-8 bg-cream-200 rounded mb-4"></div>
            <div className="w-full h-4 bg-cream-200 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-cream-200 rounded mb-4"></div>
            <div className="flex space-x-4">
              <div className="w-32 h-10 bg-cream-200 rounded"></div>
              <div className="w-32 h-10 bg-cream-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load events</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-dark-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-dark-800 mb-2">No events found</h3>
        <p className="text-dark-600">Check back later for upcoming spiritual gatherings and events.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">
        {filters?.type && filters.type !== 'all' ?
          `${filters.type.charAt(0).toUpperCase() + filters.type.slice(1)} Events` :
          'Upcoming Events'
        }
      </h2>

      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                {/* Main Content */}
                <div className="flex-1 md:mr-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    {event.featured && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full border border-amber-300">
                        Featured
                      </span>
                    )}
                    <span className="text-sm text-dark-500">
                      {calculateDuration(event.startTime, event.endTime)}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-dark-900 mb-3">
                    {event.title}
                  </h3>

                  <p className="text-dark-700 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-dark-700">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="font-medium">{formatDate(event.startDate)}</div>
                        <div className="text-sm text-dark-600">{event.startTime}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-dark-700">
                      {event.virtualLink ? (
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <div>
                        <div className="font-medium">
                          {event.virtualLink ? 'Virtual Event' : (event.location || 'Location TBD')}
                        </div>
                        {event.virtualLink && (
                          <div className="text-sm text-dark-600">Online</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Capacity Info */}
                  {event.maxAttendees && event.registrationRequired && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-dark-600 mb-2">
                        <span>Registration Status</span>
                        <span>{event.currentAttendees} of {event.maxAttendees} registered</span>
                      </div>
                      <div className="w-full bg-cream-200 rounded-full h-2">
                        <div
                          className="bg-dark-700 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {event.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.split(',').map((tag, index) => (
                        <span key={index} className="bg-cream-200 text-dark-700 text-xs px-2 py-1 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 md:min-w-[200px]">
                  {event.registrationRequired ? (
                    <button
                      onClick={() => handleRegisterClick(event)}
                      disabled={event.maxAttendees && event.currentAttendees >= event.maxAttendees}
                      className={`px-6 py-3 rounded-md transition-colors duration-200 font-medium ${
                        event.maxAttendees && event.currentAttendees >= event.maxAttendees
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-dark-900 text-cream-50 hover:bg-dark-800'
                      }`}
                    >
                      {event.maxAttendees && event.currentAttendees >= event.maxAttendees ?
                        'Join Waitlist' : 'Register Now'}
                    </button>
                  ) : (
                    <div className="text-center py-2 text-dark-600 text-sm font-medium">
                      No registration required
                    </div>
                  )}

                  <Link
                    href={`/events/${event.slug}`}
                    className="border border-dark-300 text-dark-800 px-6 py-3 rounded-md hover:bg-cream-200 transition-colors duration-200 font-medium text-center inline-block"
                  >
                    View Details
                  </Link>

                  <button className="text-dark-600 hover:text-dark-800 px-6 py-2 transition-colors duration-200 text-sm flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More - Simple implementation for now */}
      {events.length > 0 && events.length % 10 === 0 && (
        <div className="text-center mt-12">
          <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-8 py-3 rounded-md transition-colors duration-200 font-medium">
            Load More Events
          </button>
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          isOpen={isRegistrationModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  )
}