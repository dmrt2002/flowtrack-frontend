export type MessageDirection = 'INBOUND' | 'OUTBOUND';

export type LeadStatus =
  | 'NEW'
  | 'EMAIL_SENT'
  | 'FOLLOW_UP_SENT'
  | 'RESPONDED'
  | 'BOOKED'
  | 'QUALIFIED'
  | 'DISQUALIFIED';

export interface HotboxLead {
  id: string;
  name: string | null;
  email: string;
  status: LeadStatus;
  score: number | null;
  lastActivityAt: Date | null;
}

export interface HotboxLatestMessage {
  preview: string;
  subject: string | null;
  direction: MessageDirection;
  createdAt: Date | null;
}

export interface HotboxConversation {
  lead: HotboxLead;
  messageCount: number;
  latestMessage: HotboxLatestMessage;
  lastActivityMinutesAgo: number | null;
  hasUnread: boolean;
}

export interface HotboxConversationsResponse {
  data: HotboxConversation[];
  total: number;
  limit: number;
  offset: number;
}

export interface Message {
  id: string;
  workspaceId: string;
  leadId: string;
  direction: MessageDirection;
  fromEmail: string;
  fromName: string | null;
  toEmail: string;
  toName: string | null;
  subject: string;
  htmlBody: string | null;
  textBody: string;
  messageId: string | null;
  inReplyTo: string | null;
  threadId: string | null;
  sentAt: Date | null;
  receivedAt: Date | null;
  createdAt: Date;
}

export interface MessagesResponse {
  data: Message[];
  total: number;
  limit: number;
  offset: number;
}

export interface SendMessageRequest {
  subject: string;
  textBody: string;
  htmlBody?: string;
  senderName?: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export type HotboxTab = 'needs-reply' | 'sent';
