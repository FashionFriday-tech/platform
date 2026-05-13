import { useMemo, useState } from 'react';

import type { Product } from '../types';

export type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function useProductPerformance(product: Product) {
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');

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

  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 40;

  const maxVal = Math.max(...chartData.map((d) => d.views)) * 1.2;
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

  return {
    timeframe,
    setTimeframe,
    chartData,
    width,
    height,
    paddingX,
    paddingY,
    maxVal,
    minVal,
    getX,
    getY,
    salesPath,
    viewsPath,
    totalSales,
    totalViews,
    avgSales,
  };
}
