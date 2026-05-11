'use client';

import { useState } from 'react';

import { ChevronDownIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'motion/react';

// Import the correct filter object from your data engine
import { CATEGORY_FILTERS } from '@/data/filter-engine';

interface FilterSection {
  id: string;
  label: string;
  options: string[];
}

interface SidebarProps {
  category: string;
  activeFilters: Record<string, string[]>;
  onFilterChange: (key: string, value: string, isSingle?: boolean) => void;
  maxPrice: number;
}

export const CatalogueSidebar = ({
  category,
  activeFilters, // Default value to prevent undefined errors
  onFilterChange,
  maxPrice,
}: SidebarProps) => {
  // Initialize with all dynamic sections open for better UX
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    priceRange: true,
  });

  // Fetch the filters based on the capitalized category name
  const filters: FilterSection[] = Object.prototype.hasOwnProperty.call(CATEGORY_FILTERS, category)
    ? CATEGORY_FILTERS[category]
    : [];

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: Object.prototype.hasOwnProperty.call(prev, id) ? !prev[id] : true,
    }));
  };

  // Helper to safely get the current max price from range string
  const getCurrentPriceValue = () => {
    const range = activeFilters?.priceRange?.[0] || `0-${maxPrice}`;
    return Number(range.split('-')[1] || maxPrice);
  };

  return (
    <aside className="no-scrollbar sticky top-28 hidden h-[calc(100vh-120px)] w-72 shrink-0 overflow-y-auto pr-4 lg:block">
      <div className="border-border mb-8 flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-black tracking-tighter uppercase italic">Refine</h2>
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-30">
          {category}
        </span>
      </div>

      {/* Price Range Section */}
      <div className="border-border border-b py-4">
        <button
          onClick={() => {
            toggleSection('priceRange');
          }}
          className="flex w-full items-center justify-between py-2 text-[11px] font-black tracking-widest uppercase"
        >
          Budget Range
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-300 ${
              openSections.priceRange ? 'rotate-180' : ''
            }`}
          />
        </button>
        <AnimatePresence>
          {openSections.priceRange && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-2 pt-4 pb-2"
            >
              <input
                type="range"
                min="0"
                max={maxPrice}
                step="500"
                value={getCurrentPriceValue()}
                onChange={(e) => {
                  onFilterChange('priceRange', `0-${e.target.value}`, true);
                }}
                className="bg-border accent-foreground h-1 w-full cursor-pointer appearance-none rounded-full"
              />
              <div className="mt-2 flex justify-between text-[10px] font-black opacity-40">
                <span>₹0</span>
                <span>₹{getCurrentPriceValue().toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Sections (Brand, Quality, Colors, Sizes) */}
      {filters.map((section: FilterSection) => (
        <div key={section.id} className="border-border border-b py-4">
          <button
            onClick={() => {
              toggleSection(section.id);
            }}
            className="flex w-full items-center justify-between py-2 text-[11px] font-black tracking-widest uppercase"
          >
            {section.label}
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-300 ${
                openSections[section.id] ? 'rotate-180' : ''
              }`}
            />
          </button>
          <AnimatePresence>
            {openSections[section.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden pt-2 pb-4"
              >
                {section.options.map((opt: string) => {
                  // Safe check for includes with optional chaining
                  const isActive = activeFilters?.[section.id]?.includes(opt) ?? false;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        onFilterChange(section.id, opt);
                      }}
                      className={`rounded-full border px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-200 active:scale-90 ${
                        isActive
                          ? 'bg-foreground text-background border-foreground shadow-lg'
                          : 'bg-background border-border hover:border-foreground/40'
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
          onClick={() => {
            window.location.href = window.location.pathname; // Proper way to reset filters via URL
          }}
          className="border-border mt-8 w-full border border-dashed py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
        >
          Reset All
        </button>
      )}
    </aside>
  );
};
