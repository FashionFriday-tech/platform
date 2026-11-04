'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-zinc-900/80">
        <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-xs font-bold tracking-wider text-black/60 uppercase dark:bg-white/5 dark:text-white/60">
          404 Not Found
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Page Does Not Exist
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The admin route or resource you are looking for could not be found. It may have been
          moved, renamed, or deleted.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
