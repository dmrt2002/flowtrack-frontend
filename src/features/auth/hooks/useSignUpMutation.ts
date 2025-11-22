import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { signUp, SignUpData } from '../services';

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (data: SignUpData) => signUp(data),
    onSuccess: () => {
      toast.success('Account created successfully!');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Sign up failed. Please try again.';

      // Handle duplicate email (409 Conflict)
      if (error?.response?.status === 409) {
        toast.error('This email is already registered. Sign in instead?');
      } else {
        toast.error(errorMessage);
      }
    },
  });
}
