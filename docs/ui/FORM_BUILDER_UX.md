# FlowTrack Form Builder - UI/UX Design Specification

## Document Overview

**Purpose**: This document provides complete design specifications for the Form Builder screen (Step 2 of Onboarding), where users customize their lead intake form by adding custom fields to capture specific data points.

**Related Documents**:

- [Login UX Specification](./LOGIN_UX.md)
- [UX Specification (Main)](../../UX.md) - See Screen 2
- [Technical Documentation](../../../backend/docs/TECHNICAL-DOCUMENTATION.md)
- [Product Plan](../../PRODUCT_PLAN.md)

**Version**: 1.0
**Last Updated**: 2025-01-22

---

## 1. Visual Strategy & Brand Vibe

### Core Design Philosophy

The Form Builder should embody **"Configuration over Creation"** — users are customizing a proven template, not building from scratch. The interface should feel like:

- **Guided Discovery**: Clear path from default to customized
- **Immediate Feedback**: Live preview shows results instantly
- **Safe Experimentation**: Easy to add, edit, and remove without fear
- **Progressive Disclosure**: Advanced options revealed when needed

### Visual Tone

**"Glass Box" Transparency with Tactile Interactions**

- Primary aesthetic: Clean, structured workspace with dynamic live preview
- NOT a blank canvas (avoid intimidation)
- NOT overly technical (avoid form schema jargon)
- TARGET: Notion-like ease meets Figma-like precision

### Design Principles

1. **Default Fields as Foundation**: Locked default fields (Name, Email, Company Name) establish structure
2. **Variable Generation as Magic**: Adding "Budget" field automatically makes `{budget}` available in email templates
3. **Live Preview as Validation**: Users see exactly what leads will see
4. **Drag Handles as Affordance**: Clear visual language for reordering

---

## 2. Layout Architecture

### Two-Panel Structure (50/50 Ratio)

```
┌─────────────────────────────────────────────────────────┐
│                    │                                    │
│   FORM BUILDER     │     LIVE PREVIEW                   │
│   (Left 50%)       │     (Right 50%)                    │
│                    │                                    │
│   - Header         │     - Preview Header               │
│   - Default Fields │     - Rendered Form                │
│   - Custom Fields  │     - Variable Pills               │
│   - Add FieldBtn  │     - Responsive Toggle            │
│                    │                                    │
└─────────────────────────────────────────────────────────┘
```

### Desktop Layout (≥1280px)

- **Left Panel (50% width)**: Form builder workspace, scrollable
- **Right Panel (50% width)**: Live preview, sticky header
- **Split Divider**: Subtle 1px border, no resize capability (v1)
- **Minimum Width**: 1280px (shows warning below this)

### Tablet Layout (768px - 1279px)

- **Stacked Layout**: Builder on top, preview below
- **Preview**: Collapses to accordion (expandable on click)
- **Sticky CTA**: "Continue" button fixed at bottom

### Mobile Layout (<768px)

- **Single Column**: Builder only
- **Preview**: Hidden by default, accessible via modal/sheet
- **Touch Targets**: Minimum 48px tap targets
- **Simplified Actions**: Condensed action menus

---

## 3. Design System Definitions

### Color Palette

#### Primary Brand Colors (Consistent with Login)

```css
--brand-primary: #4f46e5 /* Indigo 600 - Primary actions */
  --brand-primary-hover: #4338ca /* Indigo 700 - Hover states */
  --brand-primary-light: #eef2ff /* Indigo 50 - Backgrounds */
  --brand-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
```

#### Neutral Scale

```css
--neutral-50: #f9fafb /* Lightest background */ --neutral-100: #f3f4f6
  /* Card backgrounds */ --neutral-200: #e5e7eb /* Borders, dividers */
  --neutral-300: #d1d5db /* Disabled states */ --neutral-400: #9ca3af
  /* Placeholder text */ --neutral-500: #6b7280 /* Secondary text */
  --neutral-600: #4b5563 /* Labels */ --neutral-700: #374151 /* Body text */
  --neutral-900: #111827 /* Headings */;
```

#### Semantic Colors

```css
--success-500: #10b981 /* Green - Success states */ --error-500: #ef4444
  /* Red - Error states */ --warning-500: #f59e0b /* Amber - Warning states */
  --info-500: #3b82f6 /* Blue - Info states */;
```

#### Form Builder Specific

```css
--field-card-bg: #ffffff --field-card-border: var(--neutral-200)
  --field-card-hover: var(--neutral-50) --field-locked-bg: var(--neutral-50)
  --field-locked-border: var(--neutral-300) --drag-handle: var(--neutral-400)
  --drag-active: var(--brand-primary) --preview-bg: var(--neutral-50);
```

### Typography

#### Font Stack

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

#### Type Scale

**H1 - Page Title** ("Build Your Intake Form")

```css
font-size: 28px
font-weight: 700 (Bold)
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
```

**H2 - Section Heading** ("Default Fields", "Custom Fields")

```css
font-size: 16px
font-weight: 600 (Semibold)
line-height: 1.3
color: var(--neutral-700)
letter-spacing: -0.01em
text-transform: uppercase
font-size: 12px (for section labels)
```

**H3 - Field Label**

```css
font-size: 14px
font-weight: 500 (Medium)
line-height: 1.4
color: var(--neutral-700)
```

**Body - General Text**

```css
font-size: 14px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)
```

**Small - Helper Text**

```css
font-size: 13px
font-weight: 400
line-height: 1.4
color: var(--neutral-500)
```

**Code - Variable Pills**

```css
font-family: 'JetBrains Mono', 'Fira Code', monospace
font-size: 13px
font-weight: 500
color: var(--brand-primary)
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
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05) --shadow-md: 0 4px 6px
  rgba(0, 0, 0, 0.07) --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
  --shadow-field: 0 1px 3px rgba(0, 0, 0, 0.08) --shadow-field-hover: 0 4px 12px
  rgba(0, 0, 0, 0.12) --shadow-modal: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### Transitions

```css
--transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1) --transition-base: 150ms
  cubic-bezier(0.4, 0, 0.2, 1) --transition-slow: 300ms
  cubic-bezier(0.4, 0, 0.2, 1) --transition-bounce: 400ms
  cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 4. Component Specifications

### 4.1 Page Header

#### Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  ← Back                      Step 2 of 5            │
│                                                     │
│  Build Your Intake Form                            │
│  Add custom fields to capture the exact data       │
│  you need from leads.                              │
└─────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
padding: var(--space-8) var(--space-10)
background: #FFFFFF
border-bottom: 1px solid var(--neutral-200)

/* Back Button */
display: flex
align-items: center
gap: var(--space-2)
font-size: 14px
color: var(--neutral-600)
cursor: pointer
transition: color var(--transition-base)

