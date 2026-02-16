"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownIconIOS } from "@ff/ui";
import Image from "next/image";

// --- Types ---
interface Option {
  label: string;
  value: string;
  imageUrl?: string; // Optional: Only used for Color mode
}

interface SelectionTrayProps {
  title: string;
  options: Option[];
  selectedValue: string;
  isOpen: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  renderItem: (opt: Option) => React.ReactNode;
}

// --- Reusable Generic Tray ---
const SelectionTray = ({
  title,
  options,
  selectedValue,
  isOpen,
  onToggle,
  onChange,
  renderItem,
}: SelectionTrayProps) => (
  <div
    className={`rounded-4xl border border-white/25 p-4 transition-all duration-300`}
  >
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between font-black text-white uppercase"
    >
      <span className="text-xs">{title}</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
        <ArrowDownIconIOS />
      </motion.span>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  onToggle();
                }}
                className="cursor-pointer"
              >
                {renderItem(opt)}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- Main Page ---
export default function ProductPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [color, setColor] = useState("phantom");

  const colorData: Option[] = [
    {
      label: "Phantom",
      value: "phantom",
      imageUrl:
        "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/0fec9279-d839-45b4-a848-1d94cff031a7/NIKE+SB+DUNK+LOW+PRO.png",
    },
    {
      label: "University",
      value: "university",
      imageUrl:
        "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/2be76228-ff51-4c87-b120-e7be37db4d2e/AIR+FORCE+1+LOW+QS.png",
    },
    {
      label: "Varsity",
      value: "varsity",
      imageUrl:
        "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/85f69d4c-7a54-4e31-be57-d8896a73f341/W+ZOOM+GP+CHALLENGE+1.5+HC+PRM.png",
    },
    {
      label: "black",
      value: "black",
      imageUrl:
        "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png",
    },
    {
      label: "blue",
      value: "blue",
      imageUrl:
        "https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/0fcbdc68-279b-4e41-bd31-ea3879164798/W+AIR+FORCE+1+%2707+MINI+JEWEL.png",
    },
  ];

  return (
    <div>
      <SelectionTray
        title="Color Options"
        options={colorData}
        selectedValue={color}
        isOpen={activeTab === "color"}
        onToggle={() => setActiveTab(activeTab === "color" ? null : "color")}
        onChange={setColor}
        renderItem={(opt) => (
          <div
            className={`rounded-full p-1 transition-all ${
              color === opt.value
                ? "border border-white"
                : "border border-transparent"
            }`}
          >
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/10">
              <Image
                src={opt.imageUrl || "/images/placeholder.png"}
                alt={opt.label}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
