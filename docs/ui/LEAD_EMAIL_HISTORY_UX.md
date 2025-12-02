# FlowTrack Lead Email History - UI/UX Design Specification

## 1. Visual Strategy & Purpose

### Core Design Philosophy

The Lead Email History component embodies **"Contextual Email Transparency"** — providing detailed visibility into all automated emails sent to a specific lead within their profile. The interface should communicate:

- **Context**: Emails shown in the context of the lead's journey
- **Timeline**: Chronological view of communication history
- **Status Awareness**: Clear indicators of which emails were opened
- **Quick Access**: Fast navigation to email content and details

### Visual Tone

**Inline Integration with Clean Hierarchy**

- Seamlessly integrated into Lead Detail page as a tab
- Timeline-based layout for chronological context
- Status indicators using color and iconography
- Consistent with FlowTrack's lead management aesthetic
- TARGET: HubSpot/Salesforce contact timeline experience

---

## 2. Layout Architecture

### Tab Integration in Lead Detail Page

```
┌──────────────────────────────────────────────────────────────┐
│  ← Back to Leads                                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [Avatar] John Smith                              [Actions ▼]│
│           john@example.com                                   │
│           Lead Source: Contact Form • Added 3 days ago       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [Overview] [Emails] [Activity] [Workflows]             │  │
│  └────────────────────────────────────────────────────────┘  │
│              ↑ Active Tab                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │  EMAIL HISTORY CONTENT                                │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │ Timeline View                                    │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px)**: Full timeline view with all details
- **Tablet (768px - 1023px)**: Condensed timeline, hide secondary info
- **Mobile (<768px)**: Stacked card layout with essential info

---

## 3. Component Specifications

### 3.1 Tab Navigation

#### Visual Structure

```
┌──────────────────────────────────────────────┐
│ [Overview] [Emails (3)] [Activity] [Workflows]│
└──────────────────────────────────────────────┘
             ↑ Active
```

#### Specifications

```css
/* Container */
display: flex
gap: 0
border-bottom: 2px solid var(--neutral-200)
margin-bottom: 24px

/* Tab Button (Inactive) */
padding: 12px 20px
font-size: 15px
font-weight: 500
color: var(--neutral-600)
background: transparent
border: none
border-bottom: 3px solid transparent
cursor: pointer
transition: all 0.15s ease
margin-bottom: -2px

/* Tab Button (Active) */
color: var(--brand-primary)
border-bottom: 3px solid var(--brand-primary)
background: transparent

/* Tab Button (Hover - Inactive) */
color: var(--neutral-900)
background: var(--neutral-50)

/* Email Count Badge */
display: inline
margin-left: 6px
padding: 2px 8px
font-size: 12px
font-weight: 600
color: var(--neutral-500)
background: var(--neutral-100)
border-radius: 10px
```

### 3.2 Email History Header

#### Visual Structure

```
┌───────────────────────────────────────────────────┐
│  Email History (3)                    [Filter ▼] │
│  All automated emails sent to this lead           │
└───────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
display: flex
justify-content: space-between
align-items: center
margin-bottom: 24px
padding-bottom: 16px
border-bottom: 1px solid var(--neutral-100)

/* Title */
font-size: 18px
font-weight: 600
color: var(--neutral-900)
display: flex
align-items: center
gap: 8px

/* Count Badge */
font-size: 14px
font-weight: 500
color: var(--neutral-500)

/* Subtitle */
font-size: 13px
font-weight: 400
color: var(--neutral-500)
margin-top: 4px

