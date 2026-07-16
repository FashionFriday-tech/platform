'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from 'next-themes';

import {
  BellIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
  WishlistIcon,
} from '@ff/ui';

import { AnimatedLogo } from '@/components/ui/animated-logo';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu automatically on route change
  useEffect(() => {
    onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 flex h-[100dvh] w-[86vw] max-w-sm flex-col bg-background text-foreground shadow-2xl border-r border-border/20"
          >
            {/* Top Bar with Brand & Close Button */}
            <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
              <Link href="/" onClick={onClose} className="flex items-center">
                <AnimatedLogo className="text-xl font-black tracking-tighter uppercase" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground active:scale-95 transition-all"
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
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
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
                className="mb-6 flex w-full items-center gap-2.5 rounded-xl border border-border/60 bg-foreground/5 px-3.5 py-2.5 text-left text-xs font-medium text-foreground/60 transition-all hover:bg-foreground/10 active:scale-98"
              >
                <SearchIcon className="text-base text-foreground/70" />
                <span>Search sneakers, apparel, brands...</span>
              </button>

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
            <div className="border-t border-border/30 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/60">Appearance</span>
                {mounted && (
                  <button
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 rounded-xl bg-foreground/5 px-3 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-foreground/10 active:scale-95"
                  >
                    <span>{theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
