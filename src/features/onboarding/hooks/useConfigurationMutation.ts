import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type { ConfigurationResponse } from '../types';
interface ConfigurationData {
  configuration: Record<string, unknown>;
}

export function useConfigurationMutation() {
  const router = useRouter();
  const { setConfiguration, completeStep } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: ConfigurationData) =>
      request.post<ConfigurationResponse>(mainUrl.onboardingConfigure, {
        configuration: data.configuration,
      }),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setConfiguration(data.configuration, data.configurationId);
      completeStep(2);
      toast.success('Configuration saved!');
      router.push('/onboarding/simulate');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save configuration';
      toast.error(errorMessage);
    },
  });
}
