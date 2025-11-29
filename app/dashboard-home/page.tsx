'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RoleGuard } from '@/components/common/role-gaurd/RoleGaurd';
import { useCurrentUser } from '@/store/currentUserStore';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData';

function DashboardContentInner() {
  const { currentUser } = useCurrentUser();
  const searchParams = useSearchParams();
  const [showLaunchpadModal, setShowLaunchpadModal] = useState(false);
  const [launchpadFormUrl, setLaunchpadFormUrl] = useState('');

  // Fetch dashboard data from API
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useDashboardData({
    period: '7d',
    limit: 5,
  });

  // Check if we should show the launchpad modal (from Go Live flow)
  useEffect(() => {
    const showModal = searchParams.get('launchpad') === 'true';
    const formUrl = searchParams.get('publicFormUrl') || '';

    if (showModal && formUrl) {
      setShowLaunchpadModal(true);
      setLaunchpadFormUrl(formUrl);
    }
  }, [searchParams]);

  const handleCloseLaunchpad = () => {
    setShowLaunchpadModal(false);
    // Clean up URL parameters
    window.history.replaceState({}, '', '/dashboard-home');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <p className="mb-2 text-red-600">Failed to load dashboard data</p>
          <p className="text-sm text-neutral-600">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Prepare data for DashboardScreen
  const workflow = dashboardData?.workflow
    ? {
        isActive: dashboardData.workflow.status === 'active',
        strategyName: dashboardData.workflow.strategyName || 'Custom Workflow',
        activatedAt: dashboardData.workflow.activatedAt,
        publicFormUrl:
          showLaunchpadModal && launchpadFormUrl
            ? launchpadFormUrl
            : dashboardData.workflow.publicFormUrl,
      }
    : {
        isActive: false,
        strategyName: undefined,
        activatedAt: undefined,
        publicFormUrl: undefined,
      };

  const metrics = dashboardData?.metrics || {
    totalLeads: 0,
    qualifiedLeads: 0,
    avgTimeToReply: '0h',
    conversionRate: 0,
    trends: {
      totalLeads: {
        value: 0,
        direction: 'neutral' as const,
        label: 'No data yet',
      },
      qualifiedLeads: {
        value: 0,
        direction: 'neutral' as const,
        label: 'No data yet',
      },
      avgTimeToReply: {
        value: 0,
        direction: 'neutral' as const,
        label: 'No data yet',
      },
      conversionRate: {
        value: 0,
        direction: 'neutral' as const,
        label: 'No data yet',
      },
    },
  };

  const leads = dashboardData?.leads?.data || [];

  return (
    <DashboardScreen
      userName={currentUser?.firstName || currentUser?.email || 'User'}
      metrics={metrics}
      leads={leads}
      workflow={workflow}
      showLaunchpadModal={showLaunchpadModal}
      publicFormUrl={
        showLaunchpadModal && launchpadFormUrl
          ? launchpadFormUrl
          : workflow.publicFormUrl
      }
      onCloseLaunchpad={handleCloseLaunchpad}
      isLoadingMetrics={false}
      isLoadingLeads={false}
    />
  );
}

function DashboardContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      }
    >
      <DashboardContentInner />
    </Suspense>
  );
}

export default function DashboardPage() {
  return (
    <RoleGuard>
      <DashboardContent />
    </RoleGuard>
  );
}
