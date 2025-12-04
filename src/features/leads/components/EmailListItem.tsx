'use client';

import { Mail } from 'lucide-react';
import type { SentEmail } from '../../hotbox/hooks/use-inbox-emails';

interface EmailListItemProps {
  email: SentEmail & {
    workflow: {
      id: string;
      name: string;
    };
    workflowExecution: {
      id: string;
      status: string;
    };
  };
  isSelected: boolean;
  onClick: () => void;
}

export function EmailListItem({
  email,
  isSelected,
  onClick,
}: EmailListItemProps) {
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

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getEmailPreview = () => {
    // Extract text from HTML body or use text body
    if (email.textBody) {
      return email.textBody.slice(0, 120);
    }
    if (email.htmlBody) {
      // Simple HTML stripping
      const text = email.htmlBody.replace(/<[^>]*>/g, '').trim();
      return text.slice(0, 120);
    }
    return 'No content';
  };

  const badge = getEmailTypeBadge(email.emailType);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition-all ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50'
          : 'border-neutral-200 bg-white hover:border-indigo-600 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Mail
            className={`h-4 w-4 ${email.openCount > 0 ? 'text-green-600' : 'text-neutral-400'}`}
          />
          <div className="flex-1">
            <div className="line-clamp-1 font-semibold text-neutral-900">
              {email.subject || 'No subject'}
            </div>
          </div>
        </div>
        {email.openCount > 0 && (
          <div
            className="ml-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"
            title="Opened"
          />
        )}
      </div>

      {/* Preview */}
      <div className="mb-2 line-clamp-2 text-sm text-neutral-600">
        {getEmailPreview()}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 text-xs">
        <span
          className={`inline-block rounded-full px-2 py-0.5 font-medium ${badge.bg} ${badge.text}`}
        >
          {badge.label}
        </span>
        <span className="text-neutral-500">•</span>
        <span className="text-neutral-500">
          {formatTimestamp(email.sentAt)}
        </span>
        {email.openCount > 0 && (
          <>
            <span className="text-neutral-500">•</span>
            <span className="text-green-600">
              {email.openCount} open{email.openCount > 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
