import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface InitWorkflowResponse {
  success: boolean;
  data: {
    workflowId: string;
    workspaceId: string;
    configurationSchema: {
      fields: Array<{
        id: string;
        type: string;
        label: string;
        placeholder?: string;
        required: boolean;
        validation?: Record<string, any>;
        variables?: string[];
        rows?: number;
        helpText?: string;
        conditionMetadata?: {
          availableFields: string[];
          operators: string[];
          defaultField?: string;
          defaultOperator?: string;
          defaultValue?: number;
          defaultCurrency?: 'USD' | 'INR';
        };
      }>;
    };
  };
}

export function useInitWorkflow() {
  const {
    workflowId,
    workspaceId,
    setWorkflowId,
    setWorkspaceId,
    setConfigurationSchema,
  } = useOnboardingStore();
  const hasProcessedRef = useRef(false);
  const processedQueryDataRef = useRef<InitWorkflowResponse | null>(null);

  const query = useQuery({
    queryKey: ['onboarding', 'init'],
    queryFn: async () => {
      try {
        console.log(
          'Initializing workflow...',
          'Current workflowId:',
          workflowId
        );
        const response = await request.get<InitWorkflowResponse>(
          mainUrl.onboardingInit
        );
        console.log('Init workflow response:', response.data);
        // Backend returns { success: true, data: { workflowId, configurationSchema } }
        return response.data;
      } catch (error: any) {
        console.error('Failed to initialize workflow:', error);
        console.error('Error details:', error?.response?.data);
        throw error;
      }
    },
    enabled: !workflowId, // Only run if workflowId is not set
    retry: 1, // Retry once on failure
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
    // Only run the query if workflowId is not set
    // The backend handles returning existing workflow if it exists
  });

  // Update store when data is available
  // Use ref to prevent re-processing the same query data
  useEffect(() => {
    // Only process if:
    // 1. Query has data
    // 2. We haven't already processed this exact query data
    if (
      query.data?.success &&
      query.data.data &&
      processedQueryDataRef.current !== query.data
    ) {
      const {
        workflowId: newWorkflowId,
        workspaceId: newWorkspaceId,
        configurationSchema,
      } = query.data.data;

      console.log(
        '🔍 useInitWorkflow processing:',
        'newWorkflowId:',
        newWorkflowId,
        'newWorkspaceId:',
        newWorkspaceId,
        'hasProcessedRef:',
        hasProcessedRef.current,
        'current workflowId:',
        workflowId,
        'current workspaceId:',
        workspaceId
      );

      // Guard: Don't set if we've already processed
      if (hasProcessedRef.current) {
        console.log('❌ Skipping update - already processed');
        return;
      }

      console.log(
        '✅ Setting workflowId:',
        newWorkflowId,
        'workspaceId:',
        newWorkspaceId
      );

      // Mark as processed before setting to prevent race conditions
      hasProcessedRef.current = true;
      processedQueryDataRef.current = query.data;

      // Always set all values from the response
      if (newWorkflowId) {
        setWorkflowId(newWorkflowId);
      }
      if (newWorkspaceId) {
        setWorkspaceId(newWorkspaceId);
      }
      if (configurationSchema) {
        setConfigurationSchema(configurationSchema);
      }
    }
  }, [
    query.data,
    setWorkflowId,
    setWorkspaceId,
    setConfigurationSchema,
    workflowId,
    workspaceId,
  ]); // Include both IDs to satisfy hook deps

  // Reset ref if workflowId becomes null (e.g., after logout)
  useEffect(() => {
    if (!workflowId) {
      hasProcessedRef.current = false;
      processedQueryDataRef.current = null;
    }
  }, [workflowId]);

  return query;
}
