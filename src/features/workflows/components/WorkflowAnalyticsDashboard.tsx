'use client';

import React, { useState } from 'react';
import { useWorkflowAnalytics } from '../hooks/use-workflow-analytics';
import { FormPerformanceCards } from './FormPerformanceCards';
import { SubmissionsChart } from './SubmissionsChart';
import { LeadSourcesTable } from './LeadSourcesTable';
import { RecentSubmissionsTable } from './RecentSubmissionsTable';
import { Button } from '@/components/ui/button';
import type { AnalyticsPeriod } from '../types/analytics';

interface WorkflowAnalyticsDashboardProps {
  workflowId: string;
}

export function WorkflowAnalyticsDashboard({
  workflowId,
}: WorkflowAnalyticsDashboardProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('30d');
  const {
    data: analytics,
    isLoading,
    error,
  } = useWorkflowAnalytics(workflowId, period);

  const periods: { value: AnalyticsPeriod; label: string }[] = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-muted-foreground text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">Failed to load analytics data</p>
          <p className="text-muted-foreground mt-2 text-xs">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with period selector */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex gap-2">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance metrics cards */}
      <FormPerformanceCards metrics={analytics.formPerformance} />

      {/* Charts and tables grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submissions chart - full width on mobile, left column on desktop */}
        <div className="lg:col-span-2">
          <SubmissionsChart data={analytics.submissionsOverTime} />
        </div>

        {/* Lead sources - left column */}
        <LeadSourcesTable sources={analytics.topLeadSources} />

        {/* Recent submissions - right column */}
        <div className="lg:col-span-1">
          <RecentSubmissionsTable submissions={analytics.recentSubmissions} />
        </div>
      </div>
    </div>
  );
}
