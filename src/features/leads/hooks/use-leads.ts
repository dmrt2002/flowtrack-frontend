import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLeads,
  getLeadById,
  getLeadMetrics,
  updateLead,
  updateLeadStatus,
  bulkUpdateLeads,
  deleteLead,
} from '../services/leads-api';
import type {
  LeadsListParams,
  UpdateLeadDto,
  UpdateLeadStatusDto,
  BulkUpdateLeadsDto,
} from '../types/lead';

// Fetch leads list with filters
export function useLeads(workspaceId: string | null, params?: LeadsListParams) {
  return useQuery({
    queryKey: ['leads', workspaceId, params],
    queryFn: () => getLeads(workspaceId!, params),
    enabled: !!workspaceId,
    retry: false,
  });
}

// Fetch single lead details
export function useLeadDetails(
  workspaceId: string | null,
  leadId: string | null
) {
  return useQuery({
    queryKey: ['lead', workspaceId, leadId],
    queryFn: () => getLeadById(workspaceId!, leadId!),
    enabled: !!workspaceId && !!leadId,
    retry: false,
  });
}

// Fetch lead metrics
export function useLeadMetrics(
  workspaceId: string | null,
  period?: '7d' | '30d' | '90d'
) {
  return useQuery({
    queryKey: ['leadMetrics', workspaceId, period],
    queryFn: () => getLeadMetrics(workspaceId!, period),
    enabled: !!workspaceId,
    retry: false,
  });
}

// Update single lead
export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      leadId,
      dto,
    }: {
      workspaceId: string;
      leadId: string;
      dto: UpdateLeadDto;
    }) => updateLead(workspaceId, leadId, dto),
    onSuccess: (data, variables) => {
      // Invalidate lead details
      queryClient.invalidateQueries({
        queryKey: ['lead', variables.workspaceId, variables.leadId],
      });
      // Invalidate leads list
      queryClient.invalidateQueries({
        queryKey: ['leads', variables.workspaceId],
      });
      // Invalidate metrics
      queryClient.invalidateQueries({
        queryKey: ['leadMetrics', variables.workspaceId],
      });
    },
  });
}

// Update lead status
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      leadId,
      dto,
    }: {
      workspaceId: string;
      leadId: string;
      dto: UpdateLeadStatusDto;
    }) => updateLeadStatus(workspaceId, leadId, dto),
    onSuccess: (data, variables) => {
      // Invalidate lead details
      queryClient.invalidateQueries({
        queryKey: ['lead', variables.workspaceId, variables.leadId],
      });
      // Invalidate leads list
      queryClient.invalidateQueries({
        queryKey: ['leads', variables.workspaceId],
      });
      // Invalidate metrics
      queryClient.invalidateQueries({
        queryKey: ['leadMetrics', variables.workspaceId],
      });
    },
  });
}

// Bulk update leads
export function useBulkUpdateLeads() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      dto,
    }: {
      workspaceId: string;
      dto: BulkUpdateLeadsDto;
    }) => bulkUpdateLeads(workspaceId, dto),
    onSuccess: (_data, variables) => {
      // Invalidate all leads queries for this workspace
      queryClient.invalidateQueries({
        queryKey: ['leads', variables.workspaceId],
      });
      // Invalidate individual lead queries for updated leads
      variables.dto.leadIds.forEach((leadId) => {
        queryClient.invalidateQueries({
          queryKey: ['lead', variables.workspaceId, leadId],
        });
      });
      // Invalidate metrics
      queryClient.invalidateQueries({
        queryKey: ['leadMetrics', variables.workspaceId],
      });
    },
  });
}

// Delete lead
export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workspaceId,
      leadId,
    }: {
      workspaceId: string;
      leadId: string;
    }) => deleteLead(workspaceId, leadId),
    onSuccess: (_data, variables) => {
      // Invalidate leads list
      queryClient.invalidateQueries({
        queryKey: ['leads', variables.workspaceId],
      });
      // Remove lead details from cache
      queryClient.removeQueries({
        queryKey: ['lead', variables.workspaceId, variables.leadId],
      });
      // Invalidate metrics
      queryClient.invalidateQueries({
        queryKey: ['leadMetrics', variables.workspaceId],
      });
    },
  });
}
