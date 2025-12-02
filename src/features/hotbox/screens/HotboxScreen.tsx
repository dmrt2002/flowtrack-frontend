'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { ThreeColumnLayout } from '../components/ThreeColumnLayout';
import { ConversationList } from '../components/ConversationList';
import { ConversationThreadView } from '../components/ConversationThreadView';
import { LeadSummaryPanel } from '../components/LeadSummaryPanel';
import { useHotboxConversations } from '../hooks/use-hotbox-conversations';
import { useConversationThread } from '../hooks/use-conversation-thread';
import { useSendMessage } from '../hooks/use-send-message';
import { useCurrentUser } from '@/store/currentUserStore';
import type { HotboxTab, HotboxConversation } from '../types';
import { toast } from 'sonner';
import { Flame, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HotboxScreen() {
  const { currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const currentWorkspaceId = currentUser?.workspaces?.[0]?.id || null;

  // Debug logging
  useEffect(() => {
    console.log('🔍 HotboxScreen - workspaceId changed:', {
      currentWorkspaceId,
      hasCurrentUser: !!currentUser,
      workspaces: currentUser?.workspaces,
      isLoadingUser,
    });
  }, [currentWorkspaceId, currentUser, isLoadingUser]);

  const [activeTab, setActiveTab] = useState<HotboxTab>('needs-reply');
  const [selectedConversation, setSelectedConversation] =
    useState<HotboxConversation | null>(null);

  // Fetch conversations for the active tab
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useHotboxConversations({
    workspaceId: currentWorkspaceId,
    tab: activeTab,
  });

  // Fetch counts for both tabs separately (to persist across tab changes)
  const { data: needsReplyData } = useHotboxConversations({
    workspaceId: currentWorkspaceId,
    tab: 'needs-reply',
    limit: 1, // Only need count, not data
  });

  const { data: sentData } = useHotboxConversations({
    workspaceId: currentWorkspaceId,
    tab: 'sent',
    limit: 1, // Only need count, not data
  });

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useConversationThread({
    workspaceId: currentWorkspaceId,
    leadId: selectedConversation?.lead.id ?? null,
    enabled: !!selectedConversation,
  });

  // Send message mutation
  const sendMessageMutation = useSendMessage({
    workspaceId: currentWorkspaceId ?? '',
    leadId: selectedConversation?.lead.id ?? '',
    onSuccess: () => {
      toast.success('Reply sent successfully!');
      refetchMessages();
      refetchConversations();
    },
    onError: (error) => {
      toast.error('Failed to send reply. Please try again.');
      console.error('Send error:', error);
    },
  });

  const conversations = conversationsData?.data ?? [];
  const messages = messagesData?.data ?? [];
  const needsReplyCount = needsReplyData?.total ?? 0;
  const sentCount = sentData?.total ?? 0;

  const handleTabChange = (value: string) => {
    setActiveTab(value as HotboxTab);
    setSelectedConversation(null);
  };

  const handleSelectConversation = (conversation: HotboxConversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendReply = (textBody: string) => {
    if (!selectedConversation) return;

    // Get subject from latest message
    const latestMessage = messages[0];
    const subject = latestMessage?.subject
      ? `Re: ${latestMessage.subject}`
      : 'Your message';

    sendMessageMutation.mutate({
      subject,
      textBody,
      senderName: 'FlowTrack',
    });
  };

  // If no conversation selected, show conversation list full-width
  if (!selectedConversation) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mb-6 rounded-2xl border-[1.5px] border-neutral-200 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="h-7 w-7 text-red-500" />
                <h1 className="text-3xl font-bold text-neutral-900">Hotbox</h1>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="needs-reply" className="gap-2">
                    <Flame className="h-4 w-4" />
                    Needs Reply
                    {needsReplyCount > 0 && (
                      <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                        {needsReplyCount}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="sent" className="gap-2">
                    <Send className="h-4 w-4" />
                    Sent
                    {sentCount > 0 && (
                      <span className="ml-2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs font-semibold text-white">
                        {sentCount}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </motion.div>

          {/* Conversation List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="rounded-2xl border-[1.5px] border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <ConversationList
              conversations={conversations}
              selectedConversationId={null}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoadingConversations}
            />
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // Two-column layout when conversation is selected
  return (
    <DashboardLayout>
      <div
        className="flex flex-col gap-6"
        style={{ height: 'calc(100vh - 8rem)' }}
      >
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex-shrink-0 rounded-2xl border-[1.5px] border-neutral-200 bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedConversation(null);
                }}
                className="mr-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Flame className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold text-neutral-900">Hotbox</h1>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value="needs-reply" className="gap-2">
                  <Flame className="h-4 w-4" />
                  Needs Reply
                  {needsReplyCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                      {needsReplyCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="sent" className="gap-2">
                  <Send className="h-4 w-4" />
                  Sent
                  {sentCount > 0 && (
                    <span className="ml-2 rounded-full bg-neutral-400 px-2 py-0.5 text-xs font-semibold text-white">
                      {sentCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Two-Column Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="min-h-0 flex-1"
        >
          <ThreeColumnLayout
            showLeftPanel={true}
            showRightPanel={false}
            leftPanel={
              <div className="flex h-full flex-col">
                {/* Lead Summary Panel */}
                <div className="min-h-0 flex-1">
                  <LeadSummaryPanel
                    lead={selectedConversation.lead}
                    messageCount={selectedConversation.messageCount}
                    lastActivityMinutesAgo={
                      selectedConversation.lastActivityMinutesAgo
                    }
                  />
                </div>
              </div>
            }
            middlePanel={
              <ConversationThreadView
                messages={messages}
                leadName={selectedConversation.lead.name}
                onSendReply={handleSendReply}
                isLoading={isLoadingMessages}
                isSending={sendMessageMutation.isPending}
              />
            }
            rightPanel={null}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
