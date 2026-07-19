'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

export const DEFAULT_HERO_CARDS: HeroCard[] = [
  {
    id: 'default-hero-1',
    src: '/images/placeholders/1.png',
    title: 'New Season Drops',
    subtitle: 'Streetwear & Sneakers',
    linkUrl: '/new-arrivals',
  },
  {
    id: 'default-hero-2',
    src: '/images/placeholders/2.png',
    title: 'Exclusive Collection',
    subtitle: 'Style That Moves',
    linkUrl: '/category/men',
  },
  {
    id: 'default-hero-3',
    src: '/images/placeholders/3.png',
    title: 'Trending Footwear',
    subtitle: 'Step Into Friday',
    linkUrl: '/category/women',
  },
];

export function useHeroCarousel(initialCampaigns?: CampaignBanner[]) {
  const getMappedBanners = (banners: CampaignBanner[]): HeroCard[] => {
    return banners
      .filter((b) => b.placement === 'home-carousel' && b.isActive && Boolean(b.mediaUrl))
      .map((b) => ({
        id: b.id,
        src: b.mediaUrl,
        title: b.title || '',
        subtitle: '',
        linkUrl: b.linkUrl || '/products',
      }));
  };

  const mappedInitial = initialCampaigns ? getMappedBanners(initialCampaigns) : [];
  const initialCards = mappedInitial.length > 0 ? mappedInitial : DEFAULT_HERO_CARDS;

  const [cards, setCards] = useState<HeroCard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isInView, setIsInView] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const containerRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting);
      });
      observerRef.current.observe(node);
    }
  }, []);

  // Always re-sync live campaigns on client mount to ensure real-time updates in PWA/browser
  useEffect(() => {
    const loadHeroBanners = async () => {
      try {
        const data = await fetcher<CampaignBanner[]>('/campaigns');
        if (data && Array.isArray(data)) {
          const carouselBanners = getMappedBanners(data);
          if (carouselBanners.length > 0) {
            setCards(carouselBanners);
            try {
              localStorage.setItem('offline_hero_banners', JSON.stringify(carouselBanners));
            } catch {
              // ignore
            }
            return;
          }
        }
      } catch (err: unknown) {
        console.warn('Failed to load live hero banners from API, checking cache:', err);
        // Fallback to offline storage if offline
        try {
          const cached = localStorage.getItem('offline_hero_banners');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCards(parsed);
              return;
            }
          }
        } catch {
          // ignore
        }
      }
      // If neither API nor cache provided active banners, maintain default fallback cards
      setCards((prev) => (prev.length > 0 ? prev : DEFAULT_HERO_CARDS));
    };
    void loadHeroBanners();
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isPlaying || !isInView) {
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
  }, [isPlaying, isInView]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

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

  const nextCard = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
    startTimer();
  }, [startTimer]);

  const prevCard = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
    startTimer();
  }, [startTimer]);

  const goToCard = useCallback(
    (index: number) => {
      if (cards.length === 0) {
        return;
      }
      const currentMod = ((currentIndex % cards.length) + cards.length) % cards.length;
      let diff = index - currentMod;
      if (diff > cards.length / 2) {
        diff -= cards.length;
      }
      if (diff < -cards.length / 2) {
        diff += cards.length;
      }
      setCurrentIndex((prev) => prev + diff);
      startTimer(); // Reset the 3-second timer on manual navigation
    },
    [cards.length, currentIndex, startTimer],
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const activeIndex =
    cards.length > 0 ? ((currentIndex % cards.length) + cards.length) % cards.length : 0;

  return {
    cards,
    currentIndex,
    setCurrentIndex,
    activeIndex,
    isPlaying,
    goToCard,
    nextCard,
    prevCard,
    togglePlay,
    containerRef,
    isInView,
    pauseTimer,
    resumeTimer,
  };
}
