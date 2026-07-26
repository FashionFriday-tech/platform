'use client';

import React, { useEffect, useState } from 'react';

import { CloseIcon, SearchIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

export const DEFAULT_SEARCH_PLACEHOLDERS = [
  'Search for linen shirts',
  'Search by category',
  'Search by brands',
  'Search for street wear',
  'Search for accessories',
  'Search sneakers & apparel',
];

export interface SearchBoxProps {
  interactive?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (val: string) => void;
  onSubmit?: (val: string) => void;
  onClick?: () => void;
  placeholders?: string[];
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  interactive = false,
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onClick,
  placeholders = DEFAULT_SEARCH_PLACEHOLDERS,
  className,
  autoFocus = false,
}: SearchBoxProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const query = value !== undefined ? value : internalValue;

  useEffect(() => {
    if (defaultValue !== undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue]);

  // Rotate animated placeholders every 2.5s when input is empty
  useEffect(() => {
    if (query && isFocused) {
      return;
    }
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => {
      clearInterval(timer);
    };
  }, [placeholders.length, query, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.(query.trim());
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value === undefined) {
      setInternalValue('');
    }
    onChange?.('');
  };

  // 1. Non-interactive Trigger Mode (Used in Hero mobile search bar to trigger modal)
  if (!interactive) {
    return (
      <div
        onClick={onClick}
        className={cn(
          'flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-full border border-zinc-300/80 bg-zinc-50/50 px-4 py-2.5 transition-all duration-200 active:scale-98 dark:border-zinc-700/80 dark:bg-zinc-900/50',
          className,
        )}
      >
        <SearchIcon className="h-4.5 w-4.5 shrink-0 text-zinc-500 dark:text-zinc-400" />
        <div className="relative flex h-5 w-full items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={placeholderIndex}
              initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute truncate text-xs font-medium text-zinc-600 select-none sm:text-sm dark:text-zinc-300"
            >
              {placeholders[placeholderIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // 2. Interactive Input Mode (Used in Search Page & Search Controls)
  return (
    <div
      className={cn(
        'relative flex w-full items-center gap-3 overflow-hidden rounded-full border border-zinc-300/80 bg-zinc-50/50 px-4 py-2.5 transition-all duration-200 focus-within:border-zinc-500 focus-within:bg-zinc-100/80 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:focus-within:border-zinc-500 dark:focus-within:bg-zinc-900/80',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => {
          onSubmit?.(query.trim());
        }}
        className="shrink-0 text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        aria-label="Submit search"
      >
        <SearchIcon className="h-4.5 w-4.5" />
      </button>

      <div className="relative flex h-5 w-full items-center overflow-hidden">
        {/* Animated rotating placeholder when input is empty and unfocused */}
        {!query && !isFocused && (
          <div className="pointer-events-none absolute inset-0 flex items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute truncate text-xs font-medium text-zinc-500/80 select-none sm:text-sm dark:text-zinc-400/80"
              >
                {placeholders[placeholderIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          autoFocus={autoFocus}
          placeholder={isFocused && !query ? placeholders[placeholderIndex] : ''}
          className="w-full bg-transparent text-xs font-medium text-zinc-800 outline-none placeholder:text-zinc-400 sm:text-sm dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />
      </div>

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 text-zinc-400 transition-colors hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200"
          aria-label="Clear search input"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
