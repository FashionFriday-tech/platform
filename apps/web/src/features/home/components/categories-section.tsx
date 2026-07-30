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
        href:
          b.linkUrl?.replace(/^\/(men|women)$/, '/category/$1') ??
          (isWomen ? '/category/women' : '/category/men'),
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
    <section
      aria-labelledby="category-heading"
      className="relative pt-3 pb-10 sm:pt-6 sm:pb-12 md:py-20"
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <header className="mb-5 text-center sm:mb-8 md:mb-10">
          <h2 id="category-heading" className="section-header">
            Shop by Category
          </h2>
        </header>

        {/* 2-Card Grid (Men & Women) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          <style>{`
            @keyframes category-card-shine {
              0% {
                transform: translateX(-150%) skewX(-20deg);
                opacity: 0;
              }
              15% {
                opacity: 1;
              }
              45% {
                transform: translateX(150%) skewX(-20deg);
                opacity: 1;
              }
              46%, 100% {
                transform: translateX(150%) skewX(-20deg);
                opacity: 0;
              }
            }
            .category-card-shine {
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.05) 20%,
                rgba(255, 255, 255, 0.35) 50%,
                rgba(255, 255, 255, 0.05) 75%,
                transparent 100%
              );
              animation: category-card-shine 4.5s ease-in-out infinite;
            }
          `}</style>

          {!isMounted ? (
            <>
              {/* Category skeleton placeholders */}
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
              <div className="aspect-square w-full animate-pulse rounded-3xl bg-black/5 dark:bg-white/5" />
            </>
          ) : cards.length > 0 ? (
            cards.map((cat, idx) => (
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

                  {/* Luxury luminous shine sweep like in hero section active cards */}
                  <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl">
                    <div
                      className="category-card-shine absolute -top-1/2 -bottom-1/2 -left-1/2 h-[200%] w-[200%]"
                      style={{ animationDelay: `${idx * 1.8}s` }}
                    />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10">
                    <span className="mb-1 text-xs font-bold tracking-widest text-zinc-300 uppercase">
                      {cat.subtitle}
                    </span>
                    <h3 className="mb-6 text-3xl font-black tracking-tighter text-white uppercase sm:text-5xl">
                      {cat.title}
                    </h3>

                    <div>
                      <span className="inline-flex -skew-x-[12deg] items-stretch overflow-hidden rounded-xl border border-zinc-700 bg-black/80 shadow-lg backdrop-blur-md transition-all group-hover:border-zinc-500 sm:rounded-2xl">
                        <span className="flex skew-x-[12deg] items-center px-5 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-colors sm:text-sm">
                          {cat.buttonText}
                        </span>
                        <span className="flex shrink-0 items-center justify-center self-stretch rounded-r-xl bg-white px-3.5 text-black transition-all group-hover:bg-zinc-200 sm:rounded-r-2xl sm:px-4">
                          <span className="skew-x-[12deg]">
                            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </span>
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
