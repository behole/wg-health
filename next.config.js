/** @type {import('next').NextConfig} */
const nextConfig = {
  // Firebase compatibility
  experimental: {
    serverComponentsExternalPackages: ['firebase']
  },
  images: {
    domains: ['localhost'],
    unoptimized: true // Required for static export
  },
  output: 'export',
  reactStrictMode: true,
  // Add basePath for GitHub Pages if using a project page
  // basePath: '/wg-health'
}

module.exports = nextConfig
