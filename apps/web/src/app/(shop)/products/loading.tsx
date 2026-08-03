import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className="bg-background text-foreground flex w-full flex-col">
      {/* Top Search & Filter Bar Skeleton */}
      <div className="border-border/40 relative z-20 w-full border-b px-4 py-3 sm:px-6 lg:mt-20 lg:px-12">
        <div className="w-full lg:pl-80">
          <div className="flex max-w-2xl items-center gap-3">
            <Skeleton className="h-11 w-full rounded-md sm:rounded-lg" />
          </div>
        </div>
      </div>

      {/* Mobile Actions Bar Skeleton */}
      <div className="border-border/40 flex w-full border-b py-2.5 lg:hidden">
        <div className="flex flex-1 justify-center">
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>
        <div className="border-border/30 h-5 w-[1px] border-r" />
        <div className="flex flex-1 justify-center">
          <Skeleton className="h-5 w-24 rounded-md" />
        </div>
        <div className="border-border/30 h-5 w-[1px] border-r" />
        <div className="flex flex-1 justify-center">
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>

      {/* Main Grid Area */}
      <main className="w-full max-w-none px-4 pt-4 pb-16 md:px-8 xl:px-10 2xl:px-14">
        {/* Desktop Fixed Sidebar Skeleton */}
        <div className="fixed top-20 z-20 hidden h-[calc(100vh-6rem)] w-72 shrink-0 flex-col gap-6 pr-6 lg:flex">
          <div className="border-border/30 flex items-center justify-between border-b pb-4">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-4 w-16 rounded-md" />
          </div>
          {/* Filter Group 1 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20 rounded-md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
          </div>
          {/* Filter Group 2 */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
          {/* Price Range Slider */}
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="w-full lg:pl-80">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="hidden h-5 w-36 rounded-md sm:block" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[3/4] w-full rounded-2xl sm:rounded-3xl" />
                <div className="flex flex-col gap-1.5 px-1">
                  <Skeleton className="h-3.5 w-1/3 rounded-sm" />
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                  <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-4 w-16 rounded-sm" />
                    <Skeleton className="h-3.5 w-12 rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
