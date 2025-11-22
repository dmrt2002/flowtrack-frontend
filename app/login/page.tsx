import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginLayout } from '@/features/auth/components/LoginLayout';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}
