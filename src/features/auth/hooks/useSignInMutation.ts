import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signIn, SignInData } from '../services';

export function useSignInMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignInData) => signIn(data),
    onSuccess: () => {
      toast.success('Sign in successful!');
      router.push('/dashboard-home');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Sign in failed');
    },
  });
}
