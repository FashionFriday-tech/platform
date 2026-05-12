import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

import { AnimatePresence, motion } from 'motion/react';

import { MOCK_STATE_ORDERS } from '../types';

interface Props {
  totalOrders: number;
  hoveredState: string | null;
  selectedState: string | null;
  isMapHovered: boolean;
  tooltipPos: { x: number; y: number };
  setHoveredState: (state: string | null) => void;
  setSelectedState: (state: string | null) => void;
  setIsMapHovered: (hovered: boolean) => void;
  setTooltipPos: (pos: { x: number; y: number }) => void;
  getStateData: (rawName: string) => any;
  getHeatColor: (orders: number) => string;
}

export function RegionalMapDisplay({
  totalOrders,
  hoveredState,
  selectedState,
  isMapHovered,
  tooltipPos,
  setHoveredState,
  setSelectedState,
  setIsMapHovered,
  setTooltipPos,
  getStateData,
  getHeatColor,
}: Props) {
  return (
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

      <div
        className="relative flex-1 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-900/50 dark:via-purple-950/20 dark:to-blue-950/20"
        style={{ minHeight: 480 }}
        onMouseEnter={() => {
          setIsMapHovered(true);
        }}
        onMouseLeave={() => {
          setIsMapHovered(false);
          setHoveredState(null);
        }}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1100,
            center: [82.5, 22.5],
          }}
          className="h-full w-full outline-none"
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography="/india.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const stateName = geo.properties.name || geo.properties.NAME_1 || '';
                if (!stateName) {
                  return null;
                }

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
                    onClick={() => {
                      setSelectedState(selectedState === mappedStateName ? null : mappedStateName);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <AnimatePresence>
          {isMapHovered &&
            hoveredState &&
            (() => {
              const activeState = hoveredState;
              const data = MOCK_STATE_ORDERS.find((s) => s.state === activeState);
              if (!data) {
                return null;
              }

              return (
                <motion.div
                  key="map-tooltip"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  style={{ left: tooltipPos.x + 15, top: tooltipPos.y - 40 }}
                  className="pointer-events-none fixed z-50 flex flex-col rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-4 py-3 shadow-2xl backdrop-blur-md"
                >
                  <p className="mb-2 text-sm font-black text-white">{activeState}</p>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] font-medium text-white/50">Orders</p>
                      <p className="text-xs font-bold text-white">
                        {data.orders.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-white/50">Revenue</p>
                      <p className="text-xs font-bold text-emerald-400">
                        ₹{(data.revenue / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
          Low
        </span>
        <div className="flex h-2.5 flex-1 overflow-hidden rounded-full">
          {['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6a4fbb'].map(
            (c, i) => (
              <div key={i} className="flex-1" style={{ backgroundColor: c }} />
            ),
          )}
        </div>
        <span className="text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
          High
        </span>
      </div>
    </div>
  );
}
