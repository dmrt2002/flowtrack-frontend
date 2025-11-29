export type ChangeDirection = 'up' | 'down' | 'neutral';

export interface MetricWithChange {
  total: number;
  change: number;
  changeDirection: ChangeDirection;
}

export interface FormPerformanceMetrics {
  submissions: MetricWithChange;
  views: MetricWithChange;
  conversionRate: MetricWithChange;
}

export interface SubmissionTimeSeriesPoint {
  date: string;
  submissions: number;
  views: number;
}

export interface LeadSourceBreakdown {
  source: string;
  count: number;
  percentage: number;
}

export interface RecentSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  source: string;
  submittedAt: string;
}

export interface WorkflowAnalytics {
  workflowId: string;
  workflowName: string;
  period: '7d' | '30d' | '90d';
  formPerformance: FormPerformanceMetrics;
  submissionsOverTime: SubmissionTimeSeriesPoint[];
  topLeadSources: LeadSourceBreakdown[];
  recentSubmissions: RecentSubmission[];
}

export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface WorkflowAnalyticsQueryParams {
  period?: AnalyticsPeriod;
  recentLimit?: number;
}
