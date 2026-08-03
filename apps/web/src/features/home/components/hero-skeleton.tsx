import type { JSX } from 'react';

import { SearchIcon } from '@ff/ui';

export function HeroSkeleton(): JSX.Element {
  // Strict 3:5 aspect ratio matching Hero.tsx
  const mobileCardStyle = {
    height: '100%',
    maxHeight: '550px',
    width: 'auto',
    maxWidth: '84vw',
    aspectRatio: '3 / 5',
  };

  return (
    <section className="relative flex h-[calc(100dvh-82px)] max-h-[calc(100dvh-82px)] w-full flex-col items-center justify-between px-0 pb-12 lg:mt-28 lg:block lg:h-auto lg:max-h-none lg:min-h-0 lg:p-6 lg:pb-0">
      {/* 1. Mobile Search Bar Skeleton: Exact match with search-box.tsx trigger mode */}
      <div className="flex w-full shrink-0 items-center justify-center px-4 py-3 sm:py-4 lg:hidden">
        <div className="relative flex w-full -skew-x-[12deg] items-center overflow-hidden rounded-md border border-zinc-300/80 bg-white px-5 py-2.5 sm:-skew-x-[14deg] sm:rounded-lg dark:border-zinc-800 dark:bg-black">
          <div className="flex w-full skew-x-[12deg] items-center gap-3 sm:skew-x-[14deg]">
            <SearchIcon className="h-4.5 w-4.5 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <div className="h-3.5 w-44 animate-pulse rounded-sm bg-zinc-200/90 dark:bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* 2. Mobile/Tablet Carousel Skeleton (Active Center Card + Left/Right Peek Previews) */}
      <div className="relative flex w-full flex-1 shrink-0 items-center justify-center overflow-hidden select-none lg:hidden">
        <div className="relative flex h-full w-full items-center justify-center py-1 sm:py-1.5">
          {/* Sizing spacer keeping strict 3:5 aspect ratio */}
          <div style={mobileCardStyle} className="pointer-events-none mx-auto opacity-0" />

          {/* Cards Track with Center Card and Left & Right Peek Cards */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Left Peek Card (offset -1) */}
            <div
              style={{
                ...mobileCardStyle,
                transform: 'translate(calc(-50% - 103%), -50%) scale(0.92)',
              }}
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[32px] border border-zinc-200/60 bg-zinc-100/70 opacity-80 sm:rounded-[38px] sm:opacity-90 dark:border-white/5 dark:bg-zinc-900/60"
            >
              <div className="hero-skeleton-shine absolute inset-0" />
            </div>

            {/* Active Center Card (offset 0) */}
            <div
              style={{
                ...mobileCardStyle,
                transform: 'translate(-50%, -50%) scale(1)',
                zIndex: 20,
              }}
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[32px] border border-zinc-300/80 bg-zinc-200/90 shadow-2xl sm:rounded-[38px] dark:border-white/10 dark:bg-zinc-900/95"
            >
              {/* Luxury Shimmer Sweep */}
              <div className="hero-skeleton-shine absolute inset-0 z-10" />

              {/* Minimalist Poster Mock Skeleton inside Card */}
              <div className="relative flex h-full w-full flex-col justify-between p-6 sm:p-8">
                {/* Top Poster Header Mock */}
                <div className="flex items-center justify-between opacity-40">
                  <div className="h-4 w-20 animate-pulse rounded bg-zinc-400/50 dark:bg-zinc-700/50" />
                  <div className="h-3 w-12 animate-pulse rounded bg-zinc-400/40 dark:bg-zinc-700/40" />
                </div>

                {/* Center Graphic Silhouette */}
                <div className="flex flex-1 items-center justify-center opacity-25">
                  <div className="h-32 w-32 animate-pulse rounded-full border border-zinc-400/30 dark:border-zinc-700/40" />
                </div>

                {/* Bottom Typography Silhouette */}
                <div className="space-y-2 opacity-50">
                  <div className="h-6 w-3/4 animate-pulse rounded-sm bg-zinc-400/60 dark:bg-zinc-700/60" />
                  <div className="h-3 w-1/2 animate-pulse rounded-sm bg-zinc-400/40 dark:bg-zinc-700/40" />
                </div>
              </div>
            </div>

            {/* Right Peek Card (offset +1) */}
            <div
              style={{
                ...mobileCardStyle,
                transform: 'translate(calc(-50% + 103%), -50%) scale(0.92)',
              }}
              className="absolute top-1/2 left-1/2 overflow-hidden rounded-[32px] border border-zinc-200/60 bg-zinc-100/70 opacity-80 sm:rounded-[38px] sm:opacity-90 dark:border-white/5 dark:bg-zinc-900/60"
            >
              <div className="hero-skeleton-shine absolute inset-0" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Brand Logo Rows Skeleton (BrandScroll representation) */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center gap-2 pt-1 pb-1 lg:hidden">
        {/* Row 1 Logos */}
        <div className="flex w-full items-center justify-center gap-4 overflow-hidden px-4 opacity-50">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`b1-${i}`}
              className="h-8 w-14 shrink-0 animate-pulse rounded-md border border-zinc-300/40 bg-zinc-200/60 sm:h-9 sm:w-16 dark:border-white/5 dark:bg-zinc-900/70"
            />
          ))}
        </div>
        {/* Row 2 Logos */}
        <div className="flex w-full items-center justify-center gap-4 overflow-hidden px-4 opacity-35">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`b2-${i}`}
              className="h-8 w-14 shrink-0 animate-pulse rounded-md border border-zinc-300/30 bg-zinc-200/40 sm:h-9 sm:w-16 dark:border-white/5 dark:bg-zinc-900/50"
            />
          ))}
        </div>
      </div>

      {/* 4. Desktop Scrolling Marquee Skeleton (lg:block) */}
      <div className="hidden w-full overflow-hidden lg:block">
        <div className="flex h-[75vh] items-stretch gap-6 px-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/5] h-full shrink-0 overflow-hidden rounded-4xl border border-zinc-300/60 bg-zinc-200/80 dark:border-white/10 dark:bg-zinc-900/90"
            >
              <div className="hero-skeleton-shine absolute inset-0" />
              <div className="flex h-full w-full flex-col justify-end p-8 opacity-40">
                <div className="mb-2 h-7 w-2/3 animate-pulse rounded bg-zinc-400/60 dark:bg-zinc-700/60" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-zinc-400/40 dark:bg-zinc-700/40" />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Brand Marquee Skeleton */}
        <div className="mt-6 flex h-14 w-full items-center justify-between gap-6 overflow-hidden px-6 opacity-40">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`desk-brand-${i}`}
              className="h-9 w-24 shrink-0 animate-pulse rounded-lg border border-zinc-300/40 bg-zinc-200/60 dark:border-white/5 dark:bg-zinc-900/70"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hero-skeleton-shine {
          0% {
            transform: translateX(-150%) skewX(-20deg);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          50% {
            transform: translateX(150%) skewX(-20deg);
            opacity: 0.6;
          }
          100% {
            transform: translateX(150%) skewX(-20deg);
            opacity: 0;
          }
        }
        .hero-skeleton-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 0, 0, 0.03) 20%,
            rgba(0, 0, 0, 0.08) 50%,
            rgba(0, 0, 0, 0.03) 80%,
            transparent 100%
          );
          animation: hero-skeleton-shine 2.6s ease-in-out infinite;
        }
        :global(.dark) .hero-skeleton-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.02) 20%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0.02) 80%,
            transparent 100%
          );
        }
      `}</style>
    </section>
  );
}
