/**
 * Email Analytics Types
 *
 * TypeScript interfaces for MPP-proof email tracking system.
 * These types match the backend Prisma models and API responses.
 */

/**
 * Email tracking classification enum
 * Matches backend: EmailTrackingClassification
 */
export enum EmailTrackingClassification {
  BOT_PREFETCH = 'BOT_PREFETCH',
  GENUINE_OPEN = 'GENUINE_OPEN',
  AMBIGUOUS = 'AMBIGUOUS',
  DIRECT_OPEN = 'DIRECT_OPEN',
}

/**
 * Individual email tracking event
 * Matches backend: EmailTrackingEvent model
 */
export interface EmailTrackingEvent {
  id: string;
  sentEmailId: string;
  workspaceId: string;
  sentAt: string; // ISO timestamp
  openedAt: string; // ISO timestamp
  timeDeltaSeconds: number;
  clientIp: string;
  resolvedHostname: string | null;
  userAgent: string | null;
  isAppleProxy: boolean;
  classification: EmailTrackingClassification;
  metadata: Record<string, any> | null;
  createdAt: string; // ISO timestamp
}

/**
 * Enhanced SentEmail with MPP-aware tracking counters
 * Extends existing SentEmail interface with new fields
 */
export interface SentEmailWithTracking {
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
  emailType: string;
  providerType: string;
  deliveryStatus: string;
  deliveryError: string | null;
  // Basic tracking (legacy)
  openCount: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  // MPP-aware tracking (new)
  genuineOpenCount: number;
  botPrefetchCount: number;
  ambiguousOpenCount: number;
  directOpenCount: number;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Email statistics response
 * Aggregate stats for a workspace
 */
export interface EmailStatsResponse {
  workspaceId: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalEmailsSent: number;
  totalOpens: number;
  totalGenuineOpens: number;
  totalBotPrefetches: number;
  totalAmbiguousOpens: number;
  totalDirectOpens: number;
  genuineOpenRate: number; // Percentage
  botPrefetchRate: number; // Percentage
  // Daily breakdown
  dailyStats: Array<{
    date: string;
    emailsSent: number;
    genuineOpens: number;
    botPrefetches: number;
    genuineOpenRate: number;
  }>;
}

/**
 * Tracking events list response
 */
export interface TrackingEventsResponse {
  events: EmailTrackingEvent[];
  total: number;
  sentEmail: {
    id: string;
    subject: string;
    recipientEmail: string;
    sentAt: string;
  };
}

/**
 * Classification badge variant
 * For UI styling
 */
export type ClassificationBadgeVariant =
  | 'genuine'
  | 'bot'
  | 'ambiguous'
  | 'direct';

/**
 * Get badge variant from classification
 */
export function getClassificationBadgeVariant(
  classification: EmailTrackingClassification
): ClassificationBadgeVariant {
  switch (classification) {
    case EmailTrackingClassification.GENUINE_OPEN:
      return 'genuine';
    case EmailTrackingClassification.BOT_PREFETCH:
      return 'bot';
    case EmailTrackingClassification.DIRECT_OPEN:
      return 'direct';
    case EmailTrackingClassification.AMBIGUOUS:
      return 'ambiguous';
    default:
      return 'ambiguous';
  }
}

/**
 * Get human-readable label for classification
 */
export function getClassificationLabel(
  classification: EmailTrackingClassification
): string {
  switch (classification) {
    case EmailTrackingClassification.GENUINE_OPEN:
      return 'Genuine Open';
    case EmailTrackingClassification.BOT_PREFETCH:
      return 'Bot Prefetch';
    case EmailTrackingClassification.DIRECT_OPEN:
      return 'Direct Open';
    case EmailTrackingClassification.AMBIGUOUS:
      return 'Ambiguous';
    default:
      return 'Unknown';
  }
}

/**
 * Get description for classification
 */
export function getClassificationDescription(
  classification: EmailTrackingClassification,
  timeDeltaSeconds: number
): string {
  switch (classification) {
    case EmailTrackingClassification.BOT_PREFETCH:
      return `Apple MPP automated prefetch (${timeDeltaSeconds}s after send)`;
    case EmailTrackingClassification.GENUINE_OPEN:
      return `Real user open via Apple Mail (${timeDeltaSeconds}s after send)`;
    case EmailTrackingClassification.DIRECT_OPEN:
      return `Direct open from user's IP (${timeDeltaSeconds}s after send)`;
    case EmailTrackingClassification.AMBIGUOUS:
      return `Uncertain classification (${timeDeltaSeconds}s after send)`;
    default:
      return 'Unknown classification';
  }
}
