import { useQuery } from '@tanstack/react-query';
import { getWorkflowAnalytics } from '../services/analytics-api';
import type { AnalyticsPeriod } from '../types/analytics';

export function useWorkflowAnalytics(
  workflowId: string | null,
  period: AnalyticsPeriod = '30d',
  recentLimit: number = 10
) {
  return useQuery({
    queryKey: ['workflowAnalytics', workflowId, period, recentLimit],
    queryFn: () => getWorkflowAnalytics(workflowId!, { period, recentLimit }),
    retry: false,
    enabled: !!workflowId,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
