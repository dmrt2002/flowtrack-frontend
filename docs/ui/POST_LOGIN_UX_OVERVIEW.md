# FlowTrack Post-Login UX · Complete Journey Overview

## Document Purpose

This overview maps the entire post-login user experience, from first login through creating their first automation in under 10 minutes. Each screen is designed to align with FlowTrack's core philosophy: **"Template-First" deployment with "Glass Box" transparency**.

---

## User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                    10-MINUTE AUTOMATION JOURNEY              │
└─────────────────────────────────────────────────────────────┘

Login/Signup
     ↓
     ↓ [0-30 seconds]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 1: Strategy Selection          │  ← Choose template
│  Goal: Pick "The Gatekeeper"           │  ← 3 blueprint cards
│  Time: <30 sec                         │  ← Visual previews
└────────────────────────────────────────┘
     ↓
     ↓ [30s-3min]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 2: Mad Libs Configurator       │  ← Fill variables
│  Goal: Set budget threshold + link     │  ← Sentence-based form
│  Time: 1-2 min                         │  ← Live preview
└────────────────────────────────────────┘
     ↓
     ↓ [3-5min]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 3: OAuth Connection            │  ← Connect Gmail
│  Goal: Authorize email sending         │  ← Trust-building
│  Time: 1-2 min                         │  ← One-click OAuth
└────────────────────────────────────────┘
     ↓
     ↓ [5-7min]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 4: Simulation Overlay          │  ← Test automation
│  Goal: Verify logic with test lead     │  ← "Aha!" moment
│  Time: 1-2 min                         │  ← Visual path trace
└────────────────────────────────────────┘
     ↓
     ↓ [7-10min]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 5: Dashboard Command Center    │  ← Go Live + Monitor
│  Goal: Copy public form link           │  ← Metrics & status
│  Time: <1 min                          │  ← First-run guidance
└────────────────────────────────────────┘
     ↓
     ↓ [OPTIONAL POWER USER FLOWS]
     ↓
