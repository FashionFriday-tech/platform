'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

export interface HeroCard {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  linkUrl: string;
}

interface CampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  placement: string;
  isActive: boolean;
}

const DEFAULT_CARDS: HeroCard[] = [
  { 
    id: 'd1', 
    src: '/images/hero/hero-grid1.png', 
    title: 'LINEN EDIT', 
    subtitle: 'SOFT ON SKIN.\nSHARP ON STYLE.',
    linkUrl: '/products'
  },
  { 
    id: 'd2', 
    src: '/images/poster/1.png', 
    title: 'NEW IN', 
    subtitle: '',
    linkUrl: '/products'
  },
  { 
    id: 'd3', 
    src: '/images/hero/hero-grid2.png', 
    title: 'ACCESSORIES', 
    subtitle: 'FINISHING TOUCH',
    linkUrl: '/products'
  },
  { 
    id: 'd4', 
    src: '/images/poster/2.png', 
    title: 'STREET WEAR', 
    subtitle: 'URBAN ESSENTIALS',
    linkUrl: '/products'
  },
];

export function useHeroCarousel() {
  const [cards, setCards] = useState<HeroCard[]>(DEFAULT_CARDS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch campaigns
  useEffect(() => {
    const loadHeroBanners = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3002';
        const res = await fetch(`${apiUrl}/campaigns`);
        if (res.ok) {
          const data: CampaignBanner[] = await res.json();
          const carouselBanners = data.filter(b => b.placement === 'home-carousel' && b.isActive);
          if (carouselBanners.length > 0) {
            setCards(
              carouselBanners.map(b => ({
                id: b.id,
                src: b.mediaUrl,
                title: b.title,
                subtitle: '',
                linkUrl: b.linkUrl
              }))
            );
          }
        }
      } catch (err) {
        console.error('Failed to load hero banners from API:', err);
      }
    };
    loadHeroBanners();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isPlaying) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, 3000);
  }, [cards.length, isPlaying]);

  useEffect(() => {
    if (cards.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cards.length, startTimer]);

  const goToCard = useCallback((index: number) => {
    setActiveIndex(index);
    startTimer(); // Reset the 3-second timer on manual navigation
  }, [startTimer]);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
    startTimer();
  }, [cards.length, startTimer]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    startTimer();
  }, [cards.length, startTimer]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    cards,
    activeIndex,
    isPlaying,
    goToCard,
    nextCard,
    prevCard,
    togglePlay,
  };
}
