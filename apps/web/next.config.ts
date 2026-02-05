import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      "fashionfriday.in",
      "cdn.fashionfriday.in",
      "images.unsplash.com",
    ],
  },

  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
