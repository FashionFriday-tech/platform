interface PerformanceDataPoint {
  date: string;
  sales: number;
  views: number;
  label?: string;
}

interface Props {
  chartData: PerformanceDataPoint[];
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  maxVal: number;
  minVal: number;
  getX: (index: number) => number;
  getY: (val: number) => number;
  salesPath: string;
  viewsPath: string;
  avgSales: number;
}

export function ProductPerformanceChart({
  chartData,
  width,
  height,
  paddingX,
  paddingY,
  maxVal,
  getX,
  getY,
  salesPath,
  viewsPath,
  avgSales,
}: Props) {
  return (
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
  );
}
