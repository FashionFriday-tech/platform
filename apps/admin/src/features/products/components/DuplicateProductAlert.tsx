'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { type Product } from '../types';

interface DuplicateProductAlertProps {
  productName: string;
  matches: Product[];
  isSearching: boolean;
  isOpen: boolean;
  hasSearched: boolean;
  onClose: () => void;
  onSelectModelGroup?: (modelGroup: string) => void;
}

export function DuplicateProductAlert({
  productName,
  matches,
  isSearching,
  isOpen,
  hasSearched,
  onClose,
  onSelectModelGroup,
}: DuplicateProductAlertProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Close on outside click or Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Update carousel scroll state
  const checkScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
  }, [matches, isOpen]);

  const scroll = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    const distance = 260;
    el.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 300);
  };

  const trimmed = productName.trim();
  if (!isOpen || trimmed.length < 3) {
    return null;
  }

  const normalizedInput = trimmed.toUpperCase();
  const exactMatches = matches.filter((m) => m.name.trim().toUpperCase() === normalizedInput);
  const hasExactDuplicate = exactMatches.length > 0;

  return (
    <div
      ref={containerRef}
      className="animate-in fade-in slide-in-from-top-2 relative z-30 mt-2 w-full overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-[#141414]/95"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5 dark:border-white/5">
        <div className="flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-black/60 dark:text-white/60">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black dark:border-white/20 dark:border-t-white" />
              <span>Checking database for duplicates...</span>
            </div>
          ) : hasExactDuplicate ? (
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Exact Duplicate Found ({matches.length} matching)
              </span>
            </div>
          ) : matches.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Existing Matching Products ({matches.length})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Unique Product Name — No duplicates found
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Carousel Left / Right Buttons */}
          {matches.length > 2 && (
            <div className="mr-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/70 transition-colors hover:bg-black/10 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                title="Scroll previous"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 bg-black/5 text-black/70 transition-colors hover:bg-black/10 disabled:opacity-30 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10"
                title="Scroll next"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-black/40 transition-colors hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
            title="Close alert"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel View */}
      {matches.length > 0 && (
        <div className="relative p-3">
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="scrollbar-thin flex items-stretch gap-3 overflow-x-auto pb-2 scroll-smooth"
          >
            {matches.map((item) => {
              const isItemExact = item.name.trim().toUpperCase() === normalizedInput;
              const itemImage =
                item.imageUrl || (item.images && item.images[0]) || '/images/placeholder.png';
              const itemGroup = item.modelGroup || '';

              return (
                <div
                  key={item.id}
                  className={`flex w-52 shrink-0 flex-col justify-between rounded-xl border p-2.5 transition-all ${
                    isItemExact
                      ? 'border-rose-400/80 bg-rose-50/50 shadow-sm ring-1 ring-rose-500/30 dark:border-rose-500/40 dark:bg-rose-950/20'
                      : 'border-black/10 bg-white hover:border-black/20 hover:shadow-sm dark:border-white/10 dark:bg-[#1a1a1a] dark:hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* First Product Image */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/5">
                      <Image
                        src={itemImage}
                        alt={item.name}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        unoptimized={itemImage.startsWith('http')}
                      />
                      {isItemExact && (
                        <div className="absolute top-1.5 left-1.5 rounded-md bg-rose-600 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-sm uppercase">
                          SAME NAME
                        </div>
                      )}
                      {item.brand && (
                        <div className="absolute right-1.5 bottom-1.5 max-w-[80%] truncate rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-xs">
                          {item.brand}
                        </div>
                      )}
                    </div>

                    {/* Product Name */}
                    <h4
                      className="mt-2 line-clamp-2 text-xs font-bold text-black uppercase dark:text-white"
                      title={item.name}
                    >
                      {item.name}
                    </h4>

                    {/* Meta row: Category, Price, Stock */}
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{item.sellingPrice.toLocaleString()}
                      </span>
                      <span className="text-black/50 dark:text-white/50">
                        {item.stock !== undefined ? `Stock: ${item.stock}` : ''}
                      </span>
                    </div>

                    {item.category && (
                      <p className="mt-0.5 truncate text-[10px] text-black/50 dark:text-white/50">
                        {item.category}
                      </p>
                    )}

                    {/* Color Group Tag */}
                    {itemGroup && (
                      <div className="mt-1.5 flex items-center gap-1 rounded bg-black/5 px-1.5 py-0.5 font-mono text-[10px] text-black/70 dark:bg-white/10 dark:text-white/70">
                        <span className="shrink-0 text-[9px] font-bold uppercase text-black/40 dark:text-white/40">
                          Group:
                        </span>
                        <span className="truncate font-semibold">{itemGroup}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="mt-2.5 flex items-center gap-1.5 border-t border-black/5 pt-2 dark:border-white/5">
                    {itemGroup && onSelectModelGroup && (
                      <button
                        type="button"
                        onClick={() => onSelectModelGroup(itemGroup)}
                        className="flex-1 rounded-lg border border-blue-500/30 bg-blue-500/10 py-1 text-center text-[10px] font-bold text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
                        title={`Link color to group "${itemGroup}"`}
                      >
                        Link Color
                      </button>
                    )}
                    <Link
                      href={`/products/${item.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1 rounded-lg border border-black/10 bg-white px-2 py-1 text-[10px] font-semibold text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:border-white/10 dark:bg-[#202020] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      title="View product details in new tab"
                    >
                      <span>View</span>
                      <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Helpful footer */}
      {matches.length > 0 && (
        <div className="border-t border-black/5 bg-black/[0.015] px-4 py-2 text-[11px] text-black/50 dark:border-white/5 dark:bg-white/[0.015] dark:text-white/50">
          Showing all {matches.length} matching products. Adding another color? Click{' '}
          <strong className="text-blue-600 dark:text-blue-400">Link Color</strong> to connect it to the same color group.
        </div>
      )}
    </div>
  );
}
