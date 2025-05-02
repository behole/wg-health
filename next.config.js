/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  output: 'export',
  distDir: 'out',
  reactStrictMode: true,
  // Disable server-side API routes
  rewrites: async () => {
    return [];
  }
}

module.exports = nextConfig
