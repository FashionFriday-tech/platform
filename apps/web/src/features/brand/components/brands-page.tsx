'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ChevronDownIcon, SlidersIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

import brandsData from '@/data/brand-logos';
import { BrandCard } from './BrandCard';
import type { Brand, BrandCategory } from '../types/brand';

const ALL_CATEGORIES: (BrandCategory | 'All')[] = [
  'All',
  'sneakers',
  'fashion',
  'watches',
  'accessories',
];
const SORT_OPTIONS: ('a-z' | 'z-a')[] = ['a-z', 'z-a'];
const SORT_MAP: Record<string, string> = { 'a-z': 'A - Z', 'z-a': 'Z - A' };

export function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory | 'All'>('All');
  const [sortOption, setSortOption] = useState<'a-z' | 'z-a'>('a-z');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const displayedBrands = brandsData
    .filter((b: Brand) => selectedCategory === 'All' || b.categories.includes(selectedCategory))
    .sort((a: Brand, b: Brand) =>
      sortOption === 'a-z' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
    );

  return (
    <main className="bg-background text-foreground min-h-screen px-4 pt-10 pb-24 md:px-10 md:pt-26">
      <header className="mb-10">
        <h1 className="text-center text-6xl leading-[0.8] font-black tracking-tighter uppercase italic md:text-8xl">
          Collection <br /> <span className="text-muted-foreground font-outline-2">of Brands</span>
        </h1>
      </header>

      {/* Sticky Bar */}
      <div className="border-border bg-background sticky top-14 z-30 mb-8 flex w-full items-center justify-between border-y px-1 py-3">
        <div className="flex w-full items-center justify-between gap-2">
          <FilterDropdown
            label="Category"
            activeValue={selectedCategory}
            options={ALL_CATEGORIES}
            isOpen={activeDropdown === 'cat'}
            onToggle={() => {
              setActiveDropdown(activeDropdown === 'cat' ? null : 'cat');
            }}
            onSelect={(val) => {
              setSelectedCategory(val);
            }}
            onClose={() => {
              setActiveDropdown(null);
            }}
          />
          <div className="flex items-center gap-4">
            <SlidersIcon size={14} className="text-muted-foreground ml-2" />
          </div>
          <FilterDropdown
            label="Sort"
            activeValue={sortOption}
            options={SORT_OPTIONS}
            displayMap={SORT_MAP}
            isOpen={activeDropdown === 'sort'}
            onToggle={() => {
              setActiveDropdown(activeDropdown === 'sort' ? null : 'sort');
            }}
            onSelect={(val) => {
              setSortOption(val);
            }}
            onClose={() => {
              setActiveDropdown(null);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 lg:grid-cols-5">
        {displayedBrands.map((brand) => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </main>
  );
}

// --- Reusable Generic Dropdown Component ---

interface DropdownProps<T> {
  label: string;
  activeValue: T;
  options: readonly T[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: T) => void;
  onClose: () => void;
  displayMap?: Record<string, string>;
}

function FilterDropdown<T extends string>({
  label,
  activeValue,
  options,
  isOpen,
  onToggle,
  onSelect,
  onClose,
  displayMap,
}: DropdownProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', clickOut);
    return () => {
      document.removeEventListener('mousedown', clickOut);
    };
  }, [isOpen, onClose]);

  const displayLabel = displayMap
    ? Object.prototype.hasOwnProperty.call(displayMap, activeValue)
      ? displayMap[activeValue]
      : activeValue
    : activeValue;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        onClick={onToggle}
        className={`flex w-full items-center justify-center gap-3 rounded-full py-2.5 text-[11px] font-black tracking-tight uppercase transition-all duration-300 ${
          isOpen
            ? 'bg-foreground text-background border-foreground'
            : 'bg-background border-border text-foreground hover:border-foreground/50'
        }`}
      >
        <span className="font-bold opacity-40">{label}:</span>
        {displayLabel}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="bg-foreground border-border absolute right-0 z-50 mt-4 w-full overflow-hidden rounded-2xl border p-1.5 shadow-2xl backdrop-blur-3xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onToggle();
                }}
                className={`mb-0.5 w-full rounded-xl px-4 py-3 text-left text-[11px] font-bold uppercase transition-all last:mb-0 ${
                  activeValue === opt
                    ? 'bg-background text-foreground'
                    : 'hover:bg-background text-background hover:text-foreground'
                }`}
              >
                {displayMap ? displayMap[opt] || opt : opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
