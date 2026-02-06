"use client";
import React from "react";
import {
  ShieldCheckIcon,
  LockIcon,
  EyeOffIcon,
  DatabaseIcon,
  GlobeIcon,
  UserCheckIcon,
  TrashIcon,
  FileSearchIcon,
  RefreshCcwIcon,
} from "@ff/ui";

const policyData = [
  {
    title: "01. Data Acquisition [The Input]",
    content:
      "We collect information necessary to calibrate your shopping experience. This includes Personal Identifiers (Name, Email, Shipping Protocol), Anatomical Data (Body/Foot measurements for the Fit Architect), and Technical Identifiers (IP Address, Browser Metadata, Cookie ID).",
    icon: <DatabaseIcon size={20} className="text-brand" />,
  },
  {
    title: "02. Logic Processing [Usage]",
    content:
      "Your data is utilized to: (A) Process transactions and logistics. (B) Calibrate size recommendations via our Neural Engine. (C) Execute security protocols to prevent fraudulent acquisitions. (D) Communicate system updates and drop alerts.",
    icon: <RefreshCcwIcon size={20} className="text-brand" />,
  },
  {
    title: "03. Encryption Standards [Security]",
    content:
      "All data exists behind a 256-bit AES encryption layer. Payment information is tokenized via Tier-1 PCI-DSS compliant gateways. We never store raw credit card digits on our internal servers.",
    icon: <LockIcon size={20} className="text-brand" />,
  },
  {
    title: "04. Third-Party Transmission",
    content:
      "Data is only transmitted to essential logistical partners (e.g., DHL, FedEx) and payment processors. We do not sell anatomical or behavioral data to third-party marketing aggregates.",
    icon: <GlobeIcon size={20} className="text-brand" />,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#050505] text-[#f0f0f0] min-h-screen pb-32 selection:bg-brand selection:text-black font-sans">
      {/* 1. PROTOCOL HEADER */}
      <header className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center md:text-left">
        <div className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 w-fit mx-auto md:mx-0">
          <ShieldCheckIcon size={12} className="text-brand" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-brand">
            Security Standard v4.0.26
          </span>
        </div>
        <h1 className="text-6xl md:text-[8vw] font-black uppercase italic tracking-tighter leading-[0.8] mb-8">
          Privacy <br /> <span className="opacity-10 italic">Protocol.</span>
        </h1>
        <p className="max-w-xl text-[11px] font-bold uppercase leading-relaxed opacity-40 tracking-widest italic">
          Last Updated: Jan 28, 2026. This document governs the data
          architecture of our ecosystem.
        </p>
      </header>

      {/* 2. MODULAR CONTENT GRID */}
      <main className="max-w-7xl mx-auto px-6 space-y-4">
        {policyData.map((section, idx) => (
          <div
            key={idx}
            className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 hover:border-brand/30 transition-all duration-500"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="p-4 bg-white/5 rounded-2xl shrink-0">
                {section.icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  {section.title}
                </h2>
                <p className="text-[13px] leading-relaxed opacity-50 font-medium uppercase tracking-tight">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* 3. DETAILED RIGHTS SECTION (GDPR/CCPA) */}
        <div className="mt-12 bg-white/5 border border-white/5 rounded-[3.5rem] p-10 md:p-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="space-y-8">
              <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                User <br /> Rights <br /> Archive.
              </h3>
              <p className="text-xs opacity-40 font-bold uppercase tracking-widest leading-loose">
                Under global data protection laws, you possess the following
                rights regarding your digital footprint in our archive:
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  label: "Right to Erasure",
                  desc:
                    "Request absolute deletion of your neural/anatomical data.",
                  icon: <TrashIcon size={16} />,
                },
                {
                  label: "Right to Portability",
                  desc:
                    "Download a structured dump of your stored information.",
                  icon: <FileSearchIcon size={16} />,
                },
                {
                  label: "Right to Rectification",
                  desc:
                    "Update inaccurate identifiers or measurement profiles.",
                  icon: <UserCheckIcon size={16} />,
                },
                {
                  label: "Right to Object",
                  desc:
                    "Withdraw consent for specific automated processing logic.",
                  icon: <EyeOffIcon size={16} />,
                },
              ].map((right, i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start p-6 rounded-3xl bg-black/40 border border-white/5 hover:border-brand/20 transition-colors"
                >
                  <div className="text-brand mt-1">{right.icon}</div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">
                      {right.label}
                    </h4>
                    <p className="text-[10px] font-medium opacity-40 uppercase italic leading-tight">
                      {right.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 4. CONTACT FOOTER */}
      <footer className="mt-24 px-6 max-w-5xl mx-auto">
        <div className="bg-brand rounded-[4rem] p-12 md:p-24 text-black relative overflow-hidden text-center space-y-8">
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.8]">
              Data <br /> Security <br /> Desk.
            </h2>
            <p className="mt-8 text-xs font-bold uppercase italic opacity-70 max-w-md mx-auto">
              If you have inquiries regarding our encryption methods or wish to
              trigger the Erasure Protocol, contact our Data Protection Officer.
            </p>
            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                Email DPO: security@fashionfriday.in
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
