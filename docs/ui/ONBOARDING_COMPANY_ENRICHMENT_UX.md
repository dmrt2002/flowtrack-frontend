# FlowTrack Onboarding - Company Enrichment Step - UI/UX Design Specification

## 1. Feature Overview

### Purpose

The Company Enrichment step analyzes the user's business website to automatically extract business intelligence, providing a personalized onboarding experience. This step sits between Form Builder and Integrations in the onboarding flow.

### Core Experience Goals

- **Delight through Intelligence**: "Wow, it knows what my business does!"
- **Conversational AI Aesthetic**: ChatGPT-style typing animation for modern, intelligent feel
- **Speed with Sophistication**: Fast scraping (<3s) with smooth animations
- **Progressive Disclosure**: Show loading → typing reveal → full data cards

### User Flow

```
Form Builder (capture company name)
        ↓
User enters website URL / company name
        ↓
Click "Analyze Website" → API call
        ↓
[Loading State] Animated visual (2-3s)
        ↓
[Typing Animation] Business summary reveals character-by-character
        ↓
[Full Display] Industry, business model, company size in cards
        ↓
"Looks Good" → Next step | "Edit Manually" → Fallback form
```

### Behavioral Rules

1. **First Visit**: Full loading + typing animation
2. **Navigation Back**: Instant display (no animation replay)
3. **localStorage Persistence**: Track animation completion per workflow
4. **Optional Step**: Can be skipped if no company website provided

---

## 2. Layout Architecture

### Split-Screen Structure (50/50 Responsive)

```
┌──────────────────────────────────────────────────────────────┐
│                         │                                     │
│                         │                                     │
│   ANIMATED VISUAL       │     ENRICHMENT CONTENT              │
│   (Loading/Success)     │     (Input → Analysis → Results)    │
│   Left 50%              │     Right 50%                       │
│                         │                                     │
│                         │                                     │
└──────────────────────────────────────────────────────────────┘
```

### Desktop Layout (≥1024px)

- **Left Panel (50%)**: Animated visual, gradient background, floating particles
- **Right Panel (50%)**: Centered content (max-width 560px)
- **Vertical Alignment**: Both panels vertically centered

### Tablet Layout (768px - 1023px)

- **Stacked Layout**: Visual panel 40vh, content panel below
- **Visual**: Simplified animation, reduced particle count
- **Content**: Full-width with 48px padding

### Mobile Layout (<768px)

- **Minimal Visual**: 25vh height header with subtle gradient
- **Content**: 24px horizontal padding
- **Typing Animation**: Reduced speed (30ms → 40ms per character)

---

## 3. Design System Tokens

### Color Palette

#### Brand Colors (Consistent with Login)

```css
--brand-primary: #4f46e5 /* Indigo 600 */ --brand-primary-hover: #4338ca
  /* Indigo 700 */ --brand-primary-light: #eef2ff /* Indigo 50 */
  --brand-accent: #7c3aed /* Purple 600 - for gradients */;
```

#### Neutral Scale

```css
--neutral-50: #f9fafb --neutral-100: #f3f4f6 --neutral-200: #e5e7eb
  --neutral-400: #9ca3af --neutral-500: #6b7280 --neutral-600: #4b5563
  --neutral-700: #374151 --neutral-900: #111827;
```

#### Semantic Colors

```css
--success-500: #10b981 /* Green */ --info-500: #3b82f6 /* Blue */
  --warning-500: #f59e0b /* Amber */;
```

#### State-Specific Colors

