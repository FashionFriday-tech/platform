import { motion } from "framer-motion";
import { SuggestionTag } from "./SuggestionTag";
import { HighlightText } from "./HighlightText";

export const QuickDiscovery = ({ items, query, setQuery, onSave }: any) => {
  if (items.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">
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
            className="flex items-center gap-4 py-2 border-b border-white/5 group hover:border-white/20 transition-colors text-left"
          >
            <span className="text-lg font-mono uppercase flex-1">
              <HighlightText text={item.label} highlight={query} />
            </span>
            <SuggestionTag type={item.type} />
          </button>
        ))}
      </div>
    </motion.div>
  );
};
