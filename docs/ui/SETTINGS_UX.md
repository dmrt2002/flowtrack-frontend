# FlowTrack Settings Page - UI/UX Design Specification

> **Design System Integration**: The Settings page uses the same DashboardLayout, styling, and patterns as Dashboard, Leads, and Workflows pages for a consistent user experience. Grey background (`bg-neutral-50`), white cards (`bg-white border-neutral-200`), and matching typography ensure the entire app feels cohesive.

## 1. Visual Strategy & Brand Vibe

### Core Design Philosophy

The Settings page embodies **"Organized Control"** — providing users with comprehensive control over their account, workspace, team, and billing while maintaining clarity and preventing overwhelm. The design should communicate:

- **Clarity**: Clean information hierarchy, scannable sections
- **Control**: Accessible actions, clear consequences
- **Trust**: Transparent billing, clear data usage
- **Efficiency**: Quick access to common tasks

### Visual Tone

**Light, Spacious, and Organized**

- Primary aesthetic: Clean white canvas with organized sections
- Strategic use of cards and separators for visual grouping
- Subtle shadows for depth without heaviness
- Dangerous actions (delete) clearly marked in red
- **TARGET**: Professional dashboard settings — think GitHub Settings, Vercel Dashboard, Linear Settings

---

## 2. Layout Architecture

### Dashboard Layout Integration

The Settings page uses the same **DashboardLayout** component as all other pages for consistency:

- Left sidebar with navigation
- Top bar with search and user menu
- Main content area with grey background (`bg-neutral-50`)
- Responsive sidebar collapse on mobile

### Tab-Based Structure (3 Main Tabs)

```
┌────────────────────────────────────────────────────────────────┐
│  Settings                                                        │
│  Manage your account settings, billing, and team                │
│                                                                  │
│  Profile    Billing    Team                                     │
│  ═══════                                                         │
│                                                                  │
│  ┌─ TAB CONTENT AREA (White Cards) ──────────────────────┐     │
│  │                                                         │     │
│  │  ┌─ Personal Information ────────────────────────┐    │     │
│  │  │  First Name    Last Name                      │    │     │
│  │  │  Email Address                                │    │     │
│  │  └───────────────────────────────────────────────┘    │     │
│  │                                                         │     │
│  │  ┌─ Password & Security ─────────────────────────┐    │     │
│  │  │  Current Password                             │    │     │
│  │  │  New Password                                 │    │     │
│  │  └───────────────────────────────────────────────┘    │     │
│  │                                                         │     │
│  │  ┌─ Connected Accounts ──────────────────────────┐    │     │
│  │  │  Google Calendar [Connected]                  │    │     │
│  │  └───────────────────────────────────────────────┘    │     │
│  │                                                         │     │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Page Layout

- **DashboardLayout wrapper**: Provides consistent sidebar and top bar
- **Content container**: `max-w-[1600px]` with `p-6` padding
- **Background**: Grey `bg-neutral-50` (matches dashboard)
- **White cards**: All content cards use white background with `border-neutral-200`
- **Vertical spacing**: 24px (`space-y-6`) between sections
- **Tab bar**: Simple underline style matching dashboard patterns

### Responsive Behavior

#### Desktop (≥1024px)

- Two-column layout for some forms (name fields side-by-side)
- Cards with comfortable padding (24px)
- Tab bar with full labels

#### Tablet (768px - 1023px)

- Single-column forms
- Cards with medium padding (20px)
- Tab bar with full labels

#### Mobile (<768px)

- Single-column layout
- Compact card padding (16px)
- Tab bar with abbreviated labels or icons
- Stack all form fields vertically

---

## 3. Design System Definitions

### Color Palette (Matching Dashboard)

#### Primary Brand Colors

```
--indigo-600: #4F46E5          /* Primary actions, active tabs */
--indigo-700: #4338CA          /* Hover states */
--indigo-50: #EEF2FF           /* Light backgrounds */
```

#### Neutral Scale (TailwindCSS neutral)

```
--neutral-50: #FAFAFA          /* Page background (dashboard grey) */
--neutral-100: #F5F5F5         /* Subtle backgrounds */
--neutral-200: #E5E5E5         /* Card borders, dividers */
--neutral-300: #D4D4D4         /* Disabled states */
--neutral-500: #737373         /* Placeholder text */
--neutral-600: #525252         /* Secondary text */
--neutral-700: #404040         /* Body text */
--neutral-900: #171717         /* Headings, primary text */
```

#### Semantic Colors

```
--green-500: #10B981           /* Success states, active badges */
--red-500: #EF4444             /* Errors, danger zone */
--yellow-500: #F59E0B          /* Warnings, approaching limits */
--blue-500: #3B82F6            /* Info, trial periods */
```

#### Background Strategy

```
--bg-page: #FAFAFA (neutral-50)     /* Main background - grey */
--bg-card: #FFFFFF                   /* White cards with borders */
--bg-danger: #FEF2F2                 /* Red-50 for danger zone */
```

### Typography

#### Font Family

```
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

