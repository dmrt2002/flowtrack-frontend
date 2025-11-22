# Onboarding Technical Flow Specification

**Document Version**: 1.0
**Last Updated**: 2025-11-22
**Purpose**: Technical implementation guide for frontend onboarding flow
**Target Audience**: Frontend developers implementing the 10-minute automation setup

---

## Table of Contents

1. [Flow Overview](#flow-overview)
2. [State Management Architecture](#state-management-architecture)
3. [Route Definitions](#route-definitions)
4. [Screen Flow & Transitions](#screen-flow--transitions)
5. [API Integration Points](#api-integration-points)
6. [Data Models & TypeScript Interfaces](#data-models--typescript-interfaces)
7. [Component Hierarchy](#component-hierarchy)
8. [Error Handling & Edge Cases](#error-handling--edge-cases)
9. [Validation Rules](#validation-rules)
10. [Analytics Events](#analytics-events)

---

## 1. Flow Overview

### High-Level Journey

```
POST-LOGIN ONBOARDING FLOW (Linear, 4 Steps)

┌─────────────────┐
│   User Logs In  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 1: Strategy Selection                              │
│ Route: /onboarding/strategy                             │
│ Purpose: Choose automation template (3 options)         │
│ Exit Condition: strategyId selected                     │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 2: Mad Libs Configuration                          │
│ Route: /onboarding/configure                            │
│ Purpose: Fill in template parameters                    │
│ Exit Condition: All required fields completed           │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 3: OAuth Connection                                │
│ Route: /onboarding/connect                              │
│ Purpose: Connect Gmail/Outlook account                  │
│ Exit Condition: OAuth flow completed + token stored     │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ STEP 4: Simulation Overlay                              │
│ Route: /onboarding/simulate                             │
│ Purpose: Show automation preview with sample data       │
│ Exit Condition: User clicks "Activate Automation"       │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│ Dashboard (Automation Active)                           │
│ Route: /dashboard                                       │
│ Purpose: Main command center with live metrics          │
└─────────────────────────────────────────────────────────┘
```

### Flow Characteristics

- **Linear Progression**: Users cannot skip steps (1 → 2 → 3 → 4 → Dashboard)
- **State Persistence**: Progress saved after each step completion
- **Resume Capability**: Users can close browser and resume from last completed step
- **Validation Gates**: Cannot proceed to next step without completing current step
- **No Back Navigation**: Once step is completed, user cannot go back (simplicity > flexibility)
- **Estimated Duration**: 8-12 minutes for complete onboarding

---

## 2. State Management Architecture

### Zustand Store: `useOnboardingStore`

**File Location**: `/src/store/onboardingStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  // Step tracking
  currentStep: 1 | 2 | 3 | 4;
  completedSteps: number[];
  isOnboardingComplete: boolean;

  // Step 1: Strategy Selection
  selectedStrategy: {
    id: 'inbound-leads' | 'outbound-sales' | 'customer-nurture' | null;
    name: string | null;
    templateId: string | null;
  };

  // Step 2: Configuration
  configuration: {
    [key: string]: string | number | boolean;
  };

  // Step 3: OAuth Connection
  oauthConnection: {
    provider: 'gmail' | 'outlook' | null;
    email: string | null;
    isConnected: boolean;
    connectedAt: string | null;
  };

  // Step 4: Simulation
  simulationCompleted: boolean;
  simulationData: {
    sampleLeads: number;
    estimatedTimesSaved: number;
    projectedConversions: number;
  } | null;

  // Actions
  setCurrentStep: (step: 1 | 2 | 3 | 4) => void;
  completeStep: (step: number) => void;
  setStrategy: (strategyId: string, name: string, templateId: string) => void;
  setConfiguration: (config: Record<string, any>) => void;
  setOAuthConnection: (provider: 'gmail' | 'outlook', email: string) => void;
  setSimulationData: (data: any) => void;
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
      },

      configuration: {},

      oauthConnection: {
        provider: null,
        email: null,
        isConnected: false,
        connectedAt: null,
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

      setStrategy: (strategyId, name, templateId) =>
        set({
          selectedStrategy: {
            id: strategyId as
              | 'inbound-leads'
              | 'outbound-sales'
              | 'customer-nurture',
            name,
            templateId,
          },
        }),

      setConfiguration: (config) =>
        set({
          configuration: config,
        }),

      setOAuthConnection: (provider, email) =>
        set({
          oauthConnection: {
            provider,
            email,
            isConnected: true,
            connectedAt: new Date().toISOString(),
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
          selectedStrategy: { id: null, name: null, templateId: null },
          configuration: {},
          oauthConnection: {
            provider: null,
            email: null,
            isConnected: false,
            connectedAt: null,
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
```

### State Persistence Strategy

- **Storage**: LocalStorage via Zustand persist middleware
- **Key**: `flowtrack-onboarding`
- **Version**: 1 (for future migration capability)
- **Clear Trigger**: User completes onboarding OR manually resets

### Step Completion Logic

```typescript
// Example: Completing Step 1 (Strategy Selection)
const handleStrategySelect = async (strategyId: string) => {
  const { setStrategy, completeStep } = useOnboardingStore.getState();

  // 1. Set strategy in store
  setStrategy(strategyId, strategyName, templateId);

  // 2. Save to backend
  await api.post('/api/v1/onboarding/step-1', {
    strategyId,
    templateId,
  });

  // 3. Mark step as complete (auto-advances to step 2)
  completeStep(1);

  // 4. Navigate to next step
  router.push('/onboarding/configure');
};
```

---

## 3. Route Definitions

### Next.js App Router Structure

```
/src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── layout.tsx                    # Auth layout (no sidebar)
│
├── (dashboard)/
│   ├── onboarding/
│   │   ├── strategy/
│   │   │   └── page.tsx              # Step 1: Strategy Selection
│   │   ├── configure/
│   │   │   └── page.tsx              # Step 2: Configuration
│   │   ├── connect/
│   │   │   └── page.tsx              # Step 3: OAuth
│   │   ├── simulate/
│   │   │   └── page.tsx              # Step 4: Simulation
│   │   └── layout.tsx                # Onboarding layout (progress bar)
│   │
│   ├── dashboard/
│   │   └── page.tsx                  # Main dashboard
│   ├── pipelines/
│   │   └── page.tsx                  # Kanban board
│   ├── workflows/
│   │   ├── page.tsx                  # Workflow list
│   │   └── [id]/
│   │       └── page.tsx              # Workflow editor
│   ├── forms/
│   │   ├── page.tsx                  # Form list
│   │   └── [id]/
│   │       └── page.tsx              # Form builder
│   └── layout.tsx                    # Dashboard layout (sidebar)
│
└── layout.tsx                        # Root layout
```

### Route Guards & Redirects

**File**: `/src/middleware.ts`

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check authentication
  const accessToken = request.cookies.get('accessToken')?.value;

  // Public routes (no auth required)
  const publicRoutes = [
    '/login',
    '/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
  ];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If already logged in, redirect to appropriate page
    if (accessToken) {
      return NextResponse.redirect(
        new URL('/onboarding/strategy', request.url)
      );
    }
    return NextResponse.next();
  }

  // Protected routes (auth required)
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check onboarding status
  const onboardingComplete =
    request.cookies.get('onboarding_complete')?.value === 'true';

  // If onboarding not complete, redirect to onboarding
  if (!onboardingComplete && !pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding/strategy', request.url));
  }

  // If onboarding complete, redirect away from onboarding
  if (onboardingComplete && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Post-Login Redirect Logic

**File**: `/src/features/auth/hooks/useLoginMutation.ts`

```typescript
onSuccess: (data) => {
  const { setUser, setTokens } = useCurrentUser.getState();
  const { isOnboardingComplete } = useOnboardingStore.getState();

  // Store user and tokens
  setUser(data.user);
  setTokens(data.tokens);

  // Set cookie for middleware
  document.cookie = `onboarding_complete=${data.user.hasCompletedOnboarding}; path=/`;

  // Redirect based on onboarding status
  if (data.user.hasCompletedOnboarding) {
    router.push('/dashboard');
  } else {
    router.push('/onboarding/strategy');
  }
};
```

---

## 4. Screen Flow & Transitions

### Step 1: Strategy Selection

**Route**: `/onboarding/strategy`
**Component**: `StrategySelectionScreen`
**File**: `/src/features/onboarding/screens/StrategySelectionScreen.tsx`

#### Entry Conditions

- User is authenticated
- User has NOT completed onboarding
- OR user's `currentStep` is 1

#### Screen State

```typescript
interface StrategySelectionState {
  selectedStrategyId: string | null;
  isExpanded: string | null; // Which card is expanded
  isLoading: boolean;
  error: string | null;
}
```

#### User Interactions

1. **Hover Card**: Card scales, border glows (no state change)
2. **Click Card**:
   - Collapse all other cards
   - Expand clicked card to show full details
   - Show "Continue" button
3. **Click "Continue"**:
   - Validate: `selectedStrategyId !== null`
   - Call API: `POST /api/v1/onboarding/strategy`
   - Update store: `setStrategy()`
   - Complete step: `completeStep(1)`
   - Navigate: `router.push('/onboarding/configure')`

#### API Call

```typescript
// POST /api/v1/onboarding/strategy
{
  strategyId: "inbound-leads",
  templateId: "tmpl_inbound_001"
}

// Response
{
  success: true,
  data: {
    strategyId: "inbound-leads",
    strategyName: "Inbound Lead Automation",
    templateId: "tmpl_inbound_001",
    configurationSchema: {
      fields: [
        { id: "leadSource", type: "text", label: "Lead Source", required: true },
        { id: "responseTime", type: "number", label: "Response Time (minutes)", required: true },
        // ... more fields
      ]
    }
  }
}
```

#### Exit Conditions

- `selectedStrategy.id !== null`
- API call successful
- Step 1 marked complete
- Navigate to `/onboarding/configure`

---

### Step 2: Mad Libs Configuration

**Route**: `/onboarding/configure`
**Component**: `ConfigurationScreen`
**File**: `/src/features/onboarding/screens/ConfigurationScreen.tsx`

#### Entry Conditions

- Step 1 completed (`completedSteps.includes(1)`)
- `selectedStrategy.id !== null`
- Configuration schema loaded from Step 1 API response

#### Screen State

```typescript
interface ConfigurationState {
  formData: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  validationState: Record<string, boolean>;
}
```

#### Dynamic Form Generation

Form fields are generated from the `configurationSchema` returned in Step 1:

```typescript
// Example schema from API
{
  fields: [
    {
      id: 'leadSource',
      type: 'text',
      label: 'Where do your leads come from?',
      placeholder: 'e.g., Contact form, LinkedIn, Referrals',
      required: true,
      validation: { minLength: 3, maxLength: 100 },
    },
    {
      id: 'responseTime',
      type: 'number',
      label: 'How quickly should we respond?',
      placeholder: '5',
      suffix: 'minutes',
      required: true,
      validation: { min: 1, max: 1440 },
    },
    {
      id: 'emailTemplate',
      type: 'textarea',
      label: 'What should the first email say?',
      placeholder: 'Hi {firstName}, thanks for reaching out...',
      required: true,
      rows: 5,
      variables: ['{firstName}', '{companyName}', '{leadSource}'],
    },
    {
      id: 'crmIntegration',
      type: 'select',
      label: 'Which CRM do you use?',
      options: [
        { value: 'none', label: 'No CRM yet' },
        { value: 'hubspot', label: 'HubSpot' },
        { value: 'salesforce', label: 'Salesforce' },
        { value: 'pipedrive', label: 'Pipedrive' },
      ],
      required: false,
    },
  ];
}
```

#### Field Rendering Map

```typescript
const renderField = (field: ConfigField) => {
  switch (field.type) {
    case 'text':
      return <TextInput field={field} />;
    case 'number':
      return <NumberInput field={field} />;
    case 'textarea':
      return <TextareaInput field={field} />;
    case 'select':
      return <SelectInput field={field} />;
    default:
      return null;
  }
};
```

#### User Interactions

1. **Fill Form Fields**: Real-time validation on blur
2. **Click "Continue"**:
   - Validate all required fields
   - Show inline errors if validation fails
   - Call API: `POST /api/v1/onboarding/configure`
   - Update store: `setConfiguration()`
   - Complete step: `completeStep(2)`
   - Navigate: `router.push('/onboarding/connect')`

#### API Call

```typescript
// POST /api/v1/onboarding/configure
{
  strategyId: "inbound-leads",
  configuration: {
    leadSource: "Contact form",
    responseTime: 5,
    emailTemplate: "Hi {firstName}, thanks for reaching out...",
    crmIntegration: "hubspot"
  }
}

// Response
{
  success: true,
  data: {
    configurationId: "conf_abc123",
    workflowPreview: {
      steps: [
        { order: 1, action: "Monitor contact form", trigger: "New submission" },
        { order: 2, action: "Wait 5 minutes", trigger: "Delay" },
        { order: 3, action: "Send email", trigger: "Template: Hi {firstName}..." },
        { order: 4, action: "Add to HubSpot", trigger: "CRM sync" }
      ]
    }
  }
}
```

#### Exit Conditions

- All required fields valid
- API call successful
- Step 2 marked complete
- Navigate to `/onboarding/connect`

---

### Step 3: OAuth Connection

**Route**: `/onboarding/connect`
**Component**: `OAuthConnectionScreen`
**File**: `/src/features/onboarding/screens/OAuthConnectionScreen.tsx`

#### Entry Conditions

- Step 2 completed (`completedSteps.includes(2)`)
- `configuration` object populated in store

#### Screen State

```typescript
interface OAuthConnectionState {
  selectedProvider: 'gmail' | 'outlook' | null;
  isConnecting: boolean;
  connectionError: string | null;
  connectionSuccess: boolean;
}
```

#### OAuth Flow Architecture

```
Frontend                    Backend                     Google/Microsoft
   │                           │                              │
   │  Click "Connect Gmail"    │                              │
   ├──────────────────────────►│                              │
   │                           │                              │
   │  GET /auth/oauth/gmail    │                              │
   │                           ├─────────────────────────────►│
   │                           │  Redirect to consent screen  │
   │◄──────────────────────────┤                              │
   │                           │                              │
   │  User grants permission   │                              │
   ├──────────────────────────────────────────────────────────►│
   │                           │                              │
   │                           │  Authorization code callback │
   │                           │◄─────────────────────────────┤
   │                           │                              │
   │                           │  Exchange code for tokens    │
   │                           ├─────────────────────────────►│
   │                           │◄─────────────────────────────┤
   │                           │  Access + Refresh tokens     │
   │                           │                              │
   │  Redirect to /onboarding/ │                              │
   │  connect?success=true     │                              │
   │◄──────────────────────────┤                              │
   │                           │                              │
```

#### User Interactions

1. **Click "Connect Gmail"**:

   ```typescript
   const handleConnectGmail = () => {
     // Store current state
     sessionStorage.setItem('oauth_return_url', '/onboarding/connect');

     // Redirect to OAuth endpoint (opens consent screen)
     window.location.href = `${API_URL}/auth/oauth/gmail?redirect=${encodeURIComponent(window.location.origin + '/onboarding/connect')}`;
   };
   ```

2. **OAuth Callback Handling**:

   ```typescript
   useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const success = params.get('success');
     const provider = params.get('provider');
     const email = params.get('email');
     const error = params.get('error');

     if (success === 'true' && provider && email) {
       // Store connection info
       setOAuthConnection(provider as 'gmail' | 'outlook', email);

       // Complete step
       completeStep(3);

       // Show success message
       toast.success(`Successfully connected ${email}`);

       // Wait 1.5s then navigate
       setTimeout(() => {
         router.push('/onboarding/simulate');
       }, 1500);
     }

     if (error) {
       setConnectionError(decodeURIComponent(error));
     }
   }, []);
   ```

3. **Click "Connect Outlook"**: Same flow, different endpoint

#### API Endpoints

```typescript
// GET /api/v1/auth/oauth/gmail
// No body, triggers redirect to Google consent screen
// Returns 302 redirect to Google OAuth

// GET /api/v1/auth/oauth/gmail/callback (Backend only)
// Handles authorization code exchange
// Redirects back to frontend with success params

// GET /api/v1/auth/oauth/outlook
// Same flow for Microsoft

// POST /api/v1/onboarding/oauth-complete (Called after redirect)
{
  provider: "gmail",
  email: "user@gmail.com"
}

// Response
{
  success: true,
  data: {
    provider: "gmail",
    email: "user@gmail.com",
    connectedAt: "2025-11-22T10:30:00Z",
    permissions: ["read", "send", "modify"]
  }
}
```

#### Exit Conditions

- OAuth flow completed successfully
- `oauthConnection.isConnected === true`
- Backend has stored OAuth tokens
- Step 3 marked complete
- Navigate to `/onboarding/simulate`

---

### Step 4: Simulation Overlay

**Route**: `/onboarding/simulate`
**Component**: `SimulationScreen`
**File**: `/src/features/onboarding/screens/SimulationScreen.tsx`

#### Entry Conditions

- Step 3 completed (`completedSteps.includes(3)`)
- `oauthConnection.isConnected === true`

#### Screen State

```typescript
interface SimulationState {
  simulationPhase: 'loading' | 'running' | 'complete';
  currentStep: number; // Which simulation step is active (1-4)
  simulationResults: {
    sampleLeads: Array<{
      name: string;
      email: string;
      source: string;
      timestamp: string;
    }>;
    actionsPerformed: Array<{
      leadId: string;
      action: string;
      status: 'success' | 'pending';
      timestamp: string;
    }>;
    metrics: {
      leadsProcessed: number;
      emailsSent: number;
      timeSaved: number; // minutes
      estimatedConversions: number;
    };
  } | null;
  isActivating: boolean;
}
```

#### Simulation Animation Sequence

The simulation runs automatically on page load:

```typescript
useEffect(() => {
  runSimulation();
}, []);

const runSimulation = async () => {
  setSimulationPhase('loading');

  // Step 1: Fetch sample data from backend
  const { data } = await api.post('/api/v1/onboarding/simulate', {
    strategyId: selectedStrategy.id,
    configurationId: configuration.id,
  });

  setSimulationResults(data.simulationData);
  setSimulationPhase('running');

  // Step 2: Animate through workflow steps (4 steps, 2s each)
  for (let i = 1; i <= 4; i++) {
    await sleep(2000);
    setCurrentStep(i);
  }

  // Step 3: Show final results
  await sleep(1000);
  setSimulationPhase('complete');

  // Save simulation data
  setSimulationData(data.simulationData);
};
```

#### Visual Timeline

```
0s:  Loading screen
2s:  Step 1 - "Monitoring contact form..." (3 sample leads appear)
4s:  Step 2 - "Waiting 5 minutes..." (timer animation)
6s:  Step 3 - "Sending personalized emails..." (3 email sent checkmarks)
8s:  Step 4 - "Adding to HubSpot CRM..." (3 CRM sync checkmarks)
9s:  Results summary appears with metrics
     "Activate Automation" button enabled
```

#### User Interactions

1. **Watch Simulation**: Passive observation (no interaction during animation)

2. **Click "Activate Automation"**:

   ```typescript
   const handleActivate = async () => {
     setIsActivating(true);

     try {
       // Activate the automation workflow
       await api.post('/api/v1/workflows/activate', {
         strategyId: selectedStrategy.id,
         configurationId: configuration.id,
       });

       // Mark onboarding complete
       completeOnboarding();

       // Set cookie for middleware
       document.cookie = 'onboarding_complete=true; path=/';

       // Show success
       toast.success('Automation activated! Redirecting to dashboard...');

       // Navigate to dashboard
       setTimeout(() => {
         router.push('/dashboard');
       }, 1500);
     } catch (error) {
       toast.error('Failed to activate automation');
       setIsActivating(false);
     }
   };
   ```

3. **Click "Customize First"** (Optional):
   - Saves simulation as draft
   - Redirects to `/workflows/[id]` (workflow editor)
   - User can modify before activation

#### API Calls

```typescript
// POST /api/v1/onboarding/simulate
{
  strategyId: "inbound-leads",
  configurationId: "conf_abc123"
}

// Response
{
  success: true,
  data: {
    simulationData: {
      sampleLeads: [
        {
          id: "lead_1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          source: "Contact form",
          timestamp: "2025-11-22T10:25:00Z"
        },
        // ... 2 more
      ],
      actionsPerformed: [
        {
          leadId: "lead_1",
          action: "Email sent: 'Hi Sarah, thanks for reaching out...'",
          status: "success",
          timestamp: "2025-11-22T10:30:00Z"
        },
        // ... more actions
      ],
      metrics: {
        leadsProcessed: 3,
        emailsSent: 3,
        timeSaved: 45,  // minutes per week
        estimatedConversions: 1
      }
    }
  }
}

// POST /api/v1/workflows/activate
{
  strategyId: "inbound-leads",
  configurationId: "conf_abc123"
}

// Response
{
  success: true,
  data: {
    workflowId: "wf_xyz789",
    status: "active",
    activatedAt: "2025-11-22T10:35:00Z"
  }
}
```

#### Exit Conditions

- Simulation completed
- User clicked "Activate Automation"
- API call successful
- `isOnboardingComplete === true`
- Cookie set: `onboarding_complete=true`
- Navigate to `/dashboard`

---

## 5. API Integration Points

### Backend Endpoints Overview

```
POST   /api/v1/onboarding/strategy          # Step 1: Save strategy selection
POST   /api/v1/onboarding/configure         # Step 2: Save configuration
GET    /api/v1/auth/oauth/gmail             # Step 3: Start Gmail OAuth
GET    /api/v1/auth/oauth/outlook           # Step 3: Start Outlook OAuth
POST   /api/v1/onboarding/oauth-complete    # Step 3: Confirm OAuth connection
POST   /api/v1/onboarding/simulate          # Step 4: Generate simulation data
POST   /api/v1/workflows/activate           # Step 4: Activate automation
GET    /api/v1/onboarding/status            # Get current onboarding progress
PUT    /api/v1/users/me                     # Update user onboarding status
```

### React Query Hooks

**File**: `/src/features/onboarding/hooks/useOnboardingMutations.ts`

```typescript
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/request';

// Step 1: Strategy Selection
export const useStrategyMutation = () => {
  return useMutation({
    mutationFn: (data: { strategyId: string; templateId: string }) =>
      api.post('/onboarding/strategy', data),
    onSuccess: (response) => {
      // Store configuration schema for Step 2
      useOnboardingStore
        .getState()
        .setStrategy(
          response.data.strategyId,
          response.data.strategyName,
          response.data.templateId
        );
    },
  });
};

// Step 2: Configuration
export const useConfigurationMutation = () => {
  return useMutation({
    mutationFn: (data: {
      strategyId: string;
      configuration: Record<string, any>;
    }) => api.post('/onboarding/configure', data),
    onSuccess: (response) => {
      useOnboardingStore
        .getState()
        .setConfiguration(response.data.configuration);
    },
  });
};

// Step 3: OAuth Complete
export const useOAuthCompleteMutation = () => {
  return useMutation({
    mutationFn: (data: { provider: 'gmail' | 'outlook'; email: string }) =>
      api.post('/onboarding/oauth-complete', data),
  });
};

// Step 4: Generate Simulation
export const useSimulationMutation = () => {
  return useMutation({
    mutationFn: (data: { strategyId: string; configurationId: string }) =>
      api.post('/onboarding/simulate', data),
  });
};

// Step 4: Activate Workflow
export const useActivateWorkflowMutation = () => {
  return useMutation({
    mutationFn: (data: { strategyId: string; configurationId: string }) =>
      api.post('/workflows/activate', data),
    onSuccess: () => {
      // Mark onboarding complete
      useOnboardingStore.getState().completeOnboarding();

      // Update user record
      api.put('/users/me', { hasCompletedOnboarding: true });
    },
  });
};

// Get onboarding status (for resume capability)
export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: ['onboarding-status'],
    queryFn: () => api.get('/onboarding/status'),
    staleTime: 0, // Always fetch fresh
  });
};
```

### Error Handling Pattern

```typescript
const { mutate, isPending, error } = useStrategyMutation();

const handleSubmit = () => {
  mutate(
    { strategyId, templateId },
    {
      onSuccess: (response) => {
        // Update local state
        completeStep(1);
        router.push('/onboarding/configure');
      },
      onError: (error: any) => {
        // Show user-friendly error
        const message =
          error?.response?.data?.message || 'Something went wrong';
        toast.error(message);

        // Log for debugging
        console.error('Strategy selection failed:', error);
      },
    }
  );
};
```

---

## 6. Data Models & TypeScript Interfaces

### Core Types

**File**: `/src/features/onboarding/types/index.ts`

```typescript
// Strategy Types
export type StrategyId =
  | 'inbound-leads'
  | 'outbound-sales'
  | 'customer-nurture';

export interface Strategy {
  id: StrategyId;
  name: string;
  description: string;
  icon: string;
  color: string;
  templateId: string;
  estimatedSetupTime: number; // minutes
  features: string[];
}

// Configuration Types
export interface ConfigField {
  id: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox';
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
  connectedAt: string;
  permissions: string[];
}

// Simulation Types
export interface SimulationLead {
  id: string;
  name: string;
  email: string;
  source: string;
  timestamp: string;
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
  timeSaved: number;
  estimatedConversions: number;
}

export interface SimulationData {
  sampleLeads: SimulationLead[];
  actionsPerformed: SimulationAction[];
  metrics: SimulationMetrics;
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
```

### API Response Types

**File**: `/src/features/onboarding/types/api.ts`

```typescript
// Generic API response wrapper
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
    details?: Record<string, any>;
  };
}

// Step 1 Response
export interface StrategyResponse {
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
  selectedStrategy?: {
    id: StrategyId;
    name: string;
  };
  configuration?: Configuration;
  oauthConnection?: OAuthConnection;
}
```

---

## 7. Component Hierarchy

### Onboarding Layout

```
OnboardingLayout (/src/features/onboarding/layouts/OnboardingLayout.tsx)
├── ProgressBar (shows 1/4, 2/4, 3/4, 4/4)
├── Logo (top left)
├── HelpButton (top right - opens support chat)
└── {children} (current step component)
```

### Step 1: Strategy Selection

```
StrategySelectionScreen
├── Header
│   ├── Title: "Choose your automation strategy"
│   └── Subtitle: "Pick the template that matches your goals"
├── StrategyCardGrid
│   ├── StrategyCard (Inbound Leads)
│   │   ├── IconContainer
│   │   ├── Title
│   │   ├── Description
│   │   ├── FeatureList
│   │   └── SelectButton
│   ├── StrategyCard (Outbound Sales)
│   └── StrategyCard (Customer Nurture)
└── Footer
    └── ContinueButton (disabled until selection)
```

### Step 2: Configuration

```
ConfigurationScreen
├── Header
│   ├── BackButton (disabled - no back navigation)
│   ├── Title: "Customize your automation"
│   └── StrategyBadge (shows selected strategy)
├── ConfigurationForm
│   ├── FormField (dynamic, based on schema)
│   │   ├── Label
│   │   ├── Input/Textarea/Select
│   │   ├── HelperText
│   │   └── ErrorMessage
│   ├── FormField
│   └── FormField
├── WorkflowPreview (optional, collapsed by default)
│   └── StepList (shows what will happen)
└── Footer
    └── ContinueButton (disabled until valid)
```

### Step 3: OAuth Connection

```
OAuthConnectionScreen
├── Header
│   ├── Title: "Connect your email"
│   └── Subtitle: "We need access to send emails on your behalf"
├── ProviderGrid
│   ├── ProviderCard (Gmail)
│   │   ├── ProviderLogo
│   │   ├── ProviderName
│   │   ├── PermissionsList
│   │   └── ConnectButton
│   └── ProviderCard (Outlook)
├── SecurityNotice
│   ├── LockIcon
│   └── Text: "Your credentials are encrypted and never stored"
└── ConnectionStatus (appears after OAuth callback)
    ├── SuccessIcon
    ├── ConnectedEmail
    └── ContinueButton
```

### Step 4: Simulation

```
SimulationScreen
├── SimulationOverlay (full screen, semi-transparent backdrop)
│   ├── AnimationContainer
│   │   ├── WorkflowStepVisualizer
│   │   │   ├── Step1: "Monitoring contact form..."
│   │   │   │   └── SampleLeadCards (3 cards animate in)
│   │   │   ├── Step2: "Waiting 5 minutes..."
│   │   │   │   └── TimerAnimation
│   │   │   ├── Step3: "Sending personalized emails..."
│   │   │   │   └── EmailSentCheckmarks (3 checkmarks)
│   │   │   └── Step4: "Adding to HubSpot CRM..."
│   │   │       └── CRMSyncCheckmarks (3 checkmarks)
│   │   └── ResultsSummary (appears after animation)
│   │       ├── MetricCard (Leads processed: 3)
│   │       ├── MetricCard (Emails sent: 3)
│   │       ├── MetricCard (Time saved: 45 min/week)
│   │       └── MetricCard (Est. conversions: 1)
│   └── Footer
│       ├── CustomizeButton (secondary)
│       └── ActivateButton (primary, glowing)
```

### Shared Components

```typescript
// Progress Bar
<ProgressBar
  currentStep={2}
  totalSteps={4}
  completedSteps={[1]}
/>

// Strategy Badge
<StrategyBadge
  strategyId="inbound-leads"
  strategyName="Inbound Lead Automation"
  color="#3B82F6"
/>

// Loading Spinner
<LoadingSpinner
  size="lg"
  message="Saving your configuration..."
/>

// Error Alert
<ErrorAlert
  message="Failed to connect email account"
  retry={handleRetry}
/>
```

---

## 8. Error Handling & Edge Cases

### Network Errors

```typescript
// Axios interceptor already handles 401/403
// Component-level handling for other errors

const handleApiError = (error: any) => {
  // Network error (backend down)
  if (!error.response) {
    toast.error('Unable to connect. Please check your internet connection.');
    return;
  }

  // 400 Bad Request (validation errors)
  if (error.response.status === 400) {
    const validationErrors = error.response.data?.errors || {};
    Object.keys(validationErrors).forEach((field) => {
      setFieldError(field, validationErrors[field]);
    });
    toast.error('Please fix the errors in the form');
    return;
  }

  // 409 Conflict (e.g., OAuth already connected)
  if (error.response.status === 409) {
    toast.error('This email account is already connected');
    return;
  }

  // 500 Server Error
  if (error.response.status >= 500) {
    toast.error('Server error. Please try again later.');
    return;
  }

  // Generic error
  const message = error.response.data?.message || 'Something went wrong';
  toast.error(message);
};
```

### OAuth Errors

```typescript
// Handling OAuth failures

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get('error');

  if (error) {
    const errorMessages: Record<string, string> = {
      access_denied:
        'You denied access. Please try again and grant permissions.',
      invalid_grant: 'OAuth token expired. Please try connecting again.',
      server_error: 'Provider error. Please try again later.',
    };

    const message = errorMessages[error] || 'Failed to connect email account';
    toast.error(message);

    // Clear error from URL
    window.history.replaceState({}, '', '/onboarding/connect');
  }
}, []);
```

### Session Timeout

```typescript
// If user takes too long (e.g., leaves tab open for hours)

useEffect(() => {
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const lastActivity = localStorage.getItem('last_activity');

  if (lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity);

    if (elapsed > SESSION_TIMEOUT) {
      toast.error('Your session has expired. Please log in again.');
      router.push('/login');
      return;
    }
  }

  // Update activity timestamp on interaction
  const updateActivity = () => {
    localStorage.setItem('last_activity', Date.now().toString());
  };

  window.addEventListener('click', updateActivity);
  window.addEventListener('keypress', updateActivity);

  return () => {
    window.removeEventListener('click', updateActivity);
    window.removeEventListener('keypress', updateActivity);
  };
}, []);
```

### Browser Back Button

```typescript
// Prevent users from navigating backward during onboarding

useEffect(() => {
  const handlePopState = (event: PopStateEvent) => {
    event.preventDefault();

    toast.info('Please complete the current step to continue');

    // Push current URL back onto history
    window.history.pushState(null, '', window.location.href);
  };

  // Push initial state
  window.history.pushState(null, '', window.location.href);

  window.addEventListener('popstate', handlePopState);

  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}, []);
```

### Incomplete Step Access

```typescript
// Prevent skipping steps via URL manipulation

useEffect(() => {
  const { completedSteps, currentStep } = useOnboardingStore.getState();
  const requiredStep = parseInt(
    pathname.split('/').pop()?.replace('step-', '') || '1'
  );

  // Check if user has completed previous steps
  const canAccessStep =
    completedSteps.includes(requiredStep - 1) || requiredStep === 1;

  if (!canAccessStep) {
    toast.error('Please complete previous steps first');
    router.push(`/onboarding/step-${currentStep}`);
  }
}, [pathname]);
```

### Duplicate Tab Warning

```typescript
// Warn if user opens onboarding in multiple tabs

useEffect(() => {
  const CHANNEL_NAME = 'flowtrack_onboarding';
  const channel = new BroadcastChannel(CHANNEL_NAME);

  // Announce presence
  channel.postMessage({ type: 'TAB_OPENED' });

  // Listen for other tabs
  channel.addEventListener('message', (event) => {
    if (event.data.type === 'TAB_OPENED') {
      toast.warning(
        'Onboarding is open in another tab. Please use only one tab.'
      );
    }
  });

  return () => {
    channel.close();
  };
}, []);
```

---

## 9. Validation Rules

### Step 1: Strategy Selection

```typescript
const validateStrategySelection = (strategyId: string | null): boolean => {
  if (!strategyId) {
    toast.error('Please select a strategy to continue');
    return false;
  }

  const validStrategies: StrategyId[] = [
    'inbound-leads',
    'outbound-sales',
    'customer-nurture',
  ];
  if (!validStrategies.includes(strategyId as StrategyId)) {
    toast.error('Invalid strategy selected');
    return false;
  }

  return true;
};
```

### Step 2: Configuration

```typescript
const validateConfiguration = (
  formData: Record<string, any>,
  schema: ConfigSchema
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  schema.fields.forEach((field) => {
    const value = formData[field.id];

    // Required field check
    if (field.required && !value) {
      errors[field.id] = `${field.label} is required`;
      return;
    }

    // Skip further validation if field is empty and not required
    if (!value && !field.required) return;

    // Type-specific validation
    if (field.type === 'text' || field.type === 'textarea') {
      const strValue = String(value);

      if (
        field.validation?.minLength &&
        strValue.length < field.validation.minLength
      ) {
        errors[field.id] =
          `Must be at least ${field.validation.minLength} characters`;
      }

      if (
        field.validation?.maxLength &&
        strValue.length > field.validation.maxLength
      ) {
        errors[field.id] =
          `Must be less than ${field.validation.maxLength} characters`;
      }

      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(strValue)) {
          errors[field.id] = `Invalid format`;
        }
      }
    }

    if (field.type === 'number') {
      const numValue = Number(value);

      if (isNaN(numValue)) {
        errors[field.id] = 'Must be a valid number';
        return;
      }

      if (
        field.validation?.min !== undefined &&
        numValue < field.validation.min
      ) {
        errors[field.id] = `Must be at least ${field.validation.min}`;
      }

      if (
        field.validation?.max !== undefined &&
        numValue > field.validation.max
      ) {
        errors[field.id] = `Must be less than ${field.validation.max}`;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Usage
const handleSubmit = () => {
  const { isValid, errors } = validateConfiguration(formData, configSchema);

  if (!isValid) {
    setFieldErrors(errors);
    toast.error('Please fix the errors in the form');
    return;
  }

  // Proceed with API call
  configurationMutation.mutate(formData);
};
```

### Step 3: OAuth Connection

```typescript
const validateOAuthConnection = (
  provider: OAuthProvider | null,
  email: string | null
): boolean => {
  if (!provider || !email) {
    toast.error('Please connect your email account to continue');
    return false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error('Invalid email address');
    return false;
  }

  // Validate provider matches email domain
  if (provider === 'gmail' && !email.endsWith('@gmail.com')) {
    toast.warning('Gmail provider selected but email is not @gmail.com');
  }

  if (
    provider === 'outlook' &&
    !email.endsWith('@outlook.com') &&
    !email.endsWith('@hotmail.com')
  ) {
    toast.warning(
      'Outlook provider selected but email domain may not be supported'
    );
  }

  return true;
};
```

### Step 4: Simulation

```typescript
// No user input validation needed (passive observation)
// Only validate workflow activation prerequisites

const validateWorkflowActivation = (): boolean => {
  const {
    selectedStrategy,
    configuration,
    oauthConnection,
    simulationCompleted,
  } = useOnboardingStore.getState();

  if (!selectedStrategy.id) {
    toast.error('Missing strategy selection');
    return false;
  }

  if (Object.keys(configuration).length === 0) {
    toast.error('Missing configuration');
    return false;
  }

  if (!oauthConnection.isConnected) {
    toast.error('Email account not connected');
    return false;
  }

  if (!simulationCompleted) {
    toast.error('Please wait for the simulation to complete');
    return false;
  }

  return true;
};
```

---

## 10. Analytics Events

### Event Tracking Implementation

**File**: `/src/lib/analytics.ts`

```typescript
// Simple analytics wrapper (can be adapted for Mixpanel, Amplitude, etc.)

export const trackEvent = (
  eventName: string,
  properties?: Record<string, any>
) => {
  // Development: Log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }

  // Production: Send to analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }

  // Also send to backend for server-side tracking
  fetch('/api/v1/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, properties }),
  }).catch(() => {
    // Fail silently (don't block user flow)
  });
};
```

### Events to Track

#### Onboarding Started

```typescript
// When: User lands on /onboarding/strategy (first time)
trackEvent('onboarding_started', {
  user_id: user.id,
  email: user.email,
  signup_date: user.createdAt,
  time_since_signup: Date.now() - new Date(user.createdAt).getTime(),
});
```

#### Step 1: Strategy Selection

```typescript
// When: User hovers over a strategy card
trackEvent('strategy_card_hovered', {
  strategy_id: 'inbound-leads',
});

// When: User clicks a strategy card
trackEvent('strategy_card_clicked', {
  strategy_id: 'inbound-leads',
  strategy_name: 'Inbound Lead Automation',
});

// When: User completes Step 1
trackEvent('onboarding_step_completed', {
  step: 1,
  step_name: 'strategy_selection',
  selected_strategy: 'inbound-leads',
  time_spent_seconds: 45,
});
```

#### Step 2: Configuration

```typescript
// When: User starts filling form
trackEvent('configuration_started', {
  strategy_id: 'inbound-leads',
});

// When: User completes Step 2
trackEvent('onboarding_step_completed', {
  step: 2,
  step_name: 'configuration',
  fields_filled: ['leadSource', 'responseTime', 'emailTemplate'],
  time_spent_seconds: 180,
});
```

#### Step 3: OAuth Connection

```typescript
// When: User clicks "Connect Gmail"
trackEvent('oauth_initiated', {
  provider: 'gmail',
  step: 3,
});

// When: OAuth fails
trackEvent('oauth_failed', {
  provider: 'gmail',
  error: 'access_denied',
});

// When: OAuth succeeds
trackEvent('oauth_completed', {
  provider: 'gmail',
  email: 'user@gmail.com',
});

// When: User completes Step 3
trackEvent('onboarding_step_completed', {
  step: 3,
  step_name: 'oauth_connection',
  provider: 'gmail',
  time_spent_seconds: 60,
});
```

#### Step 4: Simulation

```typescript
// When: Simulation starts
trackEvent('simulation_started', {
  strategy_id: 'inbound-leads',
});

// When: Simulation completes
trackEvent('simulation_completed', {
  strategy_id: 'inbound-leads',
  sample_leads: 3,
  estimated_time_saved: 45,
  duration_seconds: 9,
});

// When: User clicks "Activate Automation"
trackEvent('workflow_activation_initiated', {
  strategy_id: 'inbound-leads',
});

// When: Activation succeeds
trackEvent('workflow_activated', {
  workflow_id: 'wf_xyz789',
  strategy_id: 'inbound-leads',
});

// When: User completes Step 4
trackEvent('onboarding_step_completed', {
  step: 4,
  step_name: 'simulation',
  time_spent_seconds: 30,
});
```

#### Onboarding Complete

```typescript
// When: User lands on dashboard after activation
trackEvent('onboarding_completed', {
  total_time_seconds: 720, // 12 minutes
  selected_strategy: 'inbound-leads',
  oauth_provider: 'gmail',
  completion_date: new Date().toISOString(),
});
```

#### Error Events

```typescript
// When: Any API call fails
trackEvent('onboarding_error', {
  step: 2,
  error_type: 'api_error',
  error_message: 'Failed to save configuration',
  endpoint: '/api/v1/onboarding/configure',
});

// When: User abandons onboarding
trackEvent('onboarding_abandoned', {
  last_completed_step: 2,
  time_spent_seconds: 300,
  abandonment_reason: 'session_timeout', // or 'user_logout'
});
```

### Funnel Metrics

Track these key metrics in your analytics dashboard:

```typescript
// Conversion funnel
Step 1 Started → Step 1 Completed: X% conversion
Step 2 Started → Step 2 Completed: X% conversion
Step 3 Started → Step 3 Completed: X% conversion
Step 4 Started → Step 4 Completed: X% conversion
Overall: Started → Completed: X% conversion

// Time metrics
Average time per step
Median time to complete onboarding
95th percentile completion time

// Drop-off analysis
Which step has highest abandonment rate?
What errors correlate with abandonment?
Do certain strategies have higher completion rates?
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Create Zustand store: `useOnboardingStore`
- [ ] Set up route structure with layouts
- [ ] Implement middleware for route guards
- [ ] Create TypeScript interfaces and types
- [ ] Set up React Query mutations/queries
- [ ] Implement analytics tracking utility

### Phase 2: Step 1 - Strategy Selection (Week 2)

- [ ] Build `StrategySelectionScreen` component
- [ ] Create `StrategyCard` component with animations
- [ ] Implement hover/expansion interactions
- [ ] Connect to backend API endpoint
- [ ] Add validation and error handling
- [ ] Test responsive behavior

### Phase 3: Step 2 - Configuration (Week 2-3)

- [ ] Build `ConfigurationScreen` component
- [ ] Create dynamic form field renderer
- [ ] Implement field validation logic
- [ ] Add real-time validation feedback
- [ ] Connect to backend API endpoint
- [ ] Test with different strategy schemas

### Phase 4: Step 3 - OAuth Connection (Week 3)

- [ ] Build `OAuthConnectionScreen` component
- [ ] Implement OAuth redirect flow
- [ ] Handle OAuth callback parameters
- [ ] Add error handling for OAuth failures
- [ ] Test with both Gmail and Outlook
- [ ] Verify token storage in backend

### Phase 5: Step 4 - Simulation (Week 4)

- [ ] Build `SimulationScreen` component
- [ ] Implement animation sequence
- [ ] Create workflow step visualizer
- [ ] Add metrics summary display
- [ ] Connect activation API endpoint
- [ ] Test full onboarding flow end-to-end

### Phase 6: Polish & Testing (Week 5)

- [ ] Add loading states for all API calls
- [ ] Implement all error handling scenarios
- [ ] Test browser back button prevention
- [ ] Test session timeout handling
- [ ] Verify analytics events fire correctly
- [ ] Accessibility audit (keyboard navigation, screen readers)
- [ ] Mobile responsive testing
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

### Phase 7: Integration (Week 6)

- [ ] Connect to actual backend endpoints
- [ ] Test with real OAuth providers
- [ ] Verify database persistence
- [ ] Test resume capability (close/reopen browser)
- [ ] Load testing (simulate multiple concurrent users)
- [ ] Security audit (CSRF, XSS, data validation)

---

## Success Metrics

### Primary Goals

- **Completion Rate**: ≥75% of users who start onboarding complete all 4 steps
- **Time to Completion**: Median time ≤10 minutes
- **Activation Rate**: ≥90% of users who complete onboarding activate their automation

### Secondary Metrics

- **Drop-off Rate per Step**: ≤10% per step
- **OAuth Success Rate**: ≥95% (excluding user denials)
- **Error Rate**: ≤2% of API calls fail
- **Mobile Completion Rate**: ≥60% (mobile is harder, so lower threshold)

### User Satisfaction

- **NPS Score**: ≥50 (post-onboarding survey)
- **Support Tickets**: ≤5% of users need help during onboarding
- **Time to First Value**: ≤15 minutes from signup to first automation running

---

## Future Enhancements

### V1.1: Skip to Advanced

- Allow power users to skip Mad Libs and go straight to workflow editor
- Add "I'll configure this later" option

### V1.2: Multi-Strategy

- Allow users to set up multiple strategies in one session
- "Add another automation" button after completing first

### V1.3: Team Onboarding

- Support for team accounts with role-based setup
- Admin can configure automations, team members just connect their emails

### V1.4: AI-Assisted Configuration

- Use AI to pre-fill configuration based on user's industry/role
- Suggest template variations based on similar users

---

**End of Technical Flow Specification**

This document should be used alongside:

- `ONBOARDING_STRATEGY_SELECTION_UX.md` for Step 1 visual design
- `POST_LOGIN_UX_OVERVIEW.md` for overall journey context
- Backend API documentation for endpoint contracts
