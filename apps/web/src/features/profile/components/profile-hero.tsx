'use client';

import React from 'react';
import Link from 'next/link';

import { ArrowUpRightIcon, CrownIcon, SmartphoneIcon, SparklesIcon, ZapIcon } from '@ff/ui';
import { motion } from 'motion/react';

import { useAuth } from '@/context/AuthContext';

import { userData as fallbackData } from '../data/profile';

export function ProfileHero() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="m-8 h-96 animate-pulse rounded-4xl bg-zinc-800/10" />;
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:pt-32">
        <div className="border-border relative overflow-hidden rounded-[2.5rem] border bg-zinc-800/5 p-8 text-center md:p-16 dark:bg-zinc-800/20">
          <h2 className="mb-6 text-3xl font-black tracking-tighter uppercase md:text-5xl">
            Unlock Your Style Dashboard
          </h2>
          <p className="text-foreground-muted mx-auto mb-10 max-w-xl text-sm leading-relaxed font-bold tracking-widest uppercase md:text-base">
            Login to track orders, manage your profile, and access exclusive loyalty perks.
          </p>
          <Link
            href="/login"
            className="bg-foreground text-background inline-block rounded-full px-10 py-5 text-xs font-black tracking-[0.2em] uppercase hover:opacity-90"
          >
            Login / Join the Club
          </Link>
        </div>
      </section>
    );
  }

  const userData = {
    ...fallbackData,
    name: user.name || user.phone || 'Fashion Fan',
    email: user.email,
    loyaltyPoints:
      typeof user.loyaltyPoints === 'number' ? user.loyaltyPoints : fallbackData.loyaltyPoints,
  };

  const progressPercentage = (userData.loyaltyPoints / userData.pointsToNextTier) * 100;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:pt-24">
      {/* Header */}
      <div className="mb-10">
        <p className="text-foreground-muted text-xs font-bold tracking-[0.35em] uppercase">
          Account Dashboard
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tighter uppercase md:text-5xl">
          Welcome, {userData.name}
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT: Premium Loyalty Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ rotateX: 4, rotateY: -4 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          className="from-foreground via-foreground/90 to-foreground/80 text-background relative aspect-[1.6/1] overflow-hidden rounded-4xl bg-linear-to-br p-8 md:p-10"
        >
          {/* Noise / Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noisy.png')] opacity-10" />

          {/* Glow Edge */}
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10" />

          {/* Card Content */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            {/* Top */}
            <div className="flex items-center justify-between">
              <div className="from-background/40 to-background/10 border-background/20 h-10 w-14 rounded-lg border bg-linear-to-br" />
              <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                {userData.tierName}
                <CrownIcon size={18} />
              </div>
            </div>

            {/* Middle */}
            <div>
              <p className="mb-3 text-xs tracking-[0.25em] uppercase opacity-60">
                Membership Credits
              </p>
              <div className="flex items-baseline gap-4 font-mono">
                <span className="text-3xl font-bold tracking-widest md:text-4xl">
                  {userData.loyaltyPoints.toString().padStart(4, '0')}
                </span>
                <span className="text-sm opacity-60">PTS</span>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] tracking-widest uppercase opacity-60">Cardholder</p>
                <p className="text-lg font-bold uppercase">{userData.name}</p>
              </div>

              <div className="text-right">
                <p className="text-[10px] tracking-widest uppercase opacity-60">Valid Thru</p>
                <p className="font-mono tracking-wider">12 / 26</p>
              </div>
            </div>
          </div>

          {/* Light sweep */}
          <div className="absolute inset-0 translate-x-[-120%] bg-linear-to-tr from-transparent via-white/10 to-transparent transition-transform duration-500 hover:translate-x-[120%]" />
        </motion.div>

        {/* RIGHT: Stats + Perks */}
        <div className="flex flex-col gap-6">
          {/* Progress */}
          <div className="border-border bg-background rounded-3xl border p-6">
            <div className="mb-3 flex justify-between text-xs font-bold tracking-widest uppercase">
              <span>Next Tier Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="bg-background-muted h-2 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="bg-foreground h-full rounded-full"
              />
            </div>
            <p className="text-foreground-muted mt-3 text-xs">
              {userData.pointsToNextTier} points required to unlock next tier
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-4">
            <BenefitCard icon={<ZapIcon size={18} />} title="Instant Cashback" />
            <BenefitCard icon={<SmartphoneIcon size={18} />} title="Priority Access" />
            <BenefitCard icon={<ArrowUpRightIcon size={18} />} title="Tier Perks" />
            <BenefitCard icon={<SparklesIcon size={18} />} title="Exclusive Drops" />
          </div>

          {/* CTA */}
          <button className="bg-foreground text-background mt-2 flex items-center justify-between rounded-full px-6 py-4 text-xs font-bold tracking-widest uppercase transition hover:opacity-90">
            View All Benefits
            <ArrowUpRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="border-border bg-background hover:bg-background-muted rounded-2xl border p-4 transition-colors">
      <div className="text-foreground mb-3">{icon}</div>
      <p className="text-foreground-muted text-[11px] font-bold tracking-widest uppercase">
        {title}
      </p>
    </div>
  );
}
