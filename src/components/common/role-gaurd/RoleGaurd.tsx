'use client';

import { ReactNode } from 'react';
import { useCurrentUser } from '@/store/currentUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RoleGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function RoleGuard({ children, redirectTo = '/login' }: RoleGuardProps) {
  const { currentUser, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    console.log('🛡️ RoleGuard check:', {
      isLoading,
      isAuthenticated,
      currentUser: !!currentUser,
    });

    if (!isLoading && !isAuthenticated) {
      console.log(
        '❌ RoleGuard: Not authenticated, redirecting to:',
        redirectTo
      );
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, currentUser, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="text-sm font-medium text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-600">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
