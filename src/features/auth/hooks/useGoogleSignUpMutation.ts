import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { googleSignUp, GoogleSignInData } from '../services';

export function useGoogleSignUpMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GoogleSignInData) => googleSignUp(data),
    onSuccess: () => {
      toast.success('Google sign up successful!');
      router.push('/dashboard-home');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Google sign up failed');
    },
  });
}
