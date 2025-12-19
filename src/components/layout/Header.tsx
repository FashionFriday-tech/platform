"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="w-full flex flex-col font-sans px-1">
      {/* --- PART 1: TOP UTILITY BAR (Gray) --- */}
      <div className="w-full py-2 flex items-center justify-between px-8 lg:px-12 text-[12px] font-medium text-gray-900 z-50">
        {/* Left: Promo Text */}
        <div>
          <span className="cursor-default">Just Landed: The Treadly App. </span>
          <Link
            href="/app"
            className="underline font-bold ml-1 hover:text-gray-600"
          >
            Learn More
          </Link>
        </div>

        {/* Right: Account Links */}
        <div className="flex items-center gap-4">
          <Link href="/signin" className="hover:text-gray-600">
            Sign In
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/join" className="hover:text-gray-600">
            Join Us
          </Link>
          <span className="text-gray-400">|</span>
          <button className="hover:text-gray-600 flex items-center gap-1">
            Help
          </button>
        </div>
      </div>

      {/* --- PART 2: MAIN NAVIGATION (White) --- */}
      <div className="w-full border-y-2 border-black bg-white flex items-center justify-between px-8 lg:px-12 relative transition-colors z-40">
        {/* A. LOGO (Absolute Left) */}
       <div className="flex border-r-2 pr-10 h-full p-3">
         <Link href="/">
          <Image
            src="/logos/ff-full-logo.jpg"
            alt="Treadly Brand Logo"
            width={120}
            height={40}
            className="w-70 object-contain"
            priority
          />
        </Link>
       </div>

        {/* B. NAVIGATION (Absolute Center) */}
        {/* We use absolute positioning to ensure it stays dead center regardless of logo/search width */}
        <nav className="hidden lg:flex w-full justify-center items-center gap-6">
          <NavLink href="/new">New Releases</NavLink>
          <NavLink href="/men">Men</NavLink>
          <NavLink href="/women">Women</NavLink>
          <NavLink href="/kids">Kids</NavLink>
          <NavLink href="/sale">Sale</NavLink>
          <NavLink href="/collections">Collections</NavLink>
        </nav>

        {/* C. ACTIONS (Right) */}
        <div className="flex items-center">
          {/* Icons */}
          <button className="p-4 hover:bg-gray-100 transition-colors border-r-2">
            <Heart className="w-6 h-6 text-gray-900" />
          </button>
          <button className="p-4 hover:bg-gray-100 transition-colors border-r-2">
            <Heart className="w-6 h-6 text-gray-900" />
          </button>
          <button className="p-4 hover:bg-gray-100 transition-colors border-r-2">
            <ShoppingBag className="w-6 h-6 text-gray-900" />
          </button>
        </div>
      </div>
    </header>
  );
}

// --- Helper Component for Links ---
function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-base font-medium text-gray-900 hover:scale-90 transition-all duration-300"
    >
      {children}
    </Link>
  );
}
