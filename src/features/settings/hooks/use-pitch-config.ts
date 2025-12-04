/**
 * Pitch Configuration React Query Hooks
 *
 * React Query hooks for managing pitch configuration state
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pitchConfigApi } from '../services/pitch-config-api';
import { toast } from 'sonner';
import type {
  PitchTemplate,
  PitchQuickSettings,
  PitchAdvancedConfig,
} from '../types/pitch-config';

/**
 * Query key factory
 */
export const pitchConfigKeys = {
  all: ['pitch-config'] as const,
  config: () => [...pitchConfigKeys.all, 'config'] as const,
  templates: () => [...pitchConfigKeys.all, 'templates'] as const,
};

/**
 * Hook to fetch pitch configuration
 */
export function usePitchConfig() {
  return useQuery({
    queryKey: pitchConfigKeys.config(),
    queryFn: () => pitchConfigApi.getConfig(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch all templates
 */
export function usePitchTemplates() {
  return useQuery({
    queryKey: pitchConfigKeys.templates(),
    queryFn: () => pitchConfigApi.getAllTemplates(),
    staleTime: 1000 * 60 * 10, // 10 minutes (templates don't change often)
  });
}

/**
 * Hook to update quick settings
 */
export function useUpdateQuickSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quickSettings: Partial<PitchQuickSettings>) =>
      pitchConfigApi.updateQuickSettings(quickSettings),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      toast.success('Quick settings updated');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update quick settings';
      toast.error(message);
    },
  });
}

/**
 * Hook to select template
 */
export function useSelectTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      pitchConfigApi.selectTemplate(templateId),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      toast.success('Template selected');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to select template';
      toast.error(message);
    },
  });
}

/**
 * Hook to create custom template
 */
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      template: Omit<PitchTemplate, 'id' | 'createdAt' | 'updatedAt'>
    ) => pitchConfigApi.createTemplate(template),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      queryClient.invalidateQueries({ queryKey: pitchConfigKeys.templates() });
      toast.success('Custom template created');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to create template';
      toast.error(message);
    },
  });
}

/**
 * Hook to update custom template
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      updates,
    }: {
      templateId: string;
      updates: Partial<PitchTemplate>;
    }) => pitchConfigApi.updateTemplate(templateId, updates),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      queryClient.invalidateQueries({ queryKey: pitchConfigKeys.templates() });
      toast.success('Template updated');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update template';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete custom template
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) =>
      pitchConfigApi.deleteTemplate(templateId),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      queryClient.invalidateQueries({ queryKey: pitchConfigKeys.templates() });
      toast.success('Template deleted');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to delete template';
      toast.error(message);
    },
  });
}

/**
 * Hook to update advanced config
 */
export function useUpdateAdvancedConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (advancedConfig: Partial<PitchAdvancedConfig>) =>
      pitchConfigApi.updateAdvancedConfig(advancedConfig),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      toast.success('Advanced settings updated');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to update advanced settings';
      toast.error(message);
    },
  });
}

/**
 * Hook to validate template syntax
 */
export function useValidateTemplate() {
  return useMutation({
    mutationFn: (template: string) => pitchConfigApi.validateTemplate(template),
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to validate template';
      toast.error(message);
    },
  });
}

/**
 * Hook to reset to default
 */
export function useResetConfig() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pitchConfigApi.resetToDefault(),
    onSuccess: (data) => {
      queryClient.setQueryData(pitchConfigKeys.config(), data);
      queryClient.invalidateQueries({ queryKey: pitchConfigKeys.templates() });
      toast.success('Configuration reset to default');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Failed to reset configuration';
      toast.error(message);
    },
  });
}
