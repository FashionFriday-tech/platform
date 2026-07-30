export default function Loading() {
  return (
    <div className="bg-background mx-auto flex min-h-screen w-full max-w-screen-2xl animate-pulse flex-col gap-6 p-4 pt-24 lg:pt-32">
      {/* Hero / Top Banner Skeleton */}
      <div className="h-[30vh] w-full rounded-3xl bg-zinc-900/50 sm:h-[40vh] dark:bg-zinc-900/80" />

      {/* Generic Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="h-64 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="h-64 w-full rounded-3xl bg-zinc-900/50 dark:bg-zinc-900/80" />
        <div className="hidden h-64 w-full rounded-3xl bg-zinc-900/50 md:block dark:bg-zinc-900/80" />
        <div className="hidden h-64 w-full rounded-3xl bg-zinc-900/50 lg:block dark:bg-zinc-900/80" />
      </div>
    </div>
  );
}
