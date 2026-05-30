'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  HistoryIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TicketPercentIcon,
} from '@ff/ui';

import { cn } from '@/lib/utils';

import { useWallet } from '../hooks/use-wallet';
import { SubWalletCard } from './sub-wallet-card';

export function WalletPage() {
  const { filter, setFilter, totals, sortedLedger } = useWallet();

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      <section className="relative overflow-hidden rounded-b-[4rem] px-4 pt-6 pb-20 md:rounded-b-[6rem] md:px-8 md:pt-32">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105" />

        <main className="relative z-10 mx-auto max-w-5xl space-y-12">
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
                      ₹{totals.total.toLocaleString()}
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
        </main>
      </section>

      <section className="mx-auto max-w-5xl space-y-20 px-4 md:px-8">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <SubWalletCard
            label="Refund Wallet"
            value={`₹${totals.refundBalance}`}
            icon={<RefreshCcwIcon size={20} />}
            description="Verified returns. Fully usable for your next order."
            action="Details"
            color="emerald-400"
          />
          <SubWalletCard
            label="Reward Wallet"
            value={`₹${totals.rewardWallet}`}
            icon={<TicketPercentIcon size={20} />}
            description="Referrals & Giftcards. Auto-applies 5% on orders."
            action="Details"
            color="red-400"
          />
        </div>

        <div className="space-y-6 pb-20">
          <div className="border-border bg-background-muted/20 flex flex-col items-center justify-between gap-4 rounded-4xl border p-3 md:flex-row">
            <div className="flex items-center gap-3 px-4">
              <HistoryIcon size={16} className="opacity-30" />
              <h3 className="text-foreground-subtle text-[10px] font-black tracking-[0.3em] uppercase">
                Activity History
              </h3>
            </div>
            <div className="bg-foreground/10 flex w-full items-center rounded-2xl p-1 md:w-auto">
              {(['all', 'refund', 'reward', 'purchase'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFilter(t);
                  }}
                  className={cn(
                    'flex-1 rounded-xl py-2.5 text-[9px] font-black tracking-widest uppercase transition-all md:flex-none',
                    filter === t
                      ? 'bg-background text-foreground shadow-lg'
                      : 'opacity-30 hover:opacity-100',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-background border-border divide-border/30 divide-y overflow-hidden rounded-[3rem] border shadow-sm">
            <AnimatePresence mode="popLayout">
              {sortedLedger.map((tx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={tx.id}
                  className="hover:bg-foreground/5 group flex cursor-pointer items-center justify-between p-4 transition-all md:px-12"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl transition-transform group-hover:scale-110',
                        tx.amount > 0
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-400/10 text-red-400',
                      )}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownLeftIcon size={22} />
                      ) : (
                        <ArrowUpRightIcon size={22} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-black tracking-tight uppercase italic">
                        {tx.description}
                      </h4>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="text-[9px] font-bold tracking-widest uppercase opacity-30">
                          {tx.date}
                        </span>
                        <span className="bg-foreground/5 rounded-md px-2 py-0.5 text-[7px] font-black tracking-widest uppercase opacity-50">
                          Ref: {tx.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        'text-lg font-black tracking-tighter whitespace-nowrap italic',
                        tx.amount > 0 ? 'text-emerald-500' : 'text-red-400',
                      )}
                    >
                      ₹{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="mt-1 text-[8px] font-black tracking-widest uppercase italic opacity-20">
                      {tx.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
