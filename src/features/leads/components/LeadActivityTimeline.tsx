'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Mail,
  Calendar,
  UserPlus,
  TrendingUp,
  Tag,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import type { LeadEvent, Booking } from '../types/lead';
import { useLeadEmails } from '@/features/hotbox/hooks/use-lead-emails';
import type { SentEmail } from '@/features/hotbox/hooks/use-inbox-emails';

interface LeadActivityTimelineProps {
  events: LeadEvent[];
  bookings: Booking[];
  leadId: string;
  workspaceId: string;
}

type TimelineItem = {
  id: string;
  type: 'event' | 'email' | 'booking';
  timestamp: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  metadata?: any;
};

export function LeadActivityTimeline({
  events,
  bookings,
  leadId,
  workspaceId,
}: LeadActivityTimelineProps) {
  // Fetch emails for this lead
  const { data: emailsData } = useLeadEmails({
    workspaceId,
    leadId,
    enabled: !!workspaceId && !!leadId,
  });
  const emails = emailsData?.sentEmails || [];

  // Get icon for event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'CREATED':
        return {
          icon: <UserPlus className="h-4 w-4" />,
          color: 'bg-blue-100 text-blue-600',
        };
      case 'STATUS_CHANGED':
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'bg-purple-100 text-purple-600',
        };
      case 'EMAIL_SENT':
        return {
          icon: <Mail className="h-4 w-4" />,
          color: 'bg-green-100 text-green-600',
        };
      case 'EMAIL_OPENED':
        return {
          icon: <Mail className="h-4 w-4" />,
          color: 'bg-green-100 text-green-600',
        };
      case 'MEETING_SCHEDULED':
        return {
          icon: <Calendar className="h-4 w-4" />,
          color: 'bg-indigo-100 text-indigo-600',
        };
      case 'TAG_ADDED':
      case 'TAG_REMOVED':
        return {
          icon: <Tag className="h-4 w-4" />,
          color: 'bg-yellow-100 text-yellow-600',
        };
      case 'NOTE_ADDED':
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          color: 'bg-neutral-100 text-neutral-600',
        };
      default:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'bg-neutral-100 text-neutral-600',
        };
    }
  };

  // Convert all activity to timeline items
  const timeline: TimelineItem[] = [
    // Events
    ...events.map((event) => {
      const iconConfig = getEventIcon(event.eventType);
      return {
        id: `event-${event.id}`,
        type: 'event' as const,
        timestamp: event.createdAt,
        title: event.description,
        description: event.performedBy
          ? `by ${event.performedBy.name || event.performedBy.email}`
          : '',
        icon: iconConfig.icon,
        iconColor: iconConfig.color,
        metadata: event.metadata,
      };
    }),

    // Bookings
    ...bookings.map((booking) => {
      const status = booking.status || 'SCHEDULED';
      const statusLabel =
        typeof status === 'string'
          ? status.toLowerCase().replace(/_/g, ' ')
          : 'scheduled';

      return {
        id: `booking-${booking.id}`,
        type: 'booking' as const,
        timestamp: booking.createdAt,
        title: `Meeting ${statusLabel}`,
        description: booking.scheduledAt
          ? `Scheduled for ${new Date(booking.scheduledAt).toLocaleString()}`
          : '',
        icon:
          status === 'COMPLETED' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : status === 'CANCELLED' ? (
            <XCircle className="h-4 w-4" />
          ) : (
            <Calendar className="h-4 w-4" />
          ),
        iconColor:
          status === 'COMPLETED'
            ? 'bg-green-100 text-green-600'
            : status === 'CANCELLED'
              ? 'bg-red-100 text-red-600'
              : 'bg-indigo-100 text-indigo-600',
      };
    }),

    // Emails
    ...emails.map((email: SentEmail) => ({
      id: `email-${email.id}`,
      type: 'email' as const,
      timestamp: email.sentAt,
      title: email.subject || 'No subject',
      description: `Sent to ${email.recipientEmail}${email.openCount > 0 ? ` • Opened ${email.openCount} time${email.openCount > 1 ? 's' : ''}` : ''}`,
      icon: <Mail className="h-4 w-4" />,
      iconColor:
        email.openCount > 0
          ? 'bg-green-100 text-green-600'
          : 'bg-blue-100 text-blue-600',
    })),
  ];

  // Sort by timestamp (newest first)
  const sortedTimeline = timeline.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Timeline */}
      <div>
        {sortedTimeline.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
              <Clock className="h-8 w-8 text-neutral-400" />
            </div>
            <h4 className="text-base font-semibold text-neutral-900">
              No Activity Yet
            </h4>
            <p className="mt-2 text-sm text-neutral-600">
              Activity will appear here as you interact with this lead.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTimeline.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                {/* Timeline line */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${item.iconColor}`}
                  >
                    {item.icon}
                  </div>
                  {index < sortedTimeline.length - 1 && (
                    <div className="h-full w-px bg-neutral-200" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 transition-colors hover:bg-white">
                    <div className="mb-1 font-medium text-neutral-900">
                      {item.title}
                    </div>
                    {item.description && (
                      <p className="mb-2 text-sm text-neutral-600">
                        {item.description}
                      </p>
                    )}
                    <div className="text-xs text-neutral-500">
                      {formatDistanceToNow(new Date(item.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
