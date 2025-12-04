# FlowTrack Lead Detail Page - UI/UX Design Specification

## 1. Visual Strategy & Design Philosophy

### Core Design Philosophy

The Lead Detail Page embodies **"Intelligence at a Glance"** — presenting comprehensive lead enrichment data in a scannable, visually hierarchical format that helps sales teams prepare for meetings in under 60 seconds.

The aesthetic should communicate:

- **Clarity**: Information density balanced with white space
- **Intelligence**: Data-rich without overwhelming
- **Confidence**: Comprehensive insights that empower decision-making
- **Speed**: Quick scanning with visual hierarchy and progressive disclosure

### Visual Tone

**Clean Dashboard Aesthetic with Smart Data Visualization**

- Primary aesthetic: Card-based layout with clear information hierarchy
- NOT cluttered CRM interfaces (avoid Salesforce-style density)
- NOT overly minimal (every data point has purpose)
- TARGET: Intelligence dashboard — think Superhuman, Linear Detail Views, or Clay CRM

---

## 2. Page Architecture & Layout

### Overall Structure

```
┌────────────────────────────────────────────────────────────────┐
│  HEADER BAR (Fixed)                                            │
│  ← Back to Leads    |    Lead Name    |    [Actions Menu]      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────┐  ┌────────────────────────────────┐ │
│  │                      │  │                                │ │
│  │   HERO SECTION       │  │   QUICK ACTIONS SIDEBAR        │ │
│  │   (Lead Summary)     │  │   - Edit Lead                  │ │
│  │                      │  │   - Send Email                 │ │
│  │   [Photo/Avatar]     │  │   - Book Meeting               │ │
│  │   Name + Title       │  │   - Mark as Won/Lost           │ │
│  │   Company            │  │                                │ │
│  │   Status Badge       │  │   ENRICHMENT STATUS            │ │
│  │   Contact Info       │  │   ✓ Enriched 2 hours ago       │ │
│  │                      │  │                                │ │
│  └──────────────────────┘  └────────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  TABS: Overview | Activity | Emails | Notes              │ │
│  ├──────────────────────────────────────────────────────────┤ │
│  │                                                          │ │
│  │  [TAB CONTENT - Scrollable]                              │ │
│  │                                                          │ │
│  │  OVERVIEW TAB:                                           │ │
│  │  ┌─────────────────┐  ┌─────────────────┐               │ │
│  │  │ Company Intel   │  │ Person Intel    │               │ │
│  │  └─────────────────┘  └─────────────────┘               │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │ Tech Stack Detected (12)             │               │ │
│  │  └──────────────────────────────────────┘               │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │ Email Intelligence                   │               │ │
│  │  └──────────────────────────────────────┘               │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │ DNS & Infrastructure                 │               │ │
│  │  └──────────────────────────────────────┘               │ │
│  │  ┌──────────────────────────────────────┐               │ │
│  │  │ Website Metadata                     │               │ │
│  │  └──────────────────────────────────────┘               │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Layout Grid System

#### Desktop (≥1280px)

```
┌─────────────────────────────────────────────────┐
│  60%                          │  40%            │
│  Main Content Area            │  Sidebar        │
│  (Hero + Tabs)                │  (Actions)      │
└─────────────────────────────────────────────────┘

Container: max-width 1400px
Padding: 32px horizontal
Gap: 24px between columns
```

#### Tablet (768px - 1279px)

```
┌─────────────────────────────────────────────────┐
│  100%                                           │
│  Hero Section                                   │
├─────────────────────────────────────────────────┤
│  100%                                           │
│  Quick Actions (Horizontal Cards)               │
├─────────────────────────────────────────────────┤
│  100%                                           │
│  Tabs & Content                                 │
└─────────────────────────────────────────────────┘

Padding: 24px horizontal
```

#### Mobile (<768px)

```
Full-width stacked layout
Padding: 16px horizontal
Tabs become full-width scrollable
```

---

## 3. Design System & Visual Tokens

### Color Palette

#### Primary Brand Colors

```css
--brand-primary: #4f46e5 /* Indigo 600 - Primary actions */
  --brand-primary-hover: #4338ca /* Indigo 700 - Hover states */
  --brand-primary-light: #eef2ff /* Indigo 50 - Backgrounds */
  --brand-primary-subtle: #e0e7ff /* Indigo 100 - Subtle highlights */;
