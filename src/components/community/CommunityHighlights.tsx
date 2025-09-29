interface CommunityFeature {
  id: string
  title: string
  description: string
  iconPath: string
  memberCount?: string
  activity?: string
}

const communityFeatures: CommunityFeature[] = [
  {
    id: '1',
    title: 'Spiritual Discussions',
    description: 'Join meaningful conversations about Kabir\'s teachings and spiritual growth with fellow seekers.',
    iconPath: 'M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
    memberCount: '500+',
    activity: 'Active daily'
  },
  {
    id: '2',
    title: 'Devotional Music',
    description: 'Share and listen to bhajans, kirtan, and devotional songs inspired by Sant Kabir\'s poetry.',
    iconPath: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z',
    memberCount: '300+',
    activity: 'New uploads weekly'
  },
  {
    id: '3',
    title: 'Study Groups',
    description: 'Participate in guided study sessions exploring the deeper meanings of Kabir\'s dohas and teachings.',
    iconPath: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    memberCount: '200+',
    activity: 'Weekly sessions'
  },
  {
    id: '4',
    title: 'Seva Opportunities',
    description: 'Engage in selfless service activities that embody the spirit of compassion taught by Sant Kabir.',
    iconPath: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h2.5l6 6H11l-2.5-3H10v3H4zm7.5-12.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5S9.17 4 10 4s1.5.67 1.5 1.5zM10.5 22H9V11.5h3L15 22h-1.5l-1-2h-3l1 2z',
    memberCount: '150+',
    activity: 'Monthly projects'
  }
]

export function CommunityHighlights() {
  return (
    <section className="py-16 bg-cream-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
            Join Our Spiritual Community
          </h2>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto">
            Connect with like-minded souls on the path of spiritual awakening. Our community provides a supportive space for learning, sharing, and growing together through Kabir's timeless wisdom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityFeatures.map((feature) => (
            <div key={feature.id} className="bg-cream-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-cream-200">
              <div className="w-12 h-12 mx-auto mb-4 text-dark-800">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d={feature.iconPath} />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-dark-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-dark-700 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              <div className="space-y-1 text-xs text-dark-600">
                {feature.memberCount && (
                  <div className="flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    {feature.memberCount} members
                  </div>
                )}
                {feature.activity && (
                  <div>{feature.activity}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-cream-200 rounded-xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-dark-900 mb-4">
            Ready to Begin Your Spiritual Journey?
          </h3>
          <p className="text-dark-700 mb-6 max-w-2xl mx-auto">
            &ldquo;जो घट प्रेम न संचरै, सो घट जानो मसान। जैसे खाल लुहार की, सांस लेत बिन प्रान।।&rdquo;
            <br />
            <span className="text-sm italic mt-2 block">
              - Sant Kabir Das
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-3 bg-dark-900 text-cream-50 font-medium rounded-md hover:bg-dark-800 transition-colors duration-200">
              Join Community
            </button>
            <button className="px-8 py-3 border border-dark-300 text-dark-800 font-medium rounded-md hover:bg-cream-300 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}