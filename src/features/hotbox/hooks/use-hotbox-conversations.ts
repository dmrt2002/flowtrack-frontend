import { useQuery } from '@tanstack/react-query';
import { hotboxApi } from '../services/hotbox-api';
import type { HotboxTab } from '../types';

interface UseHotboxConversationsOptions {
  workspaceId: string | null;
  tab: HotboxTab;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useHotboxConversations({
  workspaceId,
  tab,
  limit = 50,
  offset = 0,
  enabled = true,
}: UseHotboxConversationsOptions) {
  return useQuery({
    queryKey: ['hotbox-conversations', workspaceId, tab, limit, offset],
    queryFn: async () => {
      if (!workspaceId) {
        throw new Error('Workspace ID is required');
      }

      console.log(
        '📡 useHotboxConversations - Fetching conversations for workspaceId:',
        workspaceId,
        'tab:',
        tab
      );

      if (tab === 'needs-reply') {
        return hotboxApi.getConversationsNeedingReply(
          workspaceId,
          limit,
          offset
        );
      } else {
        return hotboxApi.getConversationsSentOnly(workspaceId, limit, offset);
      }
    },
    enabled: enabled && !!workspaceId,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for new replies
    refetchOnMount: true,
  });
}
