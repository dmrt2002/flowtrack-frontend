/**
 * React Query hooks for company enrichment
 */

import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { onboardingScraperApi } from '@/services/onboarding-scraper.service';
import type {
  ScrapeCompanyRequest,
  ScrapeCompanyResponse,
  EnrichmentStatusResponse,
} from '@/types/onboarding-scraper';

/**
 * Hook to scrape company website
 */
export function useCompanyEnrichment(): UseMutationResult<
  ScrapeCompanyResponse,
  Error,
  ScrapeCompanyRequest
> {
  return useMutation({
    mutationFn: (request: ScrapeCompanyRequest) =>
      onboardingScraperApi.scrapeCompany(request),
    retry: 1, // Retry once on failure
  });
}

/**
 * Hook to get enrichment status
 */
export function useEnrichmentStatus(
  workflowId: string | undefined,
  enabled = true
): UseQueryResult<EnrichmentStatusResponse, Error> {
  return useQuery({
    queryKey: ['enrichment-status', workflowId],
    queryFn: () => {
      if (!workflowId) {
        throw new Error('Workflow ID is required');
      }
      return onboardingScraperApi.getEnrichmentStatus(workflowId);
    },
    enabled: enabled && !!workflowId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to check scraper health
 */
export function useScraperHealth(): UseQueryResult<
  { status: string; version: string; timestamp: string },
  Error
> {
  return useQuery({
    queryKey: ['scraper-health'],
    queryFn: () => onboardingScraperApi.healthCheck(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
}
