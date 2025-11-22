import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from '@/store/currentUserStore';
import { getCurrentUser } from '../services';

/**
 * Hook for fetching current user data
 * Automatically updates global user store on success
 */
export function useCurrentUserQuery() {
  const { setUser, setLoading } = useCurrentUser();

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      setUser(data);
      setLoading(false);
    },
    onError: (error) => {
      console.error('Failed to fetch current user:', error);
      setLoading(false);
    },
  });
}
