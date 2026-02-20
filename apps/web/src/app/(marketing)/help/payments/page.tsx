'use client';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  GlobeIcon,
  InfoIcon,
  LockIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@ff/ui';
import React from 'react';

import { paymentData } from '@/data/payments';

export default function PaymentsBillingPage() {
  return (
    <div className="selection:bg-brand min-h-screen bg-[#050505] pb-32 font-sans text-[#f0f0f0] uppercase selection:text-black">
      {/* 1. SYSTEM HEADER */}
      <header className="mx-auto max-w-7xl border-b border-white/5 px-6 pt-32 pb-20">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="bg-brand/10 border-brand/20 flex w-fit items-center gap-2 rounded-full border px-4 py-1.5">
            <LockIcon size={12} className="text-brand" />
            <span className="text-brand text-[10px] font-black tracking-[0.4em] uppercase">
              Encrypted Terminal v4.0
            </span>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <ShieldCheckIcon size={12} className="text-zinc-500" />
            <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">
              PCI-DSS Compliant
            </span>
          </div>
        </div>

        <h1 className="mb-8 text-7xl leading-[0.8] font-black tracking-tighter italic md:text-[9vw]">
          Payments <br /> & <span className="opacity-10">Billing.</span>
        </h1>
        <p className="max-w-2xl text-[11px] leading-relaxed font-bold tracking-widest lowercase italic opacity-40">
          Institutional-grade transaction security. We do not store your card data. All payments are
          processed through isolated, high-security gateways.
        </p>
      </header>

      {/* 2. TRANSACTION FLOW COMPONENT */}
      <section className="mx-auto mt-12 mb-20 max-w-7xl px-6">
        <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 md:p-16">
          <h3 className="mb-12 text-center text-[10px] font-black tracking-[0.5em] opacity-30">
            Standard Transaction Lifecycle
          </h3>

          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/5 pt-12 md:grid-cols-4">
            {[
              { label: 'Authorization', desc: 'Real-time check' },
              { label: 'Verification', desc: 'Fraud scan' },
              { label: 'Capture', desc: 'Funds secured' },
              { label: 'Settlement', desc: 'Order confirmed' },
            ].map((step, i) => (
              <div key={i}>
                <p className="text-brand mb-1 text-[10px] font-black tracking-widest">
                  {step.label}
                </p>
                <p className="text-xs leading-tight font-bold lowercase italic opacity-40">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POLICY BENTO GRID */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-2">
        {paymentData.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="group hover:border-brand/20 rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-10 transition-all duration-500"
            >
              <div className="flex h-full flex-col">
                <div className="text-brand group-hover:bg-brand mb-10 w-fit rounded-2xl bg-white/5 p-4 transition-all duration-500 group-hover:text-black">
                  <Icon size={24} />
                </div>
                <h3 className="mb-4 text-3xl font-black tracking-tighter italic">
                  {section.title}
                </h3>
                <p className="mb-10 max-w-xs text-xs leading-relaxed font-bold opacity-40">
                  {section.description}
                </p>
                <div className="mt-auto space-y-4">
                  {section.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <ArrowRightIcon size={12} className="text-brand shrink-0" />
                      <span className="text-[10px] font-black tracking-widest italic opacity-70">
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

      {/* 4. ANTI-FRAUD & COD SECURITY (CRITICAL BOUNDARIES) */}
      <section className="mx-auto mt-6 grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-3">
        {/* Anti-Fraud */}
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[#0f0f0f] p-12 lg:col-span-2">
          <GlobeIcon
            className="absolute -right-10 -bottom-10 rotate-12 opacity-[0.03]"
            size={300}
          />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <AlertTriangleIcon className="text-brand" size={32} />
              <h3 className="text-4xl font-black tracking-tighter italic">Fraud & Abuse Control</h3>
            </div>
            <p className="max-w-xl text-xs leading-relaxed font-bold opacity-50">
              Our system employs pattern-based rate limiting. Repeated failed transactions,
              high-frequency COD cancellations, or RTO abuse will trigger a permanent soft-block on
              your account. Suspicious transactions are held for manual review for up to 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-[9px] font-black tracking-widest">
                Rate Limited IPs
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-[9px] font-black tracking-widest">
                Pattern Recognition
              </div>
            </div>
          </div>
        </div>

        {/* COD Security Info */}
        <div className="bg-brand flex flex-col justify-between rounded-[3rem] p-12 text-black">
          <ZapIcon size={40} fill="currentColor" />
          <div>
            <h3 className="mb-4 text-3xl font-black tracking-tighter italic">Advance COD Fee</h3>
            <p className="mb-6 text-[11px] leading-relaxed font-black italic">
              The ₹200 fee is mandatory to filter high-intent customers. It is non-refundable as it
              covers the immediate operational cost of processing and insuring high-value cash
              shipments.
            </p>
            <div className="mb-6 h-px w-full bg-black/20" />
            <p className="text-[9px] font-bold opacity-60">
              Status: Mandatory for all COD entries.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LEGAL DISCLOSURE */}
      <section className="mx-auto mt-6 max-w-7xl px-6 text-center lg:text-left">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2.5rem] border border-white/5 bg-white/5 p-8 md:flex-row md:px-12 md:py-8">
          <div className="flex items-center gap-4">
            <InfoIcon size={20} className="text-zinc-600" />
            <p className="max-w-2xl text-[9px] font-bold tracking-widest uppercase opacity-40">
              Pricing is inclusive of all taxes unless stated otherwise. Billing disputes must be
              initiated within 7 days of the transaction date via the Architect Help Center.
            </p>
          </div>
          <button className="hover:text-brand flex items-center gap-2 text-[10px] font-black tracking-widest whitespace-nowrap transition-colors">
            View T&C <ExternalLinkIcon size={12} />
          </button>
        </div>
      </section>

      {/* 6. HELP & ESCALATION */}
      <footer className="mx-auto mt-32 flex max-w-7xl flex-col items-center border-t border-white/5 px-6 pt-20">
        <h2 className="mb-12 text-4xl font-black tracking-tighter italic">Billing Inquiries?</h2>
        <div className="flex w-full max-w-2xl flex-col gap-6 sm:flex-row">
          <button className="hover:bg-brand flex-1 rounded-2xl bg-white py-5 text-[10px] font-black tracking-[0.2em] text-black transition-colors">
            Contact Billing Support
          </button>
          <button className="flex-1 rounded-2xl border border-white/20 py-5 text-[10px] font-black tracking-[0.2em] transition-colors hover:bg-white/5">
            Track Recent Payment
          </button>
        </div>
        <p className="mt-24 text-[9px] font-black tracking-[0.4em] italic opacity-20">
          Architect Financial Systems // Settlement Lab 2026
        </p>
      </footer>
    </div>
  );
}
