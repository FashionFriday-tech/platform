'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MOCK_STATE_ORDERS } from '../types';

// Sort by orders desc
const sortedStates = [...MOCK_STATE_ORDERS].sort((a, b) => b.orders - a.orders);
const maxOrders = sortedStates[0]?.orders ?? 1;
const totalOrders = MOCK_STATE_ORDERS.reduce((sum, s) => sum + s.orders, 0);
const totalRevenue = MOCK_STATE_ORDERS.reduce((sum, s) => sum + s.revenue, 0);

function getHeatColor(orders: number): string {
  if (orders === 0) return '#f1f0fb';
  const ratio = orders / maxOrders;
  if (ratio > 0.75) return '#6a4fbb';
  if (ratio > 0.55) return '#7c3aed';
  if (ratio > 0.40) return '#8b5cf6';
  if (ratio > 0.25) return '#a78bfa';
  if (ratio > 0.15) return '#c4b5fd';
  if (ratio > 0.05) return '#ddd6fe';
  return '#ede9fe';
}

const NAME_MAPPINGS: Record<string, string> = {
  'Orissa': 'Odisha',
  'Uttaranchal': 'Uttarakhand',
  'Andaman and Nicobar': 'Andaman and Nicobar Islands',
};

export function RegionalOrdersMap() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isMapHovered, setIsMapHovered] = useState<boolean>(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const top5 = useMemo(() => sortedStates.slice(0, 5), []);

  const getStateData = (rawName: string) => {
    if (!rawName) return null;
    const normalizedName = NAME_MAPPINGS[rawName] || rawName;
    return MOCK_STATE_ORDERS.find(
      (s) => s.state.toLowerCase() === normalizedName.toLowerCase() || 
             s.state.toLowerCase().includes(normalizedName.toLowerCase()) ||
             normalizedName.toLowerCase().includes(s.state.toLowerCase())
    );
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-lg shadow-black/[0.03] dark:border-white/[0.06] dark:bg-[#141414]">
      {/* ─── Top: Map + Top States Side-by-Side ─── */}
      <div className="flex flex-col lg:flex-row">
        {/* Map Section */}
        <div className="flex flex-col p-6 lg:w-1/2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white">🇮🇳 Regional Orders</h2>
              <p className="text-sm font-medium text-black/50 dark:text-white/50">
                Interactive realistic map — {MOCK_STATE_ORDERS.length} states & UTs
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#6a4fbb]/10 px-3 py-1.5">
              <span className="text-xs font-black text-[#6a4fbb]">
                {totalOrders.toLocaleString('en-IN')} orders
              </span>
            </div>
          </div>

          {/* Map area */}
          <div 
            className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-900/50 dark:via-purple-950/20 dark:to-blue-950/20" 
            style={{ minHeight: 480 }}
            onMouseEnter={() => setIsMapHovered(true)}
            onMouseLeave={() => {
              setIsMapHovered(false);
              setHoveredState(null);
            }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1100,
                center: [82.5, 22.5]
              }}
              className="h-full w-full outline-none"
              style={{ width: '100%', height: '100%' }}
            >
                <Geographies geography="/india.json">
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo: any) => {
                      const stateName = geo.properties.name || geo.properties.NAME_1 || '';
                      if (!stateName) return null;
                      
                      const data = getStateData(stateName);
                      const orders = data?.orders ?? 0;
                      const mappedStateName = data?.state || stateName;
                      
                      const isHovered = hoveredState === mappedStateName;
                      const isSelected = selectedState === mappedStateName;
                      const fillColor = getHeatColor(orders);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={isHovered || isSelected ? '#ec4899' : fillColor}
                          stroke={isHovered || isSelected ? '#be185d' : 'rgba(255,255,255,0.8)'}
                          strokeWidth={isHovered || isSelected ? 1 : 0.5}
                          style={{
                            default: { outline: 'none' },
                            hover: { outline: 'none', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                            setHoveredState(mappedStateName);
                            setTooltipPos({ x: e.clientX, y: e.clientY });
                          }}
                          onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                            setTooltipPos({ x: e.clientX, y: e.clientY });
                          }}
                          onMouseLeave={() => {
                            if (hoveredState === mappedStateName) {
                              setHoveredState(null);
                            }
                          }}
                          onClick={() => setSelectedState(selectedState === mappedStateName ? null : mappedStateName)}
                        />
                      );
                    })
                  }
                </Geographies>
            </ComposableMap>

            {/* Hover tooltip overlay attached to mouse pos for a better interactive feel */}
            <AnimatePresence>
              {(isMapHovered && hoveredState) && (() => {
                const activeState = hoveredState;
                const data = MOCK_STATE_ORDERS.find(s => s.state === activeState);
                if (!data) return null;
                
                return (
                  <motion.div
                    key="map-tooltip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.15 }}
                    style={{ left: tooltipPos.x + 15, top: tooltipPos.y - 40 }}
                    className="pointer-events-none fixed z-50 flex flex-col rounded-xl bg-[#1a1a1a]/95 px-4 py-3 shadow-2xl backdrop-blur-md border border-white/10"
                  >
                    <p className="text-sm font-black text-white mb-2">{activeState}</p>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-[10px] font-medium text-white/50">Orders</p>
                        <p className="text-xs font-bold text-white">{data.orders.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-white/50">Revenue</p>
                        <p className="text-xs font-bold text-emerald-400">₹{(data.revenue / 100000).toFixed(1)}L</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Color Legend */}
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">
              Low
            </span>
            <div className="flex h-2.5 flex-1 overflow-hidden rounded-full">
              {['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6a4fbb'].map(
                (c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                )
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">
              High
            </span>
          </div>
        </div>

        {/* Right Sidebar — All States Table */}
        <div className="flex w-full flex-col border-t border-black/[0.06] dark:border-white/[0.06] lg:w-1/2 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white">
                All States & Union Territories
              </h3>
              <p className="text-[11px] font-medium text-black/40 dark:text-white/40">
                Complete order breakdown
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-auto px-6 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']" style={{ maxHeight: '460px' }}>
            <table className="w-full min-w-[480px]">
              <thead className="sticky top-0 z-10 bg-white dark:bg-[#141414]">
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                  <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30 w-10">Rank</th>
                  <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">State / UT</th>
                  <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">Orders</th>
                  <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">Revenue</th>
                  <th className="pb-3 text-right text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30">Share</th>
                  <th className="pb-3 text-left text-[10px] font-bold uppercase tracking-wider text-black/30 dark:text-white/30 pl-4 w-24">Volume</th>
                </tr>
              </thead>
              <tbody>
                {sortedStates.map((state, i) => {
                  const pct = (state.orders / maxOrders) * 100;
                  const sharePct = ((state.orders / totalOrders) * 100).toFixed(1);
                  const isActive = hoveredState === state.state || selectedState === state.state;

                  return (
                    <tr
                      key={state.state}
                      className={`group border-b border-black/[0.03] transition-colors hover:bg-[#6a4fbb]/[0.03] dark:border-white/[0.03] dark:hover:bg-[#6a4fbb]/[0.06] ${
                        isActive ? 'bg-[#6a4fbb]/[0.06]' : ''
                      }`}
                      onMouseEnter={() => setHoveredState(state.state)}
                      onMouseLeave={() => setHoveredState(null)}
                    >
                      <td className="py-2.5 text-xs font-bold text-black/30 dark:text-white/30">
                        {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: getHeatColor(state.orders) }} />
                          <span className="truncate text-xs font-semibold text-black dark:text-white xl:text-sm">
                            {state.state}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 text-right text-xs font-black text-black dark:text-white xl:text-sm">
                        {state.orders.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400 xl:text-sm">
                        ₹{(state.revenue / 100000).toFixed(1)}L
                      </td>
                      <td className="py-2.5 text-right text-[11px] font-semibold text-black/50 dark:text-white/50">
                        {sharePct}%
                      </td>
                      <td className="py-2.5 pl-4">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: getHeatColor(state.orders) }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total summary */}
          <div className="mt-auto space-y-2 border-t border-black/[0.06] p-6 pt-4 dark:border-white/[0.06]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-black/40 dark:text-white/40">Total Orders</span>
              <span className="text-base font-black text-black dark:text-white">{totalOrders.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-black/40 dark:text-white/40">Total Revenue</span>
              <span className="text-sm font-black text-emerald-500">₹{(totalRevenue / 10000000).toFixed(1)}Cr</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
