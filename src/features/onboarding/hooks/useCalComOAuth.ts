import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface CalComOAuthResponse {
  success: boolean;
  message: string;
  data: {
    connected: boolean;
    email?: string;
  };
}

interface CalComConnectionStatus {
  connected: boolean;
  email?: string;
}

/**
 * Initiate Cal.com OAuth flow
 */
export function useCalComOAuthInitiate() {
  const { workflowId } = useOnboardingStore();

  return useMutation({
    mutationFn: () => {
      // Redirect to backend OAuth endpoint
      const url = `${mainUrl.calComOAuthAuthorize}?workspaceId=${workflowId}`;
      window.location.href = url;
      return Promise.resolve();
    },
    onError: () => {
      toast.error('Failed to initiate Cal.com connection');
    },
  });
}

/**
 * Get Cal.com connection status
 */
export function useCalComConnectionStatus(workspaceId: string | null) {
  return useQuery<CalComConnectionStatus>({
    queryKey: ['calcom-connection', workspaceId],
    queryFn: async () => {
      if (!workspaceId) {
        return { connected: false };
      }

      const response = await request.get<{
        success: boolean;
        data: CalComConnectionStatus;
      }>(`${mainUrl.calComConnection}/${workspaceId}`);

      return response.data.data;
    },
    enabled: !!workspaceId,
    retry: false,
  });
}

/**
 * Disconnect Cal.com
 */
export function useCalComDisconnect() {
  const { workflowId } = useOnboardingStore();

  return useMutation({
    mutationFn: () =>
      request.delete<CalComOAuthResponse>(
        `${mainUrl.calComConnection}/${workflowId}`
      ),
    onSuccess: () => {
      toast.success('Cal.com disconnected');
    },
    onError: () => {
      toast.error('Failed to disconnect Cal.com');
    },
  });
}
