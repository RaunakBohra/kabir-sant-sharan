import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-cream-200 to-cream-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-4 text-dark-900">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C10.9 2 10 2.9 10 4v1.2C8.8 5.7 8 6.8 8 8.1V10c0 1.3.8 2.4 2 2.9V22h4v-9.1c1.2-.5 2-1.6 2-2.9V8.1c0-1.3-.8-2.4-2-2.9V4c0-1.1-.9-2-2-2z"/>
                <path d="M12 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                <path d="M8 16h8v2H8z"/>
                <path d="M7 18h10v1H7z"/>
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-dark-900 mb-6 leading-tight">
            Kabir Sant Sharan
          </h1>

          <p className="text-xl md:text-2xl text-dark-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            A sacred sanctuary dedicated to the timeless wisdom and divine teachings of
            <span className="font-semibold text-dark-800"> Sant Kabir Das</span>
          </p>

          <div className="bg-cream-50 rounded-xl p-6 md:p-8 mb-10 border border-cream-300 max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-xl italic text-dark-800 mb-4">
              &ldquo;सुखिया सब संसार है, खावै अरु सोवै। दुखिया दास कबीर है, जागै अरु रोवै।।&rdquo;
            </blockquote>
            <cite className="text-dark-600 font-medium">
              - Sant Kabir Das
            </cite>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={"/teachings"}
              className="inline-flex items-center px-8 py-4 bg-dark-900 text-cream-50 font-semibold rounded-md hover:bg-dark-800 transition-colors duration-200 text-lg"
            >
              Explore Teachings
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>

            <Link
              href={"/teachings"}
              className="inline-flex items-center px-8 py-4 border-2 border-dark-300 text-dark-800 font-semibold rounded-md hover:bg-cream-200 transition-colors duration-200 text-lg"
            >
              Explore Teachings
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cream-500 to-transparent"></div>
    </section>
  )
}