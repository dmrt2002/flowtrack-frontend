import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  WorkflowListItem,
  EmbedCode,
  WorkflowFormFields,
  SaveFormFieldsDto,
  ActivateWorkflowDto,
  FormField,
} from '../types/workflow';

export async function getEmbeddableWorkflows(
  workspaceId: string
): Promise<WorkflowListItem[]> {
  const { data } = await request.get<WorkflowListItem[]>(
    mainUrl.getEmbeddableWorkflows(workspaceId)
  );
  return data;
}

export async function getEmbedCode(workflowId: string): Promise<EmbedCode> {
  const { data } = await request.get<EmbedCode>(
    mainUrl.getEmbedCode(workflowId)
  );
  return data;
}

export async function getFormFields(
  workflowId: string
): Promise<WorkflowFormFields> {
  const response = await request.get<{
    success: boolean;
    data: {
      workflowId: string;
      workflowName?: string;
      workflowStatus?: 'draft' | 'active' | 'paused';
      formFields: FormField[];
      availableVariables: string[];
      settings: {
        formHeader?: string | null;
        formHeaderRich?: any | null;
        showFormHeader?: boolean;
        formDescription?: string | null;
        formDescriptionRich?: any | null;
        showFormDescription?: boolean;
        submitButtonText?: string;
        successMessage?: string;
        redirectUrl?: string;
      };
    };
  }>(mainUrl.getFormFields(workflowId));

  // Transform backend response to frontend format
  const backendData = response.data.data;
  return {
    workflowId: backendData.workflowId,
    workflowName: backendData.workflowName,
    workflowStatus: backendData.workflowStatus,
    fields: backendData.formFields,
    settings: backendData.settings,
  };
}

export async function saveFormFields(
  dto: SaveFormFieldsDto
): Promise<WorkflowFormFields> {
  const { data } = await request.put<WorkflowFormFields>(
    mainUrl.saveFormFields,
    dto
  );
  return data;
}

export async function activateWorkflow(
  dto: ActivateWorkflowDto
): Promise<{ success: boolean; workflow: any }> {
  const { data } = await request.post<{ success: boolean; workflow: any }>(
    mainUrl.activateWorkflow,
    dto
  );
  return data;
}
