import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistLoading() {
  return (
    <main className="bg-background text-foreground min-h-screen md:pt-20">
      <div className="bg-background/95 sticky top-[3.5rem] z-40 pt-2 pb-4 backdrop-blur-xl md:top-[5rem]">
        <header className="border-border/30 rounded-4xl border-b px-2">
          <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </header>

        {/* Category Pills Skeleton */}
        <div className="mx-auto mt-4 flex max-w-md gap-2 px-4">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-border/40 bg-background-muted/20 flex gap-4 rounded-3xl border p-4"
            >
              <Skeleton className="aspect-square w-24 shrink-0 rounded-2xl" />
              <div className="flex flex-1 flex-col justify-between py-1">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                  <Skeleton className="h-3.5 w-1/3 rounded-sm" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-20 rounded-sm" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