┌────────────────────────────────────────┐
│  SCREEN 6: Pipeline Kanban             │  ← Daily workspace
│  SCREEN 7: Workflow Editor             │  ← Advanced editing
│  SCREEN 8: Form Builder                │  ← Custom forms
└────────────────────────────────────────┘
```

---

## Screen-by-Screen Breakdown

### SCREEN 1: Strategy Selection

**Status**: ✅ Full spec created (`ONBOARDING_STRATEGY_SELECTION_UX.md`)

**Purpose**: Enable users to choose a proven automation blueprint

**Key Components**:

- 3 strategy cards (Gatekeeper, Nurturer, Closer)
- Visual "X-Ray" hover previews
- One-click selection with expansion animation
- Progress indicator (Step 1 of 4)

**Design Highlights**:

- Strategy-specific accent colors (Blue, Green, Purple)
- Glassmorphic preview overlays
- Elastic hover animations (1.05× scale)
- Benefit bullets with checkmark icons

**User Action**: Click card → Stores strategy choice → Transitions to Mad Libs

**Metrics**: Time to selection <30s, >90% completion rate

---

### SCREEN 2: Mad Libs Configurator

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Customize automation logic through guided sentence-based form

**Layout**:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Configure Your Gatekeeper                 Step 2 of 4  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │                                                    │ │
│  │  I want to accept leads with a minimum budget of  │ │
│  │  [ $2,000 ___ ] or more.                          │ │
│  │                                                    │ │
│  │  If they qualify, send them to my calendar at:    │ │
│  │  [ paste Calendly link ___________________ ]      │ │
│  │                                                    │ │
│  │  If they don't qualify, send them an email        │ │
│  │  signed by [ Your Name ___ ].                     │ │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────┐  ┌────────────────────────────────┐ │
│  │                │  │  LIVE PREVIEW                  │ │
│  │  [Back]        │  │  ─────────────────────────────  │ │
│  │                │  │  Subject: Thanks for reaching  │ │
│  │  [Save & Next] │  │  out!                          │ │
│  │                │  │                                │ │
│  └────────────────┘  │  Hi there,                     │ │
│                      │                                │ │
│                      │  Thanks for your interest.     │ │
│                      │  For projects starting at      │ │
│                      │  $2,000, please book a call:   │ │
│                      │  [Calendar Link]               │ │
│                      └────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Key Components**:

- **Sentence-based inputs**: Fill-in-the-blank style
- **Live preview sidebar**: Shows generated email text
- **Dynamic highlighting**: Typed values highlight in preview
- **Validation**: URL validation for Calendly, number validation for budget

**Input Fields**:

1. Budget threshold (Number input, $ prefix, min: $100, max: $100k)
2. Calendly/booking link (URL input, validates https://)
3. Signature name (Text input, defaults to user's first name)

**Interactions**:

- **Focus**: Active input underlines in brand color, others dim to 50% opacity
- **Type**: Real-time preview update (debounced 300ms)
- **Invalid**: Red underline + tooltip error message
- **Valid**: Green checkmark appears next to input

**Design System**:

- Max-width: 900px (split 50/50 for form + preview)
- Input underline: 3px solid, transitions 150ms
- Preview: Sticky positioned, follows scroll
- Typography: 20px for sentence text, 16px for inputs

**User Action**: Fill 3 inputs → Click "Save & Next" → Transitions to OAuth

**Validation Rules**:

- Budget: Must be numeric, ≥ $100
- Calendar Link: Must be valid HTTPS URL
- Name: Must be non-empty, max 50 chars

---

### SCREEN 3: OAuth Connection

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Secure email sending permission via Gmail/Outlook OAuth

**Layout**:

```
┌──────────────────────────────────────────┐
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │        🔌                          │ │
│  │   [FlowTrack] ←→ [Gmail]          │ │
│  │                                    │ │
│  │   Give FlowTrack a Voice          │ │
│  │                                    │ │
│  │   To ensure high deliverability,  │ │
│  │   automation emails are sent       │ │
│  │   directly from your account.     │ │
│  │                                    │ │
│  │   We only access emails sent      │ │
│  │   by FlowTrack.                   │ │
│  │                                    │ │
│  │   ┌──────────────────────────┐    │ │
│  │   │  Connect Gmail           │    │ │
│  │   └──────────────────────────┘    │ │
│  │                                    │ │
│  │   ┌──────────────────────────┐    │ │
│  │   │  Connect Outlook         │    │ │
│  │   └──────────────────────────┘    │ │
│  │                                    │ │
│  │   ✓ No Read Access to Inbox       │ │
│  │   ✓ Encrypted Tokens              │ │
│  │                                    │ │
│  └────────────────────────────────────┘ │
│                                          │
│              Step 3 of 4                │
└──────────────────────────────────────────┘
```

**Key Components**:

- **Modal overlay**: Blurred background, centered card
- **Visual metaphor**: Plug connecting FlowTrack ↔ Email provider
- **Trust indicators**: Permission pills explaining security
- **Dual OAuth options**: Gmail (red) and Outlook (blue)

**OAuth Flow**:

1. User clicks "Connect Gmail"
2. Popup opens to Google OAuth consent screen
3. User grants permissions (send email only, no read)
4. Popup closes, returns with auth token
5. Button transforms to "Connected as email@gmail.com"
6. Checkmark animation plays
7. Auto-advance to Simulation after 1.5s

**Design Highlights**:

- **Plug icon animation**: Sparks/electricity effect on successful connection
- **Permission pills**: Green checkmarks with tooltip explanations
- **Provider logos**: Official Gmail/Outlook logos, 32×32px
- **Success state**: Green background, white checkmark, email display

**Security Messaging**:

- "Read-only" emphasized
- "Encrypted" token storage
- "Revocable" at any time
- Link to privacy policy

**Error Handling**:

- OAuth canceled: "Connection Required to Continue" message
- OAuth failed: "Try Again" button with error details
- Network error: Retry mechanism with exponential backoff

**User Action**: Click OAuth button → Authorize → Auto-advance to Simulation

---

### SCREEN 4: Simulation Overlay

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Deliver "magic moment" by proving automation works before going live

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│   [Blurred Dashboard Background]                          │
│                                                            │
│   ┌──────────────────────────────────────────────────┐   │
│   │                                                  │   │
│   │         🧪  Test Your Automation                 │   │
│   │                                                  │   │
│   │   ┌──────────────┐ ┌────────────┐ ┌──────────┐ │   │
│   │   │ TEST LEAD    │ │ LOGIC PATH │ │ RESULT   │ │   │
│   │   ├──────────────┤ ├────────────┤ ├──────────┤ │   │
│   │   │ Name:        │ │            │ │          │ │   │
│   │   │ John Doe     │ │  [Form]    │ │ Email    │ │   │
│   │   │              │ │     ↓      │ │ Preview: │ │   │
│   │   │ Budget:      │ │  [Check    │ │          │ │   │
│   │   │ $500         │ │   Budget]  │ │ "Thanks  │ │   │
│   │   │              │ │     ↓      │ │ for your │ │   │
│   │   │ Email:       │ │  ❌ $500   │ │ interest │ │   │
│   │   │ john@doe.com │ │   < $2,000 │ │ but..."  │ │   │
│   │   │              │ │     ↓      │ │          │ │   │
│   │   │              │ │  [Reject]  │ │ [View    │ │   │
│   │   │              │ │     ↓      │ │  Full]   │ │   │
│   │   │              │ │  [Send     │ │          │ │   │
│   │   │              │ │   Email]   │ │          │ │   │
│   │   └──────────────┘ └────────────┘ └──────────┘ │   │
│   │                                                  │   │
│   │   ┌────────────────────────────────────────┐   │   │
│   │   │      ▶  Run Simulation                 │   │   │
│   │   └────────────────────────────────────────┘   │   │
│   │                                                  │   │
│   └──────────────────────────────────────────────────┘   │
│                                                            │
│                      Step 4 of 4                          │
└────────────────────────────────────────────────────────────┘
```

