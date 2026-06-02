import React from 'react';

import { type Product } from '@ff/schemas';

import { LabelWithTick } from './LabelWithTick';

interface Props {
  initialData?: Product;
  seoError: string | null;
  generateSEO: () => void;
  tags: string[];
  tagInput: string;
  setTagInput: (val: string) => void;
  handleTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  removeTag: (tag: string) => void;
  availableCollections?: string[];
  toggleCollection?: (colName: string) => void;
  seoSlug: string;
  setSeoSlug: (val: string) => void;
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDesc: string;
  setSeoDesc: (val: string) => void;
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

export function ProductSEO({
  initialData,
  seoError,
  generateSEO,
  tags,
  tagInput,
  setTagInput,
  handleTagKeyDown,
  removeTag,
  availableCollections,
  toggleCollection,
  seoSlug,
  setSeoSlug,
  seoTitle,
  setSeoTitle,
  seoDesc,
  setSeoDesc,
  getStatus,
  getArrayStatus,
}: Props) {
  return (
    <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-[#111]">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold text-black dark:text-white">
            Search Engine Optimization & Collections
          </h2>
          {seoError && (
            <span className="rounded-md bg-[#FF0000]/10 px-2.5 py-1 text-xs font-bold text-[#FF0000]">
              {seoError}
            </span>
          )}
        </div>
        <button
          onClick={generateSEO}
          className="flex items-center space-x-1.5 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>Generate</span>
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <LabelWithTick
            label="Product Collections"
            status={getArrayStatus(tags, initialData?.marketing?.collections)}
          />

          {/* Multi-select Collection Chips */}
          {availableCollections && availableCollections.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2">
              {availableCollections.map((colName) => {
                const isSelected = tags.includes(colName);
                return (
                  <button
                    key={colName}
                    type="button"
                    onClick={() => toggleCollection?.(colName)}
                    className={`flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-black text-white shadow-md dark:bg-white dark:text-black'
                        : 'bg-black/5 text-black/70 hover:bg-black/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{colName}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs font-medium text-black/40 dark:text-white/40">
              No collections available.
            </p>
          )}
          <p className="mt-1.5 text-[10px] font-medium text-black/40 dark:text-white/40">
            Click collections above to select multiple
          </p>
        </div>

        <div className="border-t border-black/5 pt-5 dark:border-white/5">
          <LabelWithTick label="URL Slug" status={getStatus(seoSlug, initialData?.slug, 3)} />
          <div className="relative flex items-center">
            <span className="absolute left-4 text-sm font-medium text-black/40 dark:text-white/40">
              fashionfriday.in/product/
            </span>
            <input
              type="text"
              value={seoSlug}
              onChange={(e) => {
                setSeoSlug(e.target.value);
              }}
              placeholder="product-name"
              className="w-full rounded-xl border-transparent bg-black/5 py-3.5 pr-4 pl-[175px] text-sm font-medium text-black lowercase transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
            />
          </div>
        </div>

        <div>
          <LabelWithTick
            label="Meta Title"
            status={getStatus(seoTitle, initialData?.marketing?.seoTitle, 5)}
            rightElement={
              <span className="text-xs font-medium text-black/40 dark:text-white/40">
                50-60 chars
              </span>
            }
          />
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => {
              setSeoTitle(e.target.value);
            }}
            placeholder="Buy Puffer Jacket With Pocket Detail - Fashion Friday"
            className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
          />
        </div>

        <div>
          <LabelWithTick
            label="Meta Description"
            status={getStatus(seoDesc, initialData?.marketing?.seoDescription, 10)}
            rightElement={
              <span className="text-xs font-medium text-black/40 dark:text-white/40">
                150-160 chars
              </span>
            }
          />
          <textarea
            rows={3}
            value={seoDesc}
            onChange={(e) => {
              setSeoDesc(e.target.value);
            }}
            placeholder="Shop the latest Puffer Jacket with pocket details. Fast shipping, great deals, and premium materials. Buy now at Fashion Friday."
            className="w-full resize-none rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm leading-relaxed font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
          />
        </div>
      </div>
    </div>
  );
}
