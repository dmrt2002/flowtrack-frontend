import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useCurrentUser } from '@/store/currentUserStore';
import { getCurrentUser } from '../services';
import { AxiosError } from 'axios';
import type { CurrentUserResponse } from '../types';

/**
 * Hook for fetching current user data
 * Automatically updates global user store on success
 */
export function useCurrentUserQuery() {
  const { setUser, setLoading, clearUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 0, // Always consider data stale - refetch on every navigation
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnMount: 'always', // Always refetch on mount, even if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus (to prevent excessive calls)
    refetchOnReconnect: true, // Refetch on reconnect
    enabled: true, // Enable automatic fetching
  });

  // Handle successful data fetch
  useEffect(() => {
    if (query.isSuccess && query.data) {
      console.log('✅ User fetched successfully via React Query:', query.data);
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  // Handle errors
  useEffect(() => {
    if (query.isError && query.error) {
      const axiosError = query.error as AxiosError;

      // Check if we have cached data (from previous successful fetch)
      const cachedData = queryClient.getQueryData<CurrentUserResponse>([
        'currentUser',
      ]);
      const hasCachedUser = !!cachedData;

      // 401 Unauthorized - user not logged in (backend verified no valid cookie)
      // This is the only definitive error that should clear authentication
      if (axiosError.response?.status === 401) {
        console.info(
          '❌ User is not authenticated (401) - no valid httpOnly cookie'
        );
        clearUser();
        setLoading(false);
        return;
      }

      // Network errors (backend not running, CORS, connection refused)
      // Preserve authentication state if we have cached data (don't clear on network errors during refetch)
      if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
        console.warn(
          '⚠️ Backend server is not reachable. Please ensure the backend is running at:',
          process.env.NEXT_PUBLIC_BACKEND_URL
        );
        // Only clear user if we don't have cached data (preserve state during refetch)
        if (!hasCachedUser) {
          clearUser();
        } else {
          // Keep the cached user data in the store
          setUser(cachedData);
        }
        setLoading(false);
        return;
      }

      // Other errors - preserve authentication state if we have cached data
      console.error('❌ Failed to fetch current user:', query.error);
      // Only clear user if we don't have cached data (preserve state during refetch)
      if (!hasCachedUser) {
        clearUser();
      } else {
        // Keep the cached user data in the store
        setUser(cachedData);
      }
      setLoading(false);
    }
  }, [query.isError, query.error, clearUser, setLoading, setUser, queryClient]);

  return query;
}
