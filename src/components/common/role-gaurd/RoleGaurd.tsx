'use client';

import { ReactNode } from 'react';
import { useCurrentUser, Roles } from '@/store/currentUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type RoleGuardProps = {
  children: ReactNode;
  allowedRoles: Roles[];
  redirectTo?: string;
};

export function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/login',
}: RoleGuardProps) {
  const { currentUser, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }

    if (
      !isLoading &&
      isAuthenticated &&
      currentUser &&
      !allowedRoles.includes(currentUser.role)
    ) {
      router.push('/unauthorized');
    }
  }, [
    isAuthenticated,
    isLoading,
    currentUser,
    allowedRoles,
    redirectTo,
    router,
  ]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}
