'use client';

import React, { useEffect, useRef } from 'react';
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

  // Close on outside click
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

  const trimmed = productName.trim();
  if (!isOpen || trimmed.length < 3) {
    return null;
  }

  const normalizedInput = trimmed.toUpperCase();
  const exactMatch = matches.find((m) => m.name.trim().toUpperCase() === normalizedInput);
  const hasExactDuplicate = Boolean(exactMatch);

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
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Exact Duplicate Found ({matches.length})
              </span>
            </div>
          ) : matches.length > 0 ? (
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Similar Products Found ({matches.length})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Unique Product Name — No duplicates found
              </span>
            </div>
          )}
        </div>

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

      {/* Content list */}
      {matches.length > 0 && (
        <div className="max-h-64 divide-y divide-black/5 overflow-y-auto p-2 dark:divide-white/5">
          {matches.map((item) => {
            const isItemExact = item.name.trim().toUpperCase() === normalizedInput;
            const itemImage = item.imageUrl || (item.images && item.images[0]) || '/images/placeholder.png';
            const itemGroup = item.modelGroup || '';

            return (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 rounded-xl p-2.5 transition-colors ${
                  isItemExact
                    ? 'bg-rose-50/80 dark:bg-rose-950/20'
                    : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                }`}
              >
                {/* Product thumbnail & Info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
                    <Image
                      src={itemImage}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                      unoptimized={itemImage.startsWith('http')}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-bold text-black uppercase dark:text-white">
                        {item.name}
                      </span>
                      {isItemExact && (
                        <span className="shrink-0 rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                          SAME NAME
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-black/50 dark:text-white/50">
                      {item.brand && (
                        <span className="font-semibold text-black/70 dark:text-white/70">
                          {item.brand}
                        </span>
                      )}
                      {item.category && (
                        <>
                          <span>•</span>
                          <span>{item.category}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{item.sellingPrice.toLocaleString()}
                      </span>
                      {item.stock !== undefined && (
                        <>
                          <span>•</span>
                          <span>Stock: {item.stock}</span>
                        </>
                      )}
                    </div>

                    {itemGroup && (
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-black/60 dark:text-white/60">
                        <span className="font-medium">Color Group:</span>
                        <code className="rounded bg-black/5 px-1 py-0.2 font-mono font-bold dark:bg-white/10">
                          {itemGroup}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {itemGroup && onSelectModelGroup && (
                    <button
                      type="button"
                      onClick={() => onSelectModelGroup(itemGroup)}
                      className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
                      title={`Connect this product to group "${itemGroup}"`}
                    >
                      Link Group
                    </button>
                  )}

                  <Link
                    href={`/products/${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-black/10 bg-white px-2 py-1 text-[11px] font-semibold text-black/70 shadow-sm transition-colors hover:bg-black/5 hover:text-black dark:border-white/10 dark:bg-[#1e1e1e] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                  >
                    <span>View</span>
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      )}

      {/* Helpful footer */}
      {matches.length > 0 && (
        <div className="border-t border-black/5 bg-black/[0.015] px-4 py-2 text-[11px] text-black/50 dark:border-white/5 dark:bg-white/[0.015] dark:text-white/50">
          Adding a different color of the same product? Keep the name and use the same{' '}
          <strong className="text-black/75 dark:text-white/75">Color Option Group</strong> below.
        </div>
      )}
    </div>
  );
}
