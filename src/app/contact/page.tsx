import { Metadata } from 'next'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Kabir Sant Sharan',
  description: 'Connect with our spiritual community. Reach out for spiritual guidance, event inquiries, or to join our community of seekers following Sant Kabir\'s teachings.',
  openGraph: {
    title: 'Contact Us | Kabir Sant Sharan',
    description: 'Connect with our spiritual community for guidance and support',
    type: 'website',
  }
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cream-100 to-amber-50 border-b border-cream-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
              Connect With Us
            </h1>
            <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-2xl mx-auto">
              We welcome seekers on the spiritual path. Whether you have questions about Sant Kabir's teachings,
              want to join our community, or need guidance, we're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Information Cards */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">Email</h3>
                  <a href="mailto:saheb@kabirsantsharan.com" className="text-teal-600 hover:text-teal-700 font-medium">
                    saheb@kabirsantsharan.com
                  </a>
                  <p className="text-sm text-dark-600 mt-2">
                    For general inquiries and spiritual guidance
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">WhatsApp</h3>
                  <a href="https://wa.me/977984005210" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-medium block">
                    +977 984 005 210
                  </a>
                  <p className="text-sm text-dark-600 mt-2">
                    Quick questions and event updates
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-900 mb-2">Location</h3>
                  <p className="text-dark-700 font-medium">
                    Kabir Sant Satsang Mandir
                  </p>
                  <p className="text-sm text-dark-600">
                    Jhamsikhel - 3, Lalitpur, Nepal
                  </p>
                  <div className="flex flex-col space-y-1 mt-2 text-sm text-dark-600">
                    <a href="tel:+97715450429" className="hover:text-teal-600 transition-colors">
                      +977 1 545 0429
                    </a>
                    <a href="tel:+977984005210" className="hover:text-teal-600 transition-colors">
                      +977 984 005 210
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-xl p-8 mb-12 border border-cream-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-dark-900 mb-2">
                Follow Our Journey
              </h2>
              <p className="text-dark-700">
                Join our community on social media for daily wisdom and updates
              </p>
            </div>
            <div className="flex justify-center space-x-6">
              <a
                href="https://facebook.com/kabirsantsharan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/kabirsantsharan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/kabirsantsharan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@kabirsantsharan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                aria-label="YouTube"
              >
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />

          {/* Google Maps Embed */}
          <div className="mt-12 bg-white rounded-xl shadow-md border border-cream-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-teal-50 to-amber-50 border-b border-cream-200">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Visit Our Spiritual Center</h3>
                  <p className="text-dark-700">Kabir Sant Satsang Mandir</p>
                  <p className="text-sm text-dark-600">Jhamsikhel - 3, Lalitpur, Nepal</p>
                </div>
              </div>
            </div>
            <div className="relative h-96 w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.0666846869284!2d85.30940157072554!3d27.678560379277965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1834348da59b%3A0xb6527caba750b50!2z4KSV4KSs4KWA4KSwIOCkuOCkqOCljeCkpCDgpLjgpKTgpY3gpLjgpILgpJcg4KSu4KSo4KWN4KSm4KS_4KSwIChLYWJpciBTYW50IFNhdHNhbmcgTWFuZGlyKQ!5e0!3m2!1sen!2snp!4v1727701234567!5m2!1sen!2snp"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kabir Sant Satsang Mandir Location"
                className="absolute inset-0"
              />
            </div>
            <div className="p-4 bg-cream-50 text-center text-sm text-dark-600">
              <p>Join us for satsang and spiritual gatherings at our center in Lalitpur</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a href="tel:+97715450429" className="hover:text-teal-600 transition-colors">
                  +977 1 545 0429
                </a>
                <span>•</span>
                <a href="tel:+977984005210" className="hover:text-teal-600 transition-colors">
                  +977 984 005 210
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ or Additional Info Section */}
      <section className="py-16 bg-gradient-to-br from-cream-100 to-teal-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-dark-700">
              Common questions about connecting with our community
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200">
              <h3 className="text-lg font-bold text-dark-900 mb-2">
                How quickly will I receive a response?
              </h3>
              <p className="text-dark-700">
                We aim to respond to all inquiries within 24-48 hours. For urgent spiritual guidance,
                please contact us via WhatsApp or attend our weekly satsang sessions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200">
              <h3 className="text-lg font-bold text-dark-900 mb-2">
                Can I visit the spiritual center?
              </h3>
              <p className="text-dark-700">
                Yes! Visitors are welcome during our scheduled satsang sessions. Please check our Events
                page for upcoming gatherings or contact us to arrange a visit.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200">
              <h3 className="text-lg font-bold text-dark-900 mb-2">
                Do you offer spiritual counseling?
              </h3>
              <p className="text-dark-700">
                We provide spiritual guidance based on Sant Kabir's teachings. For personal counseling
                sessions, please reach out via email or the contact form above.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200">
              <h3 className="text-lg font-bold text-dark-900 mb-2">
                How can I volunteer or contribute?
              </h3>
              <p className="text-dark-700">
                We welcome volunteers who wish to serve the community. Please fill out the contact form
                selecting "Volunteer Opportunities" or email us directly to learn about current opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}