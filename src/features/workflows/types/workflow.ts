export interface WorkflowListItem {
  workflowId: string;
  name: string;
  status: 'active' | 'draft';
  workspaceSlug: string;
  publicFormUrl: string;
  fieldCount: number;
  totalExecutions: number;
  lastExecutedAt: string | null;
  createdAt: string;
}

export interface EmbedCode {
  workspaceSlug: string;
  workflowId: string;
  iframe: {
    html: string;
    description: string;
  };
  script: {
    html: string;
    description: string;
  };
  api: {
    endpoint: string;
    method: string;
    curlExample: string;
    javascriptExample: string;
    pythonExample: string;
    description: string;
  };
  formConfig: {
    publicUrl: string;
    fields: Array<{
      fieldKey: string;
      label: string;
      type: string;
      required: boolean;
    }>;
  };
}

export interface FormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: string;
  isRequired: boolean;
  placeholder?: string;
  helpText?: string;
  displayOrder: number;
  validationRules?: any;
}

export interface WorkflowFormFields {
  workflowId: string;
  workflowName?: string;
  workflowStatus?: 'draft' | 'active' | 'paused';
  fields: FormField[];
  settings: {
    // Form header and description
    formHeader?: string | null;
    formHeaderRich?: any | null;
    showFormHeader?: boolean;
    formDescription?: string | null;
    formDescriptionRich?: any | null;
    showFormDescription?: boolean;
    // Submit button and success message
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
}

export interface Workflow {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused';
  templateId: string | null;
  strategyId: string | null;
  bookingUrl: string | null;
  schedulingType: string | null;
  settings: any;
  createdAt: string;
  updatedAt: string;
}

export interface SaveFormFieldsDto {
  workflowId: string;
  formFields: Array<{
    fieldKey: string;
    label: string;
    fieldType: string;
    isRequired: boolean;
    placeholder?: string;
    helpText?: string;
    displayOrder: number;
    validationRules?: any;
  }>;
  settings?: {
    // Form header and description
    formHeader?: string | null;
    formHeaderRich?: any | null;
    showFormHeader?: boolean;
    formDescription?: string | null;
    formDescriptionRich?: any | null;
    showFormDescription?: boolean;
    // Submit button and success message
    submitButtonText?: string;
    successMessage?: string;
    redirectUrl?: string;
  };
}

export interface ActivateWorkflowDto {
  workflowId: string;
}
