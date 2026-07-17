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

  async redirects() {
    return [
      {
        source: '/cart',
        destination: '/checkout/cart',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

  transpilePackages: ['@ff/ui'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        'localhost:3001',
        '127.0.0.1:3001',
        'fashionfriday.in',
        'www.fashionfriday.in',
        '*.vercel.app',
      ],
    },
    optimizePackageImports: ['@ff/ui', 'motion/react', 'lucide-react'],
  },
};

export default nextConfig;
