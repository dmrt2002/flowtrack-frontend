import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';

interface CalendlyPayload {
  workflowId: string;
  calendlyLink: string;
}

interface CalendlyResponse {
  success: boolean;
  message: string;
  data: {
    calendlyLink: string;
  };
}

export function useCalendlyMutation() {
  const { setCalendlyLink } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: CalendlyPayload) =>
      request.post<CalendlyResponse>(mainUrl.onboardingCalendly, data),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setCalendlyLink(data.calendlyLink);
      toast.success('Calendly link saved');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save Calendly link';
      toast.error(errorMessage);
    },
  });
}
