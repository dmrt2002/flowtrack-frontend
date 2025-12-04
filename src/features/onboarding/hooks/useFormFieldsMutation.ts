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

// Default field keys that should be filtered out
const DEFAULT_FIELD_KEYS = ['name', 'email', 'companyName'];

export function useFormFieldsMutation() {
  const router = useRouter();
  const { setFormFields, completeStep, setCompanyName } = useOnboardingStore();

  return useMutation({
    mutationFn: (data: FormFieldsPayload) =>
      request.put<FormFieldsResponse>(mainUrl.onboardingFormFields, data),
    retry: false,
    onSuccess: (response) => {
      const { data } = response.data;

      // Extract company name from form fields if available
      const companyNameField = data.formFields.find(
        (field) => field.fieldKey === 'companyName'
      );
      if (companyNameField) {
        setCompanyName(companyNameField.label || 'Company Name');
      }

      // Filter out default fields to prevent duplication
      // Default fields are always shown separately in the UI
      const customFieldsOnly = data.formFields.filter(
        (field) =>
          !DEFAULT_FIELD_KEYS.includes(field.fieldKey) && !field.isDefault
      );

      setFormFields(customFieldsOnly);
      completeStep(1);
      toast.success('Form fields saved!');
      router.push('/onboarding/company-enrichment');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to save form fields';
      toast.error(errorMessage);
    },
  });
}
