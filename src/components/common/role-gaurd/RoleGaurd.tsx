'use client';

import { ReactNode } from 'react';
import { useCurrentUser } from '@/store/currentUserStore';
import { useCurrentUserQuery } from '@/features/auth/hooks/useCurrentUserQuery';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RoleGuardProps = {
  children: ReactNode;
  redirectTo?: string;
};

export function RoleGuard({ children, redirectTo = '/login' }: RoleGuardProps) {
  const {
    currentUser,
    isAuthenticated,
    isLoading: storeIsLoading,
  } = useCurrentUser();
  const {
    isLoading: queryIsLoading,
    isFetching,
    data,
    isError,
    error,
  } = useCurrentUserQuery();
  const router = useRouter();

  // Combine both loading states - wait for both store and React Query to finish loading
  // Also wait for any ongoing refetch to complete
  const isLoading = storeIsLoading || queryIsLoading || isFetching;

  useEffect(() => {
    console.log('🛡️ RoleGuard check:', {
      storeIsLoading,
      queryIsLoading,
      isFetching,
      isLoading,
      isAuthenticated,
      currentUser: !!currentUser,
      hasQueryData: !!data,
      isError,
      errorStatus: error && 'response' in error ? error.response?.status : null,
    });

    // Only redirect if:
    // 1. Not loading (wait for all queries to complete)
    // 2. Not authenticated
    // 3. No query data (no cached user)
    // 4. Not a network error (preserve state on network errors)
    const isNetworkError =
      error && 'code' in error && error.code === 'ERR_NETWORK';
    const shouldRedirect =
      !isLoading && !isAuthenticated && !data && !isNetworkError;

    if (shouldRedirect) {
      console.log(
        '❌ RoleGuard: Not authenticated, redirecting to:',
        redirectTo
      );
      router.push(redirectTo);
    }
  }, [
    isAuthenticated,
    isLoading,
    currentUser,
    redirectTo,
    router,
    storeIsLoading,
    queryIsLoading,
    isFetching,
    data,
    isError,
    error,
  ]);

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

  // Check if we should show redirecting message (same logic as useEffect)
  const isNetworkError =
    error && 'code' in error && error.code === 'ERR_NETWORK';
  const shouldShowRedirecting =
    !isAuthenticated && !currentUser && !data && !isNetworkError;

  if (shouldShowRedirecting) {
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

  // If we have authenticated user or cached data, render children
  if (isAuthenticated && currentUser) {
    return <>{children}</>;
  }

  // If we have cached data but store isn't updated yet, still render (query will update store)
  if (data) {
    return <>{children}</>;
  }

  // Fallback: show redirecting message
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
