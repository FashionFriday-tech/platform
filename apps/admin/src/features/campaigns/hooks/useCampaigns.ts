'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_BANNERS, CampaignBanner, addBanner, updateBanner, BannerPlacement } from '../types';

export function useCampaigns() {
  const searchParams = useSearchParams();
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CampaignBanner | null>(null);
  const [targetPlacement, setTargetPlacement] = useState<BannerPlacement>('home-carousel');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingBanner(null);
      setTargetPlacement('home-carousel');
      setIsModalOpen(true);
    }
  }, [searchParams]);

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

  return {
    banners,
    isModalOpen,
    setIsModalOpen,
    editingBanner,
    targetPlacement,
    handleOpenCreate,
    handleOpenEdit,
    handleSaveBanner,
    refreshBanners,
  };
}
