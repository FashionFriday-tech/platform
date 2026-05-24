'use client';

import { type JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CampaignBanner {
  id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  placement: string;
  isActive: boolean;
}

export default function Hero(): JSX.Element {
  const defaultCards = [
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

  const [cards, setCards] = useState(defaultCards);

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

  // Duplicate cards for seamless infinite scroll (CSS marquee)
  const repeatedCards = [...cards, ...cards, ...cards];

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden p-2 pb-6 lg:mt-24 lg:min-h-[85vh] lg:p-6">
      <style>{`
        @keyframes auto-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .carousel-track {
          display: flex;
          width: max-content;
          animation: auto-scroll 45s linear infinite;
        }
        .carousel-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="carousel-track h-[60vh] items-stretch gap-4 px-2 lg:h-[80vh] lg:gap-6">
        {repeatedCards.map((card, idx) => (
          <Link 
            key={`${card.id}-${idx}`} 
            href={card.linkUrl || '/products'}
            className="group relative h-full aspect-[2/3] shrink-0 overflow-hidden rounded-4xl bg-black/5 dark:bg-white/5"
          >
            <Image
              src={card.src}
              alt={card.title || 'Hero image'}
              fill
              sizes="(max-width: 768px) 85vw, (max-width: 1024px) 60vw, 40vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority={idx < 2} // Load first couple images immediately
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
