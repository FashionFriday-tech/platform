import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CategorySlug, CATEGORY_FILTERS } from "@/data/store-data";

// Define an interface for the filter sections to stop the 'any' errors
interface FilterSection {
  id: string;
  label: string;
  options: string[];
}

interface SidebarProps {
  category: CategorySlug;
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, value: string, isSingle?: boolean) => void;
  maxPrice: number;
}

export const CatalogueSidebar = ({
  category,
  activeFilters,
  onFilterChange,
  maxPrice,
}: SidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceRange: true,
  });

  // CATEGORY_FILTERS is now exported and typed
  const filters: FilterSection[] = CATEGORY_FILTERS[category] || [];

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-72 shrink-0 hidden lg:block sticky top-28 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">
          Refine
        </h2>
      </div>

      {/* Price Range Section */}
      <div className="border-b border-border py-4">
        <button
          onClick={() => toggleSection("priceRange")}
          className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2"
        >
          Budget Range
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              openSections.priceRange ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {openSections.priceRange && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 pb-2 px-2"
            >
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="500"
                value={Number(
                  (activeFilters.priceRange?.[0] || `0-${maxPrice}`).split(
                    "-"
                  )[1]
                )}
                onChange={(e) =>
                  onFilterChange("priceRange", `0-${e.target.value}`, true)
                }
                className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between mt-2 text-[10px] font-black opacity-40">
                <span>₹0</span>
                <span>
                  ₹
                  {Number(
                    (activeFilters.priceRange?.[0] || `0-${maxPrice}`).split(
                      "-"
                    )[1]
                  ).toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Sections - Explicitly type 'section' and 'opt' */}
      {filters.map((section: FilterSection) => (
        <div key={section.id} className="border-b border-border py-4">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2"
          >
            {section.label}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                openSections[section.id] ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {openSections[section.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-2 pb-4 flex flex-wrap gap-2"
              >
                {section.options.map((opt: string) => {
                  const isActive = activeFilters[section.id]?.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onFilterChange(section.id, opt)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                        isActive
                          ? "bg-foreground text-background border-foreground scale-95"
                          : "bg-background border-border hover:border-foreground/50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </aside>
  );
};
