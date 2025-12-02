# FlowTrack Inbox Page - UI/UX Design Specification

## 1. Visual Strategy & Purpose

### Core Design Philosophy

The Inbox page embodies **"Centralized Email Intelligence"** — providing workspace administrators and team members with a unified view of all automated emails sent through FlowTrack workflows. The interface should communicate:

- **Clarity**: Clean, scannable email list with clear status indicators
- **Efficiency**: Quick filtering and search to find specific emails
- **Transparency**: Full visibility into what was sent, when, and to whom
- **Actionability**: Easy access to email details and lead context

### Visual Tone

**Data-Dense Yet Breathable**

- Structured table layout optimized for scanning
- Strategic use of white space to prevent overwhelming users
- Status indicators using color and iconography
- Consistent with FlowTrack's modern SaaS aesthetic
- TARGET: Gmail/Superhuman inbox experience with workflow context

---

## 2. Page Layout Architecture

### Full-Width Dashboard Structure

```
┌────────────────────────────────────────────────────────────────────┐
│  [Sidebar Nav]  │  MAIN CONTENT AREA                               │
│                 │                                                   │
│  Dashboard      │  ┌─────────────────────────────────────────────┐ │
│  Leads          │  │  Inbox                              [Search] │ │
│  Workflows      │  └─────────────────────────────────────────────┘ │
│  Forms          │                                                   │
│→ Inbox   ←      │  ┌─────────────────────────────────────────────┐ │
│  Settings       │  │  [All] [Opened] [Unopened] [Workflows ▼]    │ │
│                 │  └─────────────────────────────────────────────┘ │
│                 │                                                   │
│                 │  ┌─────────────────────────────────────────────┐ │
│                 │  │  EMAIL LIST TABLE                           │ │
│                 │  │  ┌──────────────────────────────────────┐   │ │
│                 │  │  │ ● Lead Name  Subject          Date   │   │ │
│                 │  │  ├──────────────────────────────────────┤   │ │
│                 │  │  │ ○ Lead Name  Subject          Date   │   │ │
│                 │  │  └──────────────────────────────────────┘   │ │
│                 │  └─────────────────────────────────────────────┘ │
│                 │                                                   │
│                 │  [Pagination: 1 2 3 ... 10]                      │
└────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (≥1024px)**: Full table view with all columns
- **Tablet (768px - 1023px)**: Condensed columns, hide secondary info
- **Mobile (<768px)**: Card-based list, stacked information

---

## 3. Component Specifications

### 3.1 Page Header

#### Visual Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Inbox                                        [Search input]  │
│  All automated emails sent from workflows                    │
└──────────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
padding: 32px 40px 24px 40px
background: #FFFFFF
border-bottom: 1px solid var(--neutral-200)

/* Title */
font-size: 28px
font-weight: 700
color: var(--neutral-900)
margin-bottom: 4px

/* Subtitle */
font-size: 14px
font-weight: 400
color: var(--neutral-500)
line-height: 1.5

/* Search Input (Right-aligned) */
position: absolute
right: 40px
top: 32px
width: 320px
height: 40px
```

### 3.2 Filter Bar

#### Visual Structure

```
┌────────────────────────────────────────────────────────────┐
│  [All (243)] [Opened (189)] [Unopened (54)]               │
│                                                            │
│  [Workflows ▼] [Email Type ▼] [Date Range ▼]              │
└────────────────────────────────────────────────────────────┘
```

#### Tab-Style Status Filters

```css
/* Container */
display: flex
gap: 8px
padding: 16px 40px
background: var(--neutral-50)
border-bottom: 1px solid var(--neutral-200)

/* Tab Button (Inactive) */
padding: 8px 16px
font-size: 14px
font-weight: 500
color: var(--neutral-600)
background: transparent
border: none
border-bottom: 2px solid transparent
cursor: pointer
transition: all 0.15s ease

/* Tab Button (Active) */
color: var(--brand-primary)
border-bottom: 2px solid var(--brand-primary)
background: #FFFFFF

/* Tab Button (Hover) */
color: var(--neutral-900)
background: #FFFFFF

/* Count Badge */
display: inline
margin-left: 6px
font-size: 13px
color: var(--neutral-500)
font-weight: 400
```

#### Dropdown Filters

```css
/* Dropdown Container */
display: inline-block
position: relative

/* Dropdown Button */
padding: 8px 12px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: 6px
cursor: pointer
transition: all 0.15s ease

/* Dropdown Button (Hover) */
border-color: var(--neutral-300)
background: var(--neutral-50)

/* Dropdown Icon */
margin-left: 8px
width: 16px
height: 16px
color: var(--neutral-400)

/* Dropdown Menu */
position: absolute
top: calc(100% + 4px)
left: 0
min-width: 200px
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: 8px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
z-index: 50
```

