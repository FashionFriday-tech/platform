import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "@ff/ui";
import { useState } from "react";
// Import the correct filter object from your data engine
import { CATEGORY_FILTERS } from "@/data/filter-engine"; 

interface FilterSection {
  id: string;
  label: string;
  options: string[];
}

interface SidebarProps {
  category: string; // Updated to string to match capitalized categories like "Shoes"
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
  // Initialize with all dynamic sections open for better UX
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceRange: true,
  });

  // Fetch the filters based on the capitalized category name
  const filters: FilterSection[] = CATEGORY_FILTERS[category] || [];

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-72 shrink-0 hidden lg:block sticky top-28 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pr-4">
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h2 className="text-xl font-black uppercase italic tracking-tighter">
          Refine
        </h2>
        <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">
          {category}
        </span>
      </div>

      {/* Price Range Section */}
      <div className="border-b border-border py-4">
        <button
          onClick={() => toggleSection("priceRange")}
          className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2"
        >
          Budget Range
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-300 ${
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
                // Extract current max from string "0-XXXX"
                value={Number(
                  (activeFilters.priceRange?.[0] || `0-${maxPrice}`).split("-")[1]
                )}
                onChange={(e) =>
                  onFilterChange("priceRange", `0-${e.target.value}`, true)
                }
                className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-foreground"
              />
              <div className="flex justify-between mt-2 text-[10px] font-black opacity-40">
                <span>₹0</span>
                <span>
                  ₹{Number(
                    (activeFilters.priceRange?.[0] || `0-${maxPrice}`).split("-")[1]
                  ).toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Sections (Brand, Quality, Colors, Sizes) */}
      {filters.map((section: FilterSection) => (
        <div key={section.id} className="border-b border-border py-4">
          <button
            onClick={() => toggleSection(section.id)}
            className="flex w-full items-center justify-between text-[11px] font-black uppercase tracking-widest py-2"
          >
            {section.label}
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform duration-300 ${
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
                  // Checks if the option is in the active filters array
                  const isActive = activeFilters[section.id]?.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onFilterChange(section.id, opt)}
                      className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-90 ${
                        isActive
                          ? "bg-foreground text-background border-foreground shadow-lg"
                          : "bg-background border-border hover:border-foreground/40"
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

      {/* Clear All Helper */}
      {Object.keys(activeFilters).length > 0 && (
        <button 
          onClick={() => window.location.reload()} // Quick hack to reset, or call a clear function
          className="w-full mt-8 py-4 border border-dashed border-border text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
        >
          Reset All
        </button>
      )}
    </aside>
  );
};