export default function AccountLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 xl:px-12 animate-pulse mt-14">
      {/* Header */}
      <div className="mb-8 h-10 w-48 rounded-lg bg-zinc-900/50 dark:bg-zinc-900/80" />

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="h-40 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
            <div className="h-48 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
          </div>
          
          <div className="h-64 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
        </div>
      </div>
    </div>
  );
}
