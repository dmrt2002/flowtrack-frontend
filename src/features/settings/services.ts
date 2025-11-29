import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  UserProfile,
  UpdateProfileDto,
  ChangePasswordDto,
  ConnectedAccount,
  WorkspaceMember,
  UpdateMemberRoleDto,
  TransferOwnershipDto,
  UpdateWorkspaceDto,
  SubscriptionPlan,
  WorkspaceSubscription,
  WorkspaceUsage,
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
  CustomerPortalResponse,
  CancelSubscriptionResponse,
  ReactivateSubscriptionResponse,
} from './types';

/**
 * Settings API services
 * All services use the request client configured with cookie-based auth
 */

// ============= User Profile Services =============

export async function getUserProfile(): Promise<UserProfile> {
  const response = await request.get<UserProfile>(mainUrl.getUserProfile);
  return response.data;
}

export async function updateUserProfile(
  data: UpdateProfileDto
): Promise<UserProfile> {
  const response = await request.patch<UserProfile>(
    mainUrl.updateUserProfile,
    data
  );
  return response.data;
}

export async function changePassword(
  data: ChangePasswordDto
): Promise<{ success: boolean; message: string }> {
  const response = await request.post<{ success: boolean; message: string }>(
    mainUrl.changePassword,
    data
  );
  return response.data;
}

export async function deleteAccount(): Promise<{
  success: boolean;
  message: string;
}> {
  const response = await request.delete<{ success: boolean; message: string }>(
    mainUrl.deleteAccount
  );
  return response.data;
}

// ============= Connected Accounts Services =============

export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  const response = await request.get<ConnectedAccount[]>(
    mainUrl.getConnectedAccounts
  );
  return response.data;
}

export async function disconnectAccount(
  credentialId: string
): Promise<{ success: boolean; message: string }> {
  const response = await request.delete<{ success: boolean; message: string }>(
    mainUrl.disconnectAccount(credentialId)
  );
  return response.data;
}

// ============= Workspace Management Services =============

export async function updateMemberRole(
  workspaceId: string,
  memberId: string,
  data: UpdateMemberRoleDto
): Promise<WorkspaceMember> {
  const response = await request.patch<WorkspaceMember>(
    mainUrl.updateMemberRole(workspaceId, memberId),
    data
  );
  return response.data;
}

export async function removeMember(
  workspaceId: string,
  memberId: string
): Promise<{ success: boolean; message: string }> {
  const response = await request.delete<{ success: boolean; message: string }>(
    mainUrl.removeMember(workspaceId, memberId)
  );
  return response.data;
}

export async function transferOwnership(
  workspaceId: string,
  data: TransferOwnershipDto
): Promise<{ success: boolean; message: string }> {
  const response = await request.post<{ success: boolean; message: string }>(
    mainUrl.transferOwnership(workspaceId),
    data
  );
  return response.data;
}

export async function leaveWorkspace(
  workspaceId: string
): Promise<{ success: boolean; message: string }> {
  const response = await request.post<{ success: boolean; message: string }>(
    mainUrl.leaveWorkspace(workspaceId)
  );
  return response.data;
}

export async function updateWorkspace(
  workspaceId: string,
  data: UpdateWorkspaceDto
): Promise<{ success: boolean; message: string; workspace: unknown }> {
  const response = await request.patch<{
    success: boolean;
    message: string;
    workspace: unknown;
  }>(mainUrl.updateWorkspace(workspaceId), data);
  return response.data;
}

export async function deleteWorkspace(
  workspaceId: string
): Promise<{ success: boolean; message: string }> {
  const response = await request.delete<{ success: boolean; message: string }>(
    mainUrl.deleteWorkspace(workspaceId)
  );
  return response.data;
}

// ============= Billing Services =============

export async function getBillingPlans(): Promise<SubscriptionPlan[]> {
  const response = await request.get<SubscriptionPlan[]>(
    mainUrl.getBillingPlans
  );
  return response.data;
}

export async function getWorkspaceSubscription(
  workspaceId: string
): Promise<WorkspaceSubscription | null> {
  const response = await request.get<WorkspaceSubscription | null>(
    mainUrl.getWorkspaceSubscription(workspaceId)
  );
  return response.data;
}

export async function getWorkspaceUsage(
  workspaceId: string
): Promise<WorkspaceUsage> {
  const response = await request.get<WorkspaceUsage>(
    mainUrl.getWorkspaceUsage(workspaceId)
  );
  return response.data;
}

export async function createCheckoutSession(
  workspaceId: string,
  data: CreateCheckoutSessionDto
): Promise<CheckoutSessionResponse> {
  const response = await request.post<CheckoutSessionResponse>(
    mainUrl.createCheckoutSession(workspaceId),
    data
  );
  return response.data;
}

export async function createPortalSession(
  workspaceId: string
): Promise<CustomerPortalResponse> {
  const response = await request.post<CustomerPortalResponse>(
    mainUrl.createPortalSession(workspaceId)
  );
  return response.data;
}

export async function cancelSubscription(
  workspaceId: string
): Promise<CancelSubscriptionResponse> {
  const response = await request.post<CancelSubscriptionResponse>(
    mainUrl.cancelSubscription(workspaceId)
  );
  return response.data;
}

export async function reactivateSubscription(
  workspaceId: string
): Promise<ReactivateSubscriptionResponse> {
  const response = await request.post<ReactivateSubscriptionResponse>(
    mainUrl.reactivateSubscription(workspaceId)
  );
  return response.data;
}
