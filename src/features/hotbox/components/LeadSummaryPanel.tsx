import type { HotboxLead } from '../types';
import { Button } from '@/components/ui/button';

interface LeadSummaryPanelProps {
  lead: HotboxLead;
  messageCount: number;
  lastActivityMinutesAgo: number | null;
}

export function LeadSummaryPanel({
  lead,
  messageCount,
  lastActivityMinutesAgo,
}: LeadSummaryPanelProps) {
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const formatTimestamp = (minutesAgo: number | null) => {
    if (minutesAgo === null) return 'Unknown';
    if (minutesAgo < 1) return 'Just now';
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    if (minutesAgo < 1440) return `${Math.floor(minutesAgo / 60)}h ago`;
    return `${Math.floor(minutesAgo / 1440)}d ago`;
  };

  return (
    <div className="w-80 overflow-y-auto rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-semibold text-white">
          {getInitials(lead.name, lead.email)}
        </div>
        <div className="mb-1 text-center text-xl font-semibold text-neutral-900">
          {lead.name || 'Unknown Lead'}
        </div>
        <div className="text-center text-sm break-all text-neutral-500">
          {lead.email}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex justify-between border-b border-neutral-100 py-3">
          <span className="text-sm text-neutral-600">Status</span>
          <span className="text-sm font-semibold text-neutral-900 uppercase">
            {lead.status}
          </span>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-3">
          <span className="text-sm text-neutral-600">Score</span>
          <span className="text-sm font-semibold text-neutral-900">
            {lead.score ?? 0}
          </span>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-3">
          <span className="text-sm text-neutral-600">Messages</span>
          <span className="text-sm font-semibold text-neutral-900">
            {messageCount}
          </span>
        </div>
        <div className="flex justify-between border-b border-neutral-100 py-3">
          <span className="text-sm text-neutral-600">Last Activity</span>
          <span className="text-sm font-semibold text-neutral-900">
            {formatTimestamp(lastActivityMinutesAgo)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Button variant="outline" className="w-full" size="sm">
          View Full Profile
        </Button>
        <Button variant="outline" className="w-full" size="sm">
          Edit Lead
        </Button>
      </div>
    </div>
  );
}
