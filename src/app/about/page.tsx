import { Metadata } from 'next'
import Link from 'next/link'
import { AboutTabs } from '@/components/about/AboutTabs'

export const metadata: Metadata = {
  title: 'About Us | Kabir Sant Sharan',
  description: 'Learn about our spiritual community dedicated to preserving and sharing the timeless wisdom of Sant Kabir Das through teachings, satsang, and service.',
  openGraph: {
    title: 'About Us | Kabir Sant Sharan',
    description: 'A spiritual community dedicated to Sant Kabir\'s teachings',
    type: 'website',
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cream-100 to-amber-50 border-b border-cream-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              About Kabir Sant Sharan
            </h1>
            <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-3xl mx-auto">
              A spiritual sanctuary dedicated to preserving and sharing the timeless wisdom
              of Sant Kabir Das, fostering unity, devotion, and self-realization.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <AboutTabs />

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <p className="text-dark-700 leading-relaxed mb-6">
                  Kabir Sant Sharan was founded with a sacred vision: to create a spiritual home where
                  seekers from all walks of life could come together to explore the profound teachings
                  of Sant Kabir Das. Our journey began with a small group of devoted followers who
                  recognized the universal relevance of Kabir's message of love, unity, and truth.
                </p>
                <p className="text-dark-700 leading-relaxed mb-6">
                  Over the years, our community has grown into a vibrant spiritual family, united by
                  our commitment to living according to Kabir's teachings. We believe that his wisdom
                  transcends boundaries of religion, caste, and creed, offering a path to divine
                  realization that is accessible to all sincere seekers.
                </p>
                <p className="text-dark-700 leading-relaxed">
                  Today, Kabir Sant Sharan serves as a beacon of spiritual light, offering guidance,
                  community, and support to those on the path of self-discovery and devotion.
                </p>
              </div>
            </div>
          </div>

          {/* Our Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 shadow-md border border-teal-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-dark-900">Our Mission</h3>
              </div>
              <ul className="space-y-3 text-dark-700">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Preserve and propagate Sant Kabir's teachings</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Foster spiritual growth and self-realization</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Build an inclusive spiritual community</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Serve humanity through devotion and compassion</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 shadow-md border border-amber-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-dark-900">Our Vision</h3>
              </div>
              <p className="text-dark-700 leading-relaxed mb-4">
                To create a world where Sant Kabir's message of universal love, truth, and oneness
                inspires millions to transcend divisions and discover the divine within themselves
                and all beings.
              </p>
              <p className="text-dark-700 leading-relaxed">
                We envision our community as a living embodiment of Kabir's ideals, where spiritual
                practice, social harmony, and selfless service come together to uplift humanity.
              </p>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Unity in Diversity</h4>
                <p className="text-dark-600">
                  Embracing all beings as expressions of the divine, transcending boundaries of religion and caste.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Truth & Authenticity</h4>
                <p className="text-dark-600">
                  Living truthfully and encouraging genuine spiritual practice over empty rituals.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Compassionate Service</h4>
                <p className="text-dark-600">
                  Serving humanity with love and compassion, seeing the divine in all.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Spiritual Education</h4>
                <p className="text-dark-600">
                  Sharing wisdom through teachings, satsang, and guided spiritual practice.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Humility & Simplicity</h4>
                <p className="text-dark-600">
                  Practicing humility and living simply, following Kabir's path of renunciation.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-dark-900 mb-2">Inner Transformation</h4>
                <p className="text-dark-600">
                  Focusing on inner spiritual development rather than external appearances.
                </p>
              </div>
            </div>
          </div>

          {/* What We Do */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              What We Do
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <h4 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-3 text-cream-50 text-lg">1</span>
                  Regular Satsang & Spiritual Gatherings
                </h4>
                <p className="text-dark-700 leading-relaxed">
                  We organize weekly satsang sessions where devotees come together to sing bhajans,
                  share spiritual insights, and deepen their understanding of Kabir's teachings.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <h4 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-3 text-cream-50 text-lg">2</span>
                  Spiritual Education & Workshops
                </h4>
                <p className="text-dark-700 leading-relaxed">
                  We offer classes, workshops, and study circles focused on Kabir's dohas, bhajans,
                  and the practical application of his teachings in daily life.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <h4 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 text-cream-50 text-lg">3</span>
                  Community Service & Outreach
                </h4>
                <p className="text-dark-700 leading-relaxed">
                  Following Kabir's emphasis on service, we engage in community welfare activities
                  including food distribution, education support, and assistance to the needy.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <h4 className="text-xl font-bold text-dark-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3 text-cream-50 text-lg">4</span>
                  Preservation of Sacred Texts & Media
                </h4>
                <p className="text-dark-700 leading-relaxed">
                  We work to preserve and digitize Kabir's teachings through recordings, translations,
                  and publications, making them accessible to seekers worldwide.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-teal-50 via-amber-50 to-teal-50 rounded-xl p-12 text-center shadow-lg border border-cream-200">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Join Our Spiritual Journey
            </h2>
            <p className="text-lg text-dark-700 mb-8 max-w-2xl mx-auto">
              Whether you're a longtime devotee or new to Sant Kabir's teachings, we welcome you
              to join our community and walk the path of truth, love, and self-realization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="inline-flex items-center px-8 py-4 bg-teal-600 text-cream-50 font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md"
              >
                Upcoming Events
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-dark-900 font-semibold rounded-lg hover:bg-cream-100 transition-colors shadow-md border border-cream-300"
              >
                Contact Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links to Other About Pages */}
      <section className="py-16 bg-gradient-to-br from-cream-100 to-teal-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">
            Learn More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/about/ashram"
              className="bg-white rounded-xl p-8 shadow-md border border-cream-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-teal-600 transition-colors">
                  <svg className="w-6 h-6 text-teal-600 group-hover:text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">About Our Ashram</h3>
                  <p className="text-dark-600">
                    Discover the history, facilities, and spiritual atmosphere of Kabir Sant Satsang Mandir.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/about/sant-kabir"
              className="bg-white rounded-xl p-8 shadow-md border border-cream-200 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-amber-600 transition-colors">
                  <svg className="w-6 h-6 text-amber-600 group-hover:text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900 mb-2">About Sant Kabir Das</h3>
                  <p className="text-dark-600">
                    Learn about the life, teachings, and enduring legacy of the great mystic poet Sant Kabir.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}