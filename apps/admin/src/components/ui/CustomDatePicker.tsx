'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'motion/react';

interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD' or ''
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Filter by date',
  className = '',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial month to display from value or default to current date
  const [viewDate, setViewDate] = useState<Date>(() => {
    if (value) {
      const parts = value.split('-').map(Number);
      if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, 1);
      }
    }
    return new Date();
  });

  // Sync viewDate when value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split('-').map(Number);
      if (parts.length === 3) {
        setViewDate(new Date(parts[0], parts[1] - 1, 1));
      }
    }
  }, [value]);

  // Click outside listener
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

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const jumpToToday = () => {
    const now = new Date();
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const setYesterday = () => {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const clearDate = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Calendar cells computation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    const todayStr = (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    })();

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, prevDay);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
      days.push({
        day: prevDay,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    // Next month padding (to fill full 6-row or 5-row grid)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const nextDate = new Date(currentYear, currentMonth + 1, day);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
      days.push({
        day,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === value,
      });
    }

    return days;
  }, [currentYear, currentMonth, value]);

  // Display label for selected date
  const displayLabel = useMemo(() => {
    if (!value) {
      return placeholder;
    }
    const parts = value.split('-').map(Number);
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return value;
  }, [value, placeholder]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-between gap-2.5 rounded-xl border border-black/5 bg-[#f8f9fa] px-3 py-2 text-sm font-medium transition-all outline-none hover:bg-black/5 focus:border-black/30 dark:border-white/5 dark:bg-[#1a1a1a] dark:hover:bg-white/5 dark:focus:border-white/30 ${
          value ? 'text-black dark:text-white' : 'text-black/60 dark:text-white/60'
        }`}
      >
        <div className="flex items-center gap-2">
          {/* Calendar Icon */}
          <svg
            className="h-4 w-4 shrink-0 text-black/50 dark:text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="truncate">{displayLabel}</span>
        </div>

        <div className="flex items-center gap-1">
          {value ? (
            <span
              role="button"
              tabIndex={0}
              onClick={clearDate}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  clearDate();
                }
              }}
              title="Clear date"
              className="flex h-4 w-4 items-center justify-center rounded-full text-black/40 hover:bg-black/10 hover:text-black dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white"
            >
              ×
            </span>
          ) : (
            <svg
              className={`h-3.5 w-3.5 text-black/40 transition-transform dark:text-white/40 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </button>

      {/* Floating Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-72 rounded-2xl border border-black/10 bg-white p-4 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#161616]"
          >
            {/* Calendar Header Navigation */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                title="Previous Month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="text-sm font-bold text-black dark:text-white">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </div>

              <button
                type="button"
                onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-black/60 transition-colors hover:bg-black/5 hover:text-black dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                title="Next Month"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-3 flex items-center justify-between gap-1.5 border-b border-black/5 pb-2.5 dark:border-white/5">
              <button
                type="button"
                onClick={jumpToToday}
                className="flex-1 rounded-lg bg-black/5 py-1 text-center text-xs font-semibold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Today
              </button>
              <button
                type="button"
                onClick={setYesterday}
                className="flex-1 rounded-lg bg-black/5 py-1 text-center text-xs font-semibold text-black transition-colors hover:bg-black/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Yesterday
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    clearDate();
                  }}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Days of Week Header */}
            <div className="mb-1.5 grid grid-cols-7 text-center">
              {DAYS_OF_WEEK.map((d) => (
                <span
                  key={d}
                  className="text-[11px] font-bold tracking-wider text-black/40 uppercase dark:text-white/40"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((cell) => {
                let cellClass =
                  'h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-medium transition-all ';

                if (cell.isSelected) {
                  cellClass +=
                    'bg-black text-white font-bold shadow-md dark:bg-white dark:text-black scale-105';
                } else if (cell.isToday) {
                  cellClass +=
                    'border border-black/30 font-bold text-black dark:border-white/30 dark:text-white hover:bg-black/5 dark:hover:bg-white/5';
                } else if (cell.isCurrentMonth) {
                  cellClass += 'text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5';
                } else {
                  cellClass +=
                    'text-black/20 dark:text-white/20 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]';
                }

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() => {
                      onChange(cell.dateStr);
                      setIsOpen(false);
                    }}
                    className={cellClass}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
