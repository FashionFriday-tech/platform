'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { type BannerPlacement, type CampaignBanner } from '../types';

export function useCampaigns() {
  const searchParams = useSearchParams();
  const [banners, setBanners] = useState<CampaignBanner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CampaignBanner | null>(null);
  const [targetPlacement, setTargetPlacement] = useState<BannerPlacement>('home-carousel');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/campaigns`);
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setEditingBanner(null);
      setTargetPlacement('home-carousel');
      setIsModalOpen(true);
    }
  }, [searchParams]);

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

  const handleSaveBanner = async (data: Partial<CampaignBanner>) => {
    try {
      if (editingBanner) {
        const res = await fetch(`${API_URL}/admin/campaigns/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          throw new Error('Failed to update campaign');
        }
      } else {
        const res = await fetch(`${API_URL}/admin/campaigns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            isActive: true,
          }),
        });
        if (!res.ok) {
          throw new Error('Failed to create campaign');
        }
      }
      fetchBanners();
      setIsModalOpen(false);
    } catch (error) {
      alert('Error saving campaign. Please try again.');
      console.error(error);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) {
        throw new Error('Failed to toggle campaign status');
      }
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/campaigns/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete campaign');
      }
      fetchBanners();
    } catch (error) {
      alert('Error deleting campaign. Please try again.');
      console.error(error);
    }
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
    handleToggleActive,
    handleDeleteCampaign,
    refreshBanners: fetchBanners,
  };
}
