/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    unoptimized: true // Required for static export
  },
  // Only use static export for production (Vercel build)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),
  reactStrictMode: true,
  // Add custom headers for Vercel to help with routing
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