#### Heading Hierarchy (Matching Dashboard)

```
/* Page Title - Consistent with Dashboard/Leads/Workflows */
H1: font-size: 32px, font-weight: 700, tracking-tight, color: neutral-900
     text-[32px] font-bold tracking-tight text-neutral-900

/* Section/Card Titles */
H2: font-size: 18px, font-weight: 600, color: neutral-900

/* Card Subtitles */
H3: font-size: 16px, font-weight: 600, color: neutral-900

/* Labels */
H4: font-size: 14px, font-weight: 500, color: neutral-700
```

#### Body Text (Dashboard Style)

```
/* Page Description - Below H1 */
description: font-size: 15px, font-weight: 400, color: neutral-600
             text-[15px] text-neutral-600

/* Default Body */
body: font-size: 14px, font-weight: 400, line-height: 1.6, color: neutral-700

/* Secondary/Helper */
small: font-size: 13px, font-weight: 400, color: neutral-500

/* Input Labels */
label: font-size: 14px, font-weight: 500, color: neutral-700
```

### Spacing Scale

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
```

### Border & Shadow

#### Borders

```
--border-width: 1px
--border-radius-sm: 6px         /* Badges, tags */
--border-radius-md: 8px         /* Inputs, buttons, cards */
--border-radius-lg: 12px        /* Large cards, modals */
--border-color: --neutral-200
```

#### Shadows

```
/* Card Elevation */
--shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);

/* Card Hover */
--shadow-card-hover: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

/* Modal/Dialog */
--shadow-modal: 0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.04);
```

---

## 4. Tab Structure & Navigation (Dashboard Style)

### Tab Bar Component

Simple underline tabs matching the dashboard pattern:

```
Profile    Billing    Team
═══════
```

#### Tab Specifications (Dashboard Style)

**Layout**:

- Flex layout with gap-6 (24px)
- Full width border-bottom on container
- Positioned below page header

**Dimensions**:

- Tab padding: pb-3 (12px bottom)
- Active indicator: 2px height, absolute bottom

**States**:

- **Default**:
  - color: neutral-600 (`text-neutral-600`)
  - hover: neutral-900 (`hover:text-neutral-900`)
- **Active**:
  - color: indigo-600 (`text-indigo-600`)
  - border-bottom: 2px solid indigo-600 (`bg-indigo-600`)

**Typography**:

- Font-size: 15px (`text-[15px]`)
- Font-weight: 500 (`font-medium`)

**Animation**:

- Smooth color transitions
- No sliding animation (simpler approach)

---

## 5. Profile Tab - Components & Layout

### 5.1 Personal Information Card

```
┌─ Personal Information ──────────────────────────────────┐
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ First Name      │  │ Last Name        │            │
│  │ [John...........]│  │ [Doe............]│            │
│  └──────────────────┘  └──────────────────┘            │
│                                                           │
│  ┌───────────────────────────────────────┐              │
│  │ Email Address                         │              │
│  │ [john.doe@example.com]  [Verified ✓] │              │
│  └───────────────────────────────────────┘              │
│                                                           │
│                              [Cancel]  [Save Changes]    │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:

- Card padding: 24px
- Label margin-bottom: 8px
- Input height: 44px
- Input border: 1px solid --neutral-200
- Input border-radius: 8px
- Button alignment: Right
- Button spacing: 12px gap

**Email Field**:

- Disabled (not editable)
- Shows verification badge if verified
- Badge: background: --success-500/10, color: --success-500, padding: 4px 8px

