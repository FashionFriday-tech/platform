'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BellIcon,
  CategoryIcon,
  SearchIcon,
  SearchListIcon,
  ShoppingBagIcon,
  UserIcon,
  WishlistIcon,
} from '@ff/ui';
import { AnimatePresence } from 'motion/react';

import { useAuthStore } from '@/store/auth-store';

import { SearchOverlay } from './SearchOverlay/SearchOverlay';

// --- Helper Functions ---
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

// --- Data Configuration ---
const navStructure = [
  {
    label: 'New Arrivals',
    href: '/new-arrivals',
  },
  {
    label: 'Men',
    href: '/men',
  },
  {
    label: 'Women',
    href: '/women',
  },
  {
    label: 'Sale',
    href: '/sale',
    isRed: true,
  },
  {
    label: 'SNKRS',
    href: '/snkrs',
  },
];

export function Header() {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener('open-search', handleOpenSearch);
    return () => window.removeEventListener('open-search', handleOpenSearch);
  }, []);

  // Hide header on login and signup pages
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const marqueeText = 'FREE SHIPPING ON PRE PAY • COD available +200 advance';
  const marqueeContent = Array(10).fill(marqueeText);

  return (
    <>
      <header className="bg-background fixed top-0 right-0 left-0 z-50">
        {/* DESKTOP TOP BAR */}
        <div className="text-foreground relative z-50 mx-auto hidden h-20 items-center justify-between px-6 sm:flex lg:px-12">
          <Link href="/" className="relative z-50 flex h-8 items-center">
            <span className="text-2xl lg:text-3xl font-black tracking-tighter uppercase">
              Fashion Friday
            </span>
          </Link>

          {/* Clean Navigation: No Dropdowns */}
          <nav className="hidden h-full items-center gap-2 lg:flex">
            {navStructure.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative px-4 py-2 text-[12px] font-black tracking-[0.2em] uppercase ${item.isRed ? 'text-destructive' : 'text-foreground'} `}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Top Left Bracket */}
                <span className="border-brand absolute top-0 left-0 h-1 w-1 border-t border-l opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" />

                {/* Bottom Right Bracket */}
                <span className="border-brand absolute right-0 bottom-0 h-1 w-1 border-r border-b opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="z-50 flex items-center gap-5">
            <button
              onClick={() => {
                setIsSearchOpen(true);
              }}
              className="text-foreground hover:text-brand hidden items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors lg:flex"
            >
              <SearchIcon className="text-lg" />
            </button>
            <div className="bg-border hidden h-4 w-px lg:block" />
            <div className="text-foreground flex items-center gap-4">
              <Link href="/account/wishlist">
                <WishlistIcon className="hover:text-brand text-xl transition-colors" />
              </Link>
              <Link href="/checkout/cart" className="relative">
                <ShoppingBagIcon className="hover:text-brand text-2xl transition-colors" />
                <span className="bg-brand text-brand-foreground absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black">
                  2
                </span>
              </Link>
              <Link
                href="/account"
                className="hover:text-brand flex items-center transition-colors"
              >
                {user ? (
                  user.avatarUrl && user.avatarUrl !== '' ? (
                    <div className="border-border relative h-8 w-8 overflow-hidden rounded-full border transition-transform hover:scale-110">
                      <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="bg-foreground text-background flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black uppercase transition-transform hover:scale-110">
                      {getInitials(user.name)}
                    </div>
                  )
                ) : (
                  <UserIcon className="text-2xl" />
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* MARQUEE (Scrolling Announcement for All Screens) */}
        <div className="bg-foreground text-background relative z-40 block w-full overflow-hidden py-1.5 sm:py-2">
          <div className="animate-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center gap-8 sm:gap-12 px-4 sm:px-6">
                {marqueeContent.map((text, i) => (
                  <span key={i} className="flex items-center gap-2.5 sm:gap-3 text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase">
                    <span className="bg-brand h-1.5 w-1.5 rounded-full shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE UI */}
      <div className="bg-background text-foreground sticky top-0 z-50 flex w-full flex-col border-b border-border/20 lg:hidden">
        <div className="relative flex w-full items-center justify-between px-4 py-3.5">
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-menu'));
            }}
            className="flex items-center justify-start text-foreground transition-transform active:scale-95 py-1 px-0.5"
            aria-label="Toggle Menu"
          >
            <svg
              width="26"
              height="14"
              viewBox="0 0 26 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path d="M0.5 2.5H25.5" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0.5 11.5H25.5" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              className="transition-transform active:scale-95 flex items-center whitespace-nowrap"
            >
              <span className="text-xl sm:text-2xl font-black tracking-tighter uppercase">
                Fashion Friday
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/account/notifications" className="relative">
              <BellIcon className="text-xl" />
              <span className="bg-destructive absolute top-0 right-0 h-2 w-2 rounded-full" />
            </Link>
            <Link href="/account/wishlist">
              <WishlistIcon className="text-xl" />
            </Link>
          </div>
        </div>

        {/* MOBILE MARQUEE ANNOUNCEMENT */}
        <div className="bg-foreground text-background relative z-40 block w-full overflow-hidden py-1.5">
          <div className="animate-marquee flex w-max whitespace-nowrap">
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center gap-8 px-4">
                {marqueeContent.map((text, i) => (
                  <span key={i} className="flex items-center gap-2 text-[9px] font-black tracking-[0.25em] uppercase">
                    <span className="bg-brand h-1.5 w-1.5 rounded-full shrink-0" />
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t px-6 py-3 lg:hidden">
        <Link href="/men">
          <CategoryIcon className="text-[25px]" />
        </Link>
        <button
          onClick={() => {
            setIsSearchOpen(true);
          }}
        >
          <SearchListIcon className="text-[25px]" />
        </button>
        <Link href="/" className="scale-110">
          <Image
            src="/images/logos/ff-logo.png"
            width={32}
            height={32}
            alt="logo"
            className="dark:invert"
          />
        </Link>
        <Link href="/checkout/cart" className="relative">
          <ShoppingBagIcon className="text-[25px]" />
          <span className="bg-brand border-background absolute top-0 right-0 h-2 w-2 rounded-full border-2" />
        </Link>
        <Link href="/account">
          <UserIcon className="text-[25px]" />
        </Link>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 85s linear infinite;
        }
        @media (min-width: 1024px) {
          .animate-marquee {
            animation: marquee 90s linear infinite;
          }
        }
      `,
        }}
      />
    </>
  );
}
