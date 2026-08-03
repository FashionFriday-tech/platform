import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 pt-20 pb-20 sm:px-8 lg:px-12">
      {/* Gender Toggle Tabs Skeleton */}
      <div className="mx-auto mb-8 flex max-w-xs items-center justify-center gap-3">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 flex-1 rounded-full" />
      </div>

      {/* Featured Category Hero Banner Skeleton */}
      <div className="mx-auto mb-10 max-w-5xl">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl sm:aspect-[21/9]" />
      </div>

      {/* Category Tiles Grid Skeleton */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-5 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
