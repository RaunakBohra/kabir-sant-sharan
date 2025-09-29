'use client'

import { useState } from 'react'

interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: string
  color: string
}

const sampleEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Weekly Satsang',
    date: '2024-10-05',
    time: '6:00 PM',
    type: 'Satsang',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  {
    id: '2',
    title: 'Kabir Jayanti',
    date: '2024-10-15',
    time: '10:00 AM',
    type: 'Festival',
    color: 'bg-orange-100 border-orange-300 text-orange-800'
  },
  {
    id: '3',
    title: 'Meditation Workshop',
    date: '2024-10-12',
    time: '7:00 AM',
    type: 'Workshop',
    color: 'bg-green-100 border-green-300 text-green-800'
  },
  {
    id: '4',
    title: 'Community Satsang',
    date: '2024-10-19',
    time: '7:00 PM',
    type: 'Satsang',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  }
]

export function EventsCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of the month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

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
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return sampleEvents.filter(event => event.date === dateString)
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-cream-100 rounded-lg shadow-lg p-6 border border-cream-200">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-cream-200 rounded-md transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-dark-900">
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-cream-200 rounded-md transition-colors duration-200"
        >
          <svg className="w-5 h-5 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {dayNames.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-semibold text-dark-600 bg-cream-200 rounded">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDay }, (_, index) => (
          <div key={`empty-${index}`} className="p-2 h-24"></div>
        ))}

        {/* Calendar Days */}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const events = getEventsForDate(day)
          const isToday = new Date().getDate() === day &&
                         new Date().getMonth() === currentMonth &&
                         new Date().getFullYear() === currentYear

          return (
            <div
              key={day}
              className={`p-2 h-24 border border-cream-200 hover:bg-cream-50 cursor-pointer transition-colors duration-200 ${
                isToday ? 'bg-dark-100 border-dark-300' : 'bg-cream-50'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isToday ? 'text-dark-900 font-bold' : 'text-dark-700'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {events.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 transition-opacity duration-200 ${event.color}`}
                  >
                    <div className="truncate font-medium">{event.title}</div>
                    <div className="truncate">{event.time}</div>
                  </div>
                ))}
                {events.length > 2 && (
                  <div className="text-xs text-dark-500 font-medium">
                    +{events.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-cream-300">
        <h3 className="text-sm font-semibold text-dark-700 mb-3">Event Types</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-sm text-dark-700">Satsang</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
            <span className="text-sm text-dark-700">Festival</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-sm text-dark-700">Workshop</span>
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-cream-50 rounded-lg p-6 max-w-md mx-4 shadow-xl border border-cream-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-dark-900">{selectedEvent.title}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-dark-500 hover:text-dark-800 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-dark-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedEvent.date} at {selectedEvent.time}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedEvent.color}`}>
                  {selectedEvent.type}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="bg-dark-900 text-cream-50 px-4 py-2 rounded hover:bg-dark-800 transition-colors duration-200">
                Register
              </button>
              <button className="border border-dark-300 text-dark-700 px-4 py-2 rounded hover:bg-cream-200 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}