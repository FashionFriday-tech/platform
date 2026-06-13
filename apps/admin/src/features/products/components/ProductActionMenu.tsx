'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { EditIcon, EyeIcon, TrashIcon } from '@ff/ui';

import { type Product } from '../types';

interface ProductActionMenuProps {
  product: Product;
  onToggleStatus: (id: string) => void;
  onRequestDelete: (product: Product) => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export function ProductActionMenu({
  product,
  onToggleStatus,
  onRequestDelete,
  isOpen: controlledIsOpen,
  onOpenChange,
}: ProductActionMenuProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (valOrFn: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof valOrFn === 'function' ? valOrFn(isOpen) : valOrFn;
    if (!isControlled) {
      setUncontrolledIsOpen(nextVal);
    }
    onOpenChange?.(nextVal);
  };
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const isDraft = product.status === 'Draft';
  const isActive = product.status === 'Active';

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-Dot Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        aria-expanded={isOpen}
        aria-label="Product actions"
        className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-all ${
          isOpen
            ? 'border-black/20 bg-black/10 text-black dark:border-white/20 dark:bg-white/20 dark:text-white'
            : 'border-transparent text-black/50 hover:border-black/10 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-white'
        }`}
      >
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {/* Action Popup Box */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="animate-in fade-in zoom-in-95 absolute right-0 top-full z-50 mt-1.5 w-56 origin-top-right rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-2xl backdrop-blur-2xl duration-150 dark:border-white/10 dark:bg-[#181818]/95"
        >
          {/* Active / Inactive Toggle Option */}
          <div
            onClick={() => {
              if (!isDraft) {
                onToggleStatus(product.id);
                setIsOpen(false);
              }
            }}
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              isDraft
                ? 'cursor-not-allowed opacity-50 text-black/40 dark:text-white/40'
                : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 text-black/80 dark:text-white/80'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isActive
                    ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                    : isDraft
                    ? 'bg-yellow-500'
                    : 'bg-zinc-400'
                }`}
              />
              <span>{isDraft ? 'Draft (Inactive)' : isActive ? 'Active' : 'Inactive'}</span>
            </div>

            {/* Toggle Switch representation */}
            <div
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isActive
                  ? 'bg-black dark:bg-white'
                  : 'border border-black/20 bg-black/10 dark:border-white/20 dark:bg-white/10'
              } ${isDraft ? 'opacity-40' : ''}`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${
                  isActive
                    ? 'translate-x-4.5 bg-white dark:bg-black'
                    : 'translate-x-0.5 bg-black/50 dark:bg-white/50'
                }`}
              />
            </div>
          </div>

          <div className="my-1 border-t border-black/5 dark:border-white/5" />

          {/* View Details */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push(`/products/${product.seoSlug ?? product.id}`);
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <EyeIcon className="h-4 w-4 opacity-70" />
            <span>View Details</span>
          </button>

          {/* Edit Product */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              router.push(`/products/${product.id}/edit`);
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <EditIcon className="h-4 w-4 opacity-70" />
            <span>Edit Product</span>
          </button>

          <div className="my-1 border-t border-black/5 dark:border-white/5" />

          {/* Delete Option */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onRequestDelete(product);
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
          >
            <TrashIcon className="h-4 w-4 opacity-80" />
            <span>Delete Product</span>
          </button>
        </div>
      )}
    </div>
  );
}
