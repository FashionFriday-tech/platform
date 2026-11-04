'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3500, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 400); // Wait for exit animation
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

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
      badgeBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      borderAccent: 'border-l-4 border-l-emerald-500',
      label: 'Success',
      labelColor: 'text-emerald-400',
    },
    error: {
      badgeBg: 'bg-red-500/15 text-red-400 border border-red-500/30',
      borderAccent: 'border-l-4 border-l-red-500',
      label: 'Error',
      labelColor: 'text-red-400',
    },
    warning: {
      badgeBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      borderAccent: 'border-l-4 border-l-amber-500',
      label: 'Notice',
      labelColor: 'text-amber-400',
    },
  };

  const currentStyle = statusStyles[type] || statusStyles.success;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-6">
      <div
        className={`pointer-events-auto flex items-center gap-3.5 rounded-2xl bg-black px-5 py-3.5 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur-xl transition-all duration-400 ease-out dark:bg-zinc-950 dark:ring-white/10 ${currentStyle.borderAccent} ${
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
        <div className="flex flex-col pr-1">
          <span
            className={`text-[10px] font-black tracking-wider uppercase ${currentStyle.labelColor}`}
          >
            {currentStyle.label}
          </span>
          <span className="text-sm font-medium text-white">{message}</span>
        </div>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 400);
          }}
          className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white"
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
    </div>
  );
}
