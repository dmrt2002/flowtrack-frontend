import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { toast } from 'sonner';

export interface WorkflowConfiguration {
  welcomeSubject?: string | null;
  welcomeBody?: string | null;
  thankYouSubject?: string | null;
  thankYouBody?: string | null;
  followUpSubject?: string | null;
  followUpBody?: string | null;
  followUpDelayDays?: number | null;
  deadlineDays?: number | null;
}

interface GetWorkflowConfigurationResponse {
  success: boolean;
  data: {
    workflowId: string;
    welcomeSubject: string | null;
    welcomeBody: string | null;
    thankYouSubject: string | null;
    thankYouBody: string | null;
    followUpSubject: string | null;
    followUpBody: string | null;
    followUpDelayDays: number | null;
    deadlineDays: number | null;
  };
}

interface UpdateWorkflowConfigurationPayload {
  workflowId: string;
  welcomeSubject?: string;
  welcomeBody?: string;
  thankYouSubject?: string;
  thankYouBody?: string;
  followUpSubject?: string;
  followUpBody?: string;
  followUpDelayDays?: number;
  deadlineDays?: number;
}

interface UpdateWorkflowConfigurationResponse {
  success: boolean;
  message: string;
  data: {
    workflowId: string;
    welcomeSubject: string | null;
    welcomeBody: string | null;
    thankYouSubject: string | null;
    thankYouBody: string | null;
    followUpSubject: string | null;
    followUpBody: string | null;
    followUpDelayDays: number | null;
    deadlineDays: number | null;
  };
}

/**
 * Hook to fetch workflow configuration
 */
export function useWorkflowConfiguration(workflowId: string) {
  return useQuery<WorkflowConfiguration>({
    queryKey: ['workflow-configuration', workflowId],
    queryFn: async () => {
      const response = await request.get<GetWorkflowConfigurationResponse>(
        mainUrl.getWorkflowConfiguration(workflowId)
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!workflowId,
  });
}

/**
 * Hook to update workflow configuration
 */
export function useSaveWorkflowConfiguration() {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateWorkflowConfigurationResponse,
    Error,
    UpdateWorkflowConfigurationPayload
  >({
    mutationFn: async (payload) => {
      const response = await request.put<UpdateWorkflowConfigurationResponse>(
        mainUrl.saveWorkflowConfiguration,
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the workflow configuration
      queryClient.invalidateQueries({
        queryKey: ['workflow-configuration', variables.workflowId],
      });

      toast.success('Workflow configuration saved successfully');
    },
    onError: (error) => {
      console.error('Failed to save workflow configuration:', error);
      toast.error('Failed to save workflow configuration');
    },
  });
}
