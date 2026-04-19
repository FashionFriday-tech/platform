import React from 'react';

import { ShieldCheckIcon } from '@ff/ui';
import { motion } from 'framer-motion';

interface WalletHeroProps {
  totalBalance: number;
}

export function WalletHero({ totalBalance }: WalletHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-b-[4rem] px-4 pt-6 pb-20 md:rounded-b-[6rem] md:px-8 md:pt-32">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.015 }}
            className="relative aspect-5/4 h-full overflow-hidden rounded-4xl shadow-2xl"
          >
            <video
              className="absolute inset-0 h-full w-full scale-105 object-cover brightness-75 contrast-110 hue-rotate-200 saturate-10"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videos/wallet/coin.mp4" type="video/mp4" />
            </video>

            <div className="relative z-10 flex h-full flex-col justify-between p-6">
              <div className="flex h-full items-start justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-extrabold tracking-[0.35em] text-white/60 uppercase">
                    Total Balance
                  </p>
                  <h2 className="text-4xl font-bold tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(16,185,129,0.45)] md:text-4xl">
                    ₹{totalBalance.toLocaleString()}
                  </h2>
                </div>

                <div className="relative">
                  <div className="bg-foreground/40 absolute inset-0 animate-pulse rounded-xl blur-lg" />
                  <div className="bg-background/40 relative rounded-xl border border-white/20 p-3 text-white">
                    <ShieldCheckIcon size={22} />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Bank-grade security</span>
                <span className="font-semibold text-white">Updated live</span>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="border-foreground flex animate-pulse items-center justify-center rounded-full border p-1">
                  <span className="bg-foreground h-2 w-2 rounded-full shadow-[0_0_12px_#4ade80]" />
                </div>
                <p className="text-foreground/60 text-[10px] font-black tracking-widest uppercase">
                  Spending Power
                </p>
              </div>
              <p className="text-foreground/80 max-w-md text-sm leading-relaxed font-bold italic md:text-base">
                Your <span className="text-foreground font-black">Refund Wallet</span> is 100%
                usable. Reward Wallet usage is capped at{' '}
                <span className="decoration-foreground underline underline-offset-4">
                  5% of total order value
                </span>{' '}
                per purchase.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
                <p className="text-foreground/30 mb-1 text-[8px] font-black tracking-widest uppercase">
                  Status
                </p>
                <p className="text-foreground text-xs font-black tracking-tight uppercase italic">
                  Elite Member
                </p>
              </div>
              <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all hover:bg-white/10">
                <p className="text-foreground/30 mb-1 text-[8px] font-black tracking-widest uppercase">
                  Last Sync
                </p>
                <p className="text-foreground text-xs font-black tracking-tight uppercase italic">
                  Live
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
