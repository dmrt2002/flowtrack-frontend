import { useQuery } from '@tanstack/react-query';
import { getBillingPlans } from '../services';

/**
 * Hook for fetching available billing plans
 */
export function useBillingPlansQuery() {
  return useQuery({
    queryKey: ['billingPlans'],
    queryFn: getBillingPlans,
    retry: false,
    staleTime: 10 * 60 * 1000, // 10 minutes (plans don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}
