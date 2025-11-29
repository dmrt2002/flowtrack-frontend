'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Eye,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface LeadSource {
  name: string;
  count: number;
  percentage: number;
}

interface RecentSubmission {
  id: string;
  email: string;
  name: string;
  source: string;
  timestamp: string;
}

interface FormAnalyticsDashboardProps {
  workflowId: string;
}

// Mock data - replace with actual API calls
const mockMetrics: AnalyticsMetric[] = [
  {
    label: 'Submissions',
    value: 234,
    change: 12.3,
    trend: 'up',
    icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
  },
  {
    label: 'Views',
    value: '1,245',
    change: 8.1,
    trend: 'up',
    icon: <Eye className="h-8 w-8 text-indigo-600" />,
  },
  {
    label: 'Conversion',
    value: '18.8%',
    change: 2.4,
    trend: 'up',
    icon: <CheckCircle2 className="h-8 w-8 text-indigo-600" />,
  },
  {
    label: 'Change',
    value: '+12.3%',
    change: 12.3,
    trend: 'up',
    icon: <TrendingUp className="h-8 w-8 text-green-600" />,
  },
];

const mockLeadSources: LeadSource[] = [
  { name: 'Google Organic', count: 124, percentage: 53 },
  { name: 'Direct', count: 67, percentage: 29 },
  { name: 'Facebook Ads', count: 28, percentage: 12 },
  { name: 'Email Campaign', count: 15, percentage: 6 },
];

const mockRecentSubmissions: RecentSubmission[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Smith',
    source: 'Direct',
    timestamp: '2m ago',
  },
  {
    id: '2',
    email: 'sarah@company.com',
    name: 'Sarah Jones',
    source: 'Google Organic',
    timestamp: '15m ago',
  },
  {
    id: '3',
    email: 'mike@startup.io',
    name: 'Mike Chen',
    source: 'Facebook Ads',
    timestamp: '1h ago',
  },
];

export function FormAnalyticsDashboard({}: FormAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-1 text-[24px] font-semibold text-neutral-900">
            Form Performance
          </h2>
          <p className="text-[14px] text-neutral-600">
            Track your form submissions and conversion metrics
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-neutral-500" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-[14px] font-medium text-neutral-700 focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockMetrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="mb-5 text-[16px] font-semibold text-neutral-900">
          Submissions Over Time
        </h3>
        <div className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50">
          <div className="text-center">
            <BarChart3 className="mx-auto mb-2 h-12 w-12 text-neutral-300" />
            <p className="text-[14px] text-neutral-500">
              Chart visualization coming soon
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Lead Sources */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <h3 className="mb-5 text-[16px] font-semibold text-neutral-900">
            Top Lead Sources
          </h3>
          <div className="space-y-4">
            {mockLeadSources.map((source, index) => (
              <LeadSourceRow key={index} source={source} />
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-neutral-900">
              Recent Submissions
            </h3>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
              View All Leads
            </Button>
          </div>
          <div className="space-y-3">
            {mockRecentSubmissions.map((submission) => (
              <SubmissionRow key={submission.id} submission={submission} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ metric }: { metric: AnalyticsMetric }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 transition-all duration-150 hover:border-neutral-300 hover:shadow-sm">
      {/* Icon */}
      <div className="mb-3">{metric.icon}</div>

      {/* Value */}
      <div className="mb-1 text-[32px] font-bold text-neutral-900">
        {metric.value}
      </div>

      {/* Label */}
      <div className="mb-2 text-[14px] text-neutral-600">{metric.label}</div>

      {/* Trend */}
      <div
        className={`flex items-center gap-1 text-[13px] font-medium ${
          metric.trend === 'up'
            ? 'text-green-600'
            : metric.trend === 'down'
              ? 'text-red-600'
              : 'text-neutral-500'
        }`}
      >
        {metric.trend === 'up' ? (
          <TrendingUp className="h-3.5 w-3.5" />
        ) : metric.trend === 'down' ? (
          <TrendingDown className="h-3.5 w-3.5" />
        ) : null}
        <span>
          {metric.change > 0 ? '+' : ''}
          {metric.change}%
        </span>
        <span className="ml-0.5 font-normal text-neutral-500">
          vs last period
        </span>
      </div>
    </div>
  );
}

function LeadSourceRow({ source }: { source: LeadSource }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[14px] font-medium text-neutral-900">
            {source.name}
          </span>
          <span className="text-[14px] text-neutral-600">
            {source.count} ({source.percentage}%)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${source.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ submission }: { submission: RecentSubmission }) {
  return (
    <div className="rounded-lg border border-neutral-100 p-4 transition-colors hover:bg-neutral-50">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[14px] font-medium text-neutral-900">
          {submission.email}
        </span>
        <span className="text-[13px] text-neutral-500">
          {submission.timestamp}
        </span>
      </div>
      <div className="flex items-center gap-3 text-[14px] text-neutral-600">
        <span>{submission.name}</span>
        <span className="text-neutral-300">·</span>
        <span className="text-[12px] text-neutral-500">
          {submission.source}
        </span>
      </div>
    </div>
  );
}
