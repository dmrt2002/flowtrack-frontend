import request from '@/lib/request';
import { mainUrl } from '@/url/url';

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

export const signIn = async (data: SignInData) => {
  const response = await request.post(mainUrl.signIn, data);
  return response.data;
};

export const signUp = async (data: SignUpData) => {
  const response = await request.post(mainUrl.signUp, data);
  return response.data;
};

export const googleSignIn = async (data: GoogleSignInData) => {
  const response = await request.post(mainUrl.googleSignIn, data);
  return response.data;
};

export const googleSignUp = async (data: GoogleSignInData) => {
  const response = await request.post(mainUrl.googleSignUp, data);
  return response.data;
};

export const logout = async () => {
  const response = await request.post(mainUrl.logout);
  return response.data;
};

export type ResendVerificationData = {
  email: string;
};

export const resendVerification = async (data: ResendVerificationData) => {
  const response = await request.post(mainUrl.resendVerification, data);
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await request.get(mainUrl.verifyEmail, {
    params: { token },
  });
  return response.data;
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await request.post(mainUrl.resetPassword, data);
  return response.data;
};

export type ForgotPasswordData = {
  email: string;
};

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await request.post(mainUrl.forgotPassword, data);
  return response.data;
};
