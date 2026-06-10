'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import { BellIcon, LogOutIcon } from '@ff/ui';

import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/features/notifications';

export function SidebarFooter() {
  const pathname = usePathname() ?? '';
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!user) {
    return null;
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Error attempting to enable fullscreen: ${msg}`);
      });
    } else {
      if (document.exitFullscreen) {
        void document.exitFullscreen();
      }
    }
  };

  const isDark = mounted && theme === 'dark';
  const isNotificationsActive =
    pathname === '/notifications' || pathname.startsWith('/notifications/');

  return (
    <div className="relative shrink-0 border-t border-black/5 p-3 dark:border-white/5">
      {/* Main Bottom Box Card */}
      <div className="flex flex-col gap-2 rounded-2xl bg-black p-2.5 text-white shadow-xl dark:bg-white dark:text-black dark:shadow-md">
        {/* Profile Info Item */}
        <Link
          href="/profile"
          className="group flex items-center justify-between rounded-xl p-1.5 transition-all hover:bg-white/10 dark:hover:bg-black/5"
          title="Open Profile Settings"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-xs font-black text-black shadow-xs transition-transform group-hover:scale-105 dark:bg-black dark:text-white">
              {user.initials}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-bold text-white transition-colors group-hover:text-white/90 dark:text-black dark:group-hover:text-black/90">
                {user.name}
              </p>
              <p className="truncate text-[10px] font-medium tracking-wider text-white/60 uppercase dark:text-black/60">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors group-hover:bg-white/10 group-hover:text-white dark:text-black/50 dark:group-hover:bg-black/10 dark:group-hover:text-black">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Action Icons Grid */}
        <div className="flex items-center justify-between border-t border-white/10 pt-2 dark:border-black/10">
          {/* Light / Dark Mode Toggle Icon */}
          <button
            type="button"
            onClick={() => {
              setTheme(isDark ? 'light' : 'dark');
            }}
            className="group relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-95 dark:bg-black/5 dark:text-black/80 dark:hover:bg-black/20 dark:hover:text-black"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              // Sun icon (click to make light)
              <svg
                className="h-4 w-4 transition-transform group-hover:rotate-45"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon (click to make dark)
              <svg
                className="h-4 w-4 transition-transform group-hover:-rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Full Screen Toggle Icon */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="group relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white active:scale-95 dark:bg-black/5 dark:text-black/80 dark:hover:bg-black/20 dark:hover:text-black"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
            aria-label="Toggle full screen"
          >
            {isFullscreen ? (
              // Compress / exit fullscreen
              <svg
                className="h-4 w-4 transition-transform group-hover:scale-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                />
              </svg>
            ) : (
              // Expand / enter fullscreen
              <svg
                className="h-4 w-4 transition-transform group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            )}
          </button>

          {/* Notifications Page Link Button */}
          <Link
            href="/notifications"
            className={`group relative flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-95 ${
              isNotificationsActive
                ? 'bg-white text-black shadow-xs dark:bg-black dark:text-white'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white dark:bg-black/5 dark:text-black/80 dark:hover:bg-black/20 dark:hover:text-black'
            }`}
            title="Notifications Center"
            aria-label="View notifications page"
          >
            <BellIcon className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-black dark:ring-white" />
              </span>
            )}
          </Link>

          {/* Sign Out Icon Button */}
          <button
            type="button"
            onClick={() => {
              logout();
            }}
            className="group relative flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-all hover:bg-red-500/20 hover:text-red-400 active:scale-95 dark:bg-black/5 dark:text-black/80 dark:hover:bg-red-500/20 dark:hover:text-red-600"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOutIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
