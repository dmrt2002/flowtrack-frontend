'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/store/currentUserStore';
import { useCurrentUserQuery } from '@/features/auth/hooks/useCurrentUserQuery';

/**
 * Component that fetches current user data on app load and route changes
 * Uses React Query for caching and automatic refetching
 */
export function GetCurrentUser() {
  const { setLoading } = useCurrentUser();
  const pathname = usePathname();
  const { isLoading, isError, isFetching, refetch } = useCurrentUserQuery();

  // Sync loading state with React Query (use isFetching for initial load, isLoading for overall state)
  useEffect(() => {
    // Set loading to true if React Query is fetching (initial load or refetch)
    setLoading(isLoading || isFetching);
  }, [isLoading, isFetching, setLoading]);

  // Refetch user data when route changes (for client-side navigation)
  // This ensures fresh data is available on all pages after navigation
  useEffect(() => {
    // Only refetch if we're navigating to a protected route (not login/signup/auth pages)
    const isAuthRoute =
      pathname?.startsWith('/login') ||
      pathname?.startsWith('/signup') ||
      pathname?.startsWith('/auth');

    if (pathname && !isAuthRoute) {
      console.log('🔄 Route changed, refetching user data:', pathname);
      // Use refetch with { cancelRefetch: false } to ensure it runs even if a request is in progress
      refetch({ cancelRefetch: false });
    }
  }, [pathname, refetch]);

  // Log errors (error handling is done in useCurrentUserQuery)
  useEffect(() => {
    if (isError) {
      console.log('❌ Failed to fetch current user (handled by React Query)');
    }
  }, [isError]);

  return null;
}
