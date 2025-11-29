import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WorkspaceSubscription } from '../types';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import { toast } from 'sonner';

interface CurrentPlanCardProps {
  subscription: WorkspaceSubscription | null;
  workspaceId: string;
}

export function CurrentPlanCard({
  subscription,
  workspaceId,
}: CurrentPlanCardProps) {
  async function handleManageBilling() {
    try {
      const response = await request.post<{ url: string; message?: string }>(
        mainUrl.createPortalSession(workspaceId)
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.info(response.data.message || 'Opening billing portal...');
      }
    } catch {
      toast.error('Failed to open billing portal');
    }
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            <p>No active subscription</p>
            <p className="text-sm">Choose a plan below to get started</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-700">Trial</Badge>;
      case 'past_due':
        return <Badge variant="warning">Past Due</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const price =
    subscription.billingCycle === 'yearly'
      ? subscription.plan.priceYearly
      : subscription.plan.priceMonthly;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-semibold">
                  {subscription.plan.name}
                </h3>
                {getStatusBadge(subscription.status)}
              </div>
              <p className="text-muted-foreground mt-1">
                ${price.toFixed(2)}/
                {subscription.billingCycle === 'yearly' ? 'year' : 'month'} •
                Billed {subscription.billingCycle}
              </p>
            </div>
          </div>

          <div className="border-muted space-y-2 border-t pt-4">
            {subscription.trialEndDate && (
              <div className="text-sm">
                <span className="text-muted-foreground">Trial ends: </span>
                <span>{formatDate(subscription.trialEndDate)}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">
                {subscription.status === 'trialing'
                  ? 'Trial period ends'
                  : 'Next billing date'}
                :{' '}
              </span>
              <span>{formatDate(subscription.currentPeriodEnd)}</span>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <div className="text-destructive text-sm font-medium">
                Your subscription will be cancelled on{' '}
                {formatDate(subscription.currentPeriodEnd)}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleManageBilling} variant="outline">
              Manage Subscription →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