### 3.3 Email List Table

#### Table Structure

```
┌─────┬──────────────────┬────────────────────────┬─────────────┬────────────┬──────────┐
│ ●/○ │ Lead             │ Subject                │ Workflow    │ Email Type │ Sent     │
├─────┼──────────────────┼────────────────────────┼─────────────┼────────────┼──────────┤
│  ●  │ John Smith       │ Welcome! Here's your   │ Outbound    │ Welcome    │ 2 hrs ago│
│     │ john@example.com │ booking link           │ Sales       │            │          │
├─────┼──────────────────┼────────────────────────┼─────────────┼────────────┼──────────┤
│  ○  │ Sarah Johnson    │ Thanks for submitting  │ Outbound    │ Thank You  │ 1 day ago│
│     │ sarah@test.com   │ your information       │ Sales       │            │          │
└─────┴──────────────────┴────────────────────────┴─────────────┴────────────┴──────────┘
```

#### Column Specifications

**Open Status Indicator (40px)**

```css
width: 40px
text-align: center

/* Opened */
● Green dot (var(--success-500))
size: 10px
border-radius: 50%

/* Unopened */
○ Gray circle outline (var(--neutral-300))
size: 10px
border: 1.5px solid
```

**Lead Column (200px)**

```css
/* Lead Name */
font-size: 14px
font-weight: 600
color: var(--neutral-900)
line-height: 1.3

/* Lead Email */
font-size: 13px
font-weight: 400
color: var(--neutral-500)
margin-top: 2px
line-height: 1.3
```

**Subject Column (Flexible, min 300px)**

```css
font-size: 14px
font-weight: 500
color: var(--neutral-700)
line-height: 1.4
white-space: nowrap
overflow: hidden
text-overflow: ellipsis
max-width: 400px
```

**Workflow Column (180px)**

```css
font-size: 14px
font-weight: 400
color: var(--neutral-700)
```

**Email Type Column (120px)**

```css
/* Badge Style */
display: inline-block
padding: 4px 10px
font-size: 12px
font-weight: 500
border-radius: 12px
text-transform: capitalize

/* Welcome Email */
background: var(--brand-primary-light)
color: var(--brand-primary)

/* Thank You Email */
background: #D1FAE5
color: #059669

/* Follow Up Email */
background: #FEF3C7
color: #D97706
```

**Sent Column (120px)**

```css
font-size: 13px
font-weight: 400
color: var(--neutral-500)
text-align: right
```

#### Table Row Specifications

```css
/* Base Row */
height: 72px
padding: 12px 16px
border-bottom: 1px solid var(--neutral-100)
cursor: pointer
transition: background 0.1s ease

/* Hover State */
background: var(--neutral-50)

/* Active/Selected State */
background: var(--brand-primary-light)
border-left: 3px solid var(--brand-primary)
```

### 3.4 Email Detail Modal

#### Modal Structure

```
┌────────────────────────────────────────────────────────────┐
│  Email Details                                      [✕]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  From:     noreply@flowtrack.app (System)                 │
│  To:       john@example.com (John Smith)                  │
│  Subject:  Welcome! Here's your booking link              │
│  Sent:     January 29, 2025 at 2:34 PM                    │
│  Status:   ● Opened (3 times)                             │
│            Last opened: January 29, 2025 at 3:15 PM       │
│                                                            │
│  Workflow: Outbound Sales                                 │
│  Type:     Welcome Email                                  │
│                                                            │
│  ──────────────────────────────────────────────────────── │
│                                                            │
│  EMAIL CONTENT PREVIEW                                    │
│  ┌────────────────────────────────────────────────────┐   │
│  │  [Rendered HTML Email Body]                        │   │
│  │                                                     │   │
│  │  Hi John,                                          │   │
│  │                                                     │   │
│  │  Welcome to our platform! Here's your...          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  [View Lead Profile] [Close]                              │
└────────────────────────────────────────────────────────────┘
```

#### Modal Specifications

```css
/* Modal Overlay */
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)
z-index: 100
display: flex
align-items: center
justify-content: center

/* Modal Container */
width: 90%
max-width: 720px
max-height: 85vh
background: #FFFFFF
border-radius: 12px
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
overflow: hidden
display: flex
flex-direction: column

/* Modal Header */
padding: 20px 24px
border-bottom: 1px solid var(--neutral-200)
background: var(--neutral-50)

/* Title */
font-size: 20px
font-weight: 600
color: var(--neutral-900)

/* Close Button */
position: absolute
top: 20px
right: 24px
width: 32px
height: 32px
border-radius: 6px
background: transparent
border: none
cursor: pointer
color: var(--neutral-500)

/* Close Button (Hover) */
background: var(--neutral-200)
color: var(--neutral-900)

/* Modal Body */
padding: 24px
overflow-y: auto
flex: 1
```

