"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Users, Wallet, Clock, Share2, Gift } from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  // Updated criteria to include "all"
  const [sortCriteria, setSortCriteria] = useState<
    "all" | "active" | "Inactive"
  >("all");

  const referralCode = "FRIDAY-CAPTAIN-11";
  const referralLink = `https://fashionfriday.in/invite/${referralCode}`;

  const metrics = [
    {
      label: "Activated",
      value: "₹1,200",
      icon: <Wallet size={16} />,
      color: "text-emerald-500",
    },
    {
      label: "Inactive",
      value: "₹300",
      icon: <Clock size={16} />,
      color: "text-orange-500",
    },
    {
      label: "Network",
      value: "15 Users",
      icon: <Users size={16} />,
      color: "text-foreground",
    },
  ];

  const rawUsers = [
    {
      id: 1,
      name: "Rahul S.",
      date: "22/01/26",
      status: "Inactive",
      timestamp: 1737504000000,
    },
    {
      id: 2,
      name: "Sana K.",
      date: "24/01/26",
      status: "Active",
      timestamp: 1737676800000,
    },
    {
      id: 3,
      name: "Kevin V.",
      date: "15/01/26",
      status: "Active",
      timestamp: 1736899200000,
    },
    {
      id: 4,
      name: "Aditi R.",
      date: "25/01/26",
      status: "Inactive",
      timestamp: 1737763200000,
    },
    {
      id: 5,
      name: "Mohammed A.",
      date: "18/01/26",
      status: "Active",
      timestamp: 1737158400000,
    },
    {
      id: 6,
      name: "Priya M.",
      date: "10/01/26",
      status: "Inactive",
      timestamp: 1736467200000,
    },
    {
      id: 7,
      name: "Daniel T.",
      date: "05/01/26",
      status: "Inactive",
      timestamp: 1736035200000,
    },
    {
      id: 8,
      name: "Neha P.",
      date: "20/01/26",
      status: "Active",
      timestamp: 1737331200000,
    },
    {
      id: 9,
      name: "Arjun D.",
      date: "12/01/26",
      status: "Inactive",
      timestamp: 1736640000000,
    },
    {
      id: 10,
      name: "Fatima Z.",
      date: "08/01/26",
      status: "Inactive",
      timestamp: 1736294400000,
    },
    {
      id: 11,
      name: "Chris L.",
      date: "21/01/26",
      status: "Active",
      timestamp: 1737417600000,
    },
    {
      id: 12,
      name: "Ishaan K.",
      date: "23/01/26",
      status: "Inactive",
      timestamp: 1737590400000,
    },
    {
      id: 13,
      name: "Meera N.",
      date: "14/01/26",
      status: "Active",
      timestamp: 1736812800000,
    },
    {
      id: 14,
      name: "John P.",
      date: "03/01/26",
      status: "Inactive",
      timestamp: 1735948800000,
    },
    {
      id: 15,
      name: "Zoya H.",
      date: "26/01/26",
      status: "Active",
      timestamp: 1737849600000,
    },
  ];

  // IMPROVED FILTER + SORT LOGIC: Latest on top for every mode
  const sortedUsers = useMemo(() => {
    let filteredList = [...rawUsers];

    // 1. Filter based on status
    if (sortCriteria === "active") {
      filteredList = filteredList.filter((u) => u.status === "Active");
    } else if (sortCriteria === "Inactive") {
      filteredList = filteredList.filter((u) => u.status === "Inactive");
    }

    // 2. Always sort by newest timestamp first
    return filteredList.sort((a, b) => b.timestamp - a.timestamp);
  }, [sortCriteria]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData: ShareData = {
      title: "Fashion Friday - Style That Moves",
      text:
        "Hey! Check out Fashion Friday, India’s trendiest fashion & footwear store. Use my referral link to get ₹100 reward!",
      url: referralLink,
    };

    // Optional: attach an image if the browser supports files
    if (navigator.canShare && navigator.canShare({ files: [] })) {
      try {
        const response = await fetch("/images/refferal/hero.png");
        const blob = await response.blob();
        const file = new File([blob], "fashion-friday-invite.png", {
          type: blob.type,
        });

        shareData.files = [file];
      } catch (err) {
        console.log("Could not attach image", err);
      }
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Invite shared successfully!");
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // fallback for unsupported browsers
      handleCopy(referralLink);
      console.log(
        "Your browser doesn't support direct sharing. Link copied! Share it anywhere."
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 transition-colors duration-500">
      <main className="mx-auto max-w-4xl space-y-4 md:pt-20">
        <section
          className="relative text-foreground p-6 md:p-8 shadow-xl space-y-6 rounded-tr-[4rem] rounded-bl-[4rem] rounded-xl overflow-hidden"
          style={{
            backgroundImage: "url('/images/refferal/hero.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* DARK OVERLAY */}
          <div className="absolute h-full inset-0 bg-black/50 " />

          {/* CONTENT */}
          <div className="relative z-10 space-y-6">
            {/* HERO HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                <Gift size={24} className="text-white" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white">
                  Invite Friends. Earn ₹100.
                </h2>
                <p className="text-xs md:text-sm text-white/70 mt-2 max-w-xl">
                  Share your referral link. When your friend places and receives
                  their first order, ₹100 lands in your wallet.
                </p>
              </div>
            </div>

            {/* INVITE BAR */}
            <div className="flex flex-col lg:flex-row items-stretch gap-3 bg-black/50 border border-white/10 rounded-2xl p-3">
              <div className="flex items-center gap-3 bg-black/70 rounded-xl px-4 py-3 flex-1">
                <span className="text-[11px] font-black uppercase tracking-widest italic truncate text-white">
                  {referralCode}
                </span>

                <button
                  onClick={() => handleCopy(referralCode)}
                  className="ml-auto flex items-center gap-1 text-white/60 hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="text-[10px] font-bold uppercase">
                        Copy
                      </span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleShare}
                className="bg-white text-black h-12 px-8 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
              >
                <Share2 size={16} />
                Share Invite
              </button>
            </div>

            <p className="text-[10px] text-white/40 text-center">
              Reward credited after successful delivery of your friend’s first
              order.
            </p>
          </div>
        </section>

        {/* ROW 1: METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="bg-background border border-border rounded-2xl p-5 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-foreground/5 rounded-xl text-foreground-subtle">
                  {m.icon}
                </div>
                <div>
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">
                    {m.label}
                  </p>
                  <h3
                    className={`text-lg font-black italic tracking-tighter ${m.color}`}
                  >
                    {m.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ROW 3: SORTABLE ACTIVITY GRID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 pt-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground-subtle">
              Activity
            </h3>

            {/* UPDATED SORTING/FILTERING CONTROL */}
            <div className="flex items-center gap-1 bg-foreground/5 p-1 rounded-xl border border-border">
              {(["all", "active", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortCriteria(s)}
                  className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                    sortCriteria === s
                      ? "bg-background text-foreground shadow-sm"
                      : "opacity-30"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-20">
            <AnimatePresence mode="popLayout">
              {sortedUsers.map((user) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={user.id}
                  className="bg-background border border-border p-5 rounded-[1.5rem] flex flex-col justify-between h-32 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        user.status === "Active"
                          ? "bg-emerald-500 shadow-[0_0_8px_emerald]"
                          : "bg-orange-500"
                      }`}
                    />
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest ${
                        user.status === "Active"
                          ? "text-emerald-500"
                          : "text-orange-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-black italic uppercase tracking-tight truncate">
                      {user.name}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-20">
                        {user.date}
                      </span>
                      <span
                        className={`text-xs font-black italic ${
                          user.status === "Active"
                            ? "text-foreground"
                            : "opacity-10"
                        }`}
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
