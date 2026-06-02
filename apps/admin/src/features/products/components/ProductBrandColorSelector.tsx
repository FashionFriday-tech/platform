import React from 'react';

import { LabelWithTick } from './LabelWithTick';

interface Props {
  initialData?: any;
  brandInput: string;
  setBrandInput: (val: string) => void;
  isBrandOpen: boolean;
  setIsBrandOpen: (val: boolean) => void;
  selectedBrandLogo: string | null;
  setSelectedBrandLogo: (val: string | null) => void;
  filteredBrands: any[];
  brandRef: React.RefObject<HTMLDivElement | null>;
  colorInput: string;
  setColorInput: (val: string) => void;
  isColorOpen: boolean;
  setIsColorOpen: (val: boolean) => void;
  selectedColorHex: string | null;
  setSelectedColorHex: (val: string | null) => void;
  filteredColors: any[];
  colorRef: React.RefObject<HTMLDivElement | null>;
  getStatus: (
    val: string | number,
    initVal: string | number | undefined,
    minLen: number,
    fieldName?: string,
  ) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductBrandColorSelector({
  initialData,
  brandInput,
  setBrandInput,
  isBrandOpen,
  setIsBrandOpen,
  selectedBrandLogo,
  setSelectedBrandLogo,
  filteredBrands,
  brandRef,
  colorInput,
  setColorInput,
  isColorOpen,
  setIsColorOpen,
  selectedColorHex,
  setSelectedColorHex,
  filteredColors,
  colorRef,
  getStatus,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
      <div ref={brandRef} className="relative">
        <LabelWithTick label="Brand" status={getStatus(brandInput, initialData?.brand?.[0], 2)} />
        <div className="relative flex items-center">
          {selectedBrandLogo && (
            <div className="absolute left-3 flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[10px] font-bold text-black dark:bg-white/10 dark:text-white">
              {selectedBrandLogo}
            </div>
          )}
          <input
            type="text"
            value={brandInput}
            onChange={(e) => {
              setBrandInput(e.target.value);
              setSelectedBrandLogo(null);
              setIsBrandOpen(true);
            }}
            onFocus={() => {
              setIsBrandOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredBrands.length > 0) {
                  const first = filteredBrands[0];
                  setBrandInput(first.name);
                  setSelectedBrandLogo(first.logo || first.name.charAt(0).toUpperCase());
                  setIsBrandOpen(false);
                }
              }
            }}
            placeholder="e.g. Nike"
            className={`w-full rounded-xl border-transparent bg-black/5 text-black focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20 ${selectedBrandLogo ? 'pl-10' : 'px-4'} py-3.5 text-sm font-medium transition-all outline-none`}
          />
        </div>

        {isBrandOpen && (
          <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-[#1a1a1a] [&::-webkit-scrollbar]:hidden">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((b) => (
                <button
                  key={b.name}
                  onClick={() => {
                    setBrandInput(b.name);
                    setSelectedBrandLogo(b.name.charAt(0).toUpperCase());
                    setIsBrandOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs font-bold text-black/80 dark:bg-white/10 dark:text-white/80">
                    {b.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-black/80 dark:text-white/80">
                    {b.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm font-medium text-black/50 dark:text-white/50">
                No brands found. Hit enter to add "{brandInput}"
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={colorRef} className="relative">
        <LabelWithTick
          label="Color"
          status={getStatus(colorInput, initialData?.attributes?.colors?.[0], 3)}
        />
        <div className="relative flex items-center">
          {selectedColorHex && (
            <div
              className="absolute left-3 h-4 w-4 rounded-full border border-black/10 shadow-sm dark:border-white/20"
              style={{ backgroundColor: selectedColorHex }}
            />
          )}
          <input
            type="text"
            value={colorInput}
            onChange={(e) => {
              setColorInput(e.target.value);
              setSelectedColorHex(null);
              setIsColorOpen(true);
            }}
            onFocus={() => {
              setIsColorOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredColors.length > 0) {
                  const first = filteredColors[0];
                  setColorInput(first.name);
                  setSelectedColorHex(first.hex);
                  setIsColorOpen(false);
                }
              }
            }}
            placeholder="e.g. Black"
            className={`w-full rounded-xl border-transparent bg-black/5 text-black focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20 ${selectedColorHex ? 'pl-10' : 'px-4'} py-3.5 text-sm font-medium transition-all outline-none`}
          />
        </div>

        {isColorOpen && colorInput.length > 0 && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
            {filteredColors.length > 0 ? (
              filteredColors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setColorInput(c.name);
                    setSelectedColorHex(c.hex);
                    setIsColorOpen(false);
                  }}
                  className="flex w-full items-center space-x-3 px-4 py-2.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div
                    className="h-4 w-4 rounded-full border border-black/10 shadow-sm dark:border-white/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-sm font-medium text-black/80 dark:text-white/80">
                    {c.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm font-medium text-black/50 dark:text-white/50">
                No colors found. Hit enter to add "{colorInput}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
