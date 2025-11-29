import request from '@/lib/request';
import type { DashboardOverview } from '../types';

const DASHBOARD_BASE_URL = '/api/v1/dashboard';

export const dashboardService = {
  /**
   * Get complete dashboard overview (workflow, metrics, leads)
   */
  getDashboardOverview: async (params?: {
    period?: '7d' | '30d' | '90d';
    limit?: number;
  }): Promise<DashboardOverview> => {
    const response = await request.get(`${DASHBOARD_BASE_URL}/overview`, {
      params,
    });
    return response.data;
  },
};
