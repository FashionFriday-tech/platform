"use client";

import Link from "next/link";
import { CATEGORIES, QUALITIES } from "../utils/constants";
import { LabelWithTick } from "./LabelWithTick";
import { useAddProductForm } from "../hooks/useAddProductForm";

export function AddProductForm() {
  const {
    sizes, toggleSize,
    gender, setGender,
    category, handleCategorySelect,
    quality, setQuality,
    tags, tagInput, setTagInput, handleTagKeyDown, removeTag,
    brandInput, setBrandInput, selectedBrandLogo, setSelectedBrandLogo, isBrandOpen, setIsBrandOpen,
    colorInput, setColorInput, selectedColorHex, setSelectedColorHex, isColorOpen, setIsColorOpen,
    videoLink, setVideoLink, embedUrl,
    isCategoryOpen, setIsCategoryOpen,
    isQualityOpen, setIsQualityOpen,
    productName, setProductName,
    productDesc, setProductDesc,
    basePrice, setBasePrice,
    ogPrice, setOgPrice,
    stock, setStock,
    sku, setSku,
    seoTitle, setSeoTitle,
    seoSlug, setSeoSlug,
    seoDesc, setSeoDesc,
    seoError, generateSEO,
    fileInputRef, images, draggedIndex,
    categoryRef, qualityRef, colorRef, brandRef,
    handleImageUpload, handleReorder, handleDragStart, handleDragOver, handleDrop, handleDragEnd, removeImage,
    filteredColors, availableSizes, filteredBrands,
    progress
  } = useAddProductForm();

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide pb-20">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sticky top-0 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md z-30 py-2 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center space-x-3">
          <Link href="/" className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">Add New Product</h1>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center space-x-2 mr-4 bg-white dark:bg-[#111111] px-4 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
            <span className="text-xs font-bold text-black/60 dark:text-white/60 uppercase tracking-wider">Completion</span>
            <span className="text-sm font-black text-black dark:text-white">{progress.filled}/{progress.total}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/10 text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors bg-white dark:bg-[#111111] shadow-sm">
              <svg className="w-4 h-4 text-black/60 dark:text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>Save Draft</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:opacity-90 transition-opacity shadow-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-7 border border-black/5 dark:border-white/5 shadow-sm">
            <h2 className="text-lg font-bold text-black dark:text-white mb-6">General Information</h2>
            
            <div className="space-y-5">
              <div>
                <LabelWithTick label="Name Product" status={productName.trim().length >= 3 ? "valid" : "empty"} />
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Puffer Jacket With Pocket Detail"
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <LabelWithTick label="Description Product" status={productDesc.trim().length >= 10 ? "valid" : "empty"} />
                <textarea 
                  rows={4}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Cropped puffer jacket made of technical fabric. High neck and long sleeves..."
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div ref={categoryRef} className="relative">
                  <LabelWithTick label="Product Category" status={category === "Jacket" ? "default" : "valid"} />
                  <button 
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className={`w-full flex items-center justify-between text-left border rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium ${isCategoryOpen ? 'bg-transparent border-black/20 dark:border-white/20 text-black dark:text-white' : 'bg-black/5 dark:bg-white/5 border-transparent text-black dark:text-white'}`}
                  >
                    <span>{category}</span>
                    <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                      <svg className={`w-3 h-3 text-black dark:text-white transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                      {CATEGORIES.map(c => (
                        <button
                          key={c}
                          onClick={() => handleCategorySelect(c)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${category === c ? 'text-black dark:text-white bg-black/5 dark:bg-white/5' : 'text-black/70 dark:text-white/70'}`}
                        >
                          {c}
                        </button>
                      ))}
                      <div className="border-t border-black/10 dark:border-white/10 my-1"></div>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-bold text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        <span>Add Category</span>
                      </button>
                    </div>
                  )}
                </div>

                <div ref={qualityRef} className="relative">
                  <LabelWithTick label="Quality" status={quality === "Original" ? "default" : "valid"} />
                  <button 
                    onClick={() => setIsQualityOpen(!isQualityOpen)}
                    className={`w-full flex items-center justify-between text-left border rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium ${isQualityOpen ? 'bg-transparent border-black/20 dark:border-white/20 text-black dark:text-white' : 'bg-black/5 dark:bg-white/5 border-transparent text-black dark:text-white'}`}
                  >
                    <span>{quality}</span>
                    <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                      <svg className={`w-3 h-3 text-black dark:text-white transition-transform ${isQualityOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </button>

                  {isQualityOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                      {QUALITIES.map(q => (
                        <button
                          key={q}
                          onClick={() => { setQuality(q); setIsQualityOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${quality === q ? 'text-black dark:text-white bg-black/5 dark:bg-white/5' : 'text-black/70 dark:text-white/70'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Extra E-commerce Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div ref={brandRef} className="relative">
                  <LabelWithTick label="Brand" status={brandInput.trim().length >= 2 ? "valid" : "empty"} />
                  <div className="relative flex items-center">
                    {selectedBrandLogo && (
                      <div className="absolute left-3 w-5 h-5 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-black dark:text-white">
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
                      className={`w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl ${selectedBrandLogo ? 'pl-10' : 'px-4'} py-3.5 outline-none transition-all text-sm font-medium`}
                    />
                  </div>
                  
                  {isBrandOpen && brandInput.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                      {filteredBrands.length > 0 ? filteredBrands.map(b => (
                        <button
                          key={b.name}
                          onClick={() => {
                            setBrandInput(b.name);
                            setSelectedBrandLogo(b.name.charAt(0).toUpperCase());
                            setIsBrandOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 text-left px-4 py-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-black/80 dark:text-white/80">
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-black/80 dark:text-white/80">{b.name}</span>
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-sm text-black/50 dark:text-white/50 text-center font-medium">
                          No brands found. Hit enter to add "{brandInput}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={colorRef} className="relative">
                  <LabelWithTick label="Color" status={colorInput.trim().length >= 3 ? "valid" : "empty"} />
                  <div className="relative flex items-center">
                    {selectedColorHex && (
                      <div className="absolute left-3 w-4 h-4 rounded-full shadow-sm border border-black/10 dark:border-white/20" style={{ backgroundColor: selectedColorHex }}></div>
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
                      className={`w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl ${selectedColorHex ? 'pl-10' : 'px-4'} py-3.5 outline-none transition-all text-sm font-medium`}
                    />
                  </div>
                  
                  {isColorOpen && colorInput.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#1a1a1a] border border-black/10 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden py-1">
                      {filteredColors.length > 0 ? filteredColors.map(c => (
                        <button
                          key={c.name}
                          onClick={() => {
                            setColorInput(c.name);
                            setSelectedColorHex(c.hex);
                            setIsColorOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 text-left px-4 py-2.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <div className="w-4 h-4 rounded-full shadow-sm border border-black/10 dark:border-white/20" style={{ backgroundColor: c.hex }}></div>
                          <span className="text-sm font-medium text-black/80 dark:text-white/80">{c.name}</span>
                        </button>
                      )) : (
                        <div className="px-4 py-3 text-sm text-black/50 dark:text-white/50 text-center font-medium">
                          No colors found. Hit enter to add "{colorInput}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div>
                  <LabelWithTick label="Size" status={sizes.length === 1 && sizes[0] === "S" ? "default" : sizes.length > 0 ? "valid" : "empty"} subtitle="Pick Available Sizes" />
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(s => (
                      <button 
                        key={s} 
                        onClick={() => toggleSize(s)}
                        className={`min-w-[44px] px-3 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-colors ${sizes.includes(s) ? 'bg-black dark:bg-white text-white dark:text-black shadow-md' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <LabelWithTick label="Gender" status={gender === "Woman" ? "default" : "valid"} subtitle="Pick Available Gender" />
                  <div className="flex items-center space-x-6 h-10">
                    {["Men", "Woman", "Unisex"].map(g => (
                      <button key={g} onClick={() => setGender(g)} className="flex items-center space-x-2.5 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center transition-colors ${gender === g ? 'border-black dark:border-white' : 'border-black/20 dark:border-white/20 group-hover:border-black/40 dark:group-hover:border-white/40'}`}>
                          {gender === g && <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>}
                        </div>
                        <span className="text-sm font-medium text-black/80 dark:text-white/80">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing And Stock */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-7 border border-black/5 dark:border-white/5 shadow-sm">
            <h2 className="text-lg font-bold text-black dark:text-white mb-6">Pricing And Stock</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <LabelWithTick label="Original Price" status={ogPrice.trim().length > 0 ? "valid" : "empty"} />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-black/50 dark:text-white/50 text-sm font-bold">₹</span>
                  </div>
                  <input 
                    type="text" 
                    value={ogPrice}
                    onChange={(e) => setOgPrice(e.target.value)}
                    placeholder="4,999"
                    className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl pl-8 pr-4 py-3.5 outline-none transition-all text-sm font-medium line-through decoration-black/30 dark:decoration-white/30"
                  />
                </div>
              </div>

              <div>
                <LabelWithTick label="Selling Price" status={basePrice.trim().length > 0 ? "valid" : "empty"} />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-black/50 dark:text-white/50 text-sm font-bold">₹</span>
                  </div>
                  <input 
                    type="text" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="3,999"
                    className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl pl-8 pr-4 py-3.5 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>
              
              <div>
                <LabelWithTick label="Stock" status={stock.trim().length > 0 ? "valid" : "empty"} />
                <input 
                  type="text" 
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="77"
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <LabelWithTick label="SKU" status={sku.trim().length >= 3 ? "valid" : "empty"} />
                <input 
                  type="text" 
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="JAC-WIN-001"
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium uppercase placeholder:normal-case"
                />
              </div>
            </div>
          </div>

          {/* Search Engine Optimization */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-7 border border-black/5 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-black dark:text-white">Search Engine Optimization</h2>
                {seoError && <span className="text-[#DC143C] text-xs font-bold bg-[#DC143C]/10 px-2.5 py-1 rounded-md">{seoError}</span>}
              </div>
              <button 
                onClick={generateSEO}
                className="px-4 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity flex items-center space-x-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <span>Generate</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <LabelWithTick label="Tags / Keywords" status={tags.length > 0 ? "valid" : "empty"} />
                <div className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus-within:border-black/20 dark:focus-within:border-white/20 rounded-xl px-3 py-2 transition-all flex flex-wrap gap-2 items-center min-h-[52px]">
                  {tags.map(tag => (
                    <span key={tag} className="flex items-center space-x-1 px-2.5 py-1 bg-black/10 dark:bg-white/10 text-black dark:text-white text-xs font-bold rounded-md shadow-sm">
                      <span>{tag}</span>
                      <button onClick={() => removeTag(tag)} className="text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "Type and press enter" : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-medium text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30"
                  />
                </div>
                <p className="text-[10px] text-black/40 dark:text-white/40 mt-1.5 font-medium">Press enter to add a tag</p>
              </div>

              <div className="border-t border-black/5 dark:border-white/5 pt-5">
                <LabelWithTick label="URL Slug" status={seoSlug.trim().length >= 3 ? "valid" : "empty"} />
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-black/40 dark:text-white/40 text-sm font-medium">fashionfriday.in/product/</span>
                  <input 
                    type="text" 
                    value={seoSlug}
                    onChange={(e) => setSeoSlug(e.target.value)}
                    placeholder="product-name"
                    className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl pl-[175px] pr-4 py-3.5 outline-none transition-all text-sm font-medium lowercase"
                  />
                </div>
              </div>

              <div>
                <LabelWithTick 
                  label="Meta Title" 
                  status={seoTitle.trim().length >= 5 ? "valid" : "empty"} 
                  rightElement={<span className="text-xs text-black/40 dark:text-white/40 font-medium">50-60 chars</span>} 
                />
                <input 
                  type="text" 
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Buy Puffer Jacket With Pocket Detail - Fashion Friday"
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <LabelWithTick 
                  label="Meta Description" 
                  status={seoDesc.trim().length >= 10 ? "valid" : "empty"} 
                  rightElement={<span className="text-xs text-black/40 dark:text-white/40 font-medium">150-160 chars</span>} 
                />
                <textarea 
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="Shop the latest Puffer Jacket with pocket details. Fast shipping, great deals, and premium materials. Buy now at Fashion Friday."
                  className="w-full bg-black/5 dark:bg-white/5 border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl px-4 py-3.5 outline-none transition-all text-sm font-medium resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Upload Img */}
          <div className="bg-white dark:bg-[#111] rounded-[2rem] p-7 border border-black/5 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-black dark:text-white">Upload Media</h2>
              <span className="text-xs font-bold text-black/50 dark:text-white/50">{images.length}/10 Images</span>
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
                className="w-full aspect-square rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col items-center justify-center overflow-hidden mb-4 relative hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer border border-dashed border-black/20 dark:border-white/20 hover:border-black/40 dark:hover:border-white/40 group"
              >
                <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <span className="text-sm font-bold text-black/80 dark:text-white/80">Click to upload images</span>
                <span className="text-xs font-medium text-black/40 dark:text-white/40 mt-1">Up to 10 images</span>
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
                  className={`w-full aspect-square rounded-2xl bg-black/5 dark:bg-white/5 overflow-hidden mb-4 relative border border-black/5 dark:border-white/5 group cursor-move transition-all ${draggedIndex === 0 ? 'opacity-50 scale-95 border-black/20 dark:border-white/20' : ''}`}
                >
                  <img src={images[0].url} alt="Main product" className="w-full h-full object-cover pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm border border-black/5 dark:border-white/5 pointer-events-none">
                    <span className="text-xs font-bold text-black dark:text-white">Main Image</span>
                  </div>
                  <button onClick={() => removeImage(images[0].id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-red-500 hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 border border-black/5 dark:border-white/5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Grid Previews */}
                <div className="grid grid-cols-4 gap-3 mb-6">
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
                        className={`aspect-square rounded-xl bg-black/5 dark:bg-white/5 relative overflow-hidden group border border-black/5 dark:border-white/5 cursor-move transition-all ${draggedIndex === actualIndex ? 'opacity-50 scale-95 border-black/20 dark:border-white/20' : ''}`}
                      >
                        <img src={img.url} alt={`Preview ${actualIndex}`} className="w-full h-full object-cover pointer-events-none" />
                        
                        {/* Position Number Overlay */}
                        <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md rounded-md overflow-hidden flex items-center shadow-sm pointer-events-auto">
                          <select 
                            value={actualIndex}
                            onChange={(e) => handleReorder(actualIndex, parseInt(e.target.value))}
                            className="bg-transparent text-white text-[10px] font-bold px-1.5 py-0.5 outline-none cursor-pointer appearance-none text-center"
                            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                          >
                            {images.map((_, i) => (
                              <option key={i} value={i} className="text-black bg-white dark:bg-[#1a1a1a] dark:text-white">{i === 0 ? "Main" : i + 1}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Remove button */}
                        <button onClick={() => removeImage(img.id)} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white dark:bg-black shadow-sm flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border border-black/5 dark:border-white/5 z-10">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    );
                  })}
                  
                  {/* Add More Button */}
                  {images.length < 10 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed border-black/20 dark:border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-black/40 dark:hover:border-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/80 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                      </div>
                      <span className="text-[10px] font-bold text-black/50 dark:text-white/50">Add</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <LabelWithTick label="Embed Video" status={videoLink.trim().length >= 10 ? "valid" : "empty"} />
              
              {/* Embed Preview */}
              {embedUrl && (
                <div className="w-full aspect-[9/16] max-h-[250px] bg-black/5 dark:bg-white/5 rounded-xl overflow-hidden mb-3 border border-black/5 dark:border-white/5 flex items-center justify-center">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={embedUrl} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="max-h-[250px]"
                  ></iframe>
                </div>
              )}

              <div className="relative flex items-center w-full">
                <div className="absolute left-3">
                  <svg className="w-4 h-4 text-black/40 dark:text-white/40" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>
                </div>
                <input 
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Paste YouTube URL"
                  className="w-full bg-black/5 dark:bg-white/5 border border-transparent focus:border-black/20 dark:focus:border-white/20 text-black dark:text-white rounded-xl pl-9 pr-4 py-3 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
