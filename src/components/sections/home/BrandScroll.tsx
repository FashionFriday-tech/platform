"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/magicUi/ScrollBasedVelocity";
import BrandLogo from "@/data/brandLogos";

// 1. DATA: Replace these with your actual logo paths later
const brands = [
  { name: "Absolut", logo: "/logos/absolut.png" },
  { name: "Ben & Jerrys", logo: "/logos/benjerry.png" },
  { name: "Canon", logo: "/logos/canon.png" },
  { name: "Capital One", logo: "/logos/capitalone.png" },
  { name: "Nike", logo: "/logos/nike.png" },
  { name: "Gucci", logo: "/logos/gucci.png" },
];

const BRAND_ROW_A = BrandLogo;
const BRAND_ROW_B = BrandLogo;

export default function BrandScroll() {
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="w-full py-12 lg:py-16 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Our Brand Collections
        </p>
      </div>

      {/* 3. The Sliding Track */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <ScrollVelocityContainer className="w-full">
          <ScrollVelocityRow baseVelocity={0.5} direction={1}>
            {BrandLogo.map(({ name, link }, idx) => (
              <img
                key={idx}
                src={link}
                alt={name}
                width={240}
                height={160}
                loading="lazy"
                decoding="async"
                className="mx-10 inline-block h-full w-30 rounded-lg object-cover"
              />
            ))}
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={0.5} direction={-1}>
            {BrandLogo.map(({ name, link }, idx) => (
              <img
                key={idx}
                src={link}
                alt={name}
                width={240}
                height={160}
                loading="lazy"
                decoding="async"
                className="mx-10 inline-block h-full w-30 rounded-lg object-cover"
              />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
      </div>
    </section>
  );
}
