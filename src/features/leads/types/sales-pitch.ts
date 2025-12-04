/**
 * Sales Pitch Types
 *
 * Frontend types for AI-generated sales intelligence
 */

export interface SalesPitch {
  summary: string;
  relevanceScore: number;
  talkingPoints: string[];
  commonGround: string[];
  painPoints: string[];
  valueProposition: string;
  conversationStarters: string[];
  competitorContext?: string;
  generatedAt: string;
  version: string;
}

export interface SalesPitchStatus {
  exists: boolean;
  generatedAt?: string;
}
