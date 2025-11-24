/**
 * Onboarding feature types matching backend API responses
 */

// Strategy Types
export type StrategyId = 'gatekeeper' | 'nurturer' | 'closer';

export interface Strategy {
  id: StrategyId;
  name: string;
  description: string;
  tagline: string;
  icon: string;
  color: string;
  backgroundColor: string;
  hoverColor: string;
  templateId: string;
  benefits: string[];
  xRayPreview: string[];
}

// Configuration Types
export interface ConfigField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'condition';
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: Array<{ value: string; label: string }>;
  suffix?: string;
  variables?: string[];
  rows?: number;
  helpText?: string;
  conditionMetadata?: {
    availableFields: string[];
    operators: string[];
    defaultField?: string;
    defaultOperator?: string;
    defaultValue?: number;
    defaultCurrency?: 'USD' | 'INR';
  };
}

export interface ConfigSchema {
  strategyId: StrategyId;
  fields: ConfigField[];
}

export interface Configuration {
  [key: string]: string | number | boolean;
}

// OAuth Types
export type OAuthProvider = 'gmail' | 'outlook';

export interface OAuthConnection {
  provider: OAuthProvider;
  email: string;
  isConnected: boolean;
  connectedAt: string | null;
  permissions: string[];
}

// Simulation Types
export interface SimulationLead {
  id: string;
  name: string;
  email: string;
  source: string;
  timestamp: string;
  budget?: number; // Only for Gatekeeper
  company?: string; // For Nurturer/Closer
}

export interface SimulationAction {
  leadId: string;
  action: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

export interface SimulationMetrics {
  leadsProcessed: number;
  emailsSent: number;
  timeSaved: number; // minutes
  estimatedConversions: number;
}

export interface StrategyLogicStep {
  id: string;
  label: string;
  type: 'trigger' | 'delay' | 'condition' | 'action';
  delayDays?: number;
  emailNumber?: number;
}

export interface StrategyTestLead {
  name: string;
  email: string;
  budget?: number; // Only for Gatekeeper
  company?: string; // For Nurturer/Closer
}

export interface SimulationData {
  sampleLeads: SimulationLead[];
  actionsPerformed: SimulationAction[];
  metrics: SimulationMetrics;
  logicSteps?: StrategyLogicStep[];
  testLeads?: StrategyTestLead[];
  strategyId?: string;
}

// Workflow Types
export interface WorkflowStep {
  order: number;
  action: string;
  trigger: string;
  status?: 'pending' | 'running' | 'complete';
}

export interface Workflow {
  id: string;
  strategyId: StrategyId;
  configurationId: string;
  status: 'draft' | 'active' | 'paused';
  steps: WorkflowStep[];
  createdAt: string;
  activatedAt?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Step 1 Response
export interface StrategyResponse {
  workflowId: string;
  strategyId: StrategyId;
  strategyName: string;
  templateId: string;
  configurationSchema: ConfigSchema;
}

// Step 2 Response
export interface ConfigurationResponse {
  configurationId: string;
  configuration: Configuration;
  workflowPreview: {
    steps: WorkflowStep[];
  };
}

// Step 3 Response
export interface OAuthCompleteResponse {
  provider: OAuthProvider;
  email: string;
  connectedAt: string;
  permissions: string[];
}

// Step 4 Responses
export interface SimulationResponse {
  simulationData: SimulationData;
}

export interface ActivateWorkflowResponse {
  workflowId: string;
  status: 'active';
  activatedAt: string;
}

// Onboarding Status Response
export interface OnboardingStatusResponse {
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  isComplete: boolean;
  userAuthProvider?: 'clerk' | 'local';
  signedUpWithGoogle?: boolean;
  gmailConnected?: boolean;
  gmailEmail?: string | null;
  selectedStrategy?: {
    id: StrategyId;
    name: string;
  };
  configuration?: Configuration;
  oauthConnection?: OAuthConnection;
}
