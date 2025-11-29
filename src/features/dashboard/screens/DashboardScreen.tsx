'use client';

import { BarChart3, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../components/DashboardLayout';
import { WelcomeSection } from '../components/WelcomeSection';
import { WorkflowStatusBanner } from '../components/WorkflowStatusBanner';
import { MetricsRow } from '../components/MetricsRow';
import { MetricCard } from '../components/MetricCard';
import { LeadsSection } from '../components/LeadsSection';
import { LaunchpadModal } from '@/features/onboarding/components/LaunchpadModal';
import type {
  DashboardMetrics,
  LeadSummary,
  WorkflowStatus,
} from '../types/dashboard';

interface DashboardScreenProps {
  userName?: string;
  metrics?: DashboardMetrics;
  leads?: LeadSummary[];
  workflow?: WorkflowStatus | null;
  showLaunchpadModal?: boolean;
  publicFormUrl?: string;
  onCloseLaunchpad?: () => void;
  isLoadingMetrics?: boolean;
  isLoadingLeads?: boolean;
}

export function DashboardScreen({
  userName,
  metrics,
  leads = [],
  workflow,
  showLaunchpadModal = false,
  publicFormUrl = '',
  onCloseLaunchpad,
  isLoadingMetrics,
  isLoadingLeads,
}: DashboardScreenProps) {
  // Default metrics if none provided
  const defaultMetrics: DashboardMetrics = {
    totalLeads: 0,
    qualifiedLeads: 0,
    avgTimeToReply: '0h',
    conversionRate: 0,
    trends: {
      totalLeads: { value: 0, direction: 'neutral', label: 'No data yet' },
      qualifiedLeads: { value: 0, direction: 'neutral', label: 'No data yet' },
      avgTimeToReply: { value: 0, direction: 'neutral', label: 'No data yet' },
      conversionRate: { value: 0, direction: 'neutral', label: 'No data yet' },
    },
  };

  const displayMetrics = metrics || defaultMetrics;

  return (
    <DashboardLayout publicFormUrl={workflow?.publicFormUrl || publicFormUrl}>
      {/* Main Content with blur support */}
      <div
        className={`transition-all duration-500 ${
          showLaunchpadModal ? 'blur-sm' : ''
        }`}
      >
        <div className="space-y-6">
          {/* Welcome Section */}
          <WelcomeSection userName={userName} workflow={workflow} />

          {/* Workflow Status Banner */}
          <WorkflowStatusBanner workflow={workflow} />

          {/* Metrics Row */}
          <MetricsRow>
            {isLoadingMetrics ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border-[1.5px] border-neutral-200 bg-white p-6"
                  >
                    <div className="mb-4 h-12 w-12 rounded-xl bg-neutral-200" />
                    <div className="mb-2 h-9 w-24 rounded bg-neutral-200" />
                    <div className="h-4 w-32 rounded bg-neutral-200" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <MetricCard
                  icon={<BarChart3 />}
                  value={displayMetrics.totalLeads}
                  label="Total Leads"
                  trend={displayMetrics.trends.totalLeads}
                  gradient="indigo"
                />
                <MetricCard
                  icon={<CheckCircle2 />}
                  value={displayMetrics.qualifiedLeads}
                  label="Qualified Leads"
                  trend={displayMetrics.trends.qualifiedLeads}
                  gradient="emerald"
                />
                <MetricCard
                  icon={<Clock />}
                  value={displayMetrics.avgTimeToReply}
                  label="Avg Time to Reply"
                  trend={displayMetrics.trends.avgTimeToReply}
                  gradient="amber"
                />
                <MetricCard
                  icon={<TrendingUp />}
                  value={`${displayMetrics.conversionRate}%`}
                  label="Conversion Rate"
                  trend={displayMetrics.trends.conversionRate}
                  gradient="pink"
                />
              </>
            )}
          </MetricsRow>

          {/* Recent Leads Section */}
          <LeadsSection
            leads={leads}
            publicFormUrl={workflow?.publicFormUrl || publicFormUrl}
            isLoading={isLoadingLeads}
          />
        </div>
      </div>

      {/* Launchpad Modal */}
      {showLaunchpadModal && onCloseLaunchpad && (
        <LaunchpadModal
          open={showLaunchpadModal}
          publicFormUrl={publicFormUrl}
          workspaceName="Your Workspace"
          strategyName={workflow?.strategyName || 'Gatekeeper'}
          onClose={onCloseLaunchpad}
        />
      )}
    </DashboardLayout>
  );
}
