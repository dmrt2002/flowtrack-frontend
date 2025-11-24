import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type { SimulationResponse } from '../types';
interface SimulationData {
  configurationId: string;
}

export function useSimulationMutation() {
  const { setSimulationData } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: SimulationData) =>
      request.post<SimulationResponse>(mainUrl.onboardingSimulate, {
        configurationId: data.configurationId,
      }),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setSimulationData(data.simulationData);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to generate simulation';
      toast.error(errorMessage);
    },
  });
}
