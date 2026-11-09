'use client';

import { useEffect, useState } from 'react';

import {
  fetchProductPerformance,
  type PerformanceDataPoint,
  type ProductPerformanceMatrix,
} from '../services/api';
import type { Product } from '../types';

interface Props {
  product: Product;
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

function getCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) {
    return '';
  }
  if (points.length === 1) {
    return `M ${points[0].x},${points[0].y}`;
  }

  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return path;
}

const EMPTY_TIMEFRAME = {
  totalSales: 0,
  totalViews: 0,
  avgSales: 0,
  points: [] as PerformanceDataPoint[],
};

const timeframeLabels: Record<Timeframe, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function ProductPerformance({ product }: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [matrixData, setMatrixData] = useState<ProductPerformanceMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPerformance() {
      if (!product.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(false);
      try {
        const data = await fetchProductPerformance(product.id);
        if (isMounted) {
          if (data) {
            setMatrixData(data);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Failed to load performance matrix:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    void loadPerformance();
    return () => {
      isMounted = false;
    };
  }, [product.id]);

  const activeTimeframeData = matrixData?.[timeframe] || EMPTY_TIMEFRAME;
  const chartData = activeTimeframeData.points;
  const totalSales = activeTimeframeData.totalSales;
  const totalViews = activeTimeframeData.totalViews;
  const avgSales = activeTimeframeData.avgSales;
  const hasData = chartData.length > 0 && (totalSales > 0 || totalViews > 0);

  // Chart configuration
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 38;

  const maxVal =
    Math.max(10, ...chartData.map((d) => Math.max(Number(d.views || 0), Number(d.sales || 0)))) *
    1.25; // 25% headroom
  const minVal = 0;

  const getX = (index: number) =>
    chartData.length > 1
      ? paddingX + (index * (width - 2 * paddingX)) / (chartData.length - 1)
      : width / 2;

  const getY = (val: number) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return height - paddingY - ((clamped - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);
  };

  const salesPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.sales) }));
  const viewsPoints = chartData.map((d, i) => ({ x: getX(i), y: getY(d.views) }));

  const salesPath = getCurvedPath(salesPoints);
  const viewsPath = getCurvedPath(viewsPoints);

  return (
    <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-4 transition-colors sm:rounded-[2.5rem] sm:p-6 md:p-8 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xs font-black tracking-widest text-black uppercase sm:text-sm dark:text-white">
            Performance Matrix
          </h3>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            Live Data
          </span>
        </div>

        <div className="scrollbar-hide flex max-w-full items-center overflow-x-auto rounded-full border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-black">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
                setHoveredIndex(null);
              }}
              className={`shrink-0 cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold capitalize transition-all sm:px-3.5 sm:py-1.5 sm:text-xs ${
                timeframe === t
                  ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black'
                  : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-sm sm:p-5 dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="truncate">Total {timeframeLabels[timeframe]} Sales</span>
          </span>
          <span className="text-xl font-black text-black sm:text-2xl md:text-3xl dark:text-white">
            {isLoading ? '...' : totalSales.toLocaleString()}
          </span>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-3.5 shadow-sm sm:p-5 dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <span className="truncate">Total {timeframeLabels[timeframe]} Engagements</span>
          </span>
          <span className="text-xl font-black text-black sm:text-2xl md:text-3xl dark:text-white">
            {isLoading ? '...' : totalViews.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-2xl border border-black/5 bg-white p-2 shadow-sm sm:p-4 md:p-5 dark:border-white/5 dark:bg-[#111]">
        {isLoading ? (
          <div className="flex h-[220px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <span className="text-xs font-medium text-black/40 dark:text-white/40">
                Loading performance data...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="flex h-[220px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <svg
                className="h-8 w-8 text-red-400/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <span className="text-xs font-medium text-black/40 dark:text-white/40">
                Failed to load performance data
              </span>
            </div>
          </div>
        ) : !hasData ? (
          <div className="flex h-[220px] items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <svg
                className="h-8 w-8 text-black/20 dark:text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                />
              </svg>
              <span className="text-xs font-medium text-black/40 dark:text-white/40">
                No {timeframeLabels[timeframe].toLowerCase()} data yet
              </span>
              <span className="text-[10px] text-black/30 dark:text-white/25">
                Sales & engagement data will appear as customers interact
              </span>
            </div>
          </div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="block h-auto w-full overflow-visible select-none"
            >
              {/* Grid lines */}
              <line
                x1={paddingX}
                y1={getY(maxVal * 0.75)}
                x2={width - paddingX}
                y2={getY(maxVal * 0.75)}
                stroke="currentColor"
                className="text-black/5 dark:text-white/5"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={getY(maxVal * 0.5)}
                x2={width - paddingX}
                y2={getY(maxVal * 0.5)}
                stroke="currentColor"
                className="text-black/5 dark:text-white/5"
                strokeDasharray="4 4"
              />
              <line
                x1={paddingX}
                y1={getY(maxVal * 0.25)}
                x2={width - paddingX}
                y2={getY(maxVal * 0.25)}
                stroke="currentColor"
                className="text-black/5 dark:text-white/5"
                strokeDasharray="4 4"
              />

              {/* Gradients */}
              <defs>
                <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Average Sales Reference Line */}
              {avgSales > 0 && (
                <>
                  <line
                    x1={paddingX}
                    y1={getY(avgSales)}
                    x2={width - paddingX}
                    y2={getY(avgSales)}
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                    className="text-emerald-500/50"
                  />
                  <text
                    x={width - paddingX}
                    y={getY(avgSales) - 6}
                    textAnchor="end"
                    className="fill-emerald-600 text-[9px] font-bold dark:fill-emerald-400"
                  >
                    Avg Sales: {Math.round(avgSales).toLocaleString()}
                  </text>
                </>
              )}

              {/* Views Area & Line */}
              {viewsPath && (
                <>
                  <path
                    d={`${viewsPath} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`}
                    fill="url(#viewsGradient)"
                  />
                  <path
                    d={viewsPath}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Sales Area & Line */}
              {salesPath && (
                <>
                  <path
                    d={`${salesPath} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`}
                    fill="url(#salesGradient)"
                  />
                  <path
                    d={salesPath}
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Points & Interactive Tooltips */}
              {chartData.map((d, i) => {
                const cx = getX(i);
                const sy = getY(d.sales);
                const vy = getY(d.views);
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={i}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredIndex(i);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                    }}
                  >
                    {/* Vertical hover guide */}
                    {isHovered && (
                      <line
                        x1={cx}
                        y1={paddingY / 2}
                        x2={cx}
                        y2={height - paddingY}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                        className="text-black/20 dark:text-white/20"
                      />
                    )}

                    {/* Views Point & Label */}
                    <circle
                      cx={cx}
                      cy={vy}
                      r={isHovered ? 6 : 4}
                      fill="#3b82f6"
                      className="transition-all"
                    />
                    <text
                      x={cx}
                      y={vy - 10}
                      textAnchor="middle"
                      fill="#3b82f6"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {d.views >= 1000 ? (d.views / 1000).toFixed(1) + 'k' : d.views}
                    </text>

                    {/* Sales Point & Label */}
                    <circle
                      cx={cx}
                      cy={sy}
                      r={isHovered ? 6 : 4}
                      fill="#22c55e"
                      className="transition-all"
                    />
                    <text
                      x={cx}
                      y={sy + 16}
                      textAnchor="middle"
                      fill="#22c55e"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {d.sales >= 1000 ? (d.sales / 1000).toFixed(1) + 'k' : d.sales}
                    </text>

                    {/* Invisible hit area */}
                    <rect x={cx - 20} y={0} width={40} height={height} fill="transparent" />

                    {/* X Axis Label */}
                    <text
                      x={cx}
                      y={height - 12}
                      textAnchor="middle"
                      fill="currentColor"
                      className={`text-[10px] font-bold transition-colors ${
                        isHovered
                          ? 'text-black dark:text-white'
                          : 'text-black/50 dark:text-white/50'
                      }`}
                    >
                      {d.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-2 flex items-center justify-center gap-6 border-t border-black/5 pt-3 text-[11px] font-bold text-black/60 dark:border-white/5 dark:text-white/60">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>Engagements</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
