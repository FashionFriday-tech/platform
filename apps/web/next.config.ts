import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
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


  transpilePackages: ['@ff/ui'],

  // experimental: {
  //   optimizePackageImports: ['@ff/ui', 'motion/react', 'lucide-react'],
  // },
};

export default nextConfig;
