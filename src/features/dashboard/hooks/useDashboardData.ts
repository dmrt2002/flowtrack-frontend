import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardOverview } from '../types';

interface UseDashboardDataOptions {
  period?: '7d' | '30d' | '90d';
  limit?: number;
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { period = '7d', limit = 5 } = options;

  return useQuery<DashboardOverview>({
    queryKey: ['dashboard', 'overview', period, limit],
    queryFn: () => dashboardService.getDashboardOverview({ period, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
