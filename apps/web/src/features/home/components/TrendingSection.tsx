'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRightIcon } from '@ff/ui';
import CoverflowCarousel, { type Product } from '@/components/ui/carousel/CoverflowCarousel';
import { fetcher } from '@/lib/api-client';

interface CampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  placement: string;
  isActive: boolean;
}

export default function TrendingSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrendingBanners = async () => {
      try {
        const data = await fetcher<CampaignBanner[]>('/campaigns');
        if (data && Array.isArray(data)) {
          const trendingBanners = data.filter(
            (b) => b.placement === 'trending-products' && b.isActive,
          );

          if (trendingBanners.length > 0) {
            setProducts(
              trendingBanners.map((b, idx) => ({
                id: idx + 1,
                title: b.title,
                slug: b.linkUrl.replace('/products?search=', '') || b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                image: b.mediaUrl,
              })),
            );
          }
        }
      } catch (err) {
        console.error('Failed to load trending section from API:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrendingBanners();
  }, []);

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden py-10 sm:py-20">
      <div className="container mx-auto px-4 text-center sm:mb-10 mb-6">
        <h2 className="section-header">
          Trending Now
        </h2>
      </div>

      <CoverflowCarousel products={products} />

      {/* View All Products button moved underneath the carousel */}
      <div className="mt-10 flex justify-center w-full px-4">
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all active:scale-95 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white"
        >
          View All Products <ArrowUpRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

