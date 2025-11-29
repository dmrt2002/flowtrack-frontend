import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { useCreateCheckoutSessionMutation } from '../hooks';
import type { SubscriptionPlan, WorkspaceSubscription } from '../types';

interface AvailablePlansCardProps {
  plans: SubscriptionPlan[];
  currentSubscription: WorkspaceSubscription | null;
  workspaceId: string;
}

export function AvailablePlansCard({
  plans,
  currentSubscription,
  workspaceId,
}: AvailablePlansCardProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );
  const createCheckoutMutation = useCreateCheckoutSessionMutation(workspaceId);

  function handleUpgrade(planId: string) {
    createCheckoutMutation.mutate({
      planId,
      billingCycle,
    });
  }

  const isCurrentPlan = (planId: string) => {
    return currentSubscription?.plan.id === planId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Available Plans</CardTitle>
          <div className="bg-muted flex rounded-lg p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                billingCycle === 'yearly'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-green-600">Save 20%</span>
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => {
            const price =
              billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            const current = isCurrentPlan(plan.id);

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-lg border-2 p-6 ${
                  current
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } transition-all`}
              >
                {current && (
                  <Badge className="absolute -top-3 left-6" variant="default">
                    Current Plan
                  </Badge>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                <ul className="mb-6 flex-1 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={current || createCheckoutMutation.isPending}
                  variant={current ? 'outline' : 'default'}
                  className="w-full"
                >
                  {current
                    ? 'Current Plan'
                    : createCheckoutMutation.isPending
                      ? 'Loading...'
                      : 'Upgrade Now'}
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
