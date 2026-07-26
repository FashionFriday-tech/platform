'use client';

import { motion } from 'motion/react';

import { HighlightText } from './highlight-text';

interface RecentSearchesProps {
  items: string[];
  query: string;
  onSelect: (val: string) => void;
  onRemove: (val: string) => void;
  onClearAll: () => void;
}

export const RecentSearches = ({
  items,
  query,
  onSelect,
  onRemove,
  onClearAll,
}: RecentSearchesProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-foreground/40 text-[10px] font-bold tracking-[0.25em] uppercase">
          Recent Searches
        </h4>
        <button
          onClick={onClearAll}
          className="text-foreground/40 hover:text-foreground text-[10px] font-bold tracking-wider uppercase transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item}
            className="group border-foreground/10 hover:border-foreground/30 flex items-center justify-between border-b py-3 text-left transition-colors"
          >
            <button
              onClick={() => {
                onSelect(item);
              }}
              className="flex-1 text-left"
            >
              <span className="text-foreground/80 group-hover:text-foreground font-mono text-sm uppercase transition-colors sm:text-base">
                <HighlightText text={item} highlight={query} />
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item);
              }}
              className="text-foreground/30 hover:text-foreground p-1 transition-colors"
              title="Remove"
              aria-label="Remove search history item"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
