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

export interface FormFieldPayload {
  fieldKey: string;
  label: string;
  fieldType: FormFieldType;
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  isDefault?: boolean;
  options?: FormFieldOption[];
  validationRules?: FormFieldValidationRules;
  displayOrder: number;
}

export interface FormFieldsPayload {
  workflowId: string;
  formFields: FormFieldPayload[];
  settings?: {
    formHeader?: string | null;
    formHeaderRich?: any | null;
    formDescription?: string | null;
    formDescriptionRich?: any | null;
    showFormHeader?: boolean;
    showFormDescription?: boolean;
  };
}

export interface FormFieldsResponse {
  success: boolean;
  data: {
    workflowId: string;
    formFields: FormField[];
    availableVariables: string[];
  };
}
