/**
 * Frontend types for onboarding company scraper
 */

export interface EnrichedCompanyData {
  summary: string;
  industry: string;
  businessModel: BusinessModel;
  companySize: CompanySize;
  website: string;
  companyName: string;
  logo?: string;
  confidence: number;
  scrapedAt: Date | string;
  source: 'user_provided' | 'inferred' | 'fallback';
}

export type BusinessModel = 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'Unknown';

export type CompanySize =
  | 'Startup'
  | 'SMB'
  | 'Mid-Market'
  | 'Enterprise'
  | 'Unknown';

export interface ScrapeCompanyRequest {
  companyName?: string;
  website?: string;
  workflowId: string;
}

export interface ScrapeCompanyResponse {
  success: boolean;
  data?: EnrichedCompanyData;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface EnrichmentStatusResponse {
  exists: boolean;
  data?: EnrichedCompanyData;
}

export interface TypingAnimationConfig {
  charDelay: number;
  punctuationDelay: number;
  cursorBlinkRate: number;
  fadeInDuration: number;
}

export const DEFAULT_TYPING_CONFIG: TypingAnimationConfig = {
  charDelay: 30,
  punctuationDelay: 150,
  cursorBlinkRate: 530,
  fadeInDuration: 200,
};
