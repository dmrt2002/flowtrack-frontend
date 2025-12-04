'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useLeadEmails } from '../../hotbox/hooks/use-lead-emails';
import { EmailListItem } from './EmailListItem';
import { EmailDetailPanel } from './EmailDetailPanel';

interface LeadEmailsTabProps {
  workspaceId: string;
  leadId: string;
}

export function LeadEmailsTab({ workspaceId, leadId }: LeadEmailsTabProps) {
  const [emailType, setEmailType] = useState<
    'welcome' | 'thank_you' | 'follow_up' | undefined
  >(undefined);
  const [openStatus] = useState<'opened' | 'unopened' | 'all'>('all');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);

  const {
    data: emailsData,
    isLoading,
    isError,
    error,
  } = useLeadEmails({
    workspaceId,
    leadId,
    emailType,
    openStatus,
    enabled: !!workspaceId && !!leadId,
  });

  // Auto-select first email when data loads
  useEffect(() => {
    if (
      emailsData?.sentEmails &&
      emailsData.sentEmails.length > 0 &&
      !selectedEmailId
    ) {
      setSelectedEmailId(emailsData.sentEmails[0].id);
    }
  }, [emailsData, selectedEmailId]);

  const selectedEmail =
    emailsData?.sentEmails.find((email) => email.id === selectedEmailId) ||
    null;

  // Handle disabled state (missing workspaceId or leadId)
  if (!workspaceId || !leadId) {
    return (
      <div className="rounded-lg bg-red-50 py-16 text-center">
        <Mail className="mx-auto h-12 w-12 text-red-300" />
        <h3 className="mt-4 text-base font-semibold text-red-900">
          Unable to Load Emails
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-red-600">
          Missing workspace or lead information. Please try refreshing the page.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading email history...</p>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 py-16 text-center">
        <Mail className="mx-auto h-12 w-12 text-red-300" />
        <h3 className="mt-4 text-base font-semibold text-red-900">
          Failed to Load Emails
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : 'An error occurred while fetching emails'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!emailsData || emailsData.sentEmails.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-16 text-center">
        <Mail className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-4 text-base font-semibold text-gray-900">
          No emails sent yet
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-gray-500">
          This lead hasn&apos;t received any automated emails from workflows
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Header with Filter */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Email History{' '}
            <span className="text-gray-500">({emailsData.totalCount})</span>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All automated emails sent to this lead
          </p>
        </div>
        <select
          className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={emailType || 'all'}
          onChange={(e) =>
            setEmailType(
              e.target.value === 'all'
                ? undefined
                : (e.target.value as 'welcome' | 'thank_you' | 'follow_up')
            )
          }
        >
          <option value="all">All Emails</option>
          <option value="welcome">Welcome Emails</option>
          <option value="thank_you">Thank You Emails</option>
          <option value="follow_up">Follow Up Emails</option>
        </select>
      </div>

      {/* Two-Panel Layout */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        {/* Left Panel - Email List */}
        <div className="space-y-3 lg:col-span-5">
          <div className="max-h-[600px] space-y-2 overflow-y-auto">
            {emailsData.sentEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmailId === email.id}
                onClick={() => setSelectedEmailId(email.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Panel - Email Detail */}
        <div className="lg:col-span-7">
          <div className="h-[600px]">
            <EmailDetailPanel email={selectedEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}
