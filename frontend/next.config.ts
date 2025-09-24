import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Enable experimental features
  experimental: {
    // Enable server actions if needed later
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:8000']
    }
  },
  
  // Add rewrites for API if needed
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`
      }
    ]
  },

  // Enable CORS for development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  }
}

export default nextConfig