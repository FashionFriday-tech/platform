'use client';

import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  HistoryIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TicketPercentIcon,
} from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';

// --- Types ---
type TransactionType = 'reward' | 'refund' | 'purchase' | 'topup';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  timestamp: number;
}

export default function WalletPage() {
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const totals = useMemo(
    () => ({
      total: 3199,
      rewardWallet: 700,
      refundBalance: 2499,
    }),
    [],
  );

  // FIX: Memoizing transactions so it can be a stable dependency for sortedLedger
  const transactions: Transaction[] = useMemo(
    () => [
      {
        id: 'TX101',
        type: 'reward',
        amount: 100,
        date: '26 Jan 2026',
        status: 'completed',
        description: 'Referral Reward: Rahul S.',
        timestamp: 1737885600000,
      },
      {
        id: 'TX102',
        type: 'refund',
        amount: 2499,
        date: '24 Jan 2026',
        status: 'completed',
        description: 'Refund: Order #FF9021',
        timestamp: 1737712800000,
      },
      {
        id: 'TX103',
        type: 'reward',
        amount: 500,
        date: '23 Jan 2026',
        status: 'completed',
        description: 'Gift Card: BDAY500',
        timestamp: 1737626400000,
      },
      {
        id: 'TX104',
        type: 'purchase',
        amount: -1200,
        date: '22 Jan 2026',
        status: 'completed',
        description: 'Payment for Shoes',
        timestamp: 1737540000000,
      },
    ],
    [],
  );

  const sortedLedger = useMemo(() => {
    return transactions
      .filter((t) => filter === 'all' || t.type === filter)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [filter, transactions]); // Fixed missing dependency

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
                // FIX: Canonical hue-rotate-180 or hue-rotate-200 (using 200 to match intent)
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
                  onClick={() => setFilter(t)}
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

// --- Sub Wallet Components ---

interface SubWalletCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  action: string;
  color?: string;
}

function SubWalletCard({ label, value, icon, description, action }: SubWalletCardProps) {
  const [openWallet, setOpenWallet] = useState(false);

  return (
    <div
      onClick={() => setOpenWallet(!openWallet)}
      className="bg-background border-border hover:border-foreground/20 group relative flex h-72 cursor-pointer flex-col justify-between rounded-[3.5rem] border p-8 shadow-sm"
    >
      <div
        className={cn(
          'border-border bg-foreground absolute left-0 z-20 w-full rounded-4xl border-t py-20 transition-all duration-300',
          openWallet ? '-top-6' : 'top-6',
        )}
      >
        <h3 className="text-background absolute top-5 right-5 mb-2 text-3xl font-semibold tracking-tighter italic">
          {value}
        </h3>
        <Image
          src="/images/wallet/chip.png"
          alt="Card chip"
          width={48}
          height={48}
          className="absolute top-6 left-6 h-auto w-12"
        />
      </div>
      <div className="border-border bg-background absolute top-14 right-2 left-2 z-40 w-auto rounded-4xl border-t-2 border-dashed py-20" />
      <div className="border-border bg-background absolute top-12 left-0 z-30 w-full rounded-4xl border-t py-20" />

      <div className="z-50 pt-12">
        <div className="text-foreground flex items-center justify-between">
          <div className="bg-foreground/5 text-foreground group-hover:bg-foreground group-hover:text-background rounded-[1.25rem] p-4 transition-all duration-700">
            {icon}
          </div>
          <p className="text-sm font-black tracking-widest uppercase">{label}</p>
          <div className="p-4">
            <ChevronRightIcon
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>

      <div className="border-border flex items-center justify-between border-t pt-6">
        <p className="max-w-40 text-[10px] leading-tight font-bold uppercase italic opacity-30">
          {description}
        </p>
        <button className="text-foreground text-[10px] font-black tracking-widest uppercase underline underline-offset-8 transition-colors">
          {action}
        </button>
      </div>
    </div>
  );
}
