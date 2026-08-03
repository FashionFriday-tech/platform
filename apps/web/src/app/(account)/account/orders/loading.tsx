import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen pb-16">
      <header className="bg-background/80 border-border/40 sticky top-0 z-40 border-b backdrop-blur-md lg:top-6">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <Skeleton className="mx-auto mb-6 h-6 w-36 rounded-md sm:mx-0" />
          {/* Status Tabs Skeleton */}
          <div className="bg-background-muted/40 flex items-center gap-2 rounded-3xl p-1.5">
            <Skeleton className="h-9 flex-1 rounded-2xl" />
            <Skeleton className="h-9 flex-1 rounded-2xl" />
            <Skeleton className="h-9 flex-1 rounded-2xl" />
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 py-6 lg:pt-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-border/40 bg-background-muted/20 flex flex-col gap-4 rounded-3xl border p-5"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="aspect-square w-20 rounded-2xl" />
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                  <Skeleton className="h-3.5 w-1/3 rounded-sm" />
                  <Skeleton className="h-4 w-1/4 rounded-sm" />
                </div>
              </div>
              <div className="border-border/30 flex items-center justify-between border-t pt-3">
                <Skeleton className="h-3.5 w-24 rounded-sm" />
                <Skeleton className="h-8 w-24 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
