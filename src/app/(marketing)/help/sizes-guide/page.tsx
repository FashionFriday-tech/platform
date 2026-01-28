"use client";
import React, { useState, useEffect } from "react";
import {
  Ruler,
  ArrowRightLeft,
  Eye,
  Shirt,
  Footprints,
  Watch,
} from "lucide-react";
import { sizeData } from "@/data/sizes";

export default function SizeGuidePage() {
  const [activeCat, setActiveCat] = useState<keyof typeof sizeData>("footwear");
  const [gender, setGender] = useState("Men");
  const [baseUnit, setBaseUnit] = useState("");
  const [targetUnit, setTargetUnit] = useState("");

  // Sync units when category changes
  useEffect(() => {
    const availableUnits = sizeData[activeCat].units;
    setBaseUnit(availableUnits[0]);
    setTargetUnit(availableUnits[1] || availableUnits[0]);
  }, [activeCat]);

  const categories = [
    { id: "footwear", label: "Footwear", icon: <Footprints size={14} /> },
    { id: "apparel", label: "Top & Bottom", icon: <Shirt size={14} /> },
    { id: "eyewear", label: "Eyewear", icon: <Eye size={14} /> },
    { id: "accessories", label: "Accessories", icon: <Watch size={14} /> },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen pb-20 transition-colors duration-500">
      {/* 1. HEADER & GENDER TOGGLE */}
      <section className="pt-10 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background-muted text-[10px] font-black uppercase tracking-[0.3em] mx-auto">
              Measurement Lab / 2026
            </div>
            <h1 className="text-6xl md:text-[7vw] font-black uppercase tracking-[-0.04em] leading-[0.9] italic">
              The Fit{" "}
              <span className="text-foreground-subtle italic">Architect.</span>
            </h1>
          </div>

          {/* GENDER & CATEGORY SELECTOR */}
          <div className="w-full max-w-4xl space-y-6">
            <div className="flex justify-center gap-2">
              {["Men", "Women", "Unisex"].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    gender === g
                      ? "bg-foreground text-background"
                      : "bg-background-muted opacity-50"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-3 py-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id as any)}
                  className={`flex items-center gap-2 whitespace-nowrap px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                    activeCat === cat.id
                      ? "bg-brand text-brand-foreground border-brand shadow-lg shadow-brand/20"
                      : "bg-transparent border-border hover:border-brand"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-UNIT CONVERTER TABLE */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="bg-background-muted rounded-[3.5rem] p-6 md:p-12 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="w-full space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] ml-6 opacity-40">
                Base Standard
              </span>
              <select
                value={baseUnit}
                onChange={(e) => setBaseUnit(e.target.value)}
                className="w-full bg-background rounded-full py-5 px-8 border border-border outline-none uppercase font-black tracking-widest text-[11px] appearance-none"
              >
                {sizeData[activeCat].units.map((u: string) => (
                  <option key={u} value={u}>
                    {u.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-background rounded-full border border-border hidden md:block mt-5">
              <ArrowRightLeft size={16} className="opacity-30" />
            </div>

            <div className="w-full space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] ml-6 opacity-40">
                Target Comparison
              </span>
              <select
                value={targetUnit}
                onChange={(e) => setTargetUnit(e.target.value)}
                className="w-full bg-background rounded-full py-5 px-8 border border-border outline-none uppercase font-black tracking-widest text-[11px] appearance-none"
              >
                {sizeData[activeCat].units.map((u: string) => (
                  <option key={u} value={u}>
                    {u.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-background rounded-[2.5rem] border border-border overflow-hidden shadow-2xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border bg-background-muted/50">
                  <th className="py-8 px-10 text-left text-[11px] font-black uppercase tracking-widest">
                    {baseUnit}
                  </th>
                  <th className="py-8 px-10 text-right text-[11px] font-black uppercase tracking-widest text-brand">
                    {targetUnit}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeData[activeCat].chart.map((row: any, idx: any) => (
                  <tr
                    key={idx}
                    className="border-b border-border last:border-0 hover:bg-background-muted/40 transition-colors group"
                  >
                    <td className="py-7 px-10 text-[16px] font-black italic uppercase group-hover:translate-x-3 transition-transform duration-500">
                      {row[baseUnit]}
                    </td>
                    <td className="py-7 px-10 text-right text-[16px] font-black italic uppercase">
                      {row[targetUnit]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. MEASUREMENT LAB TIPS */}
      <section className="max-w-5xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[3rem] border border-border space-y-4">
            <Ruler className="opacity-20" size={30} />
            <h4 className="text-[11px] font-black uppercase tracking-widest italic">
              How to Measure
            </h4>
            <p className="text-[10px] leading-relaxed font-medium opacity-60 uppercase tracking-tighter italic">
              Measure your primary dimensions using a flexible tape. Keep the
              tape level and snug, but not tight against the skin.
            </p>
          </div>
          <div className="md:col-span-2 p-1 bg-brand rounded-[3rem]">
            <div className="bg-background rounded-[2.9rem] p-8 h-full flex flex-col justify-center">
              <h4 className="text-[11px] font-black uppercase tracking-widest italic mb-2">
                Architect fit tip:
              </h4>
              <p className="text-[14px] font-bold italic leading-tight">
                "Our {activeCat as String} sizing is engineered for a{" "}
                {activeCat === "apparel"
                  ? "relaxed oversized"
                  : "snug performance"}{" "}
                fit. If you prefer a tighter silhouette, consider dropping one
                size node."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
