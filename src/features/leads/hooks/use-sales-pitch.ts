/**
 * Sales Pitch React Query Hooks
 *
 * React Query hooks for managing sales pitch state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesPitchApi } from '../services/sales-pitch-api';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

/**
 * Query key factory
 */
export const salesPitchKeys = {
  all: ['sales-pitch'] as const,
  detail: (leadId: string) => [...salesPitchKeys.all, leadId] as const,
  status: (leadId: string) =>
    [...salesPitchKeys.all, 'status', leadId] as const,
  batchProgress: (jobId: string) =>
    [...salesPitchKeys.all, 'batch', jobId] as const,
};

/**
 * Hook to fetch sales pitch for a lead
 */
export function useSalesPitch(leadId: string, enabled = true) {
  return useQuery({
    queryKey: salesPitchKeys.detail(leadId),
    queryFn: () => salesPitchApi.getSalesPitch(leadId),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour (pitch doesn't change often)
    retry: 1,
  });
}

/**
 * Hook to regenerate sales pitch
 */
export function useRegeneratePitch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => salesPitchApi.regeneratePitch(leadId),
    onSuccess: (data, leadId) => {
      // Update cache with new pitch
      queryClient.setQueryData(salesPitchKeys.detail(leadId), data);
      toast.success('Sales pitch regenerated successfully!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to regenerate pitch';
      toast.error(message);
    },
  });
}

/**
 * Hook to check pitch status (lightweight, no generation)
 */
export function useSalesPitchStatus(leadId: string) {
  return useQuery({
    queryKey: salesPitchKeys.status(leadId),
    queryFn: () => salesPitchApi.getPitchStatus(leadId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to batch generate pitches for multiple leads
 */
export function useBatchGeneratePitches() {
  return useMutation({
    mutationFn: (leadIds: string[]) =>
      salesPitchApi.batchGeneratePitches(leadIds),
    onSuccess: (data) => {
      toast.success(`Generating pitches for ${data.total} leads...`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to start batch generation';
      toast.error(message);
    },
  });
}

/**
 * Hook to poll batch generation progress
 */
export function useBatchProgress(jobId: string | null, enabled = true) {
  return useQuery({
    queryKey: salesPitchKeys.batchProgress(jobId || 'none'),
    queryFn: () => salesPitchApi.getBatchProgress(jobId!),
    enabled: enabled && jobId !== null,
    refetchInterval: (data) => {
      // Stop polling when job is complete
      if (data && !data.inProgress) {
        return false;
      }
      return 2000; // Poll every 2 seconds
    },
    staleTime: 0, // Always fetch fresh data
  });
}

/**
 * Hook to manage batch generation with polling
 */
export function useBatchGenerationWithProgress() {
  const [jobId, setJobId] = useState<string | null>(null);
  const batchMutation = useBatchGeneratePitches();
  const { data: progress } = useBatchProgress(jobId);

  const startBatch = async (leadIds: string[]) => {
    try {
      const response = await batchMutation.mutateAsync(leadIds);
      setJobId(response.jobId);
      return response;
    } catch (error) {
      setJobId(null);
      throw error;
    }
  };

  const reset = () => {
    setJobId(null);
  };

  // Show completion toast
  useEffect(() => {
    if (progress && !progress.inProgress && progress.completed > 0) {
      toast.success(
        `Batch generation complete! ${progress.completed} pitches generated${progress.failed > 0 ? `, ${progress.failed} failed` : ''}`
      );
      // Reset after showing toast
      setTimeout(reset, 1000);
    }
  }, [progress]);

  return {
    startBatch,
    progress,
    isGenerating: progress?.inProgress || batchMutation.isPending,
    reset,
  };
}
