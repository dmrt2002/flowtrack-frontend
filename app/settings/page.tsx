'use client';

import { useCurrentUser } from '@/store/currentUserStore';
import { SettingsScreen } from '@/features/settings/components/SettingsScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { currentUser, isAuthenticated, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Get the first workspace ID (you may want to add workspace selection later)
  const workspaceId = currentUser.workspaces?.[0]?.id || '';

  if (!workspaceId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">No workspace found</p>
          <p className="text-sm">Please contact support</p>
        </div>
      </div>
    );
  }

  return <SettingsScreen workspaceId={workspaceId} />;
}
