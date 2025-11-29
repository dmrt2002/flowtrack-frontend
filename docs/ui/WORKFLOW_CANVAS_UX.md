# Workflow Canvas UX Specification

> **Version**: 1.0
> **Last Updated**: 2025-11-29
> **Status**: Implemented

## Overview

The Workflow Canvas is a visual workflow editor that displays the automated email nurture sequence for leads. It provides a read-only React Flow diagram showing the complete workflow from lead submission to conversion or loss, with interactive nodes for editing email templates and delay durations.

## Design Philosophy

- **Visual-First**: Show the entire workflow at a glance using a node-based diagram
- **Contextual Editing**: Click on nodes to edit their configuration in focused modals
- **Real-Time Preview**: See email changes immediately with live preview
- **Guided Experience**: Fixed workflow structure eliminates complexity, focusing users on content over structure

---

## Layout & Structure

### Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│ DashboardLayout (Grey background #FAFAFA)                   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Header Section                                        │  │
│  │ ← [Back] Workflow Name                    [Activate] │  │
│  │ Status Badge • Saved Indicator                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Tab Navigation                                        │  │
│  │ [Canvas] [Form] [Analytics]                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Canvas Content Area (White card, 800px height)        │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ React Flow Canvas                               │  │  │
│  │  │                                                  │  │  │
│  │  │  [Trigger]                                       │  │  │
│  │  │      ↓                                           │  │  │
│  │  │  [Welcome Email] ← Click to edit                │  │  │
│  │  │      ↓                                           │  │  │
│  │  │  [Condition: Booked?]                           │  │  │
│  │  │    ↙        ↘                                    │  │  │
│  │  │ [Thank You] [Delay] ← Click to edit duration    │  │  │
│  │  │      ↓          ↓                                │  │  │
│  │  │   [End]    [Follow-up Email]                    │  │  │
│  │  │                 ↓                                │  │  │
│  │  │            [Delay Until Deadline]               │  │  │
│  │  │                 ↓                                │  │  │
│  │  │            [End: Lost]                          │  │  │
│  │  │                                                  │  │  │
│  │  │  [Minimap]  [Controls]  [Instructions]         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Tab Structure

1. **Canvas Tab** (NEW - Default)

   - Visual workflow diagram with editable nodes
   - Shows complete email nurture sequence
   - Icon: `Workflow` (from lucide-react)

2. **Form Tab** (Previously "Canvas")

   - Form builder for lead capture
   - Renamed from "Canvas" to avoid confusion
   - Icon: `FileText`

3. **Analytics Tab**
   - Workflow performance metrics
   - Unchanged from previous implementation
   - Icon: `BarChart3`

---

## Node Types & Specifications

### 1. Trigger Node

**Purpose**: Entry point when a lead submits the form

**Visual Design**:

- Background: Gradient from `indigo-50` to `indigo-100`
- Border: 2px solid `indigo-400`
- Icon: `Play` (filled, white on `indigo-500` circle)
- Shadow: `shadow-lg` with hover scale effect

**Content**:

```
TRIGGER
Lead Submitted
New lead enters the system via form submission
```

**Interactions**: Non-interactive (information only)

**Handle**: Bottom source handle (indigo)

---

### 2. Email Node

**Purpose**: Editable email templates (Welcome, Thank You, Follow-up)

**Visual Design**:

- Background: Gradient from `blue-50` to `blue-100`
- Border: 2px solid `blue-400`, hover to `blue-500`
- Icon: `Mail` (white on `blue-500` rounded rectangle)
- Edit icon: `Edit3` (appears on hover, top-right)
- Shadow: `shadow-lg` with hover scale and shadow-xl effect
- Cursor: `pointer`

**Content**:

```
EMAIL
[Email Name]
Subject: [Subject line - truncated]
[Body preview - 2 lines max]

CLICK TO EDIT TEMPLATE
```

**Interactions**:

- Click anywhere on node → Opens EmailNodeEditorModal
- Hover → Shows edit icon, increases scale (1.05), enhances shadow

