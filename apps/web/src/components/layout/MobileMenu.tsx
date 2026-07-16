'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';

import {
  BellIcon,
  InstagramIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  WhatsAppIcon,
  WishlistIcon,
} from '@ff/ui';

import { AnimatedLogo } from '@/components/ui/animated-logo';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { useAuthStore } from '@/store/auth-store';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const getInitials = (name: string) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

const MAIN_NAV_ITEMS = [
  { label: 'New Arrivals', href: '/new-arrivals', badge: 'NEW' },
  { label: 'Men', href: '/category/men' },
  { label: 'Women', href: '/category/women' },
  { label: 'Sale', href: '/sale', isRed: true, badge: 'HOT' },
  { label: 'SNKRS', href: '/snkrs', badge: 'DROPS' },
  { label: 'Brands', href: '/brands' },
  { label: 'Trending', href: '/collections/best-sellers' },
];

const ACCOUNT_LINKS = [
  { label: 'My Orders', href: '/account/orders', icon: ShoppingBagIcon },
  { label: 'Wishlist', href: '/account/wishlist', icon: WishlistIcon },
  { label: 'Notifications', href: '/account/notifications', icon: BellIcon },
  { label: 'Customer Care & FAQ', href: '/help', icon: UserIcon },
];

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const { isInstalled, install } = usePwaInstall();
  const [mounted, setMounted] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and pause Lenis when mobile menu is open
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      lenis?.start();
    };
  }, [isOpen]);

  // Close menu automatically ONLY when route actually changes
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex lg:hidden"
          role="dialog"
          aria-modal="true"
          data-lenis-prevent="true"
          data-lenis-prevent-wheel="true"
          data-lenis-prevent-touch="true"
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onTouchMove={(e) => {
              e.preventDefault();
            }}
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="relative z-10 flex h-[100dvh] w-[86vw] max-w-sm flex-col bg-background text-foreground shadow-2xl border-r border-border/20 overscroll-contain"
          >
            {/* Top Bar with Brand Centered & Close Button on Left */}
            <div className="relative flex min-h-[64px] items-center justify-center border-b border-border/30 px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground active:scale-95 transition-all"
                aria-label="Close Menu"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <Link href="/" onClick={onClose} className="flex items-center justify-center">
                <AnimatedLogo className="text-xl font-black tracking-tighter uppercase text-center" />
              </Link>
            </div>

            {/* Scrollable Content */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 scrollbar-none [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
              onTouchMove={(e) => {
                e.stopPropagation();
              }}
            >
              {/* User Profile / Login Banner */}
              <div className="mb-4 overflow-hidden rounded-2xl bg-foreground/5 p-3.5 border border-border/40">
                {user ? (
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background text-xs font-black uppercase">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-bold tracking-tight text-foreground line-clamp-1">
                          {user.name}
                        </p>
                        <p className="text-[10px] text-foreground/60">View Profile</p>
                      </div>
                    </div>
                    <svg
                      className="h-4 w-4 text-foreground/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-foreground">Welcome to Fashion Friday</p>
                      <p className="text-[10px] text-foreground/60">Sign in for exclusive drops</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="rounded-xl bg-foreground px-3.5 py-1.5 text-xs font-extrabold text-background transition-opacity hover:opacity-90 active:scale-95"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Quick Search Trigger */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="mb-4 flex w-full items-center gap-2.5 rounded-xl border border-border/60 bg-foreground/5 px-3.5 py-2.5 text-left text-xs font-medium text-foreground/60 transition-all hover:bg-foreground/10 active:scale-98"
              >
                <SearchIcon className="text-base text-foreground/70" />
                <span>Search sneakers, apparel, brands...</span>
              </button>

              {/* PWA App Install Banner */}
              {!isInstalled && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-border/40 bg-foreground/5 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background shadow-sm">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black uppercase tracking-tight text-foreground truncate">
                          Install App
                        </p>
                        <p className="text-[10px] text-foreground/60 truncate">
                          Faster drops & smooth shopping
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={install}
                      className="shrink-0 rounded-xl bg-foreground px-3.5 py-1.5 text-xs font-extrabold uppercase text-background shadow-sm transition-opacity hover:opacity-90 active:scale-95"
                    >
                      GET
                    </button>
                  </div>
                </div>
              )}

              {/* Main Categories Navigation */}
              <div className="mb-6 flex flex-col gap-1">
                <span className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  Categories
                </span>
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black tracking-wide uppercase transition-all hover:bg-foreground/5 active:scale-98 ${
                      item.isRed ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-2">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider ${
                          item.isRed
                            ? 'bg-destructive/15 text-destructive'
                            : 'bg-foreground/10 text-foreground/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Account & Support Section */}
              <div className="mb-6 flex flex-col gap-1 border-t border-border/30 pt-4">
                <span className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  Account & Help
                </span>
                {ACCOUNT_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-foreground/80 transition-all hover:bg-foreground/5 hover:text-foreground active:scale-98"
                    >
                      <Icon className="text-lg text-foreground/60" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Sticky Utility Bar */}
            <div className="border-t border-border/30 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] flex flex-col gap-3.5">
              {/* Connect / Socials */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/60">Connect With Us</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/+917558969093"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
                    aria-label="Chat on WhatsApp"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5" />
                  </a>
                  <a
                    href="https://instagram.com/fashionfriday.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 active:scale-95 transition-all"
                    aria-label="Follow on Instagram"
                    title="Instagram"
                  >
                    <InstagramIcon className="h-4.5 w-4.5" />
                  </a>
                </div>
              </div>

              {/* Theme: Standard Sun/Moon Toggle */}
              <div className="flex items-center justify-between border-t border-border/20 pt-3">
                <span className="text-xs font-semibold text-foreground/60">Appearance</span>
                {mounted && (
                  <div className="flex items-center rounded-full border border-border/40 bg-foreground/5 p-0.5">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                        theme === 'light'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-foreground/50 hover:text-foreground'
                      }`}
                      aria-label="Light Mode"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
                        theme === 'dark'
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-foreground/50 hover:text-foreground'
                      }`}
                      aria-label="Dark Mode"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                      <span>Dark</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
