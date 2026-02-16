import { motion } from 'framer-motion';
import { SuggestionTag } from './SuggestionTag';
import { HighlightText } from './HighlightText';

export const QuickDiscovery = ({ items, query, setQuery, onSave }: any) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="mb-4 text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">
        Quick Discovery
      </h4>
      <div className="flex flex-col">
        {items.map((item: any) => (
          <button
            key={item.label}
            onClick={() => {
              setQuery(item.label);
              onSave(item.label);
            }}
            className="group flex items-center gap-4 border-b border-white/5 py-2 text-left transition-colors hover:border-white/20"
          >
            <span className="flex-1 font-mono text-lg uppercase">
              <HighlightText text={item.label} highlight={query} />
            </span>
            <SuggestionTag type={item.type} />
          </button>
        ))}
      </div>
    </motion.div>
  );
};
