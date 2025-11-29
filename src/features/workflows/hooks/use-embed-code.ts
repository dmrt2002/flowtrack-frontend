import { useQuery } from '@tanstack/react-query';
import { getEmbedCode } from '../services/workflow-api';

export function useEmbedCode(workflowId: string | null) {
  return useQuery({
    queryKey: ['embedCode', workflowId],
    queryFn: () => getEmbedCode(workflowId!),
    retry: false,
    enabled: !!workflowId,
  });
}
