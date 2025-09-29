interface CommunityStatsProps {
  className?: string
}

interface StatItem {
  label: string
  value: string
  icon: React.ReactNode
  description: string
}

const statsData: StatItem[] = [
  {
    label: 'Community Members',
    value: '12,500+',
    description: 'Seekers following Sant Kabir\'s path worldwide',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  {
    label: 'Countries Reached',
    value: '45+',
    description: 'Global reach across continents',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Spiritual Teachings',
    value: '500+',
    description: 'Curated wisdom from Sant Kabir Das',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    label: 'Hours of Meditation',
    value: '50,000+',
    description: 'Collective spiritual practice time',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Satsang Events',
    value: '150+',
    description: 'Spiritual gatherings held this year',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    label: 'Languages Supported',
    value: '8',
    description: 'Making wisdom accessible globally',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    )
  }
]

export function CommunityStats({ className = '' }: CommunityStatsProps) {
  return (
    <section className={`py-16 bg-cream-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Our Growing Spiritual Community
          </h2>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            United by Sant Kabir's timeless teachings, our global community continues to grow,
            seeking truth, love, and spiritual awakening together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-cream-50 rounded-xl p-8 text-center shadow-lg border border-cream-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center text-cream-50">
                  {stat.icon}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-3xl md:text-4xl font-bold text-dark-900 mb-1">
                  {stat.value}
                </div>
                <h3 className="text-lg font-semibold text-dark-800">
                  {stat.label}
                </h3>
              </div>

              <p className="text-dark-600 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Community Highlights */}
        <div className="mt-16 bg-cream-200 rounded-xl p-8 md:p-12 text-center border border-cream-300">
          <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-6">
            Together in Unity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-dark-900">One Love</h4>
              <p className="text-dark-700 text-sm">
                Beyond boundaries of religion, caste, and nationality
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-dark-900">One Truth</h4>
              <p className="text-dark-700 text-sm">
                The divine light that shines within every soul
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-cream-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-dark-900">One World</h4>
              <p className="text-dark-700 text-sm">
                United in our journey toward spiritual awakening
              </p>
            </div>
          </div>

          <blockquote className="text-xl md:text-2xl italic text-dark-800 mb-4 leading-relaxed">
            "सब घर एको करि बन आया, गए भेद सब सबरैया।"
          </blockquote>
          <cite className="text-dark-700 font-medium">
            - Sant Kabir Das
          </cite>
          <p className="text-dark-600 text-sm mt-3 max-w-2xl mx-auto">
            "I have made one house of all homes, all differences have vanished."
          </p>
        </div>
      </div>
    </section>
  )
}