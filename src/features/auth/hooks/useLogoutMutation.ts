import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { logout } from '../services';

/**
 * Hook for logging out from current device
 * Revokes the provided refresh token and clears user state
 */
export function useLogoutMutation() {
  const router = useRouter();
  const { clearUser, tokens } = useCurrentUser();

  return useMutation({
    mutationFn: () => {
      // Get refresh token from store
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }
      return logout({ refreshToken: tokens.refreshToken });
    },
    retry: false,
    onSuccess: () => {
      clearUser();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      // Even if logout fails, clear local state and redirect
      clearUser();
      const errorMessage =
        error?.response?.data?.message || 'Logout completed with errors';
      toast.error(errorMessage);
      router.push('/login');
    },
  });
}
