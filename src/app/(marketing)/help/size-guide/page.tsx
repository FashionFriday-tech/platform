"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Ruler,
  ArrowRight,
  Shirt,
  Footprints,
  Info,
  ChevronDown,
  ArrowLeftRight,
  Check,
  X,
} from "lucide-react";
import { sizeData } from "@/data/sizes";
import { SlArrowRight } from "react-icons/sl";

export default function SizeGuidePage() {
  const [activeCat, setActiveCat] = useState<keyof typeof sizeData>("footwear");
  const [baseUnit, setBaseUnit] = useState<string>("");
  const [targetUnit, setTargetUnit] = useState<string>("");
  const [activePicker, setActivePicker] = useState<"base" | "target" | null>(
    null
  );
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sync units when category changes
  useEffect(() => {
    const availableUnits = sizeData[activeCat].units;
    setBaseUnit(availableUnits[0]);
    setTargetUnit(availableUnits[availableUnits.length - 1]);
  }, [activeCat]);

  // Handle clicking outside to close the picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setActivePicker(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwap = () => {
    const temp = baseUnit;
    setBaseUnit(targetUnit);
    setTargetUnit(temp);
  };

  return (
    <div className="bg-background text-foreground min-h-screen pb-32 selection:bg-brand selection:text-white relative">
      {/* 1. HEADER SECTION */}
      <header className="pt-10 md:pt-26 pb-12 px-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3 text-brand">
          <div className="h-0.5 w-12 bg-brand" />
          <span className="text-[10px] font-black uppercase tracking-[0.6em]">
            System Architecture
          </span>
        </div>
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.75]">
          Fit <br /> <span className="opacity-50">Engine</span>
        </h1>
      </header>

      {/* 2. CATEGORY SWITCHER */}
      <nav className="px-6 mb-16 max-w-4xl mx-auto">
        <div className="bg-muted/20 p-1.5 rounded-full border border-border flex gap-1">
          {["footwear", "apparel"].map((id) => (
            <button
              key={id}
              onClick={() => setActiveCat(id as any)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
                activeCat === id
                  ? "bg-foreground text-background shadow-xl"
                  : "hover:bg-muted/50 opacity-50"
              }`}
            >
              {id === "footwear" ? (
                <Footprints size={14} />
              ) : (
                <Shirt size={14} />
              )}
              {id}
            </button>
          ))}
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 relative">
        {/* 3. THE FIXED STICKY HUD */}
        <div className="sticky top-20 z-50 mb-20" ref={pickerRef}>
          <div className="bg-foreground text-background rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]">
            <div className="flex items-center relative">
              {/* FROM BUTTON */}
              <button
                onClick={() =>
                  setActivePicker(activePicker === "base" ? null : "base")
                }
                className="flex-1 flex flex-col items-center py-4 rounded-3xl transition-all"
              >
                <span className="text-[7px] font-black uppercase tracking-widest opacity-40 mb-1 justify-center">
                  Source
                </span>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm md:text-lg font-black uppercase tracking-tighter text-nowrap">
                    {baseUnit}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`opacity-40 transition-transform ${
                      activePicker === "base" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* SWAP TOGGLE */}
              <button
                onClick={handleSwap}
                className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-brand flex items-center justify-center hover:scale-110 active:scale-95 transition-all shrink-0 z-10"
              >
                <ArrowLeftRight size={18} className="text-background" />
              </button>

              {/* TO BUTTON */}
              <button
                onClick={() =>
                  setActivePicker(activePicker === "target" ? null : "target")
                }
                className="flex-1 flex flex-col items-center text-center py-4 rounded-3xl hover:bg-white/5 transition-all"
              >
                <span className="text-[7px] font-black uppercase tracking-widest opacity-40 mb-1 flex text-center">
                  Conversion
                </span>
                <div className="flex items-center gap-2 mr-4">
                  <ChevronDown
                    size={14}
                    className={`opacity-40 transition-transform ${
                      activePicker === "target" ? "rotate-180" : ""
                    }`}
                  />
                  <span className="text-sm md:text-lg font-black uppercase tracking-tighter text-nowrap">
                    {targetUnit}
                  </span>
                </div>
              </button>

              {/* DYNAMIC DROPDOWN MODAL */}
              {activePicker && (
                <div className="absolute top-[120%] left-0 w-full bg-foreground rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-background/40 select-none">
                      Select Size
                    </span>
                    <button
                      onClick={() => setActivePicker(null)}
                      className="text-background/20 hover:text-brand"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {sizeData[activeCat].units.map((u: string) => (
                      <button
                        key={u}
                        onClick={() => {
                          activePicker === "base"
                            ? setBaseUnit(u)
                            : setTargetUnit(u);
                          setActivePicker(null);
                        }}
                        className={`py-5 px-4 rounded-4xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center ${
                          (activePicker === "base" ? baseUnit : targetUnit) ===
                          u
                            ? "bg-background text-foreground shadow-lg shadow-brand/20"
                            : "bg-background/5 hover:bg-background/10 text-background border border-foreground/20"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. RESULTS GRID */}
        <div className="space-y-4 relative z-0">
          {sizeData[activeCat].chart.map((row: any, i: number) => (
            <div
              key={i}
              className="group flex items-center justify-between bg-muted/5 border border-border rounded-4xl p-5 hover:bg-muted/10 hover:border-foreground transition-all duration-500"
            >
              <div className="flex flex-col items-center min-w-28 md:min-w-44">
                <span className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                  {String(row[baseUnit])}
                </span>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-30">
                  {baseUnit}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-100 group-hover:text-brand transition-all duration-500">
                <SlArrowRight size={20} />
              </div>

              <div className="flex flex-col items-center min-w-28 md:min-w-44 text-right">
                <span className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
                  {String(row[targetUnit])}
                </span>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-30">
                  {targetUnit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 5. FOOTER PROTOCOL */}
        <div className="mt-32 p-12 md:p-20 rounded-[3.5rem] bg-foreground text-background relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <Ruler size={300} strokeWidth={1} />
          </div>
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.8] tracking-tighter">
              Fit <br /> Intelligence.
            </h2>
            <p className="text-sm font-medium uppercase leading-relaxed opacity-60 max-w-md">
              Standards vary across manufacturers. Our algorithm
              cross-references international metrics (ISO 19407) to suggest the
              optimal fit for your anatomy.
            </p>
            <div className="flex flex-wrap gap-8 pt-6">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
                  Accuracy
                </p>
                <p className="text-xl font-bold tracking-tighter">
                  99.8% Verified
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">
                  Updated
                </p>
                <p className="text-xl font-bold tracking-tighter">Jan 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backdrop for closing */}
      {activePicker && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-all duration-500"
          onClick={() => setActivePicker(null)}
        />
      )}
    </div>
  );
}
