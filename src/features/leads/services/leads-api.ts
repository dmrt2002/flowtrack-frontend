import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  LeadsListParams,
  LeadsListResponse,
  LeadDetailResponse,
  LeadMetrics,
  UpdateLeadDto,
  UpdateLeadStatusDto,
  BulkUpdateLeadsDto,
} from '../types/lead';

export async function getLeads(
  workspaceId: string,
  params?: LeadsListParams
): Promise<LeadsListResponse> {
  const { data } = await request.get<LeadsListResponse>(
    mainUrl.getLeads(workspaceId),
    { params }
  );
  return data;
}

export async function getLeadById(
  workspaceId: string,
  leadId: string
): Promise<LeadDetailResponse> {
  const { data } = await request.get<LeadDetailResponse>(
    mainUrl.getLeadById(workspaceId, leadId)
  );
  return data;
}

export async function getLeadMetrics(
  workspaceId: string,
  period?: '7d' | '30d' | '90d'
): Promise<LeadMetrics> {
  const { data } = await request.get<LeadMetrics>(
    mainUrl.getLeadMetrics(workspaceId),
    { params: { period } }
  );
  return data;
}

export async function updateLead(
  workspaceId: string,
  leadId: string,
  dto: UpdateLeadDto
): Promise<LeadDetailResponse> {
  const { data } = await request.patch<LeadDetailResponse>(
    mainUrl.updateLead(workspaceId, leadId),
    dto
  );
  return data;
}

export async function updateLeadStatus(
  workspaceId: string,
  leadId: string,
  dto: UpdateLeadStatusDto
): Promise<LeadDetailResponse> {
  const { data } = await request.patch<LeadDetailResponse>(
    mainUrl.updateLeadStatus(workspaceId, leadId),
    dto
  );
  return data;
}

export async function bulkUpdateLeads(
  workspaceId: string,
  dto: BulkUpdateLeadsDto
): Promise<{ success: boolean; updatedCount: number }> {
  const { data } = await request.patch<{
    success: boolean;
    updatedCount: number;
  }>(mainUrl.bulkUpdateLeads(workspaceId), dto);
  return data;
}

export async function deleteLead(
  workspaceId: string,
  leadId: string
): Promise<{ success: boolean }> {
  const { data } = await request.delete<{ success: boolean }>(
    mainUrl.deleteLead(workspaceId, leadId)
  );
  return data;
}

export async function exportLeads(
  workspaceId: string,
  params?: LeadsListParams
): Promise<Blob> {
  const { data } = await request.get<Blob>(mainUrl.exportLeads(workspaceId), {
    params,
    responseType: 'blob',
  });
  return data;
}

export async function enrichLead(
  workspaceId: string,
  leadId: string
): Promise<{ success: boolean; message: string; leadId: string }> {
  const { data } = await request.post<{
    success: boolean;
    message: string;
    leadId: string;
  }>(mainUrl.enrichLead(workspaceId, leadId));
  return data;
}