**Handles**:

- Top target handle (blue)
- Bottom source handle (blue)

**Variants**:

- **Welcome Email**: `type="welcome"` - First email with booking link
- **Thank You Email**: `type="thankYou"` - Sent when booked
- **Follow-up Email**: `type="followUp"` - Sent after delay if not booked

---

### 3. Condition Node

**Purpose**: Decision point based on booking link click

**Visual Design**:

- Background: Gradient from `yellow-50` to `yellow-100`
- Border: 2px solid `yellow-400`
- Icon: `GitBranch` (white on `yellow-500` rounded rectangle)
- Shadow: `shadow-lg` with hover scale effect

**Content**:

```
CONDITION
Booking Link Clicked?
Check if lead clicked the booking link

YES (green)  •  NO (red)
```

**Interactions**: Non-interactive (information only)

**Handles**:

- Top target handle (yellow)
- Bottom-left source handle (id: "yes", green) at 30% position
- Bottom-right source handle (id: "no", red) at 70% position

**Branch Labels**:

- YES path: Green dot + "YES" text
- NO path: Red dot + "NO" text

---

### 4. Delay Node

**Purpose**: Editable time delays (Follow-up delay, Deadline)

**Visual Design**:

- Background: Gradient from `purple-50` to `purple-100`
- Border: 2px solid `purple-400`, hover to `purple-500`
- Icon: `Clock` (white on `purple-500` rounded rectangle)
- Edit icon: `Edit3` (appears on hover, top-right)
- Shadow: `shadow-lg` with hover scale and shadow-xl effect
- Cursor: `pointer`

**Content**:

```
DELAY
[Delay Name]
[X] days

CLICK TO EDIT DURATION
```

**Interactions**:

- Click anywhere on node → Opens DelayNodeEditorModal
- Hover → Shows edit icon, increases scale (1.05), enhances shadow

**Handles**:

- Top target handle (purple)
- Bottom source handle (purple)

**Variants**:

- **Follow-up Delay**: `type="followUp"` - 1-7 days before follow-up email
- **Deadline Delay**: `type="deadline"` - 1-30 days total before marking lost

---

### 5. End Node

**Purpose**: Terminal states (Converted or Lost)

**Visual Design**:

- **Success variant** (Lead Converted):

  - Background: Gradient from `green-50` to `green-100`
  - Border: 2px solid `green-400`
  - Icon: `CircleCheck` (white on `green-500` circle)

- **Failure variant** (Lead Lost):
  - Background: Gradient from `neutral-50` to `neutral-100`
  - Border: 2px solid `neutral-400`
  - Icon: `CircleX` (white on `neutral-500` circle)

**Content**:

```
END
[Lead Converted / Lead Lost]
[Description]
```

**Interactions**: Non-interactive (information only)

**Handle**: Top target handle (neutral)

---

## Edge Specifications

### Default Edge

- Type: `SmoothStep` (React Flow connection type)
- Color: Default neutral
- Animated: False (except trigger to welcome)

### Trigger → Welcome Email

- Animated: **True** (flowing animation)
- Indicates active workflow entry point

### Condition → Thank You (YES path)

- Label: "YES"
- Color: Green (`#059669`)
- Label background: `green-50`
- Label text: Bold, green
- Animated: **True**

### Condition → Delay (NO path)

- Label: "NO"
- Color: Red (`#DC2626`)
- Label background: `red-50`
- Label text: Bold, red
- Animated: False

---

## React Flow Configuration

### Canvas Settings

```typescript
{
  fitView: true,
  fitViewOptions: { padding: 0.2, maxZoom: 1 },
  minZoom: 0.5,
  maxZoom: 1.5,
  nodesDraggable: false,      // Read-only: nodes cannot be moved
  nodesConnectable: false,    // Read-only: edges cannot be created
  elementsSelectable: true,   // Nodes can be clicked
  proOptions: { hideAttribution: true }
}
```

### Background

