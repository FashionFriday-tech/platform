'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { PackageIcon, TagIcon } from '@ff/ui';

export default function SourcingSection() {
  const [formData, setFormData] = useState({ productName: '', category: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const categories = ['Sneakers', 'Apparel', 'Luxury Bags', 'Accessories', 'Other'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (formData.productName.trim().length < 3) {
      newErrors.productName = 'Product name is too short';
    } else if (formData.productName.length > 30) {
      newErrors.productName = 'Maximum 30 characters allowed';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSourceSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="my-10 flex items-center justify-center">
      <div className="bg-background w-full max-w-6xl overflow-hidden rounded-[2.5rem] lg:flex lg:items-stretch lg:justify-between gap-8">
        <div className="group relative hidden min-h-[500px] lg:block overflow-hidden rounded-[2rem] flex-1">
          {/* Main Sourcing Image */}
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
            alt="Personal Sourcing Service"
            fill
            className="object-cover grayscale transition-transform duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
          {/* Deep Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 transition-opacity duration-500" />

          {/* Crossed Banner 1 - Glassmorphic Dark Ribbon (Slanted Top-Left to Bottom-Right) */}
          <div className="absolute w-[180%] top-[30%] -left-[40%] -rotate-12 bg-black/85 backdrop-blur-md py-3 border-y border-white/10 select-none pointer-events-none whitespace-nowrap overflow-hidden z-10 flex">
            <div className="animate-marquee flex w-max gap-8 px-4 text-white text-[10px] font-black tracking-[0.3em] uppercase">
              {Array(8).fill('SOURCING THE UNATTAINABLE • ').map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  {text}
                  <span className="bg-[#FF0000] h-1.5 w-1.5 rounded-full shrink-0" />
                </span>
              ))}
            </div>
          </div>

          {/* Crossed Banner 2 - Pure Red Ribbon (Slanted Bottom-Left to Top-Right) */}
          <div className="absolute w-[180%] bottom-[30%] -left-[40%] rotate-6 bg-[#FF0000] py-3 border-y border-white/20 select-none pointer-events-none whitespace-nowrap overflow-hidden z-10 flex">
            <div className="animate-marquee flex w-max gap-8 px-4 text-white text-[10px] font-black tracking-[0.3em] uppercase">
              {Array(8).fill('LIMITED EDITION DROP • ').map((text, i) => (
                <span key={i} className="flex items-center gap-2">
                  {text}
                  <span className="bg-white h-1.5 w-1.5 rounded-full shrink-0" />
                </span>
              ))}
            </div>
          </div>

          {/* Content Info overlay */}
          <div className="absolute bottom-10 left-10 right-10 z-20">
            <p className="text-[#FF0000] mb-2 text-xs font-bold tracking-[0.4em] uppercase">
              Bespoke Service
            </p>
            <h4 className="text-white text-4xl font-black tracking-tighter uppercase leading-none">
              Sourcing <br /> The Unattainable
            </h4>
          </div>
        </div>

        {/* RIGHT: FORM SECTION */}
        <div className="flex flex-col items-center justify-center p-8 text-center lg:p-16 flex-1">
          <h3 className="text-forground mb-2 text-3xl font-black uppercase">Couldn’t Find It?</h3>
          <p className="text-foreground-muted max-w-sm text-sm font-medium">
            Missing something from our store? Drop the details and we’ll try to source it for you.
          </p>

          <form
            onSubmit={handleSourceSubmit}
            className="mt-10 w-full max-w-xl space-y-4 text-start"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* PRODUCT NAME */}
              <div className="flex flex-col">
                <label className="text-foreground-muted mb-3 px-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Product Name
                </label>
                <div
                  className={`bg-foreground/2] flex items-center gap-4 rounded-full border-2 px-6 py-4 transition-all ${
                    errors.productName
                      ? 'border-red-500'
                      : 'border-foreground-subtle focus-within:border-foreground'
                  }`}
                >
                  <PackageIcon size={18} className="text-foreground-muted" />
                  <input
                    type="text"
                    placeholder="e.g. Jordan 1 High"
                    className="text-foreground placeholder:text-foreground-muted/40 w-full bg-transparent text-sm outline-none"
                    value={formData.productName}
                    onChange={(e) => {
                      setFormData({ ...formData, productName: e.target.value });
                      if (errors.productName) {
                        setErrors({});
                      }
                    }}
                  />
                </div>
                <div className="mt-2 h-4 px-6">
                  {errors.productName && (
                    <p className="animate-in fade-in slide-in-from-top-1 text-[10px] font-bold tracking-widest text-red-500 uppercase">
                      {errors.productName}
                    </p>
                  )}
                </div>
              </div>

              {/* CATEGORY */}
              <div className="flex flex-col">
                <label className="text-foreground-muted mb-3 px-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Category
                </label>
                <div
                  className={`bg-foreground/2 flex items-center gap-4 rounded-full border-2 px-6 py-4 transition-all ${
                    errors.category
                      ? 'border-red-500'
                      : 'border-foreground-subtle focus-within:border-foreground'
                  }`}
                >
                  <TagIcon size={18} className="text-foreground-muted" />
                  <select
                    className="text-foreground w-full cursor-pointer appearance-none bg-transparent text-sm outline-none"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (errors.category) {
                        setErrors({});
                      }
                    }}
                  >
                    <option value="" className="bg-background">
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-background">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2 h-4 px-6">
                  {errors.category && (
                    <p className="animate-in fade-in slide-in-from-top-1 text-[10px] font-bold tracking-widest text-red-500 uppercase">
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background hover:bg-foreground/90 group mt-6 flex w-full items-center justify-center rounded-full px-10 py-4 font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending the Request...' : 'I Need This Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