**Behavior**:

- Fields start in view mode (if no edit)
- "Save Changes" button disabled until form dirty
- Success toast on save
- Error inline if validation fails

---

### 5.2 Password & Security Card

```
┌─ Password & Security ───────────────────────────────────┐
│                                                           │
│  ┌───────────────────────────────────────┐              │
│  │ Current Password                      │              │
│  │ [••••••••••••]                        │              │
│  └───────────────────────────────────────┘              │
│                                                           │
│  ┌───────────────────────────────────────┐              │
│  │ New Password                          │              │
│  │ [••••••••••••]                        │              │
│  └───────────────────────────────────────┘              │
│  • At least 8 characters                                 │
│                                                           │
│  ┌───────────────────────────────────────┐              │
│  │ Confirm New Password                  │              │
│  │ [••••••••••••]                        │              │
│  └───────────────────────────────────────┘              │
│                                                           │
│                              [Cancel]  [Update Password] │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:

- Same layout as Personal Information card
- Password requirements shown below "New Password" field
- Requirements: text-sm, color: --neutral-500
- Password match validation on "Confirm Password" blur
- Show/hide password icon (eye icon) in input suffix

**Validation States**:

- ✓ Green checkmark for met requirements
- × Red X for unmet requirements
- Real-time validation on typing

**Behavior**:

- Only shown for local auth users (not OAuth)
- For OAuth users, show message: "You're signed in with Google. Password changes are managed by your OAuth provider."
- Success toast: "Password updated successfully"
- Error handling: "Current password is incorrect"

---

### 5.3 Connected Accounts Card

```
┌─ Connected Accounts ────────────────────────────────────┐
│                                                           │
│  Link your accounts for seamless sign-in                 │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [G] Google                        [Connected ✓]  │   │
│  │     john.doe@gmail.com                           │   │
│  │                                      [Disconnect] │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [GitHub] GitHub              [Connect Account →] │   │
│  │     Not connected                                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:

- Each provider: separate row with border
- Provider icon: 24x24px, left-aligned
- Provider name: font-weight: 500
- Connection status: badge (green for connected)
- Disconnect button: variant: outline, size: small
- Connect button: variant: primary, size: small

**Provider Icons**:

- Google: Google logo (colored)
- GitHub: GitHub logo (monochrome)
- Future: Microsoft, LinkedIn, etc.

**Behavior**:

- Click "Connect" → OAuth flow
- Click "Disconnect" → Confirmation dialog: "Are you sure you want to disconnect Google? You'll need another sign-in method."
- Prevent disconnecting last auth method
- Success toast: "Google account disconnected"

---

### 5.4 Danger Zone Card

```
┌─ Danger Zone ───────────────────────────────────────────┐
│                                                           │
│  ⚠️ Delete Account                                       │
│  Once you delete your account, there is no going back.   │
│  Please be certain.                                       │
│                                                           │
│                                        [Delete Account]   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:

- Card background: --bg-danger (#FEF2F2)
- Border: 1px solid --error-500
- Warning icon: 20x20px, color: --error-500
- Title: font-weight: 600, color: --error-500
- Description: color: --neutral-600
- Button: variant: destructive (red background)

**Delete Confirmation Modal**:

```
┌─ Delete Account ────────────────────────────────────────┐
│                                                   [×]    │
│  Are you absolutely sure?                                │
│                                                           │
│  This will permanently delete your account and all       │
│  data associated with it, including:                     │
│                                                           │
│  • All workspaces you own                                │
│  • All workflows and automations                         │
│  • All leads and their history                           │
│  • Team memberships                                      │
│                                                           │
│  This action cannot be undone.                           │
│                                                           │
│  Type your email to confirm:                             │
│  ┌───────────────────────────────────┐                  │
│  │ [Enter your email]                │                  │
│  └───────────────────────────────────┘                  │
│                                                           │
│                          [Cancel]  [Delete My Account]   │
└───────────────────────────────────────────────────────────┘
```

**Modal Specifications**:

- Modal width: 480px
- Modal padding: 32px
- Modal shadow: --shadow-modal
- Title: font-size: 20px, font-weight: 600
- Bullet list: margin-left: 20px, line-height: 1.8
- Confirmation input: must match user's email exactly
- Delete button: disabled until email matches
- Delete button: background: --error-500, text: white

**Behavior**:

- Opens modal on "Delete Account" click
- Email must match character-for-character (case-insensitive)
- Shows loading spinner on delete button
- On success: redirects to logout → login page with message
- On error: shows error toast "Failed to delete account. Please try again."

---

## 6. Billing Tab - Components & Layout

### 6.1 Current Plan Card

```
┌─ Current Plan ──────────────────────────────────────────┐
│                                                           │
│  Pro Plan                             [Active]          │
│  $29/month • Billed monthly                              │
│                                                           │
│  Next billing date: January 15, 2025                     │
│  Payment method: •••• 4242                               │
│                                                           │
│                                    [Manage Billing →]    │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:

