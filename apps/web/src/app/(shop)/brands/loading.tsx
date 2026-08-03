import { Skeleton } from '@/components/ui/skeleton';

export default function BrandsLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen px-4 pt-10 pb-24 md:px-10 md:pt-26">
      {/* Editorial Header Skeleton */}
      <header className="mb-10 text-center">
        <Skeleton className="mx-auto mb-2 h-14 w-64 rounded-xl sm:h-20 sm:w-96" />
        <Skeleton className="mx-auto h-12 w-48 rounded-xl sm:h-16 sm:w-72" />
      </header>

      {/* Sticky Bar Skeleton */}
      <div className="border-border/30 sticky top-14 z-30 mb-8 flex w-full items-center justify-between border-y px-1 py-3">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Grid of Skewed Brand Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton
            key={i}
            className="aspect-[3/4] w-full shrink-0 -skew-x-[6deg] rounded-2xl sm:rounded-3xl"
          />
        ))}
      </div>
    </main>
  );
}
