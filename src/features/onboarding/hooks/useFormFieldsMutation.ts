import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { useOnboardingStore } from '../store/onboardingStore';
import type {
  FormFieldsPayload,
  FormFieldsResponse,
} from '../types/form-fields';

export function useFormFieldsMutation() {
  const router = useRouter();
  const { setFormFields, completeStep } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: FormFieldsPayload) =>
      request.put<FormFieldsResponse>(mainUrl.onboardingFormFields, data),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;
      setFormFields(data.formFields);
      completeStep(2);
      toast.success('Form fields saved!');
      router.push('/onboarding/integrations');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save form fields';
      toast.error(errorMessage);
    },
  });
}
