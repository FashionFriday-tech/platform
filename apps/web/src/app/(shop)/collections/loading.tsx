import { Skeleton } from '@/components/ui/skeleton';

export default function CollectionsLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen px-4 pt-10 pb-24 md:px-10 md:pt-26">
      {/* Editorial Header Skeleton */}
      <header className="mb-10 text-center">
        <Skeleton className="mx-auto mb-2 h-14 w-40 rounded-xl sm:h-20 sm:w-60" />
        <Skeleton className="mx-auto h-12 w-64 rounded-xl sm:h-16 sm:w-96" />
      </header>

      {/* Grid of Collection Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl">
            <Skeleton className="h-full w-full rounded-4xl" />
          </div>
        ))}
      </div>
    </main>
  );
}
