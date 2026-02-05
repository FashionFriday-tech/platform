import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { GoArrowUpRight } from "react-icons/go";
import { HighlightText } from "./HighlightText";

export const RecentSearches = ({ items, query, setQuery, onRemove }: any) => {
  if (items.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-4">
        Recent Searches
      </h4>
      <div className="flex flex-col">
        {items.map((item: string) => (
          <div
            key={item}
            className="group flex items-center justify-between border-b border-white/5 hover:border-white/10 transition-colors"
          >
            <button
              onClick={() => setQuery(item)}
              className="text-lg font-mono uppercase text-left flex-1 py-2"
            >
              <HighlightText text={item} highlight={query} />
            </button>
            <button className="p-2 text-foreground/20 text-xl">
              {query.length > 0 ? (
                <GoArrowUpRight onClick={() => setQuery(item)} />
              ) : (
                <IoMdClose
                  onClick={() => onRemove(item)}
                  className="hover:text-red-500 transition-colors"
                />
              )}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
