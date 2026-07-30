export default function ProductsLoading() {
  return (
    <div className="container mx-auto mt-14 animate-pulse px-4 py-8 lg:px-8 xl:px-12">
      {/* Header / Title */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-10 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="h-10 w-32 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Filters */}
        <div className="hidden w-64 shrink-0 flex-col gap-6 md:flex">
          <div className="h-40 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="h-64 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="h-40 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-4 w-3/4 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-4 w-1/2 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
