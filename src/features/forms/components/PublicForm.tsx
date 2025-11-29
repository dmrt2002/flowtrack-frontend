'use client';

import React, { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { FormFieldRenderer } from './FormFieldRenderer';
import { SubmissionSuccess } from './SubmissionSuccess';
import { RichTextViewer } from '@/components/RichTextEditor';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { useFormResize } from '../hooks/useFormResize';
import { validateForm } from '../utils/validation';
import type { PublicFormSchema } from '../types/public-form';

interface PublicFormProps {
  formSchema: PublicFormSchema;
}

export function PublicForm({ formSchema }: PublicFormProps) {
  const { submitForm, isSubmitting, error, fieldErrors, success, response } =
    useFormSubmission(formSchema.workspaceSlug);

  // Use resize hook to communicate height changes to parent iframe
  useFormResize();

  // Form values and validation state
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    formSchema.fields.forEach((field) => {
      if (field.fieldType === 'CHECKBOX') {
        initial[field.fieldKey] = false;
      } else {
        initial[field.fieldKey] = '';
      }
    });
    return initial;
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleFieldChange = (fieldKey: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[fieldKey]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (fieldKey: string) => {
    setTouched((prev) => ({ ...prev, [fieldKey]: true }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm(formSchema.fields, formValues);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Mark all fields as touched
      const allTouched: Record<string, boolean> = {};
      formSchema.fields.forEach((field) => {
        allTouched[field.fieldKey] = true;
      });
      setTouched(allTouched);
      return;
    }

    try {
      await submitForm(formValues);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  // Show success state
  if (success && response) {
    return (
      <div className="animate-fadeIn flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
        <div className="animate-slideUp w-full max-w-[580px] rounded-2xl bg-white p-8 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_25px_rgba(0,0,0,0.05),0_20px_40px_rgba(79,70,229,0.08)] md:p-12">
          <SubmissionSuccess
            message={response.message}
            leadId={response.leadId}
            redirectUrl={response.redirectUrl}
          />
        </div>
      </div>
    );
  }

  // Main form UI
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-6">
      <div className="animate-fadeIn w-full max-w-[580px] rounded-2xl border-t-4 border-indigo-600 bg-white p-8 shadow-[0_4px_6px_rgba(0,0,0,0.02),0_10px_25px_rgba(0,0,0,0.05),0_20px_40px_rgba(79,70,229,0.08)] md:p-12">
        {/* Workspace Branding */}
        <div className="mb-8 border-b border-neutral-100 pb-6 text-center"></div>

        {/* Form Header */}
        <div className="mb-8 text-center">
          {formSchema.settings?.showFormHeader !== false &&
          formSchema.settings?.formHeader ? (
            <div className="mb-2 text-center text-[32px] leading-tight font-bold tracking-tight text-neutral-900 md:text-[32px]">
              <RichTextViewer
                html={formSchema.settings.formHeader}
                className=""
              />
            </div>
          ) : (
            <h1 className="mb-2 text-[32px] leading-tight font-bold tracking-tight text-neutral-900 md:text-[32px]">
              Get in Touch
            </h1>
          )}
          {formSchema.settings?.showFormDescription !== false &&
          formSchema.settings?.formDescription ? (
            <div className="text-center text-[17px] leading-relaxed text-neutral-600">
              <RichTextViewer
                html={formSchema.settings.formDescription}
                className=""
              />
            </div>
          ) : (
            <p className="text-[17px] leading-relaxed text-neutral-600">
              Fill out the form below and we&apos;ll get back to you within 24
              hours
            </p>
          )}
        </div>

        {/* Error Banner */}
        {(error || Object.keys(validationErrors).length > 0) && !success && (
          <div className="animate-slideDown mb-6 flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="mb-1 text-sm font-semibold text-red-600">
                {error || 'Please fix the errors below'}
              </p>
              <p className="text-sm text-neutral-700">
                Some fields need your attention
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Render all fields */}
          {formSchema.fields.map((field) => (
            <FormFieldRenderer
              key={field.id}
              field={field}
              value={formValues[field.fieldKey]}
              onChange={(value) => handleFieldChange(field.fieldKey, value)}
              onBlur={() => handleFieldBlur(field.fieldKey)}
              error={
                fieldErrors[field.fieldKey] ||
                (touched[field.fieldKey]
                  ? validationErrors[field.fieldKey]
                  : undefined)
              }
            />
          ))}

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting || !formSchema.isActive}
              className={`h-[52px] w-full rounded-[10px] px-8 text-[16px] font-semibold text-white shadow-[0_2px_4px_rgba(79,70,229,0.15),0_4px_12px_rgba(79,70,229,0.1)] transition-all duration-200 ${
                isSubmitting || !formSchema.isActive
                  ? 'cursor-not-allowed bg-neutral-300 text-neutral-500'
                  : 'bg-gradient-to-br from-indigo-600 to-indigo-700 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_4px_8px_rgba(79,70,229,0.2),0_8px_20px_rgba(79,70,229,0.15)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(79,70,229,0.15),0_2px_6px_rgba(79,70,229,0.1)]'
              } `}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : (
                formSchema.settings.submitButtonText || 'Submit'
              )}
            </button>
          </div>

          {/* Inactive form notice */}
          {!formSchema.isActive && (
            <p className="mt-4 text-center text-sm font-medium text-amber-600">
              This form is currently inactive
            </p>
          )}
        </form>

        {/* Footer Branding */}
        <div className="mt-8 border-t border-neutral-100 pt-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-[13px] text-neutral-400">
            <span>Powered by</span>
            <a
              href="https://flowtrack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
            >
              FlowTrack
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
