'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';
import { fetcher } from '@/lib/api-client';



// Fallback static cards in case API fails or returns empty
const FALLBACK_CATEGORY_CARDS = [
  {
    id: 'men',
    title: "Men's Collection",
    subtitle: 'Streetwear, Footwear & Accessories',
    image: 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/men-clothing.webp',
    href: '/men',
    buttonText: 'Shop Men',
  },
  {
    id: 'women',
    title: "Women's Collection",
    subtitle: 'Curated Apparel & Statement Pieces',
    image: 'https://pub-e317eed21d2a444d893320e08f2a283d.r2.dev/categories/women-clothing.webp',
    href: '/women',
    buttonText: 'Shop Women',
  },
];

export default function CategoryCarousel() {
  // Load categories dynamically from public API
  const [cards, setCards] = useState(FALLBACK_CATEGORY_CARDS);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Fetch from campaigns endpoint to get the admin panel category setup
        const data = await fetcher<any[]>('/campaigns');
        if (Array.isArray(data) && data.length > 0) {
          const categoryBanners = data.filter(
            (b) => b.placement === 'home-categories' && b.isActive
          );

          if (categoryBanners.length > 0) {
            const mapped = categoryBanners.map((b) => {
              const isWomen = b.title?.toLowerCase().includes('women') || b.linkUrl?.toLowerCase().includes('women');
              return {
                id: b.id,
                title: b.title ?? (isWomen ? "Women's Collection" : "Men's Collection"),
                subtitle: isWomen ? 'women' : 'men',
                image: b.mediaUrl ?? b.image ?? '',
                href: b.linkUrl ?? (isWomen ? '/women' : '/men'),
                buttonText: isWomen ? 'Shop Women' : 'Shop Men',
              };
            });
            setCards(mapped);
            return;
          }
        }
        // Fallback if no active home-categories campaign banners are setup
        setCards(FALLBACK_CATEGORY_CARDS);
      } catch (err) {
        console.error('Failed to load category banners from API:', err);
        setCards(FALLBACK_CATEGORY_CARDS);
      }
    };
    loadCategories();
  }, []);

  return (
    <section
      aria-labelledby="category-heading"
      className="relative py-12 md:py-20"
    >
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h2
            id="category-heading"
            className="section-header"
          >
            Shop by Category
          </h2>
        </header>

        {/* 2-Card Grid (Men & Women) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {cards.map((cat) => (
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
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-10">
                  <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase mb-1">
                    {cat.subtitle}
                  </span>
                  <h3 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase mb-6">
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
          ))}
        </div>

        {/* View All Categories Button moved underneath the grid */}
        <div className="mt-10 flex justify-center w-full px-4">
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all active:scale-95 dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black text-black dark:text-white"
          >
            View All Categories <ArrowUpRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

