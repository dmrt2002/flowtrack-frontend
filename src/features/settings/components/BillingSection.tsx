import { CurrentPlanCard } from './CurrentPlanCard';
import { UsageQuotasCard } from './UsageQuotasCard';
import { AvailablePlansCard } from './AvailablePlansCard';
import {
  useBillingPlansQuery,
  useWorkspaceSubscriptionQuery,
  useWorkspaceUsageQuery,
} from '../hooks';

interface BillingSectionProps {
  workspaceId: string;
}

export function BillingSection({ workspaceId }: BillingSectionProps) {
  const { data: plans, isLoading: plansLoading } = useBillingPlansQuery();
  const { data: subscription, isLoading: subscriptionLoading } =
    useWorkspaceSubscriptionQuery(workspaceId);
  const { data: usage, isLoading: usageLoading } =
    useWorkspaceUsageQuery(workspaceId);

  const isLoading = plansLoading || subscriptionLoading || usageLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-48 animate-pulse rounded-lg" />
        <div className="bg-muted h-64 animate-pulse rounded-lg" />
        <div className="bg-muted h-96 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!workspaceId) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        Please select a workspace to view billing information.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CurrentPlanCard
        subscription={subscription || null}
        workspaceId={workspaceId}
      />

      {usage && <UsageQuotasCard usage={usage} />}

      {plans && plans.length > 0 && (
        <AvailablePlansCard
          plans={plans}
          currentSubscription={subscription || null}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}