- Color: `#E5E5E5` (neutral-200)
- Gap: 16px
- Size: 1px dots

### Controls

- Show zoom controls
- Hide interactive toggle (showInteractive: false)

### MiniMap

- Node colors:
  - Trigger: `#818CF8` (indigo-400)
  - Email: `#60A5FA` (blue-400)
  - Condition: `#FCD34D` (yellow-300)
  - Delay: `#A78BFA` (purple-400)
  - End: `#9CA3AF` (neutral-400)
- Mask color: `rgba(0, 0, 0, 0.05)`

### Panel (Instructions)

- Position: Top-left
- Background: White card with border
- Text: "Click on nodes to edit email templates or delays"
- Styling: Small font, medium weight, neutral-700

---

## Email Node Editor Modal

### Modal Layout (1200px wide, 90vh height)

```
┌────────────────────────────────────────────────────────────┐
│ [Mail Icon] Welcome Email                            [X]   │
│ Sent immediately when a lead submits the form              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┬──────────────────────────────┐   │
│  │ • Email Editor       │  [Eye] Live Preview          │   │
│  ├──────────────────────┼──────────────────────────────┤   │
│  │                      │                              │   │
│  │ Subject Line         │  From: FlowTrack            │   │
│  │ [Input field]        │  To: john.doe@example.com   │   │
│  │                      │  Subject: [Subject]         │   │
│  │ Email Body           │  ─────────────────────────   │   │
│  │ [Textarea - 12 rows] │                              │   │
│  │                      │  [Email body with           │   │
│  │ Insert Variables     │   variables replaced]       │   │
│  │ [{firstName}]        │                              │   │
│  │ [{lastName}]         │                              │   │
│  │ [{email}]            │                              │   │
│  │ [{phone}]            │                              │   │
│  │ [{company}]          │                              │   │
│  │ [{bookingUrl}]       │                              │   │
│  │                      │                              │   │
│  └──────────────────────┴──────────────────────────────┘   │
│                                                             │
├────────────────────────────────────────────────────────────┤
│  Changes are auto-saved when you click Save   [Cancel]     │
│                                              [Save Changes] │
└────────────────────────────────────────────────────────────┘
```

### Left Panel: Email Editor

**Subject Line**:

- Label: "Subject Line" (semibold, neutral-900)
- Input: Single-line text field
- Border: neutral-300, focus: indigo-500
- Placeholder: "Enter email subject..."

**Email Body**:

- Label: "Email Body" (semibold, neutral-900)
- Textarea: 12 rows, monospace font
- Border: neutral-300, focus: indigo-500
- Placeholder: "Enter email content..."

**Insert Variables**:

- Label: "Insert Variables" (semibold, neutral-900)
- Grid: 2 columns
- Each variable button:
  - Code block: Variable syntax (e.g., `{firstName}`)
  - Description: Human-readable label
  - Colors: Border neutral-200, hover: indigo-400 border + indigo-50 bg
  - Click → Inserts variable at end of body

**Available Variables**:

- `{firstName}` - Lead's first name
- `{lastName}` - Lead's last name
- `{email}` - Lead's email address
- `{phone}` - Lead's phone number
- `{company}` - Lead's company name
- `{bookingUrl}` - Booking link URL

### Right Panel: Live Preview

**Email Header** (neutral-50 background):

- From: FlowTrack (noreply@flowtrack.com)
- To: john.doe@example.com (sample)
- Subject: {current subject or "(No subject)"}

**Email Body** (white background, prose styling):

- Variables replaced with sample data:
  - `{firstName}` → "John"
  - `{lastName}` → "Doe"
  - `{email}` → "john.doe@example.com"
  - `{phone}` → "+1 (555) 123-4567"
  - `{company}` → "Acme Inc"
  - `{bookingUrl}` → "https://calendly.com/your-link"
- Text: Whitespace preserved (pre-wrap)
- Line height: Relaxed

### Footer

