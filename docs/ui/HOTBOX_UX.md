## Hotbox – Email Conversation Management UX Specification

### 1. Purpose & Role

- **Goal**: Manage all email conversations with leads - both replies received and emails sent awaiting response
- **Analogy**: "Superhuman meets HubSpot" - Email client efficiency with CRM context
- **Core Features**:
  - **"Needs Reply" tab**: Conversations where leads have replied (INBOUND messages exist)
  - **"Sent" tab**: Emails sent that haven't received replies yet
  - **3-Column Layout**: Lead context + Conversation thread + Message details/Quick reply
  - **Real-time sync**: IMAP polling detects new replies automatically

---

### 2. Layout Overview

**Desktop layout (≥1280px)** – Three-Column Design:

- **Left column (Lead Summary)** – 320px fixed width
- **Middle column (Conversation Thread)** – Flex-grow (remaining space)
- **Right column (Message Details + Quick Reply)** – 360px fixed width

**Tablet layout (768px - 1279px)**:

- **Two-column**: Hide left panel, show middle + right
- Back button in thread header to return to list
- Lead summary collapses to compact header bar

**Mobile (<768px)**:

- **Single column**: Stack vertically
- List view → Thread view (full-screen) → Back button
- Quick reply integrated at bottom of thread

---

### 3. Tab Navigation & Conversation States

#### 3.1 Tabs (Top of Page)

**Two tabs** - NO email type filter:

- **🔥 Needs Reply (3)** - Priority tab, RED accent when active

  - Shows: Leads that have replied (have INBOUND messages)
  - Sort: Most recent reply first
  - Visual: Red underline when active, urgent styling

- **📤 Sent (12)** - Secondary tab, GRAY accent when active
  - Shows: Emails sent with no replies yet
  - Sort: Most recent sent first
  - Visual: Gray underline when active

#### 3.2 No Selection State - Conversation List

When no conversation is selected, show **full-width conversation cards**:

```
┌────────────────────────────────────────────────────────┐
│  [Avatar] Lead Name (lead@example.com)        🔴 Unread│
│           Latest: "Hi, thanks for following up..."     │
│           3 messages • Last reply 5 min ago            │
└────────────────────────────────────────────────────────┘
```

Card styling:

- Padding: `16px`
- Border: `1px solid #E5E7EB`, radius `8px`
- Hover: Border changes to brand-primary, subtle shadow
- Background: White
- Unread indicator: Red dot (8px) top-right

#### 3.3 Selected State - Three-Column Layout

When conversation clicked, transition to 3-column layout:

```
┌──────────┬─────────────────────────┬──────────────┐
│   LEAD   │    CONVERSATION         │   MESSAGE    │
│  SUMMARY │      THREAD             │   DETAILS    │
│  320px   │    Flex-grow            │   360px      │
└──────────┴─────────────────────────┴──────────────┘
```

---

### 4. Left Column – Lead Summary Panel

**Width**: 320px fixed
**Background**: `#FFFFFF`
**Border-right**: `1px solid #E5E7EB`
**Padding**: `24px`

#### Content Structure:

1. **Avatar** (80px circle, centered)

   - Gradient background with initials
   - Gradient: `linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)`

2. **Lead Name** (centered)

   - Font: 20px, weight 600
   - Color: `#111827`

3. **Email** (centered)

   - Font: 14px
   - Color: `#6B7280`

4. **Stats Grid** (key-value pairs)

   - Status: `EMAIL_SENT` / `RESPONDED`
   - Score: `85`
   - Messages: `3`
   - Last Activity: `5 min ago`

5. **Quick Actions**
   - `[View Full Profile]` - Opens lead detail
   - `[Edit Lead]` - Edit inline or modal

---

### 5. Middle Column – Conversation Thread View

**Width**: Flex-grow (remaining space)
**Background**: `#F9FAFB` (subtle gray)
**Padding**: `24px`
**Scroll**: Independent vertical scroll

#### 5.1 Thread Header

- **Title**: "Thread with [Lead Name]"
  - Font: 24px, weight 600
  - Color: `#111827`
- **Separator**: 2px border-bottom, color `#E5E7EB`

