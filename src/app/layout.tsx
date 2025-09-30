import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PageErrorBoundary } from '@/components/ui/error-boundary'
import { LayoutContent } from '@/components/layout/LayoutContent'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Kabir Sant Sharan | Divine Teachings & Community',
  description: 'Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance. Join our sacred journey of devotion and self-realization.',
  keywords: 'Kabir, Sant Kabir, spiritual teachings, devotion, community, satsang, meditation, Hindu philosophy, bhakti, divine wisdom',
  authors: [{ name: 'Kabir Sant Sharan Community' }],
  creator: 'Kabir Sant Sharan',
  publisher: 'Kabir Sant Sharan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kabirsantsharan.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'hi-IN': '/hi-IN',
      'ne-NP': '/ne-NP',
    },
  },
  openGraph: {
    title: 'Kabir Sant Sharan | Divine Teachings & Community',
    description: 'Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance.',
    url: 'https://kabirsantsharan.com',
    siteName: 'Kabir Sant Sharan',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kabir Sant Sharan - Divine Teachings',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kabir Sant Sharan | Divine Teachings & Community',
    description: 'Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance.',
    images: ['/twitter-image.jpg'],
    creator: '@kabirsantsharan',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Kabir Sant Sharan',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  applicationName: 'Kabir Sant Sharan',
  category: 'lifestyle',
}

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-cream-500 text-dark-900 min-h-screen flex flex-col">
        <PageErrorBoundary>
          <AuthProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </AuthProvider>
        </PageErrorBoundary>

        {/* Service Worker Registration */}
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Cloudflare Web Analytics - Production Only */}
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' && (
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "your-cf-analytics-token"}'
            strategy="afterInteractive"
          />
        )}

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Kabir Sant Sharan",
              "url": "https://kabirsantsharan.com",
              "logo": "https://kabirsantsharan.com/icon-512.png",
              "description": "Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance.",
              "sameAs": [
                "https://twitter.com/kabirsantsharan",
                "https://facebook.com/kabirsantsharan"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@kabirsantsharan.com"
              }
            }),
          }}
        />
      </body>
    </html>
  )
}