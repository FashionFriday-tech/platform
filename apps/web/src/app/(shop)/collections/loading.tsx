export default function CategoriesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 xl:px-12 animate-pulse mt-14">
      {/* Header */}
      <div className="mb-10 h-12 w-64 rounded-xl bg-zinc-900/50 dark:bg-zinc-900/80 mx-auto" />

      {/* Grid of Skewed Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] w-full shrink-0 -skew-x-[6deg] rounded-2xl bg-zinc-900/50 dark:bg-zinc-900/80 sm:rounded-3xl"
          />
        ))}
      </div>
    </div>
  );
}
