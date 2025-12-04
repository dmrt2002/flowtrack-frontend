import { useQuery } from '@tanstack/react-query';
import { emailAnalyticsApi } from '../services/email-analytics-api';
import type { TrackingEventsResponse } from '../types';

/**
 * Hook to fetch tracking events for a specific sent email
 *
 * @param sentEmailId - ID of the sent email
 * @param enabled - Whether the query should run (default: true)
 * @returns React Query result with tracking events
 *
 * @example
 * ```tsx
 * function EmailDetailModal({ emailId }: { emailId: string }) {
 *   const { data, isLoading } = useTrackingEvents(emailId);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <h2>{data?.sentEmail.subject}</h2>
 *       <TrackingEventTimeline events={data?.events || []} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useTrackingEvents(sentEmailId: string, enabled = true) {
  return useQuery<TrackingEventsResponse>({
    queryKey: ['tracking-events', sentEmailId],
    queryFn: async () => {
      return emailAnalyticsApi.getTrackingEvents(sentEmailId);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: enabled && !!sentEmailId,
    retry: false,
  });
}
