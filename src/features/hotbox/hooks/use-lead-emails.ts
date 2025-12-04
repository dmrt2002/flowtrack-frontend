import { useQuery } from '@tanstack/react-query';
import request from '../../../lib/request';
import { mainUrl } from '../../../url/url';
import type { SentEmail } from './use-inbox-emails';

export interface LeadEmailsResponse {
  sentEmails: Array<
    SentEmail & {
      workflow: {
        id: string;
        name: string;
      };
      workflowExecution: {
        id: string;
        status: string;
      };
    }
  >;
  totalCount: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UseLeadEmailsOptions {
  workspaceId: string;
  leadId: string;
  emailType?: 'welcome' | 'thank_you' | 'follow_up';
  openStatus?: 'opened' | 'unopened' | 'all';
  limit?: number;
  offset?: number;
  enabled?: boolean;
}

export function useLeadEmails(options: UseLeadEmailsOptions) {
  const {
    workspaceId,
    leadId,
    emailType,
    openStatus = 'all',
    limit = 50,
    offset = 0,
    enabled = true,
  } = options;

  return useQuery<LeadEmailsResponse>({
    queryKey: [
      'lead-emails',
      workspaceId,
      leadId,
      emailType,
      openStatus,
      limit,
      offset,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      // Use Message API which stores actual workflow emails
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());
      // Only get OUTBOUND messages (emails sent TO the lead)
      params.append('direction', 'OUTBOUND');

      const url = `${mainUrl.getLeadMessages(workspaceId, leadId)}?${params.toString()}`;
      const response = await request.get<{
        data: any[];
        total: number;
        limit: number;
        offset: number;
      }>(url);

      // Transform Message API response to match expected LeadEmailsResponse structure
      const messages = response.data.data || [];
      return {
        sentEmails: messages.map((msg: any) => ({
          id: msg.id,
          subject: msg.subject,
          htmlBody: msg.htmlBody,
          textBody: msg.textBody,
          recipientEmail: msg.toEmail,
          recipientName: msg.toName,
          sentAt: msg.sentAt || msg.createdAt,
          openCount: 0, // Message API doesn't track opens
          lastOpenedAt: null,
          deliveryStatus: 'sent',
          emailType: 'follow_up', // Default type
          workflow: {
            id: '',
            name: 'Email Sent',
          },
          workflowExecution: {
            id: '',
            status: 'completed',
          },
        })),
        totalCount: response.data.total || 0,
        limit: response.data.limit || limit,
        offset: response.data.offset || offset,
        hasMore:
          (response.data.offset || 0) + messages.length <
          (response.data.total || 0),
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: enabled && !!workspaceId && !!leadId,
  });
}
