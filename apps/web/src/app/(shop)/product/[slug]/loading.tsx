import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 pt-4 pb-16 md:px-8 lg:pt-24">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16 rounded-sm" />
        <span className="text-foreground/20">/</span>
        <Skeleton className="h-4 w-24 rounded-sm" />
        <span className="text-foreground/20">/</span>
        <Skeleton className="h-4 w-32 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        {/* LEFT: Image Gallery Skeleton */}
        <div className="flex flex-col gap-4 lg:col-span-6">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="flex gap-3 overflow-hidden">
            <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
            <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
            <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
            <Skeleton className="h-20 w-20 shrink-0 rounded-2xl" />
          </div>
        </div>

        {/* RIGHT: Product Details Skeleton */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-span-6">
          {/* Eyebrow & Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-md" />
            </div>
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          {/* Title & Brand */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-4/5 rounded-md sm:h-10" />
            <Skeleton className="h-4 w-1/3 rounded-sm" />
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-9 w-32 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          <div className="border-border/30 border-t pt-4">
            {/* Size Selector */}
            <div className="mb-3 flex items-center justify-between">
              <Skeleton className="h-4 w-24 rounded-sm" />
              <Skeleton className="h-4 w-16 rounded-sm" />
            </div>
            <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-xl" />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <Skeleton className="h-13 w-full rounded-full" />
            <Skeleton className="h-13 w-full rounded-full" />
          </div>

          {/* Feature Perks */}
          <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
