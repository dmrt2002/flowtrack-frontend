/**
 * Authentication feature types matching backend API responses
 */

export type AuthProvider = 'clerk' | 'local';

export type Workspace = {
  id: string;
  name: string;
  slug: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  authProvider: AuthProvider;
  emailVerifiedAt?: string | null;
  clerkUserId?: string | null;
  hasCompletedOnboarding?: boolean;
  workspaces?: Workspace[];
  createdAt: string;
  updatedAt?: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type RegisterResponse = {
  user: User;
  message: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

export type VerifyEmailResponse = {
  message: string;
};

export type ResendVerificationResponse = {
  message: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type ResetPasswordResponse = {
  message: string;
};

export type LogoutResponse = {
  message: string;
};

export type CurrentUserResponse = User;

// Error response type
export type ApiError = {
  message: string;
  statusCode: number;
  error?: string;
};
