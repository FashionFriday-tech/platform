import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen pb-10 transition-colors lg:pt-20">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* LEFT SIDEBAR SKELETON */}
          <aside className="space-y-6 md:col-span-4">
            <div className="border-border/40 bg-background-elevated/40 rounded-4xl border p-6 text-center shadow-xs">
              <Skeleton className="mx-auto h-28 w-28 rounded-full" />
              <Skeleton className="mx-auto mt-4 h-6 w-32 rounded-md" />
              <Skeleton className="mx-auto mt-2 h-4 w-24 rounded-md" />
              <Skeleton className="mt-6 h-12 w-full rounded-3xl" />
            </div>
          </aside>

          {/* MAIN FORM SKELETON */}
          <div className="space-y-6 md:col-span-8">
            <div className="border-border/40 bg-background-elevated/40 rounded-4xl border p-6 shadow-xs">
              <Skeleton className="mb-6 h-6 w-48 rounded-md" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
                <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
