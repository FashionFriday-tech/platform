import React from 'react';

import { CheckIcon, CopyIcon, GiftIcon, ShareIcon } from '@ff/ui';

interface ReferralHeroProps {
  referralCode: string;
  copied: boolean;
  handleCopy: (text: string) => void;
  onShareClick: () => void;
}

export function ReferralHero({
  referralCode,
  copied,
  handleCopy,
  onShareClick,
}: ReferralHeroProps) {
  return (
    <section
      className="relative space-y-6 overflow-hidden rounded-xl rounded-tr-[4rem] rounded-bl-[4rem] p-6 shadow-xl md:p-8"
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
            <h2 className="text-xl font-black tracking-tight text-white uppercase italic md:text-2xl">
              Invite Friends. Earn ₹100.
            </h2>
            <p className="mt-2 max-w-xl text-xs text-white/70 md:text-sm">
              Share your link. When they order, ₹100 lands in your wallet.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-white/10 bg-black/50 p-3 lg:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl bg-black/70 px-4 py-3">
            <span className="truncate text-[11px] font-black tracking-widest text-white uppercase italic">
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
            onClick={onShareClick}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-[11px] font-black tracking-widest text-black uppercase shadow-xl transition-all active:scale-95"
          >
            <ShareIcon size={16} /> Share Invite
          </button>
        </div>
      </div>
    </section>
  );
}
