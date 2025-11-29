import { FileText, Eye, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import type { FormPerformanceMetrics } from '../types/analytics';
import type { TrendData } from '@/features/dashboard/types/dashboard';

interface FormPerformanceCardsProps {
  metrics: FormPerformanceMetrics;
}

export function FormPerformanceCards({ metrics }: FormPerformanceCardsProps) {
  const formatTrendLabel = (
    change: number,
    direction: 'up' | 'down' | 'neutral'
  ): string => {
    if (direction === 'neutral' || change === 0) {
      return '— No previous data';
    }
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(0)}% vs previous period`;
  };

  const submissionsTrend: TrendData = {
    value: metrics.submissions.change,
    direction: metrics.submissions.changeDirection,
    label: formatTrendLabel(
      metrics.submissions.change,
      metrics.submissions.changeDirection
    ),
  };

  const viewsTrend: TrendData = {
    value: metrics.views.change,
    direction: metrics.views.changeDirection,
    label: formatTrendLabel(
      metrics.views.change,
      metrics.views.changeDirection
    ),
  };

  const conversionRateTrend: TrendData = {
    value: metrics.conversionRate.change,
    direction: metrics.conversionRate.changeDirection,
    label: formatTrendLabel(
      metrics.conversionRate.change,
      metrics.conversionRate.changeDirection
    ),
  };

  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
      <MetricCard
        icon={<FileText />}
        value={metrics.submissions.total.toLocaleString()}
        label="Total Submissions"
        trend={submissionsTrend}
        gradient="indigo"
      />
      <MetricCard
        icon={<Eye />}
        value={metrics.views.total.toLocaleString()}
        label="Form Views"
        trend={viewsTrend}
        gradient="emerald"
      />
      <MetricCard
        icon={<TrendingUp />}
        value={`${metrics.conversionRate.total}%`}
        label="Conversion Rate"
        trend={conversionRateTrend}
        gradient="pink"
      />
    </div>
  );
}
