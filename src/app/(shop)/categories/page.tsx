"use client";

import Link from "next/link";

const categories = [
  { name: "Sneakers", category: "sneakers", imageBg: "/images/store/sneakers.png" },
  { name: "Watches", category: "watches", imageBg: "/images/store/watches.png" },
  { name: "Clothes", category: "cloths", imageBg: "/images/store/cloths.png" },
  { name: "Slippers", category: "slippers", imageBg: "/images/store/slippers.png" },
  { name: "Accessories", category: "accessories", imageBg: "/images/store/accessories.png" },
];

export default function StoreLandingPage() {
  return (
    <div className="min-h-screen pb-24 pt-6 sm:py-20 sm:px-6 lg:px-8 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.category}
            href={`/categories/${category.category}`}
            className={`group relative flex transition-transform duration-500 active:scale-95 ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            } sm:justify-normal`}
          >
            <div
              className={`relative w-[92%] sm:w-full aspect-4/3 sm:aspect-3/4 overflow-hidden
                ${index % 2 === 0 ? "rounded-r-4xl" : "rounded-l-4xl"}`}
            >
              {/* Background Image with Hover Zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.imageBg})` }}
              />

              {/* Text Label - Glassmorphism */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="backdrop-blur-md bg-background/20 border border-white/10 inline-flex items-center px-5 py-2 rounded-2xl">
                  <h3 className="text-white text-sm sm:text-lg font-black uppercase tracking-widest">
                    {category.name}
                  </h3>
                </div>
              </div>

              {/* Interaction Ring (Visible on Hover) */}
              <div className="absolute inset-0 border-4 border-brand opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[inherit]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}