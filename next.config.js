/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true // Required for static exports
  },
  // This is important for static exports
  output: 'export',
  // Configure trailing slash behavior
  trailingSlash: true,
  // Disable server components for static export
  reactStrictMode: true
}

module.exports = nextConfig
