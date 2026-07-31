import { HeroSkeleton } from '@/features/home';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      {/* 1. Hero Section Skeleton (Mobile Search Box + 3:5 Aspect Carousel with Peek Previews + Brand Logos) */}
      <HeroSkeleton />

      {/* 2. Categories Section Skeleton (Matches CategoriesSection) */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:py-12 lg:px-8">
        <div className="mb-4 h-6 w-36 rounded-md bg-zinc-200/80 dark:bg-zinc-900/80 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="aspect-square w-full rounded-3xl border border-zinc-200/60 bg-zinc-100/70 dark:border-white/5 dark:bg-zinc-900/60 animate-pulse" />
          <div className="aspect-square w-full rounded-3xl border border-zinc-200/60 bg-zinc-100/70 dark:border-white/5 dark:bg-zinc-900/60 animate-pulse" />
        </div>
      </section>

      {/* 3. Trending Collections / Products Grid Skeleton */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-6 lg:px-8">
        <div className="mb-4 h-6 w-44 rounded-md bg-zinc-200/80 dark:bg-zinc-900/80 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] w-full rounded-2xl border border-zinc-200/60 bg-zinc-100/60 dark:border-white/5 dark:bg-zinc-900/50 animate-pulse"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
