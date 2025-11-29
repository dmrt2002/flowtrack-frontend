'use client';

import React from 'react';
import {
  Mail,
  Phone,
  Link as LinkIcon,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { FormField, FormFieldError } from '../types/public-form';

interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: FormFieldError | string;
}

export function FormFieldRenderer({
  field,
  value,
  onChange,
  onBlur,
  error,
}: FormFieldRendererProps) {
  const hasError = !!error;
  const errorMessage = typeof error === 'string' ? error : error?.message;

  // Base input styling per UX spec
  const baseInputClasses = `
    w-full h-12 px-4 text-[15px] font-normal text-neutral-900
    bg-neutral-50 border-[1.5px] border-neutral-200
    rounded-[10px] transition-all duration-200
    placeholder:text-neutral-400
    focus:outline-none focus:bg-white focus:border-indigo-600
    focus:shadow-[0_0_0_4px_rgba(79,70,229,0.08)]
    disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
    ${hasError ? '!border-red-500 !bg-red-50 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : ''}
  `.trim();

  const labelClasses = `
    block text-[14px] font-medium text-neutral-700 leading-tight mb-2
    ${field.isRequired ? "after:content-['*'] after:ml-1 after:text-red-500" : ''}
  `.trim();

  const textareaClasses = baseInputClasses.replace(
    'h-12',
    'min-h-[120px] py-3'
  );

  const renderInput = () => {
    const commonProps = {
      id: field.fieldKey,
      name: field.fieldKey,
      required: field.isRequired,
      onBlur: onBlur,
      'aria-invalid': hasError,
      'aria-describedby': hasError
        ? `${field.fieldKey}-error`
        : field.helpText
          ? `${field.fieldKey}-help`
          : undefined,
    };

    switch (field.fieldType) {
      case 'TEXT':
        return (
          <input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
          />
        );

      case 'EMAIL':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="email"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'you@example.com'}
              className={`${baseInputClasses} pl-11`}
            />
            <Mail className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          </div>
        );

      case 'PHONE':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="tel"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || '+1 (555) 000-0000'}
              className={`${baseInputClasses} pl-11`}
            />
            <Phone className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          </div>
        );

      case 'URL':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder || 'https://example.com'}
              className={`${baseInputClasses} pl-11`}
            />
            <LinkIcon className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          </div>
        );

      case 'NUMBER':
        return (
          <input
            {...commonProps}
            type="number"
            value={value || ''}
            onChange={(e) =>
              onChange(e.target.value ? Number(e.target.value) : '')
            }
            placeholder={field.placeholder}
            min={field.validationRules?.min}
            max={field.validationRules?.max}
            step={field.validationRules?.step}
            className={baseInputClasses}
          />
        );

      case 'TEXTAREA':
        return (
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={textareaClasses}
          />
        );

      case 'DROPDOWN':
        return (
          <select
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClasses}
          >
            <option value="">
              {field.placeholder || `Select ${field.label}`}
            </option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'DATE':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type="date"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              min={field.validationRules?.minDate}
              max={field.validationRules?.maxDate}
              className={`${baseInputClasses} pr-11`}
            />
            <Calendar className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
          </div>
        );

      case 'CHECKBOX':
        return (
          <div className="flex items-start">
            <input
              {...commonProps}
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded-md border-neutral-300 text-indigo-600 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
            />
            <label
              htmlFor={field.fieldKey}
              className="ml-3 cursor-pointer text-[15px] leading-relaxed text-neutral-700"
            >
              {field.label}
              {field.isRequired && <span className="ml-1 text-red-500">*</span>}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // For checkbox, label is rendered differently
  if (field.fieldType === 'CHECKBOX') {
    return (
      <div className="mb-5">
        {renderInput()}
        {field.helpText && !hasError && (
          <p
            id={`${field.fieldKey}-help`}
            className="mt-1.5 ml-8 text-[13px] leading-relaxed text-neutral-500"
          >
            {field.helpText}
          </p>
        )}
        {hasError && (
          <div
            id={`${field.fieldKey}-error`}
            className="mt-1.5 ml-8 flex items-start gap-1.5 text-[13px] text-red-600"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label htmlFor={field.fieldKey} className={labelClasses}>
        {field.label}
      </label>
      {renderInput()}
      {field.helpText && !hasError && (
        <p
          id={`${field.fieldKey}-help`}
          className="mt-1.5 text-[13px] leading-relaxed text-neutral-500"
        >
          {field.helpText}
        </p>
      )}
      {hasError && (
        <div
          id={`${field.fieldKey}-error`}
          className="mt-2 flex items-start gap-1.5 text-[13px] text-red-600"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
