import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { verifyEmail } from '../services';

/**
 * Hook for verifying email with token
 * Used when user clicks verification link from email
 */
export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
    retry: false,
    onSuccess: () => {
      toast.success('Email verified successfully!');
    },
    onError: (error: any) => {
      const statusCode = error?.response?.status;
      const message = error?.response?.data?.message?.toLowerCase() || '';

      if (statusCode === 400) {
        if (message.includes('expired')) {
          toast.error('Verification link expired. Request a new one.');
        } else if (message.includes('invalid')) {
          toast.error('Invalid verification link.');
        } else if (message.includes('already verified')) {
          toast.error('Email already verified. You can sign in now.');
        } else {
          toast.error('Verification failed. Please try again.');
        }
      } else {
        toast.error(error?.response?.data?.message || 'Failed to verify email');
      }
    },
  });
}
