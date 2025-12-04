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

export type EnrichmentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

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
  enrichmentData: EnrichmentData | null;
  enrichmentStatus: EnrichmentStatus | null;
  enrichedAt: string | null;
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

// Enrichment data types
export interface EnrichmentData {
  enrichedAt: string;
  enrichmentVersion: string;
  company?: CompanyEnrichment;
  person?: PersonEnrichment;
  email?: EmailEnrichment;
  intent?: IntentSignals;
  rawData?: {
    dns?: DnsRecords;
    website?: WebsiteMetadata;
    search?: SearchResults;
  };
}

export interface CompanyEnrichment {
  name: string;
  domain: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  headquarters?: string;
  founded?: string;
  website?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  techStack?: string[];
  techStackDetailed?: TechStackDetails;
  emailProvider?: string;
}

export interface TechStackDetails {
  crm: string[];
  analytics: string[];
  marketing: string[];
  chat: string[];
  cms: string[];
  ecommerce: string[];
  cdn: string[];
  hosting: string[];
  payment: string[];
  development: string[];
  other: string[];
}

export interface PersonEnrichment {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jobTitle?: string;
  seniority?: string;
  department?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  photoUrl?: string;
}

export interface EmailEnrichment {
  isValid: boolean;
  isDeliverable: boolean;
  isDisposable: boolean;
  isCatchAll: boolean;
  isRoleAccount: boolean;
  provider: string;
  smtpVerified: boolean;
  mxRecords: string[];
}

export interface IntentSignals {
  recentNews?: string[];
  fundingRounds?: string[];
  jobPostings?: number;
  techChanges?: string[];
  companyGrowth?: string;
}

export interface DnsRecords {
  mx: MxRecord[];
  txt: string[];
  spf?: string;
  dmarc?: string;
  dkim?: string;
}

export interface MxRecord {
  exchange: string;
  priority: number;
}

export interface WebsiteMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  jsonLd?: any;
  structuredData?: any;
}

export interface SearchResults {
  companyInfo?: any;
  linkedinProfile?: string;
  newsArticles?: string[];
}
