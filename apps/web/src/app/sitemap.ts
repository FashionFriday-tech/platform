import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.fashionfriday.in';

  const routes = [
    '',
    '/products',
    '/collections',
    '/collections/new-arrivals',
    '/collections/best-sellers',
    '/category/men',
    '/category/women',
    '/brands',
    '/help/about',
    '/help/faq',
    '/help/returns',
    '/help/shipping',
    '/help/privacy-policy',
    '/help/terms-conditions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : route.startsWith('/products') ? 0.9 : 0.8,
  }));

  return routes;
}
