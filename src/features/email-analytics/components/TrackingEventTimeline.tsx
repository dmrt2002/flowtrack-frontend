'use client';

import { Clock, Mail, Bot, User, HelpCircle } from 'lucide-react';
import type { EmailTrackingEvent, EmailTrackingClassification } from '../types';
import { getClassificationLabel, getClassificationDescription } from '../types';

interface TrackingEventTimelineProps {
  events: EmailTrackingEvent[];
}

export function TrackingEventTimeline({ events }: TrackingEventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 py-8 text-center">
        <Clock className="mx-auto h-8 w-8 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No tracking events yet</p>
      </div>
    );
  }

  // Sort events by openedAt (most recent first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4"
        >
          {/* Icon */}
          <div className={getIconClassName(event.classification)}>
            {getClassificationIcon(event.classification)}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            {/* Classification Badge */}
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeClassName(
                  event.classification
                )}`}
              >
                {getClassificationLabel(event.classification)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDateTime(event.openedAt)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700">
              {getClassificationDescription(
                event.classification,
                event.timeDeltaSeconds
              )}
            </p>

            {/* Technical Details */}
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>IP: {event.clientIp}</span>
              {event.resolvedHostname && (
                <span>Host: {event.resolvedHostname}</span>
              )}
              {event.isAppleProxy && (
                <span className="font-medium text-orange-600">Apple Proxy</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Get icon for classification
 */
function getClassificationIcon(classification: EmailTrackingClassification) {
  switch (classification) {
    case 'GENUINE_OPEN':
      return <User className="h-5 w-5" />;
    case 'BOT_PREFETCH':
      return <Bot className="h-5 w-5" />;
    case 'DIRECT_OPEN':
      return <Mail className="h-5 w-5" />;
    case 'AMBIGUOUS':
      return <HelpCircle className="h-5 w-5" />;
    default:
      return <HelpCircle className="h-5 w-5" />;
  }
}

/**
 * Get icon container className
 */
function getIconClassName(classification: EmailTrackingClassification): string {
  const base =
    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full';

  switch (classification) {
    case 'GENUINE_OPEN':
      return `${base} bg-green-100 text-green-600`;
    case 'BOT_PREFETCH':
      return `${base} bg-orange-100 text-orange-600`;
    case 'DIRECT_OPEN':
      return `${base} bg-blue-100 text-blue-600`;
    case 'AMBIGUOUS':
      return `${base} bg-gray-100 text-gray-600`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
}

/**
 * Get badge className for classification
 */
function getBadgeClassName(
  classification: EmailTrackingClassification
): string {
  switch (classification) {
    case 'GENUINE_OPEN':
      return 'bg-green-50 text-green-700';
    case 'BOT_PREFETCH':
      return 'bg-orange-50 text-orange-700';
    case 'DIRECT_OPEN':
      return 'bg-blue-50 text-blue-700';
    case 'AMBIGUOUS':
      return 'bg-gray-50 text-gray-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

/**
 * Format date and time
 */
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