- Left: Info text - "Changes are auto-saved when you click Save"
- Right: Action buttons
  - Cancel (outline variant)
  - Save Changes (indigo-600 background, `Save` icon)

### Modal Variants

1. **Welcome Email Modal**

   - Title: "Welcome Email"
   - Description: "Sent immediately when a lead submits the form"

2. **Thank You Email Modal**

   - Title: "Thank You Email"
   - Description: "Sent when a lead clicks the booking link"

3. **Follow-up Email Modal**
   - Title: "Follow-up Email"
   - Description: "Sent after the delay period if no booking is made"

---

## Delay Node Editor Modal

### Modal Layout (600px wide)

```
┌──────────────────────────────────────────────────────┐
│ [Clock Icon] Follow-up Delay                    [X]  │
│ Time to wait before sending the follow-up email     │
├──────────────────────────────────────────────────────┤
│                                                       │
│          ┌───────────────────────────┐               │
│          │   [Clock Icon]            │               │
│          │         2                 │               │
│          │       days                │               │
│          └───────────────────────────┘               │
│  (Purple gradient background, large text)            │
│                                                       │
│  Select Duration                                     │
│  ├───────────────────────────────────────────────┤   │
│  │█████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │
│  1 day                                     7 days    │
│                                                       │
│  Quick Select                                        │
│  [1d] [2d] [3d] [5d] [7d]                           │
│  (2d is selected - purple highlight)                │
│                                                       │
│  Timeline Preview                                    │
│  Day 0 ────────────────────────────────── Day 2     │
│  No booking                        Send follow-up    │
│  │███████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░│         │
│                                                       │
├──────────────────────────────────────────────────────┤
│                              [Cancel] [Save Changes] │
└──────────────────────────────────────────────────────┘
```

### Current Value Display

- Large card with purple gradient background
- Clock icon + number of days (5xl font, bold, purple-600)
- "days" label (lg font, semibold, purple-700)

### Slider Control

**Label**: "Select Duration" (semibold, neutral-900)

**Range Slider**:

- Follow-up delay: 1-7 days
- Deadline duration: 1-30 days
- Track: Purple gradient fill from left
- Thumb: Purple-500
- Labels: Min/max values below track

### Quick Select Buttons

**Label**: "Quick Select" (semibold, neutral-900)

**Buttons** (flex grid):

- Follow-up suggestions: 1d, 2d, 3d, 5d, 7d
- Deadline suggestions: 3d, 5d, 7d, 14d, 30d
- Selected: Purple-500 border + purple-100 background
- Unselected: Neutral-200 border + white background
- Hover: Purple-300 border + purple-50 background

### Timeline Preview

**Label**: "Timeline Preview" (semibold, neutral-900)

**Visual Timeline**:

- Horizontal progress bar (neutral-200 background)
- Purple gradient fill showing percentage of max duration
- Start label: Day 0 + context (e.g., "No booking")
- End label: Day X + action (e.g., "Send follow-up")
- Progress: Animated transition when changing duration

### Footer

- Right-aligned action buttons
  - Cancel (outline variant)
  - Save Changes (purple-600 background, `Save` icon)

### Modal Variants

1. **Follow-up Delay Modal**

   - Title: "Follow-up Delay"
   - Description: "Time to wait before sending the follow-up email if no booking is made"
   - Range: 1-7 days
   - Default: 2 days
   - Timeline: "No booking" → "Send follow-up"

2. **Deadline Duration Modal**
   - Title: "Deadline Duration"
   - Description: "Total time to wait before marking the lead as lost"
   - Range: 1-30 days
   - Default: 7 days
   - Timeline: "Follow-up sent" → "Mark as lost"

---

## Color Palette

### Node Colors (Gradients)