```css
--loading-gradient-start: #4f46e5 --loading-gradient-end: #7c3aed
  --card-bg: #ffffff --card-border: var(--neutral-200)
  --card-shadow: rgba(0, 0, 0, 0.05);
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

#### Hierarchy

**H1 - Screen Title**

```css
font-size: 36px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
margin-bottom: 12px
```

**H2 - Section Heading** ("Here's what we found")

```css
font-size: 24px
font-weight: 600
line-height: 1.3
color: var(--neutral-900)
letter-spacing: -0.01em
margin-bottom: 16px
```

**H3 - Card Titles** ("Industry", "Business Model")

```css
font-size: 14px
font-weight: 600
line-height: 1.4
color: var(--neutral-600)
text-transform: uppercase
letter-spacing: 0.05em
margin-bottom: 8px
```

**Body - Business Summary** (Typing animation text)

```css
font-size: 18px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)
```

**Label - Input Labels**

```css
font-size: 14px
font-weight: 500
line-height: 1.4
color: var(--neutral-700)
margin-bottom: 6px
```

**Small - Helper Text**

```css
font-size: 13px
font-weight: 400
line-height: 1.5
color: var(--neutral-500)
```

### Spacing Scale

```css
--space-xs: 4px --space-sm: 8px --space-md: 16px --space-lg: 24px
  --space-xl: 32px --space-2xl: 48px;
```

### Border Radius

```css
--radius-sm: 6px --radius-md: 8px --radius-lg: 12px --radius-xl: 16px
  --radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05) --shadow-md: 0 4px 6px
  rgba(0, 0, 0, 0.07) --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1) --shadow-xl: 0
  20px 25px rgba(0, 0, 0, 0.15);
```

---

## 4. Component Specifications

### 4.1 Input Section (Initial State)

#### Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│  Tell us about your business                           │  ← H1
│  We'll analyze your website to personalize your setup  │  ← Subtitle
│                                                         │
│  Website or Company Name                               │  ← Label
│  ┌───────────────────────────────────────────────────┐ │
│  │  https://example.com                     [🌐]     │ │  ← Input
│  └───────────────────────────────────────────────────┘ │
│  Enter your website URL or company name                │  ← Helper
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │           Analyze Website                         │ │  ← Button
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Skip this step                                        │  ← Skip link
└─────────────────────────────────────────────────────────┘
```

#### Specifications

**Container**

```css
max-width: 560px
margin: 0 auto
padding: 32px
```

**Title (H1)**

```css
font-size: 36px
font-weight: 700
color: var(--neutral-900)
margin-bottom: 12px
```

**Subtitle**

```css
font-size: 16px
font-weight: 400
color: var(--neutral-500)
margin-bottom: 40px
line-height: 1.5
```

**Input Field**

```css
width: 100%
height: 52px
padding: 0 48px 0 16px      /* Right padding for icon */
font-size: 16px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 0.15s ease

/* Icon */
position: absolute
right: 16px
size: 20px × 20px
color: var(--neutral-400)

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)
```

**Analyze Button**

```css
width: 100%
height: 52px
font-size: 16px
font-weight: 600
color: #FFFFFF
background: var(--brand-primary)
border: none
border-radius: 8px
cursor: pointer
transition: all 0.15s ease
margin-top: 20px

/* Hover */
background: var(--brand-primary-hover)
transform: translateY(-2px)
box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25)

/* Active */
transform: translateY(0)
```

**Skip Link**

```css
display: block
text-align: center
margin-top: 24px
font-size: 14px
font-weight: 500
color: var(--neutral-500)
text-decoration: none

/* Hover */
color: var(--brand-primary)
text-decoration: underline
```

---

### 4.2 Loading State (Left Panel)

#### Visual Composition

```
┌────────────────────────────────┐
│                                │
│    [Gradient Orb Animation]    │
│                                │
│    [Floating Particles]        │
│                                │
│    [Progress Ring]             │
│                                │
│    Analyzing your website...   │
│    This will take a moment     │
│                                │
└────────────────────────────────┘
```

#### Gradient Background

```css
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
width: 50%
height: 100vh
display: flex
flex-direction: column
align-items: center
justify-content: center
position: relative
overflow: hidden
```

#### Animated Gradient Orbs

**Orb 1** (Large, top-left)

```css
position: absolute
top: -20%
left: -10%
width: 500px
height: 500px
border-radius: 50%
background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)
filter: blur(60px)
animation: float1 8s ease-in-out infinite
```

**Orb 2** (Medium, bottom-right)

```css
position: absolute
bottom: -15%
right: -5%
width: 400px
height: 400px
border-radius: 50%
background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)
filter: blur(50px)
animation: float2 10s ease-in-out infinite reverse
```

**Float Animations**

