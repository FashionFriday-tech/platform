'use client';

import React from 'react';
import Image from 'next/image';

import { type CampaignBanner, PLACEMENT_ASPECT_RATIOS } from '../types';

interface CampaignBannerCardProps {
  banner: CampaignBanner;
  onEdit: (banner: CampaignBanner) => void;
}

export function CampaignBannerCard({ banner, onEdit }: CampaignBannerCardProps) {
  const aspectRatioClass = PLACEMENT_ASPECT_RATIOS[banner.placement] ?? 'aspect-video';

  return (
    <div
      onClick={() => {
        onEdit(banner);
      }}
      className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg active:scale-[0.99] ${
        banner.isActive
          ? 'border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]'
          : 'border-black/5 bg-black/5 opacity-70 dark:border-white/5 dark:bg-white/5'
      }`}
    >
      <div className={`relative w-full bg-black/5 dark:bg-white/5 ${aspectRatioClass}`}>
        {banner.mediaType === 'image' ? (
          <Image
            src={banner.mediaUrl}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <video
            src={banner.mediaUrl}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
          />
        )}
      </div>
      <div className="flex flex-col gap-1 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-black dark:text-white">
            {banner.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              banner.isActive
                ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                : 'bg-zinc-500/10 text-zinc-500 dark:bg-zinc-500/20 dark:text-zinc-400'
            }`}
          >
            {banner.isActive ? 'Active' : 'Draft'}
          </span>
        </div>
        <p className="line-clamp-1 text-xs text-black/60 dark:text-white/60">
          Link: <span className="font-mono text-black dark:text-white">{banner.linkUrl}</span>
        </p>
      </div>
    </div>
  );
}
