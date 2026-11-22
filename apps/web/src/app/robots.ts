import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: [
          'Bytespider',
          'ClaudeBot',
          'GPTBot',
          'CCBot',
          'PetalBot',
          'Amazonbot',
          'SemrushBot',
          'AhrefsBot',
          'MJ12bot',
          'DotBot',
        ],
        disallow: ['/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/api/', '/search'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/icons/', '/images/', '/favicon*'],
      },
    ],
    sitemap: 'https://www.fashionfriday.in/sitemap.xml',
    host: 'https://www.fashionfriday.in',
  };
}
