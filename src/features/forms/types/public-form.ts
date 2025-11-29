/**
 * Public Form Types
 * TypeScript interfaces for form embedding and submission
 */

export interface FormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: FieldType;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  options?: FormFieldOption[];
  validationRules?: ValidationRules;
  displayOrder: number;
}

export type FieldType =
  | 'TEXT'
  | 'EMAIL'
  | 'PHONE'
  | 'NUMBER'
  | 'URL'
  | 'TEXTAREA'
  | 'DROPDOWN'
  | 'DATE'
  | 'CHECKBOX';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  step?: number;
  minDate?: string;
  maxDate?: string;
}

export interface PublicFormSchema {
  workflowId: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  fields: FormField[];
  settings: FormSettings;
  isActive: boolean;
  strategyName?: string;
}

export interface FormSettings {
  // Form header and description
  formHeader?: string | null;
  formHeaderRich?: any | null;
  showFormHeader?: boolean;
  formDescription?: string | null;
  formDescriptionRich?: any | null;
  showFormDescription?: boolean;
  // Submit button and success message
  successMessage?: string;
  redirectUrl?: string;
  submitButtonText?: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
}

export interface FormSubmission {
  fields: Record<string, any>;
  tracking?: TrackingData;
  metadata?: {
    submittedAt?: string;
    formVersion?: string;
  };
}

export interface TrackingData {
  utk?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  pageUrl?: string;
  pagePath?: string;
  userAgent?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  leadId: string;
  message: string;
  redirectUrl?: string;
}

export interface FormValidationError {
  success: false;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
}

export interface FormFieldError {
  message: string;
  code: string;
}

export type FormErrors = Record<string, FormFieldError>;
