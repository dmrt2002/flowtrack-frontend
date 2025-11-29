export interface DashboardMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  avgTimeToReply: string; // e.g., "2.3h"
  conversionRate: number; // e.g., 58 (percentage)
  trends: {
    totalLeads: TrendData;
    qualifiedLeads: TrendData;
    avgTimeToReply: TrendData;
    conversionRate: TrendData;
  };
}

export interface TrendData {
  value: number; // percentage change
  direction: 'up' | 'down' | 'neutral';
  label: string; // e.g., "+18% from last week"
}

import type { LeadStatus } from '../../leads/types/lead';

export interface LeadSummary {
  id: string;
  name: string | null;
  email: string;
  company?: string | null;
  budget?: string | null;
  status: LeadStatus;
  createdAt: string;
}

export interface WorkflowStatus {
  isActive: boolean;
  strategyName?: string;
  activatedAt?: string;
  publicFormUrl?: string;
}
