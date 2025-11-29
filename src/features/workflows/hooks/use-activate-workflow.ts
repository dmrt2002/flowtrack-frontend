import { useMutation, useQueryClient } from '@tanstack/react-query';
import { activateWorkflow } from '../services/workflow-api';
import type { ActivateWorkflowDto } from '../types/workflow';

export function useActivateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: ActivateWorkflowDto) => activateWorkflow(dto),
    onSuccess: (data, variables) => {
      // Invalidate all workflow-related queries
      queryClient.invalidateQueries({
        queryKey: ['workflowFormFields', variables.workflowId],
      });
      queryClient.invalidateQueries({
        queryKey: ['embedCode', variables.workflowId],
      });
      queryClient.invalidateQueries({ queryKey: ['embeddableWorkflows'] });
    },
  });
}
