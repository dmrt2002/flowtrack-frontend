import { ConversationCard } from './ConversationCard';
import type { HotboxConversation } from '../types';

interface ConversationListProps {
  conversations: HotboxConversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: HotboxConversation) => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg bg-neutral-100"
          />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 text-6xl">📭</div>
        <div className="mb-2 text-xl font-semibold text-neutral-900">
          No conversations yet
        </div>
        <div className="text-neutral-500">
          Conversations will appear here when they arrive
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-6">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation.lead.id}
          conversation={conversation}
          isSelected={selectedConversationId === conversation.lead.id}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
}
