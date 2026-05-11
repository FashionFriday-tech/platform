import Image from 'next/image';

import { type ColumnId, type Product } from '../types';

interface Props {
  product: Product;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
  onToggleStatus: (id: string) => void;
  visibleColumns: Set<ColumnId>;
  onClick: () => void;
  getCategoryIcon: (category: string) => React.ReactNode;
}

export function ProductTableRow({
  product,
  isSelected,
  onToggleSelection,
  onToggleStatus,
  visibleColumns,
  onClick,
  getCategoryIcon,
}: Props) {
  return (
    <tr
      onClick={onClick}
      className={`group cursor-pointer whitespace-nowrap transition-colors ${isSelected ? 'bg-black/[0.03] dark:bg-white/[0.05]' : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'}`}
    >
      {/* Sticky Left: Select & Product Info */}
      <td
        className={`sticky left-0 z-10 border-r border-black/5 px-4 py-4 shadow-[4px_0_12px_rgba(0,0,0,0.03)] transition-colors dark:border-white/5 dark:shadow-[4px_0_12px_rgba(255,255,255,0.02)] ${isSelected ? 'bg-[#f4f4f4] dark:bg-[#222]' : 'bg-white group-hover:bg-[#fafafa] dark:bg-[#111111] dark:group-hover:bg-[#1a1a1a]'}`}
      >
        <div className="flex items-center space-x-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelection(product.id);
            }}
            className={`flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors ${isSelected ? 'border-black bg-black dark:border-white dark:bg-white' : 'border-black/20 group-hover:border-black/50 dark:border-white/20 dark:group-hover:border-white/50'}`}
          >
            {isSelected && (
              <svg
                className="h-3.5 w-3.5 text-white dark:text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-black/5 dark:border-white/5 dark:bg-white/10">
              {product.imageUrl ? (
                <Image
                  width={500}
                  height={500}
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-black/30 dark:text-white/30">IMG</span>
              )}
            </div>
            <div className="min-w-[180px]">
              <p
                className="max-w-[220px] truncate text-sm font-medium text-black/90 dark:text-white/90"
                title={product.name}
              >
                {product.name}
              </p>
              <p className="mt-1 text-xs text-black/40 dark:text-white/40">ID: {product.sku}</p>
            </div>
          </div>
        </div>
      </td>

      {visibleColumns.has('Category') && (
        <td className="px-4 py-4">
          <span className="inline-flex min-w-[100px] items-center justify-center rounded-md bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70 dark:bg-white/5 dark:text-white/70">
            {getCategoryIcon(product.category)}
            {product.category}
          </span>
        </td>
      )}

      {visibleColumns.has('Cost Price') && (
        <td className="px-4 py-4 text-sm text-black/70 dark:text-white/70">
          ₹{product.costPrice.toFixed(2)}
        </td>
      )}

      {visibleColumns.has('OG Price') && (
        <td className="px-4 py-4 text-sm text-black/70 dark:text-white/70">
          ₹{product.originalPrice.toFixed(2)}
        </td>
      )}

      <td className="px-4 py-4 text-sm font-medium">
        {product.sellingPrice < product.originalPrice ? (
          <span className="font-bold text-red-500">₹{product.sellingPrice.toFixed(2)}</span>
        ) : (
          <span className="text-black dark:text-white">₹{product.sellingPrice.toFixed(2)}</span>
        )}
      </td>

      {visibleColumns.has('Variants') && (
        <td className="px-4 py-4">
          <div className="grid w-max grid-flow-col grid-rows-2 gap-1">
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            {product.variants?.map((v) => (
              <span
                key={v}
                className="flex h-[18px] min-w-[24px] items-center justify-center rounded border border-black/10 px-1 text-[9px] font-medium text-black/60 dark:border-white/10 dark:text-white/60"
              >
                {v}
              </span>
            )) || <span className="text-xs text-black/30 dark:text-white/30">-</span>}
          </div>
        </td>
      )}

      {visibleColumns.has('Sales') && (
        <td className="px-4 py-4 text-sm font-medium text-black/80 dark:text-white/80">
          {product.sales ? product.sales.toLocaleString() : '0'}
        </td>
      )}

      {visibleColumns.has('Date Added') && (
        <td className="px-4 py-4 text-sm text-black/60 dark:text-white/60">
          {product.dateAdded || 'N/A'}
        </td>
      )}

      <td className="px-4 py-4 text-sm">
        <span
          className={`inline-flex min-w-[100px] items-center justify-center rounded-md border px-2.5 py-1 text-xs font-medium ${product.status === 'Active' ? 'border-black/10 bg-black/5 text-black dark:border-white/20 dark:bg-white/10 dark:text-white' : product.status === 'Draft' ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500' : 'border-transparent bg-black/5 text-black/50 dark:bg-white/5 dark:text-white/50'}`}
        >
          {product.status}
        </span>
      </td>

      {visibleColumns.has('Stock') && (
        <td className="px-4 py-4">
          <div className="flex w-24 flex-col justify-center">
            <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${product.stock < 100 ? 'bg-red-500' : product.stock < 500 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${(product.stock / product.maxStock) * 100}%` }}
              />
            </div>
            <p
              className={`text-right text-[10px] font-medium ${product.stock < 100 ? 'text-red-500' : product.stock < 500 ? 'text-yellow-600 dark:text-yellow-500' : 'text-green-600 dark:text-green-500'}`}
            >
              {product.stock}/{product.maxStock}
            </p>
          </div>
        </td>
      )}

      {/* Sticky Right: Activation */}
      <td
        className={`sticky right-0 z-10 border-l border-black/5 px-6 py-4 text-right shadow-[-4px_0_12px_rgba(0,0,0,0.03)] transition-colors dark:border-white/5 dark:shadow-[-4px_0_12px_rgba(255,255,255,0.02)] ${isSelected ? 'bg-[#f4f4f4] dark:bg-[#222]' : 'bg-white group-hover:bg-[#fafafa] dark:bg-[#111111] dark:group-hover:bg-[#1a1a1a]'}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            product.status !== 'Draft' && onToggleStatus(product.id);
          }}
          disabled={product.status === 'Draft'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.status === 'Active' ? 'bg-black/90 dark:bg-white/90' : 'border border-black/20 bg-black/10 dark:border-white/20 dark:bg-white/10'} ${product.status === 'Draft' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full transition-transform ${product.status === 'Active' ? 'translate-x-6 bg-white dark:bg-black' : 'translate-x-1 bg-black/50 dark:bg-white/50'}`}
          />
        </button>
      </td>
    </tr>
  );
}
