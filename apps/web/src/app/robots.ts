import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/account/', '/checkout/', '/api/'],
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