#### 5.2 Message Bubbles - Visual Distinction

**Date Separators** between days:

- Text: "Nov 30, 2025"
- Font: 13px, weight 600, uppercase
- Color: `#6B7280`
- Margin: 24px top/bottom

**INBOUND Messages** (Lead Replies):

```
┌──────────────────────────────────────────┐
│ 📥 INBOUND • 1:47 PM                     │
│ From: lead@example.com                   │
│ Subject: Re: Thanks for reaching out!    │
│                                          │
│ Hi, thanks for following up!             │
│ I'd love to schedule a call this week... │
└──────────────────────────────────────────┘
```

- **Background**: `#EFF6FF` (Blue 50) - Stands out
- **Border-left**: 4px solid `#3B82F6` (Blue 500)
- **Padding**: 16px
- **Border-radius**: 8px
- **Cursor**: Pointer (clickable to show in right panel)
- **Hover**: Box shadow appears

**OUTBOUND Messages** (Sent Emails):

```
┌──────────────────────────────────────────┐
│ 📤 OUTBOUND • 1:45 PM                    │
│ To: lead@example.com                     │
│ Subject: Thanks for reaching out!        │
│                                          │
│ Hi Lead Name,                            │
│ Thanks for reaching out! I noticed...    │
└──────────────────────────────────────────┘
```

- **Background**: `#F9FAFB` (Gray 50) - Subtle
- **Border-left**: 4px solid `#D1D5DB` (Gray 300)
- **Padding**: 16px
- **Border-radius**: 8px
- **Cursor**: Pointer
- **Hover**: Box shadow appears

#### 5.3 Message Content Structure

Each message bubble contains:

1. **Header Row**:

   - Direction icon + label (`📥 INBOUND` or `📤 OUTBOUND`)
   - Timestamp (right-aligned)

2. **From/To Line**:

   - `From: lead@example.com` (INBOUND)
   - `To: lead@example.com` (OUTBOUND)

3. **Subject Line** (if present):

   - Font: 14px, weight 600
   - Color: `#374151`

4. **Body Text**:
   - Font: 15px, line-height 1.6
   - Color: `#374151`
   - Preserves formatting (new lines, spacing)

#### 5.4 Thread Behavior

- **Auto-scroll**: Scroll to latest (top) message when conversation opens
- **Sort Order**: Newest first (most recent reply at top)
- **Click**: Clicking any message shows its details in right panel
- **Selected State**: 2px border in brand-primary color

---

### 6. Right Column – Message Details & Quick Reply

**Width**: 360px fixed
**Background**: `#FFFFFF`
**Border-left**: `1px solid #E5E7EB`
**Padding**: `24px`
**Scroll**: Independent vertical scroll

#### 6.1 Message Details Section

**Header**: "Message Details"

- Font: 18px, weight 600
- Border-bottom: 2px solid `#E5E7EB`
- Padding-bottom: 16px

**Fields** (when message selected):

- **From**: `lead@example.com`
- **To**: `flowtrackrelay+leadId@gmail.com`
- **Date**: `Nov 30, 2025 1:47 AM`
- **Subject**: `Re: Thanks for reaching out!`
- **Message ID**: `<abc123@gmail.com>`

Field styling:

- Label: 12px, weight 600, uppercase, `#6B7280`
- Value: 14px, `#374151`
- Margin-bottom: 16px per field

**Separator**: 1px line, `#E5E7EB`, margin 24px

#### 6.2 Quick Reply Section

**Label**: "Quick Reply"

- Font: 14px, weight 600
- Margin-bottom: 12px

**Textarea**:

- Width: 100%
- Min-height: 120px
- Padding: 12px
- Border: 1px solid `#E5E7EB`
- Border-radius: 6px
- Font: 14px, line-height 1.5
- **Focus**: Border changes to `#4F46E5`, adds 3px glow in `#EEF2FF`
- **Placeholder**: "Type your reply..."
- **Resize**: Vertical

**Send Button**:

- Width: 100%
- Padding: 10px 16px
- Background: `#4F46E5` (brand-primary)
- Color: White
- Border-radius: 6px
- Font: 14px, weight 600
- **Hover**: Background `#4338CA`
- **Disabled**: Background `#D1D5DB`, not clickable
- **Loading**: Shows spinner, text "Sending..."

