import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ff/ui', '@ff/schemas'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-e317eed21d2a444d893320e08f2a283d.r2.dev',
      },

      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};


export default nextConfig;
