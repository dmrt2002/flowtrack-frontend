import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type { TrackingEventsResponse, EmailStatsResponse } from '../types';

/**
 * Email Analytics API Service
 *
 * Handles API calls for MPP-proof email tracking system.
 * Follows the established pattern from hotbox-api.ts
 */
export const emailAnalyticsApi = {
  /**
   * Get tracking events for a specific sent email
   * @param sentEmailId - ID of the sent email
   * @returns Tracking events with classification breakdown
   */
  async getTrackingEvents(
    sentEmailId: string
  ): Promise<TrackingEventsResponse> {
    const url = mainUrl.getTrackingEvents(sentEmailId);
    const response = await request.get<TrackingEventsResponse>(url);
    return response.data;
  },

  /**
   * Get email statistics for a workspace
   * @param workspaceId - Workspace ID
   * @param dateRange - Optional date range filter
   * @returns Aggregate email statistics with genuine open rates
   */
  async getEmailStats(
    workspaceId: string,
    dateRange?: {
      start: string;
      end: string;
    }
  ): Promise<EmailStatsResponse> {
    const url = mainUrl.getEmailStats(workspaceId);
    const response = await request.get<EmailStatsResponse>(url, {
      params: dateRange
        ? {
            startDate: dateRange.start,
            endDate: dateRange.end,
          }
        : undefined,
    });
    return response.data;
  },
};