```css
@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-40px, 20px) scale(1.15);
  }
}
```

#### Floating Particles

**Particle System** (12-15 particles)

```css
/* Individual Particle */
position: absolute
width: 4px
height: 4px
background: rgba(255, 255, 255, 0.6)
border-radius: 50%
animation: particle-float var(--duration) ease-in-out infinite

/* Particle Variants */
--duration: Random 6s-12s
--delay: Random 0s-3s
--start-position: Random x/y
--end-position: Random x/y offset

@keyframes particle-float {
  0% {
    transform: translate(var(--start-x), var(--start-y)) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--end-x), var(--end-y)) scale(1);
    opacity: 0;
  }
}
```

#### Progress Ring (Center)

**SVG Circle Progress**

```css
/* Container */
width: 120px
height: 120px
position: relative
z-index: 10

/* Background Circle */
stroke: rgba(255, 255, 255, 0.2)
stroke-width: 4
fill: none

/* Progress Circle */
stroke: #FFFFFF
stroke-width: 4
fill: none
stroke-dasharray: 283      /* 2 * π * r (r=45) */
stroke-dashoffset: 0       /* Animates 283 → 0 */
stroke-linecap: round
animation: progress-spin 2s linear infinite

/* Inner Icon */
color: #FFFFFF
size: 48px
opacity: 0.9
```

**Progress Animation**

```css
@keyframes progress-spin {
  0% {
    stroke-dashoffset: 283;
    transform: rotate(0deg);
  }
  100% {
    stroke-dashoffset: 0;
    transform: rotate(360deg);
  }
}
```

#### Loading Text

**Primary Text** ("Analyzing your website...")

```css
font-size: 20px
font-weight: 600
color: #FFFFFF
margin-top: 24px
text-align: center
opacity: 0.95
```

**Secondary Text** ("This will take a moment")

```css
font-size: 15px
font-weight: 400
color: rgba(255, 255, 255, 0.8)
margin-top: 8px
text-align: center
```

---

### 4.3 Typing Animation (Business Summary)

#### Visual Structure (Right Panel)

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Here's what we found                                  │  ← H2
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  A B2B SaaS company providing construction        │ │
│  │  management software for contractors█             │ │  ← Typing
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  [Data cards appear after typing completes]            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Container Specifications

**Summary Box**

```css
width: 100%
padding: 24px
background: var(--neutral-50)
border: 1px solid var(--neutral-200)
border-radius: 12px
margin-bottom: 32px
min-height: 120px
position: relative
```

**Typing Text**

```css
font-size: 18px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)
white-space: pre-wrap
word-wrap: break-word
```

**Typing Cursor**

```css
display: inline-block
width: 2px
height: 1.2em
background: var(--brand-primary)
margin-left: 2px
animation: blink 1s step-end infinite

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

#### Animation Behavior

**Timing Configuration**

```typescript
const TYPING_CONFIG = {
  charDelay: 30, // 30ms per character (fast, readable)
  punctuationDelay: 150, // Pause after . , ! ?
  cursorBlinkRate: 530, // 530ms blink cycle
  fadeInDuration: 200, // Box fade-in
};
```

**Sequence**

```
1. Summary box fades in (200ms)
2. Wait 100ms
3. Start typing character-by-character (30ms delay)
4. Pause 150ms after punctuation
5. When complete, cursor blinks for 1s
6. Cursor fades out (300ms)
7. Data cards fade in sequentially (stagger 100ms each)
```

**localStorage Persistence**

```typescript
// Key format: `flowtrack-enrichment-${workflowId}`
interface EnrichmentCache {
  workflowId: string;
  hasCompletedAnimation: boolean;
  timestamp: number;
  enrichedData: {
    summary: string;
    industry: string;
    businessModel: string;
    // ...
  };
}

