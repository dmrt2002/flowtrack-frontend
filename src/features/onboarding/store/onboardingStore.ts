import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  StrategyId,
  Configuration,
  OAuthProvider,
  OAuthConnection,
  SimulationData,
} from '../types';
import type { FormField } from '../types/form-fields';

interface OnboardingState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4 | 5;
  completedSteps: number[];
  isOnboardingComplete: boolean;

  // Step 1: Strategy Selection
  selectedStrategy: {
    id: StrategyId | null;
    name: string | null;
    templateId: string | null;
    workflowId: string | null;
  };

  // Step 2: Form Builder
  formFields: FormField[];
  workflowId: string | null;

  // Step 3: Configuration
  configuration: Configuration;
  configurationId: string | null;

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
  setConfiguration: (config: Configuration, configId?: string) => void;
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

      configuration: {},
      configurationId: null,

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
          currentStep: Math.min(step + 1, 5) as 1 | 2 | 3 | 4 | 5,
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

      setConfiguration: (config, configId) =>
        set({
          configuration: config,
          configurationId: configId || null,
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
          configuration: {},
          configurationId: null,
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
      version: 1,
    }
  )
);
