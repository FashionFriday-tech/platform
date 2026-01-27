"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { helpSections, HelpSection } from "./constants";
import { IoIosArrowBack } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeSection = helpSections.find(
    (s: HelpSection) => s.href === pathname
  );

  return (
    <div className="bg-background text-foreground selection:bg-background selection:text-white">
      {/* --- SEMANTIC HEADER (SEO Friendly) --- */}
      <header className="fixed top-0 z-50 w-full transition-all duration-300 h-20 bg-background">
        <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center justify-between">
          <button onClick={() => router.back()} aria-label="Go back">
            <IoIosArrowBack className="text-2xl" />
          </button>

          <div className="text-center flex flex-col">
            <span className="text-[8px] uppercase tracking-[0.4em] text-foreground-subtle font-black">
              Support Hub
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">
              {activeSection?.label || "Directory"}
            </span>
          </div>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-foreground"
          >
            <RxHamburgerMenu size={20} />
          </button>
        </div>
      </header>

      {/* --- SIDEBAR OVERLAY --- */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Backdrop for performance: use simple opacity */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />

        <nav
          className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-background border-l border-border transition-transform duration-500 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-20 flex items-center justify-between px-8 border-b border-border">
            <p className="text-xs font-black uppercase tracking-widest">
              Navigation
            </p>
            <button onClick={() => setIsMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
            {helpSections.map((item: HelpSection) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center justify-between p-10 rounded-4xl transition-all border border-border text-2xl ${
                  pathname === item.href
                    ? "bg-foreground text-background"
                    : "hover:bg-background-muted "
                }`}
              >
                <div className="flex items-center gap-6">
                  {item.icon}
                  <span className="font-bold uppercase tracking-tighter">
                    {item.label}
                  </span>
                </div>
                <IoIosArrowForward />
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
