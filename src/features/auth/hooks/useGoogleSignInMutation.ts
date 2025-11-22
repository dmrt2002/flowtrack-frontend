import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { googleSignIn, GoogleSignInData } from '../services';

export function useGoogleSignInMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GoogleSignInData) => googleSignIn(data),
    onSuccess: () => {
      toast.success('Google sign in successful!');
      router.push('/dashboard-home');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Google sign in failed');
    },
  });
}
