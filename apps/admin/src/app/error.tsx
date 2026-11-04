'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const isChunkError =
    error?.name === 'ChunkLoadError' ||
    /loading chunk|chunkloaderror|failed to fetch dynamically imported module/i.test(
      error?.message || '',
    );

  useEffect(() => {
    console.error('[Admin Error Boundary caught exception]:', error);

    // If a deployment occurred and the browser is trying to fetch an old chunk hash,
    // automatically hard reload to download the fresh HTML and JS chunks
    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem('ff_admin_chunk_reload_ts') || 0);
      if (Date.now() - lastReload > 8000) {
        sessionStorage.setItem('ff_admin_chunk_reload_ts', String(Date.now()));
        window.location.reload();
      }
    }
  }, [error, isChunkError]);

  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-center text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-100">
          {isChunkError ? 'Application Update Available' : 'Something Went Wrong'}
        </h1>

        <p className="mt-3 text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {isChunkError
            ? 'A new version of the admin panel was recently published. Reloading will apply the latest update and restore full functionality.'
            : error?.message ||
              'An unexpected error occurred while loading this view. You can reload or return to the dashboard.'}
        </p>

        {error?.digest && (
          <div className="mt-4 rounded-xl bg-black/5 p-2 text-center font-mono text-xs text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
            Error ID: {error.digest}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reload Page
          </button>

          <button
            onClick={() => {
              reset();
            }}
            className="flex flex-1 items-center justify-center rounded-xl border border-black/10 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
          >
            Try Again
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                try {
                  localStorage.removeItem('ff_admin_user');
                  localStorage.removeItem('adminAccessToken');
                  localStorage.removeItem('adminRefreshToken');
                  sessionStorage.clear();
                  if ('caches' in window) {
                    void caches
                      .keys()
                      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
                  }
                } catch {
                  // ignore
                }
                window.location.href = '/login';
              }
            }}
            className="text-xs font-semibold text-red-500 underline underline-offset-4 hover:text-red-600"
          >
            Reset Session & Return to Login
          </button>
          <Link
            href="/"
            className="text-xs font-semibold text-zinc-500 underline underline-offset-4 hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