```
Trigger (Indigo):
  from-indigo-50 (#EEF2FF) to to-indigo-100 (#E0E7FF)
  border-indigo-400 (#818CF8)
  icon-bg: indigo-500 (#6366F1)

Email (Blue):
  from-blue-50 (#EFF6FF) to to-blue-100 (#DBEAFE)
  border-blue-400 (#60A5FA)
  hover-border: blue-500 (#3B82F6)
  icon-bg: blue-500 (#3B82F6)

Condition (Yellow):
  from-yellow-50 (#FEFCE8) to to-yellow-100 (#FEF9C3)
  border-yellow-400 (#FACC15)
  icon-bg: yellow-500 (#EAB308)

Delay (Purple):
  from-purple-50 (#FAF5FF) to to-purple-100 (#F3E8FF)
  border-purple-400 (#C084FC)
  hover-border: purple-500 (#A855F7)
  icon-bg: purple-500 (#A855F7)

End - Success (Green):
  from-green-50 (#F0FDF4) to to-green-100 (#DCFCE7)
  border-green-400 (#4ADE80)
  icon-bg: green-500 (#22C55E)

End - Failure (Neutral):
  from-neutral-50 (#FAFAFA) to to-neutral-100 (#F5F5F5)
  border-neutral-400 (#A3A3A3)
  icon-bg: neutral-500 (#737373)
```

### Edge Colors

```
Default: neutral-400 (#A3A3A3)
YES path: green-600 (#059669)
NO path: red-600 (#DC2626)
Trigger animated: indigo-500 (#6366F1)
```

### Modal Colors

```
Email modal accent: blue-600 (#2563EB)
Delay modal accent: purple-600 (#9333EA)
Button primary: indigo-600 (#4F46E5)
Button primary hover: indigo-700 (#4338CA)
```

---

## Typography

### Node Text

**Labels** (e.g., "TRIGGER", "EMAIL"):

- Font size: 11px (`text-xs`)
- Font weight: 600 (semibold)
- Text transform: Uppercase
- Letter spacing: Wide (0.05em)

**Node Names** (e.g., "Lead Submitted"):

- Font size: 14-16px (`text-sm` to `text-base`)
- Font weight: 700 (bold)

**Descriptions**:

- Font size: 12px (`text-xs`)
- Line height: Relaxed (1.625)

### Modal Text

**Title**:

- Font size: 20px (`text-xl`)
- Font weight: 700 (bold)

**Section Labels**:

- Font size: 14px (`text-sm`)
- Font weight: 600 (semibold)

**Body Text**:

- Font size: 14px (`text-sm`)
- Font weight: 400 (normal)

**Monospace** (Email body textarea):

- Font family: `font-mono`
- Font size: 14px (`text-sm`)

---

## Interactions & Behaviors

### Node Interactions

1. **Email Nodes**:

   - Click → Opens EmailNodeEditorModal
   - Hover → Scale 1.05, shadow-xl, border darkens, edit icon fades in
   - Cursor: pointer

2. **Delay Nodes**:

   - Click → Opens DelayNodeEditorModal
   - Hover → Scale 1.05, shadow-xl, border darkens, edit icon fades in
   - Cursor: pointer

3. **Non-Interactive Nodes** (Trigger, Condition, End):
   - Hover → Scale 1.05, shadow-xl
   - No click interaction
   - Cursor: default

### Modal Interactions

1. **Email Editor**:

   - Subject changes → Updates preview immediately
   - Body changes → Updates preview immediately
   - Variable buttons → Appends variable to body
   - Save → Calls onSave callback, closes modal
   - Cancel / X → Discards changes, closes modal
   - Click outside → No action (must use Cancel/X)

2. **Delay Editor**:
   - Slider drag → Updates current value display and timeline
   - Quick select button → Sets value, updates slider and timeline
   - Timeline → Animated fill transition (300ms)
   - Save → Calls onSave callback, closes modal
   - Cancel / X → Discards changes, closes modal

### Auto-Save Behavior

- Debounce delay: 1 second
- Triggers on:
  - Email template changes (subject or body)
  - Delay duration changes
- Visual feedback: "Saving..." spinner → "Saved" checkmark
- State persists in component state
- **TODO**: Backend API endpoint to persist to `Workflow.configurationData`

---

## Data Structure

