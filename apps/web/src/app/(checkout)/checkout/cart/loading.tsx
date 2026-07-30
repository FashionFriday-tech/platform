export default function CartLoading() {
  return (
    <div className="container mx-auto mt-14 animate-pulse px-4 py-8 lg:px-8 xl:px-12">
      <div className="mb-8 h-10 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Cart Items */}
        <div className="flex flex-1 flex-col gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 rounded-3xl border border-zinc-800/50 p-4">
              <div className="aspect-square w-24 shrink-0 rounded-2xl bg-zinc-900/50 sm:w-32 dark:bg-zinc-900/80" />
              <div className="flex flex-1 flex-col justify-center gap-3">
                <div className="h-5 w-3/4 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-4 w-1/4 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-5 w-1/3 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full shrink-0 lg:w-[400px]">
          <div className="flex flex-col gap-6 rounded-3xl border border-zinc-800/50 p-6">
            <div className="h-8 w-40 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-4 w-16 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
                <div className="h-4 w-16 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
              </div>
            </div>

            <div className="h-[1px] w-full bg-zinc-800" />

            <div className="flex justify-between">
              <div className="h-6 w-24 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
              <div className="h-6 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
            </div>

            <div className="mt-2 h-14 w-full rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
