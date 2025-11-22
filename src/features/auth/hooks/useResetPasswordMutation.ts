import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetPassword, ResetPasswordData } from '../services';

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordData) => resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successful!');
    },
    onError: (error: any) => {
      const statusCode = error?.response?.status;
      const message = error?.response?.data?.message?.toLowerCase() || '';

      if (statusCode === 401) {
        if (message.includes('expired')) {
          toast.error('Reset link has expired. Please request a new one.');
        } else if (message.includes('invalid')) {
          toast.error(
            'Invalid reset link. Please check your email for the correct link.'
          );
        } else if (message.includes('already used')) {
          toast.error('This reset link has already been used.');
        } else {
          toast.error('Invalid or expired reset link.');
        }
      } else {
        toast.error(
          error?.response?.data?.message ||
            'Failed to reset password. Please try again.'
        );
      }
    },
  });
}
