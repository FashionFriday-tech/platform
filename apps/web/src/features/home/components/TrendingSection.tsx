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

export default function TrendingSection({
  initialCampaigns,
}: {
  initialCampaigns?: CampaignBanner[];
}) {
  const getMappedBanners = (data: CampaignBanner[]) => {
    const trendingBanners = data.filter((b) => b.placement === 'trending-products' && b.isActive);
    return trendingBanners.map((b, idx) => ({
      id: idx + 1,
      title: b.title,
      slug:
        b.linkUrl.replace('/products?search=', '') ||
        b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: b.mediaUrl,
    }));
  };

  const [products, setProducts] = useState<Product[]>(
    initialCampaigns ? getMappedBanners(initialCampaigns) : [],
  );
  const [isLoading, setIsLoading] = useState(!initialCampaigns);

  useEffect(() => {
    if (initialCampaigns) {
      return;
    }
    const loadTrendingBanners = async () => {
      try {
        const data = await fetcher<CampaignBanner[]>('/campaigns');
        if (data && Array.isArray(data)) {
          const trendingBanners = getMappedBanners(data);
          if (trendingBanners.length > 0) {
            setProducts(trendingBanners);
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load trending section from API:', err);
      } finally {
        setIsLoading(false);
      }
    };
    void loadTrendingBanners();
  }, [initialCampaigns]);

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden py-10 sm:py-20">
      <div className="container mx-auto mb-6 px-4 text-center sm:mb-10">
        <h2 className="section-header">Trending Now</h2>
      </div>

      <CoverflowCarousel products={products} />

      {/* View All Trending Products Button */}
      <div className="mt-8 flex w-full justify-center px-4 sm:mt-10 md:mt-12">
        <Link
          href="/products"
          className="group inline-flex -skew-x-[12deg] items-center overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-600 hover:shadow-xl active:scale-95 dark:border-zinc-300 dark:bg-white dark:hover:border-zinc-100"
        >
          <span className="skew-x-[12deg] px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-colors sm:text-sm dark:text-black">
            View All Trending
          </span>
          <span className="flex shrink-0 items-center justify-center bg-white px-4 py-3 text-black transition-all group-hover:bg-zinc-200 sm:px-5 sm:py-3 dark:bg-black dark:text-white dark:group-hover:bg-zinc-800">
            <span className="skew-x-[12deg]">
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
