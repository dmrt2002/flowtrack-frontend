import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import { useCurrentUser } from '@/store/currentUserStore';
import type { ActivateWorkflowResponse } from '../types';

interface ActivateWorkflowData {
  configurationId: string;
}

export function useActivateWorkflowMutation() {
  const { completeOnboarding } = useOnboardingStore();
  const { setUser, currentUser } = useCurrentUser();

  return useMutation({
    mutationFn: (data: ActivateWorkflowData) =>
      request.post<ActivateWorkflowResponse>(mainUrl.workflowActivate, {
        configurationId: data.configurationId,
      }),
    retry: false,
    onSuccess: () => {
      completeOnboarding();

      // Set cookie (backend should also set this)
      document.cookie = 'onboarding_complete=true; path=/; max-age=2592000'; // 30 days

      // Update user in store to reflect onboarding completion
      if (currentUser) {
        setUser({
          ...currentUser,
          hasCompletedOnboarding: true,
          onboardingCompletedAt: new Date().toISOString(),
        });
      }

      // Don't redirect automatically - LaunchpadModal will handle navigation
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to activate automation';
      toast.error(errorMessage);
    },
  });
}
