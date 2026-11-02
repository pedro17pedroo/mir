/** @type {import('next').NextConfig} */
const path = require('path');

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'res.cloudinary.com', 'images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/:path*',
        destination: '/api/not-found',
      },
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  // Configuração de aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
      '@/store': path.resolve(__dirname, './store'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/components': path.resolve(__dirname, './components'),
    };
    return config;
  },
};

module.exports = nextConfig;