/* Hover */
color: var(--brand-primary)

/* Step Indicator */
position: absolute
top: var(--space-8)
right: var(--space-10)
font-size: 13px
color: var(--neutral-500)
font-weight: 500

/* Title */
margin-top: var(--space-4)
margin-bottom: var(--space-2)

/* Subtitle */
max-width: 600px
```

---

### 4.2 Default Field Card (Locked)

#### Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  🔒  Name                                    [i]    │
│      Full name of the lead                         │
│      Required • Text                               │
└─────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
width: 100%
padding: var(--space-4)
background: var(--field-locked-bg)
border: 1.5px solid var(--field-locked-border)
border-radius: var(--radius-md)
margin-bottom: var(--space-3)
cursor: not-allowed
opacity: 0.9

/* Lock Icon */
position: absolute
top: var(--space-4)
left: var(--space-4)
size: 16px
color: var(--neutral-400)

/* Field Label */
font-size: 14px
font-weight: 600
color: var(--neutral-700)
margin-left: var(--space-6) /* offset for lock icon */

/* Info Icon */
position: absolute
top: var(--space-4)
right: var(--space-4)
size: 16px
color: var(--neutral-400)
cursor: help

/* Description */
font-size: 13px
color: var(--neutral-500)
margin-top: var(--space-1)
margin-left: var(--space-6)

/* Metadata Pills */
display: flex
gap: var(--space-2)
margin-top: var(--space-2)
margin-left: var(--space-6)
```

#### Metadata Pills

```css
/* Pill Container */
display: inline-flex
align-items: center
padding: 2px 8px
background: var(--neutral-200)
border-radius: var(--radius-full)
font-size: 11px
font-weight: 500
color: var(--neutral-600)
text-transform: uppercase
letter-spacing: 0.02em
```

#### States

**Default**: As specified above
**Hover**: No change (locked state)
**Info Tooltip**: Shows on info icon hover

```
"This is a default field required for all leads.
It cannot be removed or edited."
```

---

### 4.3 Custom Field Card (Editable)

#### Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  ⋮⋮  Project Budget                    [Edit] [×]  │
│      Choose your project budget range              │
│      Required • Dropdown • 3 options               │
│      Variable: {projectBudget}                     │
└─────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
width: 100%
padding: var(--space-4)
background: var(--field-card-bg)
border: 1.5px solid var(--field-card-border)
border-radius: var(--radius-md)
margin-bottom: var(--space-3)
cursor: grab
transition: all var(--transition-base)
box-shadow: var(--shadow-field)

/* Hover State */
background: var(--field-card-hover)
border-color: var(--neutral-300)
box-shadow: var(--shadow-field-hover)

/* Dragging State */
opacity: 0.6
box-shadow: var(--shadow-lg)
cursor: grabbing
transform: rotate(2deg)

/* Drop Preview */
border: 2px dashed var(--brand-primary)
background: var(--brand-primary-light)
opacity: 0.5
```

#### Drag Handle

```css
/* Container */
position: absolute
top: 50%
left: var(--space-4)
transform: translateY(-50%)
width: 20px
height: 32px
display: flex
align-items: center
justify-content: center
cursor: grab

/* Icon (⋮⋮) */
width: 16px
height: 16px
color: var(--drag-handle)
transition: color var(--transition-base)

/* Hover */
color: var(--drag-active)

/* Active */
cursor: grabbing
color: var(--brand-primary)
```

#### Action Buttons

```css
/* Container */
position: absolute
top: var(--space-4)
right: var(--space-4)
display: flex
gap: var(--space-2)

/* Edit Button */
padding: 6px 12px
font-size: 13px
font-weight: 500
color: var(--brand-primary)
background: var(--brand-primary-light)
border: none
border-radius: var(--radius-sm)
cursor: pointer
transition: all var(--transition-base)

/* Edit Hover */
background: var(--brand-primary)
color: #FFFFFF

/* Delete Button */
padding: 6px
width: 28px
height: 28px
display: flex
align-items: center
justify-content: center
color: var(--neutral-500)
background: transparent
border: 1px solid var(--neutral-200)
border-radius: var(--radius-sm)
cursor: pointer
transition: all var(--transition-base)

/* Delete Hover */
background: var(--error-500)
border-color: var(--error-500)
color: #FFFFFF
```

#### Field Content

```css
/* Label */
font-size: 14px
font-weight: 600
color: var(--neutral-700)
margin-left: var(--space-8) /* offset for drag handle */
margin-right: var(--space-16) /* offset for action buttons */

/* Description */
font-size: 13px
color: var(--neutral-500)
margin-top: var(--space-1)
margin-left: var(--space-8)

/* Metadata Pills */
display: flex
gap: var(--space-2)
margin-top: var(--space-2)
margin-left: var(--space-8)
flex-wrap: wrap

/* Variable Badge */
display: inline-flex
align-items: center
gap: var(--space-1)
margin-top: var(--space-2)
margin-left: var(--space-8)
padding: 4px 8px
background: var(--brand-primary-light)
border-radius: var(--radius-sm)
font-family: 'JetBrains Mono', monospace
font-size: 12px
font-weight: 500
color: var(--brand-primary)
```

---

### 4.4 Add Field Button

#### Visual Structure

```
┌─────────────────────────────────────────────────────┐
│  + Add Custom Field                                 │
└─────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
width: 100%
padding: var(--space-4)
background: transparent
border: 2px dashed var(--neutral-300)
border-radius: var(--radius-md)
cursor: pointer
transition: all var(--transition-base)
display: flex
align-items: center
justify-content: center
gap: var(--space-2)
font-size: 14px
font-weight: 500
color: var(--neutral-600)
margin-top: var(--space-4)

/* Hover State */
border-color: var(--brand-primary)
background: var(--brand-primary-light)
color: var(--brand-primary)

/* Active State */
transform: scale(0.98)
```

#### Icon

```css
/* Plus Icon */
width: 20px
height: 20px
stroke-width: 2px
transition: transform var(--transition-base)

/* Hover */
transform: rotate(90deg)
```

---

### 4.5 Field Editor Modal

#### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Add Custom Field                              [×]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Field Type                                         │
│  ┌─────────────────────────────────────────────┐   │
│  │  Text                                    ▼  │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Field Label *                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  e.g., Project Budget                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Placeholder Text                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Select your budget range                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Help Text                                          │
│  ┌─────────────────────────────────────────────┐   │
│  │  This helps us match you with...            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ☑ Required field                                   │
│                                                     │
│  [Type-Specific Options Area]                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                          [Cancel]  [Add Field]      │
└─────────────────────────────────────────────────────┘
```

#### Modal Container

