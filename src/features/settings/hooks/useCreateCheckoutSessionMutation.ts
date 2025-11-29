import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCheckoutSession } from '../services';
import type { CreateCheckoutSessionDto } from '../types';

/**
 * Hook for creating Stripe checkout session
 */
export function useCreateCheckoutSessionMutation(workspaceId: string) {
  return useMutation({
    mutationFn: (data: CreateCheckoutSessionDto) =>
      createCheckoutSession(workspaceId, data),
    retry: false,
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.info(data.message || 'Checkout session created');
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to create checkout session';
      toast.error(errorMessage);
    },
  });
}