/* Filter Dropdown */
padding: 8px 12px
font-size: 13px
font-weight: 500
color: var(--neutral-700)
background: var(--neutral-50)
border: 1px solid var(--neutral-200)
border-radius: 6px
cursor: pointer
```

### 3.3 Timeline Email List

#### Timeline Structure

```
┌─────────────────────────────────────────────────────────┐
│  ●━━━━━  Today                                          │
│  │                                                      │
│  │   ┌─────────────────────────────────────────────┐   │
│  │   │ ● Welcome! Here's your booking link         │   │
│  │   │   Opened 3 times • Last: 2 hours ago        │   │
│  │   │                                             │   │
│  │   │   From: Outbound Sales Workflow             │   │
│  │   │   Sent: Today at 10:34 AM                   │   │
│  │   │                                             │   │
│  │   │   [View Email]                              │   │
│  │   └─────────────────────────────────────────────┘   │
│  │                                                      │
│  ●━━━━━  Yesterday                                      │
│  │                                                      │
│  │   ┌─────────────────────────────────────────────┐   │
│  │   │ ○ Thanks for submitting your information   │   │
│  │   │   Not opened yet                            │   │
│  │   │                                             │   │
│  │   │   From: Outbound Sales Workflow             │   │
│  │   │   Sent: Yesterday at 3:22 PM                │   │
│  │   │                                             │   │
│  │   │   [View Email]                              │   │
│  │   └─────────────────────────────────────────────┘   │
│  │                                                      │
│  ●━━━━━  3 days ago                                     │
│     │                                                   │
│     │   ┌─────────────────────────────────────────┐    │
│     │   │ ● Follow up: Have you had a chance?    │    │
│     │   │   Opened once • January 26 at 9:15 AM  │    │
│     │   └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

#### Timeline Line Specifications

```css
/* Timeline Container */
position: relative
padding-left: 32px

/* Timeline Line (Vertical) */
position: absolute
left: 7px
top: 0
bottom: 0
width: 2px
background: var(--neutral-200)

/* Timeline Dot */
position: absolute
left: 0
width: 16px
height: 16px
border-radius: 50%
background: var(--neutral-200)
border: 3px solid #FFFFFF
z-index: 1

/* Timeline Dot (Active - Recent) */
background: var(--brand-primary)
box-shadow: 0 0 0 4px var(--brand-primary-light)
```

#### Date Separator Specifications

```css
/* Date Label */
font-size: 13px
font-weight: 600
color: var(--neutral-500)
text-transform: uppercase
letter-spacing: 0.05em
margin: 24px 0 16px 0
display: flex
align-items: center
gap: 12px

/* Separator Line */
flex: 1
height: 1px
background: var(--neutral-200)
```

### 3.4 Email Card Component

#### Visual Structure

```
┌─────────────────────────────────────────────────┐
│  ● Welcome! Here's your booking link            │
│    Opened 3 times • Last: 2 hours ago           │
│                                                 │
│    From: Outbound Sales Workflow                │
│    Type: Welcome Email                          │
│    Sent: Today at 10:34 AM                      │
│                                                 │
│    [View Email]                                 │
└─────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Card Container */
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 8px
padding: 16px
margin-bottom: 16px
transition: all 0.15s ease

/* Card (Hover) */
border-color: var(--neutral-300)
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
transform: translateY(-1px)

/* Subject Line */
font-size: 15px
font-weight: 600
color: var(--neutral-900)
line-height: 1.4
margin-bottom: 6px
display: flex
align-items: center
gap: 8px

/* Open Status Indicator (Inline with Subject) */
/* Opened */
● Green dot (var(--success-500))
width: 8px
height: 8px
border-radius: 50%

/* Not Opened */
○ Gray circle outline (var(--neutral-300))
width: 8px
height: 8px
border: 1.5px solid
border-radius: 50%

/* Open Status Text */
font-size: 13px
font-weight: 500
color: var(--success-600)
margin-bottom: 12px

/* Not Opened Status Text */
color: var(--neutral-500)

/* Metadata Section */
margin-top: 12px
display: grid
gap: 6px

/* Metadata Row */
font-size: 13px
font-weight: 400
line-height: 1.5
display: flex
gap: 8px

/* Metadata Label */
color: var(--neutral-500)
min-width: 60px

/* Metadata Value */
color: var(--neutral-700)

/* Email Type Badge */
display: inline-block
padding: 3px 10px
font-size: 11px
font-weight: 500
border-radius: 10px
text-transform: capitalize
margin-left: 8px

/* Welcome Email Badge */
background: var(--brand-primary-light)
color: var(--brand-primary)

/* Thank You Email Badge */
background: #D1FAE5
color: #059669

/* Follow Up Email Badge */
background: #FEF3C7
color: #D97706
```

