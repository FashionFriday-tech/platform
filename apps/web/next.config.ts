import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fashionfriday.in',
      },
      {
        protocol: 'https',
        hostname: 'cdn.fashionfriday.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'static.nike.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  transpilePackages: ['@ff/ui'],
};

export default nextConfig;