```css
/* Overlay */
position: fixed
inset: 0
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)
z-index: 50
display: flex
align-items: center
justify-content: center

/* Modal */
width: 90%
max-width: 560px
max-height: 85vh
background: #FFFFFF
border-radius: var(--radius-lg)
box-shadow: var(--shadow-modal)
overflow: hidden
display: flex
flex-direction: column
```

#### Modal Header

```css
/* Container */
padding: var(--space-6)
border-bottom: 1px solid var(--neutral-200)
display: flex
align-items: center
justify-content: space-between

/* Title */
font-size: 20px
font-weight: 600
color: var(--neutral-900)

/* Close Button */
width: 32px
height: 32px
display: flex
align-items: center
justify-content: center
color: var(--neutral-500)
background: transparent
border: none
border-radius: var(--radius-sm)
cursor: pointer
transition: all var(--transition-base)

/* Close Hover */
background: var(--neutral-100)
color: var(--neutral-700)
```

#### Modal Body

```css
/* Container */
padding: var(--space-6)
overflow-y: auto
flex: 1

/* Field Group */
margin-bottom: var(--space-6)

/* Last Field Group */
margin-bottom: 0
```

#### Modal Footer

```css
/* Container */
padding: var(--space-6)
border-top: 1px solid var(--neutral-200)
display: flex
align-items: center
justify-content: flex-end
gap: var(--space-3)

/* Cancel Button */
padding: 10px 20px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: transparent
border: 1px solid var(--neutral-300)
border-radius: var(--radius-md)
cursor: pointer
transition: all var(--transition-base)

/* Cancel Hover */
background: var(--neutral-100)
border-color: var(--neutral-400)

/* Primary Button */
padding: 10px 24px
font-size: 14px
font-weight: 600
color: #FFFFFF
background: var(--brand-primary)
border: none
border-radius: var(--radius-md)
cursor: pointer
transition: all var(--transition-base)

/* Primary Hover */
background: var(--brand-primary-hover)
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2)

/* Disabled State */
opacity: 0.5
cursor: not-allowed
transform: none
box-shadow: none
```

---

### 4.6 Field Type Selector

#### Visual Structure

```
┌─────────────────────────────────────────────────┐
│  Field Type                                     │
│  ┌───────────────────────────────────────────┐ │
│  │  📝 Text                               ▼  │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Dropdown options:
- 📝 Text (Single line input)
- ✉️ Email (Validates email format)
- 🔢 Number (Numeric input only)
- 📋 Dropdown (Multiple choice)
- 📄 Textarea (Multi-line text)
- 📅 Date (Date picker)
- ☑️ Checkbox (True/false toggle)
```

#### Specifications

```css
/* Select Container */
width: 100%
padding: 10px 14px
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: var(--radius-md)
font-size: 14px
color: var(--neutral-900)
cursor: pointer
transition: all var(--transition-base)
appearance: none
background-image: url("data:image/svg+xml,...") /* chevron down */
background-repeat: no-repeat
background-position: right 12px center
padding-right: 40px

/* Focus */
border-color: var(--brand-primary)
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)

/* Option */
padding: 12px 16px
font-size: 14px
color: var(--neutral-900)
cursor: pointer

/* Option Hover */
background: var(--neutral-50)

/* Option Selected */
background: var(--brand-primary-light)
color: var(--brand-primary)
font-weight: 500
```

---

### 4.7 Dropdown Options Editor

#### Visual Structure (for Dropdown field type)

```
┌─────────────────────────────────────────────────┐
│  Options                                        │
│  ┌───────────────────────────────────────────┐ │
│  │  $500                               [×]   │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  $2,000                             [×]   │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  $5,000                             [×]   │ │
│  └───────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────┐ │
│  │  + Add option                             │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Option Container */
width: 100%
padding: 10px 12px
background: var(--neutral-50)
border: 1.5px solid var(--neutral-200)
border-radius: var(--radius-md)
margin-bottom: var(--space-2)
display: flex
align-items: center
gap: var(--space-2)

/* Option Input */
flex: 1
border: none
background: transparent
font-size: 14px
color: var(--neutral-900)
outline: none

/* Delete Option Button */
width: 24px
height: 24px
display: flex
align-items: center
justify-content: center
color: var(--neutral-400)
background: transparent
border: none
border-radius: var(--radius-sm)
cursor: pointer
transition: all var(--transition-base)

/* Delete Hover */
background: var(--error-500)
color: #FFFFFF

/* Add Option Button */
width: 100%
padding: 10px 12px
background: transparent
border: 2px dashed var(--neutral-300)
border-radius: var(--radius-md)
font-size: 14px
font-weight: 500
color: var(--neutral-600)
cursor: pointer
transition: all var(--transition-base)
display: flex
align-items: center
justify-content: center
gap: var(--space-2)

/* Add Option Hover */
border-color: var(--brand-primary)
background: var(--brand-primary-light)
color: var(--brand-primary)
```

#### Validation

- Minimum 2 options required
- Maximum 20 options
- Empty options not allowed
- Duplicate options show warning

---

### 4.8 Required Field Toggle

#### Visual Structure

```
┌─────────────────────────────────────────────────┐
│  ☑ Required field                               │
│  Leads must fill this field to submit          │
└─────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
display: flex
align-items: flex-start
gap: var(--space-3)
padding: var(--space-4)
background: var(--neutral-50)
border-radius: var(--radius-md)
cursor: pointer
transition: background var(--transition-base)

/* Hover */
background: var(--neutral-100)

/* Checkbox */
width: 20px
height: 20px
flex-shrink: 0
border: 2px solid var(--neutral-300)
border-radius: var(--radius-sm)
background: #FFFFFF
cursor: pointer
transition: all var(--transition-base)
position: relative

/* Checked */
background: var(--brand-primary)
border-color: var(--brand-primary)

/* Checkmark (when checked) */
position: absolute
inset: 0
display: flex
align-items: center
justify-content: center
color: #FFFFFF
font-size: 14px
font-weight: bold

/* Label */
flex: 1
font-size: 14px
font-weight: 500
color: var(--neutral-700)

/* Helper Text */
font-size: 13px
color: var(--neutral-500)
margin-top: var(--space-1)
```

---

### 4.9 Live Preview Panel

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Form Preview                                   │
│  ┌─ Desktop ─┬─ Mobile ─────────────────────┐  │
│  │                                           │  │
│  │  [Rendered Form]                          │  │
│  │                                           │  │
│  │  Default Fields:                          │  │
│  │  • Name                                   │  │
│  │  • Email                                  │  │
│  │  • Company Name                           │  │
│  │                                           │  │
│  │  Custom Fields:                           │  │
│  │  • Project Budget (Dropdown)              │  │
│  │  • Timeline (Text)                        │  │
│  │                                           │  │
│  │  [Submit Button Preview]                  │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Available Variables:                           │
│  {name} {email} {companyName} {projectBudget}   │
│  {timeline}                                     │
└─────────────────────────────────────────────────┘
```

#### Panel Container

```css
/* Container */
position: sticky
top: 0
height: 100vh
padding: var(--space-8)
background: var(--preview-bg)
border-left: 1px solid var(--neutral-200)
overflow-y: auto

