'use client';

import { formatDistanceToNow } from 'date-fns';
import type { LeadSummary } from '../types/dashboard';
import { getStatusColor } from '../../leads/utils/lead-status-colors';
import { LEAD_STATUS_LABELS } from '../../leads/types/lead';
import type { LeadStatus } from '../../leads/types/lead';

interface LeadCardProps {
  lead: LeadSummary;
  onClick: (leadId: string) => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  // Use the proper LeadStatus type and utilities
  const leadStatus = lead.status as LeadStatus;
  const statusColors = getStatusColor(leadStatus);
  const statusLabel = LEAD_STATUS_LABELS[leadStatus] || leadStatus;
  const timeAgo = formatDistanceToNow(new Date(lead.createdAt), {
    addSuffix: true,
  });

  // Get initials for avatar
  const initials = lead.name
    ? lead.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : lead.email.split('@')[0].slice(0, 2).toUpperCase();

  return (
    <button
      onClick={() => onClick(lead.id)}
      className="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-left transition-all duration-200 hover:border-indigo-200 hover:bg-white hover:shadow-[0_2px_8px_rgba(79,70,229,0.06)]"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Avatar + Info */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
            <span className="text-base font-semibold text-white">
              {initials}
            </span>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 truncate text-base font-semibold text-neutral-900">
              {lead.name || lead.email.split('@')[0]}
            </div>
            <div className="mb-2 truncate text-sm text-neutral-500">
              {lead.email}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[13px] text-neutral-600">
              {lead.company && <span>{lead.company}</span>}
              {lead.company && lead.budget && <span>·</span>}
              {lead.budget && <span>{lead.budget} budget</span>}
              <span>·</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${statusColors.bg} ${statusColors.text} flex-shrink-0`}
        >
          <div className={`h-2 w-2 rounded-full ${statusColors.dot}`} />
          <span className="text-xs font-semibold">{statusLabel}</span>
        </div>
      </div>
    </button>
  );
}
