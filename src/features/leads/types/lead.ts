// Lead model types matching backend Prisma schema

export type LeadSource = 'FORM' | 'EMAIL_FORWARD' | 'API' | 'MANUAL' | 'IMPORT';

export type LeadStatus =
  | 'NEW'
  | 'EMAIL_SENT'
  | 'EMAIL_OPENED'
  | 'FOLLOW_UP_PENDING'
  | 'FOLLOW_UP_SENT'
  | 'RESPONDED'
  | 'BOOKED'
  | 'WON'
  | 'LOST'
  | 'DISQUALIFIED';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: 'New Lead',
  EMAIL_SENT: 'Email Sent',
  EMAIL_OPENED: 'Email Opened',
  FOLLOW_UP_PENDING: 'Follow-up Pending',
  FOLLOW_UP_SENT: 'Follow-up Sent',
  RESPONDED: 'Responded',
  BOOKED: 'Meeting Booked',
  WON: 'Won',
  LOST: 'Lost',
  DISQUALIFIED: 'Disqualified',
};

export type LeadView = 'table' | 'kanban';

export type MeetingStatus =
  | 'SCHEDULED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface Lead {
  id: string;
  workflowId: string;
  workspaceId: string;
  email: string;
  name: string | null;
  companyName: string | null;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource;
  sourceMetadata: Record<string, any> | null;
  score: number;
  tags: string[];
  meetingEventId: string | null;
  meetingStatus: MeetingStatus | null;
  lastActivityAt: string | null;
  lastEmailSentAt: string | null;
  lastEmailOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations (optional, included based on query)
  workflow?: {
    id: string;
    name: string;
  };
  fieldData?: LeadFieldData[];
  events?: LeadEvent[];
  bookings?: Booking[];
  _count?: {
    events: number;
    bookings: number;
  };
}

export interface LeadFieldData {
  id: string;
  leadId: string;
  fieldKey: string;
  fieldLabel: string;
  value: string;
  createdAt: string;
}

export type LeadEventType =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'ASSIGNED'
  | 'UNASSIGNED'
  | 'EMAIL_SENT'
  | 'EMAIL_OPENED'
  | 'EMAIL_CLICKED'
  | 'MEETING_SCHEDULED'
  | 'MEETING_COMPLETED'
  | 'NOTE_ADDED'
  | 'SCORE_UPDATED'
  | 'TAG_ADDED'
  | 'TAG_REMOVED'
  | 'WORKFLOW_EXECUTED';

export interface LeadEvent {
  id: string;
  leadId: string;
  workspaceId: string;
  eventType: LeadEventType;
  description: string;
  metadata: Record<string, any> | null;
  performedByUserId: string | null;
  createdAt: string;

  performedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Booking {
  id: string;
  leadId: string;
  eventId: string;
  status: MeetingStatus;
  scheduledAt: string;
  createdAt: string;
}

// API request/response types

export interface LeadFilters {
  search?: string;
  workflowId?: string;
  source?: LeadSource;
  status?: LeadStatus;
  statuses?: LeadStatus[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?:
    | 'createdAt'
    | 'name'
    | 'email'
    | 'score'
    | 'lastActivityAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface LeadsListParams extends LeadFilters {
  page?: number;
  limit?: number;
  view?: LeadView;
}

export interface LeadsTableResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  view: 'table';
}

export interface KanbanColumn {
  status: LeadStatus;
  leads: Lead[];
  count: number;
}

export interface LeadsKanbanResponse {
  columns: KanbanColumn[];
  view: 'kanban';
}

export type LeadsListResponse = LeadsTableResponse | LeadsKanbanResponse;

export interface LeadMetrics {
  totalLeads: number;
  totalLeadsChange: number; // Percentage change from previous period
  newToday: number;
  newTodayChange: number;
  qualified: number; // Leads with status "QUALIFIED" or similar
  qualifiedChange: number;
  averageScore: number;
  averageScoreChange: number;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  status?: LeadStatus;
  score?: number;
  tags?: string[];
  sourceMetadata?: Record<string, any>;
}

export interface UpdateLeadStatusDto {
  status: LeadStatus;
}

export interface BulkUpdateLeadsDto {
  leadIds: string[];
  status?: LeadStatus;
  tags?: string[];
  addTags?: string[]; // Tags to add (keeps existing)
  removeTags?: string[]; // Tags to remove
}

export interface LeadDetailResponse extends Lead {
  fieldData: LeadFieldData[];
  events: LeadEvent[];
  workflow: {
    id: string;
    name: string;
  };
  bookings?: Booking[];
}
