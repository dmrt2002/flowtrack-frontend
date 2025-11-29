// User Profile Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// Connected Accounts Types
export interface ConnectedAccount {
  id: string;
  providerType: 'GOOGLE_CALENDAR' | 'OUTLOOK_CALENDAR' | 'CALENDLY' | 'CAL_COM';
  providerEmail: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
  lastSyncedAt: string | null;
}

// Workspace Member Types
export interface WorkspaceMember {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface UpdateMemberRoleDto {
  role: 'admin' | 'member';
}

export interface TransferOwnershipDto {
  newOwnerId: string;
}

// Workspace Types
export interface UpdateWorkspaceDto {
  name?: string;
  description?: string | null;
}

// Billing Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  quotas: {
    maxWorkflows: number;
    maxTeamMembers: number;
    maxLeadsPerMonth: number;
    customBranding: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
  };
  isActive: boolean;
  isVisible: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceSubscription {
  id: string;
  plan: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing' | 'incomplete';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndDate: string | null;
}

export interface UsageQuota {
  used: number;
  limit: number;
  percentage: number;
}

export interface WorkspaceUsage {
  workflows: UsageQuota;
  teamMembers: UsageQuota;
  monthlyLeads: UsageQuota;
}

export interface CreateCheckoutSessionDto {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  message?: string;
}

export interface CustomerPortalResponse {
  url: string;
  message?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
  currentPeriodEnd: string;
}

export interface ReactivateSubscriptionResponse {
  success: boolean;
  message: string;
}