```

#### Semantic Status Colors

```css
/* Lead Status Colors */
--status-new: #3b82f6 /* Blue 500 */ --status-engaged: #8b5cf6 /* Purple 500 */
  --status-qualified: #10b981 /* Green 500 */ --status-won: #059669
  /* Green 600 */ --status-lost: #ef4444 /* Red 500 */ /* Enrichment Status */
  --enriched-success: #10b981 /* Green - Successfully enriched */
  --enriched-partial: #f59e0b /* Amber - Partial data */
  --enriched-failed: #ef4444 /* Red - Enrichment failed */;
```

#### Data Category Colors (Tech Stack)

```css
--tech-crm: #9333ea /* Purple 600 */ --tech-analytics: #3b82f6 /* Blue 500 */
  --tech-marketing: #ec4899 /* Pink 500 */ --tech-chat: #10b981 /* Green 500 */
  --tech-platform: #f59e0b /* Amber 500 */ --tech-infrastructure: #6b7280
  /* Gray 500 */ --tech-payment: #059669 /* Emerald 600 */
  --tech-development: #f97316 /* Orange 500 */;
```

#### Neutral Scale

```css
--neutral-50: #f9fafb /* Page background */ --neutral-100: #f3f4f6
  /* Card backgrounds */ --neutral-200: #e5e7eb /* Borders */
  --neutral-300: #d1d5db /* Disabled states */ --neutral-400: #9ca3af
  /* Muted text */ --neutral-500: #6b7280 /* Secondary text */
  --neutral-600: #4b5563 /* Body text */ --neutral-700: #374151
  /* Emphasized text */ --neutral-800: #1f2937 /* Dark text */
  --neutral-900: #111827 /* Headings */;
```

### Typography Scale

#### Font Family

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

#### Hierarchy

**Page Title (Lead Name)**

```css
font-size: 32px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
```

**Section Headings (Card Titles)**

```css
font-size: 18px
font-weight: 600
line-height: 1.3
color: var(--neutral-900)
letter-spacing: -0.01em
```

**Subsection Headings**

```css
font-size: 14px
font-weight: 600
line-height: 1.4
color: var(--neutral-700)
text-transform: uppercase
letter-spacing: 0.05em
```

**Body Text**

```css
font-size: 15px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)
```

**Label Text**

```css
font-size: 13px
font-weight: 500
line-height: 1.4
color: var(--neutral-600)
```

**Small Text (Metadata)**

```css
font-size: 12px
font-weight: 400
line-height: 1.4
color: var(--neutral-500)
```

### Spacing System

```css
--space-1: 4px --space-2: 8px --space-3: 12px --space-4: 16px --space-5: 20px
  --space-6: 24px --space-8: 32px --space-10: 40px --space-12: 48px
  --space-16: 64px;
```

### Border Radius

```css
--radius-sm: 6px /* Small elements, badges */ --radius-md: 8px
  /* Inputs, buttons */ --radius-lg: 12px /* Cards */ --radius-xl: 16px
  /* Hero cards, featured sections */ --radius-full: 9999px /* Pills, avatars */;
```

### Shadows

```css
--shadow-xs:
  0 1px 2px rgba(0, 0, 0, 0.05) --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1),
  0 1px 2px rgba(0, 0, 0, 0.06) --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07),
  0 2px 4px rgba(0, 0, 0, 0.06) --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1),
  0 4px 6px rgba(0, 0, 0, 0.05) --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1),
  0 10px 10px rgba(0, 0, 0, 0.04);
```

---

## 4. Component Specifications

### 4.1 Header Bar (Fixed Navigation)

#### Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Leads          Lead Detail          [⋮] Actions     │
└────────────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
position: sticky
top: 0
z-index: 50
height: 64px
background: rgba(255, 255, 255, 0.95)
backdrop-filter: blur(8px)
border-bottom: 1px solid var(--neutral-200)
padding: 0 32px
display: flex
align-items: center
justify-content: space-between

/* Back Button */
display: flex
align-items: center
gap: 8px
font-size: 14px
font-weight: 500
color: var(--neutral-600)
cursor: pointer
transition: color 150ms ease

hover: color: var(--brand-primary)

/* Page Title */
font-size: 16px
font-weight: 600
color: var(--neutral-900)

/* Actions Dropdown */
button:
  width: 32px
  height: 32px
  border-radius: var(--radius-md)
  background: transparent
  border: 1px solid var(--neutral-200)

  hover:
    background: var(--neutral-50)
    border-color: var(--neutral-300)
```

### 4.2 Hero Section (Lead Summary Card)

