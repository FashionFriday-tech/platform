'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { PackageIcon, TagIcon } from '@ff/ui';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PackageIcon, ImageIcon } from '@ff/ui';
import { useAuthStore } from '@/store/auth-store';
import { fetcher } from '@/lib/api-client';

export default function SourcingSection() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [productName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (productName.trim().length < 3) {
      newErrors.productName = 'Product name must be at least 3 characters';
    } else if (productName.length > 50) {
      newErrors.productName = 'Maximum 50 characters allowed';
    }
    if (!selectedFile) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleSourceSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      // Direct user to login page if unauthenticated
      router.push('/login');
      return;
    }

    if (!validate()) {
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
      // Fetch user auth token from local storage to attach to request header
      const token = localStorage.getItem('accessToken');

      const res = await fetch(`${API_URL}/product-requests`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Sourcing request failed.');
      }

      setSuccessMsg('Your request has been filed successfully! We will get in touch with you.');
      setProductName('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrors({ submit: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
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

          {/* Crossed Banner 1 */}
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

          {/* Crossed Banner 2 */}
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
            {successMsg && (
              <div className="mb-6 rounded-2xl bg-green-500/10 p-4 border border-green-500/20">
                <p className="text-xs font-bold tracking-wider text-green-500 uppercase">{successMsg}</p>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 rounded-2xl bg-red-500/10 p-4 border border-red-500/20">
                <p className="text-xs font-bold tracking-wider text-red-500 uppercase">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* PRODUCT NAME */}
              <div className="flex flex-col">
                <label className="text-foreground-muted mb-3 px-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Product Name
                </label>
                <div
                  className={`bg-foreground/2 flex items-center gap-4 rounded-full border-2 px-6 py-4 transition-all ${
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
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (errors.productName) {
                        setErrors((prev) => ({ ...prev, productName: '' }));
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

              {/* IMAGE UPLOAD */}
              <div className="flex flex-col">
                <label className="text-foreground-muted mb-3 px-6 text-[10px] font-black tracking-[0.2em] uppercase">
                  Product Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`bg-foreground/2 flex items-center gap-4 rounded-full border-2 px-6 py-4 cursor-pointer transition-all ${
                    errors.image
                      ? 'border-red-500'
                      : 'border-foreground-subtle hover:border-foreground'
                  }`}
                >
                  <ImageIcon size={18} className="text-foreground-muted" />
                  <span className="text-foreground-muted/60 text-sm truncate">
                    {selectedFile ? selectedFile.name : 'Upload from Gallery'}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="mt-2 h-4 px-6">
                  {errors.image && (
                    <p className="animate-in fade-in slide-in-from-top-1 text-[10px] font-bold tracking-widest text-red-500 uppercase">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Image block */}
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
                  <Image src={previewUrl} alt="Upload Preview" fill className="object-cover" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-foreground text-background hover:bg-foreground/90 group mt-6 flex w-full items-center justify-center rounded-full px-10 py-4 font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {!user
                ? 'Login to File Request'
                : loading
                ? 'Sending the Request...'
                : 'I Need This Product'}
            </button>
          </form>
      </div>
    </div>
  );
}
