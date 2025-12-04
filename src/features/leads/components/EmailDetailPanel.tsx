'use client';

import type { SentEmail } from '../../hotbox/hooks/use-inbox-emails';
import { Mail } from 'lucide-react';

interface EmailDetailPanelProps {
  email:
    | (SentEmail & {
        workflow: {
          id: string;
          name: string;
        };
        workflowExecution: {
          id: string;
          status: string;
        };
      })
    | null;
}

export function EmailDetailPanel({ email }: EmailDetailPanelProps) {
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 p-12">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-neutral-300" />
          <h3 className="mt-4 text-base font-semibold text-neutral-900">
            No Email Selected
          </h3>
          <p className="mt-2 text-sm text-neutral-600">
            Select an email from the list to view its details
          </p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }) +
      ' at ' +
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const getEmailTypeBadge = (type: string) => {
    const badges = {
      welcome: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        label: 'Welcome',
      },
      thank_you: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'Thank You',
      },
      follow_up: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        label: 'Follow Up',
      },
    };
    return badges[type as keyof typeof badges] || badges.follow_up;
  };

  const badge = getEmailTypeBadge(email.emailType);

  return (
    <div className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-900">
          Email Details
        </h2>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {/* Metadata Section */}
        <div className="space-y-3">
          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">Subject:</span>
            <span className="text-neutral-900">
              {email.subject || 'No subject'}
            </span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">To:</span>
            <span className="text-neutral-900">
              {email.recipientEmail}
              {email.recipientName && ` (${email.recipientName})`}
            </span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">Sent:</span>
            <span className="text-neutral-900">
              {formatDateTime(email.sentAt)}
            </span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">Status:</span>
            <div className="flex items-center gap-2">
              {email.openCount > 0 ? (
                <>
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                  <span className="font-medium text-green-600">
                    Opened ({email.openCount} time
                    {email.openCount > 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2.5 w-2.5 rounded-full border-2 border-neutral-300"></div>
                  <span className="text-neutral-500">Not opened</span>
                </>
              )}
            </div>
          </div>

          {/* MPP Classification Badges */}
          {email.openCount > 0 && (
            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-neutral-700">
                Classification:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {(email as any).genuineOpenCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    {(email as any).genuineOpenCount} Genuine
                  </span>
                )}
                {(email as any).botPrefetchCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                    {(email as any).botPrefetchCount} Bot
                  </span>
                )}
                {(email as any).directOpenCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {(email as any).directOpenCount} Direct
                  </span>
                )}
                {(email as any).ambiguousOpenCount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {(email as any).ambiguousOpenCount} Ambiguous
                  </span>
                )}
                {email.openCount > 0 &&
                  !(email as any).genuineOpenCount &&
                  !(email as any).botPrefetchCount &&
                  !(email as any).directOpenCount &&
                  !(email as any).ambiguousOpenCount && (
                    <span className="text-sm text-neutral-600">
                      {email.openCount} total open
                      {email.openCount > 1 ? 's' : ''}
                    </span>
                  )}
              </div>
            </div>
          )}

          {email.lastOpenedAt && (
            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-neutral-700">
                Last Opened:
              </span>
              <span className="text-neutral-900">
                {formatDateTime(email.lastOpenedAt)}
              </span>
            </div>
          )}

          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">Workflow:</span>
            <span className="text-neutral-900">{email.workflow.name}</span>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
            <span className="font-semibold text-neutral-700">Type:</span>
            <span
              className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}
            >
              {badge.label}
            </span>
          </div>

          {email.deliveryStatus && (
            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-neutral-700">Delivery:</span>
              <span className="text-neutral-900 capitalize">
                {email.deliveryStatus}
              </span>
            </div>
          )}
        </div>

        {/* Email Content Preview */}
        <div className="border-t border-neutral-200 pt-6">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Email Content Preview
          </h3>
          {email.htmlBody ? (
            <div
              className="prose prose-sm max-h-[400px] max-w-none overflow-y-auto rounded-lg border border-neutral-200 bg-white p-5"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          ) : email.textBody ? (
            <div className="max-h-[400px] max-w-none overflow-y-auto rounded-lg border border-neutral-200 bg-white p-5 text-sm whitespace-pre-wrap text-neutral-700">
              {email.textBody}
            </div>
          ) : (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-center text-sm text-neutral-500">
              No content available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
