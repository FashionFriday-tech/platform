'use client';

import React, { useState } from 'react';
import { PlusIcon } from '@ff/ui';
import { useCampaigns } from '../../campaigns/hooks/useCampaigns';
import { type BannerPlacement, PLACEMENT_ASPECT_RATIOS } from '../../campaigns/types';
import { BannerEditorModal } from '../../campaigns/components/BannerEditorModal';
import { CampaignBannerCard } from '../../campaigns/components/CampaignBannerCard';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';

export function WhatsAppReviewsFeature() {
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

  const placement: BannerPlacement = 'whatsapp-reviews';
  const sectionBanners = banners.filter((b) => b.placement === placement);
  const aspectRatioClass = PLACEMENT_ASPECT_RATIOS[placement] || 'aspect-[4/3]';

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
            WhatsApp Customer Reviews
          </h1>
          <p className="text-sm font-semibold text-black/60 dark:text-white/60">
            Manage WhatsApp chat reviews displayed on the storefront home page.
          </p>
        </div>
        <button
          onClick={() => handleOpenCreate(placement)}
          className="inline-flex items-center space-x-2 rounded-full bg-black px-4 py-2 text-xs font-black tracking-wider text-white uppercase transition-all hover:bg-black/90 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Review Card</span>
        </button>
      </div>

      {/* Grid of Banners */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Add Card Box */}
        <div
          onClick={() => handleOpenCreate(placement)}
          className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-dashed border-black/20 transition-all hover:border-black/50 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/50 dark:hover:bg-white/5"
        >
          <div className={`flex w-full items-center justify-center ${aspectRatioClass} bg-black/2 dark:bg-white/2`}>
            <div className="flex flex-col items-center gap-2 text-black/40 transition-colors group-hover:text-black dark:text-white/40 dark:group-hover:text-white">
              <PlusIcon className="h-8 w-8" />
              <span className="text-sm font-semibold">Add New Review Card</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-dashed border-black/10 p-4 dark:border-white/10">
            <div className="h-4 w-3/4 rounded bg-black/10 dark:bg-white/10" />
            <div className="h-3 w-1/2 rounded bg-black/5 dark:bg-white/5" />
          </div>
        </div>

        {/* Existing review cards */}
        {sectionBanners.map((banner) => (
          <div key={banner.id}>
            <CampaignBannerCard
              banner={banner}
              onUpdate={refreshBanners}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteConfirmId(id)}
              onToggleActive={handleToggleActive}
            />
          </div>
        ))}
      </div>

      {/* Modals */}
      <BannerEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBanner}
        initialData={editingBanner}
        fixedPlacement={targetPlacement || placement}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={async () => {
          if (deleteConfirmId) {
            await handleDeleteCampaign(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Review Card"
        message="Are you sure you want to delete this customer review card? This action is permanent."
        confirmText="Delete"
      />
    </div>
  );
}
