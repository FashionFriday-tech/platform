import React from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { type ReferralUser, type SortCriteria } from '../types';

interface ReferralActivityProps {
  sortedUsers: ReferralUser[];
  sortCriteria: SortCriteria;
  setSortCriteria: (criteria: SortCriteria) => void;
}

export function ReferralActivity({
  sortedUsers,
  sortCriteria,
  setSortCriteria,
}: ReferralActivityProps) {
  const criteriaOptions: SortCriteria[] = ['all', 'active', 'Inactive'];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="text-[9px] font-black tracking-[0.3em] uppercase opacity-60">Activity</h3>
        <div className="bg-foreground/5 border-border flex items-center gap-1 rounded-xl border p-1">
          {criteriaOptions.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSortCriteria(s);
              }}
              className={`rounded-lg px-4 py-2 text-[8px] font-black tracking-widest uppercase transition-all ${
                sortCriteria === s ? 'bg-background text-foreground shadow-sm' : 'opacity-30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-20 md:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {sortedUsers.map((user) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={user.id}
              className="bg-background border-border flex h-32 flex-col justify-between rounded-3xl border p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    user.status === 'Active'
                      ? 'bg-emerald-500 shadow-[0_0_8px_emerald]'
                      : 'bg-orange-500'
                  }`}
                />
                <span
                  className={`text-[8px] font-black tracking-widest uppercase ${
                    user.status === 'Active' ? 'text-emerald-500' : 'text-orange-500'
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <div>
                <h4 className="truncate text-[11px] font-black tracking-tight uppercase italic">
                  {user.name}
                </h4>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[7px] font-bold tracking-widest uppercase opacity-20">
                    {user.date}
                  </span>
                  <span
                    className={`text-xs font-black italic ${
                      user.status === 'Active' ? 'text-foreground' : 'opacity-10'
                    }`}
                  >
                    ₹100
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
