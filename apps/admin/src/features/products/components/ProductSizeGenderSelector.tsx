import React from 'react';
import { LabelWithTick } from './LabelWithTick';

interface Props {
  initialData?: any;
  sizes: string[];
  availableSizes: string[];
  toggleSize: (size: string) => void;
  gender: string;
  setGender: (val: string) => void;
  markTouched: (field: string) => void;
  getStatus: (val: string | number, initVal: string | number | undefined, minLen: number, fieldName?: string) => 'empty' | 'default' | 'valid' | 'error';
  getArrayStatus: (val: string[], initVal: string[] | undefined, fieldName?: string) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductSizeGenderSelector({
  initialData,
  sizes, availableSizes, toggleSize,
  gender, setGender,
  markTouched, getStatus, getArrayStatus
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
      <div>
        <LabelWithTick
          label="Size"
          status={getArrayStatus(sizes, initialData?.attributes?.sizes, 'sizes')}
          subtitle="Pick Available Sizes"
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
          subtitle="Pick Available Gender"
        />
        <div className="flex h-10 items-center space-x-6">
          {['Men', 'Woman', 'Unisex'].map((g) => (
            <button
              key={g}
              onClick={() => {
                setGender(g);
                markTouched('gender');
              }}
              className="group flex cursor-pointer items-center space-x-2.5"
            >
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border-[2px] transition-colors ${gender === g ? 'border-black dark:border-white' : 'border-black/20 group-hover:border-black/40 dark:border-white/20 dark:group-hover:border-white/40'}`}
              >
                {gender === g && (
                  <div className="h-2 w-2 rounded-full bg-black dark:bg-white"></div>
                )}
              </div>
              <span className="text-sm font-medium text-black/80 dark:text-white/80">
                {g}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
