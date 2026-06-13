import React from 'react';

import { type Product as SchemaProduct } from '@ff/schemas';

import { type Product } from '../types';
import { CATEGORIES, QUALITIES } from '../utils/constants';
import { LabelWithTick } from './LabelWithTick';

interface CategoryItem {
  id: string;
  name: string;
}

interface Props {
  initialData?: Partial<Product> | SchemaProduct;
  category: string;
  categories?: CategoryItem[] | string[];
  isCategoryOpen: boolean;
  setIsCategoryOpen: (val: boolean) => void;
  handleCategorySelect: (val: string) => void;
  categoryRef: React.RefObject<HTMLDivElement | null>;
  quality: string;
  isQualityOpen: boolean;
  setIsQualityOpen: (val: boolean) => void;
  setQuality: (val: string) => void;
  qualityRef: React.RefObject<HTMLDivElement | null>;
  markTouched: (field: string) => void;
  getStatus: (
    val: string | number,
    initVal: string | number | undefined,
    minLen: number,
    fieldName?: string,
  ) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductCategorySelector({
  initialData,
  category,
  categories,
  isCategoryOpen,
  setIsCategoryOpen,
  handleCategorySelect,
  categoryRef,
  quality,
  isQualityOpen,
  setIsQualityOpen,
  setQuality,
  qualityRef,
  markTouched,
  getStatus,
}: Props) {
  const seen = new Set<string>();
  const displayCategories: { id: string; name: string }[] = [];
  const rawList = categories
    ? categories.map((c) => (typeof c === 'string' ? { id: c, name: c } : c))
    : CATEGORIES.map((c) => ({ id: c, name: c }));

  for (const c of rawList) {
    if (c.name && !seen.has(c.name.toLowerCase())) {
      seen.add(c.name.toLowerCase());
      displayCategories.push(c);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
      <div ref={categoryRef} className="relative">
        <LabelWithTick
          label="Product Category"
          status={getStatus(
            category,
            initialData && 'category' in initialData
              ? initialData.category
              : initialData?.categoryId,
            1,
            'category',
          )}
        />
        <button
          onClick={() => {
            setIsCategoryOpen(!isCategoryOpen);
            markTouched('category');
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all outline-none ${isCategoryOpen ? 'border-black/20 bg-transparent text-black dark:border-white/20 dark:text-white' : 'border-transparent bg-black/5 text-black dark:bg-white/5 dark:text-white'}`}
        >
          <span>{category || 'Select Category'}</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
            <svg
              className={`h-3 w-3 text-black transition-transform dark:text-white ${isCategoryOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isCategoryOpen && (
          <div className="absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-2xl [-ms-overflow-style:none] [scrollbar-width:none] dark:border-white/10 dark:bg-[#1a1a1a] [&::-webkit-scrollbar]:hidden">
            {displayCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  handleCategorySelect(c.name);
                  markTouched('category');
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${category === c.name ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' : 'text-black/70 dark:text-white/70'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={qualityRef} className="relative">
        <LabelWithTick
          label="Quality"
          status={getStatus(quality, initialData?.attributes?.quality, 1, 'quality')}
        />
        <button
          onClick={() => {
            setIsQualityOpen(!isQualityOpen);
            markTouched('quality');
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all outline-none ${isQualityOpen ? 'border-black/20 bg-transparent text-black dark:border-white/20 dark:text-white' : 'border-transparent bg-black/5 text-black dark:bg-white/5 dark:text-white'}`}
        >
          <span>{quality}</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
            <svg
              className={`h-3 w-3 text-black transition-transform dark:text-white ${isQualityOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {isQualityOpen && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
            {QUALITIES.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuality(q);
                  setIsQualityOpen(false);
                  markTouched('quality');
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${quality === q ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' : 'text-black/70 dark:text-white/70'}`}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