- Plan name: font-size: 20px, font-weight: 600
- Status badge:
  - Active: background: --success-500/10, color: --success-500
  - Trial: background: --info-500/10, color: --info-500
  - Past Due: background: --warning-500/10, color: --warning-500
  - Cancelled: background: --neutral-100, color: --neutral-600
- Price: font-size: 16px, color: --neutral-700
- Metadata: font-size: 14px, color: --neutral-500
- "Manage Billing" button: Opens Stripe Customer Portal

**Trial Period Variant**:

```
┌─ Current Plan ──────────────────────────────────────────┐
│                                                           │
│  Pro Plan (Trial)                     [Trial]           │
│  Free until January 15, 2025                             │
│                                                           │
│  Your trial ends in 7 days                               │
│                                                           │
│                              [Add Payment Method →]      │
└───────────────────────────────────────────────────────────┘
```

---

### 6.2 Usage Quotas Card

```
┌─ Usage This Month ──────────────────────────────────────┐
│                                                           │
│  Leads                                                    │
│  ████████████████░░░░  450 / 1,000                       │
│                                                           │
│  Workflows                                                │
│  ██████████░░░░░░░░░░  5 / 10                            │
│                                                           │
│  Email Sends                                              │
│  ████████████░░░░░░░░  1,250 / 2,500                     │
│                                                           │
│  Team Members                                             │
│  ██████░░░░░░░░░░░░░░  3 / 10                            │
│                                                           │
│  Resets on: January 1, 2025                              │
└───────────────────────────────────────────────────────────┘
```

**Progress Bar Specifications**:

- Height: 8px
- Border-radius: 4px
- Background: --neutral-200
- Fill color:
  - < 70%: --brand-primary
  - 70-90%: --warning-500
  - > 90%: --error-500
- Label layout: flexbox (quota name on left, usage on right)
- Spacing between bars: 20px

**Behavior**:

- Real-time usage (no caching)
- Color changes based on percentage
- Tooltip on hover: "Resets at the start of each billing cycle"

---

### 6.3 Available Plans Card (if not on highest plan)