// On navigation back:
if (cached && cached.hasCompletedAnimation) {
  // Skip animation, show instant display
  showCompleteState();
} else {
  // Play typing animation
  playTypingAnimation();
}
```

---

### 4.4 Data Cards (After Typing Completes)

#### Grid Layout

```
┌──────────────────────────────┬──────────────────────────────┐
│  INDUSTRY                    │  BUSINESS MODEL              │
│  Technology - Construction   │  B2B SaaS                    │
└──────────────────────────────┴──────────────────────────────┘
┌──────────────────────────────┬──────────────────────────────┐
│  COMPANY SIZE                │  WEBSITE                     │
│  SMB (50-500 employees)      │  example.com                 │
└──────────────────────────────┴──────────────────────────────┘
```

#### Card Specifications

**Grid Container**

```css
display: grid
grid-template-columns: repeat(2, 1fr)
gap: 16px
margin-top: 24px

/* Mobile: Stack */
@media (max-width: 640px) {
  grid-template-columns: 1fr;
}
```

**Individual Card**

```css
background: #FFFFFF
border: 1px solid var(--neutral-200)
border-radius: 8px
padding: 20px
transition: all 0.2s ease

/* Hover */
border-color: var(--brand-primary)
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1)
transform: translateY(-2px)
```

**Card Label** (H3)

```css
font-size: 12px
font-weight: 600
color: var(--neutral-500)
text-transform: uppercase
letter-spacing: 0.05em
margin-bottom: 8px
```

**Card Value**

```css
font-size: 16px
font-weight: 600
color: var(--neutral-900)
line-height: 1.4
```

**Card Icon** (Optional, top-right)

```css
position: absolute
top: 16px
right: 16px
size: 24px
color: var(--brand-primary)
opacity: 0.6
```

#### Staggered Fade-In Animation

**Sequential Appearance**

```css
/* Card 1 (Industry) */
animation: fade-slide-up 0.4s ease-out 0ms forwards
opacity: 0

/* Card 2 (Business Model) */
animation: fade-slide-up 0.4s ease-out 100ms forwards
opacity: 0

/* Card 3 (Company Size) */
animation: fade-slide-up 0.4s ease-out 200ms forwards
opacity: 0

/* Card 4 (Website) */
animation: fade-slide-up 0.4s ease-out 300ms forwards
opacity: 0

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 4.5 Action Buttons

#### Layout

```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────────────┐   ┌───────────────────┐  │
│  │  Looks Good, Continue    │   │  Edit Manually    │  │
│  └──────────────────────────┘   └───────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Specifications

**Container**

```css
display: flex
gap: 16px
margin-top: 32px

/* Mobile: Stack */
@media (max-width: 640px) {
  flex-direction: column;
}
```

**Primary Button** ("Looks Good, Continue")

```css
flex: 1
height: 52px
font-size: 16px
font-weight: 600
color: #FFFFFF
background: var(--brand-primary)
border: none
border-radius: 8px
cursor: pointer
transition: all 0.15s ease

/* Hover */
background: var(--brand-primary-hover)
transform: translateY(-2px)
box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25)
```

**Secondary Button** ("Edit Manually")

```css
flex: 1
height: 52px
font-size: 16px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 8px
cursor: pointer
transition: all 0.15s ease

/* Hover */
border-color: var(--neutral-300)
background: var(--neutral-50)
```

---

### 4.6 Success State Transition (Left Panel)

#### Visual Change After Completion

**Gradient Update**

```css
/* Transition from loading gradient to success gradient */
background: linear-gradient(135deg, #10B981 0%, #059669 100%)
transition: background 0.8s ease
```

**Animated Checkmark Icon**

```css
/* Replace progress ring with checkmark */
width: 120px
height: 120px
color: #FFFFFF

/* Circle background */
background: rgba(255, 255, 255, 0.2)
border-radius: 50%
padding: 24px

/* Checkmark animation */
animation: checkmark-pop 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)

