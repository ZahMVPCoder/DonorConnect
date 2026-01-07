/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // Skip static generation for routes with database access
  staticPageGenerationTimeout: 0,
}

module.exports = nextConfig
