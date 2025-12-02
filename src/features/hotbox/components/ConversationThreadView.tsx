import { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../types';
import { format, isToday, isYesterday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface ConversationThreadViewProps {
  messages: Message[];
  leadName: string | null;
  onSendReply: (textBody: string) => void;
  isLoading: boolean;
  isSending: boolean;
}

export function ConversationThreadView({
  messages,
  leadName,
  onSendReply,
  isLoading,
  isSending,
}: ConversationThreadViewProps) {
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or conversation loads
  useEffect(() => {
    if (messages.length > 0 && !isLoading && messagesContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSendReply(replyText);
    setReplyText('');
    // Scroll to bottom after sending
    setTimeout(() => {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };
  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'TODAY';
    if (isYesterday(date)) return 'YESTERDAY';
    return format(date, 'MMMM d, yyyy').toUpperCase();
  };

  // Group messages by date
  const messagesByDate = messages.reduce(
    (acc, message) => {
      const date = message.sentAt || message.receivedAt || message.createdAt;
      const dateKey = format(new Date(date), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(message);
      return acc;
    },
    {} as Record<string, Message[]>
  );

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto bg-neutral-50 p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-neutral-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-neutral-50 p-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">💬</div>
          <div className="mb-2 text-xl font-semibold text-neutral-900">
            No messages yet
          </div>
          <div className="text-neutral-500">
            Start a conversation by sending a message
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-neutral-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      {/* Messages Section - Scrollable */}
      <div
        ref={messagesContainerRef}
        className="min-h-0 flex-1 overflow-y-auto bg-neutral-50 p-6"
      >
        <div className="mb-6 border-b-2 border-neutral-200 pb-4">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Thread with {leadName || 'Lead'}
          </h2>
        </div>

        {Object.entries(messagesByDate)
          .sort(([a], [b]) => a.localeCompare(b)) // Oldest date first
          .map(([dateKey, dateMessages]) => (
            <div key={dateKey} className="mb-6">
              <div className="mb-4 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                {getDateLabel(new Date(dateKey))}
              </div>
              {dateMessages
                .sort(
                  (a, b) =>
                    new Date(
                      a.sentAt || a.receivedAt || a.createdAt
                    ).getTime() -
                    new Date(b.sentAt || b.receivedAt || b.createdAt).getTime()
                ) // Oldest first within date (Gmail-style: original message on top)
                .map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isSelected={false}
                    onClick={() => {}}
                  />
                ))}
            </div>
          ))}
        {/* Scroll anchor - invisible element at the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Section - Floating at Bottom */}
      <div className="flex-shrink-0 border-t-[1.5px] border-neutral-200 bg-white p-6">
        <div className="space-y-3">
          <div>
            <label className="mb-2 block text-sm font-semibold text-neutral-900">
              Quick Reply to {leadName || 'Lead'}
            </label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your reply..."
              className="min-h-[100px] resize-none border-neutral-300 focus:border-indigo-500 focus:ring-indigo-500"
              disabled={isSending}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-500">
              Press Cmd/Ctrl + Enter to send
            </div>
            <Button
              onClick={handleSend}
              disabled={!replyText.trim() || isSending}
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reply'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
