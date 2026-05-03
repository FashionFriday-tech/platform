export function Header() {
  return (
    <header className="sticky top-4 h-20 flex-shrink-0 flex items-center justify-between px-8 z-30 mt-4 mb-4 ml-2 mr-4 rounded-2xl glass-panel">
      <div className="flex-1 flex items-center">
        <button className="md:hidden mr-4 text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm rounded-full focus:ring-black/20 dark:focus:ring-white/20 focus:border-black/30 dark:focus:border-white/30 block pl-10 pr-12 py-2 placeholder-black/30 dark:placeholder-white/30 transition-all outline-none"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-xs text-black/30 dark:text-white/30 font-mono border border-black/10 dark:border-white/10 rounded px-1.5">⌘K</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group">
          <svg className="w-4 h-4 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black"></span>
        </button>
        
        <button className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group">
          <svg className="w-4 h-4 text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black"></span>
        </button>

        <div className="h-6 w-px bg-black/10 dark:bg-white/10 mx-2"></div>

        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/20 overflow-hidden flex items-center justify-center relative">
             <span className="text-xs font-bold text-black dark:text-white">JS</span>
             <div className="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-black dark:text-white group-hover:text-black/80 dark:group-hover:text-white/90">Jimmy Sullivan</p>
            <p className="text-xs text-black/50 dark:text-white/50">Odama Store</p>
          </div>
        </div>
      </div>
    </header>
  );
}
