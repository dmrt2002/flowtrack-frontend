import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPassword, ForgotPasswordData } from '../services';

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => forgotPassword(data),
    onSuccess: () => {
      // Don't show toast - always show success screen for security
    },
    onError: (error: any) => {
      if (error?.response?.status === 429) {
        toast.error('Too many requests. Please wait before trying again.');
      } else {
        toast.error(
          error?.response?.data?.message ||
            'Failed to send reset link. Please try again.'
        );
      }
    },
  });
}
