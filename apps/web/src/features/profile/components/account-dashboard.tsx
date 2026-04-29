'use client';

import React from 'react';
import Link from 'next/link';

import { HeartIcon, HistoryIcon, LoaderIcon, ShieldCheckIcon, StarIcon } from '@ff/ui';

import { useAuth } from '@/context/AuthContext';

import { ActivityItem } from './activity-item';
import { ProfileHero } from './profile-hero';
import { QuickLinksGrid } from './quick-links-grid';

export function AccountDashboard() {
  const { user, loading, logout } = useAuth();

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
            <div className="mx-auto max-w-4xl px-4 py-12">
              <div className="bg-background-elevated border-border relative overflow-hidden rounded-[3rem] border p-8 text-center shadow-lg md:p-16">
                <div className="bg-brand/10 text-brand mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
                  <ShieldCheckIcon size={32} />
                </div>
                <h1 className="mb-4 text-3xl font-black tracking-tighter uppercase md:text-5xl">
                  Member Area
                </h1>
                <p className="text-foreground-muted mx-auto mb-8 max-w-lg text-xs leading-relaxed font-bold tracking-widest uppercase">
                  Join the club to track orders, manage your profile, and access exclusive loyalty
                  perks.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="bg-foreground text-background w-full rounded-full px-10 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:scale-105 hover:opacity-90 sm:w-auto"
                  >
                    Login to Account
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
                {user ? (
                  <button
                    onClick={() => void logout()}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-foreground text-background flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all hover:opacity-90"
                  >
                    Login
                  </Link>
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
