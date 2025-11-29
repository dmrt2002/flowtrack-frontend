import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { disconnectAccount } from '../services';

/**
 * Hook for disconnecting a connected account
 */
export function useDisconnectAccountMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentialId: string) => disconnectAccount(credentialId),
    retry: false,
    onSuccess: () => {
      toast.success('Account disconnected successfully');
      queryClient.invalidateQueries({ queryKey: ['connectedAccounts'] });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to disconnect account';
      toast.error(errorMessage);
    },
  });
}
