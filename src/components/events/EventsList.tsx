interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: string
  duration: string
  capacity?: string
  registeredCount?: number
  image?: string
}

const sampleDetailedEvents: Event[] = [
  {
    id: '1',
    title: 'Weekly Satsang - Divine Devotion',
    description: 'Join us for our weekly spiritual gathering where we come together to sing devotional songs, share spiritual insights, and meditate in the presence of Sant Kabir\'s teachings. This is a beautiful opportunity to connect with like-minded souls on the spiritual path.',
    date: '2024-10-05',
    time: '6:00 PM',
    location: 'Community Hall, Kabir Sant Sharan',
    type: 'Satsang',
    duration: '2 hours',
    capacity: '100 people',
    registeredCount: 67
  },
  {
    id: '2',
    title: 'Kabir Jayanti Celebration',
    description: 'A grand celebration marking the birth anniversary of Sant Kabir Das. The day will include spiritual discourses, kirtan, cultural programs, and community feast. Special guests will share insights into Kabir\'s revolutionary teachings and their relevance in modern times.',
    date: '2024-10-15',
    time: '10:00 AM',
    location: 'Main Temple Complex',
    type: 'Festival',
    duration: 'Full day',
    capacity: '500 people',
    registeredCount: 234
  },
  {
    id: '3',
    title: 'Introduction to Kabir\'s Meditation',
    description: 'Learn the simple yet profound meditation techniques inspired by Sant Kabir\'s teachings. This workshop will guide you through the practice of inner contemplation and connecting with the divine presence within. Suitable for beginners and experienced practitioners alike.',
    date: '2024-10-12',
    time: '7:00 AM',
    location: 'Meditation Garden',
    type: 'Workshop',
    duration: '3 hours',
    capacity: '30 people',
    registeredCount: 18
  },
  {
    id: '4',
    title: 'Community Satsang & Discussion',
    description: 'An intimate gathering focused on discussing Kabir\'s dohas and their practical application in daily life. Participants are encouraged to share their experiences and insights. Light refreshments will be served after the session.',
    date: '2024-10-19',
    time: '7:00 PM',
    location: 'Community Hall',
    type: 'Satsang',
    duration: '1.5 hours',
    capacity: '50 people',
    registeredCount: 23
  },
  {
    id: '5',
    title: 'Kirtan Evening - Songs of Devotion',
    description: 'Experience the joy of devotional singing with traditional and contemporary interpretations of Kabir\'s bhajans. All are welcome to participate in this soul-stirring musical journey that opens the heart to divine love.',
    date: '2024-10-26',
    time: '6:30 PM',
    location: 'Main Hall',
    type: 'Satsang',
    duration: '2.5 hours',
    capacity: '150 people',
    registeredCount: 89
  },
  {
    id: '6',
    title: 'Study Circle - Philosophy of Unity',
    description: 'Deep dive into Kabir\'s revolutionary teachings on religious unity and social harmony. This study session will explore his critique of orthodox practices and his vision of universal spirituality. Bring your questions and insights to share.',
    date: '2024-11-02',
    time: '4:00 PM',
    location: 'Study Room',
    type: 'Workshop',
    duration: '2 hours',
    capacity: '25 people',
    registeredCount: 12
  }
]

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
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800'
  }
}

export function EventsList() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">Upcoming Events</h2>

      <div className="space-y-6">
        {sampleDetailedEvents.map((event) => (
          <div key={event.id} className="bg-cream-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-cream-200">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                {/* Main Content */}
                <div className="flex-1 md:mr-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-dark-500">
                      {event.duration}
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
                        <div className="font-medium">{formatDate(event.date)}</div>
                        <div className="text-sm text-dark-600">{event.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-dark-700">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="font-medium">{event.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Info */}
                  {event.capacity && event.registeredCount !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-dark-600 mb-2">
                        <span>Registration Status</span>
                        <span>{event.registeredCount} of {event.capacity}</span>
                      </div>
                      <div className="w-full bg-cream-200 rounded-full h-2">
                        <div
                          className="bg-dark-700 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((event.registeredCount / parseInt(event.capacity)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3 md:min-w-[200px]">
                  <button className="bg-dark-900 text-cream-50 px-6 py-3 rounded-md hover:bg-dark-800 transition-colors duration-200 font-medium">
                    Register Now
                  </button>
                  <button className="border border-dark-300 text-dark-800 px-6 py-3 rounded-md hover:bg-cream-200 transition-colors duration-200 font-medium">
                    View Details
                  </button>
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

      {/* Load More */}
      <div className="text-center mt-12">
        <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-8 py-3 rounded-md transition-colors duration-200 font-medium">
          Load More Events
        </button>
      </div>
    </div>
  )
}