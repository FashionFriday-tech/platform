export default function AccountLoading() {
  return (
    <div className="container mx-auto mt-14 animate-pulse px-4 py-8 lg:px-8 xl:px-12">
      {/* Header */}
      <div className="mb-8 h-10 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Navigation */}
        <div className="flex w-full shrink-0 flex-col gap-4 md:w-64">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col gap-6">
          <div className="h-40 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-48 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-48 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>

          <div className="h-64 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
        </div>
      </div>
    </div>
  );
}
