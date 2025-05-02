/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true // This helps with Cloudflare Pages static exports
  }
}

module.exports = nextConfig
