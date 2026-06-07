'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';

import { fetcher } from '@/lib/api-client';

export default function CategoryCarousel({ initialCampaigns }: { initialCampaigns?: any[] }) {
  const getMappedCategories = (banners: any[]) => {
    const categoryBanners = banners.filter((b) => b.placement === 'home-categories' && b.isActive);
    return categoryBanners.map((b) => {
      const isWomen =
        b.title?.toLowerCase().includes('women') || b.linkUrl?.toLowerCase().includes('women');
      return {
        id: b.id,
        title: b.title ?? (isWomen ? "Women's Collection" : "Men's Collection"),
        subtitle: isWomen ? 'women' : 'men',
        image: b.mediaUrl ?? b.image ?? '',
        href: b.linkUrl?.replace(/^\/(men|women)$/, '/category/$1') ?? (isWomen ? '/category/women' : '/category/men'),
        buttonText: isWomen ? 'Shop Women' : 'Shop Men',
      };
    });
  };

  const [cards, setCards] = useState<any[]>(
    initialCampaigns ? getMappedCategories(initialCampaigns) : [],
  );
  const [isMounted, setIsMounted] = useState(!!initialCampaigns);

  useEffect(() => {
    setIsMounted(true);
    if (initialCampaigns) {
      return;
    }
    const loadCategories = async () => {
      try {
        const data = await fetcher<any[]>('/campaigns');
        if (Array.isArray(data) && data.length > 0) {
          const categoryBanners = getMappedCategories(data);
          if (categoryBanners.length > 0) {
            setCards(categoryBanners);
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load category banners from API:', err);
      }
    };
    void loadCategories();
  }, [initialCampaigns]);

  return (
    <section aria-labelledby="category-heading" className="relative py-12 md:py-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h2 id="category-heading" className="section-header">
            Shop by Category
          </h2>
        </header>

        {/* 2-Card Grid (Men & Women) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {!isMounted ? (
            <>
              {/* Category skeleton placeholders */}
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
            </>
          ) : cards.length > 0 ? (
            cards.map((cat) => (
              <article
                key={cat.id}
                className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl"
              >
                <Link href={cat.href} className="block h-full w-full">
                  <figure className="relative m-0 h-full w-full overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top"
                      priority
                    />
                    {/* Subtle vignette gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-95" />
                  </figure>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10">
                    <span className="mb-1 text-xs font-bold tracking-widest text-zinc-300 uppercase">
                      {cat.subtitle}
                    </span>
                    <h3 className="mb-6 text-3xl font-black tracking-tighter text-white uppercase sm:text-5xl">
                      {cat.title}
                    </h3>

                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold tracking-wider text-white uppercase backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black">
                        {cat.buttonText}
                        <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          ) : (
            <>
              {/* Category skeleton placeholders */}
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
