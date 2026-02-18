'use client';
import React from 'react';
import { shippingData } from '@/data/shipping';
import { NavigationIcon, LifeBuoyIcon, AlertTriangleIcon, CameraIcon } from '@ff/ui';
import Link from 'next/link';

export default function ShippingDeliveryPage() {
  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] selection:text-black">
      {/* 1. MINIMALIST HEADER */}
      <header className="mx-auto max-w-7xl border-b border-white/5 px-6 pt-32 pb-20">
        <div className="bg-brand/10 border-brand/20 mb-8 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5">
          <NavigationIcon size={12} className="text-brand" />
          <span className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">
            Support / Logistics Protocol
          </span>
        </div>
        <h1 className="mb-8 text-7xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-[9vw]">
          Shipping & <br /> <span className="opacity-10">Delivery.</span>
        </h1>
        <p className="max-w-2xl text-[11px] leading-relaxed font-bold tracking-widest uppercase italic opacity-40">
          Transparent transit. No promises, only ranges. We provide the gear; our logistics partners
          provide the speed.
        </p>
      </header>

      {/* 2. THE TRANSIT JOURNEY MAP */}
      <div className="mx-auto mt-12 mb-20 max-w-7xl px-6">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10">
          <h3 className="mb-12 text-center text-[10px] font-black tracking-[0.5em] uppercase opacity-30">
            Standard Transit Lifecycle
          </h3>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Dispatch', time: '24-48 Hours' },
              { label: 'Metro', time: '2-4 Days' },
              { label: 'Non-Metro', time: '5-7 Days' },
              { label: 'Remote', time: '7-10 Days' },
            ].map((step, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-brand mb-1 text-[10px] font-black tracking-widest uppercase">
                  {step.label}
                </p>
                <p className="text-xl font-bold tracking-tighter italic opacity-80">{step.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CORE POLICY BENTO GRID */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        {shippingData.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group hover:border-brand/20 rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-10 transition-all duration-500"
            >
              <div className="flex h-full flex-col">
                <div className="text-brand group-hover:bg-brand mb-10 w-fit rounded-2xl bg-white/5 p-4 transition-all duration-500 group-hover:text-black">
                  <Icon size={24} />
                </div>
                <h3 className="mb-4 text-3xl font-black tracking-tighter uppercase italic">
                  {item.title}
                </h3>
                <p className="mb-10 max-w-xs text-xs leading-relaxed font-bold uppercase opacity-40">
                  {item.description}
                </p>
                <div className="mt-auto space-y-4">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="bg-brand h-1 w-1 shrink-0 rounded-full" />
                      <span className="text-[10px] font-black tracking-widest uppercase opacity-70">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* FAILED DELIVERY & PROTECTION (CRITICAL RESOLUTION FLOW) */}
      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-2">
        {/* RTO Card */}
        <div className="rounded-[3rem] border border-white/10 bg-[#0f0f0f] p-12">
          <div className="mb-8 flex items-center gap-4">
            <AlertTriangleIcon className="text-brand" size={28} />
            <h3 className="text-3xl font-black tracking-tighter italic">Failed Delivery (RTO)</h3>
          </div>
          <div className="space-y-6 text-xs leading-relaxed font-bold tracking-wide opacity-50">
            <p>1. COURIER ATTEMPTS: OUR PARTNERS WILL ATTEMPT DELIVERY A MAXIMUM OF 3 TIMES.</p>
            <p>
              2. NON-DELIVERY: IF THE CUSTOMER IS UNAVAILABLE OR THE ADDRESS IS INCORRECT, THE
              PACKAGE IS RETURNED TO ORIGIN (RTO).
            </p>
            <p>
              3. RE-SHIPPING: RESHIPPING AN RTO PACKAGE REQUIRES A SECOND SHIPPING FEE (₹150-₹200)
              PAYABLE IN ADVANCE.
            </p>
          </div>
        </div>

        {/* Protection Card */}
        <div className="bg-brand flex flex-col justify-between rounded-[3rem] p-12 text-black">
          <div className="mb-8 flex items-center gap-4">
            <CameraIcon size={28} />
            <h3 className="text-3xl font-black tracking-tighter italic">Damaged Packages</h3>
          </div>
          <p className="mb-8 text-[11px] leading-relaxed font-black italic">
            MANDATORY: YOU MUST RECORD A CONTINUOUS, UNCUT 360° UNBOXING VIDEO STARTING FROM THE
            SEALED PACKAGE. WITHOUT THIS VIDEO, NO CLAIM FOR DAMAGE OR MISSING ITEMS WILL BE
            PROCESSED. REPORT WITHIN 24H.
          </p>
          <div className="flex gap-4">
            <div className="rounded-xl bg-black px-6 py-3 text-[9px] font-black tracking-[0.2em] text-white">
              VIDEO REQUIRED
            </div>
            <div className="rounded-xl border border-black/20 bg-black/10 px-6 py-3 text-[9px] font-black tracking-[0.2em]">
              24H WINDOW
            </div>
          </div>
        </div>
      </section>

      {/* ESCALATION HELP */}
      <section className="mx-auto mt-20 max-w-7xl px-6">
        <div className="flex flex-col items-center rounded-[4rem] border border-white/5 p-12 text-center md:p-20">
          <LifeBuoyIcon size={48} className="text-brand mb-8 opacity-50" />
          <h2 className="mb-6 text-5xl font-black tracking-tighter italic">Need Escalation?</h2>
          <p className="mb-12 max-w-xl text-[10px] font-bold tracking-[0.2em] opacity-40">
            ONLY CONTACT SUPPORT IF YOUR TRACKING HAS NOT UPDATED FOR 4+ DAYS OR THE ESTIMATED
            DELIVERY WINDOW HAS EXPIRED.
          </p>
          <div className="flex w-full max-w-md flex-col gap-6 sm:flex-row">
            <button className="hover:bg-brand flex-1 rounded-2xl bg-white py-5 text-[10px] font-black tracking-widest text-black transition-colors">
              CHAT WITH LOGISTICS
            </button>
            <button className="flex-1 rounded-2xl border border-white/20 py-5 text-[10px] font-black tracking-widest transition-colors hover:bg-white/5">
              VIEW ORDER STATUS
            </button>
          </div>
        </div>
      </section>

      {/* NAV FOOTER */}
      <nav className="mx-auto mt-32 flex max-w-7xl flex-col items-center justify-between gap-8 border-t border-white/5 px-6 pt-20 md:flex-row">
        <div className="flex gap-10">
          <Link
            href="/help/returns"
            className="hover:text-brand text-[10px] font-black opacity-30 transition-all hover:opacity-100"
          >
            Returns Policy
          </Link>
          <Link
            href="/help/faq"
            className="hover:text-brand text-[10px] font-black opacity-30 transition-all hover:opacity-100"
          >
            Common FAQ
          </Link>
          <Link
            href="/terms"
            className="hover:text-brand text-[10px] font-black opacity-30 transition-all hover:opacity-100"
          >
            Full Terms
          </Link>
        </div>
        <p className="text-[9px] font-black tracking-[0.4em] opacity-20">
          ARCHITECT SYSTEMS // 2026 LOGISTICS
        </p>
      </nav>
    </div>
  );
}
