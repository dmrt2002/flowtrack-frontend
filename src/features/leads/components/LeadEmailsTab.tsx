'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useLeadEmails } from '../../hotbox/hooks/use-lead-emails';
import { EmailDetailModal } from '../../hotbox/components/EmailDetailModal';
import type { SentEmail } from '../../hotbox/hooks/use-inbox-emails';

interface LeadEmailsTabProps {
  workspaceId: string;
  leadId: string;
}

export function LeadEmailsTab({ workspaceId, leadId }: LeadEmailsTabProps) {
  const [emailType, setEmailType] = useState<
    'welcome' | 'thank_you' | 'follow_up' | undefined
  >(undefined);
  const [openStatus] = useState<'opened' | 'unopened' | 'all'>('all');
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: emailsData, isLoading } = useLeadEmails({
    workspaceId,
    leadId,
    emailType,
    openStatus,
  });

  const handleEmailClick = (email: SentEmail) => {
    setSelectedEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmail(null);
  };

  const getEmailTypeBadge = (type: string) => {
    const badges = {
      welcome: 'bg-indigo-50 text-indigo-700',
      thank_you: 'bg-green-50 text-green-700',
      follow_up: 'bg-amber-50 text-amber-700',
    };
    const labels = {
      welcome: 'Welcome',
      thank_you: 'Thank You',
      follow_up: 'Follow Up',
    };
    return {
      className: badges[type as keyof typeof badges] || badges.welcome,
      label: labels[type as keyof typeof labels] || type,
    };
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Group emails by date
  const groupedEmails =
    emailsData?.sentEmails.reduce(
      (groups, email) => {
        const dateKey = formatRelativeDate(email.sentAt);
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(email);
        return groups;
      },
      {} as Record<string, typeof emailsData.sentEmails>
    ) || {};

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm text-gray-500">Loading email history...</p>
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
        <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          This lead hasn&apos;t received any automated emails from workflows
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
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

      {/* Timeline */}
      <div className="relative pl-8">
        {/* Timeline Line */}
        <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>

        {/* Grouped Email Cards */}
        {Object.entries(groupedEmails).map(([dateLabel, emails]) => (
          <div key={dateLabel} className="mb-8">
            {/* Date Separator */}
            <div className="mb-4 -ml-8 flex items-center gap-3">
              <div className="relative z-10 h-4 w-4 rounded-full border-4 border-white bg-indigo-600"></div>
              <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                {dateLabel}
              </span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            {/* Email Cards for this date */}
            <div className="space-y-4">
              {emails.map((email) => {
                const badge = getEmailTypeBadge(email.emailType);

                return (
                  <div
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    className="border-1.5 transform cursor-pointer rounded-lg border-gray-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                  >
                    {/* Subject with Open Status */}
                    <div className="mb-2 flex items-center gap-2">
                      {email.openCount > 0 ? (
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      ) : (
                        <div className="border-1.5 h-2 w-2 rounded-full border-gray-300"></div>
                      )}
                      <h4 className="flex-1 text-base font-semibold text-gray-900">
                        {email.subject}
                      </h4>
                    </div>

                    {/* Open Status Text */}
                    <p className="mb-3 ml-4 text-sm font-medium">
                      {email.openCount > 0 ? (
                        <span className="text-green-600">
                          Opened {email.openCount} time
                          {email.openCount > 1 ? 's' : ''} • Last:{' '}
                          {formatRelativeDate(
                            email.lastOpenedAt || email.sentAt
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500">Not opened yet</span>
                      )}
                    </p>

                    {/* Metadata */}
                    <div className="ml-4 space-y-1.5 text-sm">
                      <div className="flex gap-2">
                        <span className="min-w-[60px] text-gray-500">
                          From:
                        </span>
                        <span className="text-gray-700">
                          {email.workflow.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[60px] text-gray-500">
                          Type:
                        </span>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="min-w-[60px] text-gray-500">
                          Sent:
                        </span>
                        <span className="text-gray-700">
                          {dateLabel === 'Today' || dateLabel === 'Yesterday'
                            ? `${dateLabel} at ${formatTime(email.sentAt)}`
                            : `${formatRelativeDate(email.sentAt)} at ${formatTime(email.sentAt)}`}
                        </span>
                      </div>
                    </div>

                    {/* View Email Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEmailClick(email);
                      }}
                      className="mt-3 ml-4 rounded-md border border-indigo-600 bg-transparent px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white"
                    >
                      View Email
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Email Detail Modal */}
      <EmailDetailModal
        email={selectedEmail}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
