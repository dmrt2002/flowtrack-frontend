import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cancelSubscription } from '../services';

/**
 * Hook for canceling subscription
 */
export function useCancelSubscriptionMutation(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelSubscription(workspaceId),
    retry: false,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: ['workspaceSubscription', workspaceId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to cancel subscription';
      toast.error(errorMessage);
    },
  });
}
