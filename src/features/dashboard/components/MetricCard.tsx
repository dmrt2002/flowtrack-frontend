'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { TrendData } from '../types/dashboard';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: TrendData;
  gradient: 'indigo' | 'emerald' | 'amber' | 'pink';
}

export function MetricCard({
  icon,
  value,
  label,
  trend,
  gradient,
}: MetricCardProps) {
  const gradients = {
    indigo: 'from-[#4F46E5] to-[#7c3aed]',
    emerald: 'from-[#10B981] to-[#059669]',
    amber: 'from-[#F59E0B] to-[#D97706]',
    pink: 'from-[#EC4899] to-[#DB2777]',
  };

  const trendColors = {
    up: 'text-emerald-600',
    down: 'text-red-600',
    neutral: 'text-neutral-500',
  };

  const trendIcons = {
    up: <TrendingUp className="h-3 w-3" />,
    down: <TrendingDown className="h-3 w-3" />,
    neutral: <Minus className="h-3 w-3" />,
  };

  return (
    <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-[0_4px_12px_rgba(79,70,229,0.08)]">
      {/* Icon */}
      <div
        className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradients[gradient]} mb-4 flex items-center justify-center`}
      >
        <div className="h-6 w-6 text-white">{icon}</div>
      </div>

      {/* Value */}
      <div className="mb-1 text-[36px] leading-[1.1] font-bold tracking-tight text-neutral-900">
        {value}
      </div>

      {/* Label */}
      <div className="mb-2 text-[13px] font-medium text-neutral-500">
        {label}
      </div>

      {/* Trend (optional) */}
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${trendColors[trend.direction]}`}
        >
          {trendIcons[trend.direction]}
          <span>{trend.label}</span>
        </div>
      )}
    </div>
  );
}
