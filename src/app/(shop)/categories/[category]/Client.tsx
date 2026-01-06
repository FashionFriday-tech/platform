"use client";

import { useState, useMemo } from "react";
import {
  CategorySlug,
  MOCK_PRODUCTS,
  CATEGORY_FILTERS,
  filterProducts,
  FilterDefinition,
} from "@/data/store-data";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Header } from "@/components/layout/Header";

// --- Filter Accordion Component (Unchanged) ---
function FilterSection({
  section,
  selectedOptions,
  onChange,
}: {
  section: FilterDefinition;
  selectedOptions: string[];
  onChange: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-neutral-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-bold text-black uppercase tracking-wider"
      >
        {section.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {section.options.map((option) => {
            const isChecked = selectedOptions.includes(option);
            return (
              <label key={option} className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-2 border-neutral-300 text-black focus:ring-black accent-black bg-white rounded-none"
                  checked={isChecked}
                  onChange={() => onChange(option)}
                />
                <span className={`ml-3 text-sm transition-colors ${isChecked ? "text-black font-medium" : "text-neutral-600 group-hover:text-black"}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Client Component ---
interface CategoryClientProps {
  category: CategorySlug;
}

export default function Client({ category }: CategoryClientProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // 1. Get products for this category initially
  const initialCategoryProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === category
  );

  // 2. Get available filters
  const availableFilters = CATEGORY_FILTERS[category] || [];

  // 3. Apply filters
  const filteredProducts = useMemo(() => {
    return filterProducts(initialCategoryProducts, activeFilters);
  }, [initialCategoryProducts, activeFilters]);

  const handleFilterChange = (filterId: string, option: string) => {
    setActiveFilters((prev) => {
      const currentOptions = prev[filterId] || [];
      const isSelected = currentOptions.includes(option);
      return isSelected
        ? { ...prev, [filterId]: currentOptions.filter((o) => o !== option) }
        : { ...prev, [filterId]: [...currentOptions, option] };
    });
  };

  const clearFilters = () => setActiveFilters({});
  const activeFilterCount = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-tighter">
            {category}
          </h1>

          <div className="flex items-center gap-4">
             {/* Hidden on mobile, SEO benefit: keep sort options visible in DOM if possible */}
            <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer hidden md:block">
              <option>Sort: Newest</option>
              <option>Sort: Price Low-High</option>
              <option>Sort: Price High-Low</option>
            </select>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-bold uppercase border-2 border-black px-4 py-2 rounded-4xl"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters{" "}
              {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        <main className="max-w-7xl mb-20 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start gap-x-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold uppercase">Filters</h3>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-neutral-500 hover:text-black underline">
                    Clear All
                  </button>
                )}
              </div>
              {availableFilters.map((section) => (
                <FilterSection
                  key={section.id}
                  section={section}
                  selectedOptions={activeFilters[section.id] || []}
                  onChange={(option) => handleFilterChange(section.id as string, option)}
                />
              ))}
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center text-neutral-500">
                  So sorry, no products match those filters.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-9 gap-x-3 xl:gap-x-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group">
                      <div className="w-full aspect-4/5 mb-4 relative overflow-hidden rounded-4xl bg-neutral-100">
                        {/* SEO TIP: Always include width/height on images or use Next/Image to prevent layout shift */}
                        <img
                          src={product.image || "/images/placeholders/2.png"}
                          alt={`${product.brand} ${product.name} - ${product.category}`} // SEO TIP: Descriptive Alt Text
                          loading="lazy"
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = "/images/placeholders/2.png"; }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-neutral-500 font-medium uppercase">{product.brand}</p>
                        {/* SEO TIP: Use h2 for product titles in a list, h1 is reserved for the page title */}
                        <h2 className="text-sm font-bold text-black uppercase tracking-wide truncate">
                          {product.name}
                        </h2>
                        <p className="text-sm text-neutral-900">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Filter Slide-over */}
        {isMobileFilterOpen && (
           <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold uppercase">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              {availableFilters.map((section) => (
                <FilterSection
                  key={section.id}
                  section={section}
                  selectedOptions={activeFilters[section.id] || []}
                  onChange={(option) => handleFilterChange(section.id as string, option)}
                />
              ))}
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full mt-8 bg-black text-white font-bold uppercase tracking-wider py-4">
                View Results
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}