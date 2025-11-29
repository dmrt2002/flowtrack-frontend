# FlowTrack Form Embedding - UI/UX Design Specification

## Overview

This document defines the complete user experience for the Form Embedding feature in FlowTrack, covering all screens, interactions, and user flows from workflow creation to form embedding and analytics.

---

## Table of Contents

1. [User Journey Overview](#1-user-journey-overview)
2. [Design System & Visual Language](#2-design-system--visual-language)
3. [Screen 1: Workflow List with Embed Status](#3-screen-1-workflow-list-with-embed-status)
4. [Screen 2: Workflow Builder - Form Configuration](#4-screen-2-workflow-builder---form-configuration)
5. [Screen 3: Embed Code Modal](#5-screen-3-embed-code-modal)
6. [Screen 4: Public Form Preview](#6-screen-4-public-form-preview)
7. [Screen 5: Form Analytics Dashboard](#7-screen-5-form-analytics-dashboard)
8. [Screen 6: Embedded Form (External Website)](#8-screen-6-embedded-form-external-website)
9. [Micro-Interactions & Animations](#9-micro-interactions--animations)
10. [Responsive Behavior](#10-responsive-behavior)
11. [Error States & Edge Cases](#11-error-states--edge-cases)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Implementation Checklist](#13-implementation-checklist)

---

## 1. User Journey Overview

### Primary User Flow

```
1. Create Workflow with Form Trigger
   ↓
2. Configure Form Fields (name, type, validation)
   ↓
3. Activate Workflow
   ↓
4. Click "Get Embed Code" button
   ↓
5. View Embed Code Modal (3 methods)
   ↓
6. Copy embed code to clipboard
   ↓
7. Paste on external website
   ↓
8. Form submissions create leads
   ↓
9. View analytics in dashboard
```

### Secondary User Flows

**A. Quick Preview Flow**

```
Get Embed Code → Preview Button → Opens public form in new tab
```

**B. Analytics Flow**

```
Workflow List → Click workflow → View Analytics tab → Form metrics
```

**C. Edit Form Flow**

```
Workflow Builder → Edit form fields → Re-publish → Embed code remains same
```

---

## 2. Design System & Visual Language

### Color Palette

#### Primary Brand Colors

```css
--brand-primary: #4f46e5 /* Indigo 600 - Primary actions */
  --brand-primary-hover: #4338ca /* Indigo 700 - Hover states */
  --brand-primary-light: #eef2ff /* Indigo 50 - Backgrounds */
  --brand-accent: #7c3aed /* Purple 600 - Accents */;
```

#### Neutral Scale

```css
--neutral-50: #f9fafb --neutral-100: #f3f4f6 --neutral-200: #e5e7eb
  --neutral-300: #d1d5db --neutral-400: #9ca3af --neutral-500: #6b7280
  --neutral-600: #4b5563 --neutral-700: #374151 --neutral-800: #1f2937
  --neutral-900: #111827;
```

#### Semantic Colors

```css
--success-50: #ecfdf5 --success-500: #10b981 --success-600: #059669
  --error-50: #fef2f2 --error-500: #ef4444 --error-600: #dc2626
  --warning-50: #fffbeb --warning-500: #f59e0b --info-50: #eff6ff
  --info-500: #3b82f6;
```

### Typography

```css
/* Font Family */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;

/* Hierarchy */
--text-h1: 32px / 700 / -0.02em /* Page titles */ --text-h2: 24px / 600 /
  -0.01em /* Section headings */ --text-h3: 18px / 600 / normal
  /* Subsections */ --text-body-lg: 16px / 400 / normal /* Primary body */
  --text-body: 15px / 400 / normal /* Default body */ --text-body-sm: 14px /
  400 / normal /* Secondary text */ --text-caption: 13px / 400 / normal
  /* Labels, captions */ --text-tiny: 12px / 400 / normal
  /* Metadata, timestamps */;
```

### Spacing Scale

```css
--space-1: 4px --space-2: 8px --space-3: 12px --space-4: 16px --space-5: 20px
  --space-6: 24px --space-8: 32px --space-10: 40px --space-12: 48px
  --space-16: 64px;
```

### Border Radius

```css
--radius-sm: 6px --radius-md: 8px --radius-lg: 12px --radius-xl: 16px
  --radius-full: 9999px;
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05) --shadow-sm: 0 1px 3px
  rgba(0, 0, 0, 0.1) --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07) --shadow-lg: 0
  10px 15px rgba(0, 0, 0, 0.1) --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15)
  --shadow-brand: 0 4px 12px rgba(79, 70, 229, 0.2);
```

---

## 3. Screen 1: Workflow List with Embed Status

### Purpose

Show users which workflows have embeddable forms and provide quick access to embed codes.

### Layout Structure

```
┌────────────────────────────────────────────────────────────────┐
│  Workflows                                    [+ New Workflow] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📝 Contact Form Workflow              ⚡ Active          │ │
│  │  Form trigger · 234 submissions · Last edited 2h ago     │ │
│  │                                                           │ │
│  │  [Preview] [Get Embed Code] [Edit] [•••]                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  📧 Newsletter Signup                  ⚪ Draft           │ │
│  │  Form trigger · 0 submissions · Created 1d ago           │ │
│  │                                                           │ │
│  │  [Activate First] [Edit] [•••]                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  🔄 API Workflow                       ⚡ Active          │ │
│  │  API trigger · 1,234 executions · Last edited 3d ago     │ │
│  │                                                           │ │
│  │  [View Logs] [Edit] [•••]                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### Workflow Card

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-6)
margin-bottom: var(--space-4)
transition: all 150ms ease

/* Hover State */
border-color: var(--neutral-300)
box-shadow: var(--shadow-md)
transform: translateY(-2px)
```

#### Workflow Title

```css
font-size: 18px
font-weight: 600
color: var(--neutral-900)
margin-bottom: var(--space-2)
display: flex
align-items: center
gap: var(--space-2)

/* Icon */
emoji or icon: 20px
opacity: 0.8
```

#### Metadata Row

```css
font-size: 13px
color: var(--neutral-500)
display: flex
align-items: center
gap: var(--space-3)
margin-bottom: var(--space-4)

/* Separator */
content: "·"
color: var(--neutral-300)
```

#### Status Badge

```css
/* Active State */
background: var(--success-50)
color: var(--success-600)
padding: 4px 12px
border-radius: var(--radius-full)
font-size: 12px
font-weight: 500
display: inline-flex
align-items: center
gap: 6px

/* Draft State */
background: var(--neutral-100)
color: var(--neutral-600)

/* Indicator Dot */
width: 6px
height: 6px
border-radius: 50%
background: currentColor
```

#### Button Group

```css
display: flex
gap: var(--space-2)
flex-wrap: wrap
```

#### Get Embed Code Button (Primary CTA)

```css
/* Base State */
background: var(--brand-primary)
color: #FFFFFF
padding: 8px 16px
border-radius: var(--radius-md)
font-size: 14px
font-weight: 500
border: none
cursor: pointer
transition: all 150ms ease

/* Hover */
background: var(--brand-primary-hover)
box-shadow: var(--shadow-brand)

/* Icon */
display: inline-flex
align-items: center
gap: 6px

/* Icon: <> code brackets */
width: 16px
height: 16px
```

#### Secondary Buttons (Preview, Edit)

```css
background: #FFFFFF
color: var(--neutral-700)
border: 1px solid var(--neutral-200)
padding: 8px 16px
border-radius: var(--radius-md)
font-size: 14px
font-weight: 500
cursor: pointer
transition: all 150ms ease

/* Hover */
background: var(--neutral-50)
border-color: var(--neutral-300)
```

### Empty State (No Workflows with Forms)

```
┌────────────────────────────────────────────────┐
│                                                │
│              📝                                │
│                                                │
│     No embeddable forms yet                    │
│                                                │
│     Create a workflow with a form trigger      │
│     to start collecting leads on your website  │
│                                                │
│         [Create Form Workflow]                 │
│                                                │
└────────────────────────────────────────────────┘
```

```css
/* Container */
text-align: center
padding: var(--space-16) var(--space-8)
background: var(--neutral-50)
border-radius: var(--radius-lg)
border: 2px dashed var(--neutral-200)

/* Icon */
font-size: 48px
margin-bottom: var(--space-4)

/* Heading */
font-size: 18px
font-weight: 600
color: var(--neutral-900)
margin-bottom: var(--space-2)

/* Description */
font-size: 14px
color: var(--neutral-500)
margin-bottom: var(--space-6)
max-width: 400px
margin-left: auto
margin-right: auto
```

---

## 4. Screen 2: Workflow Builder - Form Configuration

### Purpose

Configure form fields, settings, and appearance before enabling embedding.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Contact Form Workflow                     [Save] [Activate]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tabs: [Canvas] [Form Settings] [Analytics]                     │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Form Settings                                            │ │
│  │  ─────────────────────────────────────────────────────    │ │
│  │                                                           │ │
│  │  Form Fields                          [+ Add Field]       │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⋮⋮  Email Address                          [Edit]  │ │ │
│  │  │     EMAIL · Required                       [Delete] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⋮⋮  Full Name                              [Edit]  │ │ │
│  │  │     TEXT · Required                        [Delete] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ ⋮⋮  Company Name                           [Edit]  │ │ │
│  │  │     TEXT · Optional                        [Delete] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  ─────────────────────────────────────────────────────    │ │
│  │                                                           │ │
│  │  Form Appearance                                          │ │
│  │  ─────────────────────────────────────────────────────    │ │
│  │                                                           │ │
│  │  Submit Button Text                                       │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Submit                                              │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Success Message                                          │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ Thank you! We'll be in touch soon.                  │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Redirect URL (Optional)                                  │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ https://example.com/thank-you                       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### Add Field Button

```css
width: 100%
padding: var(--space-4)
background: var(--neutral-50)
border: 2px dashed var(--neutral-200)
border-radius: var(--radius-md)
color: var(--brand-primary)
font-size: 14px
font-weight: 500
cursor: pointer
transition: all 150ms ease
display: flex
align-items: center
justify-content: center
gap: var(--space-2)

/* Hover */
background: var(--brand-primary-light)
border-color: var(--brand-primary)

/* Icon */
width: 18px
height: 18px
```

#### Field Card (Draggable)

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-md)
padding: var(--space-4)
margin-bottom: var(--space-3)
cursor: move
transition: all 150ms ease
display: flex
align-items: center
justify-content: space-between

/* Hover State */
border-color: var(--neutral-300)
box-shadow: var(--shadow-sm)

/* Dragging State */
opacity: 0.5
box-shadow: var(--shadow-lg)
```

#### Drag Handle

```css
/* Icon: ⋮⋮ (six dots) */
color: var(--neutral-400)
width: 16px
height: 16px
margin-right: var(--space-3)
cursor: grab

/* Active */
cursor: grabbing
color: var(--neutral-600)
```

#### Field Info Section

```css
flex: 1

/* Field Label */
font-size: 15px
font-weight: 500
color: var(--neutral-900)
margin-bottom: var(--space-1)

/* Field Type + Required Badge */
display: flex
align-items: center
gap: var(--space-2)
font-size: 13px
color: var(--neutral-500)
text-transform: uppercase
letter-spacing: 0.02em

/* Required Badge */
color: var(--error-500)
font-weight: 500
```

#### Field Actions

```css
display: flex
gap: var(--space-2)

/* Edit Button */
padding: 6px 12px
font-size: 13px
background: var(--neutral-50)
border: 1px solid var(--neutral-200)
border-radius: var(--radius-sm)
color: var(--neutral-700)
cursor: pointer

/* Delete Button */
/* Same as edit but with red hover state */
hover: {
  background: var(--error-50)
  border-color: var(--error-200)
  color: var(--error-600)
}
```

### Add/Edit Field Modal

```
┌─────────────────────────────────────────────┐
│  Add Form Field                        [×]  │
├─────────────────────────────────────────────┤
│                                             │
│  Field Label *                              │
│  ┌─────────────────────────────────────┐   │
│  │ Email Address                       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Field Key (for API) *                      │
│  ┌─────────────────────────────────────┐   │
│  │ email                               │   │
│  └─────────────────────────────────────┘   │
│  Auto-generated from label                  │
│                                             │
│  Field Type *                               │
│  ┌─────────────────────────────────────┐   │
│  │ Email                           ▼   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Dropdown options:]                        │
│  • Text                                     │
│  • Email                                    │
│  • Number                                   │
│  • Phone                                    │
│  • Dropdown                                 │
│  • Textarea                                 │
│  • Date                                     │
│  • Checkbox                                 │
│                                             │
│  Placeholder Text                           │
│  ┌─────────────────────────────────────┐   │
│  │ you@example.com                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Help Text (Optional)                       │
│  ┌─────────────────────────────────────┐   │
│  │ We'll never share your email        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ☑ Required field                           │
│                                             │
│  ─────────────────────────────────────      │
│                                             │
│          [Cancel]  [Add Field]              │
│                                             │
└─────────────────────────────────────────────┘
```

```css
/* Modal Overlay */
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)
z-index: 1000
display: flex
align-items: center
justify-content: center
animation: fadeIn 200ms ease

/* Modal Container */
background: #FFFFFF
border-radius: var(--radius-xl)
width: 90%
max-width: 560px
max-height: 90vh
overflow-y: auto
box-shadow: var(--shadow-xl)
animation: slideUp 250ms ease

/* Modal Header */
padding: var(--space-6)
border-bottom: 1px solid var(--neutral-200)
display: flex
align-items: center
justify-content: space-between

/* Modal Title */
font-size: 20px
font-weight: 600
color: var(--neutral-900)

/* Close Button */
width: 32px
height: 32px
border-radius: var(--radius-sm)
background: transparent
border: none
color: var(--neutral-500)
cursor: pointer

hover: {
  background: var(--neutral-100)
  color: var(--neutral-900)
}

/* Modal Body */
padding: var(--space-6)

/* Modal Footer */
padding: var(--space-6)
border-top: 1px solid var(--neutral-200)
display: flex
justify-content: flex-end
gap: var(--space-3)
```

---

## 5. Screen 3: Embed Code Modal

### Purpose

Provide three methods for embedding forms (Script, Iframe, API) with copy-to-clipboard functionality.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Embed Your Form                                           [×]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tabs: [📜 Script] [🖼️ Iframe] [⚡ API]                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Recommended: Auto-Resizing Script                        │ │
│  │  ────────────────────────────────────────────────────     │ │
│  │                                                           │ │
│  │  This method automatically adjusts the form height and    │ │
│  │  provides the best user experience.                       │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ <div data-flowtrack-form="acme-corp"></div>        │ │ │
│  │  │ <script                                            │ │ │
│  │  │   src="https://app.flowtrack.com/embed/...js"     │ │ │
│  │  │   async>                                           │ │ │
│  │  │ </script>                                          │ │ │
│  │  │                                              [Copy] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Public Form URL                                          │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │ https://app.flowtrack.com/p/acme-corp       [Copy] │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │             [🔗 Preview Form] [📖 Documentation]          │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tab Navigation

```css
/* Tab Container */
display: flex
gap: var(--space-1)
background: var(--neutral-100)
padding: var(--space-1)
border-radius: var(--radius-md)
margin-bottom: var(--space-6)

/* Tab Button */
flex: 1
padding: var(--space-2) var(--space-4)
border: none
background: transparent
border-radius: var(--radius-sm)
font-size: 14px
font-weight: 500
color: var(--neutral-600)
cursor: pointer
transition: all 150ms ease
display: flex
align-items: center
justify-content: center
gap: var(--space-2)

/* Active Tab */
background: #FFFFFF
color: var(--brand-primary)
box-shadow: var(--shadow-xs)

/* Hover (inactive) */
color: var(--neutral-900)
```

### Code Block Component

```css
/* Container */
position: relative
background: var(--neutral-900)
border-radius: var(--radius-md)
padding: var(--space-5)
margin-bottom: var(--space-4)
font-family: 'Monaco', 'Menlo', monospace
font-size: 13px
line-height: 1.6
color: #E5E7EB
overflow-x: auto

/* Syntax Highlighting */
.tag { color: #F59E0B }      /* Orange */
.attr { color: #10B981 }      /* Green */
.value { color: #3B82F6 }     /* Blue */
.comment { color: #6B7280 }   /* Gray */

/* Copy Button */
position: absolute
top: var(--space-3)
right: var(--space-3)
padding: 6px 12px
background: rgba(255, 255, 255, 0.1)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: var(--radius-sm)
color: #FFFFFF
font-size: 12px
font-weight: 500
cursor: pointer
backdrop-filter: blur(8px)
transition: all 150ms ease

/* Copy Button Hover */
background: rgba(255, 255, 255, 0.15)
border-color: rgba(255, 255, 255, 0.3)

/* Copy Button Active (Copied State) */
background: var(--success-500)
border-color: var(--success-600)
content: "✓ Copied!"
```

### Tab Content Variations

#### Tab 1: Script Method

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  Recommended: Auto-Resizing Script                │
│  ────────────────────────────────────────────     │
│                                                   │
│  ✓ Automatically adjusts height                   │
│  ✓ Mobile responsive                              │
│  ✓ Works on any website                           │
│                                                   │
│  [Code Block with HTML]                           │
│                                                   │
│  Public Form URL                                  │
│  [URL Input with Copy Button]                     │
│                                                   │
│  [Preview Form] [Documentation]                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

#### Tab 2: Iframe Method

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  Direct Iframe Embed                              │
│  ────────────────────────────────────────────     │
│                                                   │
│  ⚠️ Requires manual height adjustment              │
│  ✓ Simple implementation                          │
│  ✓ No external script required                    │
│                                                   │
│  [Code Block with Iframe HTML]                    │
│                                                   │
│  💡 Tip: Use the script method for automatic       │
│  height adjustment.                               │
│                                                   │
│  [Preview Form] [Documentation]                   │
│                                                   │
└───────────────────────────────────────────────────┘
```

#### Tab 3: API Method

```
┌───────────────────────────────────────────────────┐
│                                                   │
│  Headless API Integration                         │
│  ────────────────────────────────────────────     │
│                                                   │
│  For custom form implementations and mobile apps  │
│                                                   │
│  Endpoint                                         │
│  [URL Input with Copy Button]                     │
│  POST /api/v1/forms/public/acme-corp/submit       │
│                                                   │
│  Request Body                                     │
│  [Code Block with JSON example]                   │
│                                                   │
│  Response                                         │
│  [Code Block with JSON response]                  │
│                                                   │
│  [View API Documentation]                         │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Info/Warning Banners

```css
/* Container */
padding: var(--space-4)
border-radius: var(--radius-md)
margin-bottom: var(--space-4)
display: flex
align-items: flex-start
gap: var(--space-3)
font-size: 14px
line-height: 1.5

/* Info Banner */
background: var(--info-50)
border: 1px solid var(--info-500)
color: var(--info-600)

/* Warning Banner */
background: var(--warning-50)
border: 1px solid var(--warning-500)
color: var(--warning-600)

/* Success Banner */
background: var(--success-50)
border: 1px solid var(--success-500)
color: var(--success-600)

/* Icon */
width: 20px
height: 20px
flex-shrink: 0
margin-top: 2px
```

### Feature Checklist

```css
/* Container */
display: flex
flex-direction: column
gap: var(--space-2)
margin-bottom: var(--space-4)

/* Item */
display: flex
align-items: center
gap: var(--space-2)
font-size: 14px
color: var(--neutral-700)

/* Checkmark Icon */
width: 16px
height: 16px
color: var(--success-500)

/* Warning Icon */
color: var(--warning-500)
```

---

## 6. Screen 4: Public Form Preview

### Purpose

The actual form that users see when embedded or accessed via public URL.

### Layout Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │  Contact Us                         │   │  ← H2 Heading (form title)
│  │  We'd love to hear from you         │   │  ← Optional subtitle
│  │                                     │   │
│  │  Email Address *                    │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ you@example.com               │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  Full Name *                        │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ John Smith                    │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  Company Name                       │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ Acme Inc                      │  │   │
│  │  └───────────────────────────────┘  │   │
│  │  Optional                           │   │
│  │                                     │   │
│  │  Message                            │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │                               │  │   │
│  │  │                               │  │   │
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │         Submit                │  │   │  ← Submit button
│  │  └───────────────────────────────┘  │   │
│  │                                     │   │
│  │  ───────────────────────────────    │   │
│  │  Powered by FlowTrack               │   │  ← Footer
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

### Form Container

```css
/* Outer Container (for embedding) */
width: 100%
max-width: 600px
margin: 0 auto
padding: 0
background: transparent

/* Form Card */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-8)
box-shadow: var(--shadow-sm)

/* When embedded in iframe */
border: none
box-shadow: none
padding: var(--space-6)
```

### Form Header

```css
/* Title */
font-size: 24px
font-weight: 600
color: var(--neutral-900)
margin-bottom: var(--space-2)
line-height: 1.3

/* Subtitle */
font-size: 15px
color: var(--neutral-600)
margin-bottom: var(--space-8)
line-height: 1.5
```

### Form Fields (Reusable Component)

```css
/* Field Container */
margin-bottom: var(--space-5)

/* Label */
display: block
font-size: 14px
font-weight: 500
color: var(--neutral-700)
margin-bottom: var(--space-2)

/* Required Indicator */
color: var(--error-500)
margin-left: 2px

/* Input/Textarea */
width: 100%
padding: var(--space-3) var(--space-4)
font-size: 15px
color: var(--neutral-900)
background: var(--neutral-50)
border: 1.5px solid var(--neutral-200)
border-radius: var(--radius-md)
transition: all 150ms ease

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)

/* Error State */
border-color: var(--error-500)
background: var(--error-50)

/* Help Text */
font-size: 13px
color: var(--neutral-500)
margin-top: var(--space-2)
line-height: 1.4

/* Error Message */
font-size: 13px
color: var(--error-500)
margin-top: var(--space-2)
display: flex
align-items: center
gap: var(--space-1)
```

### Submit Button

```css
width: 100%
padding: var(--space-3) var(--space-6)
background: var(--brand-primary)
color: #FFFFFF
border: none
border-radius: var(--radius-md)
font-size: 15px
font-weight: 600
cursor: pointer
transition: all 150ms ease
margin-top: var(--space-6)

/* Hover */
background: var(--brand-primary-hover)
transform: translateY(-1px)
box-shadow: var(--shadow-brand)

/* Active/Pressed */
transform: translateY(0)

/* Loading State */
opacity: 0.8
cursor: wait
/* Show spinner */

/* Disabled */
background: var(--neutral-300)
color: var(--neutral-500)
cursor: not-allowed
```

### Success State

```
┌─────────────────────────────────────────┐
│                                         │
│         ✓                               │  ← Animated checkmark
│                                         │
│    Thank you!                           │  ← H2
│    We'll be in touch soon.              │  ← Body text
│                                         │
│    Redirecting in 3 seconds...          │  ← Optional redirect notice
│                                         │
│    Reference: #LEAD-1234                │  ← Optional lead ID
│                                         │
└─────────────────────────────────────────┘
```

```css
/* Container */
text-align: center
padding: var(--space-12) var(--space-6)
animation: fadeIn 300ms ease

/* Checkmark Icon */
width: 64px
height: 64px
color: var(--success-500)
margin: 0 auto var(--space-6)
animation: scaleIn 400ms ease

/* Title */
font-size: 24px
font-weight: 600
color: var(--neutral-900)
margin-bottom: var(--space-2)

/* Message */
font-size: 15px
color: var(--neutral-600)
margin-bottom: var(--space-4)

/* Reference */
font-size: 13px
color: var(--neutral-500)
font-family: 'Monaco', monospace
```

### Footer Branding

```css
/* Container */
margin-top: var(--space-8)
padding-top: var(--space-6)
border-top: 1px solid var(--neutral-200)
text-align: center
font-size: 12px
color: var(--neutral-500)

/* Link */
color: var(--brand-primary)
text-decoration: none
font-weight: 500
margin-left: 4px

/* Hover */
text-decoration: underline
```

---

## 7. Screen 5: Form Analytics Dashboard

### Purpose

Show form performance metrics, submission trends, and lead sources.

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Contact Form Workflow                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tabs: [Canvas] [Form Settings] [📊 Analytics]                  │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                                           │ │
│  │  Form Performance                    Last 30 days    ▼   │ │
│  │                                                           │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │ │
│  │  │  📊     │  │  👁️     │  │  ✓      │  │  📈     │     │ │
│  │  │  234    │  │  1,245  │  │  18.8%  │  │  12.3%  │     │ │
│  │  │Submits  │  │  Views  │  │Convert  │  │  Change │     │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │ │
│  │                                                           │ │
│  │  Submissions Over Time                                    │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │                                    •••              │ │ │
│  │  │                               •••                   │ │ │
│  │  │                          •••                        │ │ │
│  │  │                     •••                             │ │ │
│  │  │                •••                                  │ │ │
│  │  │           •••                                       │ │ │
│  │  │      •••                                            │ │ │
│  │  │ •••                                                 │ │ │
│  │  │───|───|───|───|───|───|───|                        │ │ │
│  │  │  Mon  Thu  Sun Wed Sat Tue Fri                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Top Lead Sources                                         │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  Google Organic          124 (53%)  ████████░░      │ │ │
│  │  │  Direct                   67 (29%)  █████░░░░░      │ │ │
│  │  │  Facebook Ads             28 (12%)  ██░░░░░░░░      │ │ │
│  │  │  Email Campaign           15 (6%)   █░░░░░░░░░      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  │  Recent Submissions                   [View All Leads]   │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  john@example.com         John Smith       2m ago  │ │ │
│  │  │  Direct                                             │ │ │
│  │  ├─────────────────────────────────────────────────────┤ │ │
│  │  │  sarah@company.com        Sarah Jones      15m ago │ │ │
│  │  │  Google Organic                                     │ │ │
│  │  ├─────────────────────────────────────────────────────┤ │ │
│  │  │  mike@startup.io          Mike Chen         1h ago │ │ │
│  │  │  Facebook Ads                                       │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Metric Cards

```css
/* Container */
display: grid
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))
gap: var(--space-4)
margin-bottom: var(--space-8)

/* Card */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-5)
transition: all 150ms ease

/* Hover */
border-color: var(--neutral-300)
box-shadow: var(--shadow-sm)

/* Icon */
width: 32px
height: 32px
color: var(--brand-primary)
margin-bottom: var(--space-3)

/* Value */
font-size: 32px
font-weight: 700
color: var(--neutral-900)
margin-bottom: var(--space-1)

/* Label */
font-size: 14px
color: var(--neutral-600)
margin-bottom: var(--space-2)

/* Change Indicator */
font-size: 13px
display: flex
align-items: center
gap: var(--space-1)

/* Positive Change */
color: var(--success-600)

/* Negative Change */
color: var(--error-600)

/* Icon Arrow */
width: 14px
height: 14px
```

### Chart Container

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-6)
margin-bottom: var(--space-6)

/* Chart Title */
font-size: 16px
font-weight: 600
color: var(--neutral-900)
margin-bottom: var(--space-5)

/* Chart Area */
height: 240px
margin-bottom: var(--space-4)

/* Chart uses library like Recharts or Chart.js */
/* Axis labels: 12px, neutral-500 */
/* Grid lines: neutral-200 */
/* Data line: brand-primary */
/* Data points: brand-primary with white center */
/* Tooltip: white bg, shadow-md, rounded */
```

### Source List

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-6)
margin-bottom: var(--space-6)

/* List Item */
display: flex
align-items: center
justify-content: space-between
padding: var(--space-3) 0
border-bottom: 1px solid var(--neutral-100)

/* Last item has no border */
&:last-child { border-bottom: none }

/* Source Name */
font-size: 14px
font-weight: 500
color: var(--neutral-900)
flex: 1

/* Count */
font-size: 14px
color: var(--neutral-600)
margin-right: var(--space-4)

/* Progress Bar Container */
width: 120px
height: 8px
background: var(--neutral-100)
border-radius: var(--radius-full)
overflow: hidden

/* Progress Bar Fill */
height: 100%
background: var(--brand-primary)
border-radius: var(--radius-full)
transition: width 300ms ease
```

### Recent Submissions List

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)
padding: var(--space-6)

/* List Item */
padding: var(--space-4)
border-bottom: 1px solid var(--neutral-100)
transition: background 150ms ease

/* Hover */
background: var(--neutral-50)

/* Email */
font-size: 14px
font-weight: 500
color: var(--neutral-900)
margin-bottom: var(--space-1)

/* Name */
font-size: 14px
color: var(--neutral-600)
display: inline
margin-right: var(--space-3)

/* Timestamp */
font-size: 13px
color: var(--neutral-500)
float: right

/* Source */
font-size: 12px
color: var(--neutral-500)
display: inline-flex
align-items: center
gap: var(--space-1)
margin-top: var(--space-1)
```

### Empty State (No Data)

```
┌─────────────────────────────────────────┐
│                                         │
│         📊                              │
│                                         │
│    No submissions yet                   │
│                                         │
│    Share your form to start collecting  │
│    leads and see analytics here.        │
│                                         │
│    [Get Embed Code]                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Screen 6: Embedded Form (External Website)

### Purpose

Show how the form appears when embedded on an external website.

### Visual Example

```
┌─────────────────────────────────────────────────────────────────┐
│  Welcome to Acme Corp                    [Home] [About] [Blog]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Transform Your Business Today                                  │
│  ════════════════════════════════════                           │
│                                                                 │
│  Lorem ipsum dolor sit amet, consectetur adipiscing elit.       │
│  Sed do eiusmod tempor incididunt ut labore et dolore magna.    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ╔═══════════════════════════════════════════════════╗   │ │
│  │  ║                                                   ║   │ │  ← Embedded Iframe
│  │  ║  Get Started                                      ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║  Email Address *                                  ║   │ │
│  │  ║  ┌─────────────────────────────────────────────┐ ║   │ │
│  │  ║  │ you@example.com                             │ ║   │ │
│  │  ║  └─────────────────────────────────────────────┘ ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║  Full Name *                                      ║   │ │
│  │  ║  ┌─────────────────────────────────────────────┐ ║   │ │
│  │  ║  │ John Smith                                  │ ║   │ │
│  │  ║  └─────────────────────────────────────────────┘ ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║  ┌─────────────────────────────────────────────┐ ║   │ │
│  │  ║  │           Submit                            │ ║   │ │
│  │  ║  └─────────────────────────────────────────────┘ ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║  Powered by FlowTrack                             ║   │ │
│  │  ║                                                   ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  More content below the form...                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Integration Considerations

```css
/* Parent Website Container */
/* Form should adapt to parent's width */
.flowtrack-form-container {
  width: 100%
  max-width: 600px  /* Or inherit from parent */
  margin: 2rem auto
}

/* Iframe Styling */
iframe[data-flowtrack-iframe] {
  width: 100%
  border: none
  display: block
  /* Height set dynamically via postMessage */
}

/* Responsive Breakpoints */
@media (max-width: 768px) {
  .flowtrack-form-container {
    padding: 0 1rem
  }
}
```

---

## 9. Micro-Interactions & Animations

### Form Submission Flow

```
1. User clicks Submit
   ↓
2. Button shows loading spinner (150ms fade)
   ↓
3. API request sent
   ↓
4. Success response received
   ↓
5. Form fades out (200ms)
   ↓
6. Success message fades in (300ms)
   ↓
7. Checkmark animates (scale + fade, 400ms)
   ↓
8. If redirect configured: countdown starts
   ↓
9. Page navigates (500ms delay)
```

### Copy to Clipboard Animation

```
1. User clicks Copy button
   ↓
2. Text copied to clipboard
   ↓
3. Button background changes to success-500 (150ms)
   ↓
4. Button text changes to "✓ Copied!" (100ms)
   ↓
5. After 2 seconds, revert to original state (200ms)
```

```css
@keyframes copySuccess {
  0% {
    background: rgba(255, 255, 255, 0.1);
  }
  20% {
    background: var(--success-500);
    transform: scale(1.05);
  }
  100% {
    background: var(--success-500);
    transform: scale(1);
  }
}
```

### Field Focus Animation

```css
/* Input Focus Sequence */
@keyframes focusGlow {
  from {
    box-shadow: 0 0 0 0px var(--brand-primary-light);
  }
  to {
    box-shadow: 0 0 0 3px var(--brand-primary-light);
  }
}

/* Duration: 150ms */
/* Easing: ease-out */
```

### Form Resize Communication

```javascript
// Inside iframe
const observer = new ResizeObserver((entries) => {
  const height = entries[0].contentRect.height;
  window.parent.postMessage(
    {
      type: 'flowtrack:resize',
      height: height + 20, // Add padding
    },
    '*'
  );
});

observer.observe(formContainer);
```

### Success Checkmark Animation

```css
@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* Duration: 400ms */
/* Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55) */
```

### Loading Spinner

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  width: 20px
  height: 20px
  border: 2px solid rgba(255, 255, 255, 0.3)
  border-top-color: #FFFFFF
  border-radius: 50%
  animation: spin 600ms linear infinite
}
```

### Modal Enter/Exit

```css
/* Modal Overlay */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Content */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Exit animations use reverse */
```

---

## 10. Responsive Behavior

### Breakpoint Strategy

```css
/* Mobile First Approach */

/* Mobile: 0 - 639px */
@media (max-width: 639px) {
  /* Stack all content */
  /* Full-width inputs */
  /* Larger touch targets (48px minimum) */
  /* Simplified layouts */
}

/* Tablet: 640px - 1023px */
@media (min-width: 640px) {
  /* Two-column layouts where appropriate */
  /* Slightly larger spacing */
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Full split-screen layouts */
  /* Maximum component widths */
  /* Hover states enabled */
}
```

### Embed Code Modal Responsive

```css
/* Mobile */
@media (max-width: 639px) {
  .embed-modal {
    width: 95%
    max-height: 95vh
    border-radius: var(--radius-lg)
  }

  .embed-tabs {
    flex-direction: column
  }

  .code-block {
    font-size: 11px
    padding: var(--space-3)
  }
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  .embed-modal {
    width: 80%
    max-width: 600px
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .embed-modal {
    max-width: 800px
  }

  .code-block {
    max-height: 400px
    overflow-y: auto
  }
}
```

### Public Form Responsive

```css
/* Mobile */
@media (max-width: 639px) {
  .public-form {
    padding: var(--space-4)
  }

  .form-header h2 {
    font-size: 20px
  }

  input, textarea {
    font-size: 16px /* Prevent zoom on iOS */
  }

  button {
    height: 48px
    font-size: 16px
  }
}

/* Tablet & Desktop */
@media (min-width: 640px) {
  .public-form {
    padding: var(--space-8)
    max-width: 600px
    margin: 0 auto
  }
}
```

### Analytics Dashboard Responsive

```css
/* Mobile */
@media (max-width: 639px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr)
  }

  .chart-container {
    padding: var(--space-4)
  }

  .chart {
    height: 200px
  }

  .source-list-item {
    flex-direction: column
    align-items: flex-start
  }
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  .metric-cards {
    grid-template-columns: repeat(2, 1fr)
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .metric-cards {
    grid-template-columns: repeat(4, 1fr)
  }

  .analytics-layout {
    display: grid
    grid-template-columns: 2fr 1fr
    gap: var(--space-6)
  }
}
```

---

## 11. Error States & Edge Cases

### Form Submission Errors

#### Validation Error

```
┌─────────────────────────────────────────┐
│  Email Address *                        │
├─────────────────────────────────────────┤
│  invalid-email                      ❌  │  ← Red border
└─────────────────────────────────────────┘
  Please enter a valid email address        ← Error message
```

#### Network Error

```
┌─────────────────────────────────────────────┐
│  ⚠️  Unable to submit form                 │
│                                            │
│  Please check your connection and try     │
│  again.                                    │
│                                            │
│  [Try Again]                               │
└─────────────────────────────────────────────┘
```

```css
/* Error Banner */
background: var(--error-50)
border: 1px solid var(--error-500)
border-left: 4px solid var(--error-500)
padding: var(--space-4)
border-radius: var(--radius-md)
margin-bottom: var(--space-6)
color: var(--error-600)
```

#### Server Error (500)

```
┌─────────────────────────────────────────────┐
│  ⚠️  Something went wrong                   │
│                                            │
│  We're having trouble processing your     │
│  submission. Please try again later.       │
│                                            │
│  Error ID: ERR-1234-5678                   │
│                                            │
│  [Try Again] [Contact Support]             │
└─────────────────────────────────────────────┘
```

### Embed Code Modal Errors

#### Workflow Not Active

```
┌─────────────────────────────────────────────┐
│  ⚠️  Workflow Not Active                    │
│                                            │
│  You must activate this workflow before    │
│  embedding the form.                       │
│                                            │
│  [Activate Workflow]                       │
└─────────────────────────────────────────────┘
```

#### No Form Fields Configured

```
┌─────────────────────────────────────────────┐
│  ⚠️  No Form Fields                         │
│                                            │
│  Add at least one field to your form       │
│  before embedding.                         │
│                                            │
│  [Add Fields]                              │
└─────────────────────────────────────────────┘
```

### Public Form Edge Cases

#### Form Not Found (404)

```
┌─────────────────────────────────────────┐
│                                         │
│         🔍                              │
│                                         │
│    Form Not Found                       │
│                                         │
│    This form doesn't exist or has been  │
│    removed.                             │
│                                         │
│    [Back to Home]                       │
│                                         │
└─────────────────────────────────────────┘
```

#### Form Inactive

```
┌─────────────────────────────────────────┐
│                                         │
│         ⏸️                              │
│                                         │
│    Form Currently Unavailable           │
│                                         │
│    This form is temporarily disabled.   │
│    Please check back later.             │
│                                         │
└─────────────────────────────────────────┘
```

#### Rate Limited

```
┌─────────────────────────────────────────┐
│  ⚠️  Too Many Submissions                │
│                                         │
│  You've submitted this form too many    │
│  times. Please wait before trying       │
│  again.                                 │
│                                         │
│  Try again in: 5 minutes                │
└─────────────────────────────────────────┘
```

---

## 12. Accessibility Requirements

### Keyboard Navigation

```
Tab Order:
1. First form field
2. Second form field
3. ...remaining fields
4. Submit button
5. Footer link (if present)

Shortcuts:
- Enter: Submit form (from any input)
- Escape: Close modal (if in modal)
- Tab: Next field
- Shift+Tab: Previous field
```

### ARIA Attributes

```html
<!-- Form Container -->
<form role="form" aria-label="Contact Form">
  <!-- Input with Error -->
  <input
    type="email"
    id="email"
    aria-required="true"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" role="alert">
    Please enter a valid email address
  </span>

  <!-- Submit Button -->
  <button type="submit" aria-label="Submit form" aria-busy="false">
    Submit
  </button>

  <!-- Loading State -->
  <button type="submit" aria-label="Submitting form" aria-busy="true" disabled>
    <span role="status" aria-live="polite">Submitting...</span>
  </button>
</form>
```

### Focus Management

```javascript
// After form submission error
const firstInvalidField = form.querySelector('[aria-invalid="true"]');
firstInvalidField?.focus();

// After modal opens
const firstInput = modal.querySelector('input, button');
firstInput?.focus();

// After success
const successMessage = document.querySelector('[role="status"]');
successMessage?.focus();
```

### Color Contrast Requirements

```css
/* All text must meet WCAG AA (4.5:1 for normal, 3:1 for large) */

/* Passes */
--neutral-900 on white: 16.7:1 ✓
--neutral-700 on white: 10.7:1 ✓
--neutral-600 on white: 7.8:1 ✓
--neutral-500 on white: 4.9:1 ✓
--brand-primary on white: 8.6:1 ✓
--error-500 on white: 4.8:1 ✓

/* Fails - Use only for decorative elements */
--neutral-400 on white: 3.4:1 ✗ (use 14px+ only)
--neutral-300 on white: 2.1:1 ✗ (borders only)
```

### Screen Reader Announcements

```html
<!-- Live Regions for Dynamic Content -->
<div role="status" aria-live="polite" aria-atomic="true">
  Form submitted successfully
</div>

<!-- Error Announcements -->
<div role="alert" aria-live="assertive">
  Please fix 3 errors before submitting
</div>

<!-- Loading Announcements -->
<span class="sr-only" role="status" aria-live="polite">
  Loading form data
</span>
```

### Screen Reader Only Content

```css
.sr-only {
  position: absolute
  width: 1px
  height: 1px
  padding: 0
  margin: -1px
  overflow: hidden
  clip: rect(0, 0, 0, 0)
  white-space: nowrap
  border-width: 0
}
```

---

## 13. Implementation Checklist

### Phase 1: Core Workflow Integration

- [ ] Add "Get Embed Code" button to workflow cards
- [ ] Show embed badge for workflows with form triggers
- [ ] Filter embeddable workflows in list
- [ ] Create empty state for no embeddable workflows
- [ ] Add "Preview Form" button
- [ ] Implement workflow activation check

### Phase 2: Form Configuration UI

- [ ] Build form settings tab in workflow builder
- [ ] Implement drag-and-drop field reordering
- [ ] Create add/edit field modal
- [ ] Add field type dropdown with all options
- [ ] Implement field validation rules UI
- [ ] Add form appearance settings (button text, success message)
- [ ] Add redirect URL configuration
- [ ] Save form configuration to database

### Phase 3: Embed Code Modal

- [ ] Create modal component with three tabs
- [ ] Implement tab navigation
- [ ] Build code block component with syntax highlighting
- [ ] Add copy-to-clipboard functionality
- [ ] Show "Copied!" feedback animation
- [ ] Generate script embed code dynamically
- [ ] Generate iframe embed code dynamically
- [ ] Generate API example code
- [ ] Add preview button that opens public URL
- [ ] Show public form URL with copy button
- [ ] Add documentation links

### Phase 4: Public Form Page

- [ ] Create `/p/[slug]` dynamic route
- [ ] Fetch form schema by workspace slug
- [ ] Render form fields dynamically
- [ ] Implement field validation (client-side)
- [ ] Build form submission handler
- [ ] Add loading states
- [ ] Create success state component
- [ ] Implement redirect logic
- [ ] Add error handling (404, inactive, server error)
- [ ] Implement ResizeObserver for iframe height
- [ ] Send postMessage to parent window
- [ ] Add "Powered by FlowTrack" footer
- [ ] Make fully responsive

### Phase 5: Embed Widget

- [ ] Create vanilla JS embed script
- [ ] Find elements with `data-flowtrack-form` attribute
- [ ] Dynamically create iframes
- [ ] Listen for resize postMessage events
- [ ] Update iframe height automatically
- [ ] Handle submission success events
- [ ] Add UTK cookie tracking
- [ ] Dispatch custom events for parent page
- [ ] Serve script from `/embed/flowtrack-embed.js`

### Phase 6: Analytics Dashboard

- [ ] Create analytics tab in workflow builder
- [ ] Implement date range selector
- [ ] Build metric cards (submissions, views, conversion)
- [ ] Add trend indicators (up/down arrows)
- [ ] Create submissions over time chart
- [ ] Build top sources list with progress bars
- [ ] Create recent submissions table
- [ ] Add "View All Leads" button
- [ ] Implement empty state
- [ ] Make responsive (mobile/tablet/desktop)

### Phase 7: Error Handling & Edge Cases

- [ ] Handle form validation errors
- [ ] Show network error states
- [ ] Display server error messages
- [ ] Handle workflow not active error
- [ ] Handle no fields configured error
- [ ] Show form not found (404)
- [ ] Show form inactive state
- [ ] Implement rate limiting display
- [ ] Add retry mechanisms

### Phase 8: Accessibility & Polish

- [ ] Ensure proper tab order
- [ ] Add all ARIA attributes
- [ ] Implement focus management
- [ ] Test with screen readers
- [ ] Verify color contrast ratios
- [ ] Add keyboard shortcuts
- [ ] Test with keyboard only
- [ ] Add loading announcements
- [ ] Implement error announcements
- [ ] Add skip links where needed

### Phase 9: Animations & Micro-interactions

- [ ] Add form submission animation
- [ ] Implement copy success animation
- [ ] Create field focus glow
- [ ] Add modal enter/exit animations
- [ ] Implement success checkmark animation
- [ ] Add loading spinner
- [ ] Create smooth transitions
- [ ] Test animations on slower devices
- [ ] Add prefers-reduced-motion support

### Phase 10: Testing & QA

- [ ] Test embed on external websites
- [ ] Verify iframe resizing works
- [ ] Test all three embed methods
- [ ] Verify form submissions create leads
- [ ] Test workflow triggering
- [ ] Verify analytics tracking
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Verify accessibility with tools
- [ ] Test error scenarios
- [ ] Verify CORS configuration
- [ ] Test rate limiting
- [ ] Load test with concurrent submissions

---

## Appendix A: Component Props Reference

### EmbedCodeModal

```typescript
interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowId: string;
  workspaceSlug: string;
  publicUrl: string;
}
```

### PublicForm

```typescript
interface PublicFormProps {
  slug: string;
  embedded?: boolean;
}
```

### FormFieldRenderer

```typescript
interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

interface FormField {
  id: string;
  fieldKey: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[]; // For dropdown
  validation?: ValidationRules;
}
```

### FormAnalyticsDashboard

```typescript
interface FormAnalyticsDashboardProps {
  workflowId: string;
  dateRange: DateRange;
}

interface AnalyticsData {
  totalSubmissions: number;
  totalViews: number;
  conversionRate: number;
  changePercentage: number;
  submissionsOverTime: DataPoint[];
  topSources: Source[];
  recentSubmissions: Submission[];
}
```

---

## Appendix B: Color Palette Reference

```css
:root {
  /* Brand */
  --brand-primary: #4f46e5;
  --brand-primary-hover: #4338ca;
  --brand-primary-light: #eef2ff;
  --brand-accent: #7c3aed;

  /* Neutrals */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;

  /* Semantic */
  --success-50: #ecfdf5;
  --success-500: #10b981;
  --success-600: #059669;

  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  --warning-50: #fffbeb;
  --warning-500: #f59e0b;

  --info-50: #eff6ff;
  --info-500: #3b82f6;
}
```

---

**End of Specification**

This document serves as the comprehensive UI/UX guide for implementing the Form Embedding feature in FlowTrack. All screens, interactions, and visual elements should follow these specifications for a consistent, professional, and accessible user experience.

**Version:** 1.0.0
**Last Updated:** November 27, 2025
**Status:** ✅ Ready for Implementation
