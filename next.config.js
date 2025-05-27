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
  // Dynamic deployment for API routes (weather API)
  // Removed static export to enable server-side API routes
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
