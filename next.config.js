/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Cloudflare Pages with Functions support
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'media.kabirsantsharan.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: http:",
              "frame-src 'self' https://www.google.com https://www.youtube.com",
              "connect-src 'self' https://static.cloudflareinsights.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig