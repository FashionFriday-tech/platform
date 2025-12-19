"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Heart, ShoppingBag, User, Search, Store } from "lucide-react";

const navLinks = [
  { name: "Men", href: "/shop/men" },
  { name: "Women", href: "/shop/women" },
  { name: "Children", href: "/shop/children" },
  { name: "New Collection", href: "/shop/new" },
  // Popular is split by search in the design
  { name: "About", href: "/about" },
  { name: "FAQ's", href: "/faq" },
];

export function Header() {
  return (
    // Outer header container with a sharp bottom border
    <header className="w-full bg-white">
        <div className="bg-black h-10 flex justify-center items-center text-gray-300">10% Offer on first order</div>
      <div className="mx-auto px-6 py-3">
        {/* --- TOP ROW: Logo & Actions --- */}
        <div className="relative flex items-center justify-between mb-4">
          {/* Left: Hamburger Menu (Square Button) */}
          <button
            aria-label="Menu"
            className="p-2 border-2 rounded-full border-transparent hover:border-gray-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/logos/ff-full-logo.jpg"
              alt="Treadly Brand Logo"
              width={120}
              height={40}
              className="w-50 h-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Action Icons (Square Buttons) */}
          <div className="flex items-center gap-3">
            <IconButton icon={<Search className="w-5 h-5" />} label="Search" />
            <IconButton icon={<Heart className="w-5 h-5" />} label="Wishlist" />
            <IconButton
              icon={<ShoppingBag className="w-5 h-5" />}
              label="Cart"
            />
            <IconButton icon={<User className="w-5 h-5" />} label="Account" />
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Local Helper Components for consistent "Boxy" styling ---

// A reusable square button for icons
function IconButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      aria-label={label}
      className="p-2 border-2 rounded-full border-transparent hover:border-gray-900 transition-colors"
    >
      {icon}
    </button>
  );
}

// A reusable rectangular navigation link
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
      className="px-5 py-3 text-sm font-semibold uppercase tracking-wider bg-gray-100 rounded-full border-2 border-transparent hover:border-black text-gray-800 transition-all whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

{
  /* --- BOTTOM ROW: Navigation & Search --- */
}
{/* <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
  <nav className="flex items-center gap-3 shrink-0">
    {navLinks.slice(0, 4).map((link) => (
      <NavLink key={link.name} href={link.href}>
        {link.name}
      </NavLink>
    ))}
  </nav>

  <div className="relative grow shrink-0">
    <input
      type="text"
      placeholder="SEARCH..."
      className="w-full py-3 pl-4 pr-12 text-sm font-medium uppercase bg-gray-100 rounded-full border-2 border-transparent hover:border-gray-800 focus:border-gray-900 focus:outline-none transition-colors placeholder:text-gray-800"
    />
    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-800">
      <span className="p-2 flex bg-white rounded-full">
        <Search className="w-5 h-5" />
      </span>
    </button>
  </div>

 
  <nav className="flex items-center gap-3 shrink-0">
    {navLinks.slice(4).map((link) => (
      <NavLink key={link.name} href={link.href}>
        {link.name}
      </NavLink>
    ))}
  </nav>
</div> */}
