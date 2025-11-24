import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type { ActivateWorkflowResponse } from '../types';

interface ActivateWorkflowData {
  configurationId: string;
}

export function useActivateWorkflowMutation() {
  const router = useRouter();
  const { completeOnboarding } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: ActivateWorkflowData) =>
      request.post<ActivateWorkflowResponse>(mainUrl.workflowActivate, {
        configurationId: data.configurationId,
      }),
    retry: false,
    onSuccess: () => {
      completeOnboarding();
      document.cookie = 'onboarding_complete=true; path=/';
      toast.success('Automation activated! Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard-home');
      }, 1500);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to activate automation';
      toast.error(errorMessage);
    },
  });
}
