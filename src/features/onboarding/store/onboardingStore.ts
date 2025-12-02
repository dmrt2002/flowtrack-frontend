import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StrategyId,
  Configuration,
  OAuthProvider,
  OAuthConnection,
  SimulationData,
  ConfigSchema,
} from '../types';
import type { FormField } from '../types/form-fields';

interface OnboardingState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  isOnboardingComplete: boolean;

  // Step 1: Strategy Selection (DEPRECATED - kept for backward compatibility)
  // Workflow is now auto-created on initialization
  selectedStrategy: {
    id: StrategyId | null;
    name: string | null;
    templateId: string | null;
    workflowId: string | null;
  };

  // Step 2: Form Builder
  formFields: FormField[];
  workflowId: string | null;
  workspaceId: string | null;
  formHeader: string | null;
  formHeaderRich: any | null;
  formDescription: string | null;
  formDescriptionRich: any | null;

  // Step 2.5: Integrations (Gmail + Scheduling)
  gmailConnected: boolean;
  gmailEmail: string | null;
  calendlyLink: string | null;
  schedulingType: 'CALENDLY' | 'GOOGLE_MEET' | null;

  // Step 3: Configuration
  configuration: Configuration;
  configurationId: string | null;
  configurationSchema: ConfigSchema | null;

  // Step 4: OAuth Connection
  oauthConnection: OAuthConnection;

  // Step 5: Simulation
  simulationCompleted: boolean;
  simulationData: SimulationData | null;

  // Actions
  setCurrentStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  completeStep: (step: number) => void;
  setStrategy: (
    strategyId: StrategyId,
    name: string,
    templateId: string,
    workflowId?: string
  ) => void;
  setFormFields: (fields: FormField[]) => void;
  addFormField: (field: FormField) => void;
  updateFormField: (id: string, updates: Partial<FormField>) => void;
  deleteFormField: (id: string) => void;
  reorderFormFields: (fromIndex: number, toIndex: number) => void;
  setWorkflowId: (workflowId: string) => void;
  setWorkspaceId: (workspaceId: string) => void;
  setFormHeader: (header: string | null, rich?: any) => void;
  setFormDescription: (description: string | null, rich?: any) => void;
  setGmailConnection: (email: string) => void;
  setCalendlyLink: (link: string) => void;
  setSchedulingPreference: (type: 'CALENDLY' | 'GOOGLE_MEET') => void;
  setConfiguration: (config: Configuration, configId?: string) => void;
  setConfigurationSchema: (schema: ConfigSchema) => void;
  setOAuthConnection: (provider: OAuthProvider, email: string) => void;
  setSimulationData: (data: SimulationData) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      // Initial state
      currentStep: 1,
      completedSteps: [],
      isOnboardingComplete: false,

      selectedStrategy: {
        id: null,
        name: null,
        templateId: null,
        workflowId: null,
      },

      formFields: [],
      workflowId: null,
      workspaceId: null,
      formHeader: null,
      formHeaderRich: null,
      formDescription: null,
      formDescriptionRich: null,

      gmailConnected: false,
      gmailEmail: null,
      calendlyLink: null,
      schedulingType: null,

      configuration: {},
      configurationId: null,
      configurationSchema: null,

      oauthConnection: {
        provider: null,
        email: null,
        isConnected: false,
        connectedAt: null,
        permissions: [],
      },

      simulationCompleted: false,
      simulationData: null,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      completeStep: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
          currentStep: Math.min(step + 1, 4) as 1 | 2 | 3 | 4,
        })),

      setStrategy: (strategyId, name, templateId, workflowId) =>
        set({
          selectedStrategy: {
            id: strategyId,
            name,
            templateId,
            workflowId: workflowId || null,
          },
        }),

      setFormFields: (fields) => set({ formFields: fields }),

      addFormField: (field) =>
        set((state) => ({
          formFields: [...state.formFields, field],
        })),

      updateFormField: (id, updates) =>
        set((state) => ({
          formFields: state.formFields.map((field) =>
            field.id === id ? { ...field, ...updates } : field
          ),
        })),

      deleteFormField: (id) =>
        set((state) => ({
          formFields: state.formFields.filter((field) => field.id !== id),
        })),

      reorderFormFields: (fromIndex, toIndex) =>
        set((state) => {
          const newFields = [...state.formFields];
          const [removed] = newFields.splice(fromIndex, 1);
          newFields.splice(toIndex, 0, removed);
          // Update displayOrder
          return {
            formFields: newFields.map((field, index) => ({
              ...field,
              displayOrder: index,
            })),
          };
        }),

      setWorkflowId: (workflowId) => set({ workflowId }),

      setWorkspaceId: (workspaceId) => set({ workspaceId }),

      setFormHeader: (header, rich) =>
        set({ formHeader: header, formHeaderRich: rich || null }),

      setFormDescription: (description, rich) =>
        set({
          formDescription: description,
          formDescriptionRich: rich || null,
        }),

      setGmailConnection: (email) =>
        set({
          gmailConnected: true,
          gmailEmail: email,
        }),

      setCalendlyLink: (link) =>
        set({
          calendlyLink: link,
        }),

      setSchedulingPreference: (type) =>
        set({
          schedulingType: type,
        }),

      setConfiguration: (config, configId) =>
        set({
          configuration: config,
          configurationId: configId || null,
        }),

      setConfigurationSchema: (schema) =>
        set({
          configurationSchema: schema,
        }),

      setOAuthConnection: (provider, email) =>
        set({
          oauthConnection: {
            provider,
            email,
            isConnected: true,
            connectedAt: new Date().toISOString(),
            permissions: ['read', 'send', 'modify'],
          },
        }),

      setSimulationData: (data) =>
        set({
          simulationCompleted: true,
          simulationData: data,
        }),

      completeOnboarding: () =>
        set({
          isOnboardingComplete: true,
        }),

      resetOnboarding: () =>
        set({
          currentStep: 1,
          completedSteps: [],
          isOnboardingComplete: false,
          selectedStrategy: {
            id: null,
            name: null,
            templateId: null,
            workflowId: null,
          },
          formFields: [],
          workflowId: null,
          workspaceId: null,
          formHeader: null,
          formHeaderRich: null,
          formDescription: null,
          formDescriptionRich: null,
          gmailConnected: false,
          gmailEmail: null,
          calendlyLink: null,
          schedulingType: null,
          configuration: {},
          configurationId: null,
          configurationSchema: null,
          oauthConnection: {
            provider: null,
            email: null,
            isConnected: false,
            connectedAt: null,
            permissions: [],
          },
          simulationCompleted: false,
          simulationData: null,
        }),
    }),
    {
      name: 'flowtrack-onboarding',
      version: 4, // Incremented to clear cache (removed bookingUrl from configuration schema)
    }
  )
);
