import React from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  localFilters: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setLocalFilters: (val: any) => void;
}

export function ProductPriceRangeFilter({ localFilters, setLocalFilters }: Props) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium text-black/70 dark:text-white/70">
          Price Range (₹)
        </label>
        <div className="flex items-center space-x-1 rounded-md bg-black/5 px-2 py-0.5 text-xs font-bold text-black dark:bg-white/10 dark:text-white">
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
          <span>{localFilters.minPrice || '0'}</span>
          <span className="text-black/30 dark:text-white/30">-</span>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
          <span>{localFilters.maxPrice || '10000'}</span>
        </div>
      </div>

      <div className="relative mt-2 flex h-6 items-center">
        {/* Track background */}
        <div className="absolute h-1.5 w-full rounded-lg bg-black/10 dark:bg-white/10" />

        {/* Highlight between min and max */}
        <div
          className="absolute h-1.5 rounded-lg bg-black dark:bg-white"
          style={{
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
            left: `${(Number(localFilters.minPrice || 0) / 10000) * 100}%`,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
            right: `${100 - (Number(localFilters.maxPrice || 10000) / 10000) * 100}%`,
          }}
        />

        {/* Min Slider */}
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
          value={localFilters.minPrice || '0'}
          onChange={(e) => {
            const val = Math.min(
              Number(e.target.value),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
              Number(localFilters.maxPrice || 10000) - 100,
            );
            setLocalFilters({ ...localFilters, minPrice: val.toString() });
          }}
          className="pointer-events-none absolute z-10 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:bg-black"
        />

        {/* Max Slider */}
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
          value={localFilters.maxPrice || '10000'}
          onChange={(e) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-nullish-coalescing
            const val = Math.max(Number(e.target.value), Number(localFilters.minPrice || 0) + 100);
            setLocalFilters({ ...localFilters, maxPrice: val.toString() });
          }}
          className="pointer-events-none absolute z-20 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:bg-white dark:[&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:bg-black"
        />
      </div>

      <div className="mt-1 flex justify-between px-1 text-[10px] text-black/40 dark:text-white/40">
        <span>0</span>
        <span>10K</span>
      </div>
    </div>
  );
}
