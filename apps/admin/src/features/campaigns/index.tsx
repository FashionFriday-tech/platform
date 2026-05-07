'use client';

import React, { useState } from 'react';
import { MOCK_BANNERS, CampaignBanner, addBanner, updateBanner, BannerPlacement, PLACEMENT_LABELS, PLACEMENT_ASPECT_RATIOS } from './types';
import { CampaignBannerCard } from './components/CampaignBannerCard';
import { BannerEditorModal } from './components/BannerEditorModal';
import { PlusIcon } from '@ff/ui';

export function CampaignsFeature() {
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CampaignBanner | null>(null);
  const [targetPlacement, setTargetPlacement] = useState<BannerPlacement>('home-carousel');

  const refreshBanners = () => setBanners([...MOCK_BANNERS]);

  const handleOpenCreate = (placement: BannerPlacement) => {
    setEditingBanner(null);
    setTargetPlacement(placement);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: CampaignBanner) => {
    setEditingBanner(banner);
    setTargetPlacement(banner.placement);
    setIsModalOpen(true);
  };

  const handleSaveBanner = (data: Partial<CampaignBanner>) => {
    if (editingBanner) {
      updateBanner(editingBanner.id, data);
    } else {
      const newBanner: CampaignBanner = {
        id: `b${Date.now()}`,
        title: data.title!,
        mediaUrl: data.mediaUrl!,
        mediaType: data.mediaType!,
        linkUrl: data.linkUrl!,
        placement: data.placement!,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addBanner(newBanner);
    }
    refreshBanners();
    setIsModalOpen(false);
  };

  const renderSection = (placement: BannerPlacement) => {
    const sectionBanners = banners.filter(b => b.placement === placement);
    const aspectRatioClass = PLACEMENT_ASPECT_RATIOS[placement] || 'aspect-video';

    return (
      <section key={placement} className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">{PLACEMENT_LABELS[placement]}</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sectionBanners.map(banner => (
            <CampaignBannerCard 
              key={banner.id} 
              banner={banner} 
              onUpdate={refreshBanners} 
              onEdit={handleOpenEdit} 
            />
          ))}
          
          {/* Dedicated Add Box for this placement */}
          <div 
            onClick={() => handleOpenCreate(placement)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-dashed border-black/20 transition-all hover:border-black/50 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/50 dark:hover:bg-white/5"
          >
            <div className={`flex w-full items-center justify-center ${aspectRatioClass} bg-black/2 dark:bg-white/2`}>
              <div className="flex flex-col items-center gap-2 text-black/40 transition-colors group-hover:text-black dark:text-white/40 dark:group-hover:text-white">
                <PlusIcon className="h-8 w-8" />
                <span className="text-sm font-semibold">Add {PLACEMENT_LABELS[placement]}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 border-t border-dashed border-black/10 dark:border-white/10">
              <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10"></div>
              <div className="h-3 w-1/2 rounded bg-black/5 dark:bg-white/5"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const placementOrder: BannerPlacement[] = [
    'home-carousel',
    'home-grid-large',
    'home-grid-small-1',
    'home-grid-small-2',
    'products-list',
    'trending-products'
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white">Campaigns & Banners</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Manage your storefront hero banners, carousels, and in-list promos.
          </p>
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col">
          {placementOrder.map(renderSection)}
        </div>
      </div>

      <BannerEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBanner}
        initialData={editingBanner}
        fixedPlacement={targetPlacement}
      />
    </div>
  );
}
