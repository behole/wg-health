/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    domains: ['localhost']
  }
}

module.exports = nextConfig
