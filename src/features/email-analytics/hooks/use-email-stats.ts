import { useQuery } from '@tanstack/react-query';
import { emailAnalyticsApi } from '../services/email-analytics-api';
import type { EmailStatsResponse } from '../types';

/**
 * Options for useEmailStats hook
 */
export interface UseEmailStatsOptions {
  workspaceId: string;
  dateRange?: {
    start: string; // ISO date string
    end: string; // ISO date string
  };
  enabled?: boolean;
}

/**
 * Hook to fetch aggregate email statistics for a workspace
 *
 * Provides MPP-aware metrics including genuine open rates,
 * bot prefetch counts, and daily breakdowns.
 *
 * @param options - Query options
 * @returns React Query result with email statistics
 *
 * @example
 * ```tsx
 * function EmailAnalyticsDashboard({ workspaceId }: { workspaceId: string }) {
 *   const { data, isLoading } = useEmailStats({
 *     workspaceId,
 *     dateRange: {
 *       start: '2025-01-01',
 *       end: '2025-01-31',
 *     },
 *   });
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h2>Genuine Open Rate: {data?.genuineOpenRate.toFixed(1)}%</h2>
 *       <OpenRateChart dailyStats={data?.dailyStats || []} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useEmailStats(options: UseEmailStatsOptions) {
  const { workspaceId, dateRange, enabled = true } = options;

  return useQuery<EmailStatsResponse>({
    queryKey: ['email-stats', workspaceId, dateRange],
    queryFn: async () => {
      return emailAnalyticsApi.getEmailStats(workspaceId, dateRange);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && !!workspaceId,
    retry: false,
  });
}
