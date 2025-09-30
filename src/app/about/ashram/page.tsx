import { Metadata } from 'next'
import Link from 'next/link'
import { AboutTabs } from '@/components/about/AboutTabs'

export const metadata: Metadata = {
  title: 'About Our Ashram | Kabir Sant Sharan',
  description: 'Discover Kabir Sant Satsang Mandir - a sacred spiritual sanctuary in Lalitpur, Nepal, dedicated to the teachings of Sant Kabir Das.',
  openGraph: {
    title: 'About Our Ashram | Kabir Sant Sharan',
    description: 'A sacred spiritual sanctuary in Lalitpur, Nepal',
    type: 'website',
  }
}

export default function AshramPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-50 via-cream-100 to-amber-50 border-b border-cream-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              Kabir Sant Satsang Mandir
            </h1>
            <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-3xl mx-auto mb-6">
              A sacred sanctuary where devotees gather to immerse themselves in the divine
              teachings of Sant Kabir Das through satsang, meditation, and spiritual fellowship.
            </p>
            <div className="flex items-center justify-center space-x-2 text-dark-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Jhamsikhel - 3, Lalitpur, Nepal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <AboutTabs />

      {/* About the Ashram */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Welcome to Our Spiritual Home
            </h2>
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-md border border-cream-200">
              <p className="text-dark-700 text-lg leading-relaxed mb-6">
                Nestled in the heart of Jhamsikhel, Lalitpur, the Kabir Sant Satsang Mandir stands
                as a beacon of spiritual light, welcoming seekers from all walks of life. Our ashram
                is more than just a physical space—it is a living embodiment of Sant Kabir's timeless
                message of love, unity, and divine realization.
              </p>
              <p className="text-dark-700 text-lg leading-relaxed mb-6">
                Founded by devoted followers who felt the calling to create a dedicated space for
                spiritual practice and community, our mandir has grown into a vibrant center where
                ancient wisdom meets modern aspirations. Every corner of our ashram resonates with
                the divine energy of devotion, making it an ideal place for contemplation, worship,
                and spiritual growth.
              </p>
              <p className="text-dark-700 text-lg leading-relaxed">
                Whether you come for daily satsang, special festivals, or personal spiritual guidance,
                you will find an atmosphere of warmth, acceptance, and profound spiritual depth. Our
                doors are always open to those seeking truth and divine connection.
              </p>
            </div>
          </div>

          {/* Facilities & Spaces */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Sacred Spaces
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-md border border-teal-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Main Satsang Hall</h3>
                    <p className="text-dark-700">
                      A spacious hall with beautiful acoustics, perfect for group satsang, bhajan
                      singing, and spiritual discourses. The hall can accommodate up to 200 devotees.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-md border border-amber-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Meditation Room</h3>
                    <p className="text-dark-700">
                      A serene, quiet space designed for individual and group meditation practice,
                      featuring comfortable seating and a peaceful ambiance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-md border border-teal-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Spiritual Library</h3>
                    <p className="text-dark-700">
                      An extensive collection of sacred texts, including Kabir's dohas, bhajans, and
                      commentaries, available for study and contemplation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-md border border-amber-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Community Dining Area</h3>
                    <p className="text-dark-700">
                      A communal langar (free kitchen) where devotees share simple, sattvic meals
                      together, embodying the spirit of equality and service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-md border border-teal-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Guest Rooms</h3>
                    <p className="text-dark-700">
                      Simple, clean accommodations for visiting devotees and guests who wish to
                      immerse themselves in extended spiritual practice.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-md border border-amber-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-2">Peaceful Gardens</h3>
                    <p className="text-dark-700">
                      Beautifully maintained gardens with seating areas, perfect for quiet reflection,
                      reading, and connecting with nature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Daily Schedule
            </h2>
            <div className="bg-white rounded-xl shadow-md border border-cream-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-teal-600 to-amber-600 text-cream-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">Time</th>
                      <th className="px-6 py-4 text-left font-semibold">Activity</th>
                      <th className="px-6 py-4 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200">
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">5:00 AM - 6:00 AM</td>
                      <td className="px-6 py-4 text-dark-700">Morning Meditation</td>
                      <td className="px-6 py-4 text-dark-600">Guided meditation and pranayama</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">6:00 AM - 7:00 AM</td>
                      <td className="px-6 py-4 text-dark-700">Morning Aarti & Bhajan</td>
                      <td className="px-6 py-4 text-dark-600">Devotional songs and prayers</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">7:00 AM - 8:00 AM</td>
                      <td className="px-6 py-4 text-dark-700">Breakfast Langar</td>
                      <td className="px-6 py-4 text-dark-600">Community breakfast</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">10:00 AM - 11:00 AM</td>
                      <td className="px-6 py-4 text-dark-700">Kabir Vani Study</td>
                      <td className="px-6 py-4 text-dark-600">Study and discussion of Kabir's teachings</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">12:00 PM - 1:00 PM</td>
                      <td className="px-6 py-4 text-dark-700">Lunch Langar</td>
                      <td className="px-6 py-4 text-dark-600">Community lunch</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">5:00 PM - 6:30 PM</td>
                      <td className="px-6 py-4 text-dark-700">Evening Satsang</td>
                      <td className="px-6 py-4 text-dark-600">Main satsang with bhajan and discourse</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">7:00 PM - 8:00 PM</td>
                      <td className="px-6 py-4 text-dark-700">Dinner Langar</td>
                      <td className="px-6 py-4 text-dark-600">Community dinner</td>
                    </tr>
                    <tr className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-dark-900">8:00 PM - 9:00 PM</td>
                      <td className="px-6 py-4 text-dark-700">Night Prayer</td>
                      <td className="px-6 py-4 text-dark-600">Closing prayers and meditation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-cream-50 px-6 py-4 text-sm text-dark-600 border-t border-cream-200">
                <p>* Schedule may vary on special festival days and occasions. Please check our events calendar.</p>
              </div>
            </div>
          </div>

          {/* Special Programs */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Special Programs & Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-3">Weekly Satsang</h4>
                <p className="text-dark-600 mb-2">Every Saturday</p>
                <p className="text-sm text-dark-600">
                  Extended evening satsang with special bhajans, katha, and communal prasad
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-3">Kabir Jayanti</h4>
                <p className="text-dark-600 mb-2">Annual Celebration</p>
                <p className="text-sm text-dark-600">
                  Grand three-day festival celebrating Sant Kabir's birth with special programs
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-3">Spiritual Workshops</h4>
                <p className="text-dark-600 mb-2">Monthly</p>
                <p className="text-sm text-dark-600">
                  Deep-dive sessions on meditation, bhajan singing, and applying Kabir's wisdom
                </p>
              </div>
            </div>
          </div>

          {/* Visiting Information */}
          <div className="bg-gradient-to-r from-teal-50 via-amber-50 to-teal-50 rounded-xl p-8 md:p-12 shadow-lg border border-cream-200">
            <h2 className="text-3xl font-bold text-dark-900 mb-6 text-center">
              Visit Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Address
                </h3>
                <p className="text-dark-700 mb-2">Kabir Sant Satsang Mandir</p>
                <p className="text-dark-600">Jhamsikhel - 3, Lalitpur, Nepal</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Contact
                </h3>
                <p className="text-dark-700 mb-1">
                  <a href="tel:+97715450429" className="hover:text-teal-600 transition-colors">
                    +977 1 545 0429
                  </a>
                </p>
                <p className="text-dark-700">
                  <a href="tel:+977984005210" className="hover:text-teal-600 transition-colors">
                    +977 984 005 210
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-dark-700 mb-4">
                All are welcome to visit our ashram. No prior appointment necessary for attending satsang.
                For extended stays or special arrangements, please contact us in advance.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-teal-600 text-cream-50 font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md"
              >
                Get Directions
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}