### WorkflowConfiguration Interface

```typescript
interface WorkflowConfiguration {
  // Welcome Email (sent immediately)
  welcomeSubject?: string;
  welcomeBody?: string;

  // Thank You Email (sent when booked)
  thankYouSubject?: string;
  thankYouBody?: string;

  // Follow-up Email (sent if not booked)
  followUpSubject?: string;
  followUpBody?: string;

  // Delays
  followUpDelayDays?: number; // 1-7 days before follow-up
  deadlineDays?: number; // 1-30 days before marking lost
}
```

### Default Values

```typescript
{
  welcomeSubject: 'Welcome! Here\'s your booking link',
  welcomeBody: 'Hi {firstName},\n\nThanks for your interest! Click here to book a meeting: {bookingUrl}',
  thankYouSubject: 'Thanks for booking!',
  thankYouBody: 'Hi {firstName},\n\nThanks for booking a meeting with us. We look forward to speaking with you!',
  followUpSubject: 'Still interested?',
  followUpBody: 'Hi {firstName},\n\nWe noticed you haven\'t booked a meeting yet. Here\'s your link again: {bookingUrl}',
  followUpDelayDays: 2,
  deadlineDays: 7,
}
```

### Storage

Configuration is stored in `Workflow.configurationData` JSON field in the database. The field uses PostgreSQL JSONB type for efficient querying and indexing.

---

## Workflow Structure

### Fixed Workflow Flow

```
1. Lead Submitted (Trigger)
   ↓
2. Welcome Email (with booking link)
   ↓
3. Condition: Booking Link Clicked?
   ├─ YES → 4a. Thank You Email → 5a. End (Converted)
   └─ NO  → 4b. Delay (X days)
            ↓
            5b. Follow-up Email
            ↓
            6b. Delay Until Deadline (Y days total)
            ↓
            7b. End (Lost)
```

### Node Positions (React Flow Coordinates)

```typescript
{
  'trigger-1': { x: 250, y: 50 },
  'email-welcome': { x: 220, y: 180 },
  'condition-1': { x: 200, y: 340 },
  'email-thankyou': { x: 50, y: 500 },      // YES path
  'delay-followup': { x: 400, y: 500 },     // NO path
  'email-followup': { x: 370, y: 630 },
  'delay-deadline': { x: 400, y: 760 },
  'end-lost': { x: 390, y: 890 },
  'end-booked': { x: 50, y: 630 },
}
```

---

## Responsive Behavior

### Canvas

- Fixed height: 800px
- Horizontal scroll: Enabled if needed
- Vertical scroll: Enabled if needed
- Minimap: Always visible, responsive size
- Controls: Always visible in bottom-left

### Modals

**Email Editor Modal** (1200px wide):

- Desktop (≥1200px): Side-by-side layout (50/50 split)
- Tablet/Mobile (<1200px): Stacked layout (editor on top, preview below)
- Height: 90vh with internal scroll

**Delay Editor Modal** (600px wide):

- All screens: Centered, responsive padding
- Mobile: Full width with padding

---

## Accessibility

### Keyboard Navigation

- Tab: Navigate between interactive nodes
- Enter/Space: Activate selected node (open modal)
- Escape: Close open modal
- Arrow keys: Navigate within modals (focus management)

### Screen Reader Support

- All nodes: ARIA labels with node type and name
- Email nodes: "Email node: [Name]. Click to edit template."
- Delay nodes: "Delay node: Wait [X] days. Click to edit duration."
- Condition node: "Condition node: Booking Link Clicked? Branches to Thank You Email or Follow-up Delay."
- Modals: Proper dialog roles, focus trap, announce on open

### Color Contrast

- All text: WCAG AA compliance (4.5:1 minimum)
- Node backgrounds: Sufficient contrast with text
- Edge labels: Background provides contrast
- Focus indicators: High contrast borders

---

## Performance Considerations

### React Flow Optimization

