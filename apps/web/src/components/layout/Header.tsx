"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchIcon,
  BellIcon,
  UserIcon,
  WishlistIcon,
  ShoppingBagIcon,
  SearchListIcon,
  CategoryIcon,
} from "@ff/ui";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";

// --- Data Configuration ---
const navStructure = [
  {
    label: "New Arrivals",
    href: "/new-arrivals",
  },
  {
    label: "Men",
    href: "/men",
  },
  {
    label: "Women",
    href: "/women",
  },
  {
    label: "Sale",
    href: "/sale",
    isRed: true,
  },
  {
    label: "SNKRS",
    href: "/snkrs",
  },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const marqueeText = "FREE SHIPPING ON PRE PAY • COD available +200 advance";
  const marqueeContent = Array(10).fill(marqueeText);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        {/* DESKTOP TOP BAR */}
        <div className="relative hidden sm:flex items-center justify-between z-50 mx-auto text-foreground px-6 lg:px-12 h-16">
          <Link href="/" className="z-50 relative h-8 flex items-center">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Fashion Friday
            </span>
          </Link>

          {/* Clean Navigation: No Dropdowns */}
          <nav className="hidden lg:flex items-center gap-2 h-full">
            {navStructure.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`relative px-4 py-2 text-[12px] font-black uppercase tracking-[0.2em] group
        ${item.isRed ? "text-destructive" : "text-foreground"}
      `}
              >
                <span className="relative z-10">{item.label}</span>

                {/* Top Left Bracket */}
                <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1" />

                {/* Bottom Right Bracket */}
                <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-brand opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5 z-50">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-brand transition-colors"
            >
              <SearchIcon className="text-lg" />
              <span>Search</span>
            </button>
            <div className="h-4 w-px bg-border hidden lg:block" />
            <div className="flex items-center gap-4 text-foreground">
              <Link href="/account/wishlist">
                <WishlistIcon className="text-xl hover:text-brand transition-colors" />
              </Link>
              <Link href="/checkout/cart" className="relative">
                <ShoppingBagIcon className="text-2xl hover:text-brand transition-colors" />
                <span className="absolute -top-1.5 -right-1.5 bg-brand text-brand-foreground text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  2
                </span>
              </Link>
              <Link href="/account">
                <UserIcon className="text-2xl hover:text-brand transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div className="hidden sm:block bg-foreground text-background py-1.5 relative z-40">
          <div className="flex whitespace-nowrap animate-marquee">
            {[0, 1].map((set) => (
              <div key={set} className="flex gap-10 px-5">
                {marqueeContent.map((text, i) => (
                  <span
                    key={i}
                    className="text-[9px] font-black uppercase tracking-[0.2em]"
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MOBILE UI (UNCHANGED) */}
      <div className="sticky top-0 lg:hidden w-full px-4 py-3 z-50 bg-background text-foreground flex justify-between items-center">
        <Link href="/account" className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-foreground overflow-hidden">
            <Image
              src="/images/model/aj.png"
              width={40}
              height={40}
              alt="User"
              className="object-cover object-top"
            />
          </div>
          <span className="font-bold text-xs uppercase tracking-tighter">
            HELLO, AJMAL
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <SearchIcon
            className="text-xl"
            onClick={() => setIsSearchOpen(true)}
          />
          <Link href="/account/notifications" className="relative">
            <BellIcon className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
          </Link>
          <Link href="/account/wishlist">
            <WishlistIcon className="text-xl" />
          </Link>
        </div>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-6 py-3 flex items-center justify-between">
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
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border-2 border-background" />
        </Link>
        <Link href="/account">
          <UserIcon className="text-[25px]" />
        </Link>
      </nav>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
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
