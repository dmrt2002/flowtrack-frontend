import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resendVerification, ResendVerificationData } from '../services';

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (data: ResendVerificationData) => resendVerification(data),
    onSuccess: () => {
      toast.success('Verification email sent! Check your inbox.');
    },
    onError: (error: any) => {
      if (error?.response?.status === 400) {
        toast.error('Email already verified. You can sign in now.');
      } else if (error?.response?.status === 429) {
        toast.error(
          'Too many requests. Please wait before requesting another verification email.'
        );
      } else {
        toast.error(
          error?.response?.data?.message || 'Failed to send verification email'
        );
      }
    },
  });
}