#### Visual Structure

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ┌────┐                                         │
│   │ RT │  R Tushar                               │
│   └────┘  Senior Product Manager                 │
│           Zethic Technologies                    │
│           ○ EMAIL_SENT                           │
│                                                  │
│   📧 tushar@zethic.com                           │
│   🌐 zethic.com                                  │
│   📍 San Francisco, CA                           │
│   🏢 SaaS • 50-200 employees                     │
│                                                  │
│   ─────────────────────────────────────────      │
│   Source: Form  |  Score: 85  |  Created: 3d ago │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Card Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-xl)
padding: 32px
box-shadow: var(--shadow-sm)

/* Avatar/Photo */
width: 80px
height: 80px
border-radius: var(--radius-lg)
background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)
display: flex
align-items: center
justify-content: center
font-size: 28px
font-weight: 600
color: #FFFFFF
margin-bottom: 16px

/* Name */
font-size: 24px
font-weight: 700
color: var(--neutral-900)
line-height: 1.2
margin-bottom: 4px

/* Job Title */
font-size: 15px
font-weight: 500
color: var(--neutral-600)
margin-bottom: 2px

/* Company Name */
font-size: 15px
font-weight: 500
color: var(--neutral-700)
margin-bottom: 12px

/* Status Badge */
display: inline-flex
align-items: center
gap: 6px
padding: 6px 12px
border-radius: var(--radius-full)
font-size: 13px
font-weight: 500
background: var(--neutral-100)
color: var(--neutral-700)

/* Contact Info Icons */
display: flex
flex-direction: column
gap: 8px
margin-top: 20px
padding-top: 20px
border-top: 1px solid var(--neutral-200)

each item:
  display: flex
  align-items: center
  gap: 8px
  font-size: 14px
  color: var(--neutral-700)

  icon:
    font-size: 16px
    color: var(--neutral-400)

/* Metadata Footer */
margin-top: 20px
padding-top: 16px
border-top: 1px solid var(--neutral-200)
display: flex
gap: 16px
font-size: 13px
color: var(--neutral-500)

each item:
  display: flex
  align-items: center
  gap: 4px
```

### 4.3 Quick Actions Sidebar

#### Visual Structure

```
┌────────────────────────────────────┐
│  Quick Actions                     │
│                                    │
│  ┌────────────────────────────┐   │
│  │  ✏️  Edit Lead Details      │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  📧  Send Email             │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  📅  Book Meeting           │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  ✓  Mark as Won             │   │
│  └────────────────────────────┘   │
│  ┌────────────────────────────┐   │
│  │  ✕  Mark as Lost            │   │
│  └────────────────────────────┘   │
│                                    │
│  ───────────────────────────────  │
│                                    │
│  Enrichment Status                 │
│  ┌────────────────────────────┐   │
│  │  ✓ Enriched Successfully    │   │
│  │  2 hours ago                │   │
│  │  ──────────────             │   │
│  │  Company: ✓                 │   │
│  │  Person: ✓                  │   │
│  │  Email: ✓                   │   │
│  │  Tech Stack: ✓ 12 found     │   │
│  └────────────────────────────┘   │
└────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-xl)
padding: 24px
box-shadow: var(--shadow-sm)

/* Section Title */
font-size: 16px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 16px

/* Action Button */
width: 100%
padding: 12px 16px
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-md)
display: flex
align-items: center
gap: 12px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
cursor: pointer
transition: all 150ms ease
margin-bottom: 8px

hover:
  background: var(--neutral-50)
  border-color: var(--brand-primary)
  color: var(--brand-primary)
  transform: translateX(2px)

/* Icon */
font-size: 18px
color: var(--neutral-400)

hover (icon):
  color: var(--brand-primary)

/* Enrichment Status Card */
margin-top: 20px
padding: 16px
background: var(--neutral-50)
border: 1px solid var(--neutral-200)
border-radius: var(--radius-lg)

/* Status Header */
display: flex
align-items: center
gap: 8px
font-size: 14px
font-weight: 600
color: var(--enriched-success)
margin-bottom: 4px

/* Timestamp */
font-size: 12px
color: var(--neutral-500)
margin-bottom: 12px

/* Progress Items */
display: flex
flex-direction: column
gap: 6px
padding-top: 12px
border-top: 1px solid var(--neutral-200)

each item:
  display: flex
  align-items: center
  justify-content: space-between
  font-size: 13px

  label: color: var(--neutral-600)
  value: color: var(--enriched-success), font-weight: 500