#### View Email Button

```css
/* Button */
margin-top: 12px
padding: 8px 16px
font-size: 13px
font-weight: 500
color: var(--brand-primary)
background: transparent
border: 1px solid var(--brand-primary)
border-radius: 6px
cursor: pointer
transition: all 0.15s ease

/* Hover */
background: var(--brand-primary)
color: #FFFFFF

/* Focus */
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)
```

### 3.5 Email Detail Modal

#### Modal Structure (Same as Inbox)

```
┌────────────────────────────────────────────────────────────┐
│  Email Details                                      [✕]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Subject:  Welcome! Here's your booking link              │
│  To:       john@example.com (John Smith)                  │
│  From:     noreply@flowtrack.app                          │
│  Sent:     January 29, 2025 at 10:34 AM                   │
│                                                            │
│  Status:   ● Opened 3 times                               │
│            • January 29, 2025 at 12:15 PM                 │
│            • January 29, 2025 at 2:34 PM                  │
│            • January 29, 2025 at 3:45 PM                  │
│                                                            │
│  Workflow: Outbound Sales                                 │
│  Type:     Welcome Email                                  │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  EMAIL CONTENT                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Rendered HTML Email Body]                        │   │
│  │                                                     │   │
│  │  Hi John,                                          │   │
│  │                                                     │   │
│  │  Welcome to our platform...                        │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  [Close]                                                   │
└────────────────────────────────────────────────────────────┘
```

#### Specifications (Reuse from Inbox UX)

```css
/* Same modal styling as INBOX_UX.md section 3.4 */
/* Additional: Show all open timestamps if opened multiple times */
```

#### Open History Section

```css
/* Open History List */
margin-top: 8px
padding-left: 16px

/* Open Timestamp Item */
font-size: 13px
color: var(--neutral-600)
line-height: 1.8
display: flex
align-items: center
gap: 8px

/* Bullet Point */
color: var(--success-500)
```

### 3.6 Empty State

#### No Emails Sent Yet

```
┌────────────────────────────────────────────┐
│                                            │
│           [Email Icon]                     │
│                                            │
│     No emails sent yet                     │
│                                            │
│     This lead hasn't received any          │
│     automated emails from workflows        │
│                                            │
└────────────────────────────────────────────┘
```

```css
/* Container */
text-align: center
padding: 60px 40px
background: var(--neutral-50)
border-radius: 8px
margin: 24px 0

/* Icon */
width: 48px
height: 48px
margin: 0 auto 16px
color: var(--neutral-300)

/* Title */
font-size: 16px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 6px

/* Description */
font-size: 14px
color: var(--neutral-500)
line-height: 1.6
max-width: 280px
margin: 0 auto
```

### 3.7 Filter Dropdown

#### Filter Options

```
┌────────────────────────┐
│ All Emails             │
├────────────────────────┤
│ Opened Only            │
│ Unopened Only          │
├────────────────────────┤
│ Welcome Emails         │
│ Thank You Emails       │
│ Follow Up Emails       │
└────────────────────────┘
```

```css
/* Dropdown Menu */
position: absolute
top: calc(100% + 4px)
right: 0
min-width: 200px
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: 8px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
padding: 4px
z-index: 50

/* Dropdown Item */
padding: 10px 12px
font-size: 14px
color: var(--neutral-700)
cursor: pointer
border-radius: 4px
transition: background 0.1s ease

/* Dropdown Item (Hover) */
background: var(--neutral-50)

/* Dropdown Item (Active) */
background: var(--brand-primary-light)
color: var(--brand-primary)
font-weight: 500

/* Divider */
height: 1px
background: var(--neutral-200)
margin: 4px 0
```

---

## 4. Micro-Interactions & Animations

### 4.1 Email Card Hover

```
Trigger: Mouse enters card
Duration: 150ms
Easing: ease-out

Effect:
- Border color: neutral-200 → neutral-300
- Shadow: 0 → 0 2px 8px rgba(0,0,0,0.06)
- Transform: translateY(0) → translateY(-1px)
```

