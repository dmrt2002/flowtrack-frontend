## Hotbox – UX Specification (Work View)

### 1. Purpose & Role

- **Goal**: Triage and respond to leads that need human attention. Automation is stopped for all leads in Hotbox.
- **Analogy**: “Superhuman for sales replies.”
- **Entry point**: From Command Center when `In Hotbox` > 0.

---

### 2. Layout Overview

Desktop layout:

- **Left column (queue)** – 30–35% width.
- **Right column (thread + reply)** – 65–70% width.

Mobile:

- Queue on top, thread below; back button brings you from thread to queue.

---

### 3. Left Column – Queue

#### 3.1 Container

- Background: `#F9FAFB`
- Border-right: `1px solid var(--neutral-200)`
- Padding: `16px`

#### 3.2 Header

- Title: `Hotbox`
- Count pill: e.g. `2 leads need your reply`
- Filter row:
  - `[ All ]`
  - `[ Awaiting Reply ]` (default)
  - `[ Snoozed ]`

#### 3.3 Lead Row

For each lead in the queue:

- **Avatar**
  - Circle with initials, using a consistent color palette.
- **Main line**
  - `Name · Company`
  - Example: `Sarah Lee · Acme Co`
- **Meta line**
  - `2h ago · "Thanks for the proposal, I have a question..."`
  - Snippet truncated to one line with ellipsis.
- **Status chips**
  - `Waiting for you` (amber)
  - Optional: `New`, `Replied twice`, etc.

Selected row:

- Background: `#EEF2FF`
- Left bar: `3px solid var(--brand-primary)`
- Slight elevation (subtle shadow).

---

### 4. Right Column – Thread & Reply

#### 4.1 Conversation Header

- **Top bar**
  - Left:
    - Name: `Sarah Lee`
    - Email: `sarah@example.com`
    - Small link: `View Dossier` (opens Lead Detail)
  - Right:
    - Meta: `Time in Hotbox: 2h 14m`
    - Small `Stage: Conversation Active` chip

#### 4.2 Thread View

- Vertical stack of message bubbles:

Message types:

- **Bot message**
  - Label: `Automated · Email 1`
  - Background: `#F3F4F6`
  - Smaller font, muted.
- **User (you)**
  - Label: `You`
  - Background: white, aligned right, border in brand color.
- **Lead**
  - Label: `Lead`
  - Background: white, aligned left, subtle highlight to draw focus.

Each bubble shows:

- Header row: sender label + timestamp (`Today · 9:32 AM`).
- Body text: wraps nicely; links styled with brand color.

The thread should auto-scroll to the **latest message** when selecting a lead.

#### 4.3 One-Click Next Steps (“Magic Row”)

Positioned directly **above** the reply editor:

- Label: `Next steps`
- Buttons (pills):
  - `[ Send Booking Link ]`
    - Inserts booking URL into the reply at cursor position.
  - `[ Move to Negotiation ]`
    - Immediately updates stage; shows toast: `Moved to Negotiation`.
  - `[ Mark as Lost ]`
    - Opens inline confirmation:
      - Reason dropdown (e.g. `Budget`, `Timeline`, `Not a fit`).
      - Confirm button.

Behavior:

- These actions should **not** navigate away; they update backend and UI in-place.

#### 4.4 Reply Box

- **Rich text editor**
  - Min-height: 3–4 lines; grows as needed.
  - Placeholder: `Write your reply…`
  - Supports bold, italics, links, bullet lists.
- **Footer row**
  - Left: helper text `⌘ + Enter to send`
  - Right: buttons:
    - Primary: `[ Send & Archive ]`
      - Action: send email, remove lead from Hotbox, move to next queue item.
    - Secondary: `[ Send & Keep Open ]`
      - Action: send email, keep lead in Hotbox for follow-up.

After `Send & Archive`:

- The next lead in the queue becomes active.
- Small toast: `Reply sent and archived.`.

---

### 5. Empty & Loading States

- **No leads in Hotbox**
  - Illustration with text:
    - Title: `You’re all caught up`
    - Subtitle: `Automation is handling everything. We’ll bring leads here when they need you.`
- **Loading**
  - Skeleton list in queue.
  - Placeholder bubbles in thread.

---

### 6. Keyboard & Power-User Flows

- **Navigation**
  - `↑ / ↓` arrow keys move between leads in queue.
  - `Enter` opens selected lead.
- **Sending**
  - `⌘ + Enter` or `Ctrl + Enter` = `Send & Archive`.
  - Button hover tooltips show shortcuts.
