import React from 'react';

interface Props {
  sortedStates: any[];
  maxOrders: number;
  totalOrders: number;
  totalRevenue: number;
  hoveredState: string | null;
  selectedState: string | null;
  setHoveredState: (state: string | null) => void;
  getHeatColor: (orders: number) => string;
}

export function RegionalOrdersTable({
  sortedStates,
  maxOrders,
  totalOrders,
  totalRevenue,
  hoveredState,
  selectedState,
  setHoveredState,
  getHeatColor,
}: Props) {
  return (
    <div className="flex w-full flex-col border-t border-black/[0.06] lg:w-1/2 lg:border-t-0 lg:border-l dark:border-white/[0.06]">
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

      <div
        className="flex-1 overflow-auto px-6 pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden"
        style={{ maxHeight: '460px' }}
      >
        <table className="w-full min-w-[480px]">
          <thead className="sticky top-0 z-10 bg-white dark:bg-[#141414]">
            <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
              <th className="w-10 pb-3 text-left text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Rank
              </th>
              <th className="pb-3 text-left text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                State / UT
              </th>
              <th className="pb-3 text-right text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Orders
              </th>
              <th className="pb-3 text-right text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Revenue
              </th>
              <th className="pb-3 text-right text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Share
              </th>
              <th className="w-24 pb-3 pl-4 text-left text-[10px] font-bold tracking-wider text-black/30 uppercase dark:text-white/30">
                Volume
              </th>
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
                  onMouseEnter={() => {
                    setHoveredState(state.state);
                  }}
                  onMouseLeave={() => {
                    setHoveredState(null);
                  }}
                >
                  <td className="py-2.5 text-xs font-bold text-black/30 dark:text-white/30">
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 shrink-0 rounded-sm"
                        style={{ backgroundColor: getHeatColor(state.orders) }}
                      />
                      <span className="truncate text-xs font-semibold text-black xl:text-sm dark:text-white">
                        {state.state}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right text-xs font-black text-black xl:text-sm dark:text-white">
                    {state.orders.toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 text-right text-xs font-semibold text-emerald-600 xl:text-sm dark:text-emerald-400">
                    ₹{(state.revenue / 100000).toFixed(1)}L
                  </td>
                  <td className="py-2.5 text-right text-[11px] font-semibold text-black/50 dark:text-white/50">
                    {sharePct}%
                  </td>
                  <td className="py-2.5 pl-4">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: getHeatColor(state.orders) }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-auto space-y-2 border-t border-black/[0.06] p-6 pt-4 dark:border-white/[0.06]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black/40 dark:text-white/40">
            Total Orders
          </span>
          <span className="text-base font-black text-black dark:text-white">
            {totalOrders.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-black/40 dark:text-white/40">
            Total Revenue
          </span>
          <span className="text-sm font-black text-emerald-500">
            ₹{(totalRevenue / 10000000).toFixed(1)}Cr
          </span>
        </div>
      </div>
    </div>
  );
}
