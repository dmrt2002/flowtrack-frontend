import { useQuery } from '@tanstack/react-query';
import request from '../../../lib/request';
import { mainUrl } from '../../../url/url';

export interface SentEmail {
  id: string;
  workspaceId: string;
  leadId: string;
  workflowExecutionId: string;
  workflowId: string;
  recipientEmail: string;
  recipientName: string | null;
  senderEmail: string;
  senderName: string | null;
  subject: string;
  htmlBody: string;
  textBody: string | null;
  emailType: 'welcome' | 'thank_you' | 'follow_up';
  providerType: 'GMAIL' | 'SMTP';
  gmailMessageId: string | null;
  gmailThreadId: string | null;
  smtpMessageId: string | null;
  deliveryStatus: 'sent' | 'delivered' | 'bounced' | 'failed';
  deliveryError: string | null;
  openCount: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
  lead: {
    id: string;
    name: string | null;
    email: string;
  };
  workflow: {
    id: string;
    name: string;
  };
}

export interface InboxEmailsResponse {
  sentEmails: SentEmail[];
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UseInboxEmailsOptions {
  workspaceId: string;
  workflowId?: string;
  emailType?: 'welcome' | 'thank_you' | 'follow_up';
  deliveryStatus?: 'sent' | 'delivered' | 'bounced' | 'failed';
  openStatus?: 'opened' | 'unopened' | 'all';
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'sentAt' | 'openCount';
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export function useInboxEmails(options: UseInboxEmailsOptions) {
  const {
    workspaceId,
    workflowId,
    emailType,
    deliveryStatus,
    openStatus = 'all',
    search,
    limit = 50,
    offset = 0,
    sortBy = 'sentAt',
    sortOrder = 'desc',
    enabled = true,
  } = options;

  return useQuery<InboxEmailsResponse>({
    queryKey: [
      'inbox-emails',
      workspaceId,
      workflowId,
      emailType,
      deliveryStatus,
      openStatus,
      search,
      limit,
      offset,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (workflowId) params.append('workflowId', workflowId);
      if (emailType) params.append('emailType', emailType);
      if (deliveryStatus) params.append('deliveryStatus', deliveryStatus);
      if (openStatus) params.append('openStatus', openStatus);
      if (search) params.append('search', search);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const url = `${mainUrl.getWorkspaceEmails(workspaceId)}?${params.toString()}`;
      const response = await request.get<{
        success: boolean;
        data: InboxEmailsResponse;
      }>(url);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: enabled && !!workspaceId,
  });
}

export interface EmailStatistics {
  totalSent: number;
  totalOpened: number;
  totalBounced: number;
  totalFailed: number;
  openRate: number;
}

export function useEmailStatistics(workspaceId: string, enabled = true) {
  return useQuery<EmailStatistics>({
    queryKey: ['email-statistics', workspaceId],
    queryFn: async () => {
      const response = await request.get<{
        success: boolean;
        data: EmailStatistics;
      }>(mainUrl.getEmailStatistics(workspaceId));
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && !!workspaceId,
  });
}

export function useSentEmailById(
  emailId: string,
  workspaceId: string,
  enabled = true
) {
  return useQuery<SentEmail>({
    queryKey: ['sent-email', emailId, workspaceId],
    queryFn: async () => {
      const response = await request.get<{ success: boolean; data: SentEmail }>(
        mainUrl.getSentEmailById(emailId, workspaceId)
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: enabled && !!emailId && !!workspaceId,
  });
}
