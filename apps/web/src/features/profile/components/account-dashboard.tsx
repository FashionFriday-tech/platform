'use client';

import React from 'react';
import Link from 'next/link';

import {
  ArrowRightIcon,
  CrownIcon,
  PackageIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@ff/ui';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth-store';

import { ProfileHero } from './profile-hero';
import { QuickLinksGrid } from './quick-links-grid';

export function AccountDashboard() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <main className="max-w-8xl mx-auto px-4 py-8 sm:px-10 sm:py-16">
          <section className="mx-auto mb-10 max-w-4xl">
            <div className="border-border/40 bg-background-muted/40 relative overflow-hidden rounded-[2.5rem] border p-6 text-center sm:p-10 md:p-12">
              <Skeleton className="mx-auto mb-3 h-8 w-64 rounded-xl sm:h-12 sm:w-96" />
              <Skeleton className="mx-auto mb-6 h-4 w-4/5 max-w-md rounded-md" />
              <div className="mb-8 flex flex-wrap justify-center gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="mx-auto h-12 w-48 rounded-xl sm:h-14 sm:w-56" />
            </div>
          </section>

          <section className="mt-8">
            <div className="divide-border/20 grid grid-cols-1 divide-y sm:grid-cols-2 sm:gap-4 sm:divide-y-0 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="sm:border-border/30 sm:bg-background-muted/20 flex items-center gap-4 p-4 sm:flex-col sm:items-center sm:rounded-3xl sm:border sm:p-6"
                >
                  <Skeleton className="h-10 w-10 shrink-0 rounded-2xl sm:h-12 sm:w-12" />
                  <div className="flex flex-1 flex-col gap-2 sm:w-full sm:items-center">
                    <Skeleton className="h-5 w-24 rounded-md sm:w-32" />
                    <Skeleton className="hidden h-3 w-40 rounded-md sm:block" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <main className="max-w-8xl mx-auto px-2 sm:px-10 sm:py-16">
        {/* 1. Hero Section - Conditional: ProfileHero if user, Improved Member Area with Crossed Button if guest */}
        <section>
          {user ? (
            <ProfileHero />
          ) : (
            <div className="mx-auto max-w-4xl px-2 py-6 sm:px-4 sm:py-10">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 p-6 text-center shadow-2xl sm:p-10 md:p-14">
                {/* Background Streetwear Grid Accent & Ambient Glow */}
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"
                  aria-hidden="true"
                />

                {/* Main Heading */}
                <h1 className="relative z-10 mb-3 text-2xl font-black tracking-tight text-white uppercase sm:text-4xl md:text-5xl">
                  Unlock Exclusive Member Perks
                </h1>

                {/* Descriptive Copy */}
                <p className="relative z-10 mx-auto mb-8 max-w-xl text-xs leading-relaxed font-medium text-zinc-400 sm:text-sm">
                  Sign in with your WhatsApp number to access priority Friday drop reserves,
                  real-time live courier dispatch tracking, curated wishlist sync, and loyalty
                  perks.
                </p>

                {/* VIP Benefits Grid */}
                <div className="relative z-10 mx-auto mb-9 grid max-w-2xl grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3.5 text-center backdrop-blur-sm transition-all hover:border-zinc-700">
                    <ZapIcon className="mx-auto mb-1.5 h-5 w-5 text-amber-400" />
                    <p className="text-[10px] font-black tracking-wider text-white uppercase">
                      Early Drops
                    </p>
                    <p className="text-[9px] font-medium text-zinc-500">15-Min Priority</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3.5 text-center backdrop-blur-sm transition-all hover:border-zinc-700">
                    <PackageIcon className="mx-auto mb-1.5 h-5 w-5 text-sky-400" />
                    <p className="text-[10px] font-black tracking-wider text-white uppercase">
                      Live Tracking
                    </p>
                    <p className="text-[9px] font-medium text-zinc-500">Real-Time Dispatch</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3.5 text-center backdrop-blur-sm transition-all hover:border-zinc-700">
                    <CrownIcon className="mx-auto mb-1.5 h-5 w-5 text-purple-400" />
                    <p className="text-[10px] font-black tracking-wider text-white uppercase">
                      Loyalty Vault
                    </p>
                    <p className="text-[9px] font-medium text-zinc-500">Earn FF Points</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-3.5 text-center backdrop-blur-sm transition-all hover:border-zinc-700">
                    <ShieldCheckIcon className="mx-auto mb-1.5 h-5 w-5 text-emerald-400" />
                    <p className="text-[10px] font-black tracking-wider text-white uppercase">
                      Authentic
                    </p>
                    <p className="text-[9px] font-medium text-zinc-500">100% Verified Hype</p>
                  </div>
                </div>

                {/* Crossed Box Design CTA Button */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <Link
                    href="/login"
                    className="group relative inline-flex -skew-x-[12deg] items-center justify-center rounded-md border border-white bg-white px-10 py-4 text-xs font-black tracking-[0.25em] text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] sm:-skew-x-[14deg] sm:rounded-lg sm:text-sm"
                  >
                    <span className="flex skew-x-[12deg] items-center justify-center gap-2.5 sm:skew-x-[14deg]">
                      <span>Login to Account</span>
                      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2. Grid Navigation - ALWAYS VISIBLE */}
        <section>
          <QuickLinksGrid />
        </section>

        <div className="h-16" />
      </main>
    </div>
  );
}
