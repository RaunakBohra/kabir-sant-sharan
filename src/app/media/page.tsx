import { MediaFilters } from '@/components/media/MediaFilters'
import { MediaGrid } from '@/components/media/MediaGrid'
import { FeaturedMedia } from '@/components/media/FeaturedMedia'

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-cream-500">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-900 mb-6">
            Spiritual Media Library
          </h1>
          <p className="text-lg text-dark-600 max-w-3xl mx-auto leading-relaxed">
            Experience the divine teachings of Sant Kabir Das through our collection of audio discourses,
            video satsangs, and devotional bhajans. Let these sacred sounds guide you on your spiritual journey.
          </p>
        </div>

        {/* Featured Media */}
        <FeaturedMedia />

        {/* Media Filters */}
        <MediaFilters />

        {/* Media Grid */}
        <MediaGrid />
      </div>
    </div>
  )
}