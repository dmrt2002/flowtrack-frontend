'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormField } from '../types/form-fields';

interface LivePreviewPanelProps {
  formFields: FormField[];
  isAccordion?: boolean;
  isMobileSheet?: boolean;
}

function PreviewContent({
  formFields,
  previewMode,
  setPreviewMode,
  variables,
}: {
  formFields: FormField[];
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  variables: string[];
}) {
  const renderFieldPreview = (field: FormField) => {
    const fieldId = `preview-${field.fieldKey}`;

    switch (field.fieldType) {
      case 'TEXT':
      case 'EMAIL':
      case 'NUMBER':
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={fieldId}
              className="text-foreground mb-2 block text-sm font-medium"
            >
              {field.label}
              {field.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <input
              id={fieldId}
              type={
                field.fieldType === 'EMAIL'
                  ? 'email'
                  : field.fieldType === 'NUMBER'
                    ? 'number'
                    : 'text'
              }
              placeholder={field.placeholder}
              disabled
              className="border-input bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm"
            />
            {field.helpText && (
              <p className="text-muted-foreground mt-1 text-xs">
                {field.helpText}
              </p>
            )}
          </div>
        );

      case 'DROPDOWN':
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={fieldId}
              className="text-foreground mb-2 block text-sm font-medium"
            >
              {field.label}
              {field.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <select
              id={fieldId}
              disabled
              className="border-input bg-muted text-foreground w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">
                {field.placeholder || 'Select an option'}
              </option>
              {field.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-muted-foreground mt-1 text-xs">
                {field.helpText}
              </p>
            )}
          </div>
        );

      case 'TEXTAREA':
        return (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={fieldId}
              className="text-foreground mb-2 block text-sm font-medium"
            >
              {field.label}
              {field.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </label>
            <textarea
              id={fieldId}
              placeholder={field.placeholder}
              disabled
              rows={4}
              className="border-input bg-muted text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-2 text-sm"
            />
            {field.helpText && (
              <p className="text-muted-foreground mt-1 text-xs">
                {field.helpText}
              </p>
            )}
          </div>
        );

      case 'CHECKBOX':
        return (
          <div key={field.id} className="mb-4">
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                disabled
                className="border-input mt-0.5 h-4 w-4 cursor-not-allowed rounded"
              />
              <span className="text-foreground text-sm font-medium">
                {field.label}
                {field.isRequired && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </span>
            </label>
            {field.helpText && (
              <p className="text-muted-foreground mt-1 ml-6 text-xs">
                {field.helpText}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Preview Mode Tabs */}
      <div className="bg-muted mb-6 flex gap-1 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setPreviewMode('desktop')}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-xs font-medium transition-colors',
            previewMode === 'desktop'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Desktop
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode('mobile')}
          className={cn(
            'flex-1 rounded-md px-4 py-2 text-xs font-medium transition-colors',
            previewMode === 'mobile'
              ? 'bg-background text-primary shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Mobile
        </button>
      </div>

      {/* Form Preview Container */}
      <div
        className={cn(
          'bg-background border-border mx-auto rounded-xl border p-4 shadow-lg sm:p-6 lg:p-8',
          previewMode === 'desktop'
            ? 'w-full max-w-md'
            : 'border-foreground w-full max-w-[375px] border-[12px]'
        )}
      >
        <form className="space-y-4">
          {formFields.map((field) => renderFieldPreview(field))}
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-md bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] px-6 py-3 text-sm font-semibold text-white shadow-sm"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Available Variables Section */}
      {variables.length > 0 && (
        <div className="border-primary bg-primary/10 mt-6 rounded-lg border p-4 lg:mt-8">
          <h3 className="text-primary mb-3 text-xs font-semibold tracking-wider uppercase">
            Available Variables
          </h3>
          <div className="flex flex-wrap gap-2">
            {variables.map((variable) => (
              <button
                key={variable}
                type="button"
                className="border-primary text-primary hover:bg-primary inline-flex items-center rounded-full border bg-white px-2.5 py-1 font-mono text-xs font-medium transition-all hover:shadow-md"
                title={`Click to copy ${variable}`}
                onClick={() => {
                  navigator.clipboard.writeText(variable);
                }}
              >
                {variable}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-3 text-xs">
            These variables can be used in your email templates
          </p>
        </div>
      )}
    </>
  );
}

export function LivePreviewPanel({
  formFields,
  isAccordion = false,
  isMobileSheet = false,
}: LivePreviewPanelProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(
    'desktop'
  );
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const customFieldsCount = formFields.filter((f) => !f.isDefault).length;

  const generateVariables = (fields: FormField[]): string[] => {
    const fieldVariables = fields.map((field) => `{${field.fieldKey}}`);
    return fieldVariables;
  };

  const variables = generateVariables(formFields);

  // Accordion mode (Tablet)
  if (isAccordion) {
    return (
      <div className="border-border bg-muted/30 border-t">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="flex w-full items-center justify-between p-4 text-left"
          aria-expanded={isAccordionOpen}
        >
          <div>
            <h2 className="text-foreground text-base font-semibold">
              Form Preview
            </h2>
            <p className="text-muted-foreground mt-1 text-xs">
              {customFieldsCount} custom field
              {customFieldsCount !== 1 ? 's' : ''}
            </p>
          </div>
          {isAccordionOpen ? (
            <ChevronUp className="text-muted-foreground h-5 w-5" />
          ) : (
            <ChevronDown className="text-muted-foreground h-5 w-5" />
          )}
        </button>
        {isAccordionOpen && (
          <div className="border-border border-t bg-white p-6">
            <PreviewContent
              formFields={formFields}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              variables={variables}
            />
          </div>
        )}
      </div>
    );
  }

  // Mobile sheet mode - just content without wrapper
  if (isMobileSheet) {
    return (
      <PreviewContent
        formFields={formFields}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        variables={variables}
      />
    );
  }

  // Desktop/Laptop mode - sidebar
  return (
    <aside
      className="border-border bg-muted/30 sticky top-0 h-screen overflow-y-auto border-l p-6 lg:p-8"
      aria-label="Live Form Preview"
      role="complementary"
    >
      <div className="mb-6">
        <h2 className="text-foreground text-lg font-semibold">Form Preview</h2>
      </div>
      <PreviewContent
        formFields={formFields}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        variables={variables}
      />
    </aside>
  );
}
