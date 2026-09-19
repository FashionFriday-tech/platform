'use client';

import React, { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

export interface SelectOption {
  label: string;
  value: string;
  group?: string;
  badge?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  align?: 'left' | 'right';
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  buttonClassName,
  dropdownClassName,
  size = 'md',
  icon,
  align = 'left',
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (o) =>
      o.value.toLowerCase() === value?.toLowerCase() ||
      o.label.toLowerCase() === value?.toLowerCase(),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={
          buttonClassName ??
          (size === 'sm'
            ? 'flex w-full items-center justify-between gap-2.5 rounded-xl bg-[#f8f9fa] px-3 py-2 text-sm font-medium text-black/80 transition-all outline-none hover:bg-black/5 dark:bg-[#1a1a1a] dark:text-white/80 dark:hover:bg-white/5'
            : 'flex w-full items-center justify-between rounded-xl bg-[#f8f9fa] px-4 py-3 text-sm font-semibold text-black transition-all outline-none hover:bg-black/5 dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-white/5')
        }
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="shrink-0 text-black/40 dark:text-white/40">{icon}</span>}
          <span className="truncate">
            {selectedOption
              ? selectedOption.label
              : value
                ? value.charAt(0).toUpperCase() + value.slice(1)
                : placeholder}
          </span>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`scrollbar-hide absolute z-50 mt-2 max-h-60 min-w-full w-max max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl bg-white p-1.5 dark:bg-[#1a1a1a] ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${dropdownClassName ?? ''}`}
          >
            {options.map((option, idx) => {
              const showGroup =
                Boolean(option.group) && (idx === 0 || options[idx - 1].group !== option.group);
              const isSelected =
                value?.toLowerCase() === option.value.toLowerCase() ||
                value?.toLowerCase() === option.label.toLowerCase();

              return (
                <React.Fragment key={`${option.value}-${idx}`}>
                  {showGroup && (
                    <div className="sticky top-0 z-10 border-b border-black/5 bg-white/95 px-3 py-1.5 text-[10px] font-black tracking-wider text-black/40 uppercase backdrop-blur-sm first:border-t-0 dark:border-white/5 dark:bg-[#1a1a1a]/95 dark:text-white/40">
                      {option.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="whitespace-nowrap">{option.label}</span>
                    {option.badge && (
                      <span
                        className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                          isSelected
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                            : option.badge.toLowerCase().includes('product')
                              ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                              : option.badge.toLowerCase().includes('category')
                                ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                : 'bg-black/5 text-black/60 dark:bg-white/5 dark:text-white/60'
                        }`}
                      >
                        {option.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
