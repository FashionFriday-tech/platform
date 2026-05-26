'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { fetcher } from '@/lib/api-client';

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

export function useHeroCarousel() {
  const [cards, setCards] = useState<HeroCard[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch campaign banners dynamically from database via NestJS API
  useEffect(() => {
    const loadHeroBanners = async () => {
      try {
        const data = await fetcher<CampaignBanner[]>('/campaigns');
        if (data && Array.isArray(data)) {
          const carouselBanners = data.filter((b) => b.placement === 'home-carousel' && b.isActive);
          if (carouselBanners.length > 0) {
            setCards(
              carouselBanners.map((b) => ({
                id: b.id,
                src: b.mediaUrl,
                title: b.title,
                subtitle: '',
                linkUrl: b.linkUrl,
              })),
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
