import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { signIn, SignInData } from '../services';

export function useSignInMutation() {
  const router = useRouter();
  const { setUser } = useCurrentUser();

  return useMutation({
    mutationFn: (data: SignInData) => signIn(data),
    retry: false,
    onSuccess: (data) => {
      // Update global user store (backend already set the cookie)
      setUser(data.user);

      toast.success('Sign in successful!');

      // Redirect based on onboarding status
      const hasCompletedOnboarding = data.user.hasCompletedOnboarding ?? false;
      if (hasCompletedOnboarding) {
        router.push('/dashboard-home');
      } else {
        router.push('/onboarding/form-builder');
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Sign in failed';

      // Handle specific error cases
      if (error?.response?.status === 401) {
        toast.error('Invalid credentials or email not verified');
      } else if (error?.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later.');
      } else {
        toast.error(errorMessage);
      }
    },
  });
}
