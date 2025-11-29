import { useQuery } from '@tanstack/react-query';
import { getEmbeddableWorkflows } from '../services/workflow-api';

export function useWorkflows(workspaceId: string) {
  return useQuery({
    queryKey: ['workflows', workspaceId],
    queryFn: () => getEmbeddableWorkflows(workspaceId),
    retry: false,
    enabled: !!workspaceId,
  });
}
