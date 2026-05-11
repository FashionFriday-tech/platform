'use client';

import React from 'react';
import Image from 'next/image';

import { ImageIcon, PlayIcon, TrashIcon } from '@ff/ui';

import {
  type CampaignBanner,
  deleteBanner,
  PLACEMENT_ASPECT_RATIOS,
  PLACEMENT_LABELS,
  updateBanner,
} from '../types';

interface CampaignBannerCardProps {
  banner: CampaignBanner;
  onUpdate: () => void;
  onEdit: (banner: CampaignBanner) => void;
}

export function CampaignBannerCard({ banner, onUpdate, onEdit }: CampaignBannerCardProps) {
  const handleToggleActive = () => {
    updateBanner(banner.id, { isActive: !banner.isActive });
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteBanner(banner.id);
      onUpdate();
    }
  };

  const aspectRatioClass = PLACEMENT_ASPECT_RATIOS[banner.placement] || 'aspect-video';

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${banner.isActive ? 'border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]' : 'border-black/5 bg-black/5 opacity-70 dark:border-white/5 dark:bg-white/5'}`}
    >
      <div className={`relative w-full bg-black/5 dark:bg-white/5 ${aspectRatioClass}`}>
        {banner.mediaType === 'image' ? (
          <Image src={banner.mediaUrl} alt={banner.title} fill className="object-cover" />
        ) : (
          <video
            src={banner.mediaUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => {
              onEdit(banner);
            }}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black shadow-xl transition-all hover:scale-105 hover:bg-gray-50"
          >
            Edit Banner
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center rounded-xl bg-red-500 p-2.5 text-white shadow-xl transition-all hover:scale-105 hover:bg-red-600"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
          {banner.mediaType === 'image' ? (
            <ImageIcon className="h-3 w-3" />
          ) : (
            <PlayIcon className="h-3 w-3" />
          )}
          {PLACEMENT_LABELS[banner.placement] || banner.placement}
        </div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="line-clamp-1 font-bold text-black dark:text-white">{banner.title}</h3>
            <p className="mt-1 line-clamp-1 text-xs text-black/60 dark:text-white/60">
              Link: <span className="font-mono text-black dark:text-white">{banner.linkUrl}</span>
            </p>
          </div>
          <button
            onClick={handleToggleActive}
            title={banner.isActive ? 'Deactivate' : 'Activate'}
            className={`relative ml-4 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
              banner.isActive ? 'bg-black dark:bg-white' : 'bg-black/20 dark:bg-white/20'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                banner.isActive ? 'translate-x-4 bg-white dark:bg-black' : 'translate-x-1 bg-white'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
