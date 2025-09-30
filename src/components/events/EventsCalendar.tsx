'use client'

import React, { useState, useEffect } from 'react'
import NepaliDate from 'nepali-date-converter'

interface CalendarEvent {
  id: string
  title: string
  startDate: string
  startTime: string
  type: string
  slug: string
  featured: boolean
  maxAttendees?: number
  currentAttendees: number
  registrationRequired: boolean
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

interface EventsCalendarProps {
  // No filters needed - show all events
}

export function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [calendarType, setCalendarType] = useState<'AD' | 'BS'>('AD')
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Get current month and year based on calendar type
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Convert to Nepali date if BS is selected
  let nepaliDate: NepaliDate | null = null
  let displayMonth = currentMonth
  let displayYear = currentYear
  let firstDay = new Date(currentYear, currentMonth, 1).getDay()
  let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  if (calendarType === 'BS') {
    try {
      nepaliDate = new NepaliDate(currentDate)
      displayMonth = nepaliDate.getMonth()
      displayYear = nepaliDate.getYear()

      // Calculate first day and days in month for BS calendar
      const firstDayBS = new NepaliDate(displayYear, displayMonth, 1)
      const firstDayAD = firstDayBS.toJsDate()
      firstDay = firstDayAD.getDay()

      // Get days in BS month (varies by month and year)
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear
      const lastDayBS = new NepaliDate(nextYear, nextMonth, 1)
      const lastDayBSAD = lastDayBS.toJsDate()
      lastDayBSAD.setDate(lastDayBSAD.getDate() - 1)
      const lastDayBSNepali = new NepaliDate(lastDayBSAD)
      daysInMonth = lastDayBSNepali.getDate()
    } catch (error) {
      console.error('Error converting to Nepali date:', error)
      // Fallback to AD
      displayMonth = currentMonth
      displayYear = currentYear
      firstDay = new Date(currentYear, currentMonth, 1).getDay()
      daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    }
  }

  // Fetch events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const url = `/api/events/`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          // Transform API response to match component interface
          const transformedEvents = (data.events || []).map((event: any) => ({
            id: event.id,
            title: event.title,
            startDate: event.startDate || '',
            startTime: event.startTime || '00:00',
            type: event.type || 'general',
            slug: event.slug || event.id,
            featured: event.featured || false,
            maxAttendees: event.maxAttendees,
            currentAttendees: event.currentAttendees || 0,
            registrationRequired: event.registrationRequired || false
          }))
          setEvents(transformedEvents)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Previous and next month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  // Get events for a specific date
  const getEventsForDate = (day: number): CalendarEvent[] => {
    if (calendarType === 'BS') {
      try {
        // Convert BS date to AD for comparison
        const bsDate = new NepaliDate(displayYear, displayMonth, day)
        const adDate = bsDate.toJsDate()
        const dateString = `${adDate.getFullYear()}-${String(adDate.getMonth() + 1).padStart(2, '0')}-${String(adDate.getDate()).padStart(2, '0')}`
        return events.filter(event => event.startDate && event.startDate.startsWith(dateString))
      } catch (error) {
        return []
      }
    } else {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return events.filter(event => event.startDate && event.startDate.startsWith(dateString))
    }
  }

  const monthNamesAD = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const monthNamesBS = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const currentMonthName = calendarType === 'BS' ? monthNamesBS[displayMonth] : monthNamesAD[displayMonth]

  // Get featured events for carousel
  const featuredEvents = events.filter(e => e.featured).slice(0, 3)

