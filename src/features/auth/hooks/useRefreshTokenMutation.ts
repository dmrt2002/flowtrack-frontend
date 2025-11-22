import { useMutation } from '@tanstack/react-query';
import { useCurrentUser } from '@/store/currentUserStore';
import { refreshToken, RefreshTokenData } from '../services';

/**
 * Hook for refreshing access token
 * Automatically updates tokens in global store on success
 */
export function useRefreshTokenMutation() {
  const { setTokens } = useCurrentUser();

  return useMutation({
    mutationFn: (data: RefreshTokenData) => refreshToken(data),
    retry: false,
    onSuccess: (data) => {
      // Update tokens in global store
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      });
    },
    onError: (error: any) => {
      console.error('Token refresh failed:', error);
      // Token refresh failure is handled by request interceptor
      // which will redirect to login
    },
  });
}
