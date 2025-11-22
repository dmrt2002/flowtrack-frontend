import { LoginForm } from '@/features/auth/components/LoginForm';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">FlowTrack</h1>
          <p className="text-muted-foreground">Branch Banking System</p>
        </div>
        <LoginForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleSignInButton />
      </div>
    </div>
  );
}
