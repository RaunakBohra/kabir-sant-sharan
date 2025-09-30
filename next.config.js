/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for Cloudflare Pages with full-stack support
  trailingSlash: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com', 'media.kabirsantsharan.com'],
  },
  // Security headers for all environments
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig