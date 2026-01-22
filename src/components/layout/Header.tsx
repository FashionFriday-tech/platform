"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { TbListSearch, TbCategoryPlus } from "react-icons/tb";
import { GrFavorite } from "react-icons/gr";
import { PiShoppingBagOpen } from "react-icons/pi";
import { FiSearch, FiBell } from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { SearchOverlay } from "./SearchOverlay/SearchOverlay";

// --- Data Configuration ---
const navStructure = [
  {
    label: "New Arrivals",
    href: "/new",
    subCategories: ["Just In", "Best Sellers", "Back in Stock", "Trending Now"],
  },
  {
    label: "Men",
    href: "/men",
    subCategories: [
      "T-Shirts",
      "Hoodies & Sweatshirts",
      "Outerwear",
      "Bottoms",
      "Footwear",
    ],
  },
  {
    label: "Women",
    href: "/women",
    subCategories: ["Dresses", "Tops", "Activewear", "Denim", "Jewelry"],
  },
  {
    label: "Sale",
    href: "/sale",
    subCategories: ["Shop All Sale", "Under ₹999", "Final Clearance"],
    isRed: true,
  },
  {
    label: "snkrs",
    href: "/sneakers",
    subCategories: ["Dresses", "Tops", "Activewear", "Denim", "Jewelry"],
  },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Marquee Content
  const marqueeText = "FREE SHIPPING ON PRE PAY • COD available +200 advance";
  const marqueeContent = Array(10).fill(marqueeText);

  return (
    <>
      {/* 1. DESKTOP HEADER */}
      <header
        onMouseLeave={() => setActiveMenu(null)}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background"
      >
        <div className="relative hidden sm:flex items-center justify-between z-50 mx-auto text-foreground px-6 lg:px-12 h-16">
          {/* Logo - Uses brand-primary via filter or just standard rendering */}
          <Link href="/" className="z-50 relative h-8 flex items-center">
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Fashion Friday
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 h-full">
            {navStructure.map((item) => (
              <div
                key={item.label}
                onMouseEnter={() => setActiveMenu(item.label)}
                className="h-full flex items-center"
              >
                <Link
                  href={item.href}
                  className={`relative px-2 py-4 text-[14px] font-bold uppercase tracking-widest transition-colors group
                    ${item.isRed ? "text-destructive" : "text-foreground"}
                  `}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5 z-50">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground transition-colors"
            >
              <FiSearch className="text-lg" />
              <span>Search</span>
            </button>

            <div className="h-4 w-px bg-border hidden lg:block" />

            <div className="flex items-center gap-4 text-foreground">
              <Link href="/account/wishlist" className="transition-colors">
                <GrFavorite className="text-xl" />
              </Link>
              <Link
                href="/checkout/cart"
                className="relative transition-colors"
              >
                <PiShoppingBagOpen className="text-2xl" />
                <span className="absolute -top-1.5 -right-1.5 bg-brand text-brand-foreground text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  2
                </span>
              </Link>
              <Link
                href="/account"
                className="hover:text-foreground transition-colors"
              >
                <BiUser className="text-2xl" />
              </Link>
            </div>
          </div>
        </div>

        {/* MARQUEE BANNER */}
        <div className="hidden sm:block bg-foreground text-background  py-1.5 relative z-40">
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

        {/* MEGA MENU */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 w-full bg-background-elevated border-t border-border shadow-2xl text-foreground z-30"
            >
              <div className="container mx-auto px-12 py-10">
                <div className="grid grid-cols-12 gap-12">
                  <div className="col-span-4">
                    <h3 className="text-[10px] font-black text-foreground-subtle uppercase tracking-widest mb-6">
                      Explore {activeMenu}
                    </h3>
                    <ul className="space-y-3">
                      {navStructure
                        .find((n) => n.label === activeMenu)
                        ?.subCategories.map((sub) => (
                          <li key={sub}>
                            <Link
                              href="#"
                              className="text-2xl font-black uppercase tracking-tighter hover:text-brand transition-colors flex items-center justify-between group"
                            >
                              {sub}
                              <IoIosArrowForward className="opacity-0 group-hover:opacity-100 transition-all text-brand" />
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="col-span-8 bg-background-muted rounded-3xl h-64 overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center text-foreground-subtle uppercase text-[10px] font-black tracking-widest">
                      Featured Editorial
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. MOBILE TOP BAR */}
      <div className="sticky top-0 lg:hidden w-full px-4 py-3 z-50 bg-background text-foreground flex justify-between items-center">
        <Link href="/account" className="flex items-center gap-4">
          <Image
            src="/images/model/aj.png"
            width={50}
            height={50}
            alt="Ajmal"
            className="w-10 h-10 rounded-full object-cover object-top border-2 border-foreground"
          />
          <span className="font-semibold">HELLO, AJMAL</span>
        </Link>
        <div className="flex items-center gap-4">
          <FiSearch
            className="text-xl text-foreground"
            onClick={() => setIsSearchOpen(true)}
          />
          <Link
            href="/account/notifications"
            className="relative text-foreground"
          >
            <FiBell className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full" />
          </Link>
          <Link href="/account/wishlist" className="text-foreground">
            <GrFavorite className="text-xl" />
          </Link>
        </div>
      </div>

      {/* 3. MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background text-foreground px-6 py-3 flex items-center justify-between">
        <Link
          href="/categories"
          className="text-foreground hover:text-brand transition-colors"
        >
          <TbCategoryPlus className="text-[25px]" />
        </Link>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-foreground hover:text-brand transition-colors"
        >
          <TbListSearch className="text-[25px]" />
        </button>
        <Link href="/" className="scale-110">
          <Image
            src="/images/logos/ff-logo.png"
            width={32}
            height={32}
            alt="logo"
            className="dark:invert transition-all"
          />
        </Link>
        <Link
          href="/checkout/cart"
          className="relative text-foreground hover:text-brand transition-colors"
        >
          <PiShoppingBagOpen className="text-[25px]" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border-2 border-background" />
        </Link>
        <Link
          href="/account"
          className="text-foreground hover:text-brand transition-colors"
        >
          <BiUser className="text-[25px]" />
        </Link>
      </nav>

      {/* 4. SEARCH OVERLAY */}
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
        .stroke-text {
          -webkit-text-stroke: 1px var(--text-muted);
          color: transparent;
        }
        .stroke-text:hover {
          -webkit-text-stroke: 0px transparent;
          color: var(--text-primary);
        }
      `}</style>
    </>
  );
}