```

### 4.4 Tab Navigation

#### Visual Structure

```
┌────────────────────────────────────────────────────────┐
│  Overview    Activity    Emails    Notes               │
│  ────────                                              │
└────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
border-bottom: 2px solid var(--neutral-200)
display: flex
gap: 8px
margin-bottom: 24px

/* Tab Button */
padding: 12px 20px
font-size: 15px
font-weight: 500
color: var(--neutral-600)
background: transparent
border: none
border-bottom: 2px solid transparent
margin-bottom: -2px
cursor: pointer
transition: all 150ms ease

hover:
  color: var(--neutral-900)
  background: var(--neutral-50)

active/selected:
  color: var(--brand-primary)
  border-bottom-color: var(--brand-primary)
  font-weight: 600
```

### 4.5 Company Intelligence Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  🏢 Company Intelligence                    ✓ Enriched   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────┐                                                  │
│  │LOGO│  Zethic Technologies                             │
│  └────┘  Online payment processing and automation        │
│          solutions for modern businesses                 │
│                                                          │
│  🌐 Domain: zethic.com                                   │
│  🏭 Industry: SaaS / B2B Software                        │
│  👥 Company Size: 50-200 employees                       │
│  📍 Location: San Francisco, California                  │
│  📅 Founded: 2018                                        │
│                                                          │
│  Social Presence:                                        │
│  [LinkedIn] [Twitter] [Facebook]                         │
│                                                          │
│  ─────────────────────────────────────────────           │
│  📧 Email Provider: Google Workspace                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Card Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-xl)
padding: 24px
box-shadow: var(--shadow-sm)
margin-bottom: 20px

/* Card Header */
display: flex
align-items: center
justify-content: space-between
margin-bottom: 20px
padding-bottom: 16px
border-bottom: 1px solid var(--neutral-200)

/* Title with Icon */
display: flex
align-items: center
gap: 10px
font-size: 18px
font-weight: 600
color: var(--neutral-900)

icon:
  font-size: 24px
  color: var(--brand-primary)

/* Enrichment Badge */
display: flex
align-items: center
gap: 6px
padding: 4px 10px
background: rgba(16, 185, 129, 0.1)
border-radius: var(--radius-full)
font-size: 12px
font-weight: 500
color: var(--enriched-success)

/* Company Logo */
width: 64px
height: 64px
border-radius: var(--radius-md)
border: 1px solid var(--neutral-200)
object-fit: contain
padding: 8px
margin-bottom: 12px

/* Company Name */
font-size: 20px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 8px

/* Description */
font-size: 14px
line-height: 1.6
color: var(--neutral-600)
margin-bottom: 20px

/* Info Grid */
display: grid
grid-template-columns: repeat(2, 1fr)
gap: 12px
margin-bottom: 20px

each item:
  display: flex
  align-items: center
  gap: 8px
  font-size: 14px

  icon:
    font-size: 16px
    color: var(--neutral-400)

  text:
    color: var(--neutral-700)

/* Social Links */
display: flex
gap: 8px
margin-top: 16px

each link:
  padding: 8px 16px
  background: var(--neutral-50)
  border: 1px solid var(--neutral-200)
  border-radius: var(--radius-md)
  font-size: 13px
  font-weight: 500
  color: var(--neutral-700)
  text-decoration: none
  transition: all 150ms ease

  hover:
    background: var(--brand-primary-light)
    border-color: var(--brand-primary)
    color: var(--brand-primary)
```

### 4.6 Tech Stack Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  🔧 Tech Stack Detected (12)                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  CRM                                                     │
│  [HubSpot] [Salesforce]                                  │
│                                                          │
│  ANALYTICS                                               │
│  [Google Analytics 4] [Segment] [Mixpanel]               │
│                                                          │
│  MARKETING                                               │
│  [Mailchimp] [SendGrid]                                  │
│                                                          │
│  CHAT/SUPPORT                                            │
│  [Intercom] [Zendesk]                                    │
│                                                          │
│  INFRASTRUCTURE                                          │
│  [Cloudflare] [AWS] [Vercel]                             │
│                                                          │
│  💡 Key Insight: Uses HubSpot + Salesforce suggests      │
│     enterprise-level sales operation with $50k+/year     │
│     investment in CRM infrastructure                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Card Container */
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: var(--radius-xl)
padding: 24px
box-shadow: var(--shadow-sm)
margin-bottom: 20px

/* Card Header */
display: flex
align-items: center
gap: 10px
font-size: 18px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 20px
padding-bottom: 16px
border-bottom: 1px solid var(--neutral-200)

/* Category Section */
margin-bottom: 16px

/* Category Label */
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
color: var(--neutral-500)
margin-bottom: 8px

