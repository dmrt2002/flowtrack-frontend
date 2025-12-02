'use client';

import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { SentEmail } from '../hooks/use-inbox-emails';

interface EmailDetailModalProps {
  email: SentEmail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailDetailModal({
  email,
  isOpen,
  onClose,
}: EmailDetailModalProps) {
  const router = useRouter();

  if (!email) return null;

  const handleViewLeadProfile = () => {
    router.push(`/leads/${email.leadId}`);
    onClose();
  };

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

  const badge = getEmailTypeBadge(email.emailType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] max-w-[720px] flex-col p-0">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 bg-gray-50 px-6 py-5">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Email Details
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
          {/* Metadata Section */}
          <div className="space-y-3">
            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">From:</span>
              <span className="text-gray-900">
                {email.senderEmail}
                {email.senderName && ` (${email.senderName})`}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">To:</span>
              <span className="text-gray-900">
                {email.recipientEmail}
                {email.recipientName && ` (${email.recipientName})`}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Subject:</span>
              <span className="text-gray-900">{email.subject}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Sent:</span>
              <span className="text-gray-900">
                {formatDateTime(email.sentAt)}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Status:</span>
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
                    <div className="h-2.5 w-2.5 rounded-full border-2 border-gray-300"></div>
                    <span className="text-gray-500">Not opened</span>
                  </>
                )}
              </div>
            </div>

            {email.lastOpenedAt && (
              <div className="ml-[112px] grid grid-cols-[100px_1fr] gap-3 text-sm">
                <span className="text-xs text-gray-500">
                  Last opened: {formatDateTime(email.lastOpenedAt)}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Workflow:</span>
              <span className="text-gray-900">{email.workflow.name}</span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Type:</span>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-3 text-sm">
              <span className="font-semibold text-gray-700">Provider:</span>
              <span className="text-gray-900">{email.providerType}</span>
            </div>
          </div>

          {/* Email Content Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Email Content Preview
            </h3>
            <div
              className="prose prose-sm max-h-[400px] max-w-none overflow-y-auto rounded-lg border border-gray-200 bg-white p-5"
              dangerouslySetInnerHTML={{ __html: email.htmlBody }}
            />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-row justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            onClick={handleViewLeadProfile}
            className="rounded-lg border border-indigo-600 bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            View Lead Profile
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
