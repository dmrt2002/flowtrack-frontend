'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Mail, Zap } from 'lucide-react';
import { useOnboardingStore } from '../store/onboardingStore';
import { useConfigurationMutation } from '../hooks/useConfigurationMutation';
import { useFormFields } from '../hooks/useFormFields';
import { VariableAutocomplete } from '../components/VariableAutocomplete';
import { EmailPreviewPanel } from '../components/EmailPreviewPanel';
import { ConditionInput } from '../components/ConditionInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ConfigField } from '../types';
import type { FormField } from '../types/form-fields';
import { useCurrentUser } from '@/store/currentUserStore';
import { getCurrentUser } from '@/features/auth/services';

const BOOKING_SENTENCE =
  "Here's my booking link so you can pick a time that works best: {bookingUrl}";

const ensureBookingSentence = (template?: string): string | undefined => {
  if (!template) return template;
  if (template.includes('{bookingUrl}')) {
    return template;
  }

  const signatureIndex = template.search(
    /\n\n(Best|Cheers|Thanks|Talk soon|Warm regards)/i
  );

  if (signatureIndex >= 0) {
    return (
      template.slice(0, signatureIndex) +
      `\n\n${BOOKING_SENTENCE}` +
      template.slice(signatureIndex)
    );
  }

  return `${template}\n\n${BOOKING_SENTENCE}`;
};

