export interface WorkflowStatus {
  id: string;
  name: string;
  status: string;
  strategyName: string | null;
  publicFormUrl: string;
  activatedAt: string | null;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
}

export interface Trend {
  value: number;
  direction: 'up' | 'down' | 'neutral';
  label: string;
}

export interface DashboardMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  rejectedLeads: number;
  pendingLeads: number;
  avgTimeToReply: string;
  conversionRate: number;
  emailsSent: number;
  emailsOpened: number;
  emailOpenRate: number;
  executionCount: number;
  executionSuccessRate: number;
  trends: {
    totalLeads: Trend;
    qualifiedLeads: Trend;
    avgTimeToReply: Trend;
    conversionRate: Trend;
  };
}

export interface LeadSummary {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  status: string;
  source: string;
  score: number | null;
  tags: string[];
  createdAt: string;
  assignedTo: {
    id: string;
    name: string;
  } | null;
}

export interface LeadsList {
  data: LeadSummary[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface DashboardOverview {
  workflow: WorkflowStatus | null;
  metrics: DashboardMetrics;
  leads: LeadsList;
}
