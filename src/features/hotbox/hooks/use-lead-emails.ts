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
      if (emailType) params.append('emailType', emailType);
      if (openStatus) params.append('openStatus', openStatus);
      params.append('limit', limit.toString());
      params.append('offset', offset.toString());

      const url = `${mainUrl.getLeadEmails(workspaceId, leadId)}?${params.toString()}`;
      const response = await request.get<{
        success: boolean;
        data: LeadEmailsResponse;
      }>(url);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: enabled && !!workspaceId && !!leadId,
  });
}