**Behavior**:

- Click "Send Reply" → Calls API
- On success:
  - New OUTBOUND message appears in thread
  - Scroll to new message
  - Clear textarea
  - Show toast: "Reply sent!"
- On error:
  - Preserve textarea content
  - Show toast: "Failed to send. Try again."
  - Re-enable button

---

### 7. Empty & Loading States

#### 7.1 No Conversations in "Needs Reply"

```
┌────────────────────────────────────┐
│           📭                       │
│     No replies yet!                │
│  You're all caught up.             │
│                                    │
│  New replies will appear here      │
│  when leads respond to your emails.│
└────────────────────────────────────┘
```

- Center-aligned
- Icon: 48px
- Title: 20px, weight 600
- Subtitle: 14px, color `#6B7280`

#### 7.2 No Conversations in "Sent"

```
┌────────────────────────────────────┐
│           📤                       │
│   No emails sent yet               │
│                                    │
│  Send your first email via         │
│  workflow automation or manually.  │
└────────────────────────────────────┘
```

#### 7.3 No Message Selected (Right Panel)

```
┌────────────────────────────────────┐
│           ✉️                       │
│    Select a message                │
│    to view details                 │
└────────────────────────────────────┘
```

#### 7.4 Loading States

**Conversation List Loading**:

- Show 3-4 skeleton cards
- Pulsing gray rectangles
- Match card dimensions

**Thread Loading**:

- Show 2-3 skeleton message bubbles
- Alternate INBOUND/OUTBOUND positions
- Pulsing animation (1.5s cycle)

**Send Reply Loading**:

- Button disabled
- Spinner icon appears
- Text: "Sending..."

---

### 8. Error States & Handling

#### 8.1 Failed to Load Conversations

```
┌────────────────────────────────────┐
│           ⚠️                       │
│   Failed to load conversations     │
│                                    │
│   [Retry]                          │
└────────────────────────────────────┘
```

#### 8.2 Failed to Send Reply

- Toast notification (top-right corner)
  - Background: `#FEE2E2` (Red 100)
  - Text: "Failed to send reply. Please try again."
  - Duration: 5 seconds
  - Dismissible
