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
        <div className="sticky top-20 z-40 mb-20" ref={pickerRef}>
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
        <div className="mt-8 mb-16 max-w-4xl mx-auto">
          <div className="bg-muted/5 border border-border/40 rounded-3xl flex flex-col md:flex-row items-center gap-6 group hover:border-brand/50 transition-colors duration-500">
            <div className="h-12 w-12 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-brand/10 transition-colors">
              <Info
                size={20}
                className="text-foreground group-hover:text-brand transition-colors"
              />
            </div>

            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                Manufacturing Variance
              </h4>
              <p className="text-xs md:text-sm font-bold uppercase italic leading-relaxed tracking-tight">
                Please note: Global standard sizing is a baseline. Dimensions
                may slightly vary across different{" "}
                <span className="text-brand underline underline-offset-4 decoration-brand/30">
                  brands and manufacturers
                </span>{" "}
                based on specific silhouettes and materials used.
              </p>
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

      {/* 6. ANATOMICAL CALIBRATION (THE GUIDE) */}
      {activeCat === "footwear" && (
        <section id="manual-size-mesure" className="mt-32 px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            {/* LEFT: THE MANIFESTO */}
            <div className="md:w-1/3 md:sticky top-32">
              <div className="space-y-6">
                <div className="relative flex items-center gap-3 text-brand">
                  <div className="h-[1px] w-8 bg-brand" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Manual Checking Method
                  </span>

                  <div className="absolute top-0 right-0  opacity-6 group-hover:scale-110 transition-transform duration-700">
                    <Ruler size={150} strokeWidth={1} />
                  </div>
                </div>
                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                  Don't Know <br />{" "}
                  <span className="text-foreground/30">Your Size ?</span>
                </h2>
                <p className="text-[11px] font-bold uppercase leading-relaxed opacity-60">
                  Socks lie. Branding varies. Centimeters are the only objective
                  truth in the universe. Follow the protocol to find your true
                  Size.
                </p>

                <div className="pt-8 space-y-4">
                  <div className="p-6 border border-border rounded-3xl bg-muted/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-40">
                      Required Things
                    </h4>
                    <ul className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase italic">
                      <li>• A4 Paper</li>
                      <li>• Precision Pen</li>
                      <li>• Vertical Wall</li>
                      <li>• measurement tape</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: THE STEPS */}
            <div className="md:w-2/3 space-y-4">
              {[
                {
                  step: "01",
                  title: "The Foundation",
                  desc:
                    "Place a sheet of paper on a flat floor, flush against a straight wall. No carpet. Surface must be rigid.",
                },
                {
                  step: "02",
                  title: "Alignment",
                  desc:
                    "Stand on the paper with your heel firmly touching the wall. Distribute your weight equally across both feet.",
                },
                {
                  step: "03",
                  title: "The Mark",
                  desc:
                    "Keep the pen vertical. Mark the exact tip of your longest toe. Don't pull back; trust the measurement.",
                },
                {
                  step: "04",
                  title: "Metric Capture",
                  desc:
                    "Measure from the paper's edge (the wall side) to your mark in Millimeters/Centimeters.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-muted/10 border border-border p-8 rounded-[2.5rem] hover:bg-foreground hover:text-background transition-all duration-500 overflow-hidden"
                >
                  <span className="absolute -right-4 -bottom-6 text-9xl font-black italic opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    {item.step}
                  </span>
                  <div className="relative z-10 flex gap-8 items-start">
                    <span className="text-brand font-black italic text-xl">
                      {item.step}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">
                        {item.title}
                      </h3>
                      <p className="text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-90">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* FINAL ADVICE CARD */}
              <div className="mt-8 p-10 bg-foreground text-background rounded-[2.5rem]">
                <div className="flex items-start gap-6">
                  <div className="p-3 bg-foreground text-background rounded-full">
                    <Info size={20} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">
                      The Asymmetry Rule
                    </h3>
                    <p className="text-xs font-bold uppercase leading-tight opacity-80">
                      Humans are asymmetrical disasters. Always measure both
                      feet and use the larger result. If you land between sizes,
                      size up. Tight shoes ruin lives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
