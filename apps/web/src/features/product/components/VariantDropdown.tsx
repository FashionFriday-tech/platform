"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import { div } from "framer-motion/client";

// --- Types ---
interface QualityOption {
  label: string;
  value: string;
}

interface ColorOption {
  label: string;
  value: string;
  imageUrl: string;
}

// --- Sub-Component: Quality Section ---
const QualityTray = ({
  options,
  selectedValue,
  onChange,
  isOpen,
  onToggle,
}: {
  options: QualityOption[];
  selectedValue: string;
  onChange: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      className={`border border-white/25 p-4 ${
        isOpen ? "rounded-2xl" : "rounded-full"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center font-black uppercase  text-white transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs">Quality Options</span>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <IoIosArrowDown />
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
            <div className="flex justify-center flex-wrap gap-4 pt-4">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    onToggle();
                  }}
                  className={`w-12 h-12 rounded-full text-[14px] font-black uppercase italic border transition-all shrink-0 ${
                    selectedValue === opt.value
                      ? "bg-white border-white text-black"
                      : "border-white/20 text-white/40 hover:border-white/60"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="flex justify-center mt-4">
              <Link
                href="/help/quality-guide"
                className="text-[9px] font-black uppercase underline text-foreground-subtle"
              >
                Quality Guide
              </Link>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub-Component: Color Section ---
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
  const activeColor = options.find((o) => o.value === selectedValue);

  return (
    <div
      className={`border border-white/25 p-4 ${
        isOpen ? "rounded-2xl" : "rounded-full"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center font-black uppercase text-white transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs">Color Options</span>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
          <IoIosArrowDown />
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
            <div className="flex overflow-x-auto gap-3 pt-4">
              {options.map((opt) => (
                <div
                key={opt.label}
                  className={`rounded-full flex justify-center items-center p-1 ${
                    selectedValue === opt.value ? "border" : ""
                  }`}
                >
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      onToggle();
                    }}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all `}
                  >
                    <img
                      src={opt.imageUrl}
                      className="w-full h-full object-cover"
                      alt={opt.label}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---
export default function ProductPage() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [quality, setQuality] = useState("UA");
  const [color, setColor] = useState("phantom");

  const qualityData: QualityOption[] = [
    { label: "5A", value: "5A" },
    { label: "6A", value: "6A" },
    { label: "7A", value: "7A" },
    { label: "UA", value: "UA" },
    { label: "10A", value: "10A" },
  ];

  const colorData: ColorOption[] = [
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
    <div className="flex flex-col items-center justify-start">
      <div className="w-full flex flex-col gap-2">
        {/* Quality Section */}
        <QualityTray
          options={qualityData}
          selectedValue={quality}
          onChange={setQuality}
          isOpen={activeTab === "quality"}
          onToggle={() =>
            setActiveTab(activeTab === "quality" ? null : "quality")
          }
        />

        {/* Color Section */}
        <ColorTray
          options={colorData}
          selectedValue={color}
          onChange={setColor}
          isOpen={activeTab === "color"}
          onToggle={() => setActiveTab(activeTab === "color" ? null : "color")}
        />
      </div>
    </div>
  );
}
