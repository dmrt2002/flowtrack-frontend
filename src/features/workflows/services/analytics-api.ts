import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  WorkflowAnalytics,
  FormPerformanceMetrics,
  SubmissionTimeSeriesPoint,
  LeadSourceBreakdown,
  RecentSubmission,
  WorkflowAnalyticsQueryParams,
} from '../types/analytics';

export async function getWorkflowAnalytics(
  workflowId: string,
  params?: WorkflowAnalyticsQueryParams
): Promise<WorkflowAnalytics> {
  const { data } = await request.get<WorkflowAnalytics>(
    mainUrl.workflowAnalytics(workflowId),
    { params }
  );
  return data;
}

export async function getFormPerformanceMetrics(
  workflowId: string,
  period?: '7d' | '30d' | '90d'
): Promise<FormPerformanceMetrics> {
  const { data } = await request.get<FormPerformanceMetrics>(
    mainUrl.workflowAnalyticsPerformance(workflowId),
    { params: { period } }
  );
  return data;
}

export async function getSubmissionsTimeSeries(
  workflowId: string,
  period?: '7d' | '30d' | '90d'
): Promise<SubmissionTimeSeriesPoint[]> {
  const { data } = await request.get<SubmissionTimeSeriesPoint[]>(
    mainUrl.workflowAnalyticsTimeSeries(workflowId),
    { params: { period } }
  );
  return data;
}

export async function getTopLeadSources(
  workflowId: string,
  period?: '7d' | '30d' | '90d'
): Promise<LeadSourceBreakdown[]> {
  const { data } = await request.get<LeadSourceBreakdown[]>(
    mainUrl.workflowAnalyticsSources(workflowId),
    { params: { period } }
  );
  return data;
}

export async function getRecentSubmissions(
  workflowId: string,
  recentLimit?: number
): Promise<RecentSubmission[]> {
  const { data } = await request.get<RecentSubmission[]>(
    mainUrl.workflowAnalyticsRecent(workflowId),
    { params: { recentLimit } }
  );
  return data;
}
