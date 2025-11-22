/**
 * Form Field Types for Form Builder
 */

export type FormFieldType =
  | 'TEXT'
  | 'EMAIL'
  | 'NUMBER'
  | 'DROPDOWN'
  | 'TEXTAREA'
  | 'DATE'
  | 'CHECKBOX';

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormFieldValidationRules {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  step?: number;
  minDate?: string;
  maxDate?: string;
}

export interface FormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  isDefault?: boolean; // true for name, email, companyName
  options?: FormFieldOption[]; // For DROPDOWN
  validationRules?: FormFieldValidationRules;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormFieldsPayload {
  workflowId: string;
  formFields: FormField[];
}

export interface FormFieldsResponse {
  success: boolean;
  data: {
    workflowId: string;
    formFields: FormField[];
    availableVariables: string[];
  };
}
