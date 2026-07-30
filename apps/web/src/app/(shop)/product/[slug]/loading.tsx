export default function ProductLoading() {
  return (
    <div className="container mx-auto mt-14 animate-pulse px-4 py-8 lg:px-8 xl:px-12">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 h-4 w-48 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />

      <div className="flex flex-col gap-10 md:flex-row lg:gap-16">
        {/* Gallery Skeleton */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="aspect-[4/5] w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="mt-4 flex gap-4 overflow-hidden">
            <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-20 w-20 shrink-0 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="flex w-full flex-col gap-6 pt-4 md:w-1/2 lg:w-2/5">
          <div className="h-10 w-3/4 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="h-6 w-1/4 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="h-8 w-1/3 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

          <div className="mt-4 h-[1px] w-full bg-zinc-800" />

          {/* Variant Skeleton */}
          <div className="mt-2 h-6 w-24 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="flex gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-12 w-12 rounded-full bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>

          {/* Buttons Skeleton */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="h-14 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-14 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>

          {/* Perks Skeleton */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="h-16 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-16 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
