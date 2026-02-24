'use client';

import { ArrowUpRightIcon, CloseIcon } from '@ff/ui';
import { motion } from 'framer-motion';

import { HighlightText } from './HighlightText';

// --- 1. DEFINE PROPS INTERFACE ---
interface RecentSearchesProps {
  items: string[];
  query: string;
  setQuery: (query: string) => void;
  onRemove: (item: string) => void;
}

export const RecentSearches = ({ items, query, setQuery, onRemove }: RecentSearchesProps) => {
  // 2. Safely check length now that items is string[]
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
        Recent Searches
      </h4>
      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item}
            className="group flex items-center justify-between border-b border-white/5 transition-colors hover:border-white/10"
          >
            <button
              onClick={() => {
                setQuery(item);
              }}
              className="flex-1 py-2 text-left font-mono text-lg uppercase"
            >
              <HighlightText text={item} highlight={query} />
            </button>
            <div className="text-foreground/20 p-2 text-xl">
              {query.length > 0 ? (
                <button
                  onClick={() => {
                    setQuery(item);
                  }}
                  aria-label="Set query"
                >
                  <ArrowUpRightIcon />
                </button>
              ) : (
                <button
                  onClick={() => {
                    onRemove(item);
                  }}
                  aria-label="Remove search"
                >
                  <CloseIcon className="transition-colors hover:text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
