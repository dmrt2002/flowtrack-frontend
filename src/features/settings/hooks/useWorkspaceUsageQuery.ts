import { useQuery } from '@tanstack/react-query';
import { getWorkspaceUsage } from '../services';

/**
 * Hook for fetching workspace usage against quotas
 */
export function useWorkspaceUsageQuery(workspaceId: string) {
  return useQuery({
    queryKey: ['workspaceUsage', workspaceId],
    queryFn: () => getWorkspaceUsage(workspaceId),
    retry: false,
    enabled: Boolean(workspaceId),
    staleTime: 2 * 60 * 1000, // 2 minutes (usage changes more frequently)
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
