import { useState } from 'react';
import {
  submitPublicForm,
  FormValidationError,
  getUTMParams,
  getOrCreateUTK,
} from '../services/formApi';
import type {
  FormSubmission,
  FormSubmissionResponse,
  FormErrors,
} from '../types/public-form';

export function useFormSubmission(workspaceSlug: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<FormSubmissionResponse | null>(null);

  const submitForm = async (data: Record<string, any>) => {
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      // Gather tracking data
      const utmParams = getUTMParams();
      const utk = getOrCreateUTK();

      const submission: FormSubmission = {
        fields: data,
        tracking: {
          utk,
          ...utmParams,
          referrer:
            typeof document !== 'undefined' ? document.referrer : undefined,
          pageUrl:
            typeof window !== 'undefined' ? window.location.href : undefined,
          pagePath:
            typeof window !== 'undefined'
              ? window.location.pathname
              : undefined,
          userAgent:
            typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        },
        metadata: {
          submittedAt: new Date().toISOString(),
          formVersion: '1.0',
        },
      };

      const result = await submitPublicForm(workspaceSlug, submission);

      setResponse(result);
      setSuccess(true);

      // Send success message to parent window (for iframe embedding)
      if (typeof window !== 'undefined' && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'flowtrack:submit:success',
            leadId: result.leadId,
            message: result.message,
          },
          '*'
        );
      }

      // Redirect if specified
      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl!;
        }, 1500);
      }

      return result;
    } catch (err) {
      if (err instanceof FormValidationError) {
        // Convert API errors to field errors format
        const errors: FormErrors = {};
        err.errors.forEach((apiError) => {
          errors[apiError.field] = {
            message: apiError.message,
            code: apiError.code,
          };
        });
        setFieldErrors(errors);
        setError('Please fix the errors below');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitting(false);
    setError(null);
    setFieldErrors({});
    setSuccess(false);
    setResponse(null);
  };

  return {
    submitForm,
    isSubmitting,
    error,
    fieldErrors,
    success,
    response,
    resetForm,
  };
}
