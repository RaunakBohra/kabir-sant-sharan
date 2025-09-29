import type { Metadata } from 'next'
import './globals.css'
import { NavBar } from '@/components/navigation/NavBar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Kabir Sant Sharan | Divine Teachings & Community',
  description: 'Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance. Join our sacred journey of devotion and self-realization.',
  keywords: 'Kabir, Sant Kabir, spiritual teachings, devotion, community, satsang, meditation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-cream-500 text-dark-900 min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}