'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  UserIcon,
  WhatsAppIcon,
  YoutubeIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { AnimatedLogo } from '@/components/ui/animated-logo';
import { usePwaInstall } from '@/lib/pwa/usePwaInstall';
import { useAuthStore } from '@/store/auth-store';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
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
  { label: 'My Orders', href: '/account/orders' },
  { label: 'Wishlist', href: '/account/wishlist' },
  { label: 'Notifications', href: '/account/notifications' },
  { label: 'Customer Care & FAQ', href: '/help' },
];

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const { setTheme, resolvedTheme } = useTheme();
  const { isInstalled, install, platform } = usePwaInstall();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<'ios' | 'android' | 'desktop'>(
    platform,
  );
  const [mounted, setMounted] = useState(false);
  const prevPathname = useRef(pathname);

  // Swipe to close gesture tracking (swipe right to left anywhere on the drawer to close)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
      const diffY = e.changedTouches[0].clientY - touchStartYRef.current;
      // Trigger close when swiped left (diffX < -30) and movement is predominantly horizontal
      if (diffX < -30 && Math.abs(diffX) > Math.abs(diffY)) {
        onClose();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedPlatformTab(platform);
  }, [platform]);

  useEffect(() => {
    if (!isOpen) {
      setShowInstallGuide(false);
    }
  }, [isOpen]);

  const handleInstallClick = async () => {
    const prompted = await install();
    if (!prompted) {
      setShowInstallGuide((prev) => !prev);
    }
  };

  // Alternating diagonal wipe View Transition theme toggling:
  // When switching to light mode: top right corner color animation moves to bottom left corner.
  // When switching to dark mode: bottom left corner color animation moves to top right corner.
  const toggleTheme = useCallback(async () => {
    const isDark = resolvedTheme === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';

    // Fallback if View Transitions API is not supported by the browser
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    await transition.ready;

    // Thematic Dual-Shutter View Transition:
    // - Making Dark Mode: CLOSING animation (two dark shutters sweep in from both corners and meet/touch at the exact same point on the center line)
    // - Making Light Mode: OPENING animation (light splits open from the center and expands outward to the corners)
    // Slower, ultra-smooth cinematic transition without abrupt stops.
    const keyframes =
      nextTheme === 'dark'
        ? [
            {
              clipPath:
                'polygon(-48% -153%, 253% 148%, 453% -53%, 153% -353%, -353% 153%, -153% -48%, 148% 253%, -53% 453%)',
            },
            {
              clipPath:
                'polygon(-101% -99%, 200% 201%, 400% 0%, 100% -300%, -300% 100%, -99% -101%, 201% 200%, 0% 400%)',
            },
          ]
        : [
            {
              clipPath:
                'polygon(-100% -100%, 200% 200%, 200% 200%, -100% -100%)',
            },
            {
              clipPath:
                'polygon(-40% -160%, 260% 140%, 140% 260%, -160% -40%)',
            },
          ];

    document.documentElement.animate(keyframes, {
      duration: 900,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      pseudoElement: '::view-transition-new(root)',
    });
  }, [resolvedTheme, setTheme]);

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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            className="bg-background text-foreground relative z-10 flex h-[100dvh] w-full flex-col overscroll-contain shadow-2xl"
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
                    void toggleTheme();
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


            {/* Scrollable Content */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="scrollbar-none flex-1 [touch-action:pan-y] overflow-y-auto overscroll-contain px-5 py-4 [-webkit-overflow-scrolling:touch]"
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

              {/* Navigation Links: Categories & Account seamlessly unified with arrows and zero extra gap */}
              <div className="mb-4 flex flex-col gap-1">
                {MAIN_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className={`group hover:bg-foreground/5 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black tracking-wide uppercase transition-all active:scale-98 ${
                      item.isRed ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="animate-electric-blink text-foreground text-[10px] font-black tracking-widest uppercase select-none">
                          {item.badge}
                        </span>
                      )}
                      <svg
                        className="text-foreground/40 group-hover:text-foreground h-4 w-4 transition-all group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}

                {ACCOUNT_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="group hover:bg-foreground/5 text-foreground flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black tracking-wide uppercase transition-all active:scale-98"
                  >
                    <span>{item.label}</span>
                    <svg
                      className="text-foreground/40 group-hover:text-foreground h-4 w-4 transition-all group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Sticky Utility Bar */}
            <div className="border-border/30 bg-background/95 flex shrink-0 flex-col gap-3.5 border-t p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
              {/* Social Icons with brand colors - centered above action buttons */}
              <div className="flex items-center justify-center gap-2.5">
                <a
                  href="https://wa.me/+917558969093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] transition-all hover:scale-105 hover:border-[#25D366]/60 hover:bg-[#25D366]/20 active:scale-95"
                  aria-label="Chat on WhatsApp"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://instagram.com/fashionfriday.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1306C]/30 bg-[#E1306C]/10 text-[#E1306C] transition-all hover:scale-105 hover:border-[#E1306C]/60 hover:bg-[#E1306C]/20 active:scale-95"
                  aria-label="Follow on Instagram"
                  title="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com/fashionfriday.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000] transition-all hover:scale-105 hover:border-[#FF0000]/60 hover:bg-[#FF0000]/20 active:scale-95"
                  aria-label="Watch on YouTube"
                  title="YouTube"
                >
                  <YoutubeIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href="https://facebook.com/fashionfriday.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 text-[#1877F2] transition-all hover:scale-105 hover:border-[#1877F2]/60 hover:bg-[#1877F2]/20 active:scale-95"
                  aria-label="Follow on Facebook"
                  title="Facebook"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href="https://x.com/fashionfriday.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border/60 bg-foreground/5 text-foreground hover:bg-foreground/10 hover:border-foreground/40 flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 dark:border-white/40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                  aria-label="Follow on X (Twitter)"
                  title="X (Twitter)"
                >
                  <TwitterIcon className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* In-drawer installation guide for iOS Safari or manual browser install */}
              <AnimatePresence>
                {showInstallGuide && !isInstalled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-border/60 bg-foreground/[0.04] relative rounded-2xl border p-3.5 shadow-sm dark:bg-white/[0.05]">
                      <div className="border-border/20 mb-2.5 flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <svg
                            className="text-foreground h-4 w-4"
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
                          <h4 className="text-foreground text-xs font-black tracking-wider uppercase">
                            How to Install App
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowInstallGuide(false);
                          }}
                          className="text-foreground/50 hover:text-foreground rounded-full p-1 transition-colors"
                          aria-label="Close guide"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>

                      {/* Device Tabs: Allows user to toggle between Android, iPhone/iPad, and Computer */}
                      <div className="bg-foreground/5 mb-3 flex items-center gap-1 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlatformTab('android');
                          }}
                          className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-all ${
                            selectedPlatformTab === 'android'
                              ? 'bg-foreground text-background shadow-xs'
                              : 'text-foreground/60 hover:text-foreground'
                          }`}
                        >
                          Android
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlatformTab('ios');
                          }}
                          className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-all ${
                            selectedPlatformTab === 'ios'
                              ? 'bg-foreground text-background shadow-xs'
                              : 'text-foreground/60 hover:text-foreground'
                          }`}
                        >
                          iPhone / iPad
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlatformTab('desktop');
                          }}
                          className={`flex-1 rounded-lg py-1 text-[11px] font-bold transition-all ${
                            selectedPlatformTab === 'desktop'
                              ? 'bg-foreground text-background shadow-xs'
                              : 'text-foreground/60 hover:text-foreground'
                          }`}
                        >
                          Computer
                        </button>
                      </div>

                      {selectedPlatformTab === 'ios' ? (
                        <div className="text-foreground/80 flex flex-col gap-2 text-xs">
                          <p className="text-foreground font-semibold">
                            On iPhone / iPad (Safari):
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              1
                            </span>
                            <p>
                              Tap the <span className="text-foreground font-bold">Share (⎋)</span>{' '}
                              button at the bottom of Safari.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              2
                            </span>
                            <p>
                              Scroll down and tap{' '}
                              <span className="text-foreground font-bold">
                                "Add to Home Screen"
                              </span>
                              .
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              3
                            </span>
                            <p>
                              Tap <span className="text-foreground font-bold">"Add"</span> in the
                              top-right corner.
                            </p>
                          </div>
                        </div>
                      ) : selectedPlatformTab === 'android' ? (
                        <div className="text-foreground/80 flex flex-col gap-2 text-xs">
                          <p className="text-foreground font-semibold">
                            On Android (Chrome / Browser):
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              1
                            </span>
                            <p>
                              Tap the{' '}
                              <span className="text-foreground font-bold">three dots (⋮)</span> in
                              the top-right of Chrome.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              2
                            </span>
                            <p>
                              Tap <span className="text-foreground font-bold">"Install app"</span>{' '}
                              or{' '}
                              <span className="text-foreground font-bold">
                                "Add to Home screen"
                              </span>
                              .
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              3
                            </span>
                            <p>Confirm to add Fashion Friday to your apps.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-foreground/80 flex flex-col gap-2 text-xs">
                          <p className="text-foreground font-semibold">
                            On Computer (Chrome / Edge):
                          </p>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              1
                            </span>
                            <p>
                              Look for the{' '}
                              <span className="text-foreground font-bold">
                                Install icon (⊕ or ⬇)
                              </span>{' '}
                              in your browser address bar on the right.
                            </p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="bg-foreground/10 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                              2
                            </span>
                            <p>
                              Click it and choose{' '}
                              <span className="text-foreground font-bold">"Install"</span>.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons: Sign In and Install App in a Single Row */}
              {(!user || !isInstalled) && (
                <div className="flex w-full items-center gap-2.5 sm:gap-3">
                  {!user && (
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="group flex flex-1 items-center -skew-x-[12deg] overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-500 hover:shadow-xl active:scale-95 dark:border-zinc-700"
                    >
                      <span className="flex-1 skew-x-[12deg] px-2.5 sm:px-4 py-3 text-center text-xs font-black tracking-wider sm:tracking-widest text-white uppercase transition-colors truncate">
                        Sign In
                      </span>
                      <span className="flex shrink-0 skew-x-[12deg] items-center justify-center bg-white px-3 sm:px-3.5 py-3 text-black transition-all group-hover:bg-zinc-200">
                        <UserIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </span>
                    </Link>
                  )}

                  {!isInstalled && (
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="group flex flex-1 items-center -skew-x-[12deg] overflow-hidden rounded-xl border border-zinc-800 bg-black shadow-lg transition-all hover:border-zinc-500 hover:shadow-xl active:scale-95 dark:border-zinc-700"
                    >
                      <span className="flex-1 skew-x-[12deg] px-2.5 sm:px-4 py-3 text-center text-xs font-black tracking-wider sm:tracking-widest text-white uppercase transition-colors truncate">
                        Install App
                      </span>
                      <span className="flex shrink-0 skew-x-[12deg] items-center justify-center bg-white px-3 sm:px-3.5 py-3 text-black transition-all group-hover:bg-zinc-200">
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
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
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
