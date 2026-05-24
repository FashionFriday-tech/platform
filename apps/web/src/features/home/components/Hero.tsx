import type { JSX } from 'react';
import Image from 'next/image';

export default function Hero(): JSX.Element {
  const cards = [
    { 
      id: 1, 
      src: '/images/hero/hero-grid1.png', 
      title: 'LINEN EDIT', 
      subtitle: 'SOFT ON SKIN.\nSHARP ON STYLE.' 
    },
    { 
      id: 2, 
      src: '/images/poster/1.png', 
      title: 'NEW IN', 
      subtitle: '' 
    },
    { 
      id: 3, 
      src: '/images/hero/hero-grid2.png', 
      title: 'ACCESSORIES', 
      subtitle: 'FINISHING TOUCH' 
    },
    { 
      id: 4, 
      src: '/images/poster/2.png', 
      title: 'STREET WEAR', 
      subtitle: 'URBAN ESSENTIALS' 
    },
  ];

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
      
      {/* 
        We use a wrapper with flex and max-content width to ensure the children dictate the width.
        The animation translates the entire track seamlessly.
      */}
      <div className="carousel-track h-[60vh] items-stretch gap-4 px-2 lg:h-[80vh] lg:gap-6">
        {repeatedCards.map((card, idx) => (
          <div 
            key={`${card.id}-${idx}`} 
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
            

          </div>
        ))}
      </div>
    </section>
  );
}
