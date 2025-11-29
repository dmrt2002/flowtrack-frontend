## Lead Detail (Dossier) – UX Specification

### 1. Purpose & Role

- **Goal**: Provide a complete, readable story for a single lead.
- **Access from**:
  - Hotbox queue (click on lead name or `View Dossier`).
  - Pipeline card (click anywhere on card).

---

### 2. Layout Overview

Desktop:

- Panel or modal with two main columns:
  - **Header** (full width, on top).
  - **Left panel**: Data (profile + form answers + source).
  - **Right panel**: Timeline (event stream).

Mobile:

- Stack sections vertically:
  - Header
  - Data
  - Timeline

---

### 3. Header

Content:

- **Name**: large text: `Sarah Lee`
- **Subtitle**: `Founder · Acme Co`
- **Contact row**:
  - Email: `sarah@example.com`
  - Social icons: LinkedIn, website, etc.
- **Status chips**:
  - Stage: `Conversation Active`
  - Score: optional pill such as `Fit: High`

Actions:

- Small icon buttons:
  - `[ Email ]` – deep-links to email view if relevant.
  - `[ Open in Gmail ]` – external link.

---

### 4. Left Panel – Data

Sections (with clear headings and spacing):

1. **Profile**
   - Name, Title, Company
   - Location, Time zone (if known)
2. **Form Answers**
   - List of key-value pairs:
     - `Budget: $5,000`
     - `Timeline: ASAP`
     - `Project Type: Website redesign`
   - Show only meaningful fields; group less important answers under `Show more`.
3. **Source & Segmentation**
   - `Source: LinkedIn`
   - `Campaign: Spring 2025`
   - Tags:
     - Chips such as `High Budget`, `Replied`, `Clicked link`.

Visuals:

- Use `Card` components to box each section.
- Field labels: 12–13px, uppercase or semi-bold.
- Values: 14–15px, regular.

---

### 5. Right Panel – Timeline

Vertical timeline with time-ordered events.

#### 5.1 Event Node

Each node contains:

- Dot: color-coded by event type:
  - Gray: system event (form submission, status change).
  - Indigo: bot emails.
  - Green: positive events (booking, click).
  - Orange: replies requiring action.
- Time label:
  - `Day 1 · 9:12 AM`
- Description:
  - Clear, concise sentence.

Examples:

- `Form submitted from /contact page.`
- `Bot sent Email 1: "Intro & Calendar link."`
- `User clicked booking link in Email 1.`
- `User replied: "Can we move to next week?"`

#### 5.2 Grouping

- Group events by day:
  - Heading: `Day 1`, `Day 2`, `Day 3`, etc.
  - Under each, list event nodes with times.

---

### 6. Notes & Internal Activity

Allow internal notes:

- Add note button:
  - `+ Add internal note` at top of timeline or at each day group.
- Note event style:
  - Dot color: muted blue/gray.
  - Header: `Internal note by You · 3:45 PM`
  - Body: free-form text.

Use-case:

- The solopreneur can annotate decisions, objections, or contract details.

---

### 7. Integration with Other Screens

- **From Hotbox**:
  - When user clicks `View Dossier`, open this view in a right-side drawer.
  - Drawer should not obscure navigation back to Hotbox queue.
- **From Pipeline**:
  - Clicking a card opens the same drawer, but returning should close drawer and leave user on Pipeline board.

State indicators:

- If automation is paused for the lead:
  - Show chip `Automation paused` near header.
  - Explain why (e.g. `Moved to Hotbox`, `Marked as Lost`).

---

### 8. Empty & Loading States

- **Loading**
  - Skeleton for header (name, subtitle).
  - Grey boxes for data fields and timeline rows.
- **No events yet**
  - Message: `No activity recorded yet. Once this lead enters your automation, events will appear here.`
