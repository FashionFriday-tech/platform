import { Skeleton } from '@/components/ui/skeleton';

export default function SearchLoading() {
  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-80px)] w-full">
      {/* 1. Top Search Bar Skeleton */}
      <div className="bg-background/95 border-border/40 sticky top-14 z-30 w-full border-b px-4 py-3 backdrop-blur-xl sm:px-6 lg:top-20 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          <Skeleton className="h-12 w-full -skew-x-[12deg] rounded-md sm:-skew-x-[14deg] sm:rounded-lg" />
        </div>
      </div>

      {/* 2. Main Search Content Skeleton */}
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:px-12">
        {/* Popular Searches Badges Skeleton */}
        <div className="border-border/30 border-b pb-5">
          <Skeleton className="mb-3 h-3 w-28 rounded-sm" />
          <div className="flex items-center gap-3 overflow-hidden py-1">
            <Skeleton className="h-8 w-32 -skew-x-[12deg] rounded-md sm:-skew-x-[14deg]" />
            <Skeleton className="h-8 w-44 -skew-x-[12deg] rounded-md sm:-skew-x-[14deg]" />
            <Skeleton className="h-8 w-28 -skew-x-[12deg] rounded-md sm:-skew-x-[14deg]" />
            <Skeleton className="hidden h-8 w-36 -skew-x-[12deg] rounded-md sm:block sm:-skew-x-[14deg]" />
          </div>
        </div>

        {/* Recent Searches List Skeleton */}
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28 rounded-sm" />
            <Skeleton className="h-3 w-16 rounded-sm" />
          </div>

          <div className="divide-border/20 flex flex-col divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <Skeleton className="h-4 w-40 rounded-sm sm:w-60" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
