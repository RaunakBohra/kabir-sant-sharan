import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}