/* Tech Badge */
display: inline-flex
align-items: center
padding: 6px 12px
border-radius: var(--radius-md)
font-size: 13px
font-weight: 500
margin-right: 6px
margin-bottom: 6px
transition: all 150ms ease

/* Category-Specific Colors */
.crm:
  background: rgba(147, 51, 234, 0.1)
  color: var(--tech-crm)
  border: 1px solid rgba(147, 51, 234, 0.2)

.analytics:
  background: rgba(59, 130, 246, 0.1)
  color: var(--tech-analytics)
  border: 1px solid rgba(59, 130, 246, 0.2)

.marketing:
  background: rgba(236, 72, 153, 0.1)
  color: var(--tech-marketing)
  border: 1px solid rgba(236, 72, 153, 0.2)

.chat:
  background: rgba(16, 185, 129, 0.1)
  color: var(--tech-chat)
  border: 1px solid rgba(16, 185, 129, 0.2)

.infrastructure:
  background: rgba(107, 114, 128, 0.1)
  color: var(--tech-infrastructure)
  border: 1px solid rgba(107, 114, 128, 0.2)

/* Hover State */
hover:
  transform: translateY(-1px)
  box-shadow: var(--shadow-sm)

/* AI Insight Section */
margin-top: 20px
padding: 16px
background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)
border-left: 3px solid var(--brand-primary)
border-radius: var(--radius-md)

icon:
  font-size: 16px
  color: var(--brand-primary)

text:
  font-size: 13px
  line-height: 1.6
  color: var(--neutral-700)
  font-style: italic
```

### 4.7 Person Intelligence Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  👤 Person Intelligence                     ✓ Enriched   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────┐                                                  │
│  │ RT │  R Tushar                                        │
│  └────┘  Senior Product Manager                          │
│                                                          │
│  💼 Seniority: Senior Level                              │
│  🏢 Department: Product & Engineering                    │
│                                                          │
│  Professional Presence:                                  │
│  [LinkedIn] [Twitter] [GitHub]                           │
│                                                          │
│  💡 Key Insight: Senior-level decision maker in product  │
│     suggests influence over tool purchasing decisions    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.8 Email Intelligence Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  📧 Email Intelligence                      ✓ Verified   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  tushar@zethic.com                                       │
│                                                          │
│  ✓ Valid Format                                          │
│  ✓ Deliverable                                           │
│  ✓ SMTP Verified                                         │
│  ✗ Not Disposable                                        │
│  ✗ Not Catch-All                                         │
│  ⚠️ Role Account (might not be personal)                 │
│                                                          │
│  Provider: Google Workspace                              │
│                                                          │
│  MX Records (3):                                         │
│  • aspmx.l.google.com (Priority: 1)                      │
│  • alt1.aspmx.l.google.com (Priority: 5)                 │
│  • alt2.aspmx.l.google.com (Priority: 5)                 │
│                                                          │
│  Deliverability Score: 95/100 🟢                         │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Validation Item */
display: flex
align-items: center
gap: 10px
padding: 8px 0
font-size: 14px

icon (checkmark/x):
  font-size: 18px

  success: color: var(--enriched-success)
  error: color: var(--enriched-failed)
  warning: color: var(--enriched-partial)

/* Deliverability Score */
display: flex
align-items: center
gap: 8px
margin-top: 16px
padding: 12px 16px
background: var(--neutral-50)
border-radius: var(--radius-md)

score:
  font-size: 24px
  font-weight: 700
  color: var(--enriched-success)

indicator:
  font-size: 20px
```

### 4.9 DNS & Infrastructure Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  🌐 DNS & Infrastructure                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  SPF Record: ✓ Configured                                │
│  v=spf1 include:_spf.google.com ~all                     │
│                                                          │
│  DMARC Record: ✓ Configured                              │
│  v=DMARC1; p=quarantine; rua=mailto:dmarc@zethic.com     │
│                                                          │
│  DKIM: ✓ Configured                                      │
│                                                          │
│  ─────────────────────────────────────────────           │
│                                                          │
│  Security Score: 9/10 🟢                                 │
│  Email authentication properly configured                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### 4.10 Website Metadata Card

#### Visual Structure

