import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword } from '../services';
import type { ChangePasswordDto } from '../types';

/**
 * Hook for changing user password
 */
export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => changePassword(data),
    retry: false,
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to change password';
      toast.error(errorMessage);
    },
  });
}
