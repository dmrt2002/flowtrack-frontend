import { useState } from 'react';
import type { SubmissionTimeSeriesPoint } from '../types/analytics';

interface SubmissionsChartProps {
  data: SubmissionTimeSeriesPoint[];
}

interface TooltipData {
  date: string;
  value: number;
  label: string;
  x: number;
  y: number;
}

interface SingleChartProps {
  data: SubmissionTimeSeriesPoint[];
  dataKey: 'submissions' | 'views';
  title: string;
  color: string;
  hoverColor: string;
}

// Generate clean Y-axis ticks without duplicates
function generateYAxisTicks(maxValue: number): number[] {
  if (maxValue === 0) return [0];

  // For small values (≤5), use integer steps
  if (maxValue <= 5) {
    const ticks: number[] = [];
    for (let i = maxValue; i >= 0; i--) {
      ticks.push(i);
    }
    return ticks;
  }

  // For larger values, create 5 evenly spaced ticks
  return [
    maxValue,
    Math.floor(maxValue * 0.75),
    Math.floor(maxValue * 0.5),
    Math.floor(maxValue * 0.25),
    0,
  ].filter((val, index, arr) => arr.indexOf(val) === index); // Remove duplicates
}

function SingleChart({
  data,
  dataKey,
  title,
  color,
  hoverColor,
}: SingleChartProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Chart dimensions
  const chartHeight = 240;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 35;
  const paddingRight = 10;

  const chartAreaHeight = chartHeight - paddingTop - paddingBottom;

  // Calculate max value and Y-axis ticks
  const maxValue = Math.max(...data.map((d) => d[dataKey]), 1);
  const yAxisTicks = generateYAxisTicks(maxValue);

  // Calculate bar width
  const barWidth = Math.min((100 / data.length) * 0.6, 12); // max 12% width

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="relative" style={{ height: chartHeight }}>
      {/* Y-axis labels */}
      <div
        className="text-muted-foreground absolute left-0 flex flex-col justify-between text-xs"
        style={{
          width: paddingLeft,
          top: paddingTop,
          height: chartAreaHeight,
        }}
      >
        {yAxisTicks.map((tick, index) => (
          <div
            key={index}
            className="pr-2 text-right"
            style={{ lineHeight: '1' }}
          >
            {tick}
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div
        className="absolute rounded border border-gray-200 bg-gray-50"
        style={{
          left: paddingLeft,
          right: paddingRight,
          top: paddingTop,
          height: chartAreaHeight,
        }}
      >
        {/* Y-axis grid lines - aligned with labels */}
        <div className="absolute inset-0">
          {yAxisTicks.map((tick, index) => {
            const yPosition = (index / (yAxisTicks.length - 1)) * 100;
            return (
              <div
                key={index}
                className="absolute w-full border-t border-gray-300"
                style={{ top: `${yPosition}%` }}
              />
            );
          })}
        </div>

        {/* Bars - positioned from top instead of bottom */}
        <div className="absolute inset-0 flex justify-around px-2">
          {data.map((point) => {
            const value = point[dataKey];
            // Calculate position from top (0% = maxValue, 100% = 0)
            const topPosition =
              maxValue > 0 ? ((maxValue - value) / maxValue) * 100 : 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div
                key={point.date}
                className="relative"
                style={{ width: `${100 / data.length}%` }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    date: point.date,
                    value: value,
                    label: title,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <div className="flex h-full justify-center">
                  <div
                    className={`cursor-pointer rounded transition-all ${color} ${hoverColor}`}
                    style={{
                      position: 'absolute',
                      top: `${topPosition}%`,
                      height: `${barHeight}%`,
                      width: `${barWidth}%`,
                      minHeight: barHeight > 0 ? '3px' : '0',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div
        className="text-muted-foreground absolute bottom-0 flex justify-around text-xs"
        style={{
          left: paddingLeft,
          right: paddingRight,
          height: paddingBottom,
        }}
      >
        {data.map((point, index) => {
          // Show fewer labels to avoid crowding
          const shouldShow =
            data.length <= 7 ||
            index % Math.ceil(data.length / 7) === 0 ||
            index === data.length - 1;

          return (
            <div
              key={point.date}
              className="flex items-start justify-center pt-1"
              style={{ width: `${100 / data.length}%` }}
            >
              {shouldShow && (
                <span className="text-center" style={{ fontSize: '10px' }}>
                  {formatDate(point.date)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none',
          }}
        >
          <div className="mb-1 text-xs font-medium">
            {formatDate(tooltip.date)}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">{tooltip.label}:</span>{' '}
            <span className="font-medium">{tooltip.value}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function SubmissionsChart({ data }: SubmissionsChartProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 className="mb-4 text-lg font-semibold text-neutral-900">
          Submissions Over Time
        </h3>
        <div className="flex h-[300px] items-center justify-center text-neutral-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <h3 className="mb-6 text-lg font-semibold text-neutral-900">
        Submissions Over Time
      </h3>
      <div>
        <div className="grid grid-cols-2 gap-6">
          {/* Submissions Chart */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-blue-500" />
              <span className="text-sm font-medium">Submissions</span>
            </div>
            <SingleChart
              data={data}
              dataKey="submissions"
              title="Submissions"
              color="bg-blue-500"
              hoverColor="hover:bg-blue-600"
            />
          </div>

          {/* Views Chart */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm bg-purple-500" />
              <span className="text-sm font-medium">Views</span>
            </div>
            <SingleChart
              data={data}
              dataKey="views"
              title="Views"
              color="bg-purple-500"
              hoverColor="hover:bg-purple-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
