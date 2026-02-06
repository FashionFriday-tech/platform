"use client";

import React, { useState } from "react";
import { PackageIcon, TagIcon } from "@ff/ui";
import Image from "next/image";

export default function SourcingSection() {
  const [formData, setFormData] = useState({ productName: "", category: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const categories = [
    "Sneakers",
    "Apparel",
    "Luxury Bags",
    "Accessories",
    "Other",
  ];

  const validate = () => {
    let newErrors: { [key: string]: string } = {};
    if (formData.productName.trim().length < 3) {
      newErrors.productName = "Product name is too short";
    } else if (formData.productName.length > 30) {
      newErrors.productName = "Maximum 30 characters allowed";
    }
    if (!formData.category) newErrors.category = "Please select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log("Request Submitted", formData);
      // Add success toast or logic here
    }, 1200);
  };

  return (
    <div className="flex justify-center items-center my-10">
      <div className="w-full max-w-6xl border-2 border-foreground-subtle overflow-hidden rounded-[2.5rem] bg-background lg:grid lg:grid-cols-2 lg:items-stretch">
        <div className="hidden lg:block relative min-h-[600px] border-r border-foreground-subtle group">
        <Image
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop" // Luxe sneaker sourcing theme
          alt="Personal Sourcing Service"
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground-muted mb-2">
            Bespoke Service
          </p>
          <h4 className="text-3xl font-black uppercase italic tracking-tighter text-foreground">
            Sourcing <br /> The Unattainable
          </h4>
        </div>
      </div>

      {/* RIGHT: FORM SECTION */}
      <div className="p-8 lg:p-16 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl font-black uppercase text-forground mb-2">
            Couldn’t Find It?
          </h3>
          <p className="text-foreground-muted text-sm max-w-sm font-medium">
            Missing something from our store? Drop the details and we’ll try to
            source it for you.
          </p>

        <form
          onSubmit={handleSourceSubmit}
          className="space-y-4 w-full max-w-xl mt-10 text-start"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PRODUCT NAME */}
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted mb-3 px-6">
                Product Name
              </label>
              <div
                className={`flex items-center gap-4 border-2 rounded-full px-6 py-4 transition-all bg-foreground/[0.02] ${
                  errors.productName
                    ? "border-red-500"
                    : "border-foreground-subtle focus-within:border-foreground"
                }`}
              >
                <PackageIcon size={18} className="text-foreground-muted" />
                <input
                  type="text"
                  placeholder="e.g. Jordan 1 High"
                  className="w-full bg-transparent text-foreground outline-none placeholder:text-foreground-muted/40 text-sm"
                  value={formData.productName}
                  onChange={(e) => {
                    setFormData({ ...formData, productName: e.target.value });
                    if (errors.productName) setErrors({});
                  }}
                />
              </div>
              <div className="h-4 mt-2 px-6">
                {errors.productName && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    {errors.productName}
                  </p>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-muted mb-3 px-6">
                Category
              </label>
              <div
                className={`flex items-center gap-4 border-2 rounded-full px-6 py-4 transition-all bg-foreground/[0.02] ${
                  errors.category
                    ? "border-red-500"
                    : "border-foreground-subtle focus-within:border-foreground"
                }`}
              >
                <TagIcon size={18} className="text-foreground-muted" />
                <select
                  className="w-full bg-transparent text-foreground outline-none cursor-pointer text-sm appearance-none"
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    if (errors.category) setErrors({});
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
              <div className="h-4 mt-2 px-6">
                {errors.category && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-foreground text-background font-black py-4 px-10 rounded-full flex items-center justify-center uppercase tracking-[0.1em] group hover:bg-foreground/90 transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? "Sending the Request..." : "I Need This Product"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
