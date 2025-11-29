import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface CalendlyOAuthResponse {
  success: boolean;
  message: string;
  data: {
    connected: boolean;
    email?: string;
    plan?: 'FREE' | 'PRO';
  };
}

interface CalendlyConnectionStatus {
  connected: boolean;
  email?: string;
  plan?: 'FREE' | 'PRO';
  webhookEnabled?: boolean;
  pollingEnabled?: boolean;
}

/**
 * Initiate Calendly OAuth flow
 */
export function useCalendlyOAuthInitiate() {
  const { workspaceId } = useOnboardingStore();

  return useMutation({
    mutationFn: () => {
      // Redirect to backend OAuth endpoint
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url = `${backendUrl}${mainUrl.calendlyOAuthAuthorize}?workspaceId=${workspaceId}`;
      window.location.href = url;
      return Promise.resolve();
    },
    onError: () => {
      toast.error('Failed to initiate Calendly connection');
    },
  });
}

/**
 * Get Calendly connection status
 */
export function useCalendlyConnectionStatus(workspaceId: string | null) {
  console.log(
    'useCalendlyConnectionStatus called with workspaceId:',
    workspaceId
  );

  return useQuery<CalendlyConnectionStatus>({
    queryKey: ['calendly-connection', workspaceId],
    queryFn: async () => {
      console.log(
        'useCalendlyConnectionStatus queryFn executing for workspaceId:',
        workspaceId
      );

      if (!workspaceId) {
        console.error('useCalendlyConnectionStatus: No workspaceId available');
        throw new Error('Workspace ID not available yet');
      }

      const url = `${mainUrl.calendlyConnection}/${workspaceId}`;
      console.log('Fetching Calendly connection status from:', url);

      const response = await request.get<{
        success: boolean;
        data: CalendlyConnectionStatus;
      }>(url);

      console.log('Calendly connection status response:', response.data);
      return response.data.data;
    },
    enabled: !!workspaceId,
    retry: false,
  });
}

/**
 * Disconnect Calendly
 */
export function useCalendlyDisconnect() {
  const { workspaceId } = useOnboardingStore();

  return useMutation({
    mutationFn: () =>
      request.delete<CalendlyOAuthResponse>(
        `${mainUrl.calendlyConnection}/${workspaceId}`
      ),
    onSuccess: () => {
      toast.success('Calendly disconnected');
    },
    onError: () => {
      toast.error('Failed to disconnect Calendly');
    },
  });
}