```
┌──────────────────────────────────────────────────────────┐
│  📄 Website Metadata                                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  [Preview Image]                                   │ │
│  │  https://zethic.com/og-image.jpg                   │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Page Title:                                             │
│  Zethic Technologies - Modern Payment Solutions          │
│                                                          │
│  Meta Description:                                       │
│  Online payment processing and automation solutions      │
│  for modern businesses. Accept payments, automate        │
│  workflows, and grow your business.                      │
│                                                          │
│  Keywords:                                               │
│  [payments] [automation] [SaaS] [B2B] [fintech]          │
│                                                          │
│  Open Graph Title:                                       │
│  Transform Your Payment Processing                       │
│                                                          │
│  Open Graph Description:                                 │
│  Join 10,000+ businesses using Zethic for payment        │
│  automation and workflow management                      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Micro-Interactions & Animations

### 5.1 Page Entry Animation

```
Trigger: Page load
Target: All cards
Stagger: 50ms between each card

Sequence:
1. Fade in from opacity 0 to 1 (300ms)
2. Slide up from translateY(20px) to 0 (300ms)
3. Easing: ease-out

Order:
- Hero section (0ms delay)
- Sidebar (50ms delay)
- Tab navigation (100ms delay)
- First card (150ms delay)
- Subsequent cards (50ms stagger each)
```

### 5.2 Card Hover Animation

```
Trigger: Mouse hover on interactive cards
Duration: 200ms
Easing: ease-out

Transform:
- translateY(-2px)
- box-shadow: var(--shadow-md)
```

### 5.3 Badge Hover Animation

```
Trigger: Mouse hover on tech stack badges
Duration: 150ms

Transform:
- translateY(-1px)
- scale(1.02)
- box-shadow: var(--shadow-sm)
```

### 5.4 Tab Switch Animation

```
Trigger: Tab click
Duration: 300ms
Easing: ease-in-out

Sequence:
1. Current content fades out (150ms)
2. Indicator slides to new position (200ms)
3. New content fades in (150ms, 100ms delay)
```

### 5.5 Enrichment Status Pulse

```
Trigger: Auto-play on page load (if recently enriched)
Duration: 2000ms
Iterations: 3

Animation:
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
```

### 5.6 Action Button Hover

```
Trigger: Mouse hover on quick action buttons
Duration: 150ms

Transform:
- translateX(4px)
- border-color: var(--brand-primary)
- Icon color transitions to brand-primary
```

---

## 6. Responsive Behavior

### Desktop (≥1280px)

```
Layout: 60/40 split (Main Content / Sidebar)
Container: max-width 1400px, centered
Padding: 32px horizontal
Cards: 2-column grid for info sections
```

### Laptop (1024px - 1279px)

```
Layout: 65/35 split
Container: max-width 1200px
Padding: 24px horizontal
Cards: 2-column grid maintained
```

### Tablet (768px - 1023px)

```
Layout: Stacked (100% width)
- Hero: Full width
- Sidebar: Converts to horizontal action bar below hero
- Tabs: Full width
- Cards: Single column

Padding: 24px horizontal
```

### Mobile (<768px)

```
Layout: Full-width stacked
Padding: 16px horizontal

Changes:
- Hero: Simplified (smaller avatar, condensed info)
- Actions: Become horizontal scrollable row
- Tabs: Scrollable horizontal
- Cards: Full width, reduced padding
- Tech badges: Smaller font, tighter spacing
- Info grids: Single column
```

---

## 7. Accessibility Requirements

### Keyboard Navigation

- Tab order: Header back button → Actions menu → Quick actions → Tabs → Card content
- Arrow keys: Navigate between tabs
- Enter/Space: Activate buttons and links
- Escape: Close dropdown menus

### Screen Reader Support

- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`
- ARIA labels for all icon-only buttons
- Card headers use proper heading hierarchy (h1 → h2 → h3)
- Status badges have `aria-label` describing full status
- Enrichment badges announce completion status

### Focus Indicators

```css
/* Focus Ring */
outline: 2px solid var(--brand-primary)
outline-offset: 2px
border-radius: inherit

/* Alternative for buttons */
box-shadow: 0 0 0 3px var(--brand-primary-light)
```

### Color Contrast

All text meets WCAG AA standards:

- Body text (--neutral-700): 7.2:1 on white
- Secondary text (--neutral-600): 5.8:1 on white
- Muted text (--neutral-500): 4.7:1 on white
- Badge colors: Minimum 4.5:1 on backgrounds

---

## 8. Loading States

### Initial Page Load

