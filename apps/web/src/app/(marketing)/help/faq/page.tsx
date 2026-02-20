'use client';
import { ArrowUpRightIcon, ChevronRightIcon, MailIcon, SearchIcon, SendIcon } from '@ff/ui';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { faqData } from '@/data/faq';

export default function FAQPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'SEARCH FOR SHIPPING...',
    'HOW DOES COD WORK?',
    'FIND YOUR FIT...',
    'RETURN POLICY DETAILS...',
    'TRACK YOUR DISPATCH...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const filteredFaqs = faqData.filter((item) => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['All', 'Shipping', 'Orders', 'Returns', 'Sizing', 'Partnerships'];

  const handleGmailRedirect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    window.location.href = `mailto:support@fashionfriday.in?subject=FAQ Inquiry: ${filter}&body=${encodeURIComponent(
      question,
    )}`;
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 transition-colors duration-500">
      {/* 1. HEADER SECTION - Removed pt-32 to start from top */}
      <section className="overflow-x-hidden px-6 pt-10 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
          {/* HEADER AREA */}
          <div className="mb-12 space-y-4">
            <div className="border-border bg-background-muted mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black tracking-[0.3em] uppercase">
              Knowledge Base / 2026
            </div>
            <h1 className="text-6xl leading-[0.9] font-black tracking-[-0.04em] uppercase italic md:text-[7vw]">
              How can we <br /> <span className="text-foreground-subtle italic">assist?</span>
            </h1>
          </div>

          {/* INTERACTION AREA */}
          <div className="flex w-full max-w-3xl flex-col items-center space-y-8">
            {/* SEARCH BOX */}
            <div className="group border-border focus-within:border-brand relative w-full overflow-hidden rounded-full border shadow-sm transition-all">
              <SearchIcon
                className="absolute top-1/2 left-6 z-10 -translate-y-1/2 opacity-30"
                size={18}
              />

              <div className="pointer-events-none absolute top-1/2 left-14 flex h-full -translate-y-1/2 items-center">
                {!searchQuery && (
                  <span
                    key={placeholderIndex}
                    className="animate-placeholder text-[11px] font-black tracking-widest uppercase opacity-30"
                  >
                    {placeholders[placeholderIndex]}
                  </span>
                )}
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative z-0 w-full bg-transparent py-6 pr-6 pl-14 text-[11px] font-black tracking-widest uppercase outline-none"
              />
            </div>

            {/* HORIZONTAL SCROLLABLE CATEGORIES */}
            <div className="relative w-full px-2">
              <div className="flex justify-start gap-3 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`shrink-0 rounded-full border px-8 py-4 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all ${
                      filter === cat
                        ? 'bg-brand text-brand-foreground border-brand'
                        : 'border-border hover:border-brand bg-transparent'
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
      <section className="mx-auto mb-32 max-w-4xl px-6">
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`rounded-[2.5rem] border transition-all duration-500 ${
                activeId === faq.id ? 'border-brand shadow-sm' : 'border-border'
              }`}
            >
              <button
                onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                className="group flex w-full items-center justify-between px-8 py-8 text-left"
              >
                <h3 className="text-xl font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-2">
                  {faq.question}
                </h3>
                <div
                  className={`border-border rounded-full border p-2 transition-all ${
                    activeId === faq.id ? 'bg-brand text-brand-foreground rotate-90' : ''
                  }`}
                >
                  <ChevronRightIcon size={18} />
                </div>
              </button>

              {activeId === faq.id && (
                <div className="px-8 pb-10">
                  <div className="border-border space-y-4 border-t pt-6">
                    <p className="text-foreground-muted leading-relaxed font-medium italic">
                      {faq.answer}
                    </p>
                    {faq.href && (
                      <Link
                        href={faq.href}
                        className="text-brand inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-all hover:tracking-[0.1rem]"
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
      <section className="mx-auto max-w-7xl px-6">
        <div className="p relative overflow-hidden rounded-[4rem]">
          <div className="mx-auto max-w-3xl space-y-12 text-center">
            <div className="space-y-6">
              <div className="bg-background border-border mx-auto inline-flex items-center gap-3 rounded-full border px-4 py-2">
                <MailIcon className="text-brand" size={14} />
                <span className="text-[9px] font-black tracking-widest uppercase">
                  Support Node
                </span>
              </div>
              <h2 className="text-4xl leading-none font-black tracking-tighter uppercase italic md:text-6xl">
                Still Need <span className="text-foreground-subtle">Answers?</span>
              </h2>
              <p className="text-foreground-muted mx-auto max-w-sm text-sm font-medium italic">
                If the archive didn't cover your concern, type your question below. We'll bridge you
                directly to our Gmail dispatch.
              </p>
            </div>

            <div className="bg-background border-border relative rounded-[3rem] border-2 p-4">
              <form onSubmit={handleGmailRedirect} className="relative">
                <textarea
                  required
                  name="question"
                  rows={3}
                  placeholder="WRITE YOUR QUESTION HERE..."
                  className="w-full resize-none rounded-[2.5rem] bg-transparent px-10 py-8 text-[12px] font-black tracking-widest uppercase transition-all outline-none placeholder:opacity-30"
                />

                <div className="flex flex-col items-center justify-between gap-4 px-6 pb-4 sm:flex-row">
                  <span className="text-[9px] font-black tracking-widest uppercase italic opacity-30">
                    Sending to: support@fashionfriday.in
                  </span>
                  <button
                    type="submit"
                    className="bg-brand text-brand-foreground flex items-center justify-center gap-3 rounded-full px-8 py-4 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl transition-all hover:scale-105 active:scale-95"
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
        <p className="text-[10px] font-black tracking-[1em] uppercase italic opacity-20">
          Curated in India / 2026
        </p>
      </footer>
    </div>
  );
}
