import { Product, ColumnId } from "../types";

interface Props {
  products: Product[];
  isLoading: boolean;
  onToggleStatus: (id: string) => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onToggleAllSelection: (ids: string[]) => void;
  sortOption: import("../types").SortOption;
  setSortOption: (val: import("../types").SortOption) => void;
  visibleColumns: Set<ColumnId>;
}

export function ProductTable({ products, isLoading, onToggleStatus, selectedIds, onToggleSelection, onToggleAllSelection, sortOption, setSortOption, visibleColumns }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-black/50 dark:text-white/50 border border-dashed border-black/10 dark:border-white/10 rounded-2xl">
        No products found.
      </div>
    );
  }

  const allSelected = products.length > 0 && selectedIds.size === products.length;

  return (
    <div className="w-full h-full overflow-auto pb-4 scrollbar-hide relative border border-black/5 dark:border-white/5 rounded-xl">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead className="sticky top-0 z-30 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md">
          <tr className="border-b border-black/10 dark:border-white/10 text-xs font-medium text-black/50 dark:text-white/50 whitespace-nowrap">
            {/* Sticky Left: Select & Product Info */}
            <th className="sticky left-0 top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md py-4 px-4 border-r border-black/5 dark:border-white/5 shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_12px_rgba(255,255,255,0.02)]">
              <div className="flex items-center space-x-4">
                <div 
                  onClick={() => onToggleAllSelection(products.map(p => p.id))}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${allSelected ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/20 dark:border-white/20 hover:border-black/50 dark:hover:border-white/50'}`}
                >
                  {allSelected && <svg className="w-3.5 h-3.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div 
                  className="flex items-center space-x-1 cursor-pointer hover:text-black dark:hover:text-white"
                  onClick={() => setSortOption(sortOption === "Name: A to Z" ? "Name: Z to A" : "Name: A to Z")}
                >
                  <span className={sortOption.includes("Name") ? "text-black dark:text-white" : ""}>Product info</span>
                  <svg className={`w-3 h-3 transition-transform ${sortOption === "Name: Z to A" ? "rotate-180 text-black dark:text-white" : sortOption === "Name: A to Z" ? "text-black dark:text-white" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </th>
            
            {visibleColumns.has("Category") && <th className="py-4 px-4 font-medium">Category</th>}
            
            {visibleColumns.has("Cost Price") && <th className="py-4 px-4 font-medium">Cost Price</th>}
            {visibleColumns.has("OG Price") && <th className="py-4 px-4 font-medium">OG Price</th>}
            
            {/* Always show Selling Price */}
            <th 
              className="py-4 px-4 font-medium cursor-pointer hover:text-black dark:hover:text-white"
              onClick={() => setSortOption(sortOption === "Price: Low to High" ? "Price: High to Low" : "Price: Low to High")}
            >
              <div className="flex items-center space-x-1">
                <span className={sortOption.includes("Price") ? "text-black dark:text-white" : ""}>Selling Price</span>
                <svg className={`w-3 h-3 transition-transform ${sortOption === "Price: High to Low" ? "rotate-180 text-black dark:text-white" : sortOption === "Price: Low to High" ? "text-black dark:text-white" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </th>

            {visibleColumns.has("Variants") && <th className="py-4 px-4 font-medium">Variants</th>}
            {visibleColumns.has("Sales") && <th className="py-4 px-4 font-medium">Sales</th>}
            {visibleColumns.has("Date Added") && <th className="py-4 px-4 font-medium">Date Added</th>}
            
            {/* Always show Status */}
            <th className="py-4 px-4 font-medium">Status</th>
            
            {visibleColumns.has("Stock") && <th className="py-4 px-4 font-medium">Stock</th>}
            
            {/* Sticky Right: Activation */}
            <th className="sticky right-0 top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md py-4 px-6 font-medium text-right border-l border-black/5 dark:border-white/5 shadow-[-4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-4px_0_12px_rgba(255,255,255,0.02)]">
              Active
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5 dark:divide-white/5">
          {products.map((product) => {
            const isSelected = selectedIds.has(product.id);
            return (
              <tr key={product.id} className={`group transition-colors whitespace-nowrap ${isSelected ? 'bg-black/[0.03] dark:bg-white/[0.05]' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}>
                
                {/* Sticky Left: Select & Product Info */}
                <td className={`sticky left-0 z-10 py-4 px-4 border-r border-black/5 dark:border-white/5 shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_12px_rgba(255,255,255,0.02)] transition-colors ${isSelected ? 'bg-[#f4f4f4] dark:bg-[#141414]' : 'bg-white dark:bg-[#0a0a0a] group-hover:bg-[#fafafa] dark:group-hover:bg-[#111111]'}`}>
                  <div className="flex items-center space-x-4">
                    <div 
                      onClick={() => onToggleSelection(product.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0 ${isSelected ? 'bg-black dark:bg-white border-black dark:border-white' : 'border-black/20 dark:border-white/20 group-hover:border-black/50 dark:group-hover:border-white/50'}`}
                    >
                      {isSelected && <svg className="w-3.5 h-3.5 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-black/5 dark:bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-black/5 dark:border-white/5">
                         {product.imageUrl ? (
                           <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-xs font-bold text-black/30 dark:text-white/30">IMG</span>
                         )}
                      </div>
                      <div className="min-w-[180px]">
                        <p className="text-sm font-medium text-black/90 dark:text-white/90 truncate max-w-[220px]" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-xs text-black/40 dark:text-white/40 mt-1">ID: {product.sku}</p>
                      </div>
                    </div>
                  </div>
                </td>

                {visibleColumns.has("Category") && (
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-black/5 dark:bg-white/5 text-black/70 dark:text-white/70">
                      {product.category}
                    </span>
                  </td>
                )}

                {visibleColumns.has("Cost Price") && (
                  <td className="py-4 px-4 text-sm text-black/70 dark:text-white/70">
                    ₹{product.costPrice.toFixed(2)}
                  </td>
                )}

                {visibleColumns.has("OG Price") && (
                  <td className="py-4 px-4 text-sm text-black/70 dark:text-white/70">
                    ₹{product.originalPrice.toFixed(2)}
                  </td>
                )}

                <td className="py-4 px-4 text-sm font-medium">
                  {product.sellingPrice < product.originalPrice ? (
                    <span className="text-red-500 font-bold">₹{product.sellingPrice.toFixed(2)}</span>
                  ) : (
                    <span className="text-black dark:text-white">₹{product.sellingPrice.toFixed(2)}</span>
                  )}
                </td>

                {visibleColumns.has("Variants") && (
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      {product.variants?.map(v => (
                        <span key={v} className="text-[10px] px-1.5 py-0.5 border border-black/10 dark:border-white/10 rounded text-black/60 dark:text-white/60 whitespace-nowrap">
                          {v}
                        </span>
                      )) || <span className="text-xs text-black/30 dark:text-white/30">-</span>}
                    </div>
                  </td>
                )}

                {visibleColumns.has("Sales") && (
                  <td className="py-4 px-4 text-sm font-medium text-black/80 dark:text-white/80">
                    {product.sales ? product.sales.toLocaleString() : '0'}
                  </td>
                )}

                {visibleColumns.has("Date Added") && (
                  <td className="py-4 px-4 text-sm text-black/60 dark:text-white/60">
                    {product.dateAdded || 'N/A'}
                  </td>
                )}

                <td className="py-4 px-4 text-sm">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${product.status === "Active" ? 'bg-black/5 border-black/10 text-black dark:bg-white/10 dark:border-white/20 dark:text-white' : product.status === "Draft" ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-500' : 'bg-black/5 border-transparent text-black/50 dark:bg-white/5 dark:text-white/50'}`}>
                    {product.status}
                  </span>
                </td>

                {visibleColumns.has("Stock") && (
                  <td className="py-4 px-4">
                    <div className="w-24 flex flex-col justify-center">
                      <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-1">
                        <div 
                          className={`h-full rounded-full ${product.stock > 700 ? 'bg-black dark:bg-white' : 'bg-black/50 dark:bg-white/50'}`}
                          style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-black/40 dark:text-white/40 text-right">{product.stock}/{product.maxStock}</p>
                    </div>
                  </td>
                )}

                {/* Sticky Right: Activation */}
                <td className={`sticky right-0 z-10 py-4 px-6 text-right border-l border-black/5 dark:border-white/5 shadow-[-4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[-4px_0_12px_rgba(255,255,255,0.02)] transition-colors ${isSelected ? 'bg-[#f4f4f4] dark:bg-[#141414]' : 'bg-white dark:bg-[#0a0a0a] group-hover:bg-[#fafafa] dark:group-hover:bg-[#111111]'}`}>
                  <button 
                    onClick={() => product.status !== "Draft" && onToggleStatus(product.id)}
                    disabled={product.status === "Draft"}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.status === "Active" ? 'bg-black/90 dark:bg-white/90' : 'bg-black/10 dark:bg-white/10 border border-black/20 dark:border-white/20'} ${product.status === "Draft" ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${product.status === "Active" ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-black/50 dark:bg-white/50'}`} />
                  </button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
