import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationsLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen px-4 pt-4 pb-20 md:px-8 lg:pt-20">
      <div className="mx-auto max-w-2xl">
        {/* Header & Tabs Skeleton */}
        <div className="mb-6 flex flex-col gap-4">
          <Skeleton className="h-8 w-44 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>

        {/* Notifications List Skeleton */}
        <div className="border-border/40 bg-background-muted/20 overflow-hidden rounded-3xl border">
          <div className="divide-border/20 divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-5">
                <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2 py-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 rounded-sm" />
                    <Skeleton className="h-3 w-16 rounded-sm" />
                  </div>
                  <Skeleton className="h-3.5 w-4/5 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