/* Header */
margin-bottom: var(--space-6)
```

#### Preview Tabs

```css
/* Tab Container */
display: flex
background: var(--neutral-200)
border-radius: var(--radius-md)
padding: 4px
margin-bottom: var(--space-6)

/* Tab */
flex: 1
padding: 8px 16px
font-size: 13px
font-weight: 500
color: var(--neutral-600)
background: transparent
border: none
border-radius: var(--radius-sm)
cursor: pointer
transition: all var(--transition-base)

/* Active Tab */
background: #FFFFFF
color: var(--brand-primary)
box-shadow: var(--shadow-sm)
```

#### Form Preview Container

```css
/* Desktop Preview */
width: 100%
max-width: 480px
margin: 0 auto
padding: var(--space-8)
background: #FFFFFF
border-radius: var(--radius-lg)
box-shadow: var(--shadow-lg)

/* Mobile Preview */
width: 375px /* iPhone SE */
margin: 0 auto
padding: var(--space-6)
background: #FFFFFF
border-radius: var(--radius-xl)
box-shadow: var(--shadow-lg)
border: 12px solid var(--neutral-900) /* phone bezel */
```

#### Preview Form Elements

```css
/* Matches actual public form styling */

/* Input */
width: 100%
padding: 10px 14px
border: 1.5px solid var(--neutral-200)
border-radius: var(--radius-md)
font-size: 14px
margin-bottom: var(--space-4)
background: var(--neutral-50)

/* Label */
display: block
margin-bottom: var(--space-2)
font-size: 14px
font-weight: 500
color: var(--neutral-700)

/* Required Asterisk */
color: var(--error-500)
margin-left: 2px

/* Submit Button */
width: 100%
padding: 12px 24px
background: var(--brand-gradient)
color: #FFFFFF
border: none
border-radius: var(--radius-md)
font-size: 15px
font-weight: 600
cursor: pointer
margin-top: var(--space-6)
```

#### Variable Pills Section

```css
/* Container */
margin-top: var(--space-8)
padding: var(--space-4)
background: var(--brand-primary-light)
border-radius: var(--radius-md)
border: 1px solid var(--brand-primary)

/* Title */
font-size: 12px
font-weight: 600
color: var(--brand-primary)
text-transform: uppercase
letter-spacing: 0.05em
margin-bottom: var(--space-3)

/* Pills Container */
display: flex
flex-wrap: wrap
gap: var(--space-2)

/* Variable Pill */
display: inline-flex
align-items: center
padding: 4px 10px
background: #FFFFFF
border: 1px solid var(--brand-primary)
border-radius: var(--radius-full)
font-family: 'JetBrains Mono', monospace
font-size: 12px
font-weight: 500
color: var(--brand-primary)
cursor: pointer
transition: all var(--transition-base)

/* Pill Hover */
background: var(--brand-primary)
color: #FFFFFF
transform: translateY(-2px)
box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3)
```

---

### 4.10 Bottom Action Bar

#### Visual Structure

```
┌─────────────────────────────────────────────────┐
│  [← Back]                 [Continue to Email →] │
└─────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
position: fixed
bottom: 0
left: 0
right: 0
padding: var(--space-6) var(--space-10)
background: #FFFFFF
border-top: 1px solid var(--neutral-200)
display: flex
align-items: center
justify-content: space-between
z-index: 10
box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05)

/* Back Button */
padding: 10px 20px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: transparent
border: 1px solid var(--neutral-300)
border-radius: var(--radius-md)
cursor: pointer
transition: all var(--transition-base)
display: flex
align-items: center
gap: var(--space-2)

/* Back Hover */
background: var(--neutral-100)
border-color: var(--neutral-400)

/* Continue Button */
padding: 12px 28px
font-size: 15px
font-weight: 600
color: #FFFFFF
background: var(--brand-gradient)
border: none
border-radius: var(--radius-md)
cursor: pointer
transition: all var(--transition-base)
display: flex
align-items: center
gap: var(--space-2)

/* Continue Hover */
transform: translateY(-2px)
box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3)

/* Continue Disabled */
opacity: 0.5
cursor: not-allowed
transform: none
box-shadow: none
```

---

## 5. Micro-Interactions & Animation Specifications

### 5.1 Field Card Drag & Drop

#### Drag Start

```
Trigger: Mouse down on drag handle
Duration: 150ms
Easing: ease-out

Sequence:
1. Cursor changes to 'grabbing'
2. Card lifts with shadow (0→shadow-lg, 150ms)
3. Card rotates slightly (0deg→2deg, 150ms)
4. Card opacity reduces (1→0.6, 150ms)
5. Drop zones highlight with dashed border
```

#### Drag Over

```
Trigger: Card dragged over valid drop zone
Duration: 200ms
Easing: ease-in-out

Effect:
1. Other cards shift to make space (transform: translateY(), 200ms)
2. Drop indicator appears (dashed line with primary color)
3. Drop zone background tints (transparent→primary-light, 200ms)
```

#### Drop

```
Trigger: Mouse released over valid drop zone
Duration: 300ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55) [bounce]

Sequence:
1. Card snaps to new position (300ms bounce)
2. Rotation resets (2deg→0deg, 200ms)
3. Opacity restores (0.6→1, 200ms)
4. Shadow reduces (shadow-lg→shadow-field, 200ms)
5. Other cards settle into final positions (200ms ease-out)
6. Success micro-feedback: subtle scale pulse (1→1.02→1, 400ms)
```

---

### 5.2 Add Field Flow

#### Button Click

```
Trigger: Click "Add Custom Field"
Duration: 100ms
Easing: ease-in

Effect:
1. Button scales down (1→0.98, 100ms)
2. Border pulses (neutral-300→primary→neutral-300, 300ms)
```

#### Modal Enter

```
Trigger: Modal opens
Duration: 250ms
Easing: ease-out

Sequence:
1. Overlay fades in (opacity: 0→1, 200ms)
2. Blur applies (backdrop-filter: blur(0px)→blur(4px), 200ms)
3. Modal scales up (transform: scale(0.95)→scale(1), 250ms)
4. Modal fades in (opacity: 0→1, 250ms)
5. First input auto-focuses after 100ms delay
```

#### Field Type Change

```
Trigger: User selects different field type
Duration: 200ms
Easing: ease-in-out