### 4.2 View Email Button Transition

```
Trigger: Hover
Duration: 150ms
Easing: ease-out

Effect:
- Background: transparent → brand-primary
- Color: brand-primary → white
- Border maintains brand-primary
```

### 4.3 Tab Switch Animation

```
Trigger: Tab click
Duration: 200ms
Easing: ease-out

Sequence:
1. Current tab content fades out (100ms)
2. New tab content fades in (200ms, delayed 50ms)
3. Active indicator slides to new position
```

### 4.4 Timeline Item Entrance

```
Trigger: Tab load or filter change
Duration: 300ms
Easing: ease-out

Effect:
- Each card fades in from opacity 0 to 1
- Staggered delay: 50ms per card
- Slide up: translateY(20px) → translateY(0)
```

### 4.5 Modal Open/Close

```
/* Same as Inbox modal animations */
/* Reuse INBOX_UX.md section 4.2 and 4.3 */
```

---

## 5. Responsive Behavior

### Desktop (≥1024px)

- Full timeline layout with all metadata
- Cards: Full width within content area
- Modal: 720px max-width centered

### Tablet (768px - 1023px)

- Timeline layout maintained
- Cards: Slightly condensed padding
- Hide "From workflow" metadata (show in modal only)
- Modal: 85% viewport width

### Mobile (<768px)

- Simplified timeline (thinner line, smaller dots)
- Cards: Reduced padding (12px)
- Subject: Font-size 14px
- Metadata: Stack vertically instead of grid
- Modal: Full-screen slide-up
- Filter dropdown: Full-width modal instead of dropdown

---

## 6. Functional Requirements

### 6.1 Data Loading

**Initial Load**

- Fetch all emails for specific leadId
- Show skeleton loader during fetch
- Default sort: Sent date (newest first)

**Auto-Refresh**

- Check for new emails when tab becomes active
- Optional: Real-time updates via WebSocket

### 6.2 Filtering

**Filter Options**

- All Emails (default)
- Opened Only
- Unopened Only
- By Email Type (Welcome, Thank You, Follow Up)

**Filter Behavior**

- Applied immediately on selection
- Persisted in component state (not URL)
- Reset when navigating away from lead

### 6.3 Email Detail Modal

**Data Displayed**

- Full email metadata
- Rendered HTML email body
- All open timestamps (if multiple opens)
- Workflow and email type context

**Actions**

- Close modal (ESC, click outside, close button)
- No "View Lead Profile" button (already on lead page)

### 6.4 Timeline Grouping

**Date Grouping**

- Group by relative dates: Today, Yesterday, X days ago
- Transition to absolute dates after 7 days
- Format: "January 29, 2025" for dates >7 days old

### 6.5 Performance Optimization

**Lazy Rendering**

- Render only visible cards
- Virtualize if email count exceeds 50
- Email body rendered only when modal opens

---

## 7. Accessibility Requirements

### Keyboard Navigation

**Tab Order**

- Tab nav → Filter dropdown → Email cards → View Email buttons

**Keyboard Shortcuts**

- `Enter` on card - Open email detail modal
- `Escape` - Close modal
- Arrow keys - Navigate between cards

### Screen Reader Support

**Timeline Structure**

- `role="list"` for email list
- `role="listitem"` for each email card

**Status Indicators**

- `aria-label="Email opened 3 times"` for opened status
- `aria-label="Email not opened"` for unopened status

**Modal**

- Same accessibility as Inbox modal
- `role="dialog"`, `aria-modal="true"`
- Focus trap when open

### Color Contrast

- All text meets WCAG AA (4.5:1)
- Status dots paired with text labels
- Focus states have visible 3px outline

---

## 8. Error States

### 8.1 Failed to Load Emails

```
┌────────────────────────────────────────┐
│                                        │
│     [Error Icon]                       │
│                                        │
│     Failed to load email history       │
│                                        │
│     Something went wrong. Please       │
│     try refreshing the page.           │
│                                        │
│     [Try Again]                        │
│                                        │
└────────────────────────────────────────┘
```

