'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useConnectedAccountsQuery,
  useDisconnectAccountMutation,
} from '../hooks';
import { useCurrentUser } from '@/store/currentUserStore';
import { toast } from 'sonner';
import request from '@/lib/request';
import { mainUrl } from '@/url/url';

interface CalendlyConnectionStatus {
  connected: boolean;
  email?: string;
  plan?: 'FREE' | 'PRO';
  webhookEnabled?: boolean;
  pollingEnabled?: boolean;
}

export function ConnectedAccountsCard() {
  const { currentUser } = useCurrentUser();
  const workspaceId = currentUser?.workspaces?.[0]?.id || null;
  const searchParams = useSearchParams();

  const {
    data: accounts,
    isLoading,
    refetch: refetchAccounts,
  } = useConnectedAccountsQuery();
  const disconnectMutation = useDisconnectAccountMutation();
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [calendlyConnected, setCalendlyConnected] = useState(false);
  const [calendlyPlan, setCalendlyPlan] = useState<'FREE' | 'PRO' | null>(null);
  const [isConnectingCalendly, setIsConnectingCalendly] = useState(false);

  // Check Calendly connection status
  useEffect(() => {
    if (!workspaceId) return;

    const checkCalendlyStatus = async () => {
      try {
        const response = await request.get<{
          success: boolean;
          data: CalendlyConnectionStatus;
        }>(`${mainUrl.calendlyConnection}/${workspaceId}`);

        if (response.data.data?.connected) {
          setCalendlyConnected(true);
          setCalendlyPlan(response.data.data.plan || null);
        }
      } catch {
        // Silently fail - Calendly might not be connected
        console.log('Calendly not connected');
      }
    };

    checkCalendlyStatus();
  }, [workspaceId]);

  // Handle OAuth callback
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
      refetchAccounts();

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('calendly');
      url.searchParams.delete('plan');
      window.history.replaceState({}, '', url);
    } else if (calendlyStatus === 'error') {
      toast.error('Failed to connect Calendly. Please try again.');
      setIsConnectingCalendly(false);

      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete('calendly');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams, refetchAccounts]);

  function handleDisconnect(credentialId: string) {
    const accountToDisconnect = accounts?.find(
      (acc) => acc.id === credentialId
    );
    const isCalendly = accountToDisconnect?.providerType === 'CALENDLY';

    disconnectMutation.mutate(credentialId, {
      onSuccess: () => {
        setDisconnectingId(null);
        if (isCalendly) {
          setCalendlyConnected(false);
          setCalendlyPlan(null);
        }
        refetchAccounts();
        toast.success('Account disconnected successfully');
      },
      onError: () => {
        toast.error('Failed to disconnect account');
      },
    });
  }

  function handleConnectCalendly() {
    if (!workspaceId) {
      toast.error('Workspace ID not available');
      return;
    }

    setIsConnectingCalendly(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const url = `${backendUrl}${mainUrl.calendlyOAuthAuthorize}?workspaceId=${workspaceId}`;
    window.location.href = url;
  }

  // Find Calendly account from connected accounts
  const calendlyAccount = accounts?.find(
    (account) => account.providerType === 'CALENDLY'
  );

  // Update Calendly connection state based on accounts
  useEffect(() => {
    if (calendlyAccount?.status === 'active') {
      setCalendlyConnected(true);
    } else {
      setCalendlyConnected(false);
    }
  }, [calendlyAccount]);

  if (isLoading) {
    return (
      <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">
            Connected Accounts
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your connected calendar and scheduling accounts
          </p>
        </div>
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">
            Connected Accounts
          </h3>
          <p className="mt-1 text-sm text-neutral-600">
            Connect Calendly to include booking links in your automated emails
          </p>
        </div>

        <div className="space-y-4">
          {/* Calendly Card */}
          <div
            className={`rounded-xl border bg-white p-4 shadow-sm transition-all sm:p-6 ${
              calendlyConnected
                ? 'border-green-200 bg-gradient-to-b from-white to-green-50/20'
                : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
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
                    <h4 className="text-lg font-semibold text-neutral-900">
                      Calendly
                    </h4>
                    {calendlyPlan && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-semibold tracking-wider text-blue-700 uppercase">
                        {calendlyPlan}
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-sm leading-relaxed text-neutral-600">
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          calendlyAccount &&
                          setDisconnectingId(calendlyAccount.id)
                        }
                        className="h-9"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Disconnect
                      </Button>
                      <Button
                        onClick={handleConnectCalendly}
                        disabled={isConnectingCalendly}
                        className="h-9 border-neutral-200 bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isConnectingCalendly ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          'Reconnect'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={handleConnectCalendly}
                      disabled={isConnectingCalendly || !workspaceId}
                      className="h-11 w-full border-neutral-200 bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                    >
                      {isConnectingCalendly ? (
                        <>
                          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect Calendly'
                      )}
                    </Button>

                    <p className="text-xs leading-relaxed text-neutral-600">
                      You&apos;ll be redirected to Calendly to authorize
                      FlowTrack
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Other Connected Accounts */}
          {accounts &&
            accounts.length > 0 &&
            accounts.some((acc) => acc.providerType !== 'CALENDLY') && (
              <div className="space-y-3">
                {accounts
                  .filter((account) => account.providerType !== 'CALENDLY')
                  .map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-neutral-900">
                            {account.providerType === 'GOOGLE_CALENDAR'
                              ? 'Google Calendar'
                              : account.providerType === 'OUTLOOK_CALENDAR'
                                ? 'Outlook Calendar'
                                : account.providerType === 'CAL_COM'
                                  ? 'Cal.com'
                                  : account.providerType}
                          </h4>
                          {account.status === 'active' && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                              Connected
                            </span>
                          )}
                        </div>
                        {account.providerEmail && (
                          <p className="mt-1 text-sm text-neutral-600">
                            {account.providerEmail}
                          </p>
                        )}
                      </div>
                      {account.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDisconnectingId(account.id)}
                          className="h-9"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      )}
                    </div>
                  ))}
              </div>
            )}

          {/* Empty State */}
          {(!accounts || accounts.length === 0) && !calendlyConnected && (
            <div className="py-8 text-center">
              <p className="text-neutral-600">No connected accounts</p>
              <p className="mt-1 text-sm text-neutral-500">
                Connect Calendly to enable calendar integrations
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={Boolean(disconnectingId)}
        onOpenChange={(open) => !open && setDisconnectingId(null)}
      >
        <DialogContent className="gap-0 rounded-xl border-[1.5px] border-neutral-200 p-0 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:max-w-[480px]">
          <div className="p-6 pb-4">
            <DialogHeader className="space-y-0 text-left">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1 pt-0.5">
                  <DialogTitle className="mb-2 text-xl font-semibold text-neutral-900">
                    Disconnect Account
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-neutral-600">
                    Are you sure you want to disconnect this account? Workflows
                    using this account may stop working.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>
          <DialogFooter className="gap-3 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => setDisconnectingId(null)}
              className="h-10 border-neutral-300 px-5 font-medium hover:bg-white"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                disconnectingId && handleDisconnect(disconnectingId)
              }
              disabled={disconnectMutation.isPending}
              className="h-10 bg-red-600 px-5 font-semibold text-white shadow-sm hover:bg-red-700"
            >
              {disconnectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
