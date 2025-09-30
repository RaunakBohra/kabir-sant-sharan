import { Metadata } from 'next'
import Link from 'next/link'
import { AboutTabs } from '@/components/about/AboutTabs'

export const metadata: Metadata = {
  title: 'About Sant Kabir Das | Kabir Sant Sharan',
  description: 'Discover the life, teachings, and enduring legacy of Sant Kabir Das - the 15th century mystic poet whose wisdom transcends boundaries of religion and time.',
  openGraph: {
    title: 'About Sant Kabir Das | Kabir Sant Sharan',
    description: 'The life and teachings of the great mystic poet Sant Kabir Das',
    type: 'website',
  }
}

export default function SantKabirPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 via-cream-100 to-amber-50 border-b border-cream-200">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-dark-900 mb-6">
              Sant Kabir Das
            </h1>
            <p className="text-xl md:text-2xl text-dark-700 italic mb-6">
              "मोको कहां ढूंढे रे बन्दे, मैं तो तेरे पास में"
            </p>
            <p className="text-lg text-dark-600 mb-4">
              "Why do you search for me outside? I am within you."
            </p>
            <div className="inline-block bg-teal-600 text-cream-50 px-6 py-2 rounded-full text-sm font-semibold">
              15th Century Mystic Poet & Saint
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <AboutTabs />

      {/* Life Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Life of Sant Kabir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">1398</div>
                <p className="text-dark-700 font-semibold">Birth</p>
                <p className="text-sm text-dark-600">Varanasi (Kashi), India</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="text-4xl font-bold text-amber-600 mb-2">60+</div>
                <p className="text-dark-700 font-semibold">Years of Teaching</p>
                <p className="text-sm text-dark-600">Spreading divine wisdom</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-cream-200 text-center">
                <div className="text-4xl font-bold text-teal-600 mb-2">1518</div>
                <p className="text-dark-700 font-semibold">Samadhi</p>
                <p className="text-sm text-dark-600">Maghar, Uttar Pradesh</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-amber-50 rounded-xl p-8 md:p-12 shadow-md border border-cream-200">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Early Life</h3>
              <p className="text-dark-700 leading-relaxed mb-6">
                Sant Kabir Das was born in 1398 CE in the holy city of Varanasi (Kashi), during a time
                of significant religious and social upheaval in India. According to legend, Kabir was
                born to a Brahmin widow who, fearing social stigma, placed the infant near a pond where
                he was found and raised by Neeru and Neema, a Muslim weaver couple.
              </p>
              <p className="text-dark-700 leading-relaxed mb-6">
                Growing up in a humble weaver's household, Kabir learned the family trade and became
                a master weaver himself. Despite his limited formal education, he possessed an
                extraordinary spiritual insight and became a disciple of the great saint Ramananda.
                Legend has it that Kabir, knowing that Ramananda would not accept a Muslim disciple,
                lay on the steps of the Ganges where Ramananda would descend for his morning bath.
                When Ramananda accidentally stepped on Kabir and uttered "Ram! Ram!", Kabir accepted
                this as his spiritual initiation.
              </p>
              <p className="text-dark-700 leading-relaxed">
                From that moment, Kabir dedicated his life to spiritual practice and teaching,
                weaving cloth by day and composing profound verses that challenged religious orthodoxy
                and called people to recognize the divine within themselves and all beings.
              </p>
            </div>
          </div>

          {/* Core Teachings */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Core Teachings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">One God, Many Names</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      Kabir taught that there is only one God, known by many names - Ram, Rahim, Allah,
                      Ishwar. He rejected the divisions created by different religions and emphasized
                      that the divine is formless and beyond human conception.
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-600">
                      <p className="text-dark-700 italic text-sm">
                        "हिंदू कहे राम हमारा, मुस्लिम कहे रहीमाना<br/>
                        आपस में दोऊ लड़ते, मरम न कोई जाना"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">Reject Empty Rituals</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      Kabir strongly criticized empty religious rituals, idol worship, and mere external
                      displays of devotion. He taught that true spirituality lies in inner transformation,
                      not in pilgrimages, fasting, or ceremonial practices.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                      <p className="text-dark-700 italic text-sm">
                        "कंकर पत्थर जोड़ के, मस्जिद लई बनाय<br/>
                        ता चढ़ मुल्ला बांग दे, क्या बहरा हुआ खुदाय"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">Equality of All Beings</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      Kabir vehemently opposed the caste system and all forms of social discrimination.
                      He taught that all humans are equal in the eyes of God, and that true nobility
                      comes from one's character and spiritual development, not birth or social status.
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-600">
                      <p className="text-dark-700 italic text-sm">
                        "जाति न पूछो साधु की, पूछ लीजिये ज्ञान<br/>
                        मोल करो तरवार का, पड़ी रहन दो म्यान"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">The Guru Within</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      While Kabir acknowledged the importance of a spiritual teacher, he emphasized that
                      the true guru is the divine wisdom within each person. He taught that self-realization
                      comes through inner contemplation and direct experience of the divine.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                      <p className="text-dark-700 italic text-sm">
                        "गुरु गोविन्द दोऊ खड़े, काके लागूं पाँय<br/>
                        बलिहारी गुरु आपने, गोविन्द दियो बताय"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">Live in Truth</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      Kabir placed great emphasis on truthfulness, honesty, and living a life of integrity.
                      He taught that speaking and living truth is the foundation of spiritual life, and
                      that hypocrisy and deceit distance us from the divine.
                    </p>
                    <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-600">
                      <p className="text-dark-700 italic text-sm">
                        "साईं इतना दीजिये, जामे कुटुम समाय<br/>
                        मैं भी भूखा न रहूँ, साधु न भूखा जाय"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-cream-200">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0 text-cream-50 text-xl font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark-900 mb-3">Practice Love & Compassion</h3>
                    <p className="text-dark-700 leading-relaxed mb-3">
                      At the heart of Kabir's teachings is unconditional love and compassion for all beings.
                      He taught that love is the bridge to the divine, and that through loving service and
                      kindness, one realizes God in everyone.
                    </p>
                    <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-600">
                      <p className="text-dark-700 italic text-sm">
                        "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय<br/>
                        ढाई आखर प्रेम का, पढ़े सो पंडित होय"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Literary Contributions */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Literary Contributions
            </h2>
            <div className="bg-white rounded-xl p-8 md:p-12 shadow-md border border-cream-200">
              <p className="text-dark-700 leading-relaxed mb-6">
                Kabir expressed his spiritual wisdom through simple yet profound poetry composed in
                the vernacular Hindi language mixed with local dialects. His verses were accessible
                to common people, unlike the Sanskrit texts that were reserved for the educated elite.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                  <h4 className="text-xl font-bold text-dark-900 mb-3">Dohas (Couplets)</h4>
                  <p className="text-dark-700 text-sm">
                    Two-line verses containing profound spiritual wisdom. Over 500 dohas attributed to Kabir
                    continue to inspire seekers today.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border border-amber-200">
                  <h4 className="text-xl font-bold text-dark-900 mb-3">Sakhi (Witnesses)</h4>
                  <p className="text-dark-700 text-sm">
                    Short verses that serve as spiritual testimonies, bearing witness to divine truth
                    and guiding seekers on the path.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 border border-teal-200">
                  <h4 className="text-xl font-bold text-dark-900 mb-3">Bhajans (Hymns)</h4>
                  <p className="text-dark-700 text-sm">
                    Devotional songs that express deep love for the divine and are sung in satsang
                    gatherings across India and beyond.
                  </p>
                </div>
              </div>
              <div className="mt-8 bg-cream-50 p-6 rounded-lg border border-cream-200">
                <h4 className="text-lg font-bold text-dark-900 mb-3">Major Collections</h4>
                <ul className="space-y-2 text-dark-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Bijak</strong> - The most authentic collection of Kabir's verses</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Kabir Granthavali</strong> - Comprehensive collection compiled by scholars</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-teal-600 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Adi Granth</strong> - Contains 541 verses by Kabir in the Sikh holy book</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legacy & Influence */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Enduring Legacy
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-8 shadow-md border border-teal-200">
                <h3 className="text-2xl font-bold text-dark-900 mb-4">Influence on Bhakti Movement</h3>
                <p className="text-dark-700 leading-relaxed mb-4">
                  Kabir was a central figure in the Bhakti movement, which emphasized personal devotion
                  to God over ritualistic worship. His teachings influenced countless saints and poets
                  including Guru Nanak (founder of Sikhism), Dadu Dayal, and many others.
                </p>
                <p className="text-dark-700 leading-relaxed">
                  The Kabir Panth, a religious community following his teachings, continues to thrive
                  with millions of followers across India and worldwide.
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 shadow-md border border-amber-200">
                <h3 className="text-2xl font-bold text-dark-900 mb-4">Modern Relevance</h3>
                <p className="text-dark-700 leading-relaxed mb-4">
                  In today's world, divided by religious, social, and political conflicts, Kabir's
                  message of universal brotherhood, religious tolerance, and social equality remains
                  profoundly relevant and urgent.
                </p>
                <p className="text-dark-700 leading-relaxed">
                  His verses continue to be sung, quoted, and studied by people of all faiths, inspiring
                  movements for social justice, interfaith harmony, and spiritual awakening.
                </p>
              </div>
            </div>
          </div>

          {/* Famous Dohas */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-8 text-center">
              Timeless Wisdom - Famous Dohas
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-teal-600">
                <p className="text-lg text-dark-900 mb-3 font-semibold">
                  बुरा जो देखन मैं चला, बुरा न मिलिया कोय<br/>
                  जो दिल खोजा आपना, मुझसे बुरा न कोय
                </p>
                <p className="text-dark-600 italic">
                  "I went searching for the wicked, but found none. When I searched my own heart,
                  I found none more wicked than myself."
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-amber-600">
                <p className="text-lg text-dark-900 mb-3 font-semibold">
                  कबीरा खड़ा बाज़ार में, मांगे सबकी खैर<br/>
                  ना काहू से दोस्ती, न काहू से बैर
                </p>
                <p className="text-dark-600 italic">
                  "Kabir stands in the marketplace, wishing well for all. Neither special friendship
                  with anyone, nor enmity with anyone."
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border-l-4 border-teal-600">
                <p className="text-lg text-dark-900 mb-3 font-semibold">
                  माला फेरत जुग भया, फिरा न मन का फेर<br/>
                  कर का मनका डार दे, मन का मनका फेर
                </p>
                <p className="text-dark-600 italic">
                  "You have been turning prayer beads for ages, yet your mind has not turned (towards God).
                  Put aside the beads in your hand, and turn the bead of your mind instead."
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-teal-50 via-amber-50 to-teal-50 rounded-xl p-12 text-center shadow-lg border border-cream-200">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Walk the Path of Kabir
            </h2>
            <p className="text-lg text-dark-700 mb-8 max-w-3xl mx-auto">
              Sant Kabir's teachings are not mere philosophy—they are a way of life. Join us in
              exploring and living these timeless truths through satsang, study, and spiritual practice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/teachings"
                className="inline-flex items-center px-8 py-4 bg-teal-600 text-cream-50 font-semibold rounded-lg hover:bg-teal-700 transition-colors shadow-md"
              >
                Explore Teachings
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/events"
                className="inline-flex items-center px-8 py-4 bg-white text-dark-900 font-semibold rounded-lg hover:bg-cream-100 transition-colors shadow-md border border-cream-300"
              >
                Join Satsang
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}