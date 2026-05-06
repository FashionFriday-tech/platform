'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, QUALITIES } from '../utils/constants';
import { LabelWithTick } from './LabelWithTick';
import { useAddProductForm } from '../hooks/useAddProductForm';
import { type Product } from '@ff/schemas';
import Image from 'next/image';

interface AddProductFormProps {
  initialData?: Product;
}

export function AddProductForm({ initialData }: AddProductFormProps) {
  const {
    sizes,
    toggleSize,
    gender,
    setGender,
    category,
    handleCategorySelect,
    quality,
    setQuality,
    tags,
    tagInput,
    setTagInput,
    handleTagKeyDown,
    removeTag,
    brandInput,
    setBrandInput,
    selectedBrandLogo,
    setSelectedBrandLogo,
    isBrandOpen,
    setIsBrandOpen,
    colorInput,
    setColorInput,
    selectedColorHex,
    setSelectedColorHex,
    isColorOpen,
    setIsColorOpen,
    videoLink,
    setVideoLink,
    embedUrl,
    videoId,
    isCategoryOpen,
    setIsCategoryOpen,
    isQualityOpen,
    setIsQualityOpen,
    productName,
    setProductName,
    productDesc,
    setProductDesc,
    basePrice,
    setBasePrice,
    ogPrice,
    setOgPrice,
    stock,
    setStock,
    sku,
    setSku,
    seoTitle,
    setSeoTitle,
    seoSlug,
    setSeoSlug,
    seoDesc,
    setSeoDesc,
    seoError,
    generateSEO,
    fileInputRef,
    images,
    draggedIndex,
    categoryRef,
    qualityRef,
    colorRef,
    brandRef,
    handleImageUpload,
    handleReorder,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    removeImage,
    filteredColors,
    availableSizes,
    filteredBrands,
    progress,
  } = useAddProductForm(initialData);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const markTouched = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const getStatus = (
    val: string | number,
    initVal: string | number | undefined,
    minLen: number,
    fieldName?: string,
  ): 'empty' | 'default' | 'valid' | 'error' => {
    const valStr = String(val);
    if (valStr.trim().length < minLen) return hasSubmitted ? 'error' : 'empty';
    if (initialData && valStr === String(initVal || '')) return 'default';
    if (!initialData && fieldName && !touched[fieldName]) return 'default';
    return 'valid';
  };

  const getArrayStatus = (
    val: string[],
    initVal: string[] | undefined,
    fieldName?: string,
  ): 'empty' | 'default' | 'valid' | 'error' => {
    if (val.length === 0) return hasSubmitted ? 'error' : 'empty';
    if (
      initialData &&
      initVal &&
      val.length === initVal.length &&
      [...val].sort().join(',') === [...initVal].sort().join(',')
    )
      return 'default';
    if (!initialData && fieldName && !touched[fieldName]) return 'default';
    return 'valid';
  };

  return (
    <div className="scrollbar-hide h-full w-full overflow-y-auto pb-20 rounded-2xl">
      {/* Top Bar */}
      <div className="sticky top-0 rounded-2xl z-30 mb-6 px-4 flex flex-col justify-between gap-4 border-b border-black/5 bg-gray-50/90 py-2 backdrop-blur-md md:flex-row md:items-center dark:border-white/5 dark:bg-black/90">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white shadow-md dark:bg-white dark:text-black">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-black dark:text-white">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        <div className="flex items-center">
          <div className="mr-4 flex items-center space-x-2 rounded-full border border-black/5 bg-white px-4 py-2 shadow-sm dark:border-white/5 dark:bg-[#111111]">
            <span className="text-xs font-bold tracking-wider text-black/60 uppercase dark:text-white/60">
              Completion
            </span>
            <span className="text-sm font-black text-black dark:text-white">
              {progress.filled}/{progress.total}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {initialData && (
              <button className="flex items-center space-x-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black/60 shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#111111] dark:text-white/60 dark:hover:bg-white/5">
                <span>Cancel</span>
              </button>
            )}
            <button className="flex items-center space-x-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#111111] dark:hover:bg-white/5">
              <svg
                className="h-4 w-4 text-black/60 dark:text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Save Draft</span>
            </button>
            <button
              onClick={() => setHasSubmitted(true)}
              className="flex items-center space-x-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{initialData ? 'Save Changes' : 'Add Product'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-4 lg:col-span-2">
          {/* General Information */}
          <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-[#111]">
            <h2 className="mb-6 text-lg font-bold text-black dark:text-white">
              General Information
            </h2>

            <div className="space-y-5">
              <div>
                <LabelWithTick
                  label="Name Product"
                  status={getStatus(productName, initialData?.name, 3)}
                />
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Puffer Jacket With Pocket Detail"
                  className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>

              <div>
                <LabelWithTick
                  label="Description Product"
                  status={getStatus(productDesc, initialData?.description, 10)}
                />
                <textarea
                  rows={4}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Cropped puffer jacket made of technical fabric. High neck and long sleeves..."
                  className="w-full resize-none rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm leading-relaxed font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
                <div ref={categoryRef} className="relative">
                  <LabelWithTick
                    label="Product Category"
                    status={getStatus(category, initialData?.category, 1, 'category')}
                  />
                  <button
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      markTouched('category');
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all outline-none ${isCategoryOpen ? 'border-black/20 bg-transparent text-black dark:border-white/20 dark:text-white' : 'border-transparent bg-black/5 text-black dark:bg-white/5 dark:text-white'}`}
                  >
                    <span>{category}</span>
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
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
                      {CATEGORIES.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            handleCategorySelect(c);
                            markTouched('category');
                          }}
                          className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${category === c ? 'bg-black/5 text-black dark:bg-white/5 dark:text-white' : 'text-black/70 dark:text-white/70'}`}
                        >
                          {c}
                        </button>
                      ))}
                      <div className="my-1 border-t border-black/10 dark:border-white/10"></div>
                      <button className="flex w-full items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        <span>Add Category</span>
                      </button>
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

              {/* Extra E-commerce Info */}
              <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
                <div ref={brandRef} className="relative">
                  <LabelWithTick
                    label="Brand"
                    status={getStatus(brandInput, initialData?.brand?.[0], 2)}
                  />
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
                        setSelectedBrandLogo(null); // Clear selected logo if typing
                        setIsBrandOpen(true);
                      }}
                      onFocus={() => setIsBrandOpen(true)}
                      placeholder="e.g. Nike"
                      className={`w-full rounded-xl border-transparent bg-black/5 text-black focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20 ${selectedBrandLogo ? 'pl-10' : 'px-4'} py-3.5 text-sm font-medium transition-all outline-none`}
                    />
                  </div>

                  {isBrandOpen && brandInput.length > 0 && (
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-2xl dark:border-white/10 dark:bg-[#1a1a1a]">
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
                      ></div>
                    )}
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => {
                        setColorInput(e.target.value);
                        setSelectedColorHex(null); // Clear selected hex if typing
                        setIsColorOpen(true);
                      }}
                      onFocus={() => setIsColorOpen(true)}
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
                            ></div>
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
            </div>
          </div>

          {/* Pricing And Stock */}
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
                    onChange={(e) => setOgPrice(e.target.value)}
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
                    onChange={(e) => setBasePrice(e.target.value)}
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
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="77"
                  className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>

              <div>
                <LabelWithTick
                  label="SKU"
                  status={getStatus(sku, initialData?.inventory?.sku, 3)}
                />
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="JAC-WIN-001"
                  className="w-full rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm font-medium text-black uppercase transition-all outline-none placeholder:normal-case focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>
            </div>
          </div>

          {/* Search Engine Optimization */}
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
                        onClick={() => removeTag(tag)}
                        className="text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                    onChange={(e) => setTagInput(e.target.value)}
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
                    onChange={(e) => setSeoSlug(e.target.value)}
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
                  onChange={(e) => setSeoTitle(e.target.value)}
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
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Shop the latest Puffer Jacket with pocket details. Fast shipping, great deals, and premium materials. Buy now at Fashion Friday."
                  className="w-full resize-none rounded-xl border-transparent bg-black/5 px-4 py-3.5 text-sm leading-relaxed font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upload Img */}
          <div className="rounded-[2rem] bg-white p-7 shadow-sm dark:bg-[#111]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black dark:text-white">Upload Media</h2>
              <span className="text-xs font-bold text-black/50 dark:text-white/50">
                {images.length}/10 Images
              </span>
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {images.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative mb-4 flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-black/20 bg-black/5 transition-colors hover:border-black/40 hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 dark:bg-black">
                  <svg
                    className="h-5 w-5 text-black dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black/80 dark:text-white/80">
                  Click to upload images
                </span>
                <span className="mt-1 text-xs font-medium text-black/40 dark:text-white/40">
                  Up to 10 images
                </span>
              </div>
            ) : (
              <>
                {/* Main Image Preview */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 0)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 0)}
                  onDragEnd={handleDragEnd}
                  className={`group relative mb-4 aspect-[3/4] w-full cursor-move overflow-hidden rounded-2xl border border-black/5 bg-black/5 transition-all dark:border-white/5 dark:bg-white/5 ${draggedIndex === 0 ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
                >
                  <Image width={500} height={500}
                    src={images[0].url}
                    alt="Main product"
                    className="pointer-events-none h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-black/5 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-black/90">
                    <span className="text-xs font-bold text-black dark:text-white">Main Image</span>
                  </div>
                  <button
                    onClick={() => removeImage(images[0].id)}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-transform group-hover:opacity-100 hover:scale-110 dark:border-white/5 dark:bg-black"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Grid Previews */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                  {images.slice(1).map((img, index) => {
                    const actualIndex = index + 1; // 1-based index in the array for the dropdown (0 is main)
                    return (
                      <div
                        key={img.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, actualIndex)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, actualIndex)}
                        onDragEnd={handleDragEnd}
                        className={`group relative aspect-[3/4] cursor-move overflow-hidden rounded-xl border border-black/5 bg-black/5 transition-all dark:border-white/5 dark:bg-white/5 ${draggedIndex === actualIndex ? 'scale-95 border-black/20 opacity-50 dark:border-white/20' : ''}`}
                      >
                        <Image width={500} height={500}
                          src={img.url}
                          alt={`Preview ${actualIndex}`}
                          className="pointer-events-none h-full w-full object-cover"
                        />

                        {/* Position Number Overlay */}
                        <div className="pointer-events-auto absolute top-1.5 left-1.5 flex items-center overflow-hidden rounded-md bg-black/60 shadow-sm backdrop-blur-md">
                          <select
                            value={actualIndex}
                            onChange={(e) => handleReorder(actualIndex, parseInt(e.target.value))}
                            className="cursor-pointer appearance-none bg-transparent px-1.5 py-0.5 text-center text-[10px] font-bold text-white outline-none"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                          >
                            {images.map((_, i) => (
                              <option
                                key={i}
                                value={i}
                                className="bg-white text-black dark:bg-[#1a1a1a] dark:text-white"
                              >
                                {i === 0 ? 'Main' : i + 1}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Remove button */}
                        <button
                          onClick={() => removeImage(img.id)}
                          className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-black/5 bg-white text-red-500 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-white/5 dark:bg-black"
                        >
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  {/* Add More Button */}
                  {images.length < 10 && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group flex aspect-[3/4] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 transition-colors hover:border-black/40 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5"
                    >
                      <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-black/60 transition-transform group-hover:scale-110 dark:bg-white/10 dark:text-white/80">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50">
                        Add
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="border-t border-black/5 pt-4 dark:border-white/5">
              <LabelWithTick
                label="Embed Video"
                status={videoLink.trim().length >= 10 ? 'valid' : 'empty'}
              />

              {/* Embed Preview */}
              {videoId && (
                <div className="group relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-xl border border-black/5 bg-black/5 shadow-sm dark:border-white/5 dark:bg-white/5">
                  {!isPlaying ? (
                    <div
                      className="relative h-full w-full cursor-pointer"
                      onClick={() => setIsPlaying(true)}
                    >
                      <Image width={500} height={500}
                        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                          <svg
                            className="ml-1 h-8 w-8 text-black"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      className="absolute top-1/2 left-0 aspect-[9/16] w-full -translate-y-1/2"
                      src={embedUrl || ''}
                      title="YouTube Shorts player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
              )}

              <div className="relative flex w-full items-center">
                <div className="absolute left-3">
                  <svg
                    className="h-4 w-4 text-black/40 dark:text-white/40"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => {
                    setVideoLink(e.target.value);
                    setIsPlaying(false);
                  }}
                  placeholder="Paste YouTube URL"
                  className="w-full rounded-xl border border-transparent bg-black/5 py-3 pr-4 pl-9 text-sm font-medium text-black transition-all outline-none focus:border-black/20 dark:bg-white/5 dark:text-white dark:focus:border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