export function ConfigurationScreen() {
  const router = useRouter();
  const { configuration, workflowId, configurationSchema } =
    useOnboardingStore();
  const { mutate: saveConfiguration, isPending } = useConfigurationMutation();
  const [formData, setFormData] =
    useState<Record<string, unknown>>(configuration);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTemplateField, setActiveTemplateField] = useState<
    'emailTemplate' | 'followUpTemplate'
  >('emailTemplate');
  const { currentUser, setUser } = useCurrentUser();
  const senderFirstName = currentUser?.firstName?.trim();
  const hasRequestedUser = useRef(false);

  useEffect(() => {
    if (currentUser || hasRequestedUser.current) {
      return;
    }

    hasRequestedUser.current = true;

    getCurrentUser()
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.error('Failed to fetch current user for onboarding:', error);
        hasRequestedUser.current = false;
      });
  }, [currentUser, setUser]);

  const enhanceTemplate = useCallback(
    (template?: string, enforceBooking = false): string | undefined => {
      if (!template) return template;

      const displayName =
        senderFirstName && senderFirstName.length > 0
          ? senderFirstName
          : 'Your Name';

      let updatedTemplate = template.replace(/\[Your Name\]/g, displayName);

      if (enforceBooking) {
        updatedTemplate =
          ensureBookingSentence(updatedTemplate) ?? updatedTemplate;
      }

      return updatedTemplate;
    },
    [senderFirstName]
  );

  useEffect(() => {
    if (!senderFirstName) {
      return;
    }

    setFormData((prev) => {
      const updates: Record<string, unknown> = {};
      (['emailTemplate', 'followUpTemplate'] as const).forEach((fieldId) => {
        const currentValue = prev[fieldId];
        if (
          typeof currentValue === 'string' &&
          currentValue.includes('Your Name')
        ) {
          updates[fieldId] = currentValue.replace(
            /Your Name/g,
            senderFirstName
          );
        }
      });

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [senderFirstName]);

  // Fetch form fields from database
  const {
    data: formFieldsResponse,
    isLoading: isLoadingFormFields,
    error: formFieldsError,
  } = useFormFields(workflowId);

  // Extract available variables from form fields
  const baseAvailableVariables =
    formFieldsResponse?.data?.data?.availableVariables || [];

  // Extract numeric fields from form fields for condition builder
  const getNumericFields = (): string[] => {
    const formFields: FormField[] =
      formFieldsResponse?.data?.data?.formFields || [];
    return formFields
      .filter((field) => field.fieldType === 'NUMBER')
      .map((field) => field.fieldKey);
  };

  const numericFields = getNumericFields();

  // Initialize defaults on first mount when configuration is empty
  useEffect(() => {
    const isFormDataEmpty = Object.keys(formData).length === 0;

    if (configurationSchema && isFormDataEmpty && !configuration) {
      const initialDefaults: Record<string, unknown> = {};

      // Initialize email template default
      const emailTemplateField = configurationSchema.fields.find(
        (f) => f.id === 'emailTemplate'
      );
      if (emailTemplateField?.placeholder) {
        initialDefaults.emailTemplate = enhanceTemplate(
          emailTemplateField.placeholder,
          true
        );
      }

      // Initialize follow-up template default
      const followUpTemplateField = configurationSchema.fields.find(
        (f) => f.id === 'followUpTemplate'
      );
      if (followUpTemplateField?.placeholder) {
        initialDefaults.followUpTemplate = enhanceTemplate(
          followUpTemplateField.placeholder,
          true
        );
      }

      // Initialize email subject default
      const emailSubjectField = configurationSchema.fields.find(
        (f) => f.id === 'emailSubject'
      );
      if (emailSubjectField?.placeholder) {
        initialDefaults.emailSubject = emailSubjectField.placeholder;
      }

      // Initialize number fields with their placeholder values
      const followUpDelayField = configurationSchema.fields.find(
        (f) => f.id === 'followUpDelayDays'
      );
      if (followUpDelayField?.placeholder) {
        initialDefaults.followUpDelayDays =
          Number(followUpDelayField.placeholder) || 3;
      }

      const bookingDeadlineField = configurationSchema.fields.find(
        (f) => f.id === 'bookingDeadlineDays'
      );
      if (bookingDeadlineField?.placeholder) {
        initialDefaults.bookingDeadlineDays =
          Number(bookingDeadlineField.placeholder) || 7;
      }

      if (Object.keys(initialDefaults).length > 0) {
        setFormData(initialDefaults);
      }
    }
  }, [configurationSchema, formData, configuration, enhanceTemplate]); // Run when schema loads or form data changes

  // Pre-fill default values when schema loads
  useEffect(() => {
    if (configurationSchema) {
      setFormData((prev) => {
        const updates: Record<string, unknown> = {};
        let hasUpdates = false;

        // Pre-fill email template
        const emailTemplateField = configurationSchema.fields.find(
          (f) => f.id === 'emailTemplate'
        );
        if (emailTemplateField?.placeholder) {
          const currentValue = prev.emailTemplate;
          if (!currentValue || String(currentValue).trim() === '') {
            updates.emailTemplate = enhanceTemplate(
              emailTemplateField.placeholder,
              true
            );
            hasUpdates = true;
          }
        }

        // Pre-fill follow-up template
        const followUpTemplateField = configurationSchema.fields.find(
          (f) => f.id === 'followUpTemplate'
        );
        if (followUpTemplateField?.placeholder) {
          const currentValue = prev.followUpTemplate;
          if (!currentValue || String(currentValue).trim() === '') {
            updates.followUpTemplate = enhanceTemplate(
              followUpTemplateField.placeholder,
              true
            );
            hasUpdates = true;
          }
        }

        // Pre-fill email subject
        const emailSubjectField = configurationSchema.fields.find(
          (f) => f.id === 'emailSubject'
        );
        if (emailSubjectField?.placeholder) {
          const currentValue = prev.emailSubject;
          if (!currentValue || String(currentValue).trim() === '') {
            updates.emailSubject = emailSubjectField.placeholder;
            hasUpdates = true;
          }
        }

        // Pre-fill number fields with their placeholder values
        const followUpDelayField = configurationSchema.fields.find(
          (f) => f.id === 'followUpDelayDays'
        );
        if (followUpDelayField?.placeholder) {
          const currentValue = prev.followUpDelayDays;
          if (
            currentValue === undefined ||
            currentValue === null ||
            currentValue === ''
          ) {
            updates.followUpDelayDays =
              Number(followUpDelayField.placeholder) || 3;
            hasUpdates = true;
          }
        }

        const bookingDeadlineField = configurationSchema.fields.find(
          (f) => f.id === 'bookingDeadlineDays'
        );
        if (bookingDeadlineField?.placeholder) {
          const currentValue = prev.bookingDeadlineDays;
          if (
            currentValue === undefined ||
            currentValue === null ||
            currentValue === ''
          ) {
            updates.bookingDeadlineDays =
              Number(bookingDeadlineField.placeholder) || 7;
            hasUpdates = true;
          }
        }

        // Only update if there are changes
        return hasUpdates ? { ...prev, ...updates } : prev;
      });
    }
  }, [configurationSchema, enhanceTemplate]);

  // Use available variables for fields that support them but don't have variables defined
  // The backend schema should already include variables, but we can enhance textarea fields
  // Also populate condition metadata with actual numeric fields
  // Filter out CRM field, responseTime field, emailSubject, and bookingUrl if they exist
  const enhancedSchema = configurationSchema
    ? {
        ...configurationSchema,
        fields: configurationSchema.fields
          .filter(
            (field) =>
              field.id !== 'crmIntegration' &&
              field.id !== 'responseTime' &&
              field.id !== 'emailSubject' &&
              field.id !== 'bookingUrl' // Remove bookingUrl - handled in Integrations step
          )
          .map((field) => {
            // If field is a textarea and doesn't have variables, add available variables
            if (field.type === 'textarea') {
              let fieldVariables =
                field.variables && field.variables.length > 0
                  ? field.variables
                  : baseAvailableVariables;

              const shouldInjectBookingUrl =
                field.id === 'emailTemplate' || field.id === 'followUpTemplate';

              if (shouldInjectBookingUrl) {
                const variableSet = new Set(fieldVariables || []);
                variableSet.add('{bookingUrl}');
                fieldVariables = Array.from(variableSet);
              }

              if (
                (!field.variables && (fieldVariables?.length || 0) > 0) ||
                (fieldVariables &&
                  field.variables &&
                  fieldVariables.join(',') !== field.variables.join(','))
              ) {
                return {
                  ...field,
                  variables: fieldVariables,
                };
              }
            }
            // If field is a condition, populate availableFields with actual numeric fields
            if (field.type === 'condition' && field.conditionMetadata) {
              return {
                ...field,
                conditionMetadata: {
                  ...field.conditionMetadata,
                  availableFields:
                    numericFields.length > 0
                      ? numericFields
                      : field.conditionMetadata.availableFields || ['budget'],
                },
              };
            }
            return field;
          }),
      }
    : null;

  const validateField = (field: ConfigField, value: unknown): string | null => {
    // Special handling for condition type
    if (field.type === 'condition') {
      if (field.required && !value) {
        return `${field.label} is required`;
      }
      if (value) {
        // Validate condition syntax (string format: "{field} operator value")
        const conditionStr = String(value);
        const conditionPattern =
          /^\{([a-zA-Z][a-zA-Z0-9_]*)\}\s*(>|<|>=|<=|==|!=)\s*(\d+(\.\d+)?)$/;
        if (!conditionPattern.test(conditionStr.trim())) {
          return 'Invalid format. Use: {fieldName} operator value (e.g., {budget} > 1000)';
        }
        // Validate field exists in available fields
        const match = conditionStr.trim().match(conditionPattern);
        if (match) {
          const fieldName = match[1];
          const availableFields =
            field.conditionMetadata?.availableFields || numericFields;
          if (
            availableFields.length > 0 &&
            !availableFields.includes(fieldName)
          ) {
            return `Field "${fieldName}" is not available. Available fields: ${availableFields.join(', ')}`;
          }
        }
      }
      return null;
    }

    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (!value && !field.required) return null;

    if (field.type === 'text' || field.type === 'textarea') {
      const strValue = String(value);
      if (
        field.validation?.minLength &&
        strValue.length < field.validation.minLength
      ) {
        return `Must be at least ${field.validation.minLength} characters`;
      }
      if (
        field.validation?.maxLength &&
        strValue.length > field.validation.maxLength
      ) {
        return `Must be less than ${field.validation.maxLength} characters`;
      }
      // Pattern validation (e.g., for URLs)
      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(strValue)) {
          return 'Invalid format';
        }
      }

      if (
        (field.id === 'emailTemplate' || field.id === 'followUpTemplate') &&
        !strValue.includes('{bookingUrl}')
      ) {
        return 'Please include your booking link using {bookingUrl}.';
      }
    }

    if (field.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) return 'Must be a valid number';
      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Must be at least ${field.validation.min}`;
      }
      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Must be less than ${field.validation.max}`;
      }
    }

    return null;
  };

  const handleSubmit = () => {
    if (!configurationSchema) return;

    const newErrors: Record<string, string> = {};
    configurationSchema.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveConfiguration({
      configuration: formData,
    });
  };

  const handleBack = () => {
    // From configuration step, navigate back to calendar/email integration
    router.push('/onboarding/connect');
  };

  const handleTemplateFocus = (fieldId: string) => {
    if (fieldId === 'emailTemplate' || fieldId === 'followUpTemplate') {
      setActiveTemplateField(fieldId);
    }
  };

  useEffect(() => {
    if (!senderFirstName) return;

    setFormData((prev) => {
      const updates: Record<string, string> = {};
      (['emailTemplate', 'followUpTemplate'] as const).forEach((fieldId) => {
        const value = prev[fieldId];
        if (typeof value === 'string' && value.includes('Your Name')) {
          updates[fieldId] = value.replace(/Your Name/g, senderFirstName);
        }
      });

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [senderFirstName]);

  const renderField = (field: ConfigField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const fieldVariables = field.variables || [];

    // Get icon and description based on field type
    const getFieldMeta = () => {
      if (field.id === 'responseTime') {
        return {
          icon: Clock,
          description:
            'Set how quickly you want to respond to new leads. Faster responses typically lead to higher conversion rates.',
          badge:
            Number(value) <= 15
              ? 'Fast Response'
              : Number(value) <= 60
                ? 'Standard'
                : 'Flexible',
        };
      }
      if (field.id === 'emailTemplate' || field.id === 'declineEmailBody') {
        return {
          icon: Mail,
          description:
            field.id === 'declineEmailBody'
              ? "Write a polite decline email for leads that don't meet your criteria. Use variables to personalize each message."
              : 'Write the first email that will be sent to new leads. Use variables to personalize each message.',
        };
      }
      if (field.id === 'budgetThreshold') {
        return {
          icon: Zap,
          description:
            field.helpText ||
            'Set the minimum budget threshold for qualifying leads.',
        };
      }
      if (field.id === 'qualificationCriteria') {
        return {
          icon: Zap,
          description:
            field.helpText || 'Qualified leads get priority treatment',
        };
      }
      return {
        icon: null,
        description: field.helpText || '',
      };
    };

    const { icon: Icon, description, badge } = getFieldMeta();

    return (
      <Card key={field.id} className="border-2 shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className="bg-primary/10 mt-1 rounded-lg p-2">
                  <Icon className="text-primary h-5 w-5" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive">*</span>
                  )}
                </CardTitle>
                {description && (
                  <CardDescription className="mt-1.5 text-sm">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>
            {badge && (
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-semibold">
                {badge}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {field.type === 'condition' ? (
            <ConditionInput
              id={field.id}
              value={String(formData[field.id] || '')}
              onChange={(value) => {
                setFormData({ ...formData, [field.id]: value });
                if (errors[field.id]) {
                  setErrors({ ...errors, [field.id]: '' });
                }
              }}
              availableFields={
                field.conditionMetadata?.availableFields &&
                field.conditionMetadata.availableFields.length > 0
                  ? field.conditionMetadata.availableFields
                  : numericFields
              }
              placeholder={
                field.conditionMetadata?.defaultField &&
                field.conditionMetadata?.defaultValue
                  ? `{${field.conditionMetadata.defaultField}} ${field.conditionMetadata.defaultOperator || '>'} ${field.conditionMetadata.defaultValue}`
                  : '{budget} > 1000'
              }
              required={field.required}
            />
          ) : field.type === 'textarea' ? (
            fieldVariables.length > 0 ? (
              <div className="space-y-3">
                <VariableAutocomplete
                  id={field.id}
                  value={String(value)}
                  onChange={(newValue) => {
                    setFormData({ ...formData, [field.id]: newValue });
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: '' });
                    }
                  }}
                  availableVariables={fieldVariables}
                  placeholder={field.placeholder}
                  rows={8}
                  required={field.required}
                  onFocus={() => handleTemplateFocus(field.id)}
                />
                {fieldVariables.length > 0 && (
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Available Variables:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {fieldVariables.map((variable, index) => (
                        <span
                          key={index}
                          className="border-border bg-background text-foreground rounded-md border px-2 py-1 font-mono text-xs"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Press{' '}
                      <kbd className="border-border bg-background rounded border px-1.5 py-0.5 font-mono">
                        Shift + Space
                      </kbd>{' '}
                      to insert variables
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                id={field.id}
                className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[200px] w-full rounded-md border bg-transparent px-4 py-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={field.placeholder}
                value={String(value)}
                onChange={(e) => {
                  setFormData({ ...formData, [field.id]: e.target.value });
                  if (errors[field.id]) {
                    setErrors({ ...errors, [field.id]: '' });
                  }
                }}
                rows={field.rows || 8}
                required={field.required}
                onFocus={() => handleTemplateFocus(field.id)}
              />
            )
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={String(value)}
                  onChange={(e) => {
                    const newValue =
                      field.type === 'number'
                        ? Number(e.target.value)
                        : e.target.value;
                    setFormData({ ...formData, [field.id]: newValue });
                    if (errors[field.id]) {
                      setErrors({ ...errors, [field.id]: '' });
                    }
                  }}
                  className="h-12 text-base"
                  required={field.required}
                />
                {field.suffix && (
                  <div className="border-input bg-muted/50 text-muted-foreground flex h-12 items-center rounded-md border px-4 text-sm font-medium">
                    {field.suffix}
                  </div>
                )}
              </div>
              {field.helpText && (
                <p className="text-muted-foreground text-xs">
                  {field.helpText}
                </p>
              )}
            </div>
          )}
          {error && (
            <p className="text-destructive text-sm font-medium">{error}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  // Show loading state while fetching form fields or schema
  if (isLoadingFormFields || !configurationSchema) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-28 lg:pb-0">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            <div className="flex min-h-[60vh] items-center justify-center">
              <p className="text-muted-foreground">Loading configuration...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if form fields fetch failed
  if (formFieldsError) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-28 lg:pb-0">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <p className="text-destructive mb-4">
                  Failed to load form fields. Please try again.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const emailTemplate = String(formData.emailTemplate || '');
  const followUpTemplate = String(formData.followUpTemplate || '');
  // Default responseTime to 5 minutes for preview (field is hidden from UI)
  const responseTime = Number(formData.responseTime) || 5;

  const getVariablesForField = (fieldId: string) => {
    return (
      enhancedSchema?.fields.find((field) => field.id === fieldId)?.variables ||
      baseAvailableVariables
    );
  };

  const activePreviewTemplate =
    activeTemplateField === 'followUpTemplate'
      ? followUpTemplate
      : emailTemplate;
  const activePreviewVariables =
    getVariablesForField(activeTemplateField) || [];
  const activeTemplateLabel =
    activeTemplateField === 'followUpTemplate'
      ? 'Follow-up email'
      : 'First email';

  return (
    <div className="bg-background flex h-screen flex-col overflow-hidden lg:flex-row">
      {/* Left Panel: Configuration Form */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <button
                onClick={handleBack}
                className="text-muted-foreground hover:text-primary mb-4 flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                    Customize your automation
                  </h1>
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                    Configure your automation workflow
                  </p>
                </div>
                <div className="text-muted-foreground text-xs font-medium sm:text-sm">
                  Step 4 of 4
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {enhancedSchema?.fields.map(renderField) || []}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Email Preview - Desktop/Laptop */}
      <div className="hidden lg:flex lg:h-full lg:w-1/2 xl:w-[45%]">
        <div className="border-border bg-muted/20 flex h-full w-full flex-col overflow-y-auto border-l p-6 lg:p-8">
          <EmailPreviewPanel
            emailTemplate={activePreviewTemplate}
            availableVariables={activePreviewVariables}
            responseTime={responseTime}
            activeTemplateLabel={activeTemplateLabel}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10 lg:py-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:w-auto"
        >
          {isPending ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
