import { BarChart3, UserPlus, CheckCircle2, TrendingUp } from 'lucide-react';
import { MetricCard } from '@/features/dashboard/components/MetricCard';
import { MetricsRow } from '@/features/dashboard/components/MetricsRow';
import type { LeadMetrics } from '../types/lead';
import type { TrendData } from '@/features/dashboard/types/dashboard';

interface LeadMetricsCardsProps {
  metrics?: LeadMetrics;
  isLoading?: boolean;
}

export function LeadMetricsCards({
  metrics,
  isLoading,
}: LeadMetricsCardsProps) {
  const getChangeDirection = (change: number): 'up' | 'down' | 'neutral' => {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return 'neutral';
  };

  const formatTrendLabel = (change: number, suffix?: string): string => {
    if (change === 0) return '— No previous data';
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(0)}${suffix || '%'} vs previous period`;
  };

  // Default values when metrics is not available
  const defaultMetrics: LeadMetrics = {
    totalLeads: 0,
    totalLeadsChange: 0,
    newToday: 0,
    newTodayChange: 0,
    qualified: 0,
    qualifiedChange: 0,
    averageScore: 0,
    averageScoreChange: 0,
  };

  const metricsData = metrics || defaultMetrics;

  if (isLoading) {
    return (
      <MetricsRow>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border-[1.5px] border-neutral-200 bg-white p-6"
          >
            <div className="mb-4 h-12 w-12 rounded-xl bg-neutral-200" />
            <div className="mb-2 h-9 w-16 rounded bg-neutral-200" />
            <div className="mb-2 h-4 w-24 rounded bg-neutral-200" />
            <div className="h-3 w-32 rounded bg-neutral-200" />
          </div>
        ))}
      </MetricsRow>
    );
  }

  const totalLeadsTrend: TrendData | undefined = {
    value: metricsData.totalLeadsChange,
    direction: getChangeDirection(metricsData.totalLeadsChange),
    label: formatTrendLabel(metricsData.totalLeadsChange),
  };

  const newTodayTrend: TrendData | undefined = {
    value: metricsData.newTodayChange,
    direction: getChangeDirection(metricsData.newTodayChange),
    label: formatTrendLabel(metricsData.newTodayChange),
  };

  const qualifiedTrend: TrendData | undefined = {
    value: metricsData.qualifiedChange,
    direction: getChangeDirection(metricsData.qualifiedChange),
    label: formatTrendLabel(metricsData.qualifiedChange),
  };

  const averageScoreTrend: TrendData | undefined = {
    value: metricsData.averageScoreChange,
    direction: getChangeDirection(metricsData.averageScoreChange),
    label: formatTrendLabel(metricsData.averageScoreChange, 'pts'),
  };

  return (
    <MetricsRow>
      <MetricCard
        icon={<BarChart3 />}
        value={metricsData.totalLeads.toLocaleString()}
        label="Total Leads"
        trend={totalLeadsTrend}
        gradient="indigo"
      />
      <MetricCard
        icon={<UserPlus />}
        value={metricsData.newToday.toLocaleString()}
        label="New Today"
        trend={newTodayTrend}
        gradient="emerald"
      />
      <MetricCard
        icon={<CheckCircle2 />}
        value={metricsData.qualified.toLocaleString()}
        label="Qualified"
        trend={qualifiedTrend}
        gradient="emerald"
      />
      <MetricCard
        icon={<TrendingUp />}
        value={`${metricsData.averageScore.toFixed(0)}${metricsData.averageScore > 0 ? 'pts' : ''}`}
        label="Average Score"
        trend={averageScoreTrend}
        gradient="pink"
      />
    </MetricsRow>
  );
}