```
┌─ Upgrade Your Plan ─────────────────────────────────────┐
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ Starter          │  │ Pro         [✓]  │            │
│  │                  │  │                  │            │
│  │ $9/month         │  │ $29/month        │            │
│  │                  │  │                  │            │
│  │ • 100 Leads      │  │ • 1,000 Leads    │            │
│  │ • 3 Workflows    │  │ • 10 Workflows   │            │
│  │ • 500 Emails     │  │ • 2,500 Emails   │            │
│  │ • 1 User         │  │ • 10 Users       │            │
│  │                  │  │                  │            │
│  │ [Downgrade]      │  │ [Current Plan]   │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                           │
│  ┌──────────────────┐                                    │
│  │ Enterprise       │                                    │
│  │                  │                                    │
│  │ Custom Pricing   │                                    │
│  │                  │                                    │
│  │ • Unlimited      │                                    │
│  │ • Everything     │                                    │
│  │ • Priority       │                                    │
│  │ • Dedicated      │                                    │
│  │                  │                                    │
│  │ [Contact Sales]  │                                    │
│  └──────────────────┘                                    │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Plan Card Specifications**:

- Card width: 280px (3-column grid on desktop)
- Card padding: 24px
- Card border: 2px solid --neutral-200
- Active plan: border-color: --brand-primary, background: --brand-primary-light
- Card hover: transform: translateY(-2px), shadow: --shadow-card-hover
- Plan name: font-size: 18px, font-weight: 600
- Price: font-size: 24px, font-weight: 700, color: --neutral-900
- Feature list: ul with checkmarks, font-size: 14px
- Button spacing: margin-top: auto (pushes to bottom)

**Button States**:

- Current plan: disabled, background: --neutral-100
- Upgrade: variant: primary
- Downgrade: variant: outline
- Contact Sales: variant: outline

**Behavior**:

- Click "Upgrade" → Creates Stripe Checkout Session → Redirects to Stripe
- Click "Downgrade" → Shows confirmation modal: "Downgrade to Starter? You'll lose access to some features at the end of your current billing cycle."
- Click "Contact Sales" → Opens mailto: or Intercom chat

---

### 6.4 Billing History Card

```
┌─ Billing History ───────────────────────────────────────┐
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Date         Description          Amount    [↓]  │   │
│  ├──────────────────────────────────────────────────┤   │
│  │ Dec 1, 2024  Pro Plan - Monthly   $29.00   [↓]  │   │
│  │ Nov 1, 2024  Pro Plan - Monthly   $29.00   [↓]  │   │
│  │ Oct 1, 2024  Pro Plan - Monthly   $29.00   [↓]  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│                                    [View All Invoices]   │
└───────────────────────────────────────────────────────────┘
```

**Table Specifications**:

- Table: full width, border-collapse
- Header: background: --neutral-50, font-weight: 600
- Row: border-bottom: 1px solid --neutral-200
- Row hover: background: --neutral-50
- Download icon: 16x16px, color: --neutral-500
- Empty state: "No invoices yet"

**Behavior**:

- Click download icon → Downloads PDF invoice (from Stripe)
- "View All Invoices" → Opens modal with full paginated history
- Shows last 5 invoices, rest in modal

---

## 7. Team Tab - Components & Layout

### 7.1 Team Members List

```
┌─ Team Members ──────────────────────────────────────────┐
│                                     [+ Invite Member]    │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [JD] John Doe                                     │   │
│  │      john.doe@example.com       [Owner]   [You]  │   │
│  │      Joined 3 months ago                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [JS] Jane Smith                                   │   │
│  │      jane.smith@example.com     [Admin ▼]  [×]   │   │
│  │      Joined 1 month ago                           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ [BJ] Bob Johnson                                  │   │
│  │      bob@example.com            [Member ▼] [×]   │   │
│  │      Invited • Pending acceptance                 │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Member Card Specifications**:

- Card padding: 16px
- Card border: 1px solid --neutral-200
- Card spacing: 12px margin-bottom
- Avatar: 40x40px circle, background: --brand-primary-light, color: --brand-primary
- Name: font-size: 16px, font-weight: 500
- Email: font-size: 14px, color: --neutral-500
- Metadata: font-size: 13px, color: --neutral-400
- Role dropdown: inline, right-aligned
- Remove button: icon only (×), color: --neutral-400, hover: --error-500

**Role Badge Colors**:

- Owner: background: --brand-primary, color: white
- Admin: background: --info-500/10, color: --info-500
- Member: background: --neutral-100, color: --neutral-600
- Viewer: background: --neutral-100, color: --neutral-400

**Role Dropdown**:

- Only shown for admins/owner
- Options: Owner, Admin, Member, Viewer
- Disabled for current user
- Owner can only be transferred (shows warning modal)

**Pending Invitation State**:

- Email shown in italic
- Status: "Invited • Pending acceptance"
- Actions: [Resend Invite] [Cancel Invite]

**Empty State**:

```
┌─ Team Members ──────────────────────────────────────────┐
│                                     [+ Invite Member]    │
│                                                           │
│              👥                                           │
│          No team members yet                             │
│                                                           │
│     Invite colleagues to collaborate on workflows        │
│                                                           │
│                        [Invite Your First Member]        │
└───────────────────────────────────────────────────────────┘
```

---

### 7.2 Invite Member Modal

