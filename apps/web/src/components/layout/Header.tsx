'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  BellIcon,
  CategoryIcon,
  SearchIcon,
  SearchListIcon,
  ShoppingBagIcon,
  UserIcon,
  WishlistIcon,
} from '@ff/ui';
import { AnimatePresence } from 'framer-motion';

import { SearchOverlay } from './SearchOverlay/SearchOverlay';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const marqueeText = 'FREE SHIPPING ON PRE PAY • COD available +200 advance';
  const marqueeContent = Array(10).fill(marqueeText);

  return (
    <>
      <header className="bg-background fixed top-0 right-0 left-0 z-50">
        {/* DESKTOP TOP BAR */}
        <div className="text-foreground relative z-50 mx-auto hidden h-16 items-center justify-between px-6 sm:flex lg:px-12">
          <Link href="/" className="relative z-50 flex h-8 items-center">
            <span className="text-xl font-black tracking-tighter uppercase italic">
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
              onClick={() => setIsSearchOpen(true)}
              className="text-foreground hover:text-brand hidden items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors lg:flex"
            >
              <SearchIcon className="text-lg" />
              <span>Search</span>
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
              <Link href="/account">
                <UserIcon className="hover:text-brand text-2xl transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="bg-foreground text-background relative z-40 hidden py-1.5 sm:block">
          <div className="animate-marquee flex whitespace-nowrap">
            {[0, 1].map((set) => (
              <div key={set} className="flex gap-10 px-5">
                {marqueeContent.map((text, i) => (
                  <span key={i} className="text-[9px] font-black tracking-[0.2em] uppercase">
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE UI (UNCHANGED) */}
      <div className="bg-background text-foreground sticky top-0 z-50 flex w-full items-center justify-between px-4 py-3 lg:hidden">
        <Link href="/account" className="flex items-center gap-4">
          <div className="border-foreground h-10 w-10 overflow-hidden rounded-full border-2">
            <Image
              src="/images/model/aj.png"
              width={40}
              height={40}
              alt="User"
              className="object-cover object-top"
            />
          </div>
          <span className="text-xs font-bold tracking-tighter uppercase">HELLO, AJMAL</span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchIcon className="text-xl" onClick={() => setIsSearchOpen(true)} />
          <Link href="/account/notifications" className="relative">
            <BellIcon className="text-xl" />
            <span className="bg-destructive absolute top-0 right-0 h-2 w-2 rounded-full" />
          </Link>
          <Link href="/account/wishlist">
            <WishlistIcon className="text-xl" />
          </Link>
        </div>
      </div>

      <nav className="bg-background border-border fixed right-0 bottom-0 left-0 z-50 flex items-center justify-between border-t px-6 py-3 lg:hidden">
        <Link href="/men">
          <CategoryIcon className="text-[25px]" />
        </Link>
        <button onClick={() => setIsSearchOpen(true)}>
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

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </>
  );
}
