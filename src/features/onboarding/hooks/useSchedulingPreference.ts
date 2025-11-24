import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface SchedulingPreferencePayload {
  workflowId: string;
  schedulingType: 'CALENDLY' | 'GOOGLE_MEET';
  calendlyLink?: string;
}

interface SchedulingPreferenceResponse {
  success: boolean;
  message: string;
  data: {
    schedulingType: 'CALENDLY' | 'GOOGLE_MEET';
    calendlyLink: string | null;
  };
}

export function useSchedulingPreference() {
  const { setSchedulingPreference, setCalendlyLink } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: SchedulingPreferencePayload) =>
      request.post<SchedulingPreferenceResponse>(
        mainUrl.onboardingSchedulingPreference,
        data
      ),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setSchedulingPreference(data.schedulingType);
      if (data.calendlyLink) {
        setCalendlyLink(data.calendlyLink);
      }
      toast.success('Scheduling preference saved');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save scheduling preference';
      toast.error(errorMessage);
    },
  });
}
