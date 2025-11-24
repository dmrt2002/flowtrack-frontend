# Simulation Screen UX Specification

**Step 5 of 5 · Onboarding Flow**

## Overview

The Simulation screen is the final step in the onboarding flow, designed to demonstrate the automation logic in action before going live. It provides users with a "magic moment" where they can see exactly how their automation will process leads.

## Purpose

- **Verify Logic**: Prove the automation works as expected with real examples
- **Build Confidence**: Show users their automation is ready to go live
- **Demonstrate Value**: Visualize how leads will be processed automatically
- **Final Checkpoint**: Last opportunity to review before activation

## Strategy-Specific Behavior

The simulation screen adapts to the selected strategy, showing different logic paths, test data, and results:

### Gatekeeper Strategy

- **Test Leads**: Two scenarios (budget below/above threshold)
- **Logic Path**: Form Submission → Check Budget → Send Email
- **Results**: Shows both qualified and rejected scenarios

### Nurturer Strategy

- **Test Lead**: Single lead with name, email, company
- **Logic Path**: Form Submission → Wait 3 days → Send Email 1 → ... → Send Email 5
- **Results**: Shows email sequence completion

### Closer Strategy

- **Test Lead**: Single lead with name, email, company
- **Logic Path**: Form Submission → Send Booking Link → Wait 1 day → Send Reminder
- **Results**: Shows booking flow completion

## Layout & Structure

### Header Section

- **Back Button**: Returns to Email Configuration (Step 4)
- **Title**: "See your automation in action"
- **Subtitle**: "Watch how your automation will process leads"
- **Step Indicator**: "Step 5 of 5" (top right)

### Main Content Area

#### Three-Column Layout (Desktop) / Stacked (Mobile)

**Left Column: Test Lead Data**

- **Gatekeeper**: Two test scenarios (Pass and Fail) with budget fields
- **Nurturer/Closer**: Single test lead with name, email, company fields
- Editable test lead inputs (when not running)
- Strategy-specific field labels and descriptions

**Center Column: Logic Path Visualization**

- **Gatekeeper**: Form → Check Budget → Send Email
- **Nurturer**: Form → Wait 3 days → Send Email 1 → ... → Send Email 5
- **Closer**: Form → Send Booking Link → Wait 1 day → Send Reminder
- Animated workflow steps with strategy-specific icons
- Real-time status indicators
- Glowing dot animation

**Right Column: Results**

- **Gatekeeper**: Scenario 1 (Rejected) and Scenario 2 (Qualified) side-by-side
- **Nurturer**: Email sequence completion result
- **Closer**: Booking flow completion result
- Strategy-specific metrics summary

### Bottom Action Bar

- **Back Button**: Returns to previous step
- **Go Live Button**: Activates workflow and completes onboarding (only visible after simulation completes)

## Key Features

### 1. Strategy-Specific Scenario Testing

**Gatekeeper Strategy:**

- **Lead 1 (Fail)**: Budget below threshold → Rejected
- **Lead 2 (Pass)**: Budget above threshold → Qualified
- Shows both qualification paths

**Nurturer Strategy:**

- **Single Lead**: Receives 5-email sequence over 15 days
- Shows email sequence progression

**Closer Strategy:**

- **Single Lead**: Receives booking link immediately, reminder 1 day later
- Shows instant booking flow

**Benefits:**

- Strategy-specific demonstration
- Shows relevant automation paths
- Builds user confidence in the system

### 2. Editable Test Data

**Test Lead Inputs (Strategy-Specific):**

- **Gatekeeper**: Name, Email, Budget (two scenarios)
- **Nurturer/Closer**: Name, Email, Company (single lead)
- All fields editable when not running
- "Edit" button to toggle edit mode

**Interaction:**

- User can modify test lead data to test different scenarios
- Click "Run Simulation" to see updated results
- Real-time validation feedback

### 3. Animated Logic Path

**Visual Flow (Strategy-Specific):**

**Gatekeeper:**

```
[Form Submission]
    ↓
[Check Budget]
    ↓
    ├─→ [Budget >= Threshold] → [Qualify] → [Send Booking Link]
    └─→ [Budget < Threshold] → [Reject] → [Send Decline Email]
```

**Nurturer:**

```
[Form Submission]
    ↓
[Wait 3 days]
    ↓
[Send Email 1]
    ↓
[Wait 3 days]
    ↓
[Send Email 2]
    ↓
... (continues for 5 emails)
```

**Closer:**

```
[Form Submission]
    ↓
[Send Booking Link] (immediate)
    ↓
[Wait 1 day]
    ↓
[Send Reminder]
```

**Animation Sequence:**

1. Form step activates (glowing dot)
2. Budget check evaluates (shows comparison)
3. Branch splits based on result
4. Action step executes (email sent)
5. Results appear in right column

