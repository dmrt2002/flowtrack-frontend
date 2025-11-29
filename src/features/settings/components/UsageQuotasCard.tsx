import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { WorkspaceUsage } from '../types';

interface UsageQuotasCardProps {
  usage: WorkspaceUsage;
}

export function UsageQuotasCard({ usage }: UsageQuotasCardProps) {
  function getProgressColor(percentage: number) {
    if (percentage < 70) return 'bg-green-500';
    if (percentage < 90) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  function formatNumber(num: number) {
    return num.toLocaleString();
  }

  const quotas = [
    {
      label: 'Workflows',
      used: usage.workflows.used,
      limit: usage.workflows.limit,
      percentage: usage.workflows.percentage,
    },
    {
      label: 'Team Members',
      used: usage.teamMembers.used,
      limit: usage.teamMembers.limit,
      percentage: usage.teamMembers.percentage,
    },
    {
      label: 'Monthly Leads',
      used: usage.monthlyLeads.used,
      limit: usage.monthlyLeads.limit,
      percentage: usage.monthlyLeads.percentage,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage This Month</CardTitle>
        <CardDescription>
          Monitor your current usage against plan limits
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {quotas.map((quota) => (
            <div key={quota.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{quota.label}</span>
                <span className="text-muted-foreground">
                  {formatNumber(quota.used)} / {formatNumber(quota.limit)}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={Math.min(quota.percentage, 100)}
                  className="h-2"
                />
                <div
                  className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(quota.percentage)}`}
                  style={{ width: `${Math.min(quota.percentage, 100)}%` }}
                />
              </div>
              {quota.percentage >= 90 && (
                <p className="text-destructive text-xs font-medium">
                  {quota.percentage >= 100
                    ? 'Limit reached'
                    : 'Approaching limit'}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
