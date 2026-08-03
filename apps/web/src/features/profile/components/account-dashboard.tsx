'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  ArrowRightIcon,
  CrownIcon,
  HeartIcon,
  HistoryIcon,
  LoaderIcon,
  PackageIcon,
  ShieldCheckIcon,
  StarIcon,
  ZapIcon,
} from '@ff/ui';
import { toast } from 'sonner';

import { useAuthStore } from '@/store/auth-store';

import { ActivityItem } from './activity-item';
import { ProfileHero } from './profile-hero';
import { QuickLinksGrid } from './quick-links-grid';

export function AccountDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderIcon className="text-brand animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      <main className="max-w-8xl mx-auto px-2 sm:px-10 sm:py-16">
        {/* 1. Hero Section - Conditional: ProfileHero if user, LoginSection if guest */}
        <section>
          {user ? (
            <ProfileHero />
          ) : (
            <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
              <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 p-6 text-center shadow-2xl md:p-14">
                {/* Subtle Radial Glow */}
                <div
                  className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/5 blur-3xl"
                  aria-hidden="true"
                />

                {/* Eyebrow Badge */}
                <div className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-black tracking-[0.25em] text-zinc-300 uppercase">
                    VIP CLUB ACCESS // EXCLUSIVE MEMBER PORTAL
                  </span>
                </div>

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

                {/* Curved Design CTA Button */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-white px-10 py-4 text-xs font-black tracking-[0.25em] text-black uppercase shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-zinc-200 active:scale-95 sm:w-auto"
                  >
                    <span>Login to Account</span>
                    <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

        {/* 3. Recent Activities Section */}
        <section className="mt-12">
          <div className="bg-background-muted/30 border-border rounded-[2.5rem] border p-6 md:p-12">
            <header className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="text-foreground-subtle mb-1 text-[10px] font-bold tracking-[0.3em] uppercase">
                  Timeline
                </h2>
                <p className="text-3xl font-black tracking-tighter uppercase">Recent Activity</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-foreground hover:text-brand hidden items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-colors sm:flex">
                  <HistoryIcon size={14} />
                  Full History
                </button>
                {/* Only render logout button if user is authenticated; no guest login button here */}
                {user && (
                  <button
                    onClick={() => void handleLogout()}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    Logout
                  </button>
                )}
              </div>
            </header>

            {user ? (
              <>
                {/* Activity List */}
                <div className="flex flex-col">
                  <ActivityItem
                    icon={<StarIcon size={16} className="text-brand" />}
                    title="Earned 500 Loyalty Points"
                    desc="Bonus points for completing your style profile."
                    time="2 hours ago"
                  />
                  <ActivityItem
                    icon={<HeartIcon size={16} />}
                    title="Added to Favorites"
                    desc="Oversized Wool Blazer added to your wishlist."
                    time="Yesterday"
                  />
                  <ActivityItem
                    icon={<ShieldCheckIcon size={16} />}
                    title="Security Update"
                    desc="Two-factor authentication successfully enabled."
                    time="Jan 08, 2026"
                  />
                </div>

                {/* CTA for Mobile */}
                <button className="text-foreground-subtle border-border active:bg-background-muted mt-8 w-full rounded-full border py-4 text-xs font-bold tracking-widest uppercase sm:hidden">
                  View Full History
                </button>
              </>
            ) : (
              <div className="py-12 text-center text-zinc-500">
                <p className="text-xs font-bold tracking-widest uppercase">
                  Login to see your account activity timeline
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="h-20" />
      </main>
    </div>
  );
}
