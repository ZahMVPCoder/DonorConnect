/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
