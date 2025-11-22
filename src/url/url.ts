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
  onboardingStrategy: '/api/v1/onboarding/strategy',
  onboardingFormFields: '/api/v1/onboarding/form-fields',
  onboardingFormFieldsGet: '/api/v1/onboarding/form-fields',
  onboardingConfigure: '/api/v1/onboarding/configure',
  onboardingOAuthGmail: '/api/v1/auth/oauth/gmail',
  onboardingOAuthOutlook: '/api/v1/auth/oauth/outlook',
  onboardingOAuthComplete: '/api/v1/onboarding/oauth-complete',
  onboardingSimulate: '/api/v1/onboarding/simulate',
  onboardingStatus: '/api/v1/onboarding/status',
  workflowActivate: '/api/v1/workflows/activate',
  updateUser: '/api/v1/users/me',
};
