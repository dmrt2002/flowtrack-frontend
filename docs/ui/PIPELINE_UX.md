## Pipeline (Kanban) – UX Specification

### 1. Purpose & Role

- **Goal**: Visualize where all leads are in the funnel at a glance.
- **Usage**: Occasional overview, prioritization, and sanity check.

---

### 2. Layout Overview

Kanban board with horizontal scrolling if needed:

- Columns (left → right):
  1. `New Leads`
  2. `Filtering / Processing`
  3. `Conversation Active`
  4. `Meeting Booked`
  5. `Won`

Desktop:

- All columns visible if space allows; otherwise, subtle horizontal scroll.

Mobile/tablet:

- Columns become horizontally scrollable with sticky column headers.

---

### 3. Column Design

#### 3.1 Column Header

- Title: e.g. `New Leads`
- Count pill: `· 8`
  - Small rounded chip with neutral background.

#### 3.2 Column Body

- Background: `#F9FAFB`
- Border-radius: `12px`
- Padding: `8px`
- Min-height: shows a faint “drop zone” even when empty.

Empty state:

- Text: `No leads here yet.`
- Hint text depending on column, e.g.:
  - `New form submissions will appear here.`

---

### 4. Lead Card Design

#### 4.1 Container

- Background: `#FFFFFF`
- Border-radius: `12px`
- Border: `1px solid var(--neutral-200)`
- Shadow: `var(--shadow-sm)`
- Padding: `10–12px`
- Margin-bottom: `8px`
- Cursor: pointer + grab when in drag mode.

#### 4.2 Content Layout

Top row:

- Left:
  - Name + avatar: `Sarah Lee`
  - Small subtitle: `Founder · Acme Co`
- Right:
  - Primary metric (if available): e.g. `$5,000` (budget) or `Score: 92`.

Middle row:

- Muted meta text:
  - `Source: LinkedIn · Last touch: 2d ago`

Bottom row:

- Automation tag pills (see below).

---

### 5. Automation Tags

Small pills at bottom of each card describing automation state.

Examples:

- **🟢 Waiting X days**
  - Text: `Waiting 2 days`
  - Meaning: in a delay step; system will act later.
- **🔵 Email Queued**
  - Text: `Email queued`
  - Meaning: email is scheduled to send soon.
- **🔴 Manual Task**
  - Text: `Manual task`
  - Meaning: automation stopped; user must act (often in Hotbox).

Visual:

- Font-size: 11–12px
- Background: tinted version of semantic color.
- Text-color: darker variant of that semantic color.

---

### 6. Interactions

#### 6.1 Drag & Drop

- Drag a card to another column to update stage.
- On drop:
  - Card animates into place with springy feel.
  - Toast: `Moved to Meeting Booked`.
  - Backend is updated with new stage.

Constraints:

- Some transitions may be blocked (e.g. cannot drag directly from `New Leads` to `Won`); show inline error tooltip if blocked.

#### 6.2 Card Click → Lead Detail

- Clicking a card opens the Lead Dossier:
  - Either as a right-side drawer or modal.
  - Drawer recommended to preserve board context.

---

### 7. Filters & Controls

Global controls (above board):

- Search field: filter by name/email/company.
- Filter pills:
  - `[ All ]`
  - `[ Only Hotbox ]`
  - `[ High Budget ]`
  - `[ Recently Active ]`

Additional:

- Toggle: `Show automation tags` (on/off) – allows compact view.

---

### 8. Performance & UX Details

- Columns load progressively; show skeleton cards while fetching.
- When many cards exist:
  - Virtualized list per column if necessary.
- On narrow screens:
  - Ensure column headers remain visible while scrolling within column.
