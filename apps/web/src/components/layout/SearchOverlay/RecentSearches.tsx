import { motion } from 'framer-motion';
import { CloseIcon, ArrowUpRightIcon } from '@ff/ui';
import { HighlightText } from './HighlightText';

export const RecentSearches = ({ items, query, setQuery, onRemove }: any) => {
  if (items.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
        Recent Searches
      </h4>
      <div className="flex flex-col">
        {items.map((item: string) => (
          <div
            key={item}
            className="group flex items-center justify-between border-b border-white/5 transition-colors hover:border-white/10"
          >
            <button
              onClick={() => setQuery(item)}
              className="flex-1 py-2 text-left font-mono text-lg uppercase"
            >
              <HighlightText text={item} highlight={query} />
            </button>
            <button className="text-foreground/20 p-2 text-xl">
              {query.length > 0 ? (
                <ArrowUpRightIcon onClick={() => setQuery(item)} />
              ) : (
                <CloseIcon
                  onClick={() => onRemove(item)}
                  className="transition-colors hover:text-red-500"
                />
              )}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
