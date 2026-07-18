'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  BellIcon,
  InstagramIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  WhatsAppIcon,
  WishlistIcon,
  YoutubeIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { AnimatedLogo } from '@/components/ui/animated-logo';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { useAuthStore } from '@/store/auth-store';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const getInitials = (name: string) => {
  if (!name) {
    return '';
  }
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
  { label: 'Sale', href: '/sale', isRed: true },
  { label: 'SNKRS', href: '/snkrs' },
  { label: 'Brands', href: '/brands' },
  { label: 'Trending', href: '/collections/best-sellers' },
];

const ACCOUNT_LINKS = [
  { label: 'My Orders', href: '/account/orders', icon: ShoppingBagIcon },
  { label: 'Wishlist', href: '/account/wishlist', icon: WishlistIcon },
  { label: 'Notifications', href: '/account/notifications', icon: BellIcon },
  { label: 'Customer Care & FAQ', href: '/help', icon: UserIcon },
];

const SEARCH_PLACEHOLDERS = [
  'Search sneakers, apparel, brands...',
  'Search Nike, Jordan, Yeezy...',
  'Search new arrivals & drops...',
  'Search streetwear & hoodies...',
  'Search luxury collections...',
];

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { setTheme, resolvedTheme } = useTheme();
  const { isInstalled, install } = usePwaInstall();
  const [mounted, setMounted] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic search placeholder only cycles when the side box is open
  useEffect(() => {
    if (!isOpen) {
      setPlaceholderIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen]);

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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted) {
    return null;
  }

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
            className="bg-background text-foreground border-border/20 relative z-10 flex h-[100dvh] w-[86vw] max-w-sm flex-col overscroll-contain border-r shadow-2xl"
          >
            {/* Top Bar with Brand Centered & Close Button on Left */}
            <div className="border-border/30 relative flex min-h-[64px] shrink-0 items-center justify-center border-b px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground absolute top-1/2 left-4 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full transition-all active:scale-95"
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
                <AnimatedLogo className="text-center text-xl font-black tracking-tighter uppercase" />
              </Link>

              {/* Fixed Top-Right Theme Toggle */}
              {mounted && (
                <button
                  type="button"
                  onClick={() => {
                    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
                  }}
                  className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground border-border/30 absolute top-1/2 right-4 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border transition-all active:scale-95"
                  aria-label={
                    resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
                  }
                  title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {resolvedTheme === 'dark' ? (
                    <svg
                      className="h-4.5 w-4.5"
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
                  ) : (
                    <svg
                      className="h-4.5 w-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            {/* FIXED TOP SEARCH BAR (doesn't move when scrolling sidebar) */}
            <div className="border-border/20 bg-background shrink-0 border-b px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="border-border/60 bg-foreground/5 text-foreground/60 hover:bg-foreground/10 flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all active:scale-98"
              >
                <SearchIcon className="text-foreground/70 shrink-0 text-base" />
                <div className="relative flex h-4 w-full items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 7, filter: 'blur(2px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -7, filter: 'blur(2px)' }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-foreground/60 absolute truncate text-xs font-medium select-none"
                    >
                      {SEARCH_PLACEHOLDERS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="scrollbar-none flex-1 [touch-action:pan-y] overflow-y-auto overscroll-contain px-5 py-4 [-webkit-overflow-scrolling:touch]"
              onTouchMove={(e) => {
                e.stopPropagation();
              }}
            >
              <style>{`
                @keyframes electric-blink {
                  0%, 18%, 22%, 25%, 53%, 57%, 100% {
                    opacity: 1;
                    filter: drop-shadow(0 0 1px currentColor);
                  }
                  19%, 21% {
                    opacity: 0.15;
                    filter: none;
                  }
                  23%, 24% {
                    opacity: 0.4;
                    filter: none;
                  }
                  54%, 56% {
                    opacity: 0.2;
                    filter: none;
                  }
                }
                .animate-electric-blink {
                  animation: electric-blink 2.2s infinite;
                  display: inline-block;
                }
                .dark .animate-electric-blink {
                  text-shadow: 0 0 2px rgba(255, 255, 255, 0.7);
                }
              `}</style>

              {/* User Profile Banner - shown when logged in */}
              {user && (
                <div className="bg-foreground/5 border-border/40 mb-4 overflow-hidden rounded-2xl border p-3.5">
                  <Link
                    href="/account"
                    onClick={onClose}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <div className="border-border relative h-10 w-10 overflow-hidden rounded-full border">
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="bg-foreground text-background flex h-10 w-10 items-center justify-center rounded-full text-xs font-black uppercase">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div>
                        <p className="text-foreground line-clamp-1 text-xs font-bold tracking-tight">
                          {user.name}
                        </p>
                        <p className="text-foreground/60 text-[10px]">View Profile</p>
                      </div>
                    </div>
                    <svg
                      className="text-foreground/40 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Main Categories Navigation */}
              <div className="mb-6 flex flex-col gap-1">
                <span className="text-foreground/40 mb-2 text-[10px] font-black tracking-[0.2em] uppercase">
                  Categories
                </span>
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`group hover:bg-foreground/5 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black tracking-wide uppercase transition-all active:scale-98 ${
                      item.isRed ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
                    <span className="flex items-center gap-2">{item.label}</span>
                    {item.badge && (
                      <span className="animate-electric-blink text-foreground text-[10px] font-black tracking-widest uppercase select-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Account & Support Section */}
              <div className="border-border/30 mb-6 flex flex-col gap-1 border-t pt-4">
                <span className="text-foreground/40 mb-2.5 px-3 text-[10px] font-black tracking-[0.22em] uppercase">
                  Account & Help
                </span>
                {ACCOUNT_LINKS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="group hover:bg-foreground/5 flex items-center justify-between rounded-xl px-3 py-2.5 transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-foreground/5 text-foreground/70 group-hover:bg-foreground/10 group-hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-foreground/90 group-hover:text-foreground text-sm font-bold tracking-tight transition-colors">
                          {item.label}
                        </span>
                      </div>
                      <svg
                        className="text-foreground/20 group-hover:text-foreground/60 h-3.5 w-3.5 transition-all group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Sticky Utility Bar */}
            <div className="border-border/30 bg-background/95 flex shrink-0 flex-col gap-3 border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
              {/* Action Buttons: Sign In and Install App in the same row */}
              {(!user || !isInstalled) && (
                <div className="flex w-full items-center gap-2.5">
                  {!user && (
                    <Link
                      href="/login"
                      onClick={onClose}
                      className={`bg-foreground text-background flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-black tracking-wider uppercase shadow-md transition-all hover:opacity-90 active:scale-98 ${
                        !isInstalled ? 'flex-1' : 'w-full'
                      }`}
                    >
                      <UserIcon className="text-sm" />
                      <span>Sign In</span>
                    </Link>
                  )}

                  {!isInstalled && (
                    <button
                      type="button"
                      onClick={install}
                      className={`border-border/60 bg-foreground/5 text-foreground hover:bg-foreground/10 flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-black tracking-wider uppercase shadow-sm transition-all active:scale-98 ${
                        !user ? 'flex-1' : 'w-full'
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
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
                      <span>Install App</span>
                    </button>
                  )}
                </div>
              )}

              {/* Social Icons (WhatsApp, Instagram, YouTube) */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://wa.me/+917558969093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground border-border/30 flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95"
                  aria-label="Chat on WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://instagram.com/fashionfriday.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground border-border/30 flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95"
                  aria-label="Follow on Instagram"
                  title="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/fashionfriday.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground border-border/30 flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95"
                  aria-label="Watch on YouTube"
                  title="YouTube"
                >
                  <YoutubeIcon className="h-4.5 w-4.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
