import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ff/ui', '@ff/schemas'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
