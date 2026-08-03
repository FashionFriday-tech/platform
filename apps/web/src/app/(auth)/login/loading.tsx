import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full items-center justify-center p-4">
      <div className="border-border/40 bg-background-muted/20 w-full max-w-md space-y-6 rounded-3xl border p-6 sm:p-10">
        {/* Brand / Logo skeleton */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Skeleton className="h-8 w-44 rounded-xl" />
          <Skeleton className="h-4 w-60 rounded-md" />
        </div>

        {/* Input box skeleton */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-13 w-full rounded-2xl" />
        </div>

        {/* Legal links skeleton */}
        <div className="flex justify-center gap-4 pt-2">
          <Skeleton className="h-3.5 w-24 rounded-sm" />
          <Skeleton className="h-3.5 w-24 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
