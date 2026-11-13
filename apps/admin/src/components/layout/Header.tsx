'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import { BellIcon } from '@ff/ui';

import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/features/notifications';

interface MobileHeaderProps {
  isMobileOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export interface DesktopHeaderProps {
  onToggleDesktopMenu: () => void;
}

export function getPageTitle(pathname: string): string {
  if (pathname === '/') {
    return 'Dashboard';
  }
  if (pathname.startsWith('/orders/')) {
    return 'Order Details';
  }
  if (pathname === '/orders') {
    return 'Orders';
  }
  if (pathname.startsWith('/products/add')) {
    return 'Add Product';
  }
  if (pathname.endsWith('/edit')) {
    return 'Edit Product';
  }
  if (pathname.startsWith('/products/')) {
    return 'Product Details';
  }
  if (pathname === '/products') {
    return 'Products';
  }
  if (pathname.startsWith('/customers/')) {
    return 'Customer Details';
  }
  if (pathname === '/customers') {
    return 'Customers';
  }
  if (pathname === '/reviews') {
    return 'Reviews';
  }
  if (pathname === '/feedback') {
    return 'Feedback';
  }
  if (pathname === '/searches') {
    return 'User Searches';
  }
  if (pathname === '/product-requests') {
    return 'Product Requests';
  }
  if (pathname.includes('/add-products')) {
    return 'Add Products';
  }
  if (pathname.startsWith('/categories/add')) {
    return 'Add Category';
  }
  if (pathname.startsWith('/categories/')) {
    return 'Category Details';
  }
  if (pathname === '/categories') {
    return 'Categories';
  }
  if (pathname.startsWith('/collections/add')) {
    return 'Add Collection';
  }
  if (pathname.startsWith('/collections/')) {
    return 'Collection Details';
  }
  if (pathname === '/collections') {
    return 'Collections';
  }
  if (pathname === '/brands') {
    return 'Brands';
  }
  if (pathname.startsWith('/sellers/')) {
    return 'Seller Details';
  }
  if (pathname === '/sellers') {
    return 'Sellers';
  }
  if (pathname === '/campaigns') {
    return 'Campaigns';
  }
  if (pathname === '/whatsapp-reviews') {
    return 'WhatsApp Reviews';
  }
  if (pathname === '/faqs') {
    return 'FAQs';
  }
  if (pathname === '/team') {
    return 'Team & Roles';
  }
  if (pathname === '/profile') {
    return 'Profile';
  }
  if (pathname.startsWith('/notifications')) {
    return 'Notifications';
  }
  if (pathname === '/activity') {
    return 'Activity';
  }
  if (pathname === '/analytics') {
    return 'Analytics';
  }

  // Fallback for custom or deeply nested route
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return 'Dashboard';
  }
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function MobileHeader({ isMobileOpen = false, onToggleMobileMenu }: MobileHeaderProps) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const { user } = useAuth();

  if (!user || pathname === '/login') {
    return null;
  }

  const pageTitle = getPageTitle(pathname);
  const showBack = pathname !== '/';

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <header
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)' }}
      className="mobile-header-bar fixed top-0 right-0 left-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur-md transition-colors duration-200 md:hidden dark:border-white/10 dark:bg-[#0e0e0e]/95"
    >
      <div className="relative flex h-14 w-full items-center justify-between px-3">
        {/* Left: iOS Back Button */}
        <div className="flex h-10 w-10 items-center justify-center">
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition-colors hover:bg-black/5 hover:text-black active:scale-95 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <svg
                className="-ml-0.5 h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.25}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          ) : null}
        </div>

        {/* Center: Page Name (Centered iOS style) */}
        <div className="pointer-events-none absolute inset-x-14 flex items-center justify-center text-center">
          <h1 className="truncate text-base font-semibold tracking-tight text-black dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Right: Menu icon */}
        <div className="flex h-10 w-10 items-center justify-center">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label={isMobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-black/80 transition-colors hover:bg-black/5 hover:text-black active:scale-95 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {isMobileOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// Re-export as Header for convenience
export { MobileHeader as Header };

export function DesktopHeader({ onToggleDesktopMenu }: DesktopHeaderProps) {
  const pathname = usePathname() ?? '';
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user || pathname === '/login') {
    return null;
  }

  const pageTitle = getPageTitle(pathname);
  const isDark = mounted && (resolvedTheme ? resolvedTheme === 'dark' : theme === 'dark');

  return (
    <header className="hidden h-12 shrink-0 items-center justify-between border-b border-black/5 bg-white/80 px-4 backdrop-blur-md transition-colors md:flex dark:border-white/10 dark:bg-[#0e0e0e]/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleDesktopMenu}
          className="group flex items-center gap-2 rounded-xl border border-black/10 bg-white/90 px-3 py-1.5 text-xs font-bold text-black/80 shadow-xs transition-all hover:border-black hover:bg-black hover:text-white active:scale-95 dark:border-white/10 dark:bg-[#141417] dark:text-white/80 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
          title="Show side menu (Ctrl+B)"
          aria-label="Show side menu"
        >
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
            <path d="M9 3v18" strokeWidth={2} />
            <path d="M13 9l3 3-3 3" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Show Menu</span>
          <kbd className="rounded bg-black/5 px-1 py-0.5 font-mono text-[10px] font-normal text-black/50 group-hover:bg-white/20 group-hover:text-white dark:bg-white/10 dark:text-white/50 dark:group-hover:bg-black/20 dark:group-hover:text-black">
            Ctrl+B
          </kbd>
        </button>

        <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

        <h2 className="text-sm font-bold tracking-tight text-black/80 dark:text-white/80">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications Page Link */}
        <Link
          href="/notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-xl text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          title="Notifications"
          aria-label="Notifications"
        >
          <BellIcon className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </Link>

        {/* Theme mode toggle */}
        <button
          type="button"
          onClick={() => {
            setTheme(isDark ? 'light' : 'dark');
          }}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* User Profile */}
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-xl p-1 text-black/70 transition-colors hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/10"
          title="Open Profile Settings"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[11px] font-black text-white dark:bg-white dark:text-black">
            {user.initials}
          </div>
          <span className="hidden text-xs font-semibold lg:inline">{user.name.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  );
}
