import React from 'react';

interface AnimatedLogoProps {
  className?: string;
}

export function AnimatedLogo({ className = '' }: AnimatedLogoProps) {
  return (
    <div
      className={`relative inline-grid items-center justify-items-center text-center ${className}`}
      style={{ gridTemplateColumns: '1fr', gridTemplateRows: '1fr' }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@800;900&family=Hind:wght@700&display=swap');
          
          .font-arabic {
            font-family: 'Cairo', system-ui, -apple-system, sans-serif;
            font-weight: 800;
          }
          .font-hindi {
            font-family: 'Hind', system-ui, -apple-system, sans-serif;
            font-weight: 700;
          }

          @keyframes luxury-text-roll {
            0% { 
              opacity: 0; 
              transform: translate3d(0, 8px, 0); 
            }
            3.5% { 
              opacity: 1; 
              transform: translate3d(0, 0, 0); 
            }
            21.5% { 
              opacity: 1; 
              transform: translate3d(0, 0, 0); 
            }
            25% { 
              opacity: 0; 
              transform: translate3d(0, -8px, 0); 
            }
            25.01%, 100% { 
              opacity: 0; 
              transform: translate3d(0, 8px, 0); 
            }
          }

          .animate-zoom {
            animation: luxury-text-roll 20s cubic-bezier(0.16, 1, 0.3, 1) infinite;
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            opacity: 0;
            will-change: transform, opacity;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
          }
        `}
      </style>
      <span className="animate-zoom" style={{ animationDelay: '0s' }}>
        Fashion Friday
      </span>
      <span className="animate-zoom tracking-[0.1em]" style={{ animationDelay: '5s' }}>
        时尚星期五
      </span>
      <span className="animate-zoom font-hindi tracking-[0.05em]" style={{ animationDelay: '10s' }}>
        फैशन फ्राइडे
      </span>
      <span
        className="animate-zoom font-arabic tracking-[0.05em]"
        style={{ animationDelay: '15s' }}
        dir="rtl"
      >
        فاشن فرايدي
      </span>
    </div>
  );
}
