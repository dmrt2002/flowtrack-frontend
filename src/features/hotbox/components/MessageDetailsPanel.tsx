import type { Message } from '../types';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';

interface MessageDetailsPanelProps {
  message: Message | null;
}

export function MessageDetailsPanel({ message }: MessageDetailsPanelProps) {
  if (!message) {
    return (
      <div className="flex w-96 items-center justify-center border-l border-neutral-200 bg-white p-6">
        <div className="text-center text-neutral-500">
          <Mail className="mx-auto mb-4 h-16 w-16 text-neutral-300" />
          <div className="text-sm">Click on a message to view details</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 overflow-y-auto border-l border-neutral-200 bg-white p-6">
      <div className="mb-6 border-b-2 border-neutral-200 pb-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Message Details
        </h3>
      </div>

      <div className="mb-6 space-y-4">
        <div>
          <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Direction
          </div>
          <div className="inline-flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-1 text-xs font-semibold ${
                message.direction === 'INBOUND'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {message.direction}
            </span>
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            From
          </div>
          <div className="text-sm font-medium text-neutral-900">
            {message.fromName || message.fromEmail}
          </div>
          {message.fromName && (
            <div className="text-xs text-neutral-500">{message.fromEmail}</div>
          )}
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            To
          </div>
          <div className="text-sm font-medium text-neutral-900">
            {message.toName || message.toEmail}
          </div>
          {message.toName && (
            <div className="text-xs break-all text-neutral-500">
              {message.toEmail}
            </div>
          )}
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Date
          </div>
          <div className="text-sm text-neutral-700">
            {format(
              new Date(
                message.sentAt || message.receivedAt || message.createdAt
              ),
              'MMM d, yyyy h:mm:ss a'
            )}
          </div>
        </div>

        <div>
          <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Subject
          </div>
          <div className="text-sm font-medium text-neutral-900">
            {message.subject || '(No subject)'}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            Message Body
          </div>
          <div className="max-h-96 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            {message.htmlBody ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: message.htmlBody }}
              />
            ) : (
              <div className="text-sm whitespace-pre-wrap text-neutral-700">
                {message.textBody}
              </div>
            )}
          </div>
        </div>

        {message.messageId && (
          <div>
            <div className="mb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              Message ID
            </div>
            <div className="rounded bg-neutral-50 p-2 font-mono text-xs break-all text-neutral-600">
              {message.messageId}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
