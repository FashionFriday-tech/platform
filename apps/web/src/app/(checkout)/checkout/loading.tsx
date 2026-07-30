export default function CheckoutLoading() {
  return (
    <div className="container mx-auto mt-14 max-w-4xl animate-pulse px-4 py-8 lg:px-8 xl:px-12">
      {/* Checkout Steps Header */}
      <div className="mb-10 flex items-center justify-between px-4">
        <div className="h-4 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="mx-4 h-[2px] flex-1 bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="mx-4 h-[2px] flex-1 bg-zinc-800" />
        <div className="h-4 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
      </div>

      <div className="flex flex-col gap-10">
        {/* Form Section */}
        <div className="flex flex-1 flex-col gap-6 rounded-3xl border border-zinc-800/50 p-6 md:p-10">
          <div className="mb-4 h-8 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
          <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 md:col-span-2 dark:bg-zinc-900/80" />
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>

          <div className="mt-6 flex justify-end">
            <div className="h-14 w-full rounded-2xl bg-zinc-900/50 md:w-48 dark:bg-zinc-900/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
