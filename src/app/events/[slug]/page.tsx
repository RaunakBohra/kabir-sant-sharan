'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'

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

interface EventDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true)
        const { slug } = await params
        // First get all events and find the one with matching slug
        const response = await fetch('/api/events/')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        const events = data.events || []
        const foundEvent = events.find((e: Event) => e.slug === slug)

        if (!foundEvent) {
          throw new Error('Event not found')
        }

        setEvent(foundEvent)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.slug])

  const handleRegisterClick = () => {
    setIsRegistrationModalOpen(true)
  }

  const handleRegistrationSuccess = () => {
    // Refresh page to get updated attendee count
    window.location.reload()
  }

  const handleCloseModal = () => {
    setIsRegistrationModalOpen(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getTypeColor = (type: string) => {
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

  const calculateDuration = (startTime: string, endTime: string): string => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-500">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse" role="status" aria-label="Loading event details">
              <div className="h-8 bg-cream-200 rounded mb-6"></div>
              <div className="h-12 bg-cream-200 rounded mb-6"></div>
              <div className="h-64 bg-cream-200 rounded mb-6"></div>
              <div className="h-32 bg-cream-200 rounded"></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return notFound()
  }

  const spotsRemaining = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const isFull = spotsRemaining !== null && spotsRemaining <= 0

  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb navigation">
          <ol className="flex items-center space-x-2 text-sm text-dark-600">
            <li><Link href="/" className="hover:text-dark-800">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/events" className="hover:text-dark-800">Events</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-dark-800 font-medium" aria-current="page">{event.title}</span></li>
          </ol>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Event Header */}
          <div className="bg-cream-100 rounded-lg shadow-lg overflow-hidden border border-cream-200 mb-8">
            {event.coverImage && (
              <div className="h-64 md:h-80 bg-gradient-to-r from-teal-600 to-amber-600">
                <img
                  src={event.coverImage}
                  alt={`Cover image for ${event.title} - ${event.type} event`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-6" role="list" aria-label="Event tags">
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getTypeColor(event.type)}`} role="listitem">
                  {event.type}
                </span>
                {event.featured && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300" role="listitem">
                    Featured Event
                  </span>
                )}
                <span className="text-sm text-dark-600 bg-cream-200 px-3 py-1 rounded-full" role="listitem">
                  Duration: {calculateDuration(event.startTime, event.endTime)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4" id="event-title">
                {event.title}
              </h1>

              <p className="text-lg text-dark-700 leading-relaxed mb-6" id="event-description">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" aria-labelledby="event-details-heading">
                <h2 id="event-details-heading" className="sr-only">Event Details</h2>

                {/* Date & Time */}
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200" role="group" aria-labelledby="datetime-heading">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 id="datetime-heading" className="text-lg font-semibold text-dark-900">Date & Time</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-dark-700 font-medium" aria-label={`Event date: ${formatDate(event.startDate)}`}>{formatDate(event.startDate)}</p>
                    <p className="text-dark-600" aria-label={`Event time: ${formatTime(event.startTime)} to ${formatTime(event.endTime)}`}>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                    <p className="text-sm text-dark-500" aria-label={`Timezone: ${event.timezone}`}>Timezone: {event.timezone}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200" role="group" aria-labelledby="location-heading">
                  <div className="flex items-center mb-3">
                    {event.virtualLink ? (
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" title="Virtual event icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" title="Physical location icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    <h3 id="location-heading" className="text-lg font-semibold text-dark-900">Location</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-dark-700 font-medium" aria-label={`Event location: ${event.virtualLink ? 'Virtual Event' : (event.location || 'Location TBD')}`}>
                      {event.virtualLink ? 'Virtual Event' : (event.location || 'Location TBD')}
                    </p>
                    {event.virtualLink && (
                      <p className="text-sm text-dark-600">Join link will be provided after registration</p>
                    )}
                  </div>
                </div>

                {/* Organizer */}
                <div className="bg-cream-50 rounded-lg p-4 border border-cream-200" role="group" aria-labelledby="organizer-heading">
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" title="Organizer icon">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 id="organizer-heading" className="text-lg font-semibold text-dark-900">Organizer</h3>
                  </div>
                  <p className="text-dark-700 font-medium" aria-label={`Event organizer: ${event.organizer}`}>{event.organizer}</p>
                  <p className="text-sm text-dark-600">Event Coordinator</p>
                </div>

                {/* Registration Info */}
                {event.registrationRequired && (
                  <div className="bg-cream-50 rounded-lg p-4 border border-cream-200" role="group" aria-labelledby="registration-heading">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" title="Registration icon">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h3 id="registration-heading" className="text-lg font-semibold text-dark-900">Registration</h3>
                    </div>
                    <div className="space-y-2">
                      {event.maxAttendees && (
                        <p className="text-dark-700" aria-label={`${event.currentAttendees} of ${event.maxAttendees} people registered`}>
                          <span className="font-medium">{event.currentAttendees}</span> of <span className="font-medium">{event.maxAttendees}</span> registered
                        </p>
                      )}
                      {spotsRemaining !== null && (
                        <p className={`text-sm font-medium ${spotsRemaining <= 5 ? 'text-amber-600' : 'text-dark-600'}`} role={spotsRemaining <= 5 ? 'alert' : undefined} aria-live={spotsRemaining <= 5 ? 'polite' : undefined}>
                          {spotsRemaining > 0 ? `${spotsRemaining} spots remaining` : 'Event is full'}
                        </p>
                      )}
                      {event.registrationDeadline && (
                        <p className="text-sm text-dark-600" aria-label={`Registration deadline: ${formatDate(event.registrationDeadline)}`}>
                          Registration deadline: {formatDate(event.registrationDeadline)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* Tags */}
              {event.tags && (
                <section className="mb-8" aria-labelledby="topics-heading">
                  <h3 id="topics-heading" className="text-lg font-semibold text-dark-900 mb-3">Topics</h3>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Event topics">
                    {event.tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-cream-200 text-dark-700 text-sm px-3 py-1 rounded-full" role="listitem">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Registration Status Bar */}
              {event.registrationRequired && event.maxAttendees && (
                <section className="mb-8" aria-labelledby="registration-progress-heading">
                  <div className="flex items-center justify-between text-sm text-dark-600 mb-2">
                    <span id="registration-progress-heading">Registration Progress</span>
                    <span aria-label={`${event.currentAttendees} out of ${event.maxAttendees} people registered`}>{event.currentAttendees} / {event.maxAttendees} registered</span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-3" role="progressbar" aria-valuenow={event.currentAttendees} aria-valuemin={0} aria-valuemax={event.maxAttendees} aria-label="Registration progress">
                    <div
                      className="bg-gradient-to-r from-teal-600 to-amber-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                    ></div>
                  </div>
                </section>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="Event actions">
                {event.registrationRequired ? (
                  <button
                    onClick={handleRegisterClick}
                    className={`flex-1 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 ${
                      isFull
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-dark-900 text-cream-50 hover:bg-dark-800'
                    }`}
                    aria-describedby="event-title event-description"
                    aria-label={isFull ? `Join waiting list for ${event.title}` : `Register for ${event.title}`}
                  >
                    {isFull ? 'Join Waiting List' : 'Register for Event'}
                  </button>
                ) : (
                  <div className="flex-1 text-center py-4 text-dark-600 text-lg font-medium bg-cream-200 rounded-lg" role="status" aria-label="No registration required for this event">
                    No registration required - Just show up!
                  </div>
                )}

                <button className="px-6 py-4 border-2 border-dark-300 text-dark-800 rounded-lg hover:bg-cream-200 transition-colors duration-200 font-medium" aria-label={`Share ${event.title} event`}>
                  Share Event
                </button>
              </div>
            </div>
          </div>

          {/* Related Events Section */}
          <section className="mt-12" aria-labelledby="related-events-heading">
            <h2 id="related-events-heading" className="text-2xl font-bold text-dark-900 mb-6">More Events Like This</h2>
            <p className="text-dark-600">
              <Link href="/events" className="text-teal-600 hover:text-teal-700 underline" aria-label="Explore all upcoming events">
                Explore all upcoming events →
              </Link>
            </p>
          </section>
        </div>

        {/* Registration Modal */}
        {event && (
          <EventRegistrationModal
            event={event}
            isOpen={isRegistrationModalOpen}
            onClose={handleCloseModal}
            onSuccess={handleRegistrationSuccess}
          />
        )}
      </div>
    </div>
  )
}