# Dashboard UX Specification v2.0 - Sidebar Edition

**Version:** 2.0
**Last Updated:** 2025-11-27
**Design System:** FlowTrack Elevated Light Mode with Professional Sidebar
**Target Platform:** Web (Desktop, Tablet, Mobile)

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Layout Architecture - Sidebar Approach](#2-layout-architecture---sidebar-approach)
3. [Sidebar Component](#3-sidebar-component)
4. [Color Palette & Brand Alignment](#4-color-palette--brand-alignment)
5. [Typography System](#5-typography-system)
6. [Main Content Area](#6-main-content-area)
7. [Dashboard Cards & Metrics](#7-dashboard-cards--metrics)
8. [Lead Management Section](#8-lead-management-section)
9. [Workflow Status Indicator](#9-workflow-status-indicator)
10. [Animations & Transitions](#10-animations--transitions)
11. [Empty States](#11-empty-states)
12. [Responsive Behavior](#12-responsive-behavior)
13. [Accessibility](#13-accessibility)
14. [Technical Implementation Notes](#14-technical-implementation-notes)

---

## 1. Design Philosophy

### Core Principles

**"Your Professional Command Center for Lead Intelligence"**

The dashboard adopts a **professional sidebar layout** - the industry-standard approach used by Linear, Notion, Vercel, and other modern SaaS products. This creates:

- **Familiarity**: Users immediately understand the navigation pattern
- **Efficiency**: Persistent sidebar provides quick access to all features
- **Space**: Maximizes content area for metrics and data
- **Focus**: Sidebar can collapse to minimize distractions

### Visual Language

- **Elevated Light Mode**: White backgrounds with soft shadows
- **Sidebar as Foundation**: Dark/light sidebar with elegant hover states
- **Indigo as Authority**: Primary brand color (#4F46E5) for active states
- **Smooth Animations**: Delightful micro-interactions throughout
- **Professional Polish**: Clean, modern interface with attention to detail

### Design Inspiration

Modern SaaS dashboards:

- **Linear**: Collapsible sidebar with elegant animations
- **Notion**: Clean navigation with smooth transitions
- **Vercel**: Professional aesthetics with subtle depth
- **Stripe**: Data-focused with clear hierarchy

---

## 2. Layout Architecture - Sidebar Approach

### Desktop Layout (≥1024px)

```
┌──────────┬─────────────────────────────────────────────────────┐
│          │  [Search]                    [Notifications] [👤]   │
│  [Logo]  ├─────────────────────────────────────────────────────┤
│          │                                                       │
│  ────────│  Welcome back, Sarah! 👋                            │
│          │  Your lead qualification system is active            │
│ Dashboard│                                                       │
│ ● Leads  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│   Analytics  │  247    │  143    │  2.3h   │  58%     │          │
│   Settings│  └──────┘  └──────┘  └──────┘  └──────┘          │
│          │                                                       │
│  ────────│  Recent Leads                       [View All →]    │
│          │  ─────────────────────────────────────────────      │
│  Workflow│  [Lead Card 1]                                      │
│   Form   │  [Lead Card 2]                                      │
│          │  [Lead Card 3]                                      │
│  ────────│                                                       │
│          │  Your Public Form Link                              │
│  [Help]  │  [Copy Link]  [Visit Form]                          │
│  [←]     │                                                       │
└──────────┴─────────────────────────────────────────────────────┘
  Sidebar      Main Content Area
  (280px)      (flexible, max 1440px)
```

### Collapsed Sidebar (Desktop)

```
┌──┬────────────────────────────────────────────────────────────┐
│ │ │  [Search]                        [Notifications] [👤]     │
│●│ ├────────────────────────────────────────────────────────────┤
│ │ │                                                             │
│──│  Welcome back, Sarah! 👋                                   │
│ │ │                                                             │
│●│ │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│●│ │  │  247    │  143    │  2.3h   │  58%     │                │
│●│ │  └──────┘  └──────┘  └──────┘  └──────┘                │
│ │ │                                                             │
│──│  Recent Leads                                              │
│ │ │  [Lead Card 1]                                            │
│●│ │  [Lead Card 2]                                            │
│ │ │                                                             │
│──│                                                              │
│ │ │                                                             │
│?│ │                                                             │
│→│ │                                                             │
└──┴────────────────────────────────────────────────────────────┘
 64px     Main Content (wider when sidebar collapsed)
```

### Spacing & Grid

- **Sidebar Width**:
  - Expanded: 280px (fixed)
  - Collapsed: 64px (fixed)
  - Mobile: Overlay drawer (280px wide)
- **Main Content**:
  - Max Width: 1440px (centered)
  - Padding: 32px (desktop), 24px (tablet), 16px (mobile)
- **Transition**: Sidebar toggle animates over 300ms with ease-in-out

---

## 3. Sidebar Component

### Container Specifications

#### Expanded State (280px)

- **Width**: 280px (fixed)
- **Background**: `#FFFFFF` (light mode) / `#1F2937` (dark mode option)
- **Border**: 1.5px solid `#E5E7EB` (right side)
- **Shadow**: `inset -1px 0 0 rgba(0, 0, 0, 0.05)`
- **Height**: 100vh (sticky)
- **Z-Index**: 40
- **Position**: Fixed left

#### Collapsed State (64px)

- **Width**: 64px (fixed)
- **Icons Only**: Labels hidden
- **Tooltips**: Show on hover (right side)
- **Same styling**: Background, border, shadow

### Logo Area

#### Container

- **Height**: 72px (matches top bar height)
- **Padding**: 20px
- **Border Bottom**: 1.5px solid `#E5E7EB`
- **Background**: Slightly darker than sidebar (`#F9FAFB`)

#### Logo (Expanded)

- **Icon**: FlowTrack diamond (32px)
- **Text**: "FlowTrack" (18px, 700 weight, neutral-900)
- **Layout**: Icon + Text horizontal, 12px gap

#### Logo (Collapsed)

- **Icon Only**: Centered, 32px
- **No Text**: Fades out smoothly

### Navigation Items

#### Primary Navigation

```
Dashboard
Leads
Analytics
Settings
```

#### Secondary Navigation (Bottom)

```
Workflow
Form
───────
Help & Support
```

#### Navigation Item Styling

**Default State**:

- **Height**: 44px
- **Padding**: 12px 20px (expanded) / 12px (collapsed, centered)
- **Margin**: 4px 12px
- **Border Radius**: 8px
- **Font**: 15px, 500 weight
- **Color**: `#6B7280` (neutral-500)
- **Icon**: 20px, left aligned (8px gap with text)
- **Transition**: all 150ms ease

**Hover State**:

- **Background**: `#F3F4F6` (neutral-100)
- **Color**: `#374151` (neutral-700)
- **Transform**: translateX(2px)

**Active/Selected State**:

- **Background**: `linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)` (indigo gradient)
- **Color**: `#4F46E5` (indigo-600)
- **Font Weight**: 600
- **Border Left**: 3px solid `#4F46E5` (accent bar)
- **Shadow**: `0 1px 3px rgba(79, 70, 229, 0.1)`

**Icon Styling**:

- **Active**: indigo-600
- **Default**: neutral-500
- **Hover**: neutral-700

#### Notification Badge (Optional)

For "Leads" nav item when new leads arrive:

- **Position**: Right side (expanded) or top-right of icon (collapsed)
- **Size**: 18px circle
- **Background**: `#EF4444` (red-500)
- **Text**: Count (10px, 700 weight, white)
- **Animation**: Pulse on new item (scale 1 → 1.2 → 1)

### Toggle Button

#### Positioning

- **Location**: Bottom of sidebar (above Help)
- **Expanded**: Shows "←" (collapse) with text "Collapse"
- **Collapsed**: Shows "→" (expand) icon only

#### Styling

- **Height**: 40px
- **Width**: Full width (with padding)
- **Padding**: 10px 20px
- **Border**: 1px solid `#E5E7EB`
- **Border Radius**: 8px
- **Margin**: 12px
- **Background**: white
- **Hover**: `#F9FAFB` background
- **Icon**: 16px, neutral-600
- **Text**: 13px, 500 weight, neutral-600
- **Transition**: all 200ms ease

#### Interaction

- **Click**: Toggle sidebar state
- **Keyboard**: Alt+S shortcut (optional)
- **Persist**: Save state to localStorage

### User Section (Collapsed to Avatar)

When sidebar is expanded:

- Shows at bottom (above toggle)
- Avatar (32px) + Name + Email (truncated)
- Dropdown on click for settings/logout

When collapsed:

- Avatar only (32px)
- Tooltip shows name on hover
- Click opens dropdown (positioned right)

---

## 4. Color Palette & Brand Alignment

### Primary Colors

```css
/* Indigo - Primary Brand & Active States */
--indigo-50: #eef2ff;
--indigo-100: #e0e7ff;
--indigo-600: #4f46e5;
--indigo-700: #4338ca;

/* Purple - Gradient Accent */
--purple-600: #7c3aed;
--purple-700: #6d28d9;

/* Emerald - Success & Positive Metrics */
--emerald-500: #10b981;
--emerald-600: #059669;
--emerald-50: #ecfdf5;

/* Neutral - Sidebar & Structure */
--neutral-50: #f9fafb;
--neutral-100: #f3f4f6;
--neutral-200: #e5e7eb;
--neutral-500: #6b7280;
--neutral-600: #4b5563;
--neutral-700: #374151;
--neutral-900: #111827;

/* Red - Notifications */
--red-500: #ef4444;
--red-600: #dc2626;
```

### Semantic Usage

| Element            | Color                                       | Usage                   |
| ------------------ | ------------------------------------------- | ----------------------- |
| Sidebar Background | `#FFFFFF`                                   | Pure white (light mode) |
| Sidebar Border     | `#E5E7EB`                                   | Subtle separation       |
| Nav Item Default   | `#6B7280`                                   | Neutral gray            |
| Nav Item Active    | `#4F46E5`                                   | Indigo primary          |
| Active BG          | `linear-gradient(135deg, #EEF2FF, #E0E7FF)` | Indigo light gradient   |
| Main Content BG    | `#F9FAFB`                                   | Soft gray backdrop      |
| Card Background    | `#FFFFFF`                                   | Pure white with shadow  |

---

## 5. Typography System

### Font Family

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

### Type Scale

| Element            | Size | Weight         | Line Height | Color       |
| ------------------ | ---- | -------------- | ----------- | ----------- |
| Sidebar Nav Item   | 15px | 500 (Regular)  | 1.5         | neutral-500 |
| Sidebar Nav Active | 15px | 600 (Semibold) | 1.5         | indigo-600  |
| Logo Text          | 18px | 700 (Bold)     | 1.2         | neutral-900 |
| Welcome Heading    | 28px | 700 (Bold)     | 1.2         | neutral-900 |
| Section Title      | 20px | 600 (Semibold) | 1.4         | neutral-900 |
| Metric Value       | 36px | 700 (Bold)     | 1.1         | neutral-900 |
| Metric Label       | 13px | 500 (Medium)   | 1.4         | neutral-500 |
| Body Text          | 15px | 400 (Regular)  | 1.6         | neutral-700 |

---

## 6. Main Content Area

### Top Bar (Fixed)

#### Container

- **Height**: 72px (fixed)
- **Background**: `#FFFFFF` (white)
- **Border Bottom**: 1.5px solid `#E5E7EB`
- **Shadow**: `0 1px 3px rgba(0, 0, 0, 0.04)`
- **Position**: Sticky top, spans full width of content area
- **Z-Index**: 30
- **Padding**: 0 32px

#### Layout (Left to Right)

```
[Search Input]               [Notifications Icon] [User Avatar]
```

**Search Input**:

- **Width**: 320px (flexible)
- **Height**: 40px
- **Border**: 1.5px solid `#E5E7EB`
- **Border Radius**: 10px
- **Placeholder**: "Search leads, workflows..."
- **Icon**: Search (16px, left aligned, 12px padding)
- **Font**: 14px, 400 weight
- **Focus**: Border → indigo-600, shadow

**Notifications**:

- **Icon**: Bell (20px)
- **Button**: 40px × 40px circle
- **Hover**: Background `#F3F4F6`
- **Badge**: Red dot (8px) if unread

**User Avatar**:

- **Size**: 40px circle
- **Border**: 2px solid `#E5E7EB`
- **Hover**: Scale 1.05, shadow increase
- **Click**: Dropdown menu

### Content Container

#### Padding & Width

- **Padding**: 32px (desktop), 24px (tablet), 16px (mobile)
- **Max Width**: 1440px (centered)
- **Background**: `#F9FAFB` (soft gray)
- **Min Height**: calc(100vh - 72px) // Full height minus top bar

### Welcome Section

#### Container

- **Background**: White card
- **Padding**: 28px 32px
- **Border Radius**: 16px
- **Border**: 1.5px solid `#E5E7EB`
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.04)`
- **Margin Bottom**: 32px

#### Content

```
Welcome back, Sarah! 👋
Your lead qualification system is active and running
```

- **Line 1**: 28px, 700 weight, neutral-900, wave emoji
- **Line 2**: 15px, 400 weight, neutral-500, 6px margin top

---

## 7. Dashboard Cards & Metrics

### Metrics Row Container

- **Display**: Grid, 4 columns, equal width
- **Gap**: 20px
- **Margin Bottom**: 32px

### Individual Metric Card

#### Container

- **Background**: White
- **Padding**: 24px
- **Border Radius**: 14px
- **Border**: 1.5px solid `#E5E7EB`
- **Shadow**: `0 1px 4px rgba(0, 0, 0, 0.04)`
- **Transition**: all 250ms cubic-bezier(0.4, 0, 0.2, 1)
- **Hover**:
  - Border → `#C7D2FE` (indigo-200)
  - Shadow → `0 8px 16px rgba(79, 70, 229, 0.12)`
  - Transform → translateY(-4px)

#### Icon Area

- **Size**: 48px × 48px
- **Border Radius**: 12px
- **Gradients**:
  - Total Leads: `linear-gradient(135deg, #4F46E5, #7c3aed)`
  - Qualified: `linear-gradient(135deg, #10B981, #059669)`
  - Time: `linear-gradient(135deg, #F59E0B, #D97706)`
  - Conversion: `linear-gradient(135deg, #EC4899, #DB2777)`
- **Icon**: 24px, white
- **Margin Bottom**: 16px

#### Value & Label

- **Value**: 36px, 700 weight, neutral-900
- **Label**: 13px, 500 weight, neutral-500
- **Trend**: 12px, 600 weight, color based on direction
  - Up: emerald-600
  - Down: red-600

---

## 8. Lead Management Section

### Lead List Container

- **Background**: White card
- **Padding**: 28px
- **Border Radius**: 16px
- **Border**: 1.5px solid `#E5E7EB`
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.04)`
- **Margin Bottom**: 32px

### Section Header

- **Margin Bottom**: 20px
- **Display**: Flex, space-between
- **Title**: "Recent Leads" (20px, 600 weight)
- **Action**: "View All →" (14px, 600 weight, indigo-600)

### Lead Card

#### Container

- **Padding**: 18px
- **Border**: 1px solid `#E5E7EB`
- **Border Radius**: 12px
- **Background**: `#FAFAFA`
- **Margin Bottom**: 12px (last: 0)
- **Transition**: all 200ms ease
- **Hover**:
  - Background → white
  - Border → indigo-200
  - Shadow → `0 4px 12px rgba(79, 70, 229, 0.08)`
  - Cursor → pointer

#### Layout

```
[Avatar]  John Smith                              [Qualified Badge]
          john@example.com
          Acme Corp · $50K budget · 2h ago
```

- **Avatar**: 48px circle, indigo gradient
- **Name**: 16px, 600 weight, neutral-900
- **Email**: 14px, 400 weight, neutral-500
- **Meta**: 13px, 400 weight, neutral-600, · separator

---

## 9. Workflow Status Indicator

### Active State

- **Background**: Emerald gradient `linear-gradient(135deg, #ECFDF5, #D1FAE5)`
- **Padding**: 18px 24px
- **Border Radius**: 12px
- **Border**: 1.5px solid `#A7F3D0`
- **Icon**: Pulsing green dot (12px)
- **Text**: "Strategy Active: ..." (16px, 600 weight, emerald-900)
- **Margin Bottom**: 32px

### Inactive State

- **Background**: Amber-50
- **Border**: Amber-200
- **Icon**: AlertTriangle (amber-600)
- **CTA**: "Complete Setup" button (indigo gradient)

---

## 10. Animations & Transitions

### Sidebar Toggle Animation

```css
/* Sidebar container */
.sidebar {
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Nav item labels */
.nav-label {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

/* Collapsed state */
.sidebar.collapsed .nav-label {
  opacity: 0;
  transform: translateX(-10px);
  pointer-events: none;
}
```

### Page Load Stagger

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-section {
  animation: fadeInUp 600ms cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: backwards;
}

/* Stagger delays */
.welcome {
  animation-delay: 0ms;
}
.metrics {
  animation-delay: 100ms;
}
.leads {
  animation-delay: 200ms;
}
.quick-actions {
  animation-delay: 300ms;
}
```

### Metric Card Hover

```css
.metric-card {
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: #c7d2fe;
  box-shadow: 0 8px 16px rgba(79, 70, 229, 0.12);
}
```

### Nav Item Active Slide

```css
.nav-item {
  position: relative;
  transition: all 150ms ease;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #4f46e5;
  border-radius: 0 2px 2px 0;
  transform: scaleY(0);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item.active::before {
  transform: scaleY(1);
}
```

### Tooltip Fade (Collapsed Sidebar)

```css
.tooltip {
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity 200ms ease,
    transform 200ms ease;
  pointer-events: none;
}

.nav-item:hover .tooltip {
  opacity: 1;
  transform: translateX(0);
}
```

---

## 11. Empty States

### No Leads Yet

Same as v1.0, but adjusted for sidebar layout:

- Center in main content area
- Emoji: 📭 (64px)
- Heading: "No leads yet" (24px, 600 weight)
- Description: Max width 400px
- CTA: "Copy Form Link" (indigo gradient button)

### No Active Workflow

- Amber warning card
- Icon: AlertTriangle
- Message: "Complete onboarding to activate workflow"
- CTA: "Go to Onboarding"

---

## 12. Responsive Behavior

### Desktop (≥1024px)

- Sidebar: 280px expanded (toggle available)
- Main content: Flexible with max-width 1440px
- 4 metric cards per row
- All hover states active

### Tablet (768px - 1023px)

- Sidebar: Auto-collapsed to 64px (icons only)
- Toggle shows tooltip: "Tap to expand"
- 2 metric cards per row
- Reduced padding (24px)

### Mobile (<768px)

- Sidebar: Hidden by default
- Hamburger menu (top-left) opens overlay drawer
- Drawer: 280px wide, slides from left with overlay
- Main content: Full width, 16px padding
- 1 metric card per row (stacked)
- Top bar: Hamburger + Logo + Avatar
- Search: Hidden (add to drawer or separate page)

### Sidebar Mobile Drawer

```css
/* Overlay */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 50;
  transition: opacity 300ms ease;
}

/* Drawer */
.sidebar-drawer {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 280px;
  background: white;
  transform: translateX(-100%);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 60;
}

.sidebar-drawer.open {
  transform: translateX(0);
}
```

---

## 13. Accessibility

### Keyboard Navigation

- **Tab Order**: Sidebar nav → Main content → Top bar
- **Shortcuts**:
  - `Alt+S`: Toggle sidebar
  - `Cmd+K` / `Ctrl+K`: Focus search
  - `Esc`: Close mobile drawer
- **Focus Indicators**: 2px solid indigo-600 ring, 4px offset
- **Skip Link**: "Skip to main content" hidden at top

### Screen Reader Support

```tsx
<nav aria-label="Main navigation">
  <button aria-expanded={isExpanded} aria-controls="sidebar-nav">
    {isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
  </button>
  <ul role="list">
    <li>
      <a href="/dashboard" aria-current="page">Dashboard</a>
    </li>
    <li>
      <a href="/leads" aria-label="Leads (3 new)">
        Leads <span className="sr-only">3 new notifications</span>
      </a>
    </li>
  </ul>
</nav>

<main role="main" aria-label="Dashboard content">
  {/* Main content */}
</main>
```

### ARIA Labels

- Sidebar toggle: `aria-expanded`, `aria-controls`
- Nav items: `aria-current="page"` for active item
- Notifications: `aria-label="3 new notifications"`
- Icons: `aria-hidden="true"` with adjacent text
- Mobile drawer: `aria-modal="true"`, `role="dialog"`

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  .sidebar,
  .metric-card,
  .nav-item,
  .dashboard-section {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 14. Technical Implementation Notes

### Component Structure

```
src/features/dashboard/
├── components/
│   ├── Sidebar.tsx                     # NEW: Main sidebar component
│   ├── SidebarNav.tsx                  # NEW: Navigation items
│   ├── SidebarToggle.tsx               # NEW: Collapse/expand button
│   ├── MobileSidebarDrawer.tsx         # NEW: Mobile overlay drawer
│   ├── TopBar.tsx                      # NEW: Search + notifications + avatar
│   ├── DashboardLayout.tsx             # UPDATED: Sidebar + content wrapper
│   ├── WelcomeSection.tsx              # Same as v1
│   ├── MetricsRow.tsx                  # Same as v1
│   ├── MetricCard.tsx                  # Same as v1
│   ├── LeadsSection.tsx                # Same as v1
│   ├── LeadCard.tsx                    # Same as v1
│   ├── QuickActionsCard.tsx            # Same as v1
│   ├── EmptyLeadsState.tsx             # Same as v1
│   └── WorkflowStatusBanner.tsx        # Same as v1
├── hooks/
│   ├── useSidebarState.ts              # NEW: Manage sidebar collapse state
│   ├── useDashboardData.ts             # Existing
│   └── useRecentLeads.ts               # Existing
├── types/
│   └── dashboard.ts                    # Existing + sidebar types
└── screens/
    └── DashboardScreen.tsx             # UPDATED: New layout integration
```

### Sidebar State Management (Zustand)

```tsx
// src/store/sidebarStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isCollapsed: boolean;
  toggle: () => void;
  collapse: () => void;
  expand: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
      collapse: () => set({ isCollapsed: true }),
      expand: () => set({ isCollapsed: false }),
    }),
    {
      name: 'flowtrack-sidebar-state',
    }
  )
);
```

### Framer Motion Variants

```tsx
// Sidebar animation
const sidebarVariants = {
  expanded: {
    width: 280,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  collapsed: {
    width: 64,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const labelVariants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  hidden: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// Mobile drawer
const drawerVariants = {
  open: {
    x: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  closed: {
    x: '-100%',
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const overlayVariants = {
  open: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  closed: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};
```

### Sidebar Component Example

```tsx
'use client';

import { motion } from 'framer-motion';
import { useSidebarStore } from '@/store/sidebarStore';
import { SidebarNav } from './SidebarNav';
import { SidebarToggle } from './SidebarToggle';
import { Logo } from '@/components/ui/logo';

export function Sidebar() {
  const { isCollapsed } = useSidebarStore();

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 64 },
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 bottom-0 left-0 z-40 overflow-hidden border-r-[1.5px] border-neutral-200 bg-white"
    >
      {/* Logo Area */}
      <div className="flex h-[72px] items-center border-b-[1.5px] border-neutral-200 bg-neutral-50 px-5">
        <Logo collapsed={isCollapsed} />
      </div>

      {/* Navigation */}
      <SidebarNav collapsed={isCollapsed} />

      {/* Toggle Button */}
      <SidebarToggle />
    </motion.aside>
  );
}
```

### Layout Integration

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebarStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      <MobileSidebarDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <motion.main
        animate={{
          marginLeft: isCollapsed ? 64 : 280,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen md:ml-[280px]"
      >
        <TopBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="p-8">{children}</div>
      </motion.main>
    </div>
  );
}
```

---

## Summary

This Dashboard UX v2.0 specification transforms the FlowTrack dashboard into a **professional sidebar-based layout** - the modern standard for SaaS applications. Key improvements:

✅ **Professional Sidebar**: Collapsible navigation like Linear, Notion, Vercel
✅ **Smooth Animations**: Sidebar toggle, page load stagger, hover effects
✅ **Modern Layout**: Top bar with search + notifications + avatar
✅ **Space Efficiency**: Maximized content area when sidebar collapsed
✅ **Mobile Optimized**: Overlay drawer with backdrop blur
✅ **Persistent State**: Sidebar preference saved to localStorage
✅ **Accessibility**: Full keyboard navigation + ARIA labels
✅ **Brand Consistency**: Indigo accents, clean typography, elevated aesthetics

**Implementation Priority**:

1. Create sidebar components (Sidebar, SidebarNav, SidebarToggle)
2. Update DashboardLayout to integrate sidebar
3. Add TopBar component for search/notifications
4. Implement Zustand store for sidebar state
5. Add Framer Motion animations
6. Build mobile drawer with overlay
7. Test responsive behavior across breakpoints

This design elevates FlowTrack to match the polish of industry-leading SaaS dashboards while maintaining the brand's unique visual identity.

---

**Next Steps**: Implement components following this specification and the feature-based architecture defined in `.cursorrules`.
