import React from 'react';

import { ArrowDownLeftIcon, ArrowUpRightIcon, HistoryIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { type Transaction, type TransactionType } from '../types';

interface WalletActivityProps {
  sortedLedger: Transaction[];
  filter: 'all' | TransactionType;
  setFilter: (f: 'all' | TransactionType) => void;
}

export function WalletActivity({ sortedLedger, filter, setFilter }: WalletActivityProps) {
  const filterOptions: ('all' | TransactionType)[] = ['all', 'refund', 'reward', 'purchase'];

  return (
    <div className="space-y-6 pb-20">
      <div className="border-border bg-background-muted/20 flex flex-col items-center justify-between gap-4 rounded-4xl border p-3 md:flex-row">
        <div className="flex items-center gap-3 px-4">
          <HistoryIcon size={16} className="opacity-30" />
          <h3 className="text-foreground-subtle text-[10px] font-black tracking-[0.3em] uppercase">
            Activity History
          </h3>
        </div>
        <div className="bg-foreground/10 flex w-full items-center rounded-2xl p-1 md:w-auto">
          {filterOptions.map((t) => (
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
                  {tx.amount > 0 ? <ArrowDownLeftIcon size={22} /> : <ArrowUpRightIcon size={22} />}
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
  );
}
