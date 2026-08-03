import { Skeleton } from '@/components/ui/skeleton';
import { HeroSkeleton } from '@/features/home';

export default function Loading() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col">
      {/* 1. Hero Section Skeleton (Mobile Search Box + Carousel + Brand Ticker) */}
      <HeroSkeleton />

      {/* 2. Categories Section Skeleton */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:py-12 lg:px-8">
        <Skeleton className="mb-6 h-6 w-36 rounded-md" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <Skeleton className="aspect-square w-full rounded-3xl" />
        </div>
      </section>

      {/* 3. Trending Collections / Products Grid Skeleton */}
      <section className="mx-auto w-full max-w-screen-2xl px-4 py-6 lg:px-8">
        <Skeleton className="mb-6 h-6 w-44 rounded-md" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
