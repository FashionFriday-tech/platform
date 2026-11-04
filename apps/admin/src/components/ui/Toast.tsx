'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3500, onClose }: ToastProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [duration, isMounted, onClose]);

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  const icons = {
    success: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 9v2m0 4h.01M12 3l9.5 16.5H2.5L12 3z"
        />
      </svg>
    ),
  };

  const statusStyles = {
    success: {
      badgeBg:
        'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-500/30',
      borderAccent: 'border-l-4 border-l-emerald-500 dark:border-l-emerald-400',
      label: 'Success',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
    },
    error: {
      badgeBg:
        'bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:ring-rose-500/30',
      borderAccent: 'border-l-4 border-l-rose-500 dark:border-l-rose-400',
      label: 'Error',
      labelColor: 'text-rose-600 dark:text-rose-400',
    },
    warning: {
      badgeBg:
        'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:ring-amber-500/30',
      borderAccent: 'border-l-4 border-l-amber-500 dark:border-l-amber-400',
      label: 'Notice',
      labelColor: 'text-amber-600 dark:text-amber-400',
    },
  };

  const currentStyle = statusStyles[type] || statusStyles.success;

  return createPortal(
    <div className="toast-safe-top pointer-events-none fixed inset-0 z-[99999] flex items-start justify-center px-4">
      <div
        className={`pointer-events-auto flex max-w-[92vw] items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-black shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out sm:max-w-md sm:gap-3.5 sm:px-5 sm:py-3.5 dark:border-white/15 dark:bg-[#121214] dark:text-white ${currentStyle.borderAccent} ${
          isVisible && !isLeaving
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${currentStyle.badgeBg}`}
        >
          {icons[type]}
        </div>
        <div className="flex min-w-0 flex-1 flex-col pr-1">
          <span
            className={`text-[10px] font-black tracking-wider uppercase ${currentStyle.labelColor}`}
          >
            {currentStyle.label}
          </span>
          <span className="text-xs font-semibold text-black sm:text-sm dark:text-white">
            {message}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 300);
          }}
          aria-label="Close notification"
          className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
