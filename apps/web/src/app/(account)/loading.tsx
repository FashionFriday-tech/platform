import { Skeleton } from '@/components/ui/skeleton';

export default function AccountLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-8xl mx-auto px-4 py-8 sm:px-10 sm:py-16">
        {/* 1. Member Area / Profile Card Skeleton */}
        <section className="mx-auto mb-10 max-w-4xl">
          <div className="border-border/40 bg-background-muted/40 relative overflow-hidden rounded-[2.5rem] border p-6 text-center sm:p-10 md:p-12">
            <Skeleton className="mx-auto mb-3 h-8 w-64 rounded-xl sm:h-12 sm:w-96" />
            <Skeleton className="mx-auto mb-6 h-4 w-4/5 max-w-md rounded-md" />

            {/* Quick badges */}
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>

            {/* CTA button */}
            <Skeleton className="mx-auto h-12 w-48 rounded-xl sm:h-14 sm:w-56" />
          </div>
        </section>

        {/* 2. Quick Links Grid Skeleton */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between px-2">
            <Skeleton className="h-5 w-32 rounded-md" />
          </div>

          <div className="divide-border/20 grid grid-cols-1 divide-y sm:grid-cols-2 sm:gap-4 sm:divide-y-0 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="sm:border-border/30 sm:bg-background-muted/20 flex items-center gap-4 p-4 sm:flex-col sm:items-center sm:rounded-3xl sm:border sm:p-6"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-2xl sm:h-12 sm:w-12" />
                <div className="flex flex-1 flex-col gap-2 sm:w-full sm:items-center">
                  <Skeleton className="h-5 w-24 rounded-md sm:w-32" />
                  <Skeleton className="hidden h-3 w-40 rounded-md sm:block" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
