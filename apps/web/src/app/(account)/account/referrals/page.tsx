'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { CheckIcon, ClockIcon, CopyIcon, GiftIcon, ShareIcon, UsersIcon, WalletIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<'all' | 'active' | 'Inactive'>('all');

  const referralCode = 'FRIDAY-CAPTAIN-11';
  const referralLink = `https://fashionfriday.in/invite/${referralCode}`;

  const metrics = [
    {
      label: 'Activated',
      value: '₹1,200',
      icon: <WalletIcon size={16} />,
      color: 'text-emerald-500',
    },
    { label: 'Inactive', value: '₹300', icon: <ClockIcon size={16} />, color: 'text-orange-500' },
    {
      label: 'Network',
      value: '15 Users',
      icon: <UsersIcon size={16} />,
      color: 'text-foreground',
    },
  ];

  // Memoizing rawUsers to satisfy the dependency array of sortedUsers
  const rawUsers = useMemo(
    () => [
      { id: 1, name: 'Rahul S.', date: '22/01/26', status: 'Inactive', timestamp: 1737504000000 },
      { id: 2, name: 'Sana K.', date: '24/01/26', status: 'Active', timestamp: 1737676800000 },
      { id: 3, name: 'Kevin V.', date: '15/01/26', status: 'Active', timestamp: 1736899200000 },
      { id: 4, name: 'Aditi R.', date: '25/01/26', status: 'Inactive', timestamp: 1737763200000 },
      { id: 5, name: 'Mohammed A.', date: '18/01/26', status: 'Active', timestamp: 1737158400000 },
      { id: 6, name: 'Priya M.', date: '10/01/26', status: 'Inactive', timestamp: 1736467200000 },
      { id: 7, name: 'Daniel T.', date: '05/01/26', status: 'Inactive', timestamp: 1736035200000 },
      { id: 8, name: 'Neha P.', date: '20/01/26', status: 'Active', timestamp: 1737331200000 },
      { id: 9, name: 'Arjun D.', date: '12/01/26', status: 'Inactive', timestamp: 1736640000000 },
      { id: 10, name: 'Fatima Z.', date: '08/01/26', status: 'Inactive', timestamp: 1736294400000 },
      { id: 11, name: 'Chris L.', date: '21/01/26', status: 'Active', timestamp: 1737417600000 },
      { id: 12, name: 'Ishaan K.', date: '23/01/26', status: 'Inactive', timestamp: 1737590400000 },
      { id: 13, name: 'Meera N.', date: '14/01/26', status: 'Active', timestamp: 1736812800000 },
      { id: 14, name: 'John P.', date: '03/01/26', status: 'Inactive', timestamp: 1735948800000 },
      { id: 15, name: 'Zoya H.', date: '26/01/26', status: 'Active', timestamp: 1737849600000 },
    ],
    [],
  );

  const sortedUsers = useMemo(() => {
    let filteredList = [...rawUsers];
    if (sortCriteria === 'active') {
      filteredList = filteredList.filter((u) => u.status === 'Active');
    } else if (sortCriteria === 'Inactive') {
      filteredList = filteredList.filter((u) => u.status === 'Inactive');
    }
    return filteredList.sort((a, b) => b.timestamp - a.timestamp);
  }, [sortCriteria, rawUsers]); // rawUsers is now a stable dependency

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error('Copy failed', error);
    });
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  // FIX: Separate async logic from the event handler to fix @typescript-eslint/no-misused-promises
  const onShareClick = () => {
    const handleShare = async () => {
      const shareData: ShareData = {
        title: 'Fashion Friday - Style That Moves',
        text: 'Hey! Check out Fashion Friday. Use my referral link to get ₹100 reward!',
        url: referralLink,
      };

      if (navigator.canShare && navigator.canShare({ files: [] })) {
        try {
          const response = await fetch('/images/refferal/hero.png');
          const blob = await response.blob();
          const file = new File([blob], 'invite.png', { type: blob.type });
          shareData.files = [file];
        } catch (error) {
          console.error('Image attachment failed', error);
        }
      }

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (error) {
          if ((error as Error).name !== 'AbortError') {
            console.error('Share failed', error);
          }
        }
      } else {
        handleCopy(referralLink);
      }
    };

    void handleShare();
  };

  return (
    <div className="bg-background text-foreground min-h-screen px-4 py-10 transition-colors duration-500 md:px-8">
      <main className="mx-auto max-w-4xl space-y-4 md:pt-20">
        <section
          className="relative space-y-6 overflow-hidden rounded-xl rounded-bl-[4rem] rounded-tr-[4rem] p-6 shadow-xl md:p-8"
          style={{
            backgroundImage: "url('/images/refferal/hero.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <GiftIcon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black uppercase italic tracking-tight text-white md:text-2xl">
                  Invite Friends. Earn ₹100.
                </h2>
                <p className="mt-2 max-w-xl text-xs text-white/70 md:text-sm">
                  Share your link. When they order, ₹100 lands in your wallet.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-black/50 p-3 lg:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/70 px-4 py-3">
                <span className="truncate text-[11px] font-black uppercase italic tracking-widest text-white">
                  {referralCode}
                </span>
                <button
                  onClick={() => {
                    handleCopy(referralCode);
                  }}
                  className="ml-auto flex items-center gap-1 text-white/60 transition hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={14} className="text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon size={14} />
                      <span className="text-[10px] font-bold uppercase">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={onShareClick} // Fixed handler
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-[11px] font-black uppercase tracking-widest text-black shadow-xl transition-all active:scale-95"
              >
                <ShareIcon size={16} /> Share Invite
              </button>
            </div>
          </div>
        </section>

        {/* METRICS */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="bg-background border-border flex items-center justify-between rounded-2xl border p-5 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="bg-foreground/5 rounded-xl p-2.5">{m.icon}</div>
                <div>
                  <p className="mb-0.5 text-[7px] font-black uppercase tracking-[0.2em] opacity-40">
                    {m.label}
                  </p>
                  <h3 className={`text-lg font-black italic tracking-tighter ${m.color}`}>
                    {m.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVITY GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 pt-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
              Activity
            </h3>
            <div className="bg-foreground/5 border-border flex items-center gap-1 rounded-xl border p-1">
              {(['all', 'active', 'Inactive'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSortCriteria(s);
                  }}
                  className={`rounded-lg px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${
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
                  // Changed rounded-[1.5rem] to rounded-3xl as suggested by Tailwind Intellisense
                  className="bg-background border-border flex h-32 flex-col justify-between rounded-3xl border p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_emerald]' : 'bg-orange-500'}`}
                    />
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-500' : 'text-orange-500'}`}
                    >
                      {user.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="truncate text-[11px] font-black uppercase italic tracking-tight">
                      {user.name}
                    </h4>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-20">
                        {user.date}
                      </span>
                      <span
                        className={`text-xs font-black italic ${user.status === 'Active' ? 'text-foreground' : 'opacity-10'}`}
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
      </main>
    </div>
  );
}
