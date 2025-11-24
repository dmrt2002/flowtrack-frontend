import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCurrentUser } from '@/store/currentUserStore';
import { googleSignIn, GoogleSignInData } from '../services';

export function useGoogleSignInMutation() {
  const router = useRouter();
  const { setUser } = useCurrentUser();

  return useMutation({
    mutationFn: (data: GoogleSignInData) => googleSignIn(data),
    retry: false,
    onSuccess: (data) => {
      // Update global user store (backend already set the cookie)
      setUser(data.user);

      toast.success('Google sign in successful!');

      // Redirect based on onboarding status
      const hasCompletedOnboarding = data.user.hasCompletedOnboarding ?? false;
      if (hasCompletedOnboarding) {
        router.push('/dashboard-home');
      } else {
        router.push('/onboarding/form-builder');
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Google sign in failed');
    },
  });
}
