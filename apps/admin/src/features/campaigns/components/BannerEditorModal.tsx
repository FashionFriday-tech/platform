'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { CloseIcon, ImageIcon, PlayIcon, PlusIcon } from '@ff/ui';

import {
  type BannerPlacement,
  type CampaignBanner,
  type MediaType,
  PLACEMENT_ASPECT_RATIOS,
} from '../types';

interface BannerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bannerData: Partial<CampaignBanner>) => void;
  initialData?: CampaignBanner | null;
  fixedPlacement?: BannerPlacement;
}

export function BannerEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  fixedPlacement,
}: BannerEditorModalProps) {
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [linkUrl, setLinkUrl] = useState('');
  const [placement, setPlacement] = useState<BannerPlacement>('home-carousel');
  const [isUploading, setIsUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setMediaUrl(initialData.mediaUrl);
      setMediaType(initialData.mediaType);
      setLinkUrl(initialData.linkUrl);
      setPlacement(initialData.placement);
      setFileToUpload(null);
    } else {
      setTitle('');
      setMediaUrl('');
      setMediaType('image');
      setLinkUrl('');
      setPlacement(fixedPlacement || 'home-carousel');
      setFileToUpload(null);
    }
  }, [initialData, isOpen, fixedPlacement]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalMediaUrl = mediaUrl;

      if (fileToUpload) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('slug', title.trim());
        formData.append('folder', `campaigns/${placement}`);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002'}/admin/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        finalMediaUrl = data.url;
      }

      onSave({ title, mediaUrl: finalMediaUrl, mediaType, linkUrl, placement });
      setFileToUpload(null);
    } catch (err) {
      alert('Failed to upload banner media. Please try again.');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  const getResponsiveClasses = (p: BannerPlacement) => {
    switch (p) {
      case 'products-list':
        return 'w-full aspect-[21/9]';
      case 'home-carousel':
        return 'h-[300px] md:h-[350px] w-auto aspect-[2/3]';
      case 'home-categories':
        return 'h-[300px] md:h-[350px] w-auto aspect-square';
      case 'trending-products':
        return 'h-[300px] md:h-[350px] w-auto aspect-[3/4]';
      default:
        return 'w-full aspect-video';
    }
  };


  const responsiveClass = getResponsiveClasses(placement);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row dark:bg-[#111111]">
        {/* Left Side: Preview & Upload */}
        <div className="flex w-full flex-col items-center justify-center border-b border-black/5 bg-black/5 p-8 md:w-1/2 md:border-r md:border-b-0 dark:border-white/5 dark:bg-white/5">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-black/20 bg-white transition-all hover:border-black/50 dark:border-white/20 dark:bg-[#111111] dark:hover:border-white/50 ${responsiveClass}`}
          >
            {mediaUrl ? (
              <>
                {mediaType === 'image' ? (
                  <Image src={mediaUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <video
                    src={mediaUrl}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {mediaType === 'image' ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <PlayIcon className="h-4 w-4" />
                  )}
                  {mediaType.toUpperCase()}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black">
                    Change Media
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-2 text-black/40 transition-colors group-hover:text-black dark:text-white/40 dark:group-hover:text-white">
                <PlusIcon className="h-8 w-8" />
                <span className="text-sm font-semibold">Click to upload from Gallery</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex w-full flex-col overflow-y-auto md:w-1/2">
          <div className="flex items-center justify-between border-b border-black/5 p-6 dark:border-white/5">
            <h2 className="text-xl font-bold text-black dark:text-white">
              {initialData ? 'Edit Banner' : 'Create Banner'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <CloseIcon className="h-5 w-5 text-black/60 dark:text-white/60" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black dark:text-white">
                Banner Title
              </label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                placeholder="e.g. Summer Collection Promo"
                className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black dark:text-white">
                Link Destination
              </label>
              <input
                required
                type="text"
                value={linkUrl}
                onChange={(e) => {
                  setLinkUrl(e.target.value);
                }}
                placeholder="e.g. /collections/summer"
                className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-2.5 font-mono text-sm text-black outline-none focus:border-black/30 dark:border-white/10 dark:text-white dark:focus:border-white/30"
              />
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!mediaUrl || isUploading}
                className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-black/90 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                {isUploading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
