'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Mail, Zap } from 'lucide-react';
import { useOnboardingStore } from '../store/onboardingStore';
import { useConfigurationMutation } from '../hooks/useConfigurationMutation';
import { useFormFields } from '../hooks/useFormFields';
import { VariableAutocomplete } from '../components/VariableAutocomplete';
import { EmailPreviewPanel } from '../components/EmailPreviewPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ConfigField, ConfigSchema } from '../types';

export function ConfigurationScreen() {
  const router = useRouter();
  const { selectedStrategy, configuration, workflowId } = useOnboardingStore();
  const { mutate: saveConfiguration, isPending } = useConfigurationMutation();
  const [formData, setFormData] =
    useState<Record<string, unknown>>(configuration);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [configSchema, setConfigSchema] = useState<ConfigSchema | null>(null);
  const [defaultTemplateSet, setDefaultTemplateSet] = useState(false);

  // Fetch form fields from database
  const {
    data: formFieldsResponse,
    isLoading: isLoadingFormFields,
    error: formFieldsError,
  } = useFormFields(workflowId);

  useEffect(() => {
    // Build configuration schema based on selected strategy
    // Remove leadSource field and use dynamic variables from form fields
    if (selectedStrategy.id) {
      // Extract available variables from the response
      // Response structure: { data: { success: true, data: { availableVariables: [...] } } }
      const availableVariables =
        formFieldsResponse?.data?.data?.availableVariables || [];

      // Generate default email template with available variables
      // Prefer {name} if available, otherwise use first variable
      const nameVariable =
        availableVariables.find(
          (v) =>
            v.toLowerCase().includes('{name}') ||
            v.toLowerCase().includes('name')
        ) ||
        availableVariables[0] ||
        '{name}';

      // Extract variable name without braces for the template
      const nameVar = nameVariable.replace(/[{}]/g, '');

      const defaultEmailTemplate = `Hi {${nameVar}},\n\nThanks for reaching out! I'd love to learn more about what you're looking for.\n\nCan you tell me a bit about your current challenges?\n\nBest regards`;

      const defaultSchema: ConfigSchema = {
        strategyId: selectedStrategy.id,
        fields: [
          {
            id: 'responseTime',
            type: 'number',
            label: 'How quickly should we respond?',
            placeholder: '5',
            suffix: 'minutes',
            required: true,
            validation: { min: 1, max: 1440 },
          },
          {
            id: 'emailTemplate',
            type: 'textarea',
            label: 'What should the first email say?',
            placeholder: 'Hi {firstName}, thanks for reaching out...',
            required: true,
            rows: 5,
            variables: availableVariables,
          },
        ],
      };
      setConfigSchema(defaultSchema);

      // Set default email template once when form fields are loaded
      if (
        availableVariables.length > 0 &&
        !defaultTemplateSet &&
        !formData.emailTemplate
      ) {
        setFormData((prev) => ({
          ...prev,
          emailTemplate: defaultEmailTemplate,
        }));
        setDefaultTemplateSet(true);
      }
    }
  }, [
    selectedStrategy.id,
    formFieldsResponse,
    defaultTemplateSet,
    formData.emailTemplate,
  ]);

  const validateField = (field: ConfigField, value: unknown): string | null => {
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
    if (!configSchema || !selectedStrategy.id) return;

    const newErrors: Record<string, string> = {};
    configSchema.fields.forEach((field) => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveConfiguration({
      strategyId: selectedStrategy.id,
      configuration: formData,
    });
  };

  const handleBack = () => {
    router.push('/onboarding/form-builder');
  };

  const renderField = (field: ConfigField) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    const availableVariables = field.variables || [];

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
      if (field.id === 'emailTemplate') {
        return {
          icon: Mail,
          description:
            'Write the first email that will be sent to new leads. Use variables to personalize each message.',
        };
      }
      return { icon: null, description: '' };
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
          {field.type === 'textarea' ? (
            field.variables && field.variables.length > 0 ? (
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
                  availableVariables={field.variables}
                  placeholder={field.placeholder}
                  rows={8}
                  required={field.required}
                />
                {availableVariables.length > 0 && (
                  <div className="bg-muted/50 rounded-md p-3">
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      Available Variables:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableVariables.map((variable, index) => (
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
              {field.id === 'responseTime' && (
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Zap className="h-3 w-3" />
                  <span>Recommended: 5-15 minutes for best results</span>
                </div>
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

  // Show loading state while fetching form fields
  if (isLoadingFormFields || !configSchema) {
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

  const availableVariables =
    formFieldsResponse?.data?.data?.availableVariables || [];
  const emailTemplate = String(formData.emailTemplate || '');
  const responseTime = Number(formData.responseTime) || undefined;

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
                    Configure your {selectedStrategy.name} strategy
                  </p>
                </div>
                <div className="text-muted-foreground text-xs font-medium sm:text-sm">
                  Step 3 of 5
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {configSchema.fields.map(renderField)}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Email Preview - Desktop/Laptop */}
      <div className="hidden lg:flex lg:h-full lg:w-1/2 xl:w-[45%]">
        <div className="border-border bg-muted/20 flex h-full w-full flex-col overflow-y-auto border-l p-6 lg:p-8">
          <EmailPreviewPanel
            emailTemplate={emailTemplate}
            availableVariables={availableVariables}
            responseTime={responseTime}
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
