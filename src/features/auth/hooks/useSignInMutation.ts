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

      // Ensure onboarding_complete cookie is set based on user data
      // Backend should already set this, but we set it client-side as backup
      const hasCompletedOnboarding = data.user.hasCompletedOnboarding ?? false;
      if (hasCompletedOnboarding) {
        document.cookie = 'onboarding_complete=true; path=/; max-age=2592000'; // 30 days
      } else {
        // Clear cookie if not complete
        document.cookie =
          'onboarding_complete=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }

      // Redirect based on onboarding status
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
