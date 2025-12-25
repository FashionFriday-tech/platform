"use client"
import { useState } from "react";

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      src: "/images/poster/1.png",
      alt: "Slide 1",
    },
    {
      id: 2,
      src: "/images/poster/2.png",
      alt: "Slide 2",
    },
    {
      id: 3,
      src: "/images/poster/3.png",
      alt: "Slide 3",
    },
    {
      id: 4,
      src: "/images/poster/4.png",
      alt: "Slide 3",
    },
  ];

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-4xl bg-black">
      <style>{`
        @keyframes fillBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .progress-bar-fill {
          height: 100%;
          background-color: white;
          width: 0%;
          border-radius: 9999px;
          animation: fillBar 5s linear forwards; 
        }
      `}</style>

      {/* Images */}
      {slides.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-3">
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ease-out ${
                isActive ? "w-12 bg-white/30" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
            >
              {isActive && (
                <div
                  key={index} 
                  className="progress-bar-fill"
                  onAnimationEnd={handleNextSlide} 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageCarousel;