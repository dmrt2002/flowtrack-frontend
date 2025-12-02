import { useMutation, useQueryClient } from '@tanstack/react-query';
import { hotboxApi } from '../services/hotbox-api';
import type { SendMessageRequest } from '../types';

interface UseSendMessageOptions {
  workspaceId: string;
  leadId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSendMessage({
  workspaceId,
  leadId,
  onSuccess,
  onError,
}: UseSendMessageOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      return hotboxApi.sendMessageToLead(workspaceId, leadId, data);
    },
    onSuccess: () => {
      // Invalidate conversation thread to refetch messages
      queryClient.invalidateQueries({
        queryKey: ['conversation-thread', workspaceId, leadId],
      });

      // Invalidate hotbox conversations to update counts
      queryClient.invalidateQueries({
        queryKey: ['hotbox-conversations', workspaceId],
      });

      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });
}
