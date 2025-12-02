'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginLayout } from '@/features/auth/components/LoginLayout';

/**
 * Email Verification Page
 *
 * This page redirects the user to the backend verification endpoint.
 * The backend will verify the email, set the auth cookie, and redirect
 * to the appropriate page (dashboard or onboarding).
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      // If no token, redirect to login with error message
      window.location.href = '/login?error=invalid-verification-link';
      return;
    }

    // Redirect to backend endpoint which will verify and redirect
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    window.location.href = `${backendUrl}/api/v1/auth/verify-email?token=${token}`;
  }, [token]);

  return (
    <LoginLayout>
      <div className="animate-fade-in-up flex flex-col items-center justify-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#4F46E5]"></div>
        <p className="text-[15px] text-[#6B7280]">Verifying your email...</p>
      </div>
    </LoginLayout>
  );
}
