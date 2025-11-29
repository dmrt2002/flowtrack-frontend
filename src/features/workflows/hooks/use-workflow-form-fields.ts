import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFormFields, saveFormFields } from '../services/workflow-api';
import type { SaveFormFieldsDto } from '../types/workflow';

export function useWorkflowFormFields(workflowId: string | null) {
  return useQuery({
    queryKey: ['workflowFormFields', workflowId],
    queryFn: () => getFormFields(workflowId!),
    enabled: !!workflowId,
    retry: false,
  });
}

export function useSaveFormFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: SaveFormFieldsDto) => saveFormFields(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workflowFormFields', data.workflowId],
      });
      queryClient.invalidateQueries({
        queryKey: ['embedCode', data.workflowId],
      });
    },
  });
}
