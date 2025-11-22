import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  VerifyEmailResponse,
  ResendVerificationResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  LogoutResponse,
  CurrentUserResponse,
} from './types';

/**
 * Auth API services
 * All services use the request client configured with cookie-based auth
 */

// ============= Request Types =============

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  fullName?: string;
  email: string;
  password: string;
};

export type GoogleSignInData = {
  code: string;
};

export type ResendVerificationData = {
  email: string;
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type RefreshTokenData = {
  refreshToken: string;
};

export type LogoutData = {
  refreshToken: string;
};

// ============= Auth Services =============

export async function signIn(data: SignInData): Promise<LoginResponse> {
  const response = await request.post<LoginResponse>(mainUrl.signIn, data);
  return response.data;
}

export async function signUp(data: SignUpData): Promise<RegisterResponse> {
  const response = await request.post<RegisterResponse>(mainUrl.signUp, data);
  return response.data;
}

export async function googleSignIn(
  data: GoogleSignInData
): Promise<LoginResponse> {
  const response = await request.post<LoginResponse>(
    mainUrl.googleSignIn,
    data
  );
  return response.data;
}

export async function googleSignUp(
  data: GoogleSignInData
): Promise<LoginResponse> {
  const response = await request.post<LoginResponse>(
    mainUrl.googleSignUp,
    data
  );
  return response.data;
}

export async function refreshToken(
  data: RefreshTokenData
): Promise<RefreshTokenResponse> {
  const response = await request.post<RefreshTokenResponse>(
    mainUrl.refreshToken,
    data
  );
  return response.data;
}

export async function logout(data: LogoutData): Promise<LogoutResponse> {
  const response = await request.post<LogoutResponse>(mainUrl.logout, data);
  return response.data;
}

export async function logoutAll(): Promise<LogoutResponse> {
  const response = await request.post<LogoutResponse>(mainUrl.logoutAll);
  return response.data;
}

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const response = await request.get<CurrentUserResponse>(
    mainUrl.getCurrentUser
  );
  return response.data;
}

// ============= Email Verification =============

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  const response = await request.get<VerifyEmailResponse>(mainUrl.verifyEmail, {
    params: { token },
  });
  return response.data;
}

export async function resendVerification(
  data: ResendVerificationData
): Promise<ResendVerificationResponse> {
  const response = await request.post<ResendVerificationResponse>(
    mainUrl.resendVerification,
    data
  );
  return response.data;
}

// ============= Password Reset =============

export async function forgotPassword(
  data: ForgotPasswordData
): Promise<ForgotPasswordResponse> {
  const response = await request.post<ForgotPasswordResponse>(
    mainUrl.forgotPassword,
    data
  );
  return response.data;
}

export async function resetPassword(
  data: ResetPasswordData
): Promise<ResetPasswordResponse> {
  const response = await request.post<ResetPasswordResponse>(
    mainUrl.resetPassword,
    data
  );
  return response.data;
}
