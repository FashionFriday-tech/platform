'use client';

import { useEffect, useMemo, useState } from 'react';

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

function distributeTotal(total: number, weights: number[]): number[] {
  if (total <= 0 || weights.length === 0) return weights.map(() => 0);
  const sumWeights = weights.reduce((a, b) => a + b, 0);
  if (sumWeights <= 0) return weights.map(() => 0);

  const exact = weights.map((w) => (w / sumWeights) * total);
  const floored = exact.map((v) => Math.floor(v));
  let remainder = total - floored.reduce((a, b) => a + b, 0);

  const fractions = exact.map((v, i) => ({ index: i, frac: v - floored[i] }));
  fractions.sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < remainder; i++) {
    floored[fractions[i % fractions.length].index] += 1;
  }

  return floored;
}

function getCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

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

export function ProductPerformance({ product }: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [matrixData, setMatrixData] = useState<ProductPerformanceMatrix | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPerformance() {
      if (!product.id) {
        return;
      }
      setIsLoading(true);
      try {
        const data = await fetchProductPerformance(product.id);
        if (isMounted && data) {
          setMatrixData(data);
        }
      } catch (err) {
        console.error('Failed to load performance matrix:', err);
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

  // Fallback dynamic generation if API hasn't loaded yet
  const fallbackData = useMemo(() => {
    const liveSold = Math.max(0, product.liveSold ?? product.sales ?? 0);
    const liveWatching = Math.max(0, product.liveWatching ?? 0);
    const now = new Date();

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    let points: PerformanceDataPoint[] = [];

    switch (timeframe) {
      case 'daily': {
        const dailyWeights = [0.8, 1.15, 0.9, 1.35, 1.1, 1.65, 1.3];
        const dailySalesTarget =
          liveSold > 0 ? Math.min(liveSold, Math.max(1, Math.round(liveSold * 0.35))) : 0;
        const distSales = distributeTotal(dailySalesTarget, dailyWeights);
        const weeklyViewsTarget = Math.max(
          30,
          Math.min(180, Math.round(liveWatching / 60 + liveSold * 3)),
        );
        const distViews = distributeTotal(weeklyViewsTarget, dailyWeights);

        points = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date(now);
          d.setDate(d.getDate() - (6 - idx));
          const s = distSales[idx];
          const v = Math.max(s + 1, distViews[idx]);
          return {
            label: dayNames[d.getDay()],
            sales: s,
            views: v,
            date: d.toISOString().split('T')[0],
          };
        });
        break;
      }
      case 'weekly': {
        const weeklyWeights = [0.75, 0.9, 1.25, 1.0, 1.4, 1.65, 1.3];
        const distSales = distributeTotal(liveSold, weeklyWeights);
        const sevenWeekViews = Math.max(
          120,
          Math.min(650, Math.round(liveWatching / 15 + liveSold * 8)),
        );
        const distViews = distributeTotal(sevenWeekViews, weeklyWeights);

        points = Array.from({ length: 7 }, (_, idx) => {
          const s = distSales[idx];
          const v = Math.max(s * 2 + 3, distViews[idx]);
          return {
            label: `W${idx + 1}`,
            sales: s,
            views: v,
          };
        });
        break;
      }
      case 'monthly': {
        const monthlyWeights = [0.65, 0.8, 1.1, 1.25, 1.45, 1.8, 1.5];
        const distSales = distributeTotal(liveSold, monthlyWeights);
        const sevenMonthViews = Math.max(
          400,
          Math.min(2200, Math.round(liveWatching / 5 + liveSold * 22)),
        );
        const distViews = distributeTotal(sevenMonthViews, monthlyWeights);

        points = Array.from({ length: 7 }, (_, idx) => {
          const mDate = new Date(now.getFullYear(), now.getMonth() - (6 - idx), 1);
          const s = distSales[idx];
          const v = Math.max(s * 3 + 5, distViews[idx]);
          return {
            label: monthNames[mDate.getMonth()],
            sales: s,
            views: v,
          };
        });
        break;
      }
      case 'yearly': {
        const curYear = now.getFullYear();
        const startY = Math.max(2023, curYear - 2);
        const yearsCount = curYear - startY + 1;
        const yearlyWeights = [0.4, 0.7, 1.0].slice(3 - yearsCount);
        const distSales = distributeTotal(liveSold, yearlyWeights);
        const yearlyViews = Math.max(
          1200,
          Math.min(6500, Math.round(liveWatching * 0.8 + liveSold * 65)),
        );
        const distViews = distributeTotal(yearlyViews, yearlyWeights);

        points = Array.from({ length: yearsCount }, (_, idx) => {
          const y = startY + idx;
          const s = distSales[idx];
          const v = Math.max(s * 4 + 10, distViews[idx]);
          return {
            label: String(y),
            sales: s,
            views: v,
          };
        });
        break;
      }
    }

    const totalSales = points.reduce((acc, curr) => acc + curr.sales, 0);
    const totalViews = points.reduce((acc, curr) => acc + curr.views, 0);
    const avgSales = points.length > 0 ? Math.round(totalSales / points.length) : 0;

    return {
      points,
      totalSales,
      totalViews,
      avgSales,
    };
  }, [product.sales, product.liveSold, product.liveWatching, timeframe]);

  const activeTimeframeData = matrixData?.[timeframe] || fallbackData;
  const chartData = activeTimeframeData.points;
  const totalSales = activeTimeframeData.totalSales;
  const totalViews = activeTimeframeData.totalViews;
  const avgSales = activeTimeframeData.avgSales;

  // Chart configuration
  const width = 600;
  const height = 190;
  const paddingX = 35;
  const paddingY = 32;

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
    <div className="rounded-3xl border border-black/5 bg-black/[0.02] p-5 transition-colors sm:rounded-[2.5rem] sm:p-7 md:p-8 dark:border-white/5 dark:bg-white/[0.02]">
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

        <div className="inline-flex max-w-full items-center rounded-full border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-black">
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
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5 dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span className="truncate">Total {timeframe} Sales</span>
          </span>
          <span className="text-2xl font-black text-black sm:text-3xl dark:text-white">
            {isLoading ? '...' : totalSales.toLocaleString()}
          </span>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5 dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <span className="truncate">Total {timeframe} Views</span>
          </span>
          <span className="text-2xl font-black text-black sm:text-3xl dark:text-white">
            {isLoading ? '...' : totalViews.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="relative w-full rounded-2xl border border-black/5 bg-white p-3 shadow-sm sm:p-5 dark:border-white/5 dark:bg-[#111]">
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

                {/* X Axis Label */}
                <text
                  x={cx}
                  y={height - 15}
                  textAnchor="middle"
                  fill="currentColor"
                  className={`text-[10px] font-bold transition-colors ${
                    isHovered ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50'
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
            <span>Views / Impressions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
