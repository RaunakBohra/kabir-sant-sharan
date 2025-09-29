interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  description: string
}

const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Weekly Satsang',
    date: '2024-10-05',
    time: '6:00 PM',
    location: 'Community Hall',
    type: 'Satsang',
    description: 'Join us for weekly spiritual discourse and devotional singing'
  },
  {
    id: '2',
    title: 'Kabir Jayanti Celebration',
    date: '2024-10-15',
    time: '10:00 AM',
    location: 'Main Temple',
    type: 'Festival',
    description: 'Special celebration marking the birth anniversary of Sant Kabir Das'
  },
  {
    id: '3',
    title: 'Meditation Workshop',
    date: '2024-10-12',
    time: '7:00 AM',
    location: 'Meditation Garden',
    type: 'Workshop',
    description: 'Learn traditional meditation techniques inspired by Kabir\'s teachings'
  }
]

export function UpcomingEvents() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-16 bg-cream-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-dark-600 max-w-2xl mx-auto">
            Join our spiritual community in celebrating and learning through various events and gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEvents.map((event) => (
            <div key={event.id} className="bg-cream-50 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-dark-600 bg-cream-200 px-3 py-1 rounded-full">
                    {event.type}
                  </span>
                  <span className="text-sm text-dark-500">
                    {event.time}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-dark-900 mb-2">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-dark-700 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-dark-700 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>

                <p className="text-dark-700 text-sm leading-relaxed mb-4">
                  {event.description}
                </p>

                <button className="w-full px-4 py-2 bg-dark-900 text-cream-50 rounded-md hover:bg-dark-800 transition-colors duration-200 text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="inline-flex items-center px-8 py-3 border border-dark-300 text-dark-800 font-medium rounded-md hover:bg-cream-200 transition-colors duration-200">
            View All Events
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}