```
Skeleton Screen Layout:

┌────────────────────────────────────────────────┐
│  ← Back    [████████]              [▫▫▫]      │
├────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │                  │  │  ▂▂▂▂▂▂▂▂▂▂▂▂▂   │   │
│  │  ╔══════╗        │  │  ▂▂▂▂▂▂▂▂        │   │
│  │  ║      ║        │  │  ▂▂▂▂▂▂▂▂        │   │
│  │  ╚══════╝        │  │  ▂▂▂▂▂▂▂▂        │   │
│  │  ████████        │  │                  │   │
│  │  ██████          │  │  ▂▂▂▂▂▂▂▂▂▂▂▂▂   │   │
│  │  ████████        │  │  ▂▂▂▂▂▂▂▂        │   │
│  │                  │  │  ▂▂▂▂▂▂▂▂        │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  ▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂  │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘

Animation: Shimmer effect
Duration: 1.5s infinite
Gradient: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)
```

### Enrichment In Progress

```
Show in enrichment status card:

┌────────────────────────────────┐
│  ⟳ Enriching Lead Data...      │
│                                │
│  ▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░ 55%      │
│                                │
│  Company Data: ✓               │
│  Tech Stack: ⟳ Processing...   │
│  Email Verification: Pending   │
└────────────────────────────────┘

Progress bar animated fill
Spinner icon rotating
Status updates in real-time
```

---

## 9. Empty States

### No Enrichment Data Available

```
┌──────────────────────────────────────────────────┐
│  🏢 Company Intelligence                         │
├──────────────────────────────────────────────────┤
│                                                  │
│         ┌─────────────────────┐                  │
│         │         🔍          │                  │
│         │                     │                  │
│         │  No Data Available  │                  │
│         │                     │                  │
│         │  We couldn't find   │                  │
│         │  company information│                  │
│         │  for this lead.     │                  │
│         │                     │                  │
│         │  [Re-enrich Lead]   │                  │
│         │                     │                  │
│         └─────────────────────┘                  │
│                                                  │
└──────────────────────────────────────────────────┘
```

### No Tech Stack Detected

```
┌──────────────────────────────────────────────────┐
│  🔧 Tech Stack                                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  No technologies detected for this domain.       │
│                                                  │
│  This could mean:                                │
│  • The website blocks scraping                   │
│  • No public website exists                      │
│  • Custom/proprietary tech stack                 │
│                                                  │
│  [Retry Detection]  [Add Manually]               │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 10. AI-Generated Insights Section

### Sales Intelligence Card

```
┌──────────────────────────────────────────────────────────┐
│  ✨ AI Sales Insights                                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Talking Points:                                         │
│  • Company uses HubSpot + Salesforce → likely has        │
│    complex sales processes and high ACV deals            │
│  • Google Workspace indicates preference for Google      │
│    ecosystem (Calendar, Meet integration important)      │
│  • Intercom presence suggests strong focus on customer   │
│    success and support                                   │
│                                                          │
│  Budget Signals: 🟢 High                                 │
│  Estimated annual spend on detected tools: $75k-$120k    │
│                                                          │
│  Best Approach:                                          │
│  Focus on integration capabilities with existing stack,  │
│  particularly HubSpot and Google Workspace sync.         │
│  Emphasize time-saving automation features.              │
│                                                          │
│  Recommended Meeting Topics:                             │
│  1. Current workflow pain points with HubSpot            │
│  2. Lead routing automation needs                        │
│  3. Integration requirements                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 11. Data Display Hierarchy

### Information Priority Levels

**Level 1 - Critical (Always Visible)**

- Lead name, title, company
- Contact information (email, phone)
- Lead status and score
- Enrichment status

**Level 2 - Important (Visible on Overview)**

- Company intelligence
- Tech stack
- Email verification
- Person details

**Level 3 - Supporting (Tabs/Expandable)**

- Activity timeline
- Email threads
- Notes
- DNS records
- Website metadata

**Level 4 - Technical (Collapsed by Default)**

- Raw JSON data
- Complete DNS records
- Full tech detection logs

---

## 12. Design Tokens Quick Reference

```css
/* Card Styling */
--card-bg: #ffffff --card-border: 1px solid var(--neutral-200)
  --card-radius: var(--radius-xl) --card-padding: 24px
  --card-shadow: var(--shadow-sm) --card-hover-shadow: var(--shadow-md)
  /* Section Spacing */ --section-gap: 20px --card-internal-gap: 16px
  --item-gap: 12px /* Badge Styling */ --badge-padding: 6px 12px
  --badge-radius: var(--radius-md) --badge-font-size: 13px
  --badge-font-weight: 500 /* Transitions */ --transition-fast: 150ms ease
  --transition-normal: 200ms ease --transition-slow: 300ms ease-out;
```

---

