import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { clearAuthCookies } from '@/lib/cookies';
import { logout } from '../services';

/**
 * Hook for logging out from current device
 * Revokes the refresh token from cookie and clears user state
 */
export function useLogoutMutation() {
  const router = useRouter();
  const { clearUser } = useCurrentUser();

  return useMutation({
    mutationFn: async () => {
      // Backend will clear the accessToken cookie
      return logout();
    },
    retry: false,
    onSuccess: () => {
      // Clear local state
      clearUser();
      clearAuthCookies();

      // Show success message
      toast.success('Logged out successfully', {
        duration: 2000,
      });

      // Wait a moment for toast to be visible, then redirect
      setTimeout(() => {
        router.push('/login');
      }, 500);
    },
    onError: (error: any) => {
      // Even if logout fails, clear local state and redirect
      clearUser();
      clearAuthCookies();

      const errorMessage = error?.response?.data?.message || 'Logout completed';

      // Show error but still redirect
      toast.error(errorMessage, {
        duration: 2000,
      });

      setTimeout(() => {
        router.push('/login');
      }, 500);
    },
  });
}
