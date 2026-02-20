'use client';
import { ArrowRightIcon, CameraIcon, HistoryIcon, InfoIcon, NavigationIcon } from '@ff/ui';
import React from 'react';

import { returnsData } from '@/data/returns';

// --- 1. DEFINE POLICY TYPES ---
interface ReturnSection {
  id: string | number;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  points: string[];
}

export default function ReturnsRefundsPage() {
  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] uppercase selection:text-black">
      {/* 1. HEADER & TRUST STATEMENT */}
      <header className="mx-auto max-w-7xl border-b border-white/5 px-6 pt-32 pb-20">
        <div className="bg-brand/10 border-brand/20 mb-8 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5">
          <NavigationIcon size={12} className="text-brand" />
          <span className="text-brand text-[10px] font-black tracking-[0.4em]">
            Support / Settlement Protocol
          </span>
        </div>
        <h1 className="mb-8 text-7xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-[9vw]">
          Returns & <br /> <span className="opacity-10">Refund.</span>
        </h1>
        <p className="max-w-2xl text-[11px] leading-relaxed font-bold tracking-widest lowercase italic opacity-40">
          We prioritize fairness. Our policy is designed to protect genuine fashion enthusiasts
          while maintaining operational sustainability.
        </p>
      </header>

      {/* 2. THE REFUND FLOW DIAGRAM */}
      <section className="mx-auto mt-12 mb-20 max-w-7xl px-6">
        <div className="rounded-[3.5rem] border border-white/5 bg-white/5 p-10 md:p-16">
          <h3 className="mb-12 text-center text-[10px] font-black tracking-[0.5em] uppercase opacity-30">
            Automated Wallet Credit Flow
          </h3>

          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                title: 'Initiation',
                desc: 'Request via Orders page with unboxing proof.',
              },
              {
                title: 'Validation',
                desc: '48-hour quality check at our central lab.',
              },
              {
                title: 'Settlement',
                desc: '100% value added to your Architect Wallet.',
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <span className="absolute -top-6 -left-4 text-4xl font-black italic opacity-10">
                  0{i + 1}
                </span>
                <h4 className="text-brand mb-2 text-sm font-black">{step.title}</h4>
                <p className="text-[10px] leading-relaxed font-bold italic opacity-40">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE POLICY BENTO GRID */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        {(returnsData as ReturnSection[]).map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="group hover:border-brand/20 rounded-[3rem] border border-white/5 bg-[#0a0a0a] p-10 transition-all duration-500"
            >
              <div className="flex h-full flex-col">
                <div className="text-brand group-hover:bg-brand mb-10 w-fit rounded-2xl bg-white/5 p-4 transition-all duration-500 group-hover:text-black">
                  <Icon size={24} />
                </div>
                <h3 className="mb-4 text-3xl font-black tracking-tighter uppercase italic">
                  {section.title}
                </h3>
                <p className="mb-10 max-w-xs text-xs leading-relaxed font-bold uppercase opacity-40">
                  {section.description}
                </p>
                <div className="mt-auto space-y-4">
                  {section.points.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <ArrowRightIcon size={14} className="text-brand mt-0.5 shrink-0" />
                      <span className="text-[10px] leading-relaxed font-black tracking-widest italic opacity-70">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* 4. THE UNBOXING MANDATE & COD SECURITY */}
      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        <div className="bg-brand rounded-[4rem] p-12 text-black lg:col-span-2">
          <div className="mb-6 flex items-center gap-4">
            <CameraIcon size={32} />
            <h3 className="text-4xl font-black tracking-tighter italic">The Unboxing Mandate</h3>
          </div>
          <p className="mb-8 text-[11px] leading-relaxed font-black uppercase">
            Strict Protocol: Claims for damage, missing items, or wrong products require a
            continuous, uncut 360° unboxing video. The video must start from the sealed package
            showing the label clearly. Without this, the system will automatically reject the claim.
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="rounded-lg bg-black px-4 py-2 text-[9px] font-black text-white">
              MANDATORY VIDEO
            </span>
            <span className="rounded-lg border border-black/20 bg-black/10 px-4 py-2 text-[9px] font-black tracking-widest">
              24H WINDOW
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-[4rem] border border-white/10 bg-[#111] p-12">
          <HistoryIcon size={32} className="text-brand opacity-50" />
          <div>
            <h4 className="mb-4 text-2xl font-black tracking-tighter uppercase italic">
              Anti-Abuse Control
            </h4>
            <p className="text-[10px] leading-relaxed font-bold uppercase italic opacity-40">
              Patterned returns or excessive RTOs will result in soft-blacklisting, restricting
              future orders to Prepaid-only status.
            </p>
          </div>
        </div>
      </section>

      {/* 5. COD SERVICE CHARGE DISCLOSURE */}
      <section className="mx-auto mt-6 max-w-7xl px-6">
        <div className="rounded-[4rem] border border-white/5 bg-white/5 p-12">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="shrink-0 rounded-full bg-white/5 p-8">
              <InfoIcon size={40} className="text-brand" />
            </div>
            <div>
              <h3 className="mb-4 text-3xl font-black tracking-tighter uppercase italic">
                COD Security Disclosure
              </h3>
              <p className="mb-4 max-w-3xl text-[11px] leading-relaxed font-bold uppercase opacity-50">
                The Cash-on-Delivery fee is an additional service charge mandated by our logistics
                partners for cash handling and high-risk insurance. This amount is paid in advance
                to filter legitimate intent and protect against fraudulent bookings.
              </p>
              <p className="text-brand text-[11px] font-black tracking-widest">
                THIS FEE IS NON-REFUNDABLE AND NON-ADJUSTABLE AGAINST THE PRODUCT VALUE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HELP & ESCALATION */}
      <footer className="mx-auto mt-24 max-w-7xl px-6 text-center">
        <div className="border-t border-white/5 py-20">
          <h5 className="mb-10 text-[10px] font-black tracking-[0.5em] uppercase opacity-40">
            Still Unresolved?
          </h5>
          <div className="flex flex-col justify-center gap-6 md:flex-row">
            <button className="hover:bg-brand rounded-2xl bg-white px-12 py-5 text-[10px] font-black tracking-widest text-black transition-colors">
              CHAT WITH DISPUTE TEAM
            </button>
            <button className="rounded-2xl border border-white/20 px-12 py-5 text-[10px] font-black tracking-widest transition-colors hover:bg-white/5">
              VIEW HELP CENTER
            </button>
          </div>
        </div>
        <p className="mt-10 text-[9px] font-black tracking-[0.4em] italic opacity-20">
          Architect Settlement Framework // Version 2.0.26
        </p>
      </footer>
    </div>
  );
}