@keyframes checkmark-pop {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
```

**Success Text**

```css
/* Primary */
font-size: 24px
font-weight: 700
color: #FFFFFF
margin-top: 24px

/* Secondary */
font-size: 16px
font-weight: 400
color: rgba(255, 255, 255, 0.9)
margin-top: 8px
```

---

## 5. Error States

### 5.1 Scraping Failed

#### Visual Structure (Right Panel)

```
┌─────────────────────────────────────────────────────────┐
│  ⚠️  We couldn't analyze your website                   │
│                                                         │
│  We had trouble accessing example.com. This might be   │
│  due to:                                               │
│  • Website is not accessible                           │
│  • URL is incorrect                                    │
│  • Temporary network issue                             │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Try Again                                        │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  Or skip this step and continue                        │
└─────────────────────────────────────────────────────────┘
```

#### Specifications

**Error Alert Box**

```css
width: 100%
padding: 20px 24px
background: rgba(239, 68, 68, 0.05)
border-left: 4px solid var(--error-500)
border-radius: 8px
margin-bottom: 24px
```

**Error Icon**

```css
display: inline-block
margin-right: 12px
font-size: 24px
vertical-align: middle
```

**Error Title**

```css
font-size: 18px
font-weight: 600
color: var(--neutral-900)
margin-bottom: 12px
```

**Error Message**

```css
font-size: 15px
font-weight: 400
color: var(--neutral-700)
line-height: 1.6
```

**Error Reasons List**

```css
margin: 12px 0
padding-left: 20px

li {
  margin-bottom: 4px
  color: var(--neutral-600)
}
```

---

### 5.2 Low Confidence Warning

#### Visual Structure

```
┌─────────────────────────────────────────────────────────┐
│  ℹ️  Limited information available                      │
│                                                         │
│  We found some basic information, but couldn't         │
│  confidently determine all details. Please review      │
│  and edit as needed.                                   │
└─────────────────────────────────────────────────────────┘
```

#### Specifications

**Warning Banner**

```css
width: 100%
padding: 16px 20px
background: rgba(245, 158, 11, 0.08)
border-left: 4px solid var(--warning-500)
border-radius: 8px
margin-bottom: 20px
```

**Warning Text**

```css
font-size: 14px
font-weight: 400
color: var(--neutral-700)
line-height: 1.5
```

**Affected Cards** (Low confidence fields)

```css
/* Add visual indicator */
border-color: var(--warning-500)
background: rgba(245, 158, 11, 0.03)

/* Add badge */
.low-confidence-badge {
  position: absolute
  top: 12px
  right: 12px
  padding: 4px 8px
  background: var(--warning-500)
  color: #FFFFFF
  font-size: 11px
  font-weight: 600
  border-radius: 4px
  text-transform: uppercase
}
```

---

## 6. Micro-Interactions & Animations

### 6.1 Page Entry Animation

**Sequence**

```
1. Left panel: Fade in (300ms) + gradient sweep
2. Right panel: Content slides up + fades in (400ms, delay 150ms)
```

**CSS**

```css
/* Left Panel */
animation: fade-in 0.3s ease-out

/* Right Panel */
animation: slide-fade-up 0.4s ease-out 0.15s backwards

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 6.2 Input Focus Glow

**Animation**

```css
transition: all 0.2s ease

/* Focus */
border-color: var(--brand-primary)
background: #FFFFFF
box-shadow:
  0 0 0 3px var(--brand-primary-light),
  0 4px 12px rgba(79, 70, 229, 0.1)
```

---

### 6.3 Button Press Feedback

**Sequence**

```
Hover → Lift up 2px + shadow increase
Press → Scale down 0.98 + shadow decrease
Release → Return to hover state
```

**CSS**

```css
/* Base */
transform: scale(1) translateY(0)
transition: all 0.15s ease

/* Hover */
transform: scale(1) translateY(-2px)
box-shadow: 0 8px 16px rgba(79, 70, 229, 0.25)

/* Active */
transform: scale(0.98) translateY(0)
box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2)
```

---

### 6.4 Card Hover Lift

**Effect**

```css
transition: all 0.2s ease

/* Hover */
transform: translateY(-4px)
box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1)
border-color: var(--brand-primary)
```

---

### 6.5 Loading State Transitions

**Phase 1 → Phase 2** (Loading → Typing)

```
1. Left panel: Progress ring scales down + fades out (300ms)
2. Left panel: Success icon scales up + fades in (400ms, delay 100ms)
3. Left panel: Gradient transitions to success color (800ms)
4. Right panel: Summary box fades in (200ms)
5. Right panel: Typing animation starts (delay 100ms)
```

**Phase 2 → Phase 3** (Typing → Full Display)

```
1. Typing cursor blinks in place (1s)
2. Cursor fades out (300ms)
3. Data cards appear sequentially (stagger 100ms)
4. Action buttons slide up + fade in (400ms, delay 300ms)
```

---

## 7. Responsive Behavior

### Breakpoints

```css
--breakpoint-mobile: 640px --breakpoint-tablet: 768px
  --breakpoint-desktop: 1024px --breakpoint-wide: 1280px;
```

### Layout Adjustments

#### Desktop (≥1024px)

- Split-screen 50/50
- Full animation suite
- Particle count: 15

#### Tablet (768px - 1023px)

- Stacked: Visual 40vh + content
- Reduced animation complexity
- Particle count: 8

#### Mobile (<768px)

- Minimal visual header (25vh)
- Single column cards
- No particles
- Reduced typing speed (40ms)

---

## 8. Accessibility Requirements

### Keyboard Navigation

- Tab order: Input → Analyze button → Skip link → Data cards → Action buttons
- Focus indicators: 3px ring (brand-primary-light)
- Enter key: Submit input field

### Screen Reader Support

- `aria-live="polite"` on typing animation container
- `aria-busy="true"` during loading
- `role="status"` on success/error messages
- All cards have semantic headings

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Disable typing animation */
  .typing-text {
    animation: none;
  }

  /* Instant display */
  .data-card {
    animation: none;
    opacity: 1;
  }
}
```

### Color Contrast

- Body text: 4.5:1 minimum (WCAG AA)
- Large text: 3:1 minimum
- Interactive elements: 4.5:1

---

## 9. Performance Optimization

### Code Splitting

```typescript
// Lazy load enrichment screen
const CompanyEnrichmentScreen = lazy(
  () => import('@/components/onboarding/CompanyEnrichmentScreen')
);
```

### Animation Performance

- Use `transform` and `opacity` only (GPU-accelerated)
- `will-change: transform` on animated elements
- Debounce particle updates
- RequestAnimationFrame for typing animation

### Asset Optimization

- SVG icons (not raster)
- CSS gradients (not images)
- Canvas for particles (not DOM elements)

---

## 10. Implementation Checklist

### Phase 1: Structure

- [ ] Create page layout (split-screen)
- [ ] Implement responsive breakpoints
- [ ] Set up routing (/onboarding/company-enrichment)

### Phase 2: Loading State

- [ ] Gradient background with orbs
- [ ] Particle system (Canvas API)
- [ ] Progress ring animation
- [ ] Loading text with fade transitions

### Phase 3: Typing Animation

- [ ] Character-by-character reveal logic
- [ ] Blinking cursor component
- [ ] Punctuation pause handling
- [ ] localStorage persistence

### Phase 4: Data Display

- [ ] Summary box component
- [ ] Data card grid
- [ ] Staggered fade-in animations
- [ ] Hover interactions

### Phase 5: Actions & Transitions

- [ ] Action button group
- [ ] Success state transition
- [ ] Error state handling
- [ ] Skip functionality

### Phase 6: Polish

- [ ] Accessibility attributes
- [ ] Reduced motion support
- [ ] Focus management
- [ ] Performance optimization

---

## 11. Design Rationale

### Why ChatGPT-Style Typing?

1. **Familiarity**: Users understand this pattern from modern AI tools
2. **Perceived Intelligence**: Suggests real-time analysis (even if complete)
3. **Engagement**: Keeps user attention during data reveal
4. **Delight Factor**: Creates "wow" moment in onboarding

### Why Split-Screen Layout?

1. **Visual Balance**: Separates loading state from content
2. **Premium Feel**: Aligns with modern SaaS aesthetics
3. **Storytelling**: Left panel guides user through process states
4. **Reusable Pattern**: Consistent with login page architecture

### Why localStorage Persistence?

1. **Performance**: Skip animation on navigation back (instant display)
2. **User Control**: Respects user's time on repeated views
3. **Technical Elegance**: No backend state needed for UI preference

---

**End of Specification**

This document defines the complete visual and interaction design for the Company Enrichment onboarding step. All measurements, colors, and animations are production-ready and aligned with FlowTrack's design system.
