'use client';
import React, { useEffect, useRef, useState } from 'react';

import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  FootprintsIcon,
  InfoIcon,
  RulerIcon,
  ShirtIcon,
} from '@ff/ui';

import { sizeData } from '@/data/sizes';

// --- 1. DEFINE TYPES ---
type CategoryKey = keyof typeof sizeData;

type SizeChartRow = Record<string, string | number>;

interface CategoryData {
  units: string[];
  chart: SizeChartRow[];
}

export default function SizeGuidePage() {
  const [activeCat, setActiveCat] = useState<CategoryKey>('footwear');

  // --- 2. SAFE DATA ACCESS ---
  // We cast this to CategoryData to stop the "any" errors
  const currentCatData = Object.prototype.hasOwnProperty.call(sizeData, activeCat)
    ? (sizeData as Record<CategoryKey, CategoryData>)[activeCat]
    : (sizeData as Record<CategoryKey, CategoryData>).footwear;
  const availableUnits = currentCatData.units;

  // Initialize with actual values from the data instead of empty strings
  const [baseUnit, setBaseUnit] = useState<string>(availableUnits[0]);
  const [targetUnit, setTargetUnit] = useState<string>(availableUnits[availableUnits.length - 1]);

  const [activePicker, setActivePicker] = useState<'base' | 'target' | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // --- 3. SYNC UNITS ON CAT CHANGE (Render-Phase) ---
  const [prevCat, setPrevCat] = useState<CategoryKey>(activeCat);
  if (activeCat !== prevCat) {
    setPrevCat(activeCat);
    setBaseUnit(availableUnits[0]);
    setTargetUnit(availableUnits[availableUnits.length - 1]);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSwap = () => {
    const temp = baseUnit;
    setBaseUnit(targetUnit);
    setTargetUnit(temp);
  };

  return (
    <div className="bg-background text-foreground selection:bg-brand relative min-h-screen pb-32 selection:text-white">
      {/* 1. HEADER SECTION */}
      <header className="mx-auto max-w-7xl space-y-8 px-6 pt-16 pb-16 md:pt-28">
        <div className="text-brand flex items-center gap-4">
          <div className="bg-brand h-px w-16" />
          <span className="text-[9px] font-black tracking-[0.5em] uppercase">
            Precision Sizing System
          </span>
        </div>

        <h1 className="text-8xl leading-[0.72] font-black tracking-tighter uppercase italic md:text-[8.5rem]">
          Size <br />
          <span className="opacity-40">Guide</span>
        </h1>

        <p className="max-w-xl text-xs leading-relaxed font-bold tracking-wide uppercase opacity-60 md:text-sm">
          Cross-brand sizing reference built on global measurement standards. Convert, compare, and
          verify your exact fit with zero guesswork.
        </p>
      </header>

      {/* 2. CATEGORY SWITCHER */}
      <nav className="mx-auto mb-16 max-w-4xl px-6">
        <div className="bg-muted/20 border-border flex gap-1 rounded-full border p-1.5">
          {(['footwear', 'apparel'] as const).map((id) => (
            <button
              key={id}
              onClick={() => {
                setActiveCat(id);
              }}
              className={`flex flex-1 items-center justify-center gap-3 rounded-full py-4 text-[10px] font-black tracking-widest uppercase transition-all duration-500 ${
                activeCat === id
                  ? 'bg-foreground text-background shadow-xl'
                  : 'hover:bg-muted/50 opacity-50'
              }`}
            >
              {id === 'footwear' ? <FootprintsIcon size={14} /> : <ShirtIcon size={14} />}
              {id}
            </button>
          ))}
        </div>
      </nav>

      <section className="relative mx-auto max-w-5xl px-6">
        {/* 3. THE FIXED STICKY HUD */}
        <div className="sticky top-20 z-40 mb-20" ref={pickerRef}>
          <div className="bg-foreground text-background rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)]">
            <div className="relative flex items-center">
              <button
                onClick={() => {
                  setActivePicker(activePicker === 'base' ? null : 'base');
                }}
                className="flex flex-1 flex-col items-center rounded-3xl py-4 transition-all"
              >
                <span className="mb-1 justify-center text-[7px] font-black tracking-widest uppercase opacity-40">
                  Source
                </span>
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-sm font-black tracking-tighter text-nowrap uppercase md:text-lg">
                    {baseUnit}
                  </span>
                  <ChevronDownIcon
                    size={14}
                    className={`opacity-40 transition-transform ${activePicker === 'base' ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              <button
                onClick={handleSwap}
                className="bg-brand z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95 md:h-12 md:w-12"
              >
                <ArrowLeftRightIcon size={18} className="text-background" />
              </button>

              <button
                onClick={() => {
                  setActivePicker(activePicker === 'target' ? null : 'target');
                }}
                className="flex flex-1 flex-col items-center rounded-3xl py-4 text-center transition-all hover:bg-white/5"
              >
                <span className="mb-1 flex text-center text-[7px] font-black tracking-widest uppercase opacity-40">
                  Conversion
                </span>
                <div className="mr-4 flex items-center gap-2">
                  <ChevronDownIcon
                    size={14}
                    className={`opacity-40 transition-transform ${activePicker === 'target' ? 'rotate-180' : ''}`}
                  />
                  <span className="text-sm font-black tracking-tighter text-nowrap uppercase md:text-lg">
                    {targetUnit}
                  </span>
                </div>
              </button>

              {activePicker && (
                <div className="bg-foreground animate-in slide-in-from-top-2 absolute top-[120%] left-0 w-full rounded-[2.5rem] p-6 shadow-2xl duration-300">
                  <div className="mb-6 flex items-center justify-between px-2">
                    <span className="text-background/40 text-[9px] font-black tracking-[0.3em] uppercase select-none">
                      Select Size
                    </span>
                    <button
                      onClick={() => {
                        setActivePicker(null);
                      }}
                      className="text-background/20 hover:text-brand"
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {availableUnits.map((u) => (
                      <button
                        key={u}
                        onClick={() => {
                          if (activePicker === 'base') {
                            setBaseUnit(u);
                          } else {
                            setTargetUnit(u);
                          }
                          setActivePicker(null);
                        }}
                        className={`flex items-center justify-center rounded-4xl px-4 py-5 text-sm font-black tracking-widest uppercase transition-all ${
                          (activePicker === 'base' ? baseUnit : targetUnit) === u
                            ? 'bg-background text-foreground shadow-brand/20 shadow-lg'
                            : 'bg-background/5 hover:bg-background/10 text-background border-foreground/20 border'
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
        <div className="relative z-0 space-y-4">
          {currentCatData.chart.map((row, i) => (
            <div
              key={i}
              className="bg-muted/5 border-border hover:bg-muted/10 hover:border-foreground group flex items-center justify-between rounded-4xl border p-5 transition-all duration-500"
            >
              <div className="flex min-w-28 flex-col items-center md:min-w-44">
                <span className="text-3xl leading-none font-black tracking-tighter md:text-5xl">
                  {String(
                    Object.prototype.hasOwnProperty.call(row, baseUnit) ? row[baseUnit] : '-',
                  )}
                </span>
                <p className="mt-3 text-[9px] font-black tracking-[0.2em] uppercase opacity-30">
                  {baseUnit}
                </p>
              </div>

              <div className="group-hover:text-brand flex flex-col items-center gap-2 opacity-20 transition-all duration-500 group-hover:opacity-100">
                <ArrowRightIcon size={20} />
              </div>

              <div className="flex min-w-28 flex-col items-center text-right md:min-w-44">
                <span className="text-3xl leading-none font-black tracking-tighter md:text-5xl">
                  {String(
                    Object.prototype.hasOwnProperty.call(row, targetUnit) ? row[targetUnit] : '-',
                  )}
                </span>
                <p className="mt-3 text-[9px] font-black tracking-[0.2em] uppercase opacity-30">
                  {targetUnit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 5. FOOTER PROTOCOL */}
        <div className="mx-auto mt-8 mb-16 max-w-4xl">
          <div className="bg-muted/5 border-border/40 hover:border-brand/50 group flex flex-col items-center gap-6 rounded-3xl border transition-colors duration-500 md:flex-row">
            <div className="bg-foreground/5 group-hover:bg-brand/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors">
              <InfoIcon
                size={20}
                className="text-foreground group-hover:text-brand transition-colors"
              />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-[10px] font-black tracking-[0.3em] uppercase opacity-40">
                Manufacturing Variance
              </h4>
              <p className="text-xs leading-relaxed font-bold tracking-tight uppercase italic md:text-sm">
                Please note: Global standard sizing is a baseline. Dimensions may slightly vary
                across different{' '}
                <span className="text-brand decoration-brand/30 underline underline-offset-4">
                  brands and manufacturers
                </span>{' '}
                based on specific silhouettes and materials used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Backdrop */}
      {activePicker && (
        <div
          className="fixed inset-0 z-30 bg-black/40 transition-all duration-500"
          onClick={() => {
            setActivePicker(null);
          }}
        />
      )}

      {/* 6. ANATOMICAL CALIBRATION */}
      {activeCat === 'footwear' && (
        <section id="manual-size-mesure" className="mt-32 px-6">
          <div className="flex flex-col items-start gap-16 md:flex-row">
            <div className="top-32 md:sticky md:w-1/3">
              <div className="space-y-6">
                <div className="text-brand relative flex items-center gap-3">
                  <div className="bg-brand h-px w-8" />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                    Manual Checking Method
                  </span>
                  <div className="absolute top-0 right-0 opacity-6 transition-transform duration-700 group-hover:scale-110">
                    <RulerIcon size={150} />
                  </div>
                </div>
                <h2 className="text-5xl leading-none font-black tracking-tighter uppercase italic">
                  Don't Know <br /> <span className="text-foreground/30">Your Size ?</span>
                </h2>
                <p className="text-[11px] leading-relaxed font-bold uppercase opacity-60">
                  Socks lie. Branding varies. Centimeters are the only objective truth in the
                  universe. Follow the protocol to find your true Size.
                </p>
                <div className="space-y-4 pt-8">
                  <div className="border-border bg-muted/5 rounded-3xl border p-6">
                    <h4 className="mb-4 text-[10px] font-black tracking-widest uppercase opacity-40">
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

            <div className="space-y-4 md:w-2/3">
              {[
                {
                  step: '01',
                  title: 'The Foundation',
                  desc: 'Place a sheet of paper on a flat floor, flush against a straight wall. No carpet.',
                },
                {
                  step: '02',
                  title: 'Alignment',
                  desc: 'Stand on the paper with your heel firmly touching the wall.',
                },
                {
                  step: '03',
                  title: 'The Mark',
                  desc: 'Keep the pen vertical. Mark the exact tip of your longest toe.',
                },
                {
                  step: '04',
                  title: 'Metric Capture',
                  desc: "Measure from the paper's edge to your mark in Millimeters/Centimeters.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-muted/10 border-border hover:bg-foreground hover:text-background group relative overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500"
                >
                  <span className="absolute -right-4 -bottom-6 text-9xl font-black italic opacity-[0.03] transition-opacity group-hover:opacity-10">
                    {item.step}
                  </span>
                  <div className="relative z-10 flex items-start gap-8">
                    <span className="text-brand text-xl font-black italic">{item.step}</span>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black tracking-tighter uppercase italic">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed font-medium opacity-70 group-hover:opacity-90">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-foreground text-background mt-8 rounded-[2.5rem] p-10">
                <div className="flex items-start gap-6">
                  <div className="bg-foreground text-background rounded-full p-3">
                    <InfoIcon size={20} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black tracking-tighter uppercase italic">
                      The Asymmetry Rule
                    </h3>
                    <p className="text-xs leading-tight font-bold uppercase opacity-80">
                      Humans are asymmetrical disasters. Always measure both feet and use the larger
                      result.
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
