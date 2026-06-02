import React from 'react';

import { type Product } from '@ff/schemas';

import { LabelWithTick } from './LabelWithTick';

interface Props {
  initialData?: Product;
  ogPrice: string;
  setOgPrice: (val: string) => void;
  basePrice: string;
  setBasePrice: (val: string) => void;
  stock: string;
  setStock: (val: string) => void;
  gettingPrice: string;
  setGettingPrice: (val: string) => void;
  getStatus: (
    val: string | number,
    initVal: string | number | undefined,
    minLen: number,
    fieldName?: string,
  ) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductPricingStock({
  initialData,
  ogPrice,
  setOgPrice,
  basePrice,
  setBasePrice,
  stock,
  setStock,
  gettingPrice,
  setGettingPrice,
  getStatus,
}: Props) {
  return (
    <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-[#111]">
      <h2 className="mb-6 text-lg font-bold text-black dark:text-white">Pricing And Stock</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <LabelWithTick
            label="Original Price"
            status={getStatus(ogPrice, initialData?.price?.ogPrice, 1)}
          />
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
            </div>
            <input
              type="text"
              value={ogPrice}
              onChange={(e) => {
                setOgPrice(e.target.value);
              }}
              placeholder="4,999"
              className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black line-through decoration-black/30 transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:decoration-white/30 dark:focus:border-white/20"
            />
          </div>
        </div>

        <div>
          <LabelWithTick
            label="Selling Price"
            status={getStatus(basePrice, initialData?.price?.sellingPrice, 1)}
          />
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
            </div>
            <input
              type="text"
              value={basePrice}
              onChange={(e) => {
                setBasePrice(e.target.value);
              }}
              placeholder="3,999"
              className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
            />
          </div>
        </div>

        <div>
          <LabelWithTick
            label="Stock"
            status={getStatus(stock, initialData?.inventory?.totalStock, 1)}
          />
          <input
            type="text"
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
            }}
            placeholder="77"
            className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
          />
        </div>

        <div>
          <LabelWithTick
            label="Getting Price"
            status={getStatus(gettingPrice, initialData?.price?.gettingPrice, 1)}
          />
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-sm font-bold text-black/50 dark:text-white/50">₹</span>
            </div>
            <input
              type="text"
              value={gettingPrice}
              onChange={(e) => {
                setGettingPrice(e.target.value);
              }}
              placeholder="2,500"
              className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-4 pl-8 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