- Reply textarea **preserves** content (don't clear)
- Button re-enabled for retry

#### 8.3 Failed to Load Thread

- Show error message in middle column
- "Failed to load conversation. [Retry]"

---

### 9. Keyboard Navigation & Power-User Flows

#### 9.1 Tab Navigation

- `Tab` / `Shift+Tab`: Move between tab buttons
- `Enter` / `Space`: Activate selected tab
- `/`: Focus search box (if implemented)

#### 9.2 Conversation List

- `↓` / `↑`: Navigate conversation cards
- `Enter`: Open conversation in 3-column view
- `Esc`: Deselect conversation, return to list view

#### 9.3 Thread View

- `↓` / `↑`: Navigate messages in thread
- `Enter`: Select message (show in right panel)
- `r`: Focus quick reply textarea
- `Cmd/Ctrl + Enter`: Send reply

#### 9.4 Accessibility

- All interactive elements have visible focus rings (2px solid brand-primary)
- Screen reader announcements:
  - "Inbound reply from [name]" vs "Outbound email to [name]"
  - "Unread" indicator announced
  - Tab counts announced: "Needs Reply, 3 conversations"
- Color contrast ratios: Minimum 4.5:1 for text
- Keyboard focus management (trap in modals, restore on close)

---

### 10. Design Tokens & Color Reference

```css
/* Panel Widths */
--hotbox-lead-panel-width: 320px;
--hotbox-details-panel-width: 360px;

/* Message Direction Colors */
--hotbox-inbound-bg: #eff6ff; /* Blue 50 */
--hotbox-inbound-border: #3b82f6; /* Blue 500 */
--hotbox-outbound-bg: #f9fafb; /* Gray 50 */
--hotbox-outbound-border: #d1d5db; /* Gray 300 */

/* Tab Colors */
--hotbox-tab-needs-reply: #ef4444; /* Red 500 - Urgent */
--hotbox-tab-sent: #6b7280; /* Gray 500 - Neutral */

/* Status Indicators */
--hotbox-status-unread: #ef4444; /* Red dot */
--hotbox-status-read: #10b981; /* Green */

/* Backgrounds */
--hotbox-panel-lead-bg: #ffffff;
--hotbox-panel-thread-bg: #f9fafb;
--hotbox-panel-details-bg: #ffffff;

/* Borders */
--hotbox-border-color: #e5e7eb; /* Neutral 200 */

/* Brand Colors */
--brand-primary: #4f46e5; /* Indigo 600 */
--brand-primary-hover: #4338ca; /* Indigo 700 */
--brand-primary-light: #eef2ff; /* Indigo 50 */
```

---

### 11. Implementation Checklist

**Backend**:

- [ ] Create `HotboxService` in `message.service.ts`
  - [ ] `getConversationsNeedingReply()` - Group by lead, filter INBOUND exists
  - [ ] `getConversationsSentOnly()` - Group by lead, filter NO INBOUND
  - [ ] Return: Lead info + message count + last activity + preview
- [ ] Create `HotboxController` with endpoints
  - [ ] `GET /workspaces/:id/hotbox/needs-reply`
  - [ ] `GET /workspaces/:id/hotbox/sent`
- [ ] Create Zod DTOs for validation
- [ ] Update `EmailRelayModule` to register controller
- [ ] Add URL endpoints to backend `url.ts`

**Frontend**:

- [ ] Create `hotbox` feature directory structure
- [ ] Rename `/app/inbox` → `/app/hotbox`
- [ ] Update navigation links in sidebar
- [ ] Add hotbox endpoints to frontend `url.ts`
- [ ] Create API service (`hotbox-api.ts`)
- [ ] Create custom hooks:
  - [ ] `useHotboxConversations(tab)` - Fetch list
  - [ ] `useConversationThread(leadId)` - Fetch thread
  - [ ] `useSendReply(leadId)` - Send mutation
- [ ] Build components:
  - [ ] `ThreeColumnLayout` - Responsive grid
  - [ ] `ConversationList` - Card list
  - [ ] `ConversationCard` - Individual card
  - [ ] `LeadSummaryPanel` - Left column
  - [ ] `ConversationThreadView` - Middle column
  - [ ] `MessageBubble` - Individual message
  - [ ] `MessageDetailsPanel` - Right column
  - [ ] `QuickReplyForm` - Reply textarea + button
- [ ] Implement `HotboxScreen` - Main orchestrator
- [ ] Add loading skeletons
- [ ] Add empty states
- [ ] Add error boundaries
- [ ] Test responsive layouts
- [ ] Test keyboard navigation
- [ ] Verify accessibility (focus, screen readers)

**Polish**:

- [ ] Add smooth transitions (tab switch, layout changes)
- [ ] Implement optimistic UI updates
- [ ] Add toast notifications
- [ ] Test with real conversation data
- [ ] Performance optimization (virtualize long lists)

---

### 12. Future Enhancements

1. **Real-time Updates**: WebSocket for instant reply notifications
2. **Message Search**: Full-text search across conversations
3. **Conversation Filtering**: By lead status, score, tags
4. **Bulk Actions**: Mark multiple as read, archive
5. **Email Templates**: Quick reply templates
6. **AI Suggestions**: Smart reply recommendations
7. **Snooze**: Hide conversations temporarily
8. **Labels/Tags**: Categorize conversations
9. **Team Assignment**: Assign to team members
10. **Analytics**: Response times, resolution rates

---

### 13. Appendix: Design Rationale

**Why "Hotbox"?**

- Emphasizes urgency ("hot" = needs attention)
- Action-oriented, not passive viewing
- Differentiates from traditional email inbox

**Why 3-Column Layout?**

- Lead context always visible
- Full conversation history in view
- Quick reply without modal switching
- Familiar email client pattern

**Why Color-Code Messages?**

- Blue (INBOUND) = "They said" - High priority
- Gray (OUTBOUND) = "I said" - Reference
- Instant visual distinction
- Threading clarity

**Why "Needs Reply" First?**

- Priority-driven workflow
- Action items before informational
- Reduces decision fatigue
