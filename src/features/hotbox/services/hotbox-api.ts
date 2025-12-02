import request from '@/lib/request';
import { mainUrl } from '@/url/url';
import type {
  HotboxConversationsResponse,
  MessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '../types';

export const hotboxApi = {
  /**
   * Get conversations that need reply (have INBOUND messages)
   */
  async getConversationsNeedingReply(
    workspaceId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<HotboxConversationsResponse> {
    const url = mainUrl.getHotboxNeedsReply(workspaceId);
    const response = await request.get<HotboxConversationsResponse>(url, {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get conversations with only sent emails (no replies yet)
   */
  async getConversationsSentOnly(
    workspaceId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<HotboxConversationsResponse> {
    const url = mainUrl.getHotboxSent(workspaceId);
    const response = await request.get<HotboxConversationsResponse>(url, {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Get all messages for a specific lead (conversation thread)
   */
  async getLeadMessages(
    workspaceId: string,
    leadId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<MessagesResponse> {
    const url = mainUrl.getLeadMessages(workspaceId, leadId);
    const response = await request.get<MessagesResponse>(url, {
      params: { limit, offset },
    });
    return response.data;
  },

  /**
   * Send a message to a lead
   */
  async sendMessageToLead(
    workspaceId: string,
    leadId: string,
    data: SendMessageRequest
  ): Promise<SendMessageResponse> {
    const url = mainUrl.sendMessageToLead(workspaceId, leadId);
    const response = await request.post<SendMessageResponse>(url, data);
    return response.data;
  },
};
