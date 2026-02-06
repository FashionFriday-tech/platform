"use client";
import React, { useState } from "react";
import {
  ShieldCheckIcon,
  CpuIcon,
  LayersIcon,
  ZapIcon,
  InfoIcon,
  ActivityIcon,
  WatchIcon,
  FootprintsIcon,
  ShirtIcon,
  ArrowDownIconIOS,
} from "@ff/ui";
import { ProductQuality } from "@/data/quality";

export default function QualityProtocolPage() {
  const [activeCat, setActiveCat] = useState<keyof typeof ProductQuality>(
    "footwear"
  );

  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans">
      {/* 1. NEURAL HEADER */}
      <header className="h-screen flex flex-col justify-center items-center pb-20 px-6 max-w-7xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-10 px-5 py-2 rounded-full bg-brand/10 border border-brand/20">
          <ActivityIcon size={12} className="text-brand" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand">
            Quality Classification System
          </span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-[9vw] font-black uppercase tracking-tighter leading-[0.72] mb-8">
          Product <br />
          <span className="text-foreground/20 italic">Quality Guide</span>
        </h1>

        {/* Subtext */}
        <p className="max-w-2xl text-[11px] md:text-xs font-bold uppercase leading-relaxed tracking-widest opacity-50">
          Understand the real difference between{" "}
          <span className="text-foreground">OG</span>,{" "}
          <span className="text-foreground">Surplus</span>,
          <span className="text-foreground">7A</span> and other grades. <br />
          No marketing lies. Just manufacturing truth.
        </p>
        <div className="absolute bottom-30 md:bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDownIconIOS size={32} className="text-foreground-muted" />
        </div>
      </header>

      {/* 2. CATEGORY NAV */}
      <nav className="flex justify-center mb-24 px-6">
        <div className="bg-[#0f0f0f] p-1.5 rounded-full border border-white/5 flex gap-1 shadow-2xl overflow-x-auto">
          {Object.keys(ProductQuality).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat as any)}
              className={`px-12 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCat === cat
                  ? "bg-brand text-black shadow-[0_0_30px_rgba(var(--brand-rgb),0.3)]"
                  : "opacity-30 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2">
                {cat === "footwear" && <FootprintsIcon size={14} />}
                {cat === "watches" && <WatchIcon size={14} />}
                {cat === "Apparel" && <WatchIcon size={14} />}
                {cat}
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* 3. PROTOCOL LIST */}
      <main className="max-w-6xl mx-auto px-6 space-y-6">
        {ProductQuality[activeCat].map((item, i) => (
          <div
            key={item.id}
            className={`group relative bg-[#0a0a0a] border rounded-[2.8rem] p-8 md:p-12 transition-all duration-700 flex flex-col md:flex-row gap-10 items-center overflow-hidden ${
              item.id === "og"
                ? "border-brand/40 bg-gradient-to-br from-brand/5 to-transparent"
                : "border-white/5 hover:border-brand/30"
            }`}
          >
            {/* Accuracy Circle Meter */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="relative h-28 w-28 flex items-center justify-center">
                <svg className="absolute inset-0 h-full w-full rotate-[-90deg]">
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
                    strokeDashoffset={
                      314 - (314 * parseInt(item.accuracy)) / 100
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-lg font-black italic">
                  {item.accuracy}
                </span>
              </div>
              <p className="text-[7px] font-black uppercase tracking-widest mt-4 opacity-30">
                Accuracy
              </p>
            </div>

            {/* Center: Detail */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-brand text-[9px] font-black uppercase tracking-[0.4em]">
                  {item.tier}
                </span>
                <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  {item.name}
                </h3>
              </div>
              <p className="text-[12px] font-medium opacity-50 max-w-lg leading-relaxed italic uppercase">
                {item.detail}
              </p>
            </div>

            {/* Right: Technical Tags */}
            <div className="grid grid-cols-1 gap-2 shrink-0 w-full md:w-56">
              {item.tech.map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(var(--brand-rgb),0.8)]" />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* 4. THE SURPLUS EXPLAINER */}
      <section className="max-w-6xl mx-auto px-6 mt-24">
        <div className="bg-foreground text-background rounded-[3.5rem] p-8 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <ShieldCheckIcon size={350} />
          </div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
              Factory <br /> Exit <br /> Status.
            </h2>
            <div className="space-y-6 flex flex-col justify-center">
              <p className="text-xl font-bold uppercase italic leading-tight">
                Surplus units are NOT reconstructions. They are genuine products
                that exited the production cycle due to over-stocking, seasonal
                expiration, or minor aesthetic QC failures.
              </p>
              <div className="flex gap-4">
                <div className="px-5 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Liquidated Stock
                </div>
                <div className="px-5 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full">
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
