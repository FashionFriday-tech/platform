'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 400); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3l9.5 16.5H2.5L12 3z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-6">
      <div
        className={`pointer-events-auto flex items-center space-x-3 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-400 ease-out ${
          isVisible && !isLeaving
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-4 scale-95 opacity-0'
        } bg-black/90 dark:bg-white/95`}
      >
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${colors[type]} text-white`}>
          {icons[type]}
        </div>
        <span className="text-sm font-semibold text-white dark:text-black">{message}</span>
        <button
          onClick={() => {
            setIsLeaving(true);
            setTimeout(onClose, 400);
          }}
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-white/50 transition-colors hover:text-white dark:text-black/50 dark:hover:text-black"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
