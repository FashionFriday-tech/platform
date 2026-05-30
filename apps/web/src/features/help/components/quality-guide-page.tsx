'use client';

import React, { useState } from 'react';

import { ActivityIcon, ArrowDownIconIOS, FootprintsIcon, ShieldCheckIcon, WatchIcon } from '@ff/ui';

import { ProductQuality } from '@/features/help/data/quality';

// 1. Define the valid keys strictly based on your data
type QualityCategory = keyof typeof ProductQuality;

export function QualityGuidePage() {
  // 2. Initialize with the strict type
  const [activeCat, setActiveCat] = useState<QualityCategory>('footwear');

  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] selection:text-black">
      {/* 1. NEURAL HEADER */}
      <header className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center px-6 pb-20 text-center">
        <div className="bg-brand/10 border-brand/20 mb-10 flex items-center gap-2 rounded-full border px-5 py-2">
          <ActivityIcon size={12} className="text-brand" />
          <span className="text-brand text-[9px] font-black tracking-[0.4em] uppercase">
            Quality Classification System
          </span>
        </div>

        <h1 className="mb-8 text-6xl leading-[0.72] font-black tracking-tighter uppercase md:text-[9vw]">
          Product <br />
          <span className="text-foreground/20 italic">Quality Guide</span>
        </h1>

        <p className="max-w-2xl text-[11px] leading-relaxed font-bold tracking-widest uppercase opacity-50 md:text-xs">
          Understand the real difference between <span className="text-foreground">OG</span>,{' '}
          <span className="text-foreground">Surplus</span>,
          <span className="text-foreground">7A</span> and other grades. <br />
          No marketing lies. Just manufacturing truth.
        </p>
        <div className="absolute bottom-30 left-1/2 -translate-x-1/2 transform animate-bounce md:bottom-20">
          <ArrowDownIconIOS size={32} className="text-foreground-muted" />
        </div>
      </header>

      {/* 2. CATEGORY NAV */}
      <nav className="mb-24 flex justify-center px-6">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-white/5 bg-[#0f0f0f] p-1.5 shadow-2xl">
          {(Object.keys(ProductQuality) as QualityCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCat(cat);
              }}
              className={`rounded-full px-12 py-4 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${
                activeCat === cat
                  ? 'bg-brand text-black shadow-[0_0_30_rgba(var(--brand-rgb),0.3)]'
                  : 'opacity-30 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2">
                {cat === 'footwear' && <FootprintsIcon size={14} />}
                {cat === 'watches' && <WatchIcon size={14} />}
                {cat.toLowerCase() === 'apparel' && <WatchIcon size={14} />}
                {cat}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* 3. PROTOCOL LIST */}
      <main className="mx-auto max-w-6xl space-y-6 px-6">
        {(Object.prototype.hasOwnProperty.call(ProductQuality, activeCat)
          ? ProductQuality[activeCat]
          : []
        ).map((item) => (
          <div
            key={item.id}
            className={`group relative flex flex-col items-center gap-10 overflow-hidden rounded-[2.8rem] border bg-[#0a0a0a] p-8 transition-all duration-700 md:flex-row md:p-12 ${
              item.id === 'og'
                ? 'border-brand/40 from-brand/5 bg-linear-to-br to-transparent'
                : 'hover:border-brand/30 border-white/5'
            }`}
          >
            <div className="flex shrink-0 flex-col items-center justify-center">
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="absolute inset-0 h-full w-full -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="transparent"
                    className="text-brand"
                    strokeDasharray="314"
                    strokeDashoffset={314 - (314 * parseInt(item.accuracy)) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-lg font-black italic">{item.accuracy}</span>
              </div>
              <p className="mt-4 text-[7px] font-black tracking-widest uppercase opacity-30">
                Accuracy
              </p>
            </div>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-brand text-[9px] font-black tracking-[0.4em] uppercase">
                  {item.tier}
                </span>
                <h3 className="text-4xl leading-none font-black tracking-tighter uppercase italic md:text-5xl">
                  {item.name}
                </h3>
              </div>
              <p className="max-w-lg text-[12px] leading-relaxed font-medium uppercase italic opacity-50">
                {item.detail}
              </p>
            </div>

            <div className="grid w-full shrink-0 grid-cols-1 gap-2 md:w-56">
              {item.tech.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-2.5"
                >
                  <div className="bg-brand h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(var(--brand-rgb),0.8)]" />
                  <span className="text-[9px] font-black tracking-widest uppercase opacity-60">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* 4. THE SURPLUS EXPLAINER */}
      <section className="mx-auto mt-24 max-w-6xl px-6">
        <div className="bg-foreground text-background relative overflow-hidden rounded-[3.5rem] p-8 md:p-20">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <ShieldCheckIcon size={350} />
          </div>
          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <h2 className="text-6xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-8xl">
              Factory <br /> Exit <br /> Status.
            </h2>
            <div className="flex flex-col justify-center space-y-6">
              <p className="text-xl leading-tight font-bold uppercase italic">
                Surplus units are NOT reconstructions. They are genuine products that exited the
                production cycle due to over-stocking, seasonal expiration, or minor aesthetic QC
                failures.
              </p>
              <div className="flex gap-4">
                <div className="rounded-full bg-black px-5 py-2 text-[10px] font-black tracking-widest text-white uppercase">
                  Liquidated Stock
                </div>
                <div className="rounded-full bg-black px-5 py-2 text-[10px] font-black tracking-widest text-white uppercase">
                  Authentic DNA
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
