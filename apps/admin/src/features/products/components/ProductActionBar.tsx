import { ViewMode, ColumnId, AdvancedFilters, ProductStatus } from "../types";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Props {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (val: ViewMode) => void;
  visibleColumns: Set<ColumnId>;
  toggleColumn: (col: ColumnId) => void;
  appliedAdvancedFilters: AdvancedFilters;
  setAppliedAdvancedFilters: (val: AdvancedFilters) => void;
}

export function ProductActionBar({ 
  searchQuery, setSearchQuery, 
  viewMode, setViewMode, 
  visibleColumns, toggleColumn,
  appliedAdvancedFilters, setAppliedAdvancedFilters
}: Props) {

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AdvancedFilters>(appliedAdvancedFilters);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      setLocalFilters(appliedAdvancedFilters);
    }
  }, [isFilterOpen, appliedAdvancedFilters]);

  const toggleCategory = (cat: string) => {
    const next = new Set(localFilters.categories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setLocalFilters({ ...localFilters, categories: next });
  };

  const toggleStore = (store: string) => {
    const next = new Set(localFilters.stores);
    if (next.has(store)) next.delete(store);
    else next.add(store);
    setLocalFilters({ ...localFilters, stores: next });
  };

  const toggleStatus = (status: ProductStatus) => {
    const next = new Set(localFilters.statuses);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    setLocalFilters({ ...localFilters, statuses: next });
  };

  const applyFilters = () => {
    setAppliedAdvancedFilters(localFilters);
    setIsFilterOpen(false);
  };
  
  const clearFilters = () => {
    const empty = { categories: new Set<string>(), statuses: new Set<ProductStatus>(), stores: new Set<string>(), minPrice: "", maxPrice: "" };
    setLocalFilters(empty);
    setAppliedAdvancedFilters(empty);
    setIsFilterOpen(false);
  };

  const isAdvancedActive = appliedAdvancedFilters.categories.size > 0 || appliedAdvancedFilters.statuses.size > 0 || appliedAdvancedFilters.stores?.size > 0 || appliedAdvancedFilters.minPrice !== "" || appliedAdvancedFilters.maxPrice !== "";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
      <div className="flex items-center space-x-2">
        <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10">
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md shadow-sm transition-colors ${viewMode === "list" ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white shadow-sm' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
        </div>
        
        <div className="relative w-full max-w-xs md:w-64 hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm rounded-full focus:ring-black/20 dark:focus:ring-white/20 focus:border-black/30 dark:focus:border-white/30 block pl-10 pr-4 py-2 placeholder-black/40 dark:placeholder-white/40 outline-none"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 pb-2 md:pb-0">
        
        {/* Columns Dropdown */}
        <div className="flex items-center space-x-2 whitespace-nowrap text-sm text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-full border border-black/10 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors relative group z-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>
          <span>Columns</span>
          
          <div className="absolute top-full right-0 mt-3 w-48 bg-white/95 dark:bg-[#111111]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col p-3 z-50">
            {(["Category", "Cost Price", "OG Price", "Variants", "Sales", "Date Added", "Stock"] as ColumnId[]).map((col) => (
              <label 
                key={col}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <input 
                  type="checkbox" 
                  checked={visibleColumns.has(col)} 
                  onChange={() => toggleColumn(col)}
                  className="rounded border-black/20 dark:border-white/20 text-black dark:text-white focus:ring-black/20 dark:focus:ring-white/20"
                />
                <span>{col}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Detailed Filter Pop-up Trigger */}
        <div className="relative z-40" ref={popupRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 text-sm px-4 py-2 rounded-full border transition-all ${isAdvancedActive ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-md' : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-black/80 dark:text-white/80'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            <span>Filters</span>
            {isAdvancedActive && <span className="flex h-2 w-2 rounded-full bg-red-500 ml-1"></span>}
          </button>

          {isFilterOpen && (
            <div className="absolute top-full right-0 mt-3 w-[320px] max-h-[70vh] flex flex-col bg-white/95 dark:bg-[#111111]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
              
              <div className="p-5 flex-1 overflow-y-auto scrollbar-hide">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Detailed Filters</h3>
                
                <div className="space-y-5">
                {/* Price Range Dual Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-black/70 dark:text-white/70 block">Price Range (₹)</label>
                    <div className="flex items-center space-x-1 text-xs font-bold text-black dark:text-white bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md">
                      <span>{localFilters.minPrice || '0'}</span>
                      <span className="text-black/30 dark:text-white/30">-</span>
                      <span>{localFilters.maxPrice || '10000'}</span>
                    </div>
                  </div>
                  
                  <div className="relative h-6 flex items-center mt-2">
                    {/* Track background */}
                    <div className="absolute w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                    
                    {/* Highlight between min and max */}
                    <div 
                      className="absolute h-1.5 bg-black dark:bg-white rounded-lg"
                      style={{ 
                        left: `${(Number(localFilters.minPrice || 0) / 10000) * 100}%`,
                        right: `${100 - (Number(localFilters.maxPrice || 10000) / 10000) * 100}%` 
                      }}
                    ></div>

                    {/* Min Slider */}
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="100"
                      value={localFilters.minPrice || "0"}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), Number(localFilters.maxPrice || 10000) - 100);
                        setLocalFilters({...localFilters, minPrice: val.toString()})
                      }}
                      className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black dark:[&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:border-white z-10"
                    />

                    {/* Max Slider */}
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="100"
                      value={localFilters.maxPrice || "10000"}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), Number(localFilters.minPrice || 0) + 100);
                        setLocalFilters({...localFilters, maxPrice: val.toString()})
                      }}
                      className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black dark:[&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:border-white z-20"
                    />
                  </div>

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
                      <label key={cat} className="flex items-center space-x-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${localFilters.categories.has(cat) ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/20 dark:border-white/20 group-hover:border-black/60 dark:group-hover:border-white/60'}`}>
                           {localFilters.categories.has(cat) && <svg className="w-2.5 h-2.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm text-black/80 dark:text-white/80 select-none">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Store */}
                <div>
                  <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-2">Store</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Main Store", "Odama Store"].map(store => (
                      <label key={store} className="flex items-center space-x-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleStore(store); }}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${localFilters.stores?.has(store) ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/20 dark:border-white/20 group-hover:border-black/60 dark:group-hover:border-white/60'}`}>
                           {localFilters.stores?.has(store) && <svg className="w-2.5 h-2.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-sm text-black/80 dark:text-white/80 select-none">{store}</span>
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
            </div>

              {/* Actions - Sticky at bottom */}
              <div className="p-5 bg-white/5 dark:bg-black/5 border-t border-black/10 dark:border-white/10 flex items-center space-x-3 backdrop-blur-md">
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

        <Link 
          href="/products/add"
          className="flex items-center space-x-2 whitespace-nowrap text-sm bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full font-medium hover:bg-black/90 dark:hover:bg-white/90 transition-colors shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Add new product</span>
        </Link>
      </div>
    </div>
  );
}