```
┌─ Invite Team Member ────────────────────────────────────┐
│                                                   [×]    │
│  Invite a new member to your workspace                   │
│                                                           │
│  ┌───────────────────────────────────┐                  │
│  │ Email Address                     │                  │
│  │ [jane@example.com]                │                  │
│  └───────────────────────────────────┘                  │
│                                                           │
│  ┌───────────────────────────────────┐                  │
│  │ Role                              │                  │
│  │ [Member ▼]                        │                  │
│  └───────────────────────────────────┘                  │
│                                                           │
│  ○ Admin - Can manage team and settings                  │
│  ● Member - Can create and manage workflows              │
│  ○ Viewer - Can only view workflows and leads            │
│                                                           │
│  An invitation email will be sent to this address        │
│                                                           │
│                          [Cancel]  [Send Invitation]     │
└───────────────────────────────────────────────────────────┘
```

**Modal Specifications**:

- Modal width: 480px
- Modal padding: 32px
- Email input: type="email", validation
- Role selector: Radio group with descriptions
- Submit button: disabled until valid email
- Loading state: Shows spinner on button

**Behavior**:

- Validates email format
- Checks if email already a member
- Sends invitation email with magic link
- Success toast: "Invitation sent to jane@example.com"
- Closes modal on success
- Error handling: "This user is already a member"

---

## 8. Micro-Interactions & Animations

### Form Interactions

**Input Focus**:

```css
transition:
  border-color 150ms ease,
  box-shadow 150ms ease;
border-color: --brand-primary;
box-shadow: 0 0 0 3px --brand-primary-light;
```

**Button Hover**:

```css
transition: all 150ms ease;
transform: translateY(-1px);
```

**Button Click**:

```css
transform: scale(0.98);
```

### Tab Switching

**Active Indicator Animation**:

```css
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
/* Slides smoothly under active tab */
```

**Content Fade**:

```css
/* Old content fades out */
opacity: 0;
transition: opacity 100ms ease-out;

/* New content fades in */
opacity: 1;
transition: opacity 150ms ease-in 50ms;
```

### Card Hover

**Plan Cards**:

```css
transition:
  transform 200ms ease,
  box-shadow 200ms ease;
transform: translateY(-4px);
box-shadow: --shadow-card-hover;
```

### Loading States

**Skeleton Screens**:

- Use pulse animation for loading cards
- Background: --neutral-100
- Animation: subtle shimmer effect

**Button Loading**:

- Show spinner icon
- Disable interaction
- Text: "Saving..." / "Deleting..." / "Sending..."

### Success States

**Toast Notification**:

```
┌────────────────────────────────┐
│ ✓ Profile updated successfully │
└────────────────────────────────┘
```

- Position: bottom-right
- Background: --success-500
- Color: white
- Duration: 3 seconds
- Animation: slide-in from right, slide-out after duration

### Error States

**Inline Field Error**:

```
┌───────────────────────────────────┐
│ Email Address                     │
│ [john@invalid]                    │
│ ⚠ Please enter a valid email      │
└───────────────────────────────────┘
```

- Error text: color: --error-500, font-size: 13px
- Icon: 14x14px warning icon
- Input border: --error-500

**Toast Error**:

```
┌────────────────────────────────┐
│ ⚠ Failed to update profile     │
│   Please try again              │
└────────────────────────────────┘
```

- Background: --error-500
- Color: white

---

## 9. Responsive Behavior

### Breakpoints

```css
/* Mobile */
@media (max-width: 767px) {
  --container-padding: 16px;
  --card-padding: 16px;
  --section-spacing: 16px;
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  --container-padding: 24px;
  --card-padding: 20px;
  --section-spacing: 20px;
}

/* Desktop */
@media (min-width: 1024px) {
  --container-padding: 32px;
  --card-padding: 24px;
  --section-spacing: 24px;
}
```

### Mobile Adaptations

**Tab Navigation**:

- Full-width tabs
- Horizontal scroll if needed
- Swipe gesture between tabs

**Form Layout**:

- All inputs full-width
- No side-by-side fields
- Larger touch targets (minimum 44px height)

**Team Member Cards**:

- Stack avatar and info vertically
- Actions in dropdown menu (•••)

**Plan Cards**:

- Single column (1 card per row)
- Horizontal scroll for multiple plans

---

## 10. Accessibility Requirements

### Keyboard Navigation

- All interactive elements tabbable
- Tab order: logical (top to bottom, left to right)
- Visible focus indicators (blue outline)
- Escape key closes modals
- Enter key submits forms