### 4. Side-by-Side Results

**Result Cards:**

**Gatekeeper Results:**

- **Qualified Lead (Pass)**: Green success indicator, "Lead Qualified" badge, "Booking link sent" message
- **Rejected Lead (Fail)**: Red rejection indicator, "Lead Rejected" badge, "Decline email sent" message

**Nurturer Results:**

- **Email Sequence Complete**: Green success indicator, "5-email sequence completed" message, shows total duration

**Closer Results:**

- **Booking Flow Complete**: Green success indicator, "Booking link sent immediately" message, "Reminder sent 1 day later"

### 5. Enhanced Metrics

**Simulation Summary (Strategy-Specific):**

- **Gatekeeper**: Total leads tested: 2, Qualified: 1, Rejected: 1, Emails sent: 2
- **Nurturer**: Emails in sequence: 5, Total duration: 15 days
- **Closer**: Booking link sent: Immediately, Reminder sent: 1 day later

## User Interactions

### Initial State (Idle)

- Shows empty test lead form
- Logic path shows pending state (gray)
- Results column shows placeholder text
- "Run Simulation" button (pulsing, primary)

### Running State

- Test lead data locked (read-only)
- Logic path animates through steps
- Glowing dot travels through workflow
- Loading spinner in results column
- "Running Simulation..." button (disabled)

### Complete State

- Test lead data editable again
- Logic path shows completed state
- Both results displayed side-by-side
- Metrics summary visible
- "Go Live" button appears (glowing, primary)

### After "Go Live"

- Workflow activated
- Onboarding marked complete
- Success toast notification
- Redirect to dashboard after 1.5s

## Visual Design

### Color Coding

- **Success/Pass**: Green (#10B981)
- **Failure/Reject**: Red (#EF4444)
- **Pending**: Gray (#6B7280)
- **Active**: Primary color (#4F46E5)

### Icons

- **Form**: Lightning bolt (⚡)
- **Check**: Diamond shape (◇)
- **Qualify**: Checkmark (✓)
- **Reject**: X mark (✗)
- **Email**: Envelope (✉)

### Animations

- **Glowing Dot**: Pulses as it travels through logic path
- **Step Activation**: Scale up (1.05x) when active
- **Status Change**: Smooth color transition
- **Result Appearance**: Fade in from bottom

## States & Scenarios

### Scenario 1: Budget Check Fails

**Test Lead**: Budget $500, Threshold $2000
**Result**:

- ❌ Budget check fails
- Lead rejected
- Decline email sent
- Status: "Rejected"

### Scenario 2: Budget Check Passes

**Test Lead**: Budget $5000, Threshold $2000
**Result**:

- ✓ Budget check passes
- Lead qualified
- Booking link sent
- Status: "Qualified"

## Copy & Messaging

### Headlines

- "See your automation in action"
- "Watch how your automation will process leads"

### Test Lead Section

- "Test Lead Data"
- "Edit values to test different scenarios"
- "Budget: $[amount]"

### Logic Path Section

- "Logic Path"
- "Your automation workflow"

### Results Section

- "Results"
- "Qualified Lead" / "Rejected Lead"
- "Budget check passed/failed"
- "Email sent successfully"

### Buttons

- "Run Simulation" (initial state)
- "Running Simulation..." (loading state)
- "Go Live" (complete state)
- "Activating..." (activating state)

## Error Handling

### Simulation Fails

- Show error message in results column
- Allow retry with "Run Simulation" button
- Display helpful error text

### Activation Fails

- Show error toast
- Keep "Go Live" button enabled
- Allow retry

## Accessibility

### Keyboard Navigation

- Tab through test lead inputs
- Enter to run simulation
- Space to activate buttons

### Screen Readers

- Announce simulation state changes
- Describe logic path progression
- Read results aloud

## Mobile Responsiveness

### Stacked Layout

- Test lead data (top)
- Logic path (middle)
- Results (bottom)

### Touch Interactions

- Large tap targets (44x44px minimum)
- Swipe gestures for navigation
- Pull-to-refresh simulation

## Success Metrics

### Completion Rate

- ≥90% of users complete simulation
- ≥85% activate workflow after simulation

### Time Metrics

- Average simulation viewing time: 30-60 seconds
- Time to "Go Live" click: <2 minutes

## Future Enhancements

### V1.1: Multiple Test Scenarios

- Add more test leads (3-5 scenarios)
- Show edge cases (exact threshold match)
- Custom scenario builder

### V1.2: Email Preview

- Show actual email content
- Preview both qualified and rejected emails
- Edit email templates inline

### V1.3: Advanced Testing

- Test with real form submissions
- Historical lead data testing
- A/B test different configurations

---

**Document Version**: 1.0
**Last Updated**: 2025-01-23
**Status**: Implementation Ready
