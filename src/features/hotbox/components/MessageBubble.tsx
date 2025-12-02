import type { Message } from '../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isSelected: boolean;
  onClick: () => void;
}

export function MessageBubble({
  message,
  isSelected,
  onClick,
}: MessageBubbleProps) {
  const isInbound = message.direction === 'INBOUND';
  const timestamp = message.sentAt || message.receivedAt || message.createdAt;
  const fromName =
    message.fromName || message.fromEmail?.split('@')[0] || 'Unknown';
  const toName = message.toName || message.toEmail?.split('@')[0] || 'Unknown';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-b border-neutral-200 px-4 py-3 transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-neutral-50'} `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium ${
            isInbound
              ? 'bg-blue-100 text-blue-700'
              : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {isInbound ? fromName[0].toUpperCase() : toName[0].toUpperCase()}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-900">
              {isInbound ? fromName : toName}
            </span>
            <span className="text-xs text-neutral-500">
              {isInbound ? `<${message.fromEmail}>` : `<${message.toEmail}>`}
            </span>
            <span className="ml-auto text-xs text-neutral-400">
              {format(new Date(timestamp), 'MMM d, h:mm a')}
            </span>
          </div>

          {message.subject && (
            <div className="mb-1 text-sm font-medium text-neutral-900">
              {message.subject}
            </div>
          )}

          <div className="text-sm whitespace-pre-wrap text-neutral-600">
            {message.textBody}
          </div>
        </div>
      </div>
    </div>
  );
}