- Nodes: Memoized with `memo()`
- Re-renders: Minimized by node type separation
- Edges: Static configuration, no dynamic recalculation

### Modal Optimization

- Lazy loading: Modals only render when open
- Preview updates: Debounced for performance
- Large text: Monospace font for consistent rendering

### Auto-Save

- Debounce: 1 second prevents excessive API calls
- Optimistic updates: UI updates immediately
- Error handling: Retry logic for failed saves (TODO)

---

## Future Enhancements

### Phase 2: Full Drag-and-Drop Editor

- Enable `nodesDraggable` and `nodesConnectable`
- Add node palette for adding new nodes
- Support custom workflows beyond fixed structure
- Implement WorkflowNode and WorkflowEdge database sync

### Phase 3: Advanced Features

- Rich text email editor (WYSIWYG)
- Email template library
- A/B testing for email variants
- Conditional branching (beyond booking click)
- Custom variable definitions
- Email scheduling options

### Phase 4: Analytics Integration

- Per-node analytics (e.g., email open rates)
- Heatmap overlay on canvas
- Conversion path visualization
- Real-time workflow execution tracking

---

## Technical Stack

### Libraries

- **React Flow**: `@xyflow/react` - Node-based editor framework
- **Dagre**: `dagre` - Auto-layout (future use)
- **Framer Motion**: Page transitions and animations
- **Radix UI**: Dialog, Label primitives
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icons

### Component Structure

```
src/features/workflows/
├── components/
│   ├── canvas/
│   │   ├── WorkflowCanvasEditor.tsx       (Main component)
│   │   ├── nodes/
│   │   │   ├── TriggerNode.tsx
│   │   │   ├── EmailNode.tsx
│   │   │   ├── ConditionNode.tsx
│   │   │   ├── DelayNode.tsx
│   │   │   └── EndNode.tsx
│   │   └── modals/
│   │       ├── EmailNodeEditorModal.tsx
│   │       └── DelayNodeEditorModal.tsx
│   └── CanvasFormEditor.tsx               (Existing form builder)
└── screens/
    └── WorkflowBuilderScreen.tsx          (Parent with tabs)
```

---

## Testing Checklist

### Visual Regression

- [ ] All node types render correctly
- [ ] Edge connections display properly
- [ ] Minimap shows accurate representation
- [ ] Hover states work on all interactive nodes
- [ ] Modals open with correct content

### Functional Testing

- [ ] Click email node → Opens correct modal with data
- [ ] Edit email subject → Preview updates immediately
- [ ] Edit email body → Preview updates immediately
- [ ] Insert variable → Appends to body correctly
- [ ] Save email changes → Updates node display
- [ ] Click delay node → Opens correct modal with data
- [ ] Adjust slider → Updates display and timeline
- [ ] Quick select button → Sets correct value
- [ ] Save delay changes → Updates node display
- [ ] Cancel modal → Discards changes

### Integration Testing

- [ ] Tab switching maintains state
- [ ] Auto-save debouncing works correctly
- [ ] Configuration persists across page reload (TODO: backend)
- [ ] Multiple rapid edits handled gracefully

### Accessibility Testing

- [ ] Keyboard navigation works in canvas
- [ ] Screen reader announces nodes correctly
- [ ] Focus trap works in modals
- [ ] Color contrast meets WCAG AA
- [ ] Skip links provided for keyboard users

### Browser Compatibility

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Related Documentation

- [Settings UX](./SETTINGS_UX.md) - Settings page design
- [Login UX](./LOGIN_UX.md) - Authentication flow design
- Backend schema: `/backend/prisma/schema.prisma`
- Frontend rules: `/frontend/.cursorrules`
- Backend rules: `/backend/.cursorrules`

---

## Changelog

### Version 1.0 (2025-11-29)

- Initial specification
- Implemented read-only workflow canvas
- Email node editor modal with side-by-side layout
- Delay node editor modal with timeline preview
- Tab restructure: Canvas (workflow) + Form + Analytics
- Fixed workflow structure based on lead nurture strategy
