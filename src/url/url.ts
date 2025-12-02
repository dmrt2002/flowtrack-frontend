export const mainUrl = {
  // Auth endpoints
  signIn: '/api/v1/auth/login',
  signUp: '/api/v1/auth/register',
  googleSignIn: '/api/v1/auth/google',
  googleSignUp: '/api/v1/auth/google',
  logout: '/api/v1/auth/logout',
  logoutAll: '/api/v1/auth/logout-all',
  refreshToken: '/api/v1/auth/refresh',
  getCurrentUser: '/api/v1/auth/me',
  verifyEmail: '/api/v1/auth/verify-email',
  resendVerification: '/api/v1/auth/resend-verification',
  resetPassword: '/api/v1/auth/reset-password',
  forgotPassword: '/api/v1/auth/forgot-password',

  // Onboarding endpoints
  onboardingInit: '/api/v1/onboarding/init',
  onboardingStrategy: '/api/v1/onboarding/strategy', // DEPRECATED
  onboardingFormFields: '/api/v1/onboarding/form-fields',
  onboardingFormFieldsGet: '/api/v1/onboarding/form-fields',
  onboardingConfigure: '/api/v1/onboarding/configure',
  onboardingCalendly: '/api/v1/onboarding/calendly',
  onboardingOAuthGmail: '/api/v1/auth/oauth/gmail',
  onboardingOAuthOutlook: '/api/v1/auth/oauth/outlook',
  onboardingOAuthComplete: '/api/v1/onboarding/oauth-complete',
  onboardingSimulate: '/api/v1/onboarding/simulate',
  onboardingStatus: '/api/v1/onboarding/status',
  onboardingActivate: '/api/v1/onboarding/activate',
  workflowActivate: '/api/v1/onboarding/activate', // Alias for backward compatibility
  updateUser: '/api/v1/users/me',

  // OAuth endpoints
  oauthGmailInitiate: '/api/v1/oauth/gmail/initiate',
  oauthGmailCallback: '/api/v1/oauth/gmail/callback',
  gmailConnection: (workspaceId: string) =>
    `/api/v1/oauth/gmail/connection/${workspaceId}`,

  // Calendar endpoints
  calendarAvailability: '/api/v1/calendar/availability',
  calendarMeetings: '/api/v1/calendar/meetings',
  calendarMeetingStatus: '/api/v1/calendar/meetings',
  onboardingSchedulingPreference: '/api/v1/onboarding/scheduling-preference',

  // Calendly OAuth endpoints
  calendlyOAuthAuthorize: '/api/v1/calendly/oauth/authorize',
  calendlyOAuthCallback: '/api/v1/calendly/oauth/callback',
  calendlyConnection: '/api/v1/calendly/connection',

  // Cal.com OAuth endpoints
  calComOAuthAuthorize: '/api/v1/calcom/oauth/authorize',
  calComOAuthCallback: '/api/v1/calcom/oauth/callback',
  calComConnection: '/api/v1/calcom/connection',

  // Form/Workflow embed endpoints
  getEmbedCode: (workflowId: string) =>
    `/api/v1/forms/embed-code/${workflowId}`,
  getEmbeddableWorkflows: (workspaceId: string) =>
    `/api/v1/forms/workspace/${workspaceId}/embeddable`,

  // Analytics endpoints
  workflowAnalytics: (workflowId: string) =>
    `/api/v1/analytics/workflows/${workflowId}`,
  workflowAnalyticsPerformance: (workflowId: string) =>
    `/api/v1/analytics/workflows/${workflowId}/performance`,
  workflowAnalyticsTimeSeries: (workflowId: string) =>
    `/api/v1/analytics/workflows/${workflowId}/time-series`,
  workflowAnalyticsSources: (workflowId: string) =>
    `/api/v1/analytics/workflows/${workflowId}/sources`,
  workflowAnalyticsRecent: (workflowId: string) =>
    `/api/v1/analytics/workflows/${workflowId}/recent`,

  // Workflow management endpoints
  getFormFields: (workflowId: string) =>
    `/api/v1/onboarding/form-fields/${workflowId}`,
  saveFormFields: '/api/v1/onboarding/form-fields',
  activateWorkflow: '/api/v1/onboarding/activate',
  getWorkflowConfiguration: (workflowId: string) =>
    `/api/v1/workflows/${workflowId}/configuration`,
  saveWorkflowConfiguration: '/api/v1/workflows/configuration',

  // Leads endpoints
  getLeads: (workspaceId: string) => `/api/v1/workspaces/${workspaceId}/leads`,
  getLeadById: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}`,
  getLeadMetrics: (workspaceId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/metrics`,
  updateLead: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}`,
  updateLeadStatus: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}/status`,
  bulkUpdateLeads: (workspaceId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/bulk`,
  deleteLead: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}`,
  exportLeads: (workspaceId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/export`,

  // Sent emails endpoints
  getWorkspaceEmails: (workspaceId: string) =>
    `/api/v1/sent-emails/workspaces/${workspaceId}`,
  getLeadEmails: (workspaceId: string, leadId: string) =>
    `/api/v1/sent-emails/workspaces/${workspaceId}/leads/${leadId}`,
  getSentEmailById: (emailId: string, workspaceId: string) =>
    `/api/v1/sent-emails/${emailId}/workspaces/${workspaceId}`,
  getEmailStatistics: (workspaceId: string) =>
    `/api/v1/sent-emails/workspaces/${workspaceId}/statistics`,

  // Hotbox (Email Relay) endpoints
  getHotboxNeedsReply: (workspaceId: string) =>
    `/api/v1/workspaces/${workspaceId}/hotbox/needs-reply`,
  getHotboxSent: (workspaceId: string) =>
    `/api/v1/workspaces/${workspaceId}/hotbox/sent`,
  getLeadMessages: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}/messages`,
  sendMessageToLead: (workspaceId: string, leadId: string) =>
    `/api/v1/workspaces/${workspaceId}/leads/${leadId}/messages/send`,

  // User/Settings endpoints
  getUserProfile: '/api/v1/user/profile',
  updateUserProfile: '/api/v1/user/profile',
  changePassword: '/api/v1/user/password',
  getConnectedAccounts: '/api/v1/user/connected-accounts',
  disconnectAccount: (credentialId: string) =>
    `/api/v1/user/connected-accounts/${credentialId}`,
  deleteAccount: '/api/v1/user/account',

  // Workspace Management endpoints
  updateMemberRole: (workspaceId: string, memberId: string) =>
    `/api/v1/api/workspace/${workspaceId}/members/${memberId}/role`,
  removeMember: (workspaceId: string, memberId: string) =>
    `/api/v1/api/workspace/${workspaceId}/members/${memberId}`,
  transferOwnership: (workspaceId: string) =>
    `/api/v1/api/workspace/${workspaceId}/transfer-ownership`,
  leaveWorkspace: (workspaceId: string) =>
    `/api/v1/api/workspace/${workspaceId}/leave`,
  updateWorkspace: (workspaceId: string) =>
    `/api/v1/api/workspace/${workspaceId}`,
  deleteWorkspace: (workspaceId: string) =>
    `/api/v1/api/workspace/${workspaceId}`,

  // Billing endpoints
  getBillingPlans: '/api/v1/billing/plans',
  getWorkspaceSubscription: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/subscription`,
  getWorkspaceUsage: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/usage`,
  createCheckoutSession: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/checkout`,
  createPortalSession: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/portal`,
  cancelSubscription: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/cancel`,
  reactivateSubscription: (workspaceId: string) =>
    `/api/v1/billing/workspace/${workspaceId}/reactivate`,
};
