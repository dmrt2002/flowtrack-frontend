'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all auth cookies
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie =
      'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie =
      'onboarding_complete=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

    // Clear session storage
    sessionStorage.clear();

    // Clear local storage
    localStorage.clear();

    console.log('✅ All auth data cleared');

    // Redirect to login after 1 second
    setTimeout(() => {
      router.push('/login');
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
        <p className="mb-2 font-semibold text-neutral-900">
          Clearing authentication data...
        </p>
        <p className="text-sm text-neutral-600">
          You will be redirected to login.
        </p>
      </div>
    </div>
  );
}
