import type { HotboxConversation } from '../types';

interface ConversationCardProps {
  conversation: HotboxConversation;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationCard({
  conversation,
  isSelected,
  onClick,
}: ConversationCardProps) {
  const {
    lead,
    messageCount,
    latestMessage,
    lastActivityMinutesAgo,
    hasUnread,
  } = conversation;

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
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition-all ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'hover:border-primary border-neutral-200 bg-white hover:shadow-md'
      } `}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-semibold text-white">
            {getInitials(lead.name, lead.email)}
          </div>
          <div>
            <div className="font-semibold text-neutral-900">
              {lead.name || 'Unknown Lead'}
            </div>
            <div className="text-sm text-neutral-500">{lead.email}</div>
          </div>
        </div>
        {hasUnread && (
          <div className="h-2 w-2 rounded-full bg-red-500" title="Unread" />
        )}
      </div>

      <div className="mb-2 line-clamp-2 text-sm text-neutral-700">
        {latestMessage.preview}
      </div>

      <div className="flex items-center gap-3 text-xs text-neutral-500">
        <span>{messageCount} messages</span>
        <span>•</span>
        <span>{formatTimestamp(lastActivityMinutesAgo)}</span>
      </div>
    </div>
  );
}
