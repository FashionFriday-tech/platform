// eslint-disable-next-line unicorn/filename-case
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  addBanner,
  type BannerPlacement,
  type CampaignBanner,
  MOCK_BANNERS,
  updateBanner,
} from '../types';

export function useCampaigns() {
  const searchParams = useSearchParams();
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CampaignBanner | null>(null);
  const [targetPlacement, setTargetPlacement] = useState<BannerPlacement>('home-carousel');

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingBanner(null);
      setTargetPlacement('home-carousel');
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const refreshBanners = () => {
    setBanners([...MOCK_BANNERS]);
  };

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title: data.title!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mediaUrl: data.mediaUrl!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        mediaType: data.mediaType!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        linkUrl: data.linkUrl!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
