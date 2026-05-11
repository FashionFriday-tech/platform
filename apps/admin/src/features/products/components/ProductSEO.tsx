// eslint-disable-next-line unicorn/filename-case
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
            Search Engine Optimization
          </h2>
          {seoError && (
            <span className="rounded-md bg-[#DC143C]/10 px-2.5 py-1 text-xs font-bold text-[#DC143C]">
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
            label="Tags / Keywords"
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            status={getArrayStatus(tags, initialData?.marketing?.collections)}
          />
          <div className="flex min-h-[52px] w-full flex-wrap items-center gap-2 rounded-xl border border-transparent bg-black/5 px-3 py-2 transition-all focus-within:border-black/20 dark:bg-white/5 dark:focus-within:border-white/20">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center space-x-1 rounded-md bg-black/10 px-2.5 py-1 text-xs font-bold text-black shadow-sm dark:bg-white/10 dark:text-white"
              >
                <span>{tag}</span>
                <button
                  onClick={() => {
                    removeTag(tag);
                  }}
                  className="text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                >
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
              }}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? 'Type and press enter' : ''}
              className="min-w-[120px] flex-1 bg-transparent text-sm font-medium text-black outline-none placeholder:text-black/30 dark:text-white dark:placeholder:text-white/30"
            />
          </div>
          <p className="mt-1.5 text-[10px] font-medium text-black/40 dark:text-white/40">
            Press enter to add a tag
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
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
