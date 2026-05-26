'use client';

import { useEffect, useState } from 'react';
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
      <div className="container mx-auto px-4 text-center sm:mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight uppercase md:text-7xl">
          Trending Now
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-md">
          Discover the pieces everyone is talking about this season.
        </p>
      </div>

      <CoverflowCarousel products={products} />
    </section>
  );
}

