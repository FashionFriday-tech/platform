'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRightIcon } from '@ff/ui';

interface CollectionItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export default function CollectionsSection({
  initialCollections,
}: {
  initialCollections?: CollectionItem[];
}) {
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections || []);
  const [isLoading, setIsLoading] = useState(!initialCollections);
  const [isInView, setIsInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      });
      observerRef.current.observe(node);
    }
  }, []);

  useEffect(() => {
    if (initialCollections) {
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3002'}/collections`)
      .then((res) => res.json())
      .then((data) => {
        setCollections(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to fetch collections:', err);
        setIsLoading(false);
      });
  }, [initialCollections]);

  // Split the array for the mobile double-row configuration to prevent duplicates
  const midpoint = Math.ceil(collections.length / 2);
  const firstHalf = collections.slice(0, midpoint);
  const secondHalf = collections.slice(midpoint);

  // Duplicate subsets to allow seamless marquee looping
  const row1Items = [...firstHalf, ...firstHalf];
  const row2Items = [...secondHalf, ...secondHalf];

  // Full items duplicated for single-row desktop marquee
  const desktopItems = [...collections, ...collections];

  if (isLoading || collections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="collections-heading"
      className="relative overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14 md:pt-14 md:pb-18"
    >
      <div className="container mx-auto">
        <header className="mb-6 px-4 text-center sm:mb-8 lg:mb-10 lg:px-6">
          <h2 id="collections-heading" className="section-header">
            Shop by Collections
          </h2>
        </header>

        {/* Marquee tracks: single row on desktop (sm:block), two rows on mobile (sm:hidden) */}
        <div ref={containerRef} className="relative w-full overflow-hidden py-1 sm:py-3">
          <style>{`
            @keyframes collection-marquee-left {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes collection-marquee-right {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-collection-marquee-left {
              display: flex;
              width: max-content;
              animation: collection-marquee-left 35s linear infinite;
              gap: 1rem;
            }
            .animate-collection-marquee-right {
              display: flex;
              width: max-content;
              animation: collection-marquee-right 35s linear infinite;
              gap: 1rem;
            }
            @media (min-width: 640px) {
              .animate-collection-marquee-left,
              .animate-collection-marquee-right {
                gap: 1.5rem;
              }
            }
            .animate-collection-marquee-left:hover,
            .animate-collection-marquee-right:hover {
              animation-play-state: paused;
            }
          `}</style>

          {/* LARGE SCREENS ONLY: Single Row (Hidden on mobile under 640px) */}
          <div className="hidden sm:block">
            <div
              className="animate-collection-marquee-left relative z-10 px-6"
              style={{ animationPlayState: isInView ? 'running' : 'paused' }}
            >
              {desktopItems.map((item, index) => (
                <article
                  key={`desktop-${item.id}-${index}`}
                  className="group relative aspect-[3/4] h-[400px] w-[310px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl sm:rounded-3xl md:h-[480px] md:w-[360px] md:rounded-4xl"
                >
                  <Link
                    href={`/collections/${item.slug}`}
                    className="block h-full w-full"
                    title={`Browse ${item.name}`}
                  >
                    <figure className="absolute inset-0 m-0 h-full w-full scale-115 skew-x-[6deg]">
                      <Image
                        src={item.image}
                        alt={`Model featuring ${item.name} collection`}
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                    </figure>
                    <div className="absolute bottom-0 left-0 z-10 w-full skew-x-[6deg] p-8">
                      <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                        <p className="mb-2 text-sm font-medium text-zinc-300">
                          {item.productCount || 0} Items
                        </p>
                        <h3 className="text-xl font-black tracking-tighter text-white uppercase md:text-3xl">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* SMALL MOBILE DEVICES ONLY: Two Opposing Direction Rows (Hidden on screens >= 640px) */}
          <div className="flex flex-col gap-4 sm:hidden">
            {/* ROW 1: Moves Left */}
            <div
              className="animate-collection-marquee-left relative z-10 px-6"
              style={{ animationPlayState: isInView ? 'running' : 'paused' }}
            >
              {row1Items.map((item, index) => (
                <article
                  key={`r1-mobile-${item.id}-${index}`}
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl"
                >
                  <Link
                    href={`/collections/${item.slug}`}
                    className="block h-full w-full"
                    title={`Browse ${item.name}`}
                  >
                    <figure className="absolute inset-0 m-0 h-full w-full scale-115 skew-x-[6deg]">
                      <Image
                        src={item.image}
                        alt={`Model featuring ${item.name} collection`}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                    </figure>
                    <div className="absolute bottom-0 left-0 z-10 w-full skew-x-[6deg] p-4">
                      <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                        <p className="mb-1 text-[10px] font-medium text-zinc-300">
                          {item.productCount || 0} Items
                        </p>
                        <h3 className="text-lg font-black tracking-tighter text-white uppercase">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* ROW 2: Moves Right */}
            <div
              className="animate-collection-marquee-right relative z-10 px-6"
              style={{ animationPlayState: isInView ? 'running' : 'paused' }}
            >
              {row2Items.map((item, index) => (
                <article
                  key={`r2-mobile-${item.id}-${index}`}
                  className="group relative aspect-[3/4] h-[260px] w-[200px] shrink-0 -skew-x-[6deg] overflow-hidden rounded-2xl"
                >
                  <Link
                    href={`/collections/${item.slug}`}
                    className="block h-full w-full"
                    title={`Browse ${item.name}`}
                  >
                    <figure className="absolute inset-0 m-0 h-full w-full scale-115 skew-x-[6deg]">
                      <Image
                        src={item.image}
                        alt={`Model featuring ${item.name} collection`}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
                    </figure>
                    <div className="absolute bottom-0 left-0 z-10 w-full skew-x-[6deg] p-4">
                      <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                        <p className="mb-1 text-[10px] font-medium text-zinc-300">
                          {item.productCount || 0} Items
                        </p>
                        <h3 className="text-lg font-black tracking-tighter text-white uppercase">
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* View All Collections Button */}
        <div className="mt-6 flex w-full justify-center px-4 sm:mt-8 md:mt-10">
          <Link
            href="/collections"
            className="group inline-flex -skew-x-[12deg] items-stretch overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-600 hover:shadow-xl active:scale-95 sm:rounded-2xl dark:border-zinc-300 dark:bg-white dark:hover:border-zinc-100"
          >
            <span className="flex items-center skew-x-[12deg] px-6 py-3 text-xs font-black tracking-widest text-white uppercase transition-colors sm:px-7 sm:py-3.5 sm:text-sm dark:text-black">
              View All Collections
            </span>
            <span className="flex shrink-0 self-stretch items-center justify-center rounded-r-xl bg-white px-4 text-black transition-all group-hover:bg-zinc-200 sm:rounded-r-2xl sm:px-5 dark:bg-black dark:text-white dark:group-hover:bg-zinc-800">
              <span className="skew-x-[12deg]">
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
