import { useQuery } from '@tanstack/react-query';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type { OnboardingStatusResponse } from '../types';

export function useOnboardingStatus() {
  return useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () =>
      request.get<OnboardingStatusResponse>(mainUrl.onboardingStatus),
    retry: false,
    staleTime: 0,
  });
}
