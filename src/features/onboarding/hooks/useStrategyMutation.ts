import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type { StrategyResponse } from '../types';
import {
  toBackendStrategyId,
  toFrontendStrategyId,
  type FrontendStrategyId,
} from '../utils/strategyMapping';

interface StrategySelectionData {
  strategyId: FrontendStrategyId;
  templateId: string;
}

export function useStrategyMutation() {
  const router = useRouter();
  const { setStrategy, setWorkflowId, setConfigurationSchema, completeStep } =
    useOnboardingStore();

  return useMutation({
    mutationFn: (data: StrategySelectionData) =>
      request.post<StrategyResponse>(mainUrl.onboardingStrategy, {
        strategyId: toBackendStrategyId(data.strategyId),
        templateId: data.templateId,
      }),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      // Convert backend strategyId back to frontend ID
      const frontendStrategyId = toFrontendStrategyId(
        data.strategyId as
          | 'inbound-leads'
          | 'outbound-sales'
          | 'customer-nurture'
      );
      setStrategy(
        frontendStrategyId,
        data.strategyName,
        data.templateId,
        data.workflowId
      );
      setWorkflowId(data.workflowId);
      setConfigurationSchema(data.configurationSchema);
      completeStep(1);
      toast.success('Strategy selected!');
      router.push('/onboarding/form-builder');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save strategy selection';
      toast.error(errorMessage);
    },
  });
}
