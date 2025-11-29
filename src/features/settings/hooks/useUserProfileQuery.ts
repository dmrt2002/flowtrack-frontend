import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '../services';

/**
 * Hook for fetching user profile data
 */
export function useUserProfileQuery() {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
