'use client';

import { useEffect, useState } from 'react';

import { RefreshCw, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function ServiceWorkerRegister() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

    // Prevent any browser-internal service worker update rejection from surfacing in Next.js error overlay
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as unknown;
      const message =
        reason instanceof Error ? reason.message : typeof reason === 'string' ? reason : '';
      if (message.includes('ServiceWorker') || message.includes('sw.js')) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', handleRejection);

    // Clean up any stale, orphan, or corrupted service worker registrations
    navigator.serviceWorker
      .getRegistrations()
      .then(async (registrations) => {
        for (const reg of registrations) {
          const script =
            reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL;
          if (!script?.endsWith('/sw.js')) {
            await reg.unregister().catch(() => null);
          }
        }
      })
      .catch(() => null);

    let cleanupVisibility: (() => void) | null = null;

    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        // If there is already a waiting worker, prompt user to update
        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting);
          setShowPrompt(true);
        }

        // Listen for new worker updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) {
            return;
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(installingWorker);
              setShowPrompt(true);
            }
          };
        };

        // Proactively check for code updates immediately on launch
        registration.update().catch(() => null);

        // Check for updates whenever the user returns to the PWA (resumes app)
        const handleVisibility = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => null);
          }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // Periodically check every 15 minutes while app is running
        const intervalId = setInterval(
          () => {
            registration.update().catch(() => null);
          },
          15 * 60 * 1000,
        );

        cleanupVisibility = () => {
          document.removeEventListener('visibilitychange', handleVisibility);
          clearInterval(intervalId);
        };
      })
      .catch(() => {
        // Silent catch
      });

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      if (cleanupVisibility) {
        cleanupVisibility();
      }
    };
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
    // Safety fallback: if controllerchange doesn't fire within 2s, force reload
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.aside
          role="status"
          aria-live="polite"
          aria-label="App update available"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-20 left-1/2 z-[110] flex w-max max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/20 bg-[#0a0a0a]/95 px-3.5 py-2.5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:max-w-md lg:bottom-6 dark:border-black/15 dark:bg-white/95 dark:text-black"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-600">
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="min-w-0 pr-1">
            <p className="truncate text-xs font-black tracking-tight uppercase">Update Available</p>
            <p className="truncate text-[10px] text-white/60 dark:text-black/60">
              Tap to load latest version
            </p>
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3.5 py-1.5 text-xs font-black tracking-wide text-black uppercase transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 dark:bg-black dark:text-white"
          >
            {isUpdating && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
            <span>{isUpdating ? 'Updating...' : 'Update'}</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 p-1 text-white/40 transition-colors hover:text-white dark:text-black/40 dark:hover:text-black"
            aria-label="Dismiss update notification"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
