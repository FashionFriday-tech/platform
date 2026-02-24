'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // Added Link import

import { ArrowDownIcon } from '@ff/ui';
import { AnimatePresence, motion } from 'framer-motion';

interface ColorOption {
  label: string;
  slug: string;
  imageUrl: string;
}

const ColorTray = ({
  options,
  selectedValue,
  onChange,
  isOpen,
  onToggle,
}: {
  options: ColorOption[];
  selectedValue: string;
  onChange: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const activeColor = options.find((o) => o.slug === selectedValue);

  return (
    <div
      className={`border border-white/10 p-4 transition-all duration-300 ${
        isOpen ? 'rounded-4xl' : 'rounded-full'
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between font-black uppercase text-white transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] italic tracking-[0.3em]">Color Options</span>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <ArrowDownIcon size={18} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 pt-6">
              {options.map((opt) => (
                <div key={opt.slug} className={`flex shrink-0 flex-col items-center gap-2`}>
                  {/* Link wrapper for navigation */}
                  <Link
                    href={`/product/${opt.slug}`}
                    onClick={() => {
                      onChange(opt.slug);
                      onToggle();
                    }}
                    className="relative flex items-center justify-center p-1"
                  >
                    {/* Active Circle Border */}
                    <div
                      className={`absolute inset-0 rounded-full border transition-all duration-300 ${
                        selectedValue === opt.slug
                          ? 'border-white opacity-100'
                          : 'border-transparent opacity-0'
                      }`}
                    />

                    <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-transparent transition-all duration-300">
                      <img
                        src={opt.imageUrl}
                        className="h-full w-full object-cover"
                        alt={opt.label}
                      />
                    </div>
                  </Link>
                  <span
                    className={`text-[8px] font-black uppercase italic tracking-widest ${
                      selectedValue === opt.slug ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {opt.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductSelection() {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState('phantom');

  const colorData: ColorOption[] = [
    {
      label: 'Phantom',
      slug: '',
      imageUrl:
        'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png',
    },
    {
      label: 'University',
      slug: '',
      imageUrl:
        'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png',
    },
    {
      label: 'Varsity',
      slug: '',
      imageUrl:
        'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png',
    },
    {
      label: 'Black',
      slug: '',
      imageUrl:
        'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
    },
    {
      label: 'Blue',
      slug: '',
      imageUrl:
        'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png',
    },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <ColorTray
        options={colorData}
        selectedValue={color}
        onChange={setColor}
        isOpen={isOpen}
        onToggle={() => {
          setIsOpen(!isOpen);
        }}
      />
    </div>
  );
}
