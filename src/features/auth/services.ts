import request from '@/lib/request';
import { mainUrl } from '@/url/url';

export type SignInData = {
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

export const googleSignIn = async (data: GoogleSignInData) => {
  const response = await request.post(mainUrl.googleSignIn, data);
  return response.data;
};

export const logout = async () => {
  const response = await request.post(mainUrl.logout);
  return response.data;
};
