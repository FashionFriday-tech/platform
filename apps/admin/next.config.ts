import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ff/ui', '@ff/schemas'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