  // Handle touch swipe for mobile
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      navigateMonth('next')
    } else if (isRightSwipe) {
      navigateMonth('prev')
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-dark-900"></div>
            <p className="text-dark-600 font-medium">Loading events...</p>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Featured Events Carousel */}
          {featuredEvents.length > 0 && (
            <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-lg shadow-lg p-4 sm:p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-cream-50 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured Events
                </h3>
                <span className="text-xs text-cream-300 bg-dark-700 px-2 py-1 rounded-full">
                  {featuredEvents.length} {featuredEvents.length === 1 ? 'event' : 'events'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredEvents.map((event) => {
                  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
                  const isAlmostFull = spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0
                  const isFull = spotsLeft !== null && spotsLeft <= 0

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="bg-cream-50 rounded-lg p-4 border-2 border-cream-200 hover:shadow-lg hover:border-dark-900 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${getTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        {isAlmostFull && !isFull && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full border border-amber-300 animate-pulse font-semibold">
                            {spotsLeft} left!
                          </span>
                        )}
                        {isFull && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full border border-red-300 font-semibold">
                            Full
                          </span>
                        )}
                      </div>
                  <h4 className="font-bold text-dark-900 mb-2 group-hover:text-dark-700 transition-colors line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="space-y-1 text-sm text-dark-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.startTime}
                    </div>
                  </div>
                      <button className="mt-3 w-full bg-dark-900 text-cream-50 py-2 rounded-lg hover:bg-dark-800 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

      {/* Mobile Swipe Hint */}
      <div className="sm:hidden bg-cream-100 rounded-lg p-3 mb-4 border border-cream-300">
        <div className="flex items-center text-xs text-dark-600">
          <svg className="w-4 h-4 mr-2 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span>Swipe left or right to change months</span>
        </div>
      </div>

      {/* Calendar */}
      <div
        className="bg-cream-50 rounded-lg shadow-md p-3 sm:p-4 lg:p-6 border border-cream-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
      {/* Calendar Header with AD/BS Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-cream-100 rounded-md transition-colors duration-200 touch-manipulation"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5 text-dark-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-lg sm:text-2xl font-bold text-dark-900">
            {currentMonthName} {displayYear}
          </h2>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="hidden sm:block text-xs px-3 py-1 bg-cream-100 hover:bg-cream-200 rounded-md text-dark-700 font-medium transition-colors"
          >
            Today
          </button>

          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-cream-100 rounded-md transition-colors duration-200 touch-manipulation"
            aria-label="Next month"
          >
            <svg className="w-5 h-5 text-dark-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* AD/BS Toggle */}
        <div className="flex items-center bg-cream-100 rounded-lg p-1 border border-cream-300">
          <button
            onClick={() => setCalendarType('AD')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              calendarType === 'AD'
                ? 'bg-dark-900 text-cream-50 shadow-sm'
                : 'text-dark-700 hover:bg-cream-200'
            }`}
          >
            AD
          </button>
          <button
            onClick={() => setCalendarType('BS')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              calendarType === 'BS'
                ? 'bg-dark-900 text-cream-50 shadow-sm'
                : 'text-dark-700 hover:bg-cream-200'
            }`}
          >
            BS
          </button>
        </div>
      </div>

      {/* Empty State */}
      {!loading && events.length === 0 && (
        <div className="text-center py-12 bg-cream-100 rounded-lg border-2 border-dashed border-cream-300">
          <svg className="w-16 h-16 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-dark-700 mb-2">No Events Scheduled</h3>
          <p className="text-dark-500 text-sm">Check back later for upcoming spiritual gatherings and events.</p>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-semibold text-dark-700 bg-cream-100 rounded">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.substring(0, 1)}</span>
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }, (_, index) => (
          <div key={`empty-${index}`} className="p-1 sm:p-2 h-20 sm:h-24"></div>
        ))}

        {/* Calendar Days */}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const events = getEventsForDate(day)

          // Check if today - handle both AD and BS calendars
          let isToday = false
          const today = new Date()
          if (calendarType === 'AD') {
            isToday = today.getDate() === day &&
                     today.getMonth() === currentMonth &&
                     today.getFullYear() === currentYear
          } else {
            try {
              const todayBS = new NepaliDate(today)
              isToday = todayBS.getDate() === day &&
                       todayBS.getMonth() === displayMonth &&
                       todayBS.getYear() === displayYear
            } catch (error) {
              isToday = false
            }
          }

          return (
            <div
              key={day}
              className={`p-1 sm:p-2 h-20 sm:h-24 border rounded transition-all duration-200 ${
                isToday
                  ? 'bg-dark-900 text-cream-50 border-dark-900 shadow-md ring-2 ring-dark-700 ring-offset-1'
                  : events.length > 0
                  ? 'bg-white border-cream-300 hover:bg-cream-50 hover:shadow-sm cursor-pointer'
                  : 'bg-white border-cream-200 hover:bg-cream-50'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-cream-50 font-bold' : 'text-dark-700'}`}>
                {day}
              </div>
              <div className="space-y-0.5 sm:space-y-1 overflow-hidden">
                {events.slice(0, 2).map((event) => {
                  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
                  const isAlmostFull = spotsLeft !== null && spotsLeft <= 5 && spotsLeft > 0
                  const isFull = spotsLeft !== null && spotsLeft <= 0

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                      }}
                      className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded border cursor-pointer hover:scale-105 hover:shadow-sm transition-all duration-150 relative ${getTypeColor(event.type)}`}
                      title={`${event.title} at ${event.startTime}`}
                    >
                      <div className="truncate font-medium leading-tight">{event.title}</div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-[9px] sm:text-[10px]">{event.startTime}</span>
                        {event.registrationRequired && (
                          <>
                            {isFull && (
                              <span className="text-[8px] sm:text-[10px] bg-red-500 text-white px-0.5 sm:px-1 rounded font-bold">Full</span>
                            )}
                            {isAlmostFull && !isFull && (
                              <span className="text-[8px] sm:text-[10px] bg-amber-500 text-white px-0.5 sm:px-1 rounded font-bold whitespace-nowrap">{spotsLeft}</span>
                            )}
                            {event.featured && !isFull && !isAlmostFull && (
                              <svg className="w-2 h-2 sm:w-3 sm:h-3 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
                {events.length > 2 && (
                  <div className="text-[10px] sm:text-xs text-dark-500 font-semibold px-1 cursor-pointer hover:text-dark-700">
                    +{events.length - 2}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-cream-300">
        <h3 className="text-sm font-semibold text-dark-800 mb-3">Event Types</h3>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-100 border border-blue-300 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-dark-700 font-medium">Satsang</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-100 border border-orange-300 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-dark-700 font-medium">Festival</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-100 border border-green-300 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-dark-700 font-medium">Workshop</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-100 border border-purple-300 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-dark-700 font-medium">Meditation</span>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Enhanced Event Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-cream-50 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl border border-cream-200 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-4">
                <h3 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">{selectedEvent.title}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  {selectedEvent.featured && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full border border-amber-300 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-dark-500 hover:text-dark-800 transition-colors duration-200 flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Date and Time */}
              <div className="flex items-start space-x-3 text-dark-700">
                <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-medium">
                    {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="text-sm text-dark-600">at {selectedEvent.startTime}</div>
                </div>
              </div>

              {/* Registration Status */}
              {selectedEvent.registrationRequired && (
                <div className="flex items-start space-x-3 text-dark-700">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="flex-1">
                    {selectedEvent.maxAttendees ? (
                      <>
                        <div className="font-medium">
                          {selectedEvent.currentAttendees} / {selectedEvent.maxAttendees} Registered
                        </div>
                        <div className="text-sm text-dark-600">
                          {selectedEvent.maxAttendees - selectedEvent.currentAttendees > 0 ? (
                            <span className="text-teal-600">
                              {selectedEvent.maxAttendees - selectedEvent.currentAttendees} spots available
                            </span>
                          ) : (
                            <span className="text-red-600">Event is full</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="font-medium">Open registration</div>
                    )}
                  </div>
                </div>
              )}

              {/* Time Until Event */}
              <div className="bg-cream-100 border border-cream-300 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-dark-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">
                    {(() => {
                      const eventDate = new Date(selectedEvent.startDate)
                      const now = new Date()
                      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

                      if (diffDays < 0) return 'Event has passed'
                      if (diffDays === 0) return 'Event is today!'
                      if (diffDays === 1) return 'Event is tomorrow'
                      if (diffDays <= 7) return `Event in ${diffDays} days`
                      return `Event in ${Math.ceil(diffDays / 7)} weeks`
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = `/events/${selectedEvent.slug}`}
                className="flex-1 bg-dark-900 text-cream-50 px-6 py-3 rounded-lg hover:bg-dark-800 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Register Now</span>
              </button>
              <button
                onClick={() => window.location.href = `/events/${selectedEvent.slug}`}
                className="flex-1 border-2 border-dark-900 text-dark-900 px-6 py-3 rounded-lg hover:bg-dark-900 hover:text-cream-50 transition-colors duration-200 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}