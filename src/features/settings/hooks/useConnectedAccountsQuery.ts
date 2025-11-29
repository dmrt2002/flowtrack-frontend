import { useQuery } from '@tanstack/react-query';
import { getConnectedAccounts } from '../services';

/**
 * Hook for fetching connected accounts
 */
export function useConnectedAccountsQuery() {
  return useQuery({
    queryKey: ['connectedAccounts'],
    queryFn: getConnectedAccounts,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