## 13. Implementation Priority Phases

### Phase 1: MVP (Week 1)

- [ ] Page layout with hero section
- [ ] Quick actions sidebar
- [ ] Tab navigation
- [ ] Company intelligence card
- [ ] Tech stack card (basic)
- [ ] Email intelligence card
- [ ] Responsive layout (desktop + mobile)

### Phase 2: Enhanced Data (Week 2)

- [ ] Person intelligence card
- [ ] DNS & infrastructure card
- [ ] Website metadata card
- [ ] Activity timeline tab
- [ ] Empty states
- [ ] Loading skeletons
- [ ] Error handling

### Phase 3: Polish (Week 3)

- [ ] Animations and micro-interactions
- [ ] AI-generated insights
- [ ] Keyboard navigation
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Analytics tracking

### Phase 4: Advanced Features (Week 4+)

- [ ] Inline editing
- [ ] Quick actions integration
- [ ] Email thread view
- [ ] Notes and comments
- [ ] Export functionality
- [ ] Share lead profile

---

## 14. Design Rationale

### Why Dedicated Page Over Modal?

1. **Information Density**: Enrichment data is too rich for modal constraints
2. **Deep Work Context**: Sales prep requires focus without UI interruptions
3. **Shareable URLs**: Each lead gets a permanent, bookmarkable URL
4. **Browser History**: Users can use back/forward navigation naturally
5. **Side-by-Side Workflows**: Can open lead in new tab while viewing list
6. **Better Performance**: Lazy-load heavy data cards only when needed

### Why Card-Based Layout?

1. **Scannable**: Users can quickly identify relevant sections
2. **Modular**: Easy to add/remove data sections based on availability
3. **Progressive Disclosure**: Expand cards to show more detail
4. **Visual Hierarchy**: Clear separation between data categories
5. **Responsive-Friendly**: Cards stack naturally on mobile

### Why Tech Stack Gets Prominence?

1. **Unique Value Prop**: Zero-cost competitive intelligence
2. **Actionable Insights**: Directly informs sales approach
3. **Conversation Starter**: Natural talking points for meetings
4. **Differentiator**: Most CRMs don't offer this for free

### Why AI Insights Section?

1. **Context Translation**: Raw data → actionable advice
2. **Time Savings**: No manual research needed
3. **Skill Leveling**: Junior reps get senior-level insights
4. **Confidence Building**: Clear guidance reduces uncertainty

---

## Appendix A: Mobile-Specific Optimizations

### Touch Targets

```css
/* Minimum touch target: 44×44px */
.action-button {
  min-height: 44px;
  padding: 12px 16px;
}

.tab-button {
  min-height: 44px;
  padding: 12px 20px;
}
```

### Horizontal Scrolling

```css
/* For tech badges on mobile */
.tech-stack-container {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x proximity;

  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Bottom Sheet for Actions

```
On mobile, quick actions become a bottom sheet:

┌────────────────────────────────┐
│  [Drag Handle]                 │
│                                │
│  Quick Actions                 │
│                                │
│  [Edit Lead]                   │
│  [Send Email]                  │
│  [Book Meeting]                │
│  [Mark as Won]                 │
│  [Mark as Lost]                │
│                                │
└────────────────────────────────┘

Triggered by floating action button:
position: fixed
bottom: 24px
right: 24px
```

---

## Appendix B: Future Enhancement Ideas

### V2 Features

1. **Chrome Extension**: Quick-view lead intel from LinkedIn
2. **Meeting Prep Checklist**: Auto-generated pre-call preparation
3. **Competitive Analysis**: Compare tech stacks with similar companies
4. **Change Tracking**: Alert when company changes tech (churn signal)
5. **Export Options**: PDF/PowerPoint lead profile generator
6. **Collaboration**: @mention team members in notes
7. **Timeline View**: Visual journey from lead → customer
8. **Smart Segments**: "Companies like this" recommendations

### V3 Features

1. **Predictive Scoring**: ML-powered win probability
2. **Sentiment Analysis**: Email thread sentiment tracking
3. **Integration Health**: Monitor their tech stack for issues
4. **Intent Signals**: Job postings, funding, news mentions
5. **Relationship Map**: Org chart with contact connections
6. **Voice Memo**: Record thoughts after meetings
7. **Calendar Integration**: Meeting notes auto-populated

---

**End of Specification**

This document serves as the comprehensive design blueprint for the FlowTrack Lead Detail Page. Implementation should follow the phased approach outlined in Section 13, with Phase 1 establishing the core experience before adding enhanced features.
