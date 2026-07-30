export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 xl:px-12 animate-pulse mt-14 max-w-4xl">
      {/* Checkout Steps Header */}
      <div className="mb-10 flex justify-between items-center px-4">
        <div className="h-4 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="h-[2px] flex-1 mx-4 bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="h-[2px] flex-1 mx-4 bg-zinc-800" />
        <div className="h-4 w-20 rounded bg-zinc-900/50 dark:bg-zinc-900/80" />
      </div>

      <div className="flex flex-col gap-10">
        {/* Form Section */}
        <div className="flex-1 rounded-3xl border border-zinc-800/50 p-6 md:p-10 flex flex-col gap-6">
          <div className="h-8 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80 mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
          <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80 md:col-span-2" />
            <div className="h-14 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
          
          <div className="mt-6 flex justify-end">
            <div className="h-14 w-full md:w-48 rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