#### Metadata Section

```css
/* Field Row */
display: grid
grid-template-columns: 100px 1fr
gap: 12px
margin-bottom: 12px
font-size: 14px

/* Field Label */
font-weight: 600
color: var(--neutral-700)

/* Field Value */
font-weight: 400
color: var(--neutral-900)

/* Status with Open Indicator */
display: flex
align-items: center
gap: 8px

/* Open Count */
color: var(--success-600)
font-weight: 500
```

#### Email Content Preview

```css
/* Container */
margin-top: 24px
border-top: 1px solid var(--neutral-200)
padding-top: 24px

/* Section Title */
font-size: 12px
font-weight: 600
color: var(--neutral-500)
text-transform: uppercase
letter-spacing: 0.05em
margin-bottom: 12px

/* Email Body Frame */
border: 1px solid var(--neutral-200)
border-radius: 8px
padding: 20px
background: #FFFFFF
max-height: 400px
overflow-y: auto

/* Scrollbar Styling */
scrollbar-width: thin
scrollbar-color: var(--neutral-300) var(--neutral-100)
```

#### Modal Footer

```css
/* Container */
padding: 16px 24px
border-top: 1px solid var(--neutral-200)
background: var(--neutral-50)
display: flex
gap: 12px
justify-content: flex-end

/* View Lead Profile Button */
padding: 10px 20px
font-size: 14px
font-weight: 500
color: var(--brand-primary)
background: #FFFFFF
border: 1px solid var(--brand-primary)
border-radius: 6px
cursor: pointer

/* Close Button */
padding: 10px 20px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: var(--neutral-100)
border: none
border-radius: 6px
cursor: pointer
```

### 3.5 Search Input

```css
/* Container */
position: relative
width: 320px

/* Input Field */
width: 100%
height: 40px
padding: 0 40px 0 16px
font-size: 14px
border: 1px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 0.15s ease

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)

/* Search Icon */
position: absolute
right: 12px
top: 50%
transform: translateY(-50%)
width: 20px
height: 20px
color: var(--neutral-400)
pointer-events: none
```

### 3.6 Pagination

```css
/* Container */
display: flex
justify-content: center
align-items: center
gap: 8px
padding: 24px 0

/* Page Button */
width: 36px
height: 36px
display: flex
align-items: center
justify-content: center
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: 6px
cursor: pointer
transition: all 0.15s ease

/* Active Page */
background: var(--brand-primary)
color: #FFFFFF
border-color: var(--brand-primary)

/* Hover State */
background: var(--neutral-50)
border-color: var(--neutral-300)

/* Ellipsis */
width: auto
padding: 0 8px
border: none
cursor: default
background: transparent
```

### 3.7 Empty State

```
┌────────────────────────────────────────────┐
│                                            │
│            [Email Icon]                    │
│                                            │
│     No emails sent yet                     │
│                                            │
│     Emails sent through automated          │
│     workflows will appear here             │
│                                            │
│     [Create Workflow]                      │
│                                            │
└────────────────────────────────────────────┘
```

```css
/* Container */
text-align: center
padding: 80px 40px
background: var(--neutral-50)
border-radius: 12px
margin: 40px

/* Icon */
width: 64px
height: 64px
margin: 0 auto 24px
color: var(--neutral-300)

/* Title */
font-size: 18px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 8px

/* Description */
font-size: 14px
color: var(--neutral-500)
line-height: 1.6
max-width: 320px
margin: 0 auto 24px

/* CTA Button */
padding: 10px 20px
font-size: 14px
font-weight: 500
color: #FFFFFF
background: var(--brand-primary)
border: none
border-radius: 6px
cursor: pointer
```

---

## 4. Micro-Interactions & Animations

### 4.1 Table Row Hover

```
Trigger: Mouse enters row
Duration: 100ms
Easing: ease-out

Effect:
- Background transitions to neutral-50
- Subtle scale: 1.0 → 1.002 (barely perceptible depth)
```

### 4.2 Modal Open Animation

```
Trigger: User clicks email row
Duration: 250ms
Easing: ease-out

Sequence:
1. Overlay fades in (opacity 0 → 1)
2. Modal scales from 0.95 to 1.0
3. Modal fades in (opacity 0 → 1)
4. All transitions happen simultaneously
```