### Screen Reader Support

**ARIA Labels**:

```html
<button aria-label="Delete account">Delete</button>
<input aria-label="Email address" aria-required="true" />
<div role="alert" aria-live="polite">Profile updated</div>
```

**Semantic HTML**:

- Use `<button>` not `<div>`
- Use `<form>` for forms
- Use `<label>` for inputs
- Use `<nav>` for tabs

**Focus Management**:

- Modal open: focus first input
- Modal close: return focus to trigger button
- Toast: announced but doesn't steal focus

### Color Contrast

**WCAG AA Compliance**:

- Text on white: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Interactive elements: clear visual states

**Error States**:

- Don't rely on color alone
- Include icons (⚠, ✓, ×)
- Include descriptive text

---

## 11. Error States & Validation

### Form Validation

**Client-Side Validation**:

- Email format
- Password strength
- Required fields
- Character limits

**Server-Side Validation**:

- Duplicate emails
- Invalid workspace names
- Permission checks

### Error Display Patterns

**Field-Level Errors**:

```html
<label for="email">Email</label>
<input id="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">This email is already in use</p>
```

**Form-Level Errors**:

```html
<div role="alert" class="error-banner">
  Unable to save changes. Please check the form and try again.
</div>
```

### Network Error Handling

**Failed API Call**:

- Show toast: "Something went wrong. Please try again."
- Enable retry button
- Log error for debugging

**Timeout**:

- Show message: "This is taking longer than expected..."
- Offer cancel option
- Retry automatically after 30s

---

## 12. Design Tokens Summary

```javascript
export const settingsTokens = {
  // Colors
  colors: {
    primary: '#4F46E5',
    primaryHover: '#4338CA',
    primaryLight: '#EEF2FF',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // Typography
  typography: {
    pageTitle: { size: '28px', weight: '700' },
    sectionTitle: { size: '18px', weight: '600' },
    cardTitle: { size: '16px', weight: '600' },
    body: { size: '14px', weight: '400' },
    small: { size: '13px', weight: '400' },
  },

  // Borders & Radii
  borders: {
    width: '1px',
    color: '#E5E7EB',
    radiusSm: '6px',
    radiusMd: '8px',
    radiusLg: '12px',
  },

  // Shadows
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    cardHover: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
    modal: '0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)',
  },

  // Animations
  animations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
```

---

## 13. Implementation Checklist

### Phase 1: Foundation

- [ ] Create UI component library imports (tabs, switch, badge, etc.)
- [ ] Set up tab navigation structure
- [ ] Implement page layout and container
- [ ] Add skeleton loading states

### Phase 2: Profile Tab

- [ ] Personal Information card with form
- [ ] Password & Security card (local auth only)
- [ ] Connected Accounts card with OAuth providers
- [ ] Danger Zone card with confirmation modal

### Phase 3: Billing Tab

- [ ] Current Plan card with status badges
- [ ] Usage Quotas card with progress bars
- [ ] Available Plans card grid
- [ ] Billing History table

### Phase 4: Team Tab

- [ ] Team Members list with role management
- [ ] Invite Member modal with email validation
- [ ] Role dropdown component
- [ ] Empty states

### Phase 5: Interactions

- [ ] Form validation (client + server)
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error handling
- [ ] Success states

### Phase 6: Integration

- [ ] Connect to API endpoints
- [ ] Stripe Checkout flow
- [ ] Stripe Customer Portal integration
- [ ] Email invitation flow

### Phase 7: Polish

- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessibility audit (keyboard, screen reader, ARIA)
- [ ] Animation and micro-interactions
- [ ] Cross-browser testing

---

## 14. Future Enhancements

### Profile

- [ ] Avatar upload with crop tool
- [ ] Two-factor authentication (2FA)
- [ ] Session management (view/revoke devices)
- [ ] Email notification preferences

### Billing

- [ ] Multiple payment methods
- [ ] Invoice customization (company info, PO numbers)
- [ ] Usage alerts and notifications
- [ ] Annual billing discount

### Team

- [ ] Custom roles with granular permissions
- [ ] Team activity log
- [ ] Bulk member import (CSV)
- [ ] SSO/SAML integration (Enterprise)

---

_End of Settings UX Specification_
