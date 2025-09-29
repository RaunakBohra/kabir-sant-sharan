import { SupabaseTest } from '@/components/test/SupabaseTest'

export default function HomePage() {
  return (
    <div className="bg-cream-500">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-dark-900 mb-6">
            Welcome to Kabir Sant Sharan
          </h1>
          <p className="text-xl md:text-2xl text-dark-700 mb-8 max-w-3xl mx-auto">
            A sacred space of divine teachings and spiritual community
          </p>
          <div className="bg-cream-100/90 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-2xl mx-auto mb-8 border border-dark-200">
            <blockquote className="text-lg italic text-dark-800 mb-4">
              &ldquo;जो खोजा तिन पाइया, गहरे पानी पैठ।<br />
              मैं बपुरा बूडन डरा, रहा किनारे बैठ।।&rdquo;
            </blockquote>
            <cite className="text-dark-700 font-medium">- Sant Kabir Das</cite>
          </div>
        </div>

        {/* Database Connection Test */}
        <div className="max-w-2xl mx-auto">
          <SupabaseTest />
        </div>
      </div>
    </div>
  )
}