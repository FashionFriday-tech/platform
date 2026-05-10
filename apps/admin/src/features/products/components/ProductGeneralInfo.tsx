import React from 'react';
import { LabelWithTick } from './LabelWithTick';
import { ProductCategorySelector } from './ProductCategorySelector';
import { ProductBrandColorSelector } from './ProductBrandColorSelector';
import { ProductSizeGenderSelector } from './ProductSizeGenderSelector';
import { type Product } from '@ff/schemas';

interface Props {
  initialData?: Product;
  productName: string;
  setProductName: (val: string) => void;
  productDesc: string;
  setProductDesc: (val: string) => void;
  category: string;
  isCategoryOpen: boolean;
  setIsCategoryOpen: (val: boolean) => void;
  handleCategorySelect: (val: string) => void;
  categoryRef: React.RefObject<HTMLDivElement | null>;
  quality: string;
  isQualityOpen: boolean;
  setIsQualityOpen: (val: boolean) => void;
  setQuality: (val: string) => void;
  qualityRef: React.RefObject<HTMLDivElement | null>;
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
  sizes: string[];
  availableSizes: string[];
  toggleSize: (size: string) => void;
  gender: string;
  setGender: (val: string) => void;
  markTouched: (field: string) => void;
  getStatus: (val: string | number, initVal: string | number | undefined, minLen: number, fieldName?: string) => 'empty' | 'default' | 'valid' | 'error';
  getArrayStatus: (val: string[], initVal: string[] | undefined, fieldName?: string) => 'empty' | 'default' | 'valid' | 'error';
}

export function ProductGeneralInfo({
  initialData,
  productName, setProductName,
  productDesc, setProductDesc,
  category, isCategoryOpen, setIsCategoryOpen, handleCategorySelect, categoryRef,
  quality, isQualityOpen, setIsQualityOpen, setQuality, qualityRef,
  brandInput, setBrandInput, isBrandOpen, setIsBrandOpen, selectedBrandLogo, setSelectedBrandLogo, filteredBrands, brandRef,
  colorInput, setColorInput, isColorOpen, setIsColorOpen, selectedColorHex, setSelectedColorHex, filteredColors, colorRef,
  sizes, availableSizes, toggleSize,
  gender, setGender,
  markTouched, getStatus, getArrayStatus
}: Props) {
  return (
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

        <ProductCategorySelector
          initialData={initialData}
          category={category} isCategoryOpen={isCategoryOpen} setIsCategoryOpen={setIsCategoryOpen} handleCategorySelect={handleCategorySelect} categoryRef={categoryRef}
          quality={quality} isQualityOpen={isQualityOpen} setIsQualityOpen={setIsQualityOpen} setQuality={setQuality} qualityRef={qualityRef}
          markTouched={markTouched} getStatus={getStatus}
        />

        {/* Extra E-commerce Info */}
        <ProductBrandColorSelector
          initialData={initialData}
          brandInput={brandInput} setBrandInput={setBrandInput} isBrandOpen={isBrandOpen} setIsBrandOpen={setIsBrandOpen} selectedBrandLogo={selectedBrandLogo} setSelectedBrandLogo={setSelectedBrandLogo} filteredBrands={filteredBrands} brandRef={brandRef}
          colorInput={colorInput} setColorInput={setColorInput} isColorOpen={isColorOpen} setIsColorOpen={setIsColorOpen} selectedColorHex={selectedColorHex} setSelectedColorHex={setSelectedColorHex} filteredColors={filteredColors} colorRef={colorRef}
          getStatus={getStatus}
        />

        <ProductSizeGenderSelector
          initialData={initialData}
          sizes={sizes} availableSizes={availableSizes} toggleSize={toggleSize}
          gender={gender} setGender={setGender}
          markTouched={markTouched} getStatus={getStatus} getArrayStatus={getArrayStatus}
        />
      </div>
    </div>
  );
}
