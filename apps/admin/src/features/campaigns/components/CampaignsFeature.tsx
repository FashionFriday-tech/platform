'use client';

import React, { useState } from 'react';

import { PlusIcon } from '@ff/ui';

import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { useCampaigns } from '../hooks/useCampaigns';
import { type BannerPlacement, PLACEMENT_ASPECT_RATIOS, PLACEMENT_LABELS } from '../types';
import { BannerEditorModal } from './BannerEditorModal';
import { CampaignBannerCard } from './CampaignBannerCard';

export function CampaignsFeature() {
  const {
    banners,
    isModalOpen,
    setIsModalOpen,
    editingBanner,
    targetPlacement,
    handleOpenCreate,
    handleOpenEdit,
    handleSaveBanner,
    handleToggleActive,
    handleDeleteCampaign,
    refreshBanners,
  } = useCampaigns();

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const renderSection = (placement: BannerPlacement) => {
    const sectionBanners = banners.filter((b) => b.placement === placement);
    const aspectRatioClass = PLACEMENT_ASPECT_RATIOS[placement] ?? 'aspect-video';

    let cardWidthClass = 'w-[300px]';
    if (placement === 'products-list') {
      cardWidthClass = 'w-[450px] md:w-[600px]';
    } else if (placement === 'home-carousel' || placement === 'trending-products') {
      cardWidthClass = 'w-[220px] md:w-[260px]';
    } else if (placement === 'home-categories') {
      cardWidthClass = 'w-[260px] md:w-[300px]';
    } else if (placement === 'content-partners') {
      cardWidthClass = 'w-[200px] md:w-[240px]';
    }

    return (
      <section key={placement} className="mb-10 w-full overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {PLACEMENT_LABELS[placement]}
          </h2>
        </div>
        <div className="scrollbar-hide flex snap-x gap-6 overflow-x-auto pb-4">
          {sectionBanners.map((banner) => (
            <div key={banner.id} className={`${cardWidthClass} shrink-0 snap-start`}>
              <CampaignBannerCard
                banner={banner}
                onUpdate={refreshBanners}
                onEdit={handleOpenEdit}
                onDelete={(id) => {
                  setDeleteConfirmId(id);
                }}
                onToggleActive={handleToggleActive}
              />
            </div>
          ))}

          {/* Dedicated Add Box for this placement (Hidden for fixed 2-card category cards) */}
          {placement !== 'home-categories' && (
            <div
              onClick={() => {
                handleOpenCreate(placement);
              }}
              className={`group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-dashed border-black/20 transition-all hover:border-black/50 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/50 dark:hover:bg-white/5 ${cardWidthClass} shrink-0 snap-start`}
            >
              <div
                className={`flex w-full items-center justify-center ${aspectRatioClass} bg-black/2 dark:bg-white/2`}
              >
                <div className="flex flex-col items-center gap-2 text-black/40 transition-colors group-hover:text-black dark:text-white/40 dark:group-hover:text-white">
                  <PlusIcon className="h-8 w-8" />
                  <span className="text-sm font-semibold">Add {PLACEMENT_LABELS[placement]}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-dashed border-black/10 p-4 dark:border-white/10">
                <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-black/5 dark:bg-white/5" />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const placementOrder: BannerPlacement[] = [
    'home-carousel',
    'home-categories',
    'products-list',
    'trending-products',
    'content-partners',
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
        <div className="flex flex-col">{placementOrder.map(renderSection)}</div>
      </div>

      <BannerEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        onSave={handleSaveBanner}
        initialData={editingBanner}
        fixedPlacement={targetPlacement}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteConfirmId) {
            void handleDeleteCampaign(deleteConfirmId);
          }
        }}
        onClose={() => {
          setDeleteConfirmId(null);
        }}
      />
    </div>
  );
}
