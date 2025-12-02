import { useQuery } from '@tanstack/react-query';
import { getEmbeddableWorkflows } from '../services/workflow-api';

export function useWorkflows(workspaceId: string | null) {
  return useQuery({
    queryKey: ['workflows', workspaceId],
    queryFn: () => {
      console.log(
        '📡 useWorkflows - Fetching workflows for workspaceId:',
        workspaceId
      );
      return getEmbeddableWorkflows(workspaceId!);
    },
    retry: false,
    enabled: !!workspaceId,
    refetchOnMount: true,
  });
}
