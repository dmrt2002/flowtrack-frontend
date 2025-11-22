import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { LoginLayout } from '@/features/auth/components/LoginLayout';

export default function SignUpPage() {
  return (
    <LoginLayout>
      <SignUpForm />
    </LoginLayout>
  );
}
