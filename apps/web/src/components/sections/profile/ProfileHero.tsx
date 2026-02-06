"use client";

import { CrownIcon, ZapIcon, SmartphoneIcon, ArrowUpRightIcon, SparklesIcon } from "@ff/ui";
import { userData } from "@/data/profile";
import { motion } from "framer-motion";

export default function ProfileHero() {
  const progressPercentage =
    (userData.loyaltyPoints / userData.pointsToNextTier) * 100;

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 py-6 md:pt-24">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-foreground-muted">
          Account Dashboard
        </p>
        <h1 className="mt-2 text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Welcome, {userData.name}
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        {/* LEFT: Premium Loyalty Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ rotateX: 4, rotateY: -4 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative aspect-[1.6/1] rounded-4xl p-8 md:p-10
          bg-linear-to-br from-foreground via-foreground/90 to-foreground/80
          text-background
          overflow-hidden"
        >
          {/* Noise / Texture */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/noisy.png')]" />

          {/* Glow Edge */}
          <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10" />

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top */}
            <div className="flex justify-between items-center">
              <div className="w-14 h-10 rounded-lg bg-linear-to-br from-background/40 to-background/10 border border-background/20" />
              <div className="flex items-center gap-2 text-xs font-black tracking-widest uppercase">
                {userData.tierName}
                <CrownIcon size={18} />
              </div>
            </div>

            {/* Middle */}
            <div>
              <p className="text-xs uppercase tracking-[0.25em] opacity-60 mb-3">
                Membership Credits
              </p>
              <div className="flex items-baseline gap-4 font-mono">
                <span className="text-3xl md:text-4xl font-bold tracking-widest">
                  {userData.loyaltyPoints.toString().padStart(4, "0")}
                </span>
                <span className="text-sm opacity-60">PTS</span>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Cardholder
                </p>
                <p className="text-lg font-bold uppercase">
                  {userData.name}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest opacity-60">
                  Valid Thru
                </p>
                <p className="font-mono tracking-wider">12 / 26</p>
              </div>
            </div>
          </div>

          {/* Light sweep */}
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent
            translate-x-[-120%] hover:translate-x-[120%] transition-transform duration-500" />
        </motion.div>

        {/* RIGHT: Stats + Perks */}
        <div className="flex flex-col gap-6">
          {/* Progress */}
          <div className="rounded-3xl border border-border bg-background p-6">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
              <span>Next Tier Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="h-2 rounded-full bg-background-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full bg-foreground rounded-full" 
              />
            </div>
            <p className="mt-3 text-xs text-foreground-muted">
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
          <button className="mt-2 flex items-center justify-between rounded-full px-6 py-4
            bg-foreground text-background font-bold uppercase tracking-widest text-xs
            hover:opacity-90 transition">
            View All Benefits
            <ArrowUpRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4
      hover:bg-background-muted transition-colors">
      <div className="mb-3 text-foreground">{icon}</div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground-muted">
        {title}
      </p>
    </div>
  );
}
