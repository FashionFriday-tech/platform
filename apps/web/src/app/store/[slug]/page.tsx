'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import {
  CategorySlug,
  MOCK_PRODUCTS,
  CATEGORY_FILTERS,
  filterProducts,
  FilterDefinition,
} from '@/data/store-data';
import { ChevronDownIcon, SlidersIcon, CloseIcon } from '@ff/ui';
import { Header } from '@/components/layout/Header';

// --- Filter Accordion Component ---
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
        className="flex w-full items-center justify-between text-sm font-bold tracking-wider text-black uppercase"
      >
        {section.label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {section.options.map((option) => {
            const isChecked = selectedOptions.includes(option);
            return (
              <label key={option} className="group flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded-none border-2 border-neutral-300 bg-white text-black accent-black focus:ring-black"
                  checked={isChecked}
                  onChange={() => onChange(option)}
                />
                <span
                  className={`ml-3 text-sm transition-colors ${
                    isChecked ? 'font-medium text-black' : 'text-neutral-600 group-hover:text-black'
                  }`}
                >
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

// --- Main Page Component ---
export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as CategorySlug;
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // State for active filters: { 'brand': ['Nike', 'Adidas'], 'size': ['EU 42'] }
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Validate Category
  const validCategories: CategorySlug[] = [
    'sneakers',
    'watches',
    'cloths',
    'slippers',
    'accessories',
  ];
  if (!validCategories.includes(slug)) {
    notFound();
  }

  // 1. Get products for this category initially
  const initialCategoryProducts = MOCK_PRODUCTS.filter((p) => p.category === slug);

  // 2. Get available filters for this category
  const availableFilters = CATEGORY_FILTERS[slug] || [];

  // 3. Apply filters using useMemo for performance
  const filteredProducts = useMemo(() => {
    return filterProducts(initialCategoryProducts, activeFilters);
  }, [initialCategoryProducts, activeFilters]);

  // Handle checkbox Toggle
  const handleFilterChange = (filterId: string, option: string) => {
    setActiveFilters((prev) => {
      const currentOptions = prev[filterId] || [];
      const isSelected = currentOptions.includes(option);

      if (isSelected) {
        // Remove option
        return {
          ...prev,
          [filterId]: currentOptions.filter((o) => o !== option),
        };
      } else {
        // Add option
        return {
          ...prev,
          [filterId]: [...currentOptions, option],
        };
      }
    });
  };

  const clearFilters = () => setActiveFilters({});
  const activeFilterCount = Object.values(activeFilters).reduce(
    (acc, curr) => acc + curr.length,
    0,
  );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase">{slug}</h1>

          <div className="flex items-center gap-4">
            {/* Sorting (Simplified for demo) */}
            <select className="hidden cursor-pointer border-none bg-transparent text-sm font-medium focus:ring-0 md:block">
              <option>Sort: Newest</option>
              <option>Sort: Price Low-High</option>
              <option>Sort: Price High-Low</option>
            </select>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-4xl border-2 border-black px-4 py-2 text-sm font-bold uppercase lg:hidden"
            >
              <SlidersIcon className="h-4 w-4" /> Filters{' '}
              {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </div>

        <main className="mx-auto mb-20 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-x-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="sticky top-24 hidden w-64 shrink-0 lg:block">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase">Filters</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-neutral-500 underline hover:text-black"
                  >
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
                <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 xl:gap-x-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="group">
                      {/* Product Image */}
                      <div className="relative mb-4 aspect-3/4 w-full overflow-hidden rounded-4xl bg-neutral-100">
                        <img
                          src={product.image || '/images/placeholders/2.png'}
                          alt={product.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholders/2.png';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-neutral-500 uppercase">
                          {product.brand}
                        </p>
                        <h3 className="truncate text-sm font-bold tracking-wide text-black uppercase">
                          {product.name}
                        </h3>
                        <p className="text-sm text-neutral-900">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Mobile Filter Slide-over (Simplified) */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-xs overflow-y-auto bg-white p-6 shadow-xl">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              {availableFilters.map((section) => (
                <FilterSection
                  key={section.id}
                  section={section}
                  selectedOptions={activeFilters[section.id] || []}
                  onChange={(option) => handleFilterChange(section.id as string, option)}
                />
              ))}
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="mt-8 w-full bg-black py-4 font-bold tracking-wider text-white uppercase"
              >
                View Results
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
