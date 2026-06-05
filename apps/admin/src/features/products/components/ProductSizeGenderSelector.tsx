import React from 'react';

import { type Product as SchemaProduct } from '@ff/schemas';

import { type Product } from '../types';
import { LabelWithTick } from './LabelWithTick';

interface Props {
  initialData?: Partial<Product> | SchemaProduct;
  sizes: string[];
  availableSizes: string[];
  toggleSize: (size: string) => void;
  gender: string;
  setGender: (val: string) => void;
  markTouched: (field: string) => void;
  getStatus: (
    val: string | number,
    initVal: string | number | undefined,
    minLen: number,
    fieldName?: string,
  ) => 'empty' | 'default' | 'valid' | 'error';
  getArrayStatus: (
    val: string[],
    initVal: string[] | undefined,
    fieldName?: string,
  ) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductSizeGenderSelector({
  initialData,
  sizes,
  availableSizes,
  toggleSize,
  gender,
  setGender,
  markTouched,
  getStatus,
  getArrayStatus,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
      <div>
        <LabelWithTick
          label="Size"
          status={getArrayStatus(sizes, initialData?.attributes?.sizes, 'sizes')}
        />
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((s) => (
            <button
              key={s}
              onClick={() => {
                toggleSize(s);
                markTouched('sizes');
              }}
              className={`flex h-10 min-w-[44px] items-center justify-center rounded-xl px-3 text-sm font-bold transition-colors ${sizes.includes(s) ? 'bg-black text-white shadow-md dark:bg-white dark:text-black' : 'bg-black/5 text-black/60 hover:bg-black/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <LabelWithTick
          label="Gender"
          status={getStatus(gender, initialData?.gender, 1, 'gender')}
        />
        <div className="flex flex-wrap gap-2">
          {['Men', 'Woman', 'Unisex'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGender(g);
                markTouched('gender');
              }}
              className={`flex h-10 min-w-[70px] items-center justify-center rounded-xl px-4 text-sm font-bold transition-all ${
                gender === g
                  ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                  : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
