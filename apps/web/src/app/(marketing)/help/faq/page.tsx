"use client";
import React, { useState, useEffect } from "react";
import {
  SearchIcon,
  SendIcon,
  MailIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
} from "@ff/ui";
import Link from "next/link";
import { faqData } from "@/data/faq";

export default function FAQPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    "SEARCH FOR SHIPPING...",
    "HOW DOES COD WORK?",
    "FIND YOUR FIT...",
    "RETURN POLICY DETAILS...",
    "TRACK YOUR DISPATCH...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredFaqs = faqData.filter((item) => {
    const matchesFilter = filter === "All" || item.category === filter;
    const matchesSearch = item.question
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    "All",
    "Shipping",
    "Orders",
    "Returns",
    "Sizing",
    "Partnerships",
  ];

  const handleGmailRedirect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    window.location.href = `mailto:support@fashionfriday.in?subject=FAQ Inquiry: ${filter}&body=${encodeURIComponent(
      question
    )}`;
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 transition-colors duration-500">
      {/* 1. HEADER SECTION - Removed pt-32 to start from top */}
      <section className="pt-10 pb-16 px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* HEADER AREA */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background-muted text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
              Knowledge Base / 2026
            </div>
            <h1 className="text-6xl md:text-[7vw] font-black uppercase tracking-[-0.04em] leading-[0.9] italic">
              How can we <br />{" "}
              <span className="text-foreground-subtle italic">assist?</span>
            </h1>
          </div>

          {/* INTERACTION AREA */}
          <div className="w-full max-w-3xl flex flex-col items-center space-y-8">
            {/* SEARCH BOX */}
            <div className="relative group w-full overflow-hidden rounded-full border border-border focus-within:border-brand transition-all shadow-sm">
              <SearchIcon
                className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 z-10"
                size={18}
              />

              <div className="absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none h-full flex items-center">
                {!searchQuery && (
                  <span
                    key={placeholderIndex}
                    className="animate-placeholder text-[11px] font-black uppercase tracking-widest opacity-30"
                  >
                    {placeholders[placeholderIndex]}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-6 pl-14 pr-6 outline-none uppercase font-black tracking-widest text-[11px] relative z-0"
              />
            </div>

            {/* HORIZONTAL SCROLLABLE CATEGORIES */}
            <div className="w-full relative px-2">
              <div className="flex overflow-x-auto justify-start gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`whitespace-nowrap px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                      filter === cat
                        ? "bg-brand text-brand-foreground border-brand"
                        : "bg-transparent border-border hover:border-brand"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FAQ LIST */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`rounded-[2.5rem] border transition-all duration-500 ${
                activeId === faq.id ? "border-brand shadow-sm" : "border-border"
              }`}
            >
              <button
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                className="w-full px-8 py-8 flex items-center justify-between text-left group"
              >
                <h3 className="text-xl font-black uppercase tracking-tight italic group-hover:translate-x-2 transition-transform">
                  {faq.question}
                </h3>
                <div
                  className={`p-2 rounded-full border border-border transition-all ${
                    activeId === faq.id
                      ? "rotate-90 bg-brand text-brand-foreground"
                      : ""
                  }`}
                >
                  <ChevronRightIcon size={18} />
                </div>
              </button>

              {activeId === faq.id && (
                <div className="px-8 pb-10">
                  <div className="border-t border-border pt-6 space-y-4">
                    <p className="text-foreground-muted leading-relaxed font-medium italic">
                      {faq.answer}
                    </p>
                    {faq.href && (
                      <Link
                        href={faq.href}
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand transition-all hover:tracking-[0.1rem]"
                      >
                        {faq.linkText} <ArrowUpRightIcon size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. SUPPORT DISPATCH CENTER (Restored Column Design) */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="rounded-[4rem] p relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-background border border-border mx-auto">
                <MailIcon className="text-brand" size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Support Node
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
                Still Need{" "}
                <span className="text-foreground-subtle">Answers?</span>
              </h2>
              <p className="text-foreground-muted text-sm font-medium italic mx-auto max-w-sm">
                If the archive didn't cover your concern, type your question
                below. We'll bridge you directly to our Gmail dispatch.
              </p>
            </div>

            <div className="bg-background rounded-[3rem] p-4 border-2 border-border relative">
              <form onSubmit={handleGmailRedirect} className="relative">
                <textarea
                  required
                  name="question"
                  rows={3}
                  placeholder="WRITE YOUR QUESTION HERE..."
                  className="w-full bg-transparent rounded-[2.5rem] py-8 px-10 outline-none uppercase font-black tracking-widest text-[12px] resize-none transition-all placeholder:opacity-30"
                />

                <div className="flex flex-col gap-4 sm:flex-row items-center justify-between px-6 pb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-30 italic">
                    Sending to: support@fashionfriday.in
                  </span>
                  <button
                    type="submit"
                    className="bg-brand text-brand-foreground px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    Send on Gmail <SendIcon size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-32 text-center">
        <p className="text-[10px] font-black uppercase tracking-[1em] opacity-20 italic">
          Curated in India / 2026
        </p>
      </footer>
    </div>
  );
}
