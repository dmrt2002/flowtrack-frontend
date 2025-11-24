import { useQuery } from '@tanstack/react-query';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type { FormFieldsResponse } from '../types/form-fields';

export function useFormFields(workflowId: string | null) {
  return useQuery({
    queryKey: ['form-fields', workflowId],
    queryFn: () =>
      request.get<FormFieldsResponse>(
        `${mainUrl.onboardingFormFieldsGet}/${workflowId}`
      ),
    enabled: !!workflowId,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - prevent refetching
    refetchOnMount: false, // Don't refetch on mount
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: false, // Don't refetch on reconnect
  });
}
