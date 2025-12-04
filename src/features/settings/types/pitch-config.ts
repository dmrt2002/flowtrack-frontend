/**
 * Pitch Configuration Types (Frontend)
 *
 * TypeScript types for custom pitch configuration UI
 */

export enum PitchTone {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  FRIENDLY = 'friendly',
  FORMAL = 'formal',
  CONSULTATIVE = 'consultative',
}

export enum PitchLength {
  CONCISE = 'concise',
  MEDIUM = 'medium',
  DETAILED = 'detailed',
}

export enum PitchFocus {
  TECHNICAL = 'technical',
  ROI = 'roi',
  RELATIONSHIP = 'relationship',
  COMPETITIVE = 'competitive',
  PROBLEM_SOLVING = 'problem_solving',
}

export interface PitchQuickSettings {
  tone: PitchTone;
  length: PitchLength;
  focusAreas: PitchFocus[];
}

export interface PitchTemplate {
  id: string;
  name: string;
  description: string;
  category: 'default' | 'industry' | 'role' | 'custom';
  promptTemplate: string;
  quickSettings: PitchQuickSettings;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PitchAdvancedConfig {
  useCustomPrompt: boolean;
  customPromptTemplate: string;
  systemInstructions?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface PitchConfiguration {
  version: string;
  quickSettings: PitchQuickSettings;
  selectedTemplateId?: string;
  customTemplates: PitchTemplate[];
  advancedConfig: PitchAdvancedConfig;
  enabledFeatures?: {
    autoGenerate?: boolean;
    batchGeneration?: boolean;
    pdfExport?: boolean;
  };
}

// UI-specific helpers
export const TONE_LABELS: Record<PitchTone, string> = {
  [PitchTone.PROFESSIONAL]: 'Professional',
  [PitchTone.CASUAL]: 'Casual',
  [PitchTone.FRIENDLY]: 'Friendly',
  [PitchTone.FORMAL]: 'Formal',
  [PitchTone.CONSULTATIVE]: 'Consultative',
};

export const LENGTH_LABELS: Record<PitchLength, string> = {
  [PitchLength.CONCISE]: 'Concise',
  [PitchLength.MEDIUM]: 'Medium',
  [PitchLength.DETAILED]: 'Detailed',
};

export const FOCUS_LABELS: Record<PitchFocus, string> = {
  [PitchFocus.TECHNICAL]: 'Technical',
  [PitchFocus.ROI]: 'ROI & Business Value',
  [PitchFocus.RELATIONSHIP]: 'Relationship Building',
  [PitchFocus.COMPETITIVE]: 'Competitive Positioning',
  [PitchFocus.PROBLEM_SOLVING]: 'Problem Solving',
};

export const FOCUS_DESCRIPTIONS: Record<PitchFocus, string> = {
  [PitchFocus.TECHNICAL]: 'Emphasize tech stack compatibility and integration',
  [PitchFocus.ROI]: 'Focus on cost savings and measurable business outcomes',
  [PitchFocus.RELATIONSHIP]:
    'Build rapport through common ground and shared experiences',
  [PitchFocus.COMPETITIVE]:
    'Highlight competitive advantages and differentiators',
  [PitchFocus.PROBLEM_SOLVING]: 'Address specific pain points and solution fit',
};
