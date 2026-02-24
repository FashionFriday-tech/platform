'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ArrowBackIconIOS, ArrowForwardIconIOS, CloseIcon, HamburgerMenuIcon } from '@ff/ui';

import { type HelpSection, helpSections } from './constants';

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeSection = helpSections.find((s: HelpSection) => s.href === pathname);

  return (
    <div className="bg-background text-foreground selection:bg-background selection:text-white">
      {/* --- SEMANTIC HEADER (SEO Friendly) --- */}
      <header className="bg-background fixed top-0 z-50 h-20 w-full transition-all duration-300">
        <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-6">
          <button
            onClick={() => {
              router.back();
            }}
            aria-label="Go back"
          >
            <ArrowBackIconIOS className="text-2xl" />
          </button>

          <div className="flex flex-col text-center">
            <span className="text-foreground-subtle text-[8px] font-black tracking-[0.4em] uppercase">
              Support Hub
            </span>
            <span className="text-[10px] font-black tracking-widest uppercase">
              {activeSection?.label ?? 'Directory'}
            </span>
          </div>

          <button
            onClick={() => {
              setIsMenuOpen(true);
            }}
            className="text-foreground"
          >
            <HamburgerMenuIcon size={20} />
          </button>
        </div>
      </header>

      {/* --- SIDEBAR OVERLAY --- */}
      <div
        className={`fixed inset-0 z-60 transition-all duration-500 ${
          isMenuOpen ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        {/* Backdrop for performance: use simple opacity */}
        <div
          className="bg-background/60 absolute inset-0 backdrop-blur-sm"
          onClick={() => {
            setIsMenuOpen(false);
          }}
        />

        <nav
          className={`bg-background border-border absolute top-0 right-0 h-full w-full border-l transition-transform duration-500 ease-out sm:w-96 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="border-border flex h-20 items-center justify-between border-b px-8">
            <p className="text-xs font-black tracking-widest uppercase">Navigation</p>
            <button
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <div className="h-[calc(100vh-80px)] space-y-2 overflow-y-auto p-4">
            {helpSections.map((item: HelpSection) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                className={`border-border flex items-center justify-between rounded-4xl border p-8 text-xl transition-all ${
                  pathname === item.href
                    ? 'bg-foreground text-background'
                    : 'hover:bg-background-muted'
                }`}
              >
                <div className="flex items-center gap-6">
                  <item.icon />
                  <span className="tracking-tighter uppercase">{item.label}</span>
                </div>
                <ArrowForwardIconIOS />
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <main>{children}</main>
    </div>
  );
}
