"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { BrandCard } from "@/features/brand/components/BrandCard";
import brandsData from "@/data/brandLogos";
import type { Brand, BrandCategory } from "@/features/brand/types/brand";

const ALL_CATEGORIES: (BrandCategory | "All")[] = [
  "All",
  "sneakers",
  "fashion",
  "watches",
  "accessories",
];
const SORT_OPTIONS = ["a-z", "z-a"];
const SORT_MAP: Record<string, string> = { "a-z": "A - Z", "z-a": "Z - A" };

export default function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    BrandCategory | "All"
  >("All");
  const [sortOption, setSortOption] = useState<"a-z" | "z-a">("a-z");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const displayedBrands = brandsData
    .filter(
      (b: Brand) =>
        selectedCategory === "All" ||
        b.categories?.includes(selectedCategory as BrandCategory)
    )
    .sort((a: Brand, b: Brand) =>
      sortOption === "a-z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <main className="min-h-screen bg-background text-foreground px-4 pt-10 md:pt-26 pb-24 md:px-10">
      <header className="mb-10">
        <h1 className="text-6xl md:text-8xl text-center font-black uppercase italic tracking-tighter leading-[0.8]">
          Collection <br />{" "}
          <span className="text-muted-foreground font-outline-2">
            of Brands
          </span>
        </h1>
      </header>

      {/* Sticky Bar */}
      <div className="sticky top-14 w-full z-30 mb-8 flex items-center justify-between border-y border-border bg-background py-3 px-1">
        <div className="flex justify-between items-center gap-2 w-full">
          <FilterDropdown
            label="Category"
            activeValue={selectedCategory}
            options={ALL_CATEGORIES}
            isOpen={activeDropdown === "cat"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "cat" ? null : "cat")
            }
            onSelect={(val) => setSelectedCategory(val as any)}
            onClose={() => setActiveDropdown(null)}
          />
          <div className="flex gap-4 items-center">
            <SlidersHorizontal
              size={14}
              className="text-muted-foreground ml-2"
            />
          </div>
          <FilterDropdown
            label="Sort"
            activeValue={sortOption}
            options={SORT_OPTIONS}
            displayMap={SORT_MAP}
            isOpen={activeDropdown === "sort"}
            onToggle={() =>
              setActiveDropdown(activeDropdown === "sort" ? null : "sort")
            }
            onSelect={(val) => setSortOption(val as any)}
            onClose={() => setActiveDropdown(null)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-6">
        {displayedBrands.map((brand) => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </main>
  );
}

// --- Reusable DRY Dropdown Component ---

interface DropdownProps {
  label: string;
  activeValue: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
  onClose: () => void;
  displayMap?: Record<string, string>;
}

function FilterDropdown({
  label,
  activeValue,
  options,
  isOpen,
  onToggle,
  onSelect,
  onClose,
  displayMap,
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (
        isOpen &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        onClose();
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, [isOpen, onClose]);

  const displayLabel = displayMap
    ? displayMap[activeValue] || activeValue
    : activeValue;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        onClick={onToggle}
        className={`flex justify-center w-full rounded-full items-center gap-3 py-2.5 transition-all duration-300 text-[11px] font-black uppercase tracking-tight ${
          isOpen
            ? "bg-foreground text-background border-foreground"
            : "bg-background border-border text-foreground hover:border-foreground/50"
        }`}
      >
        <span className="opacity-40 font-bold">{label}:</span>
        {displayLabel}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 mt-4 w-full bg-foreground border border-border rounded-2xl overflow-hidden shadow-2xl z-50 p-1.5 backdrop-blur-3xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onToggle();
                }}
                className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase transition-all rounded-xl mb-0.5 last:mb-0 ${
                  activeValue === opt
                    ? "bg-background text-foreground"
                    : "hover:bg-background text-background hover:text-foreground"
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
