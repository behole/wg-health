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
  reactStrictMode: true
}

module.exports = nextConfig
