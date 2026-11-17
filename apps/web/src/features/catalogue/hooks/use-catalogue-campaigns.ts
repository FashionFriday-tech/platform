'use client';

import { useEffect, useState } from 'react';

import { fetcher } from '@/lib/api-client';

export interface CatalogueCampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  placement: string;
  isActive: boolean;
}

export function useCatalogueCampaigns(initialCampaigns?: CatalogueCampaignBanner[]) {
  const [campaigns, setCampaigns] = useState<CatalogueCampaignBanner[]>(() => {
    if (initialCampaigns && Array.isArray(initialCampaigns)) {
      return initialCampaigns.filter(
        (b) => (b.placement === 'products-list' || b.placement === 'catalogue') && b.isActive,
      );
    }
    return [];
  });

  useEffect(() => {
    let isMounted = true;

    const loadCampaigns = async () => {
      try {
        const data = await fetcher<CatalogueCampaignBanner[]>('/campaigns');
        if (isMounted && Array.isArray(data)) {
          const activeCatalogueBanners = data.filter(
            (b) => (b.placement === 'products-list' || b.placement === 'catalogue') && b.isActive,
          );
          setCampaigns(activeCatalogueBanners);
        }
      } catch (err) {
        console.error('Failed to fetch catalogue campaigns:', err);
      }
    };

    void loadCampaigns();

    return () => {
      isMounted = false;
    };
  }, []);

  return { campaigns };
}
