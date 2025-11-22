import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { clearAuthCookies } from '@/lib/cookies';
import { logoutAll } from '../services';

/**
 * Hook for logging out from all devices
 * Revokes all refresh tokens and clears user state
 */
export function useLogoutAllMutation() {
  const router = useRouter();
  const { clearUser } = useCurrentUser();

  return useMutation({
    mutationFn: () => logoutAll(),
    retry: false,
    onSuccess: () => {
      clearUser();
      clearAuthCookies();
      toast.success('Logged out from all devices successfully');
      router.push('/login');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Logout failed. Please try again.';
      toast.error(errorMessage);
    },
  });
}
