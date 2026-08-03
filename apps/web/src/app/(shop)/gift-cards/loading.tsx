import { Skeleton } from '@/components/ui/skeleton';

export default function GiftCardsLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-20 pb-32">
        {/* HERO SECTION SKELETON */}
        <div className="mb-16 flex flex-col items-center justify-between pt-10 md:mb-24 md:flex-row">
          <div className="mb-8 w-full text-center md:w-1/2 md:text-left">
            <Skeleton className="mb-4 h-12 w-64 rounded-xl sm:h-16 sm:w-80" />
            <Skeleton className="h-5 w-4/5 max-w-md rounded-md" />
          </div>

          {/* Hero Wallet Card Skeleton */}
          <div className="w-full max-w-md">
            <Skeleton className="aspect-[1.58/1] w-full rounded-4xl" />
          </div>
        </div>

        {/* SECTION 1: Social Tasks Skeleton */}
        <div className="space-y-16">
          <section>
            <div className="mb-8 flex items-center gap-3 px-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-7 w-48 rounded-md" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-3xl" />
              ))}
            </div>
          </section>

          {/* SECTION 2: Milestones Skeleton */}
          <section>
            <div className="mb-8 flex items-center gap-3 px-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-7 w-44 rounded-md" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full rounded-3xl" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
