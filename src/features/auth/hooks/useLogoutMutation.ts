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
    mutationFn: () => {
      // Backend will read refreshToken from cookie
      return logout();
    },
    retry: false,
    onSuccess: () => {
      clearUser();
      clearAuthCookies();
      toast.success('Logged out successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      // Even if logout fails, clear local state and redirect
      clearUser();
      clearAuthCookies();
      const errorMessage =
        error?.response?.data?.message || 'Logout completed with errors';
      toast.error(errorMessage);
      router.push('/login');
    },
  });
}
