import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type { OAuthCompleteResponse } from '../types';

interface OAuthCompleteData {
  provider: 'gmail' | 'outlook';
  email: string;
}

export function useOAuthCompleteMutation() {
  const router = useRouter();
  const { setOAuthConnection, completeStep } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: OAuthCompleteData) =>
      request.post<OAuthCompleteResponse>(
        mainUrl.onboardingOAuthComplete,
        data
      ),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setOAuthConnection(data.provider, data.email);
      completeStep(3);
      toast.success(`Successfully connected ${data.email}`);
      setTimeout(() => {
        router.push('/onboarding/simulate');
      }, 1500);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to complete OAuth connection';
      toast.error(errorMessage);
    },
  });
}
