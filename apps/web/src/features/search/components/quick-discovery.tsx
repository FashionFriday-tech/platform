'use client';

import { motion } from 'motion/react';

import { HighlightText } from './highlight-text';

export interface DiscoveryItem {
  label: string;
  type: string;
}

interface QuickDiscoveryProps {
  items: DiscoveryItem[];
  query: string;
  onSelect: (val: string) => void;
}

export const QuickDiscovery = ({ items, query, onSelect }: QuickDiscoveryProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
        Matching Categories & Brands
      </h4>
      <div className="flex flex-col">
        {items.map((item) => (
          <button
            key={`${item.type}-${item.label}`}
            onClick={() => {
              onSelect(item.label);
            }}
            className="group border-foreground/10 hover:border-foreground/30 flex items-center justify-between gap-4 border-b py-3 text-left transition-colors"
          >
            <span className="group-hover:text-brand font-mono text-base uppercase transition-colors sm:text-lg">
              <HighlightText text={item.label} highlight={query} />
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 transition-opacity group-hover:opacity-80">
              {item.type}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
