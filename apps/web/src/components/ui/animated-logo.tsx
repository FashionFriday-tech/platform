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

          @keyframes cinematic-zoom {
            0% { 
              opacity: 0; 
              transform: scale(0.8); 
              filter: blur(6px);
            }
            3% { 
              opacity: 1; 
              transform: scale(1); 
              filter: blur(0px);
            }
            22% { 
              opacity: 1; 
              transform: scale(1); 
              filter: blur(0px);
            }
            25%, 100% { 
              opacity: 0; 
              transform: scale(0.8); 
              filter: blur(6px);
            }
          }
          .animate-zoom {
            animation: cinematic-zoom 20s cubic-bezier(0.25, 1, 0.5, 1) infinite;
            grid-column: 1 / -1;
            grid-row: 1 / -1;
            opacity: 0;
            will-change: transform, opacity, filter;
          }
        `}
      </style>
      <span className="animate-zoom" style={{ animationDelay: '0s' }}>Fashion Friday</span>
      <span className="animate-zoom tracking-[0.1em]" style={{ animationDelay: '5s' }}>时尚星期五</span>
      <span className="animate-zoom font-hindi tracking-[0.05em]" style={{ animationDelay: '10s' }}>फैशन फ्राइडे</span>
      <span className="animate-zoom font-arabic tracking-[0.05em]" style={{ animationDelay: '15s' }} dir="rtl">فاشن فرايدي</span>
    </div>
  );
}