**Key Animation Sequence**:

1. **Pre-run state**: Pulsing "Run Simulation" button
2. **Click trigger**: Button locks, displays loading spinner
3. **Dot animation**: Glowing dot appears at [Form] node (500ms)
4. **Path travel**: Dot moves along connector to [Check Budget] (800ms)
5. **Condition check**: Node pulses, tooltip shows "❌ $500 < $2,000" (400ms)
6. **Branch selection**: Dot flows to [Reject] path (600ms)
7. **Email generation**: [Send Email] node glows, result panel populates (500ms)
8. **Success toast**: "✓ Logic Verified. Rejection Email Generated."
9. **Button morph**: "Run Simulation" → "✨ Go Live" (glowing state)

**Design System**:

- **Overlay**: rgba(0, 0, 0, 0.6) backdrop
- **Card**: White, 900px × 600px, 16px border-radius
- **Dot**: 12px diameter, strategy color, box-shadow glow
- **Path connectors**: 3px dashed lines, animate to solid during flow
- **Tooltips**: Floating above nodes, 14px text, 200ms fade-in

**Test Lead Variations**:

- Default: $500 budget (triggers rejection)
- Alternative: User can edit values before running
- Edge case: Empty fields show validation errors

**Result Display**:

- **Email subject line**: Bold, 16px
- **Email body preview**: First 100 characters
- **"View Full" button**: Opens modal with complete email
- **Edit option**: "This looks wrong? Edit workflow"

**User Action**: Run simulation → See automation work → Click "Go Live" → Dashboard

---

### SCREEN 5: Dashboard Command Center

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Post-onboarding home base with metrics and "Go Live" actions

**Layout**:

```
┌────────────────────────────────────────────────────────────┐
│  FlowTrack        [Search...]              [Profile ▼]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  🎉  Your Automation is Ready!                       │ │
│  │  ─────────────────────────────────────────────────── │ │
│  │  Share your public form to start capturing leads:   │ │
│  │                                                      │ │
│  │  flowtrack.com/p/alex-agency  [Copy Link]  [Share] │ │
│  │                                                      │ │
│  │  Or forward leads to: intake@alex.flowtrack.com     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ 0 LEADS    │  │ 0 CALLS    │  │ AUTOMATION │         │
│  │ CAPTURED   │  │ BOOKED     │  │ ✓ ACTIVE   │         │
│  │            │  │            │  │            │         │
│  │ Waiting... │  │ Waiting... │  │ The        │         │
│  │            │  │            │  │ Gatekeeper │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                            │
│  Recent Activity                                          │
│  ───────────────────────────────────────────────────────  │
│  No leads yet. Share your form link to get started!      │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  💡 Pro Tip: Test your form yourself                 │ │
│  │  Submit a test lead to see the automation in action │ │
│  │  [Test Form →]                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Components**:

- **Success banner**: Celebration message with public form link
- **Metric cards**: 3 key stats (Leads, Calls, Automation Status)
- **Activity feed**: Empty state with encouragement
- **Pro tip callout**: First-run guidance with test CTA
- **Global nav**: Sidebar with Pipeline, Automations, Forms, Settings

**Copy-to-Clipboard Interaction**:

1. User clicks "Copy Link"
2. Link copies to clipboard
3. Button text changes to "✓ Copied!" (green)
4. Toast notification: "Link copied to clipboard"
5. Button reverts to "Copy Link" after 3s

**Share Options**:

- **Email**: Pre-filled "mailto:" link
- **Twitter**: Tweet template with link
- **Slack**: Slack share button
- **QR Code**: Generate QR for form link

**Metric Cards Design**:

- **Size**: 260px × 180px
- **Background**: White with subtle border
- **Number**: 48px, bold, brand color
- **Label**: 14px, neutral-600
- **Icon**: Top-right corner, 24×24px
- **Hover**: Slight elevation (4px shadow)

**Empty State Guidance**:

- **Friendly tone**: "No leads yet" (not "0 leads" alone)
- **Next action CTA**: Clear direction ("Share your form")
- **Visual aid**: Dashed box for "first lead placeholder"

---

### SCREEN 6: Pipeline Kanban

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Daily workspace for visual lead management

**Layout**: Horizontal scrolling Kanban with 4-6 columns

**Columns** (default for Gatekeeper):

1. **New Leads** (gray) - Just submitted
2. **Qualified** (blue) - Passed budget check
3. **Meeting Booked** (green) - Calendly confirmed
4. **Won** (gold) - Deal closed
5. **Lost** (red) - Rejected or didn't convert

**Card Design**:

```
┌─────────────────────────┐
│ John Doe               │  ← Name
│ Acme Corp              │  ← Company (if provided)
│                        │
│ 💰 $5,000              │  ← Budget tag
│ 📅 Tomorrow 2pm        │  ← Meeting time (if booked)
│                        │
│ ⏱ 2 days in stage      │  ← Time tracking
└─────────────────────────┘
```

**Drag-and-Drop**:

- Smooth 60fps animation
- Drop zones highlight on hover
- Automation triggers on stage change
- Undo option for 5 seconds after move

**Automation Hooks**:

- Move to "Qualified" → Send Calendly link
- Move to "Meeting Booked" → Send reminder 1hr before
- Move to "Won" → Trigger contract email
- Move to "Lost" → Archive after 30 days

---

### SCREEN 7: Workflow Editor

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Visual node-based automation editor (React Flow canvas)

**Node Types**:

- **Trigger** (Circle): Form submit, stage change, time-based
- **Logic** (Diamond): Conditional branches (if/else)
- **Action** (Rectangle): Send email, create task, delay
- **End** (Rounded): Terminal node

**Properties Sidebar**: Click node → Edit subject, body, conditions

**Health Checks**:

- Disconnected nodes glow red
- "Heal Path" button auto-connects
- "Publish" disabled until valid

---

### SCREEN 8: Form Builder

**Status**: 📝 Summary below (detailed spec available on request)

**Purpose**: Create/edit public intake forms

**Field Types**:

- Text, Email, Number, Dropdown, Multi-select, Date

**Live Preview**: Right sidebar shows form as user sees it

**Public Link**: `flowtrack.com/p/[workspace-slug]`

---

## Design System Summary

**All screens share**:

- **Colors**: Indigo primary (#4F46E5), Neutral scale
- **Typography**: Inter font family
- **Spacing**: 8px base unit (xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px)
- **Borders**: 8px radius for cards, 16px for modals
- **Shadows**: Subtle elevation (0 4px 6px rgba(0,0,0,0.07))
- **Transitions**: 150ms ease for most interactions
- **Animations**: 60fps minimum, requestAnimationFrame

---

## Navigation Structure

```
Left Sidebar:
├─ 🏠 Command Center (Dashboard)
├─ 📊 Pipeline (Kanban)
├─ ⚙️ Automations (Workflow Editor)
├─ 📝 Forms (Form Builder)
└─ 🔧 Settings
    ├─ Profile
    ├─ Email Connections
    ├─ Billing
    └─ Team
```

---

## Implementation Priority

### Phase 1 (MVP - 10-Minute Flow):

1. ✅ Strategy Selection
2. ⏳ Mad Libs Configurator
3. ⏳ OAuth Connection
4. ⏳ Simulation Overlay
5. ⏳ Dashboard Command Center

### Phase 2 (Daily Use):

6. Pipeline Kanban
7. Form Builder (basic)

### Phase 3 (Power Users):

8. Workflow Editor (advanced)
9. Analytics Dashboard

---

## Next Steps

**Request Individual Specs**: Each screen summary above can be expanded into a full specification document matching the detail level of `ONBOARDING_STRATEGY_SELECTION_UX.md`.

**Example Request**: "Create the full spec for Screen 2: Mad Libs Configurator"

**Documents Available**:

- ✅ `LOGIN_UX.md` (existing)
- ✅ `ONBOARDING_STRATEGY_SELECTION_UX.md` (created)
- 📝 `ONBOARDING_MAD_LIBS_UX.md` (on request)
- 📝 `ONBOARDING_OAUTH_CONNECTION_UX.md` (on request)
- 📝 `ONBOARDING_SIMULATION_UX.md` (on request)
- 📝 `DASHBOARD_COMMAND_CENTER_UX.md` (on request)
- 📝 `PIPELINE_KANBAN_UX.md` (on request)
- 📝 `WORKFLOW_EDITOR_UX.md` (on request)
- 📝 `FORM_BUILDER_UX.md` (on request)

---

**End of Overview Document**

This overview provides the complete post-login user journey with enough detail for product planning and engineering scoping. Request individual screen specifications for implementation-ready design documentation.
