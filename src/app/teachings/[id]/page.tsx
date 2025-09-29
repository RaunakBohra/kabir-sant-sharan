import Link from 'next/link'
import { notFound } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  tags: string[]
  image?: string
}

const samplePosts: { [key: string]: BlogPost } = {
  '1': {
    id: '1',
    title: 'The Path of Inner Truth: Understanding Kabir\'s Philosophy',
    content: `
      <p>Sant Kabir Das, the 15th-century mystic poet and saint, revolutionized spiritual thought with his profound teachings on inner truth and self-realization. His philosophy centers on the belief that the divine resides within every individual, and the journey toward enlightenment is fundamentally an inward one.</p>

      <h2>The Divine Within</h2>
      <p>Kabir's central teaching revolves around the concept that God is not found in temples, mosques, or churches, but within the human heart. He famously said:</p>

      <blockquote>
        "मैं कहता हूँ आँखिन देखी, तू कहता कागद की लेखी।"<br/>
        "I speak of what I have seen with my own eyes, you speak of what is written on paper."
      </blockquote>

      <p>This profound statement encapsulates his emphasis on direct, personal experience over scriptural knowledge or ritualistic practices.</p>

      <h2>Beyond Religious Boundaries</h2>
      <p>One of Kabir's most revolutionary ideas was his rejection of religious divisions. He criticized both Hindu and Islamic orthodox practices, advocating instead for a universal spirituality that transcends communal boundaries.</p>

      <p>His famous doha illustrates this beautifully:</p>

      <blockquote>
        "कबीरा खड़ा बाज़ार में, मांगे सबकी खैर।<br/>
        ना काहू से दोस्ती, न काहू से बैर।।"<br/>
        "Kabir stands in the marketplace, wishing welfare for all.<br/>
        Neither friendship with anyone, nor enmity with anyone."
      </blockquote>

      <h2>The Practice of Truth</h2>
      <p>For Kabir, spiritual practice was not about elaborate rituals but about living truthfully and maintaining moral integrity in daily life. He emphasized:</p>

      <ul>
        <li><strong>Honesty in thought and action</strong> - Living without pretense or deception</li>
        <li><strong>Compassion for all beings</strong> - Treating every creature with kindness</li>
        <li><strong>Simplicity in lifestyle</strong> - Avoiding material excess and ego</li>
        <li><strong>Constant remembrance of the divine</strong> - Maintaining awareness of the sacred in everyday moments</li>
      </ul>

      <h2>The Guru Within</h2>
      <p>While Kabir acknowledged the importance of a spiritual guide, he ultimately taught that the true guru resides within each person. External teachers can point the way, but the real journey of self-discovery must be undertaken individually.</p>

      <p>As he beautifully expressed:</p>

      <blockquote>
        "गुरु गोविन्द दोनों खड़े, काके लागूं पाँय।<br/>
        बलिहारी गुरु आपनो, गोविन्द दियो बताय।।"<br/>
        "Both the Guru and God stand before me, whose feet should I touch first?<br/>
        Glory to the Guru who showed me God."
      </blockquote>

      <h2>Relevance in Modern Times</h2>
      <p>Kabir's teachings remain profoundly relevant in today's world. In an age of religious fundamentalism and communal divisions, his message of unity and inner spirituality offers a path toward peace and understanding.</p>

      <p>His emphasis on personal experience over blind faith encourages seekers to question, explore, and discover truth for themselves rather than accepting dogma without understanding.</p>

      <h2>Conclusion</h2>
      <p>The path of inner truth that Kabir illuminated is not an easy one—it requires courage to look within, honesty to face one's limitations, and perseverance to continue the journey despite obstacles. However, for those willing to walk this path, Kabir promises the ultimate reward: the realization of one's true divine nature.</p>

      <p>As we reflect on these timeless teachings, let us remember Kabir's final message:</p>

      <blockquote>
        "जो खोजा तिन पाइया, गहरे पानी पैठ।<br/>
        मैं बपुरा बूडन डरा, रहा किनारे बैठ।।"<br/>
        "Those who sought, they found, by diving deep into the waters.<br/>
        I, the unfortunate one, feared drowning and remained sitting on the shore."
      </blockquote>

      <p>May we all find the courage to dive deep into the waters of spiritual truth and discover the divine treasures that await within.</p>
    `,
    category: 'Philosophy',
    author: 'Sant Kabir Das',
    publishedAt: '2024-10-01',
    readTime: '8 min read',
    tags: ['truth', 'philosophy', 'self-realization']
  },
  '2': {
    id: '2',
    title: 'Unity in Diversity: The Universal Message of Love',
    content: `
      <p>Sant Kabir Das emerged during a time of religious conflict and social division in medieval India. His revolutionary message of unity transcended the boundaries of religion, caste, and creed, offering a vision of universal love that remains powerfully relevant today.</p>

      <h2>The Oneness of All Existence</h2>
      <p>Kabir's fundamental teaching was that all of creation is interconnected and emanates from the same divine source. He saw no distinction between Hindu and Muslim, high caste and low caste, rich and poor - all were equal in the eyes of the divine.</p>

      <blockquote>
        "अवधू माया तजी भली, जो किछु होइ सो होइ।<br/>
        सबमें राम रमत है, और कहीं राम न होइ।।"<br/>
        "O seeker, it is good to renounce illusion, let whatever happens happen.<br/>
        Ram (God) pervades everything, there is nowhere that Ram is not."
      </blockquote>

      <h2>Beyond Religious Labels</h2>
      <p>One of Kabir's most radical teachings was his rejection of religious orthodoxy. He criticized both Hindu priests and Islamic clerics for their emphasis on external rituals while neglecting inner transformation.</p>

      <p>His famous verse captures this beautifully:</p>

      <blockquote>
        "काँकर पत्थर जोरि के, मस्जिद लई बनाय।<br/>
        ता चढि मुल्ला बांग दे, क्या बहरा हुआ खुदाय।।"<br/>
        "Gathering pebbles and stones, they built a mosque.<br/>
        The mullah climbs up and calls for prayer - has God become deaf?"
      </blockquote>

      <p>Similarly, he questioned Hindu practices:</p>

      <blockquote>
        "माला फेरत जुग भया, फिरा न मन का फेर।<br/>
        कर का मन का डार दे, मन का मन का फेर।।"<br/>
        "You have been turning prayer beads for ages, but the mind's wandering hasn't stopped.<br/>
        Give up both the hand's and mind's activities, and stop the mind's restlessness."
      </blockquote>

      <h2>The Language of Love</h2>
      <p>For Kabir, the universal language that could unite all humanity was love - not romantic love, but divine love that flows from the recognition of the sacred in all beings. This love transcends all barriers and dissolves all differences.</p>

      <p>He expressed this through his poetry:</p>

      <blockquote>
        "प्रेम न बाड़ी ऊपजै, प्रेम न हाट बिकाय।<br/>
        राजा प्रजा जेहि रुचै, सीस देइ लै जाय।।"<br/>
        "Love doesn't grow in gardens, nor is love sold in markets.<br/>
        Whether king or commoner, whoever desires it must give their head to obtain it."
      </blockquote>

      <h2>Social Reform Through Spiritual Unity</h2>
      <p>Kabir's message of unity wasn't merely philosophical - it had profound social implications. By asserting the spiritual equality of all beings, he challenged the rigid caste system and religious hierarchy of his time.</p>

      <p>As a weaver from a lower caste, Kabir's very existence as a revered spiritual teacher was revolutionary. He demonstrated that wisdom and divine realization are not the monopoly of any particular social class.</p>

      <h2>The Path of Synthesis</h2>
      <p>Rather than creating another religion, Kabir offered a synthesis that honored the truth in all traditions while rejecting their limitations. He borrowed terminology from both Hindu and Islamic traditions but infused them with his own unique understanding.</p>

      <p>His concept of "Ram" wasn't the Hindu deity but the universal divine principle. His references to "Allah" weren't sectarian but pointed to the same ultimate reality that pervades all existence.</p>

      <h2>Modern Relevance</h2>
      <p>In our contemporary world, marked by religious extremism, cultural conflicts, and social divisions, Kabir's message offers hope and guidance. His vision of unity in diversity provides a framework for:</p>

      <ul>
        <li><strong>Interfaith Dialogue</strong> - Finding common ground across religious traditions</li>
        <li><strong>Social Justice</strong> - Recognizing the inherent dignity of all individuals</li>
        <li><strong>Global Citizenship</strong> - Moving beyond narrow nationalisms to embrace universal humanity</li>
        <li><strong>Environmental Consciousness</strong> - Seeing the divine in all of creation</li>
      </ul>

      <h2>Living the Message</h2>
      <p>Kabir's teachings on unity are not meant to remain as beautiful poetry but to be lived and embodied. This requires:</p>

      <p><strong>Cultivating Inner Unity:</strong> Before we can see unity in the world, we must find it within ourselves - integrating our various aspects and contradictions into a harmonious whole.</p>

      <p><strong>Practicing Inclusive Love:</strong> Extending compassion and understanding to all beings, regardless of their background, beliefs, or circumstances.</p>

      <p><strong>Challenging Prejudice:</strong> Actively opposing discrimination and working to break down barriers that divide communities.</p>

      <h2>The Eternal Message</h2>
      <p>Kabir's vision of unity in diversity remains one of humanity's greatest gifts. In a world often torn apart by differences, his voice calls us back to our common source and shared destiny.</p>

      <p>His final teaching reminds us:</p>

      <blockquote>
        "सब धरती कागद करूं, लेखनी सब बनराय।<br/>
        सात समुद्र की मसि करूं, गुरु गुन लिखा न जाय।।"<br/>
        "If I make the entire earth my paper and all the forests my pen,<br/>
        And make the seven seas my ink, still the virtues of the Guru (divine truth) cannot be written."
      </blockquote>

      <p>The love and unity that Kabir experienced and shared is infinite, inexhaustible, and available to all who have the courage to look beyond surface differences to the underlying oneness that connects us all.</p>
    `,
    category: 'Unity',
    author: 'Sant Kabir Das',
    publishedAt: '2024-09-28',
    readTime: '6 min read',
    tags: ['unity', 'love', 'religion', 'oneness']
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const post = samplePosts[params.id]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-dark-600">
            <Link href="/" className="hover:text-dark-800">Home</Link>
            <span>/</span>
            <Link href="/teachings" className="hover:text-dark-800">Teachings</Link>
            <span>/</span>
            <span className="text-dark-800 font-medium">{post.title}</span>
          </div>
        </nav>

        {/* Article */}
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-cream-200 text-dark-700 px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              <span className="text-dark-600 text-sm">{post.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between text-dark-600 mb-6">
              <span>By {post.author}</span>
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-cream-200 text-dark-700 px-3 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* Content */}
          <div className="bg-cream-100 rounded-lg p-8 md:p-12 shadow-lg border border-cream-200">
            <div
              className="prose prose-lg max-w-none text-dark-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: '1.8'
              }}
            />
          </div>

          {/* Share and Navigation */}
          <div className="mt-12 pt-8 border-t border-cream-300">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-dark-700 mb-2">Share this teaching:</p>
                <div className="flex space-x-3">
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    Facebook
                  </button>
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    Twitter
                  </button>
                  <button className="bg-cream-200 hover:bg-cream-300 text-dark-800 px-4 py-2 rounded transition-colors duration-200">
                    WhatsApp
                  </button>
                </div>
              </div>

              <Link
                href="/teachings"
                className="bg-dark-900 hover:bg-dark-800 text-cream-50 px-6 py-3 rounded transition-colors duration-200 inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Teachings
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}