import { HeroSection } from '@/components/spiritual/HeroSection'
import { DailyQuote } from '@/components/spiritual/DailyQuote'
import { FeaturedTeachings } from '@/components/content/FeaturedTeachings'
import { UpcomingEvents } from '@/components/events/UpcomingEvents'
import { CommunityHighlights } from '@/components/community/CommunityHighlights'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <DailyQuote />
      <FeaturedTeachings />
      <UpcomingEvents />
      <CommunityHighlights />
    </div>
  )
}