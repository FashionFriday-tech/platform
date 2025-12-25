"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Heart,
  Home,
} from "lucide-react";

// --- Data Configuration ---
const navStructure = [
  {
    label: "New Arrivals",
    href: "/new",
    featuredImg: "/images/nav/new-drop.jpg",
    subCategories: ["Just In", "Best Sellers", "Back in Stock", "Trending Now"],
  },
  {
    label: "Men",
    href: "/men",
    featuredImg: "/images/nav/men-street.jpg",
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
    featuredImg: "/images/nav/women-edit.jpg",
    subCategories: ["Dresses", "Tops", "Activewear", "Denim", "Jewelry"],
  },
  {
    label: "Sale",
    href: "/sale",
    featuredImg: "/images/nav/sale-banner.jpg",
    subCategories: ["Shop All Sale", "Under ₹999", "Final Clearance"],
    isRed: true,
  },
  {
    label: "snkrs",
    href: "/sneakers",
    featuredImg: "/images/nav/women-edit.jpg",
    subCategories: ["Dresses", "Tops", "Activewear", "Denim", "Jewelry"],
  },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Listener for Glass Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Marquee Content - Repeating for smooth loop
  const marqueeText = "FREE SHIPPING ON PRE PAY • COD avilable +200 advance";
  const marqueeContent = Array(10).fill(marqueeText); // Repeat 10 times

  return (
    <>
      {/* ------------------------------------------------
          1. DESKTOP HEADER (The "Glass Sheet")
      ------------------------------------------------ */}
      <header
        onMouseLeave={() => setActiveMenu(null)}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${
          isScrolled || activeMenu
            ? "bg-white backdrop-blur-xl text-black"
            : "bg-transparent text-black"
        }`}
      >
        <div className="mx-auto bg-black text-white border-y-2 px-6 lg:px-12 flex items-center justify-between z-50 relative">
          {/* Logo */}
          <Link href="/" className="z-50 relative group invert">
            <img
              src="logos/ff-full-logo.jpg"
              alt="fashion friday"
              className="w-50"
            />
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
                  className={`relative px-2 py-4 text-[14px] font-bold uppercase tracking-[0.15em] transition-colors group
                    ${item.isRed ? "text-red-500" : "hover:text-neutral-300"}
                  `}
                >
                  {item.label}
                  <span className="absolute bottom-2 left-0 w-0  bg-current transition-all duration-300 group-hover:w-full" />
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5 z-50">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 text-xs font-medium uppercase tracking-wider hover:opacity-60 transition-opacity"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            <div className="h-4 bg-white/20 hidden lg:block" />

            <Link
              href="/wishlist"
              className="hover:opacity-60 transition-opacity"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <button className="relative hover:opacity-60 transition-opacity">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                2
              </span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------
            SCROLLING MARQUEE BANNER
        ------------------------------------------------ */}
        <div className="bg-black text-white border-b border-white/10 overflow-hidden py-2 relative z-40">
          <div className="flex whitespace-nowrap animate-marquee">
            {/* Render content twice to create seamless loop */}
            <div className="flex gap-10 px-5">
              {marqueeContent.map((text, i) => (
                <span
                  key={`a-${i}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  {text}
                </span>
              ))}
            </div>
            <div className="flex gap-10 px-5">
              {marqueeContent.map((text, i) => (
                <span
                  key={`b-${i}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------
            2. THE VISUAL MEGA MENU
        ------------------------------------------------ */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 w-full bg-white border-t border-black/5 shadow-xl overflow-hidden text-black z-30"
            >
              <div className="container mx-auto px-12 py-12">
                <div className="grid grid-cols-12 gap-12">
                  {/* Left: Categories */}
                  <div className="col-span-4 border-r border-black/5">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
                      Explore {activeMenu}
                    </h3>
                    <ul className="space-y-4">
                      {navStructure
                        .find((n) => n.label === activeMenu)
                        ?.subCategories.map((sub) => (
                          <li key={sub}>
                            <Link
                              href="#"
                              className="text-2xl font-black uppercase tracking-tight hover:text-neutral-500 transition-colors flex items-center gap-4 group"
                            >
                              {sub}
                              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-neutral-400" />
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Middle: Editorial Image */}
                  <div className="col-span-5 relative h-80 bg-neutral-100 group overflow-hidden rounded-4xl">
                    <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
                      <span className="text-xs uppercase tracking-widest">
                        <img
                          src="images/model/aj.png"
                          alt="model"
                          className="object-cover object-top"
                        />
                      </span>
                    </div>
                    <span className="absolute bottom-6 left-6 bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-black">
                      New Season
                    </span>
                  </div>

                  {/* Right: Quick Links */}
                  <div className="col-span-3 flex flex-col justify-end pb-2">
                    <div className="bg-black text-white p-6 rounded-3xl">
                      <p className="text-lg font-bold leading-tight mb-4">
                        COD Avilable Rs200+ Advance.
                      </p>
                      <Link
                        href="/shipping"
                        className="text-xs underline underline-offset-4 uppercase tracking-widest hover:text-neutral-300"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ------------------------------------------------
          3. MOBILE APP-BAR (Bottom Navigation)
      ------------------------------------------------ */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-50 bg-black/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-white/10 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
        >
          <Home className="w-5 h-5" />
        </Link>
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-white text-black p-3 rounded-full -mt-8 shadow-lg shadow-white/20 border-4 border-[#050505]"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link
          href="/wishlist"
          className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
        >
          <Heart className="w-5 h-5" />
        </Link>
        <Link
          href="/cart"
          className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </Link>
      </nav>

      <div className="lg:hidden fixed top-0 w-full p-6 z-40 bg-linear-to-b from-white/80 to-transparent pointer-events-none">
        <span className="font-black text-xl tracking-tighter uppercase text-black">
          FF.
        </span>
      </div>

      {/* ------------------------------------------------
          4. FULL SCREEN SEARCH OVERLAY
      ------------------------------------------------ */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-white/95 backdrop-blur-xl flex flex-col pt-32 px-6 lg:px-32"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-8 right-8 p-2 hover:bg-neutral-100 rounded-full"
            >
              <X className="w-8 h-8 text-black" />
            </button>

            <div className="w-full max-w-4xl mx-auto">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-4 block">
                Type to search
              </span>
              <input
                type="text"
                placeholder="E.g. Oversized Hoodie"
                className="w-full text-4xl md:text-6xl font-black uppercase tracking-tighter border-b-2 border-black/10 focus:border-black bg-transparent py-4 outline-none placeholder:text-neutral-200"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-60 bg-[#050505] text-white flex flex-col p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="font-black text-2xl uppercase">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>
            <div className="space-y-6">
              {navStructure.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-4xl font-black uppercase tracking-tighter text-transparent stroke-text hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        /* Marquee Animation */
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }

        /* Stroke Text Effect */
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
        }
        .stroke-text:hover {
          -webkit-text-stroke: 0px transparent;
        }
      `}</style>
    </>
  );
}