```css
/* Same styling as empty state */
/* Error Icon: Red color (var(--error-500)) */
```

### 8.2 Failed to Load Email Details

**Toast Notification**

```
┌───────────────────────────────────┐
│  ⚠️  Failed to load email details │
│  Please try again                 │
└───────────────────────────────────┘
```

---

## 9. Loading States

### 9.1 Initial Tab Load

**Skeleton Loader**

```css
/* Timeline Skeleton */
- Show 3-4 card skeletons with shimmer
- Timeline line visible with skeleton dots
- Same shimmer animation as Inbox

/* Skeleton Card */
height: 160px
background: linear-gradient(
  90deg,
  var(--neutral-100) 25%,
  var(--neutral-50) 50%,
  var(--neutral-100) 75%
)
background-size: 200% 100%
animation: shimmer 1.5s infinite
border-radius: 8px
margin-bottom: 16px
```

### 9.2 Filter Change Loading

- Show subtle spinner in filter button
- Dim cards slightly (opacity 0.6)
- Disable interactions during load

---

## 10. Design Tokens Summary

```css
/* Email History Specific Tokens */
--email-card-border: 1.5px --email-card-radius: 8px --email-card-padding: 16px
  --timeline-line-width: 2px --timeline-dot-size: 16px --timeline-offset: 32px
  /* Status Colors */ --status-opened: var(--success-500)
  --status-unopened: var(--neutral-300) /* Badge Colors (Reuse from Inbox) */
  --badge-welcome-bg: var(--brand-primary-light)
  --badge-welcome-text: var(--brand-primary) --badge-thankyou-bg: #d1fae5
  --badge-thankyou-text: #059669 --badge-followup-bg: #fef3c7
  --badge-followup-text: #d97706;
```

---

## 11. Implementation Checklist

When implementing this design, ensure:

- [ ] Timeline dots properly positioned with vertical line
- [ ] Date separators group emails correctly
- [ ] Email cards show all required metadata
- [ ] Open status indicators are accessible
- [ ] Modal reuses Inbox modal component with minor tweaks
- [ ] Empty state shows when no emails exist
- [ ] Skeleton loader displays during data fetch
- [ ] Filter dropdown works correctly
- [ ] Cards animate in with stagger effect
- [ ] Modal supports ESC key and click-outside to close
- [ ] Tab switching preserves scroll position (optional)
- [ ] All hover states work correctly

---

## 12. Future Enhancement Opportunities

While not required for V1:

1. **Inline Email Preview**: Expand card to show preview without modal
2. **Resend Email**: Button to resend specific email
3. **Email Actions**: Mark as important, add notes
4. **Email Search**: Search within this lead's emails
5. **Export History**: Download email history as PDF/CSV
6. **Email Thread View**: Group related emails (welcome → follow-up)
7. **Delivery Status**: Show bounce/spam/delivery failures
8. **Send Custom Email**: Quick compose from lead page
9. **Email Templates**: See which template was used
10. **A/B Test Indicator**: Show variant if A/B testing enabled

---

## Appendix: Design Rationale

### Why Timeline Over Table?

1. **Chronological Context**: Timeline emphasizes communication sequence
2. **Visual Storytelling**: Shows lead journey over time
3. **Better for Few Items**: Leads typically have 3-10 emails, not hundreds
4. **Mobile Friendly**: Vertical timeline works well on narrow screens

### Why Inline Cards Over Separate Page?

1. **Contextual Access**: Keep email history in lead context
2. **Fewer Clicks**: View emails without leaving lead profile
3. **Related Info**: See lead details alongside email history
4. **Progressive Disclosure**: Open modal only when details needed

### Why Show Open Status Prominently?

1. **Engagement Indicator**: Most important metric for sales
2. **Follow-Up Decision**: Helps determine next action
3. **Conversation Starter**: "I see you opened the email 3 times..."
4. **Workflow Effectiveness**: Quick gauge of email performance

---

**End of Specification**

This document serves as the single source of truth for implementing the FlowTrack Lead Email History component. Any deviations should be documented and approved.
