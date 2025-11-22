import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { googleSignUp, GoogleSignInData } from '../services';

export function useGoogleSignUpMutation() {
  const router = useRouter();
  const { setUser, setTokens } = useCurrentUser();

  return useMutation({
    mutationFn: (data: GoogleSignInData) => googleSignUp(data),
    retry: false,
    onSuccess: (data) => {
      // Update global user store
      setUser(data.user);
      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      });

      toast.success('Google sign up successful!');
      router.push('/dashboard-home');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Google sign up failed');
    },
  });
}
