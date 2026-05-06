import React from 'react';
import { motion } from 'motion/react';
import { Brand } from '@ff/schemas';
import Image from 'next/image';

interface BrandCardProps {
  brand: Brand;
  onClick: () => void;
}

export function BrandCard({ brand, onClick }: BrandCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:shadow-lg dark:border-white/5 dark:bg-[#111111]"
    >
      <div 
        className="h-52 w-full p-6 flex items-center justify-center transition-colors relative"
        style={{ backgroundColor: brand.color || '#000000' }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white mix-blend-overlay"></div>
        <Image width={500} height={500} 
          src={brand.logo} 
          alt={brand.name} 
          className="max-h-full max-w-full object-contain filter drop-shadow-md brightness-0 invert" 
        />
      </div>
    </motion.div>
  );
}
