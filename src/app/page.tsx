export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
            Kabir Sant Sharan
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Welcome to our sacred space of divine teachings and spiritual community
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
            <blockquote className="text-lg italic text-gray-800 mb-4">
              &ldquo;जो खोजा तिन पाइया, गहरे पानी पैठ।<br />
              मैं बपुरा बूडन डरा, रहा किनारे बैठ।।&rdquo;
            </blockquote>
            <cite className="text-primary-700 font-medium">- Sant Kabir Das</cite>
          </div>
        </div>
      </div>
    </main>
  )
}