Effect:
1. Current options fade out (opacity: 1→0, 100ms)
2. Height animates to accommodate new options (200ms)
3. New options fade in (opacity: 0→1, 100ms, delay: 100ms)
```

#### Modal Exit

```
Trigger: Click Cancel, Close, or outside modal
Duration: 200ms
Easing: ease-in

Sequence:
1. Modal scales down (transform: scale(1)→scale(0.95), 200ms)
2. Modal fades out (opacity: 1→0, 200ms)
3. Overlay fades out (opacity: 1→0, 200ms)
4. Blur removes (backdrop-filter: blur(4px)→blur(0px), 200ms)
```

---

### 5.3 Field Add Success

```
Trigger: New field successfully added
Duration: 500ms
Easing: cubic-bezier(0.68, -0.55, 0.265, 1.55) [bounce]

Sequence:
1. Modal closes (200ms, as above)
2. New card appears at bottom of custom fields list
3. Card slides in from right (transform: translateX(20px)→translateX(0), 300ms bounce)
4. Card fades in (opacity: 0→1, 300ms)
5. Live preview updates (300ms, new field slides up)
6. New variable pill appears in preview panel (fade + scale, 200ms)
7. Subtle success toast: "Field added" (appears for 2s)
```

---

### 5.4 Field Delete Confirmation

#### Delete Button Click

```
Trigger: Click delete (×) button on field card
Duration: Immediate

Effect:
1. Confirmation dialog appears (slide up from bottom, 200ms)
```

#### Confirmation Dialog

```
┌─────────────────────────────────────────────────┐
│  Delete "Project Budget"?                       │
│  This cannot be undone. The {projectBudget}     │
│  variable will no longer be available.          │
│                                                 │
│  [Cancel]  [Delete Field]                       │
└─────────────────────────────────────────────────┘
```

#### Delete Confirmed

```
Trigger: Click "Delete Field"
Duration: 400ms
Easing: ease-in-out

Sequence:
1. Dialog closes (slide down, 150ms)
2. Card background fades to error-500 (200ms)
3. Card shrinks horizontally (transform: scaleX(1)→scaleX(0), 200ms)
4. Card height collapses (max-height: auto→0, 200ms)
5. Other cards shift up to fill space (200ms ease-out)
6. Preview panel updates (field fades out, 200ms)
7. Variable pill removes from preview (fade + scale out, 150ms)
8. Toast notification: "Field deleted"
```

---

### 5.5 Live Preview Updates

#### Field Added

```
Trigger: New field created
Duration: 300ms
Easing: ease-out

Effect:
1. New input slides up from bottom (translateY(20px)→0, 300ms)
2. Input fades in (opacity: 0→1, 300ms)
3. Preview scrolls to show new field if needed (300ms smooth scroll)
```

#### Field Edited

```
Trigger: Field properties changed
Duration: 200ms
Easing: ease-in-out

Effect:
1. Changed property highlights briefly (background: transparent→primary-light→transparent, 400ms)
2. Label/placeholder text morphs (200ms)
3. If field type changed, entire input cross-fades (200ms)
```

#### Field Reordered

```
Trigger: Drag & drop reorder
Duration: 300ms
Easing: ease-in-out

Effect:
1. Preview inputs rearrange to match (stagger: 50ms per field)
2. Each input slides to new position (translateY, 300ms)
```

---

### 5.6 Page Entry Animation

```
Trigger: Navigate to Form Builder screen
Duration: 400ms
Easing: ease-out

Sequence:
1. Header slides in from top (translateY(-20px)→0, 300ms, delay: 0ms)
2. Left panel fades in (opacity: 0→1, 400ms, delay: 100ms)
3. Default fields stagger in (each 100ms apart, slide from left)
4. "Add Field" button bounces in (scale: 0.8→1, 300ms bounce, delay: 400ms)
5. Preview panel slides in from right (translateX(40px)→0, 400ms, delay: 200ms)
6. Variable pills stagger in (fade + scale, 50ms apart, delay: 600ms)
```

---

### 5.7 Validation Error Shake

```
Trigger: Try to continue with validation errors
Duration: 400ms
Easing: ease-in-out

Animation:
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

Effect:
1. Continue button shakes (400ms)
2. Error toast appears: "Please fix validation errors"
3. Invalid field cards pulse red border (border-color: error-500, 300ms pulse × 2)
```

---

## 6. Field Types & Configuration

### 6.1 Text Field

**Type**: `TEXT`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)
- Min Length (number input, 1-500)
- Max Length (number input, 1-5000)

**Example**:

```json
{
  "fieldKey": "companyWebsite",
  "label": "Company Website",
  "fieldType": "TEXT",
  "placeholder": "https://example.com",
  "helpText": "Enter your company's website URL",
  "isRequired": false,
  "validationRules": {
    "pattern": "^https?://.*",
    "minLength": 10,
    "maxLength": 200
  }
}
```

**Variable Generated**: `{companyWebsite}`

---

### 6.2 Email Field

**Type**: `EMAIL`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)

**Built-in Validation**:

- Email format validation (automatic)
- Domain blacklist (optional, future)

**Example**:

```json
{
  "fieldKey": "workEmail",
  "label": "Work Email",
  "fieldType": "EMAIL",
  "placeholder": "you@company.com",
  "helpText": "We'll send project updates here",
  "isRequired": true,
  "validationRules": {
    "pattern": "^[^@]+@[^@]+\\.[^@]+$"
  }
}
```

**Variable Generated**: `{workEmail}`

---

### 6.3 Number Field

**Type**: `NUMBER`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)
- Min Value (number)
- Max Value (number)
- Step (decimal places)

**Example**:

```json
{
  "fieldKey": "teamSize",
  "label": "Team Size",
  "fieldType": "NUMBER",
  "placeholder": "e.g., 10",
  "helpText": "How many people are on your team?",
  "isRequired": false,
  "validationRules": {
    "min": 1,
    "max": 10000,
    "step": 1
  }
}
```

**Variable Generated**: `{teamSize}`

---

### 6.4 Dropdown Field

**Type**: `DROPDOWN`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)
- Options \* (array of strings, min 2, max 20)

**Options Editor UI**:

```
Options *
┌───────────────────────────────────────────┐
│  $500                              [×]    │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│  $2,000                            [×]    │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│  $5,000                            [×]    │
└───────────────────────────────────────────┘
┌───────────────────────────────────────────┐
│  + Add option                             │
└───────────────────────────────────────────┘
```

**Example**:

```json
{
  "fieldKey": "projectBudget",
  "label": "Project Budget",
  "fieldType": "DROPDOWN",
  "placeholder": "Select your budget range",
  "helpText": "This helps us match you with the right package",
  "isRequired": true,
  "options": ["$500", "$2,000", "$5,000", "$10,000+"],
  "validationRules": {
    "enum": ["$500", "$2,000", "$5,000", "$10,000+"]
  }
}
```

**Variable Generated**: `{projectBudget}`

---

### 6.5 Textarea Field

**Type**: `TEXTAREA`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)
- Min Length (number)
- Max Length (number)
- Rows (number, 3-10)

**Example**:

```json
{
  "fieldKey": "projectDescription",
  "label": "Project Description",
  "fieldType": "TEXTAREA",
  "placeholder": "Tell us about your project...",
  "helpText": "Please provide as much detail as possible",
  "isRequired": true,
  "validationRules": {
    "minLength": 50,
    "maxLength": 1000
  }
}
```

**Variable Generated**: `{projectDescription}`

---

### 6.6 Date Field

**Type**: `DATE`

**Configuration Options**:

- Label \*
- Placeholder
- Help Text
- Required (toggle)
- Min Date (date picker)
- Max Date (date picker)

**Example**:

```json
{
  "fieldKey": "preferredStartDate",
  "label": "Preferred Start Date",
  "fieldType": "DATE",
  "placeholder": "MM/DD/YYYY",
  "helpText": "When would you like to begin?",
  "isRequired": false,
  "validationRules": {
    "minDate": "today",
    "maxDate": "2025-12-31"
  }
}
```

**Variable Generated**: `{preferredStartDate}`

---

### 6.7 Checkbox Field

**Type**: `CHECKBOX`

**Configuration Options**:

- Label \* (becomes checkbox label)
- Help Text
- Required (toggle) - must be checked to submit

**Example**:

```json
{
  "fieldKey": "agreeToTerms",
  "label": "I agree to the terms and conditions",
  "fieldType": "CHECKBOX",
  "helpText": "You must agree to proceed",
  "isRequired": true
}
```

**Variable Generated**: `{agreeToTerms}` (value: "Yes" or "No")

---

## 7. Responsive Behavior

### Breakpoint Strategy

#### Desktop (≥1280px)

- **Split Panel**: 50/50 builder and preview
- **Field Cards**: Full width with all controls visible
- **Modal**: 560px width, centered
- **Preview**: Desktop size form (480px)

#### Laptop (1024px - 1279px)

- **Split Panel**: 45/55 builder and preview
- **Field Cards**: Slightly condensed padding
- **Modal**: 90% width, max 520px
- **Preview**: Scaled down desktop form

#### Tablet (768px - 1023px)

- **Stacked Layout**: Builder on top
- **Preview**: Accordion, collapsed by default
  - Header shows "Preview Form (3 custom fields)"
  - Expands to show full preview on click
- **Modal**: 95% width
- **Bottom Bar**: Full width, buttons stack on small tablets

#### Mobile (<768px)

- **Single Column**: Builder only, full viewport
- **Preview**: Modal sheet (slides up from bottom)
  - Accessible via floating "Preview" button (bottom-right)
  - Shows mobile-sized form (375px)
- **Field Cards**:
  - Drag handle smaller (12px)
  - Action buttons in overflow menu (···)
- **Add Field Modal**: Full screen overlay
- **Bottom Bar**: Sticky, buttons full width stacked

---

## 8. Accessibility Requirements

### Keyboard Navigation

**Tab Order**:

1. Back button
2. Each default field card (focusable but not editable)
3. Each custom field card
   - First tab: Drag handle (grabs focus for keyboard drag)
   - Second tab: Edit button
   - Third tab: Delete button
4. Add Field button
5. Continue button

**Keyboard Shortcuts**:

- `Tab` / `Shift+Tab`: Navigate between fields
- `Enter` / `Space`: Activate buttons
- `Escape`: Close modals
- `Ctrl/Cmd + K`: Focus "Add Field" button
- `Ctrl/Cmd + P`: Toggle preview panel

**Keyboard Drag & Drop**:

1. Focus drag handle with `Tab`
2. Press `Space` to enter drag mode
3. Use `↑` `↓` arrows to move field
4. Press `Space` to drop, `Escape` to cancel

### Screen Reader Support

**Semantic HTML**:

```html
<main aria-label="Form Builder">
  <section aria-label="Default Fields" role="region">
    <div role="article" aria-label="Name field - locked default field">...</div>
  </section>

  <section aria-label="Custom Fields" role="region">
    <div role="article" aria-label="Project Budget dropdown field">
      <button aria-label="Drag to reorder Project Budget field">⋮⋮</button>
      <button aria-label="Edit Project Budget field">Edit</button>
      <button aria-label="Delete Project Budget field">×</button>
    </div>
  </section>

  <button aria-label="Add new custom field">+ Add Custom Field</button>
</main>

<aside aria-label="Live Form Preview" role="complementary">...</aside>
```

**ARIA Live Regions**:

```html
<!-- Announce when fields are added/removed/reordered -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  Project Budget field added. 3 custom fields total.
</div>

<!-- Announce validation errors -->
<div aria-live="assertive" aria-atomic="true" class="sr-only">
  Error: Field label is required.
</div>
```

**Form Labels**:

- All inputs must have associated `<label>` elements
- Required fields announced: "Label, required"
- Help text linked with `aria-describedby`

### Color Contrast

**WCAG AA Compliance** (4.5:1 for normal text, 3:1 for large text):

| Element        | Foreground | Background | Ratio  | Pass   |
| -------------- | ---------- | ---------- | ------ | ------ |
| Body text      | #374151    | #FFFFFF    | 10.8:1 | ✅ AAA |
| Labels         | #4B5563    | #FFFFFF    | 8.9:1  | ✅ AAA |
| Placeholders   | #9CA3AF    | #F9FAFB    | 3.8:1  | ✅ AA  |
| Primary button | #FFFFFF    | #4F46E5    | 8.6:1  | ✅ AAA |
| Error text     | #EF4444    | #FFFFFF    | 4.8:1  | ✅ AA  |
| Variable pills | #4F46E5    | #FFFFFF    | 8.6:1  | ✅ AAA |

### Focus Management

**Focus Indicators**:

```css
/* All interactive elements */
*:focus-visible {
  outline: 3px solid var(--brand-primary-light);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

**Focus Trapping**:

- Modal open: Focus trapped within modal
- First input auto-focused after modal animation
- Tab cycles through: inputs → Cancel → Primary button → back to first input
- Modal close: Focus returns to element that triggered modal

**Focus Order**:

- Logical top-to-bottom, left-to-right
- Skip links for keyboard users: "Skip to preview"

---

## 9. Error States & Validation

### Validation Timing

**Real-time Validation** (as user types):

- Field label: Show error if empty
- Options (dropdown): Show error if < 2 options

**On-blur Validation** (when user leaves field):

- Min/max length
- Pattern matching (regex)
- Duplicate field keys

**On-submit Validation** (click "Add Field"):

- All required fields filled
- All validation rules passed
- Field key uniqueness

### Field-Level Errors

#### Error Display

```
┌─────────────────────────────────────────────────┐
│  Field Label *                                  │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │ ← Red border
│  └───────────────────────────────────────────┘ │
│  ⚠️ Label must be between 3-100 characters     │ ← Error message
└─────────────────────────────────────────────────┘
```

```css
/* Error Input */
border-color: var(--error-500)
background: rgba(239, 68, 68, 0.05)

/* Error Message */
display: flex
align-items: center
gap: var(--space-2)
margin-top: var(--space-2)
font-size: 13px
color: var(--error-500)
```

#### Common Validation Errors

| Field   | Error         | Message                                |
| ------- | ------------- | -------------------------------------- |
| Label   | Empty         | "Field label is required"              |
| Label   | Too short     | "Label must be at least 3 characters"  |
| Label   | Too long      | "Label cannot exceed 100 characters"   |
| Options | < 2           | "Dropdown requires at least 2 options" |
| Options | Duplicate     | "Duplicate option: '{value}'"          |
| Options | Empty option  | "Option cannot be empty"               |
| Min/Max | Invalid range | "Maximum must be greater than minimum" |

### Form-Level Errors

#### Duplicate Field Key

```
┌─────────────────────────────────────────────────┐
│  ⚠️  Field already exists                       │
│  A field with the key "projectBudget" already   │
│  exists. Please use a different label or edit   │
│  the existing field.                            │
│                                                 │
│  [View Existing Field]  [Use Different Label]  │
└─────────────────────────────────────────────────┘
```

#### Cannot Delete Last Custom Field (if business rule)

```
┌─────────────────────────────────────────────────┐
│  ⚠️  Cannot delete field                        │
│  Your form must have at least one custom field. │
│                                                 │
│  [OK]                                           │
└─────────────────────────────────────────────────┘
```

### Empty States

#### No Custom Fields Yet

```
┌─────────────────────────────────────────────────┐
│                    📝                           │
│                                                 │
│  No custom fields yet                           │
│  Add custom fields to capture specific data     │
│  from your leads.                               │
│                                                 │
│  [+ Add Your First Field]                       │
└─────────────────────────────────────────────────┘
```

```css
/* Container */
padding: var(--space-12) var(--space-8)
text-align: center
background: var(--neutral-50)
border: 2px dashed var(--neutral-300)
border-radius: var(--radius-lg)

/* Icon */
font-size: 48px
margin-bottom: var(--space-4)
opacity: 0.5

/* Title */
font-size: 18px
font-weight: 600
color: var(--neutral-700)
margin-bottom: var(--space-2)

/* Description */
font-size: 14px
color: var(--neutral-500)
max-width: 400px
margin: 0 auto var(--space-6)
```

---

## 10. Loading States

### Page Loading

```
Trigger: Initial page load
Display: Skeleton screens for field cards
```

```css
/* Skeleton Card */
width: 100%
height: 88px
background: linear-gradient(
  90deg,
  var(--neutral-100) 0%,
  var(--neutral-200) 50%,
  var(--neutral-100) 100%
)
background-size: 200% 100%
animation: shimmer 1.5s infinite
border-radius: var(--radius-md)
margin-bottom: var(--space-3)

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### Saving Field

```
Trigger: Click "Add Field" in modal
Duration: Until API response

Effect:
1. Primary button shows spinner
2. Button text changes to "Adding..."
3. All inputs disabled
4. Cancel button disabled
```

```css
/* Button Loading State */
background: var(--brand-primary)
cursor: wait
opacity: 0.8

/* Spinner */
width: 16px
height: 16px
border: 2px solid rgba(255, 255, 255, 0.3)
border-top-color: #FFFFFF
border-radius: 50%
animation: spin 600ms linear infinite

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### Deleting Field

```
Trigger: Confirm delete
Duration: Until API response

Effect:
1. Field card shows overlay with spinner
2. Card opacity reduces to 0.5
3. Delete and Edit buttons disabled
4. Drag handle disabled
```

---

## 11. Success States

### Field Added

```
Trigger: Successful field creation
Duration: 2 seconds

Toast Notification:
┌─────────────────────────────────────────────────┐
│  ✓  Field added successfully                    │
└─────────────────────────────────────────────────┘

Position: Top-right
Style: Green background, white text, slide-in animation
```

### Field Updated

```
Toast:
┌─────────────────────────────────────────────────┐
│  ✓  Field updated                               │
└─────────────────────────────────────────────────┘
```

### Field Deleted

```
Toast:
┌─────────────────────────────────────────────────┐
│  Field deleted                                  │
│  [Undo]                                         │
└─────────────────────────────────────────────────┘

Duration: 5 seconds (with undo option)
```

---

## 12. Advanced Features (Future Enhancements)

### 12.1 Field Templates

**Quick-add common fields**:

- "Budget" → Pre-configured dropdown ($500, $2K, $5K, $10K+)
- "Company Size" → Dropdown (1-10, 11-50, 51-200, 201+)
- "Timeline" → Dropdown (ASAP, 1-3 months, 3-6 months, 6+ months)
- "Phone Number" → Text with phone validation

### 12.2 Conditional Logic

**Show/hide fields based on other field values**:

```
If "Project Type" = "Enterprise"
  Then show "Number of Locations" field
```

### 12.3 Field Validation Builder

**Visual regex builder**:

- Email domain restrictions
- Phone number formats
- URL patterns
- Custom text patterns

### 12.4 Multi-column Layout

**Form layout options**:

- Single column (default)
- Two column
- Three column (desktop only)

---

## 13. Design Tokens Summary (Quick Reference)

```css
/* Colors */
--brand-primary:
  #4f46e5 --brand-primary-hover: #4338ca --brand-primary-light: #eef2ff
    --brand-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
    /* Spacing */ --space-2: 8px --space-3: 12px --space-4: 16px --space-6: 24px
    --space-8: 32px /* Typography */ --font-sans: 'Inter',
  -apple-system, BlinkMacSystemFont, 'Segoe UI',
  sans-serif --font-mono: 'JetBrains Mono', 'Fira Code',
  monospace /* Shadows */ --shadow-field: 0 1px 3px rgba(0, 0, 0, 0.08)
    --shadow-field-hover: 0 4px 12px rgba(0, 0, 0, 0.12) --shadow-modal: 0 20px
    25px rgba(0, 0, 0, 0.15) /* Transitions */ --transition-base: 150ms
    cubic-bezier(0.4, 0, 0.2, 1) --transition-bounce: 400ms
    cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Border Radius */ --radius-sm: 6px
    --radius-md: 8px --radius-lg: 12px;
```

---

## 14. Implementation Checklist for Developers

**Phase 1: Foundation**

- [ ] Set up two-panel layout with responsive breakpoints
- [ ] Implement design tokens as CSS variables
- [ ] Create reusable field card component
- [ ] Build default field cards (read-only display)

**Phase 2: Core Functionality**

- [ ] Implement "Add Field" modal with field type selector
- [ ] Build field editor form with type-specific options
- [ ] Create dropdown options editor with add/remove
- [ ] Implement required field toggle

**Phase 3: Drag & Drop**

- [ ] Integrate @dnd-kit/core for drag functionality
- [ ] Implement field reordering with visual feedback
- [ ] Add keyboard drag & drop support
- [ ] Test drag animations and drop zones

**Phase 4: Live Preview**

- [ ] Build live preview panel with desktop/mobile tabs
- [ ] Sync form preview with builder state in real-time
- [ ] Generate variable pills from field keys
- [ ] Implement preview scroll sync

**Phase 5: Validation & Errors**

- [ ] Add field-level validation (label, options, etc.)
- [ ] Implement form-level validation (duplicate keys)
- [ ] Create error states with ARIA announcements
- [ ] Build confirmation dialogs for destructive actions

**Phase 6: Animations & Polish**

- [ ] Implement all micro-interactions (drag, add, delete)
- [ ] Add page entry animations
- [ ] Create loading states for async operations
- [ ] Build success toast notifications

**Phase 7: Accessibility**

- [ ] Test keyboard navigation flow
- [ ] Verify screen reader announcements
- [ ] Check color contrast ratios
- [ ] Implement focus management
- [ ] Test with NVDA/JAWS/VoiceOver

**Phase 8: Testing**

- [ ] Unit tests for validation logic
- [ ] Integration tests for field CRUD operations
- [ ] E2E tests for full onboarding flow
- [ ] Visual regression tests for animations
- [ ] Accessibility audit (axe, WAVE)

---

## 15. User Journey Example

### Scenario: Agency Owner Adds Budget Field

**Step 1: Arrive at Form Builder**

- User clicks "Continue" from Strategy Selection
- Page loads with 3 default fields visible
- Live preview shows basic form on right

**Step 2: Click "Add Custom Field"**

- User clicks dashed button at bottom
- Modal opens with smooth animation
- First input (Field Type) auto-focused

**Step 3: Configure Dropdown Field**

- User selects "Dropdown" from type selector
- Options editor appears below
- User enters label: "Project Budget"
- User enters placeholder: "Select your budget range"

**Step 4: Add Options**

- User clicks "Add option" (default has 2 empty options)
- User enters: "$500", "$2,000", "$5,000", "$10,000+"
- Options show delete (×) buttons on each

**Step 5: Set as Required**

- User toggles "Required field" checkbox
- Help text: "Leads must fill this field to submit"

**Step 6: Add Field**

- User clicks "Add Field" button
- Modal closes with animation
- New card appears at bottom of list with bounce effect

**Step 7: Verify in Preview**

- Preview updates instantly
- Dropdown appears with all 4 options
- Variable pill `{projectBudget}` appears in "Available Variables"

**Step 8: Reorder Field**

- User drags field to position 1 (after Email)
- Other fields shift to make space
- Drops field, which settles with satisfying animation
- Preview updates to match new order

**Step 9: Continue**

- User clicks "Continue to Email Configuration →"
- Navigates to next step
- `{projectBudget}` variable available in email template editor

---

## 16. API Integration Specifications

### Endpoint: `PUT /api/workflow/{id}/form`

**Request Body**:

```json
{
  "formFields": [
    {
      "fieldKey": "name",
      "label": "Full Name",
      "fieldType": "TEXT",
      "isRequired": true,
      "displayOrder": 0,
      "isDefault": true
    },
    {
      "fieldKey": "email",
      "label": "Email Address",
      "fieldType": "EMAIL",
      "isRequired": true,
      "displayOrder": 1,
      "isDefault": true
    },
    {
      "fieldKey": "companyName",
      "label": "Company Name",
      "fieldType": "TEXT",
      "isRequired": true,
      "displayOrder": 2,
      "isDefault": true
    },
    {
      "fieldKey": "projectBudget",
      "label": "Project Budget",
      "fieldType": "DROPDOWN",
      "placeholder": "Select your budget range",
      "helpText": "This helps us match you with the right package",
      "isRequired": true,
      "options": ["$500", "$2,000", "$5,000", "$10,000+"],
      "displayOrder": 3,
      "isDefault": false
    }
  ]
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "workflow": {
    "id": "uuid",
    "formFields": [...],
    "updatedAt": "2025-01-22T10:30:00Z"
  }
}
```

**Error Response** (400 Bad Request):

```json
{
  "success": false,
  "error": "DUPLICATE_FIELD_KEY",
  "message": "Field with key 'projectBudget' already exists",
  "field": "projectBudget"
}
```

### Client-Side State Management

**Zustand Store** (`useOnboardingStore`):

```typescript
interface OnboardingStore {
  formFields: FormField[];
  setFormFields: (fields: FormField[]) => void;
  addFormField: (field: FormField) => void;
  updateFormField: (id: string, updates: Partial<FormField>) => void;
  deleteFormField: (id: string) => void;
  reorderFormField: (fromIndex: number, toIndex: number) => void;
}
```

**Optimistic Updates**:

- Add field: Update UI immediately, rollback on error
- Delete field: Show undo toast, send delete after 5s if not undone
- Reorder: Update immediately, sync on debounce (500ms)

---

## 17. Figma Handoff Notes

**Component Naming Convention**:

```
Form Builder/
├── Field Card/Default
├── Field Card/Custom
├── Field Card/Empty State
├── Modal/Add Field
├── Modal/Delete Confirmation
├── Preview Panel/Desktop
├── Preview Panel/Mobile
├── Variable Pill
├── Action Bar/Bottom
└── Dropdown/Options Editor
```

**Auto Layout Structure**:

- All cards use auto-layout for consistent spacing
- Preview panel uses scrollable frame
- Modal uses fixed positioning

**Variants**:

- Field Card: Default, Custom, Dragging, Error
- Button: Default, Hover, Active, Disabled, Loading
- Input: Default, Focus, Error, Disabled

**Export Settings**:

- Icons: SVG, 24×24px
- Cards: PNG @2x for visual reference
- Spacing: Document space-\* tokens

---

**End of Specification**

This document serves as the single source of truth for implementing the FlowTrack Form Builder experience. Any deviations should be documented and approved by the design and product teams.

**Last Updated**: 2025-01-22
**Version**: 1.0
**Author**: FlowTrack Design System Team
