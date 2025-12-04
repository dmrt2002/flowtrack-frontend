/**
 * Sales Pitch API Service
 *
 * Frontend API client for sales pitch endpoints
 */

import request from '@/lib/request';
import type { SalesPitch, SalesPitchStatus } from '../types/sales-pitch';

const BASE_PATH = '/api/v1/leads';

export interface BatchGenerationJobResponse {
  jobId: string;
  total: number;
  message: string;
}

export interface BatchGenerationProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: boolean;
}

export const salesPitchApi = {
  /**
   * Get or generate sales pitch for lead
   */
  async getSalesPitch(leadId: string): Promise<SalesPitch> {
    const response = await request.get<SalesPitch>(
      `${BASE_PATH}/${leadId}/sales-pitch`
    );
    return response.data;
  },

  /**
   * Force regenerate sales pitch (bypass cache)
   */
  async regeneratePitch(leadId: string): Promise<SalesPitch> {
    const response = await request.post<SalesPitch>(
      `${BASE_PATH}/${leadId}/sales-pitch/regenerate`
    );
    return response.data;
  },

  /**
   * Check if pitch exists in cache
   */
  async getPitchStatus(leadId: string): Promise<SalesPitchStatus> {
    const response = await request.get<SalesPitchStatus>(
      `${BASE_PATH}/${leadId}/sales-pitch/status`
    );
    return response.data;
  },

  /**
   * Batch generate pitches for multiple leads
   */
  async batchGeneratePitches(
    leadIds: string[]
  ): Promise<BatchGenerationJobResponse> {
    const response = await request.post<BatchGenerationJobResponse>(
      `${BASE_PATH}/batch/generate-pitches`,
      { leadIds }
    );
    return response.data;
  },

  /**
   * Get batch generation job progress
   */
  async getBatchProgress(jobId: string): Promise<BatchGenerationProgress> {
    const response = await request.get<BatchGenerationProgress>(
      `${BASE_PATH}/batch/generate-pitches/${jobId}/progress`
    );
    return response.data;
  },
};