### 4.3 Modal Close Animation

```
Trigger: Close button click or outside click
Duration: 200ms
Easing: ease-in

Sequence:
1. Modal scales from 1.0 to 0.95
2. Modal and overlay fade out
3. Remove from DOM after animation
```

### 4.4 Filter Change Animation

```
Trigger: Filter tab click or dropdown selection
Duration: 150ms

Effect:
1. Table rows fade out (opacity 1 → 0) - 100ms
2. Loading spinner appears (if data fetch needed)
3. New rows fade in (opacity 0 → 1) - 150ms
```

### 4.5 Search Input Debounce

```
Trigger: User types in search
Debounce: 300ms
Visual feedback:
- Show loading spinner in search icon position after debounce
- Spinner appears only if search takes >100ms
```

---

## 5. Responsive Behavior

### Desktop (≥1024px)

- Full table with all columns visible
- Modal: 720px max-width
- Search: Full 320px width
- Pagination: Full button layout

### Tablet (768px - 1023px)

- Hide "Email Type" column
- Reduce "Workflow" column to icon with tooltip
- Search: 240px width
- Modal: 85% viewport width
- Pagination: Condensed (show fewer page numbers)

### Mobile (<768px)

- Switch to card-based layout (not table)
- Each email as a card:
  ```
  ┌─────────────────────────────────┐
  │ ● John Smith                    │
  │   john@example.com              │
  │                                 │
  │   Welcome! Here's your...       │
  │                                 │
  │   Outbound Sales • Welcome      │
  │   2 hours ago                   │
  └─────────────────────────────────┘
  ```
- Search: Full width minus padding
- Modal: Full viewport width, slide up from bottom
- Filters: Stack vertically or horizontal scroll

---

## 6. Functional Requirements

### 6.1 Email List Loading

**Initial Load**

- Fetch first 50 emails (most recent)
- Show skeleton loader during fetch
- Default sort: Sent date (newest first)

**Pagination**

- 50 emails per page
- Lazy load on scroll (alternative to page numbers)
- Cache previous page in memory

### 6.2 Filtering

**Status Filters** (Tab-style)

- All: Shows all emails
- Opened: lastEmailOpenedAt is not null
- Unopened: lastEmailOpenedAt is null

**Dropdown Filters**

- Workflows: Multi-select workflow filter
- Email Type: Welcome | Thank You | Follow Up
- Date Range: Today | Last 7 days | Last 30 days | Custom

**Combined Filters**

- Filters are cumulative (AND logic)
- Update URL query params for shareable links
- Preserve filters on page refresh

### 6.3 Search Functionality

**Search Scope**

- Lead name
- Lead email
- Email subject
- Email body (optional for performance)

**Search Behavior**

- Debounced input (300ms)
- Minimum 2 characters
- Case-insensitive
- Highlight matches in results (optional enhancement)

### 6.4 Email Detail Modal

**Data Displayed**

- Full email metadata
- Rendered HTML email body
- Open tracking stats (count and timestamps)
- Link to lead profile

**Actions**

- View Lead Profile (navigates to lead detail page)
- Close modal (ESC key or click outside)

### 6.5 Real-time Updates

**Optional Enhancement**

- WebSocket connection for new emails
- Show toast notification when new email sent
- Update table without full reload

---

## 7. Accessibility Requirements

### Keyboard Navigation

**Tab Order**

- Search input → Filter tabs → Dropdown filters → Table rows → Pagination

**Keyboard Shortcuts**

- `/` - Focus search input
- `Escape` - Close modal or clear search
- `Enter` on table row - Open email detail modal
- Arrow keys - Navigate table rows

### Screen Reader Support

**Table Structure**

- Proper `<table>`, `<thead>`, `<tbody>` semantics
- Column headers with `scope="col"`
- Row headers with `scope="row"` for lead names

**Status Indicators**

- `aria-label="Email opened"` for green dot
- `aria-label="Email not opened"` for gray circle

**Modal**

- `role="dialog"`
- `aria-labelledby` for modal title
- `aria-modal="true"`
- Focus trap inside modal when open
- Return focus to trigger element on close

### Color Contrast

- All text meets WCAG AA (4.5:1)
- Status indicators use icons + color (not color alone)
- Focus states have visible outline

---

## 8. Error States

### 8.1 Failed to Load Emails

```
┌────────────────────────────────────────┐
│                                        │
│     [Error Icon]                       │
│                                        │
│     Failed to load emails              │
│                                        │
│     Something went wrong while         │
│     loading your inbox.                │
│                                        │
│     [Try Again]                        │
│                                        │
└────────────────────────────────────────┘
```

