import { StatusFilter, AdvancedFilters, ProductStatus } from "../types";
import { useState, useRef, useEffect } from "react";

interface Props {
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  priceFilter: string;
  setPriceFilter: (val: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (val: StatusFilter) => void;
  storeFilter: string;
  setStoreFilter: (val: string) => void;
  appliedAdvancedFilters: AdvancedFilters;
  setAppliedAdvancedFilters: (val: AdvancedFilters) => void;
}

export function ProductFilters({ 
  categoryFilter, setCategoryFilter, 
  priceFilter, setPriceFilter, 
  statusFilter, setStatusFilter, 
  storeFilter, setStoreFilter,
  appliedAdvancedFilters, setAppliedAdvancedFilters
}: Props) {
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for the popup so it doesn't filter while typing
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(appliedAdvancedFilters);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync local state when opened
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(appliedAdvancedFilters);
    }
  }, [isOpen, appliedAdvancedFilters]);

  const toggleCategory = (cat: string) => {
    const next = new Set(localFilters.categories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setLocalFilters({ ...localFilters, categories: next });
  };

  const toggleStatus = (status: ProductStatus) => {
    const next = new Set(localFilters.statuses);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    setLocalFilters({ ...localFilters, statuses: next });
  };

  const applyFilters = () => {
    setAppliedAdvancedFilters(localFilters);
    setIsOpen(false);
  };
  
  const clearFilters = () => {
    const empty = { categories: new Set<string>(), statuses: new Set<ProductStatus>(), minPrice: "", maxPrice: "" };
    setLocalFilters(empty);
    setAppliedAdvancedFilters(empty);
    setIsOpen(false);
  };

  const isAdvancedActive = appliedAdvancedFilters.categories.size > 0 || appliedAdvancedFilters.statuses.size > 0 || appliedAdvancedFilters.minPrice !== "" || appliedAdvancedFilters.maxPrice !== "";

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <FilterDropdown 
        label="Category" 
        value={categoryFilter} 
        options={["All Categories", "Outerwear", "Footwear", "Shirts", "Sneakers"]} 
        onChange={setCategoryFilter} 
      />
      <FilterDropdown 
        label="Price" 
        value={priceFilter} 
        options={["All Prices", "₹0 - ₹50", "₹50 - ₹100", "₹100+"]} 
        onChange={setPriceFilter} 
      />
      <FilterDropdown 
        label="Status" 
        value={statusFilter} 
        options={["All Status", "Active", "Inactive", "Draft"]} 
        onChange={setStatusFilter} 
      />
      <FilterDropdown 
        label="Store" 
        value={storeFilter} 
        options={["All Stores", "Odama Store", "Main Store"]} 
        onChange={setStoreFilter} 
      />

      <div className="relative ml-auto" ref={popupRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-all ${isAdvancedActive ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          <span>Detailed Filter</span>
          {isAdvancedActive && <span className="flex h-2 w-2 rounded-full bg-red-500 ml-1"></span>}
        </button>

        {/* Detailed Filter Pop-up */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-3 w-[320px] bg-white/95 dark:bg-[#111111]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl z-50 p-5 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Advanced Filters</h3>
            
            <div className="space-y-5">
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-black/70 dark:text-white/70 block">Max Price (₹)</label>
                  <span className="text-xs font-bold text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                    ₹{localFilters.maxPrice || '10000'}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={localFilters.maxPrice || "10000"}
                  onChange={(e) => setLocalFilters({...localFilters, maxPrice: e.target.value, minPrice: "0"})}
                  className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
                <div className="flex justify-between text-[10px] text-black/40 dark:text-white/40 mt-1 px-1">
                  <span>0</span>
                  <span>10K</span>
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-2">Categories</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Outerwear", "Footwear", "Shirts", "Sneakers"].map(cat => (
                    <label key={cat} className="flex items-center space-x-2 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${localFilters.categories.has(cat) ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/20 dark:border-white/20 group-hover:border-black/40'}`}>
                         {localFilters.categories.has(cat) && <svg className="w-2.5 h-2.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-sm text-black/80 dark:text-white/80 select-none">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {(["Active", "Inactive", "Draft"] as ProductStatus[]).map(status => (
                    <div 
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${localFilters.statuses.has(status) ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10'}`}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-black/10 dark:border-white/10">
              <button 
                onClick={clearFilters}
                className="flex-1 px-4 py-2 text-sm font-medium text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Clear
              </button>
              <button 
                onClick={applyFilters}
                className="flex-1 px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-md hover:bg-black/90 dark:hover:bg-white/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterDropdown({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={ref}>
      <span className="text-sm text-black/50 dark:text-white/50 mr-2">{label}:</span>
      <div 
        className="flex items-center space-x-2 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-black dark:text-white select-none whitespace-nowrap">{value}</span>
        <svg className={`w-3 h-3 text-black/40 dark:text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-10 mt-2 min-w-[160px] bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <div 
              key={opt} 
              className={`px-4 py-2 text-sm cursor-pointer transition-colors whitespace-nowrap ${value === opt ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white font-medium' : 'text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
