import { Skeleton } from '@/components/ui/skeleton';

export default function CheckoutLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen pt-[60px] pb-16 sm:pt-[92px] lg:pt-[170px] lg:pb-6">
      {/* Checkout Progress Stepper Skeleton */}
      <div className="mx-auto mb-10 max-w-2xl px-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="mx-4 h-0.5 flex-1 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="mx-4 h-0.5 flex-1 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="border-border/40 bg-background-muted/20 flex flex-col gap-8 rounded-3xl border p-6 md:p-10">
          <Skeleton className="h-7 w-48 rounded-md" />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-13 w-full rounded-xl" />
            <Skeleton className="h-13 w-full rounded-xl" />
          </div>
          <Skeleton className="h-13 w-full rounded-xl" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Skeleton className="h-13 w-full rounded-xl md:col-span-2" />
            <Skeleton className="h-13 w-full rounded-xl" />
          </div>

          <div className="mt-4 flex justify-end">
            <Skeleton className="h-13 w-full rounded-2xl md:w-56" />
          </div>
        </div>
      </main>
    </div>
  );
}
