"use client";
import React from "react";
import { paymentData } from "@/data/payments";
import {
  ShieldCheckIcon,
  LockIcon,
  ArrowRightIcon,
  InfoIcon,
  AlertTriangleIcon,
  GlobeIcon,
  ZapIcon,
  ExternalLinkIcon,
} from "@ff/ui";

export default function PaymentsBillingPage() {
  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans uppercase">
      {/* 1. SYSTEM HEADER */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit">
            <LockIcon size={12} className="text-brand" />
            <span className="text-[10px] font-black tracking-[0.4em] text-brand uppercase">
              Encrypted Terminal v4.0
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
            <ShieldCheckIcon size={12} className="text-zinc-500" />
            <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">
              PCI-DSS Compliant
            </span>
          </div>
        </div>

        <h1 className="text-7xl md:text-[9vw] font-black italic tracking-tighter leading-[0.8] mb-8">
          Payments <br /> & <span className="opacity-10">Billing.</span>
        </h1>
        <p className="max-w-2xl text-[11px] font-bold leading-relaxed opacity-40 tracking-widest italic lowercase">
          Institutional-grade transaction security. We do not store your card
          data. All payments are processed through isolated, high-security
          gateways.
        </p>
      </header>

      {/* 2. TRANSACTION FLOW COMPONENT */}
      <section className="max-w-7xl mx-auto px-6 mt-12 mb-20">
        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 md:p-16">
          <h3 className="text-[10px] font-black tracking-[0.5em] opacity-30 mb-12 text-center">
            Standard Transaction Lifecycle
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-12 border-t border-white/5">
            {[
              { label: "Authorization", desc: "Real-time check" },
              { label: "Verification", desc: "Fraud scan" },
              { label: "Capture", desc: "Funds secured" },
              { label: "Settlement", desc: "Order confirmed" },
            ].map((step, i) => (
              <div key={i}>
                <p className="text-[10px] font-black text-brand mb-1 tracking-widest">
                  {step.label}
                </p>
                <p className="text-xs font-bold opacity-40 italic lowercase leading-tight">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POLICY BENTO GRID */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {paymentData.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="group bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 hover:border-brand/20 transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <div className="mb-10 p-4 bg-white/5 w-fit rounded-2xl text-brand group-hover:bg-brand group-hover:text-black transition-all duration-500">
                  <Icon size={24} />
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter mb-4">
                  {section.title}
                </h3>
                <p className="text-xs opacity-40 font-bold leading-relaxed mb-10 max-w-xs">
                  {section.description}
                </p>
                <div className="space-y-4 mt-auto">
                  {section.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <ArrowRightIcon size={12} className="text-brand shrink-0" />
                      <span className="text-[10px] font-black tracking-widest opacity-70 italic">
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
      <section className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anti-Fraud */}
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
          <GlobeIcon
            className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12"
            size={300}
          />
          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <AlertTriangleIcon className="text-brand" size={32} />
              <h3 className="text-4xl font-black italic tracking-tighter">
                Fraud & Abuse Control
              </h3>
            </div>
            <p className="text-xs opacity-50 font-bold leading-relaxed max-w-xl">
              Our system employs pattern-based rate limiting. Repeated failed
              transactions, high-frequency COD cancellations, or RTO abuse will
              trigger a permanent soft-block on your account. Suspicious
              transactions are held for manual review for up to 24 hours.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-widest">
                Rate Limited IPs
              </div>
              <div className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-widest">
                Pattern Recognition
              </div>
            </div>
          </div>
        </div>

        {/* COD Security Info */}
        <div className="bg-brand rounded-[3rem] p-12 text-black flex flex-col justify-between">
          <ZapIcon size={40} fill="currentColor" />
          <div>
            <h3 className="text-3xl font-black italic tracking-tighter mb-4">
              Advance COD Fee
            </h3>
            <p className="text-[11px] font-black leading-relaxed mb-6 italic">
              The ₹200 fee is mandatory to filter high-intent customers. It is
              non-refundable as it covers the immediate operational cost of
              processing and insuring high-value cash shipments.
            </p>
            <div className="h-px bg-black/20 w-full mb-6" />
            <p className="text-[9px] font-bold opacity-60">
              Status: Mandatory for all COD entries.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LEGAL DISCLOSURE */}
      <section className="max-w-7xl mx-auto px-6 mt-6 text-center lg:text-left">
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 md:px-12 md:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <InfoIcon size={20} className="text-zinc-600" />
            <p className="text-[9px] font-bold opacity-40 max-w-2xl uppercase tracking-widest">
              Pricing is inclusive of all taxes unless stated otherwise. Billing
              disputes must be initiated within 7 days of the transaction date
              via the Architect Help Center.
            </p>
          </div>
          <button className="whitespace-nowrap flex items-center gap-2 text-[10px] font-black tracking-widest hover:text-brand transition-colors">
            View T&C <ExternalLinkIcon size={12} />
          </button>
        </div>
      </section>

      {/* 6. HELP & ESCALATION */}
      <footer className="mt-32 max-w-7xl mx-auto px-6 border-t border-white/5 pt-20 flex flex-col items-center">
        <h2 className="text-4xl font-black italic tracking-tighter mb-12">
          Billing Inquiries?
        </h2>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
          <button className="flex-1 bg-white text-black py-5 rounded-2xl font-black tracking-[0.2em] text-[10px] hover:bg-brand transition-colors">
            Contact Billing Support
          </button>
          <button className="flex-1 border border-white/20 py-5 rounded-2xl font-black tracking-[0.2em] text-[10px] hover:bg-white/5 transition-colors">
            Track Recent Payment
          </button>
        </div>
        <p className="text-[9px] font-black opacity-20 tracking-[0.4em] mt-24 italic">
          Architect Financial Systems // Settlement Lab 2026
        </p>
      </footer>
    </div>
  );
}