```css
/* Same styling as empty state */
/* Error Icon: Red color (var(--error-500)) */
/* Try Again button: Primary brand style */
```

### 8.2 Search Returns No Results

```
┌────────────────────────────────────────┐
│                                        │
│     No emails found                    │
│                                        │
│     Try adjusting your search or       │
│     filters                            │
│                                        │
│     [Clear Filters]                    │
│                                        │
└────────────────────────────────────────┘
```

### 8.3 Failed to Load Email Details

**Toast Notification** (bottom-right)

```
┌───────────────────────────────────┐
│  ⚠️  Failed to load email details │
│  Please try again                 │
└───────────────────────────────────┘
```

---

## 9. Loading States

### 9.1 Initial Page Load

**Skeleton Loader**

- Show table structure with animated skeleton rows
- 10 skeleton rows visible
- Shimmer animation (1.5s loop)

```css
/* Skeleton Row */
height: 72px
background: linear-gradient(
  90deg,
  var(--neutral-100) 25%,
  var(--neutral-50) 50%,
  var(--neutral-100) 75%
)
background-size: 200% 100%
animation: shimmer 1.5s infinite
border-radius: 4px

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### 9.2 Filter Change Loading

- Show subtle loading spinner in top-right
- Dim table slightly (opacity 0.6)
- Disable interactions during load

### 9.3 Pagination Loading

- Replace clicked page number with spinner
- Disable other page buttons
- Load and fade in new page

---

## 10. Design Tokens Summary

```css
/* Inbox-Specific Tokens */
--inbox-row-height: 72px --inbox-status-dot-size: 10px
  --inbox-badge-radius: 12px /* Table Colors */
  --table-header-bg: var(--neutral-50) --table-border: var(--neutral-100)
  --table-row-hover: var(--neutral-50)
  --table-row-selected: var(--brand-primary-light) /* Email Type Badge Colors */
  --badge-welcome-bg: var(--brand-primary-light)
  --badge-welcome-text: var(--brand-primary) --badge-thankyou-bg: #d1fae5
  --badge-thankyou-text: #059669 --badge-followup-bg: #fef3c7
  --badge-followup-text: #d97706 /* Modal */ --modal-overlay: rgba(0, 0, 0, 0.5)
  --modal-max-width: 720px --modal-radius: 12px;
```

---

## 11. Implementation Checklist

When implementing this design, ensure:

- [ ] Table is responsive with mobile card fallback
- [ ] Filters update URL query params for shareability
- [ ] Search is debounced (300ms) to reduce API calls
- [ ] Email detail modal traps focus and supports ESC key
- [ ] Skeleton loader shows during initial data fetch
- [ ] Open status indicators are accessible (not color-only)
- [ ] Pagination handles edge cases (first/last page)
- [ ] Empty state shows when no emails exist
- [ ] Error states handle failed API requests gracefully
- [ ] All interactive elements have hover/focus states
- [ ] Modal click-outside closes modal
- [ ] Table rows are keyboard navigable

---

## 12. Future Enhancement Opportunities

While not required for V1:

1. **Bulk Actions**: Select multiple emails for batch operations
2. **Export**: Download email list as CSV
3. **Advanced Filters**: Custom date ranges, multiple workflows, sender type
4. **Email Preview on Hover**: Quick preview tooltip without opening modal
5. **Resend Email**: Ability to resend failed emails
6. **Email Templates**: Filter by specific template used
7. **Delivery Status**: Track bounces, spam reports, delivery failures
8. **Real-time Updates**: WebSocket connection for live email updates
9. **Email Threading**: Group related emails (follow-ups to same lead)
10. **Performance Metrics**: Aggregate stats (open rate by workflow, etc.)

---

## Appendix: Design Rationale

### Why Table Over Cards?

1. **Data Density**: Users need to scan many emails quickly
2. **Sortability**: Tables are more intuitive for sorting columns
3. **Comparison**: Side-by-side comparison of email metadata
4. **Professional Standard**: Email clients use table/list layouts

### Why Status Dots Over Badges?

1. **Visual Efficiency**: Dots take less space than "Opened" badges
2. **Scannable**: Users can quickly scan for unopened emails
3. **Less Clutter**: Keeps focus on subject and lead name

### Why Separate Inbox Page?

1. **Workspace-Level View**: See all emails across all workflows
2. **Dedicated Space**: Inbox deserves focused attention
3. **Scalability**: Can add more features without cluttering lead pages
4. **Navigation**: Natural place in main navigation

---

**End of Specification**

This document serves as the single source of truth for implementing the FlowTrack Inbox page. Any deviations should be documented and approved.
