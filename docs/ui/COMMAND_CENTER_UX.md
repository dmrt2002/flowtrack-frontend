## Command Center (Home) – UX Specification

### 1. Purpose & Role

- **Primary goal**: Give the solopreneur a fast “Morning Coffee” check that everything is working and highlight anything that needs attention.
- **Usage pattern**: 1–3 times per day, in short bursts (30–90 seconds).
- **Emotional state**: Reassurance and motivation (“the machine is working while I sleep”).

---

### 2. Layout Overview

Desktop layout:

- **Top bar**
  - **Left**: `FlowTrack` logo + text `Command Center`
  - **Center**: Status pill: `LIVE` / `PAUSED`
  - **Right**: Date + `Last sync: X min ago`
- **Main body**
  - **Row 1**: Pulse cards (3 equal-width cards)
  - **Row 2**:
    - **Left (2/3 width)**: Live Feed (scrolling timeline)
    - **Right (1/3 width)**: Quick Actions + mini-metrics

Mobile:

- Stack Pulse row, then Live Feed, then Quick Actions.
- Top bar collapses into a smaller header with status pill and menu.

---

### 3. Visual Design

#### 3.1 Pulse Cards

- **Container**
  - Height: 120–140px
  - Background: `#FFFFFF`
  - Border: `1px solid var(--neutral-200)`
  - Border-radius: `16px`
  - Box-shadow: `var(--shadow-sm)`
- **Content**
  - **Label (top-left)**:
    - Text: 13px, uppercase, letter-spacing `0.12em`, color `var(--neutral-500)`
  - **Value (center)**:
    - Text: 32px, weight 700
  - **Subtext (bottom)**:
    - Example: `vs yesterday`, trend chip (up/down arrow + percentage)

Card definitions:

- **New Leads (Today)**
  - Value example: `+4`
  - Value color: `var(--success-500)` if ≥ 0, `var(--error-500)` if negative.
  - Small badge: compact pill with the `+4` value.
- **In Hotbox (Needs Attention)**
  - Value color: `var(--warning-500)`
  - Background tint: subtle amber for the card or badge.
- **Pipeline Value**
  - Value example: `$12,500`
  - Value color: `var(--brand-primary)`
  - Subtext: `Projected revenue`

---

### 4. Live Feed (“Heartbeat”)

#### 4.1 Structure

- **Header**
  - Title: `Live Feed`
  - Subtitle: `What the bot did while you slept`
  - Filter pills: `[Today] [Last 7 days] [All]`
- **Timeline list**
  - Vertical list, newest at top.
  - Each entry:
    - Time (left): `09:30 AM`
    - Icon (middle-left)
    - Description text (middle)
    - Status chip (right, optional)

#### 4.2 Entry Examples

- `09:00 AM · Bot filtered out "John Doe" (Budget < $1k).`
  - Icon: funnel
  - Status chip: `Filtered`
- `09:15 AM · Bot sent Follow-up #2 to Sarah.`
  - Icon: mail
  - Status chip: `Follow-up`
- `09:30 AM · HOT: Mike replied to "Proposal Email."`
  - Icon: flame
  - Status chip: `Hotbox`

#### 4.3 Micro-Interaction: New Entry

When a new item appears while the user is on this screen:

- A new row is inserted at the top and **slides down** from above over ~350ms.
- The row background briefly uses a glass highlight:
  - `background: rgba(255,255,255,0.4)`
  - `backdrop-filter: blur(12px)`
  - Fades to standard row background over 400–600ms.
- No hard pop-in; animation should feel soft and fluid.

---

### 5. Quick Actions (Sidebar)

#### 5.1 Layout

- Card titled `Quick Actions`.
- Vertical stack of buttons, full-width within the card.

#### 5.2 Buttons

- **Copy Booking Link**
  - Primary button with brand gradient (`#4f46e5` → `#7c3aed`).
  - On click:
    - Copies booking URL to clipboard.
    - Shows toast: `Booking link copied`.
- **Pause All Automation** (Emergency Brake)
  - Destructive/secondary style:
    - Outline with `var(--error-500)` text.
    - Icon: small stop/pause symbol.
  - On click:
    - Confirmation modal:
      - Title: `Pause all automation?`
      - Body: `New leads will stop receiving automated emails until you resume.`
      - Actions: `[Cancel] [Pause Now]`
    - If confirmed:
      - Status pill at top changes from `LIVE` (green) to `PAUSED` (amber/red).
      - Live Feed logs `Automation paused by you.`

---

### 6. Status Pill

- Text: `LIVE` or `PAUSED`.
- **LIVE**:
  - Background: `rgba(16,185,129,0.12)`
  - Text: `#047857`
  - Small dot on the left: solid green.
- **PAUSED**:
  - Background: `rgba(248,113,113,0.12)`
  - Text: `#b91c1c`
  - Dot: red.

---

### 7. Empty & Loading States

- **First-time use (no data)**:
  - Pulse cards show `0` with helper text like `Connect your form to start receiving leads.`
  - Live Feed shows an illustration + text: `Your automation hasn’t processed any leads yet. Check back after your first submission.`
- **Loading**:
  - Skeletons for pulse cards and a few Live Feed rows.
