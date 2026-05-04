export function Header() {
  return (
    <header className="glass-panel sticky top-4 z-30 mt-4 mr-4 mb-4 ml-2 flex h-20 flex-shrink-0 items-center justify-between rounded-2xl px-8">
      <div className="flex flex-1 items-center">
        <button className="mr-4 text-black/70 hover:text-black md:hidden dark:text-white/70 dark:hover:text-white">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="hidden max-w-md flex-1 items-center md:flex">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-black/40 dark:text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full rounded-full border border-black/10 bg-black/5 py-2 pr-12 pl-10 text-sm text-black placeholder-black/30 transition-all outline-none focus:border-black/30 focus:ring-black/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:border-white/30 dark:focus:ring-white/20"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="rounded border border-black/10 px-1.5 font-mono text-xs text-black/30 dark:border-white/10 dark:text-white/30">
                ⌘K
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
          <svg
            className="h-4 w-4 text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black ring-2 ring-white dark:bg-white dark:ring-black"></span>
        </button>

        <button className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-black/5 transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
          <svg
            className="h-4 w-4 text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black ring-2 ring-white dark:bg-white dark:ring-black"></span>
        </button>

        <div className="mx-2 h-6 w-px bg-black/10 dark:bg-white/10"></div>

        <div className="group flex cursor-pointer items-center space-x-3">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-black/10 dark:bg-white/20">
            <span className="text-xs font-bold text-black dark:text-white">JS</span>
            <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white/10"></div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-black group-hover:text-black/80 dark:text-white dark:group-hover:text-white/90">
              Jimmy Sullivan
            </p>
            <p className="text-xs text-black/50 dark:text-white/50">Odama Store</p>
          </div>
        </div>
      </div>
    </header>
  );
}
