'use client';

import React, { useState } from 'react';
import { PackageIcon, TagIcon } from '@ff/ui';
import Image from 'next/image';

export default function SourcingSection() {
  const [formData, setFormData] = useState({ productName: '', category: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const categories = ['Sneakers', 'Apparel', 'Luxury Bags', 'Accessories', 'Other'];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
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

  const handleSourceSubmit = (e: React.FormEvent) => {
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
      <div className="border-foreground-subtle bg-background w-full max-w-6xl overflow-hidden rounded-[2.5rem] border-2 lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="border-foreground-subtle group relative hidden min-h-150 border-r lg:block">
          <Image
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" // Luxe sneaker sourcing theme
            alt="Personal Sourcing Service"
            fill
            className="object-cover grayscale transition-all duration-700 hover:grayscale-0"
          />
          <div className="from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent opacity-80" />
          <div className="absolute right-12 bottom-12 left-12">
            <p className="text-foreground-muted mb-2 text-[10px] font-black tracking-[0.4em] uppercase">
              Bespoke Service
            </p>
            <h4 className="text-foreground text-3xl font-black tracking-tighter uppercase italic">
              Sourcing <br /> The Unattainable
            </h4>
          </div>
        </div>

        {/* RIGHT: FORM SECTION */}
        <div className="flex flex-col items-center justify-center p-8 text-center lg:p-16">
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
              className="bg-foreground text-background group hover:bg-foreground/90 mt-6 flex w-full items-center justify-center rounded-full px-10 py-4 font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending the Request...' : 'I Need This Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
