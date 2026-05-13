'use client';

import { useMemo, useState } from 'react';

import type { Product } from '../types';

interface Props {
  product: Product;
}

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function ProductPerformance({ product }: Props) {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

  // Mock Data Generation
  const chartData = useMemo(() => {
    const baseSales = product.sales;
    const baseViews = product.sales * 3.4;

    let labels: string[] = [];
    let salesMultipliers: number[] = [];
    let viewsMultipliers: number[] = [];

    switch (timeframe) {
      case 'daily':
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        salesMultipliers = [0.1, 0.15, 0.12, 0.2, 0.25, 0.3, 0.28];
        viewsMultipliers = [0.12, 0.18, 0.15, 0.22, 0.28, 0.35, 0.3];
        break;
      case 'weekly':
        labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
        salesMultipliers = [0.5, 0.8, 1.2, 1.0, 1.5, 1.8, 1.6];
        viewsMultipliers = [0.6, 0.9, 1.4, 1.2, 1.7, 2.1, 1.9];
        break;
      case 'monthly':
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        salesMultipliers = [2.5, 3.0, 2.8, 4.0, 4.5, 5.0, 4.8];
        viewsMultipliers = [2.8, 3.5, 3.2, 4.5, 5.2, 5.8, 5.5];
        break;
      case 'yearly':
        labels = ['2019', '2020', '2021', '2022', '2023', '2024', '2025'];
        salesMultipliers = [10, 15, 12, 20, 25, 30, 35];
        viewsMultipliers = [12, 18, 15, 24, 30, 36, 42];
        break;
    }

    // Scale factors to make numbers look realistic based on product total sales
    const points = labels.map((label, idx) => {
      const scale =
        timeframe === 'daily'
          ? 0.01
          : timeframe === 'weekly'
            ? 0.05
            : timeframe === 'monthly'
              ? 0.1
              : 0.5;
      const sVal = Math.max(1, Math.floor(baseSales * salesMultipliers[idx] * scale));
      const vVal = Math.max(sVal + 10, Math.floor(baseViews * viewsMultipliers[idx] * scale));
      return { label, sales: sVal, views: vVal };
    });

    return points;
  }, [product.sales, timeframe]);

  // Chart configuration
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 40;

  const maxVal = Math.max(...chartData.map((d) => d.views)) * 1.2; // 20% headroom
  const minVal = 0;

  const getX = (index: number) =>
    paddingX + (index * (width - 2 * paddingX)) / (chartData.length - 1);
  const getY = (val: number) =>
    height - paddingY - ((val - minVal) / (maxVal - minVal)) * (height - 2 * paddingY);

  const salesPath = `M ${chartData.map((d, i) => `${getX(i)},${getY(d.sales)}`).join(' L ')}`;
  const viewsPath = `M ${chartData.map((d, i) => `${getX(i)},${getY(d.views)}`).join(' L ')}`;

  const totalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);
  const totalViews = chartData.reduce((acc, curr) => acc + curr.views, 0);
  const avgSales = totalSales / chartData.length;

  return (
    <div className="rounded-[2.5rem] border border-black/5 bg-black/5 p-8 dark:border-white/5 dark:bg-white/5">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h3 className="text-sm font-black tracking-widest text-black uppercase dark:text-white">
          Performance Matrix
        </h3>

        <div className="flex rounded-full border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-black">
          {(['daily', 'weekly', 'monthly', 'yearly'] as Timeframe[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTimeframe(t);
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold capitalize transition-colors ${timeframe === t ? 'bg-black text-white shadow-sm dark:bg-white dark:text-black' : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
            Total {timeframe} Sales
          </span>
          <span className="text-3xl font-black text-black dark:text-white">
            {totalSales.toLocaleString()}
          </span>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-black">
          <span className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-black/50 uppercase dark:text-white/50">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            Total {timeframe} Views
          </span>
          <span className="text-3xl font-black text-black dark:text-white">
            {totalViews.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="scrollbar-hide relative w-full overflow-x-auto rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#111]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full min-w-[500px] overflow-visible"
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

          {/* Views Line (Blue) */}
          <defs>
            <linearGradient id="viewsGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Average Sales Line (White) */}
          <line
            x1={paddingX}
            y1={getY(avgSales)}
            x2={width - paddingX}
            y2={getY(avgSales)}
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-70"
          />
          <text
            x={width - paddingX}
            y={getY(avgSales) - 6}
            textAnchor="end"
            fill="white"
            fontSize="9"
            fontWeight="bold"
            className="opacity-90"
          >
            Avg Sales: {Math.round(avgSales).toLocaleString()}
          </text>

          {/* Views Area & Line */}
          <path
            d={`${viewsPath} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`}
            fill="url(#viewsGradient)"
          />
          <path
            d={viewsPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sales Area & Line */}
          <path
            d={`${salesPath} L ${width - paddingX},${height - paddingY} L ${paddingX},${height - paddingY} Z`}
            fill="url(#salesGradient)"
          />
          <path
            d={salesPath}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points & Labels */}
          {chartData.map((d, i) => {
            const cx = getX(i);
            const sy = getY(d.sales);
            const vy = getY(d.views);
            return (
              <g key={i}>
                {/* Views Point & Label */}
                <circle
                  cx={cx}
                  cy={vy}
                  r="4"
                  fill="#3b82f6"
                  className="ring-2 ring-white dark:ring-black"
                />
                <text
                  x={cx}
                  y={vy - 12}
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
                  r="4"
                  fill="#22c55e"
                  className="ring-2 ring-white dark:ring-black"
                />
                <text
                  x={cx}
                  y={sy + 18}
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
                  className="text-black/50 dark:text-white/50"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
