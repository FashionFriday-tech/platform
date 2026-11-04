'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isChunkError =
    error?.name === 'ChunkLoadError' ||
    /loading chunk|chunkloaderror|failed to fetch dynamically imported module/i.test(
      error?.message || '',
    );

  useEffect(() => {
    console.error('[Admin Global Error Boundary caught exception]:', error);

    // If chunk loading failed at root level, auto reload once
    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem('ff_admin_global_chunk_reload_ts') || 0);
      if (Date.now() - lastReload > 8000) {
        sessionStorage.setItem('ff_admin_global_chunk_reload_ts', String(Date.now()));
        window.location.reload();
      }
    }
  }, [error, isChunkError]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Application Error - Fashion Friday Admin</title>
        <style>{`
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #09090b;
            color: #fafafa;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1rem;
            box-sizing: border-box;
          }
          .card {
            background-color: #18181b;
            border: 1px solid #27272a;
            border-radius: 1.5rem;
            padding: 2.5rem;
            max-width: 28rem;
            width: 100%;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .icon-box {
            width: 4rem;
            height: 4rem;
            border-radius: 1rem;
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem auto;
          }
          h1 {
            font-size: 1.35rem;
            font-weight: 700;
            margin: 0 0 0.75rem 0;
            letter-spacing: -0.02em;
          }
          p {
            font-size: 0.875rem;
            color: #a1a1aa;
            line-height: 1.5;
            margin: 0 0 2rem 0;
          }
          .actions {
            display: flex;
            gap: 0.75rem;
            flex-direction: column;
          }
          button {
            border: none;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 600;
            border-radius: 0.75rem;
            cursor: pointer;
            transition: transform 0.15s ease, opacity 0.15s ease;
          }
          .btn-primary {
            background-color: #ffffff;
            color: #000000;
          }
          .btn-primary:active {
            transform: scale(0.98);
          }
          .btn-secondary {
            background: transparent;
            border: 1px solid #3f3f46;
            color: #e4e4e7;
          }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="icon-box">
            <svg
              width="32"
              height="32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1>{isChunkError ? 'Application Update Available' : 'Application Needs Reload'}</h1>
          <p>
            {isChunkError
              ? 'A fresh update has been deployed. Reloading the page will immediately apply the changes.'
              : 'The admin panel encountered an unexpected state. Reloading will safely reset and refresh the interface.'}
          </p>
          {error?.message && !isChunkError && (
            <div
              style={{
                margin: '0 0 1.5rem 0',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#ef4444',
                fontSize: '0.75rem',
                textAlign: 'left',
                wordBreak: 'break-word',
                fontFamily: 'monospace',
                maxHeight: '6rem',
                overflowY: 'auto',
              }}
            >
              {error.message}
            </div>
          )}
          <div className="actions">
            <button
              className="btn-primary"
              onClick={async () => {
                if (typeof window !== 'undefined') {
                  try {
                    if ('serviceWorker' in navigator) {
                      const registrations = await navigator.serviceWorker.getRegistrations();
                      for (const reg of registrations) {
                        await reg.unregister();
                      }
                    }
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      await Promise.all(keys.map((k) => caches.delete(k)));
                    }
                  } catch {
                    // ignore
                  }
                  window.location.reload();
                }
              }}
            >
              Reload Admin Panel
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                reset();
              }}
            >
              Try Again
            </button>
            <button
              className="btn-secondary"
              style={{ opacity: 0.8 }}
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
            >
              Reset Session & Sign In
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
