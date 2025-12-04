/**
 * Onboarding Scraper API Service
 *
 * Frontend service for calling the onboarding scraper backend APIs
 */

import request from '@/lib/request';
import type {
  ScrapeCompanyRequest,
  ScrapeCompanyResponse,
  EnrichmentStatusResponse,
} from '@/types/onboarding-scraper';

const BASE_URL = '/api/v1/onboarding';

export const onboardingScraperApi = {
  /**
   * Scrape and analyze company website
   */
  async scrapeCompany(
    data: ScrapeCompanyRequest
  ): Promise<ScrapeCompanyResponse> {
    const response = await request.post<ScrapeCompanyResponse>(
      `${BASE_URL}/scrape-company`,
      data
    );
    return response.data;
  },

  /**
   * Get enrichment status for a workflow
   */
  async getEnrichmentStatus(
    workflowId: string
  ): Promise<EnrichmentStatusResponse> {
    const response = await request.get<EnrichmentStatusResponse>(
      `${BASE_URL}/enrichment-status/${workflowId}`
    );
    return response.data;
  },

  /**
   * Check scraper service health
   */
  async healthCheck(): Promise<{
    status: string;
    version: string;
    timestamp: string;
  }> {
    const response = await request.get<{
      status: string;
      version: string;
      timestamp: string;
    }>(`${BASE_URL}/scraper-health`);
    return response.data;
  },
};
