import { Skeleton } from '@/components/ui/skeleton';

export default function CartLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen pt-[60px] pb-16 sm:pt-[92px] lg:pt-[170px] lg:pb-6">
      {/* Checkout Progress Stepper Skeleton */}
      <div className="mx-auto mb-8 max-w-2xl px-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="mx-4 h-0.5 flex-1 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="mx-4 h-0.5 flex-1 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <main className="max-w-8xl mx-auto px-4 pt-0 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left Column: Cart Items Skeleton */}
          <div className="flex-1 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="border-border/40 bg-background-muted/20 flex gap-4 rounded-3xl border p-4 sm:p-6"
              >
                <Skeleton className="aspect-square w-24 shrink-0 rounded-2xl sm:w-32" />
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-3.5 w-1/4 rounded-sm" />
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <Skeleton className="h-6 w-24 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <aside className="w-full self-start lg:sticky lg:top-48 lg:w-[420px] lg:shrink-0">
            <div className="border-border/40 bg-background-muted/30 flex flex-col gap-5 rounded-3xl border p-6">
              <Skeleton className="h-6 w-36 rounded-md" />

              <div className="flex flex-col gap-3.5 pt-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 rounded-sm" />
                  <Skeleton className="h-4 w-16 rounded-sm" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24 rounded-sm" />
                  <Skeleton className="h-4 w-16 rounded-sm" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16 rounded-sm" />
                  <Skeleton className="h-4 w-12 rounded-sm" />
                </div>
              </div>

              <div className="border-border/30 border-t" />

              <div className="flex justify-between">
                <Skeleton className="h-6 w-24 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>

              <Skeleton className="mt-2 h-13 w-full rounded-2xl" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
