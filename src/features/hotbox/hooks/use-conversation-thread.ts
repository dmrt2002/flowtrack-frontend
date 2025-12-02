import { useQuery } from '@tanstack/react-query';
import { hotboxApi } from '../services/hotbox-api';

interface UseConversationThreadOptions {
  workspaceId: string | null;
  leadId: string | null;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useConversationThread({
  workspaceId,
  leadId,
  limit = 50,
  offset = 0,
  enabled = true,
}: UseConversationThreadOptions) {
  return useQuery({
    queryKey: ['conversation-thread', workspaceId, leadId, limit, offset],
    queryFn: async () => {
      if (!workspaceId || !leadId) {
        throw new Error('Workspace ID and Lead ID are required');
      }

      return hotboxApi.getLeadMessages(workspaceId, leadId, limit, offset);
    },
    enabled: enabled && !!workspaceId && !!leadId,
    staleTime: 10000, // 10 seconds
  });
}
