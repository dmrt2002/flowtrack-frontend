'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  useCalendlyOAuthInitiate,
  useCalendlyConnectionStatus,
} from '../hooks/useCalendlyOAuth';
import { useInitWorkflow } from '../hooks/useInitWorkflow';
import { toast } from 'sonner';

export function IntegrationsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workflowId, workspaceId } = useOnboardingStore();

  const [calendlyConnected, setCalendlyConnected] = useState(false);
  const [calendlyPlan, setCalendlyPlan] = useState<'FREE' | 'PRO' | null>(null);

  console.log(
    'IntegrationsScreen render - workflowId:',
    workflowId,
    'workspaceId:',
    workspaceId
  );

  // Initialize workflow to ensure workflowId and workspaceId are loaded
  const { isLoading: isInitializing } = useInitWorkflow();

  const { mutate: initiateCalendlyOAuth, isPending: isCalendlyLoading } =
    useCalendlyOAuthInitiate();

  const {
    data: connectionStatus,
    refetch: refetchConnectionStatus,
    isLoading: isLoadingConnection,
    isFetching: isFetchingConnection,
  } = useCalendlyConnectionStatus(workspaceId);

  console.log(
    'Connection query state - isLoading:',
    isLoadingConnection,
    'isFetching:',
    isFetchingConnection,
    'data:',
    connectionStatus
  );

  // Check if user has completed previous steps (only after initialization)
  useEffect(() => {
    // Don't redirect while still initializing
    if (isInitializing) {
      return;
    }

    // If initialization is complete and still no workflowId, redirect to form-builder
    if (!workflowId) {
      router.push('/onboarding/form-builder');
    }
  }, [workflowId, router, isInitializing]);

  // Refetch connection status when workspaceId becomes available
  useEffect(() => {
    if (workspaceId && !isInitializing) {
      console.log(
        'workspaceId loaded, refetching Calendly connection status:',
        workspaceId
      );
      refetchConnectionStatus();
    }
  }, [workspaceId, isInitializing, refetchConnectionStatus]);

  // Check connection status on page load
  useEffect(() => {
    console.log('Connection status updated:', connectionStatus);
    const status = connectionStatus as any;
    if (status?.connected) {
      console.log('Setting Calendly as connected');
      setCalendlyConnected(true);
      setCalendlyPlan(status?.plan || null);
    }
  }, [connectionStatus]);

  // Handle OAuth callback responses
  useEffect(() => {
    const calendlyStatus = searchParams.get('calendly');
    const calendlyPlanParam = searchParams.get('plan');

    if (calendlyStatus === 'success') {
      setCalendlyConnected(true);
      setCalendlyPlan((calendlyPlanParam as 'FREE' | 'PRO') || 'PRO');
      toast.success(
        calendlyPlanParam === 'FREE'
          ? 'Calendly connected (FREE plan - polling enabled)'
          : 'Calendly connected (PRO plan - webhooks enabled)'
      );

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('calendly');
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url);
    } else if (calendlyStatus === 'error') {
      toast.error('Failed to connect Calendly. Please try again.');

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('calendly');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

  const handleConnectCalendly = () => {
    initiateCalendlyOAuth();
  };

  const handleContinue = () => {
    router.push('/onboarding/configure');
  };

  const handleSkip = () => {
    toast.info('You can connect Calendly later from settings', {
      duration: 3000,
    });
    router.push('/onboarding/configure');
  };

  const handleBack = () => {
    router.push('/onboarding/form-builder');
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-[800px] flex-1 px-4 pt-6 pb-32 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={handleBack}
            className="text-muted-foreground hover:text-primary mb-3 flex items-center gap-2 text-sm font-medium transition-colors sm:mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="relative">
            <div className="text-muted-foreground absolute top-0 right-0 text-xs font-medium sm:text-sm">
              Step 2 of 4
            </div>
            <h1 className="text-foreground mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Calendar Integration
            </h1>
            <p className="text-muted-foreground max-w-[600px] text-sm leading-relaxed sm:text-base">
              Connect your Calendly account to enable automated booking links in
              your emails with lead attribution.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Calendly Card */}
          <div
            className={`border-border rounded-xl border bg-white p-4 shadow-sm transition-all sm:p-6 ${
              calendlyConnected
                ? 'border-green-200 bg-gradient-to-b from-white to-green-50/20'
                : 'hover:border-neutral-300 hover:shadow-md'
            }`}
          >
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              {/* Icon Container */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>

              {/* Content */}
              <div className="w-full flex-1">
                {/* Header Row */}
                <div className="mb-1 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground text-lg font-semibold">
                      Calendly
                    </h2>
                    {calendlyPlan && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-blue-700 uppercase">
                        {calendlyPlan}
                      </span>
                    )}
                  </div>
                  <span className="rounded bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
                    Optional
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  Connect your Calendly account to automatically include booking
                  links in your emails. Supports both FREE and PRO plans.
                </p>

                {/* Connection State */}
                {calendlyConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 sm:py-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-sm font-semibold text-green-600">
                          Calendly connected
                        </p>
                        {calendlyPlan === 'FREE' && (
                          <p className="text-xs text-green-600">
                            Polling enabled - bookings will sync every 6 hours
                          </p>
                        )}
                        {calendlyPlan === 'PRO' && (
                          <p className="text-xs text-green-600">
                            Webhooks enabled - real-time booking sync
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleConnectCalendly}
                      disabled={isCalendlyLoading}
                      className="h-11 w-full border-neutral-200 bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                    >
                      {isCalendlyLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect Calendly'
                      )}
                    </Button>

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      You&apos;ll be redirected to Calendly to authorize
                      FlowTrack
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info Card */}
          {!calendlyConnected && (
            <div className="border-border rounded-xl border border-blue-200 bg-blue-50/50 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="mb-1 text-sm font-semibold text-blue-900">
                    Calendar integration is optional
                  </p>
                  <p className="text-xs leading-relaxed text-blue-700">
                    You can skip this step and add Calendly integration later
                    from your workspace settings. However, connecting now will
                    enable automatic booking link attribution in your lead
                    emails.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-border fixed right-0 bottom-0 left-0 z-10 flex flex-col gap-3 border-t bg-white p-4 shadow-[0_-4px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-10">
        <Button
          variant="outline"
          onClick={handleBack}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col gap-2 sm:flex-row">
          {!calendlyConnected && (
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="w-full sm:w-auto"
            >
              Skip for Now
            </Button>
          )}

          <Button
            onClick={handleContinue}
            className="hover:shadow-primary/30 w-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            Continue to Email Configuration
            <span className="hidden sm:inline"> →</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
