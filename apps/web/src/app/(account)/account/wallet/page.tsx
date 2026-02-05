"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  RefreshCcw,
  ShieldCheck,
  TicketPercent,
  Plus,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type TransactionType = "reward" | "refund" | "purchase" | "topup";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  description: string;
  timestamp: number;
}

export default function WalletPage() {
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const totals = useMemo(
    () => ({
      total: 3199,
      rewardWallet: 700,
      refundBalance: 2499,
    }),
    []
  );

  const transactions: Transaction[] = [
    {
      id: "TX101",
      type: "reward",
      amount: 100,
      date: "26 Jan 2026",
      status: "completed",
      description: "Referral Reward: Rahul S.",
      timestamp: 1737885600000,
    },
    {
      id: "TX102",
      type: "refund",
      amount: 2499,
      date: "24 Jan 2026",
      status: "completed",
      description: "Refund: Order #FF9021",
      timestamp: 1737712800000,
    },
    {
      id: "TX103",
      type: "reward",
      amount: 500,
      date: "23 Jan 2026",
      status: "completed",
      description: "Gift Card: BDAY500",
      timestamp: 1737626400000,
    },
    {
      id: "TX104",
      type: "purchase",
      amount: -1200,
      date: "22 Jan 2026",
      status: "completed",
      description: "Payment for Shoes",
      timestamp: 1737540000000,
    },
  ];

  const sortedLedger = useMemo(() => {
    return transactions
      .filter((t) => filter === "all" || t.type === filter)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [filter]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-6 md:pt-32 pb-20 px-4 md:px-8 overflow-hidden rounded-b-[4rem] md:rounded-b-[6rem]">
        {/* BACKGROUND IMAGE CONTAINER */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105" />
        {/* DYNAMIC OVERLAYS */}
        <main className="mx-auto max-w-5xl relative z-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* GLASSMORPHISM MAIN CARD */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ scale: 1.015 }}
              className="relative overflow-hidden rounded-4xl shadow-2xl h-full aspect-5/4"
            >
              {/* Background image */}
              {/* <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{ backgroundImage: "url('/images/wallet/hero4.png')" }}
              /> */}

              <video
                className="absolute inset-0 w-full h-full object-cover scale-105
             saturate-10 hue-rotate-[200deg] brightness-75 contrast-110"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videos/wallet/coin.mp4" type="video/mp4" />
              </video>

              {/* Content */}
              <div className="h-full flex flex-col justify-between relative z-10 p-6">
                <div className="h-full flex items-start justify-between">
                  <div>
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.35em] text-white/60">
                      Total Balance
                    </p>

                    <h2 className="text-4xl md:text-4xl font-bold tracking-tighter text-white drop-shadow-[0_6px_30px_rgba(16,185,129,0.45)]">
                      ₹{totals.total.toLocaleString()}
                    </h2>
                  </div>

                  {/* Status icon */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-foreground/40 blur-lg animate-pulse" />
                    <div className="relative rounded-xl bg-backgroiund/40 border border-white/20 p-3 text-white">
                      <ShieldCheck size={22} />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>Bank-grade security</span>
                  <span className="font-semibold text-white ">
                    Updated live
                  </span>
                </div>
              </div>
            </motion.div>

            {/* USAGE LOGIC SUMMARY */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full border border-foreground flex justify-center items-center animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-foreground shadow-[0_0_12px_#4ade80]" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                    Spending Power
                  </p>
                </div>
                <p className="text-sm md:text-base font-bold leading-relaxed text-foreground/80 italic max-w-md">
                  Your{" "}
                  <span className="text-foreground font-black">
                    Refund Wallet
                  </span>{" "}
                  is 100% usable. Reward Wallet usage is capped at{" "}
                  <span className="underline underline-offset-4 decoration-foreground">
                    5% of total order value
                  </span>{" "}
                  per purchase.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-[8px] font-black uppercase tracking-widest text-foreground/30 mb-1">
                    Status
                  </p>
                  <p className="text-xs font-black italic text-foreground uppercase tracking-tight">
                    Elite Member
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 transition-all hover:bg-white/10">
                  <p className="text-[8px] font-black uppercase tracking-widest text-foreground/30 mb-1">
                    Last Sync
                  </p>
                  <p className="text-xs font-black italic text-foreground uppercase tracking-tight">
                    Live
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* 2. RESPONSIVE SUB-WALLETS */}
      <section className="mx-auto max-w-5xl px-4 md:px-8 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <SubWalletCard
            label="Refund Wallet"
            value={`₹${totals.refundBalance}`}
            icon={<RefreshCcw size={20} />}
            description="Verified returns. Fully usable for your next order."
            action="Details"
            color="emerald-400"
          />
          <SubWalletCard
            label="Reward Wallet"
            value={`₹${totals.rewardWallet}`}
            icon={<TicketPercent size={20} />}
            description="Referrals & Giftcards. Auto-applies 5% on orders."
            action="Details"
            color="red-400"
          />
        </div>

        {/* 3. ACTIVITY LEDGER */}
        <div className="space-y-6 pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-border rounded-4xl p-3 bg-background-muted/20">
            <div className="flex items-center gap-3 px-4">
              <History size={16} className="opacity-30" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground-subtle">
                Activity History
              </h3>
            </div>
            <div className="flex items-center bg-foreground/10 p-1 rounded-2xl w-full md:w-auto">
              {(["all", "refund", "reward", "purchase"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "flex-1 md:flex-none py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    filter === t
                      ? "bg-background text-foreground shadow-lg"
                      : "opacity-30 hover:opacity-100"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-[3rem] border border-border overflow-hidden divide-y divide-border/30 shadow-sm">
            <AnimatePresence mode="popLayout">
              {sortedLedger.map((tx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={tx.id}
                  className="p-4 md:px-12 flex items-center justify-between hover:bg-foreground/[0.01] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                        tx.amount > 0
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-400/10 text-red-400"
                      )}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownLeft size={22} />
                      ) : (
                        <ArrowUpRight size={22} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-black italic uppercase tracking-tight">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-30">
                          {tx.date}
                        </span>
                        <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-foreground/5 opacity-50">
                          Ref: {tx.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg font-black italic tracking-tighter text-nowrap",
                        tx.amount > 0 ? "text-emerald-500" : "text-red-400"
                      )}
                    >
                      ₹{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-20 mt-1 italic">
                      {tx.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sub Wallet Components ---
function SubWalletCard({
  label,
  value,
  icon,
  description,
  action,
  color,
}: any) {
  const [openWallet, setOpenWallet] = useState(false);

  return (
    <div
      onClick={() => setOpenWallet(!openWallet)}
      className={`relative bg-background border border-border p-8 rounded-[3.5rem] shadow-sm hover:border-foreground/20 flex flex-col justify-between h-72 group`}
    >
      <div
        className={`absolute border-t w-full left-0 rounded-4xl py-20 border-border z-20 transition-all duration-300 bg-foreground ${
          openWallet ? "-top-6" : "top-6"
        }`}
      >
        <h3 className="absolute top-5 right-5 text-3xl font-semibold italic tracking-tighter mb-2 text-background">
          {value}
        </h3>
        <img
          src="/images/wallet/chip.png"
          alt="chip"
          className="absolute top-6 left-6 w-12"
        />
      </div>
      <div className="absolute border-t-2 border-dashed w-auto top-14 left-2 right-2 rounded-4xl py-20 border-border z-40 bg-background" />

      <div className="absolute border-t w-full top-12 left-0 rounded-4xl py-20 border-border z-30 bg-background" />
      <div className="pt-12 z-50">
        <div className={`flex justify-between items-center text-foreground`}>
          <div
            className={`p-4 bg-foreground/5 rounded-[1.25rem] text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-700`}
          >
            {icon}
          </div>
          <p className="text-sm font-black uppercase tracking-widest">
            {label}
          </p>
          <div className="p-4">
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-6">
        <p
          className={`text-[10px] font-bold opacity-30 max-w-[160px] leading-tight uppercase italic`}
        >
          {description}
        </p>
        <button
          className={`text-[10px] font-black uppercase tracking-widest underline underline-offset-8 transition-colors text-foreground`}
        >
          {action}
        </button>
      </div>
    </div>
  );
}
