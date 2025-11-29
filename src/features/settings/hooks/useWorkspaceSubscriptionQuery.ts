import { useQuery } from '@tanstack/react-query';
import { getWorkspaceSubscription } from '../services';

/**
 * Hook for fetching workspace subscription
 */
export function useWorkspaceSubscriptionQuery(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceSubscription', workspaceId],
    queryFn: () => getWorkspaceSubscription(workspaceId),
    retry: false,
    enabled: Boolean(workspaceId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
