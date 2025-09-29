/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export mode for production builds
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  trailingSlash: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  // Only add headers in production (export mode doesn't support them)
  ...(process.env.NODE_ENV === 'production' && {
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
          ],
        },
      ]
    },
  }),
}

module.exports = nextConfig