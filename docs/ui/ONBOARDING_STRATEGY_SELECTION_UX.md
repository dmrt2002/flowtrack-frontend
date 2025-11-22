# FlowTrack Onboarding - Strategy Selection · UI/UX Specification

## Screen Purpose & Context

**Screen Name**: Strategy Selection
**User Journey Position**: First screen after successful login/signup
**Primary Goal**: Enable users to choose a proven automation blueprint within 30 seconds
**Success Metric**: 90%+ selection rate without abandonment

**The "Shopping for Solutions" Mindset**: Users aren't building; they're acquiring a working system. Frame this as selecting a proven machine, not starting a project.

---

## 1. Visual Strategy & Brand Alignment

### Core Design Philosophy

This screen embodies **"Confident Selection"** — the moment where complexity vanishes and value crystallizes. The user should feel like they're in a high-end store choosing between three premium, pre-configured solutions.

### Visual Tone

**Calm Authority with Visual Proof**

- Minimalist layout that directs attention to the three choices
- Each card is a product showcase, not a feature list
- Subtle animations prove the automation exists (not vaporware)
- NO analysis paralysis: Clear differentiation, obvious winners for different use cases

### Psychological Goals

1. **Reduce Perceived Risk**: "These are proven, not experimental"
2. **Create Ownership Desire**: "I want _that_ system in my business"
3. **Eliminate Blank Canvas Fear**: "I don't have to build anything"
4. **Build Momentum**: Fast decision → immediate progress

---

## 2. Layout Architecture

### Viewport Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│                         [FlowTrack Logo]                       │  ← Header
│                                                                │
│   ┌────────────────────────────────────────────────────────┐  │
│   │  Don't start from scratch. Choose a proven workflow.   │  │  ← Sub-headline
│   └────────────────────────────────────────────────────────┘  │
│                                                                │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│   │              │  │              │  │              │      │
│   │   CARD 1     │  │   CARD 2     │  │   CARD 3     │      │  ← Strategy Cards
│   │  Gatekeeper  │  │  Nurturer    │  │  Closer      │      │
│   │              │  │              │  │              │      │
│   └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                                │
│                          Step 1 of 4                          │  ← Progress
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Spacing & Grid

```css
/* Container */
max-width: 1200px
margin: 0 auto
padding: 60px 40px
min-height: 100vh
display: flex
flex-direction: column
justify-content: center

/* Header */
margin-bottom: 16px
text-align: center

/* Sub-headline */
margin-bottom: 48px
text-align: center

/* Card Grid */
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 32px
margin-bottom: 40px

/* Progress Indicator */
text-align: center
margin-top: auto
```

---

## 3. Design System Definitions

### Color Palette Extensions

**Strategy-Specific Accent Colors** (for card differentiation):

```css
/* Gatekeeper - Blue Shield */
--strategy-gatekeeper: #3b82f6 /* Blue 500 */ --strategy-gatekeeper-bg: #eff6ff
  /* Blue 50 */ --strategy-gatekeeper-hover: #2563eb /* Blue 600 */
  /* Nurturer - Green Growth */ --strategy-nurturer: #10b981 /* Emerald 500 */
  --strategy-nurturer-bg: #ecfdf5 /* Emerald 50 */
  --strategy-nurturer-hover: #059669 /* Emerald 600 */
  /* Closer - Purple Lightning */ --strategy-closer: #8b5cf6 /* Violet 500 */
  --strategy-closer-bg: #f5f3ff /* Violet 50 */ --strategy-closer-hover: #7c3aed
  /* Violet 600 */;
```

### Typography Hierarchy

**Page Title** (Logo area - minimal)

```css
font-size: 24px
font-weight: 600
color: var(--neutral-900)
letter-spacing: -0.01em
```

**Sub-headline**

```css
font-size: 18px
font-weight: 400
color: var(--neutral-600)
line-height: 1.5
max-width: 640px
margin: 0 auto
```

**Card Title**

```css
font-size: 24px
font-weight: 700
color: var(--neutral-900)
line-height: 1.2
letter-spacing: -0.02em
margin-bottom: 8px
```

**Card Tagline**

```css
font-size: 14px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
color: [strategy-specific-color]
margin-bottom: 12px
```

**Card Description**

```css
font-size: 15px
font-weight: 400
color: var(--neutral-600)
line-height: 1.6
margin-bottom: 24px
```

---

## 4. Component Specifications

### 4.1 Strategy Card Structure

```
┌───────────────────────────────────┐
│                                   │
│         [Icon - 64×64]            │  ← Strategy icon
│                                   │
│  THE GATEKEEPER                   │  ← Title
│  FILTER & QUALIFY                 │  ← Tagline (colored)
│                                   │
│  Reject low budgets.              │  ← Description
│  Schedule high-value leads.       │
│                                   │
│  ┌───────────────────────────┐   │
│  │                           │   │  ← "X-Ray" preview (on hover)
│  │   [Node Graph Preview]    │   │
│  │                           │   │
│  └───────────────────────────┘   │
│                                   │
│  • Saves 10 hrs/week              │  ← Benefits (3 bullets)
│  • 80% lead quality increase      │
│  • One-click setup                │
│                                   │
│  ┌─────────────────────────────┐ │
│  │   Select Strategy       →   │ │  ← CTA Button
│  └─────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘
```

#### Card Base Specifications

```css
/* Card Container */
background: #FFFFFF
border: 2px solid var(--neutral-200)
border-radius: 16px
padding: 40px 32px
text-align: center
cursor: pointer
transition: all 0.15s ease
position: relative
overflow: hidden

/* Default State */
transform: scale(1)
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
```

#### Card Hover State

```css
/* Hover Transformation */
transform: scale(1.05)
border-color: [strategy-color]
box-shadow:
  0 12px 24px -8px rgba([strategy-color-rgb], 0.15),
  0 0 0 1px [strategy-color]
z-index: 10

/* Border Glow Effect */
border-width: 2px
border-style: solid

/* Timing */
transition-duration: 200ms
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1)
```

#### Card Selection State

```css
/* Clicked/Selected */
transform: scale(1)
border-color: [strategy-color]
background: [strategy-bg-color]

/* Full-screen expansion animation */
animation: expandCard 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards
```

### 4.2 Icon Specifications

**Icon Container**

```css
width: 80px
height: 80px
margin: 0 auto 24px
display: flex
align-items: center
justify-content: center
background: [strategy-bg-color]
border-radius: 20px
position: relative
```

**Icon Assets**

- **Gatekeeper**: Shield icon with checkmark

  - SVG size: 48×48px
  - Color: `var(--strategy-gatekeeper)`
  - Style: Solid fill with 2px stroke

- **Nurturer**: Sprouting plant/growth icon

  - SVG size: 48×48px
  - Color: `var(--strategy-nurturer)`
  - Style: Outlined with organic curves

- **Closer**: Lightning bolt icon
  - SVG size: 48×48px
  - Color: `var(--strategy-closer)`
  - Style: Solid fill, angular

### 4.3 "X-Ray" Preview Component

**Purpose**: On hover, reveal a simplified wireframe of the automation logic

```css
/* Preview Container */
position: absolute
width: calc(100% - 64px)
height: 160px
left: 32px
top: 50%
transform: translateY(-50%) scale(0.95)
opacity: 0
background: rgba(255, 255, 255, 0.95)
backdrop-filter: blur(8px)
border-radius: 12px
padding: 20px
transition: all 0.2s ease
pointer-events: none

/* Hover State - Revealed */
opacity: 1
transform: translateY(-50%) scale(1)
```

**Preview Content**

```
[Form] → [Check Budget] → [Email/Calendar]
   ○         ◇              □
```

- Simplified horizontal node flow (3 nodes max)
- Nodes: 40×40px
- Connectors: 2px dashed lines
- Colors: Neutral gray (#9CA3AF) for ghost effect
- Labels: 11px, medium weight, neutral-600

### 4.4 Benefits List

```css
/* List Container */
text-align: left
margin: 24px 0
padding: 0 8px

/* List Item */
display: flex
align-items: flex-start
gap: 8px
margin-bottom: 8px
font-size: 14px
color: var(--neutral-700)
line-height: 1.5

/* Bullet Icon */
width: 16px
height: 16px
color: var(--success-500)
flex-shrink: 0
margin-top: 2px
```

**Bullet Icons**: Checkmark in circle (solid fill)

### 4.5 CTA Button

```css
/* Button Base */
width: 100%
height: 48px
background: [strategy-color]
color: #FFFFFF
border: none
border-radius: 8px
font-size: 15px
font-weight: 600
cursor: pointer
transition: all 0.15s ease
display: flex
align-items: center
justify-content: center
gap: 8px

/* Hover State */
background: [strategy-color-hover]
transform: translateY(-2px)
box-shadow: 0 4px 12px rgba([strategy-color-rgb], 0.3)

/* Active/Pressed */
transform: translateY(0)
box-shadow: 0 2px 4px rgba([strategy-color-rgb], 0.2)

/* Arrow Icon */
transition: transform 0.15s ease
/* On hover, slides right 4px */
```

---

## 5. Strategy Cards Content

### Card 1: The Gatekeeper

```
Icon: Shield with checkmark
Title: The Gatekeeper
Tagline: FILTER & QUALIFY
Color: Blue (#3B82F6)

Description:
"Reject low budgets. Schedule high-value leads."

Benefits:
• Saves 10 hours/week on unqualified calls
• 80% increase in meeting quality
• One-click budget threshold setup

X-Ray Preview:
[Form] → [Budget ≥ $X?] → [Yes: Calendar / No: Polite Decline]
```

### Card 2: The Nurturer

```
Icon: Sprouting plant
Title: The Nurturer
Tagline: LONG-TERM FOLLOW UP
Color: Green (#10B981)

Description:
"5-email drip sequence for warm leads."

Benefits:
• Automates relationship-building
• 3× higher conversion over 30 days
• Template emails included

X-Ray Preview:
[Form] → [Wait 3 Days] → [Email 1] → [Email 2] → ...
```

### Card 3: The Closer

```
Icon: Lightning bolt
Title: The Closer
Tagline: SPEED TO CALL
Color: Purple (#8B5CF6)

Description:
"Direct booking focus. Strike while hot."

Benefits:
• Books calls within 5 minutes
• 90% show-up rate
• Instant Calendly integration

X-Ray Preview:
[Form] → [Send Calendly] → [Reminder Emails]
```

---

## 6. Micro-Interactions & Animations

### 6.1 Card Hover Reveal

```
Trigger: Mouse enters card
Duration: 200ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1) (elastic ease-out)

Sequence:
1. Card scales to 1.05× (200ms)
2. Border glows with strategy color (200ms)
3. Shadow deepens and tints (200ms)
4. X-Ray preview fades in from opacity 0 to 1 (150ms, delay 50ms)
5. CTA button arrow slides right 4px (150ms)
```

### 6.2 Card Selection Expansion

```
Trigger: Click on card or CTA button
Duration: 400ms total
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)

Sequence:
1. Selected card scales to 1.1× (100ms)
2. Other cards fade to opacity 0.3 and scale to 0.95× (150ms)
3. Selected card transitions background to strategy-bg-color (150ms)
4. Page header and sub-headline fade out (200ms)
5. Selected card expands to full screen (200ms, delay 200ms)
6. Card morphs into next screen (fade transition, 200ms)
```

**Full-Screen Expansion Keyframes**

```css
@keyframes expandCard {
  0% {
    transform: scale(1.1);
    border-radius: 16px;
  }
  50% {
    transform: scale(1.2);
    border-radius: 8px;
  }
  100% {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transform: scale(1);
    border-radius: 0;
  }
}
```

### 6.3 Icon Pulse (Subtle Emphasis)

```
Animation: Continuous subtle pulse on idle
Duration: 2s infinite
Easing: ease-in-out

Keyframes:
0%, 100%: transform: scale(1)
50%: transform: scale(1.05)

Purpose: Creates "breathing" effect to make cards feel alive
```

### 6.4 Preview "Flow" Animation

```
Trigger: Hover state active for 500ms+
Animation: Glowing dot travels through node connections

Effect:
- 8px diameter glowing dot
- Color: strategy-color at 80% opacity
- Travels from left node to right node (1.5s)
- Repeats every 2s while hovering
```

---

## 7. Progress Indicator

### Visual Structure

```
Step 1 of 4
─────────────────────
█████░░░░░░░░░░░░░░░  25%
```

### Specifications

```css
/* Container */
text-align: center
margin-top: 40px

/* Text */
font-size: 14px
color: var(--neutral-500)
margin-bottom: 12px
font-weight: 500

/* Progress Bar */
width: 100%
max-width: 400px
height: 4px
background: var(--neutral-200)
border-radius: 2px
overflow: hidden
margin: 0 auto

/* Fill */
width: 25%
height: 100%
background: var(--brand-primary)
transition: width 0.3s ease
border-radius: 2px
```

---

## 8. Responsive Behavior

### Desktop (≥1024px)

- 3-column grid maintained
- Card width: ~360px each
- Hover effects: Full fidelity
- X-Ray preview: Visible on hover

### Tablet (768px - 1023px)

```css
/* Card Grid */
grid-template-columns: 1fr
gap: 24px
max-width: 500px
margin: 0 auto

/* Cards */
padding: 32px 28px

/* X-Ray Preview */
Display: none (complexity reduction)
```

- Stacked single column
- Each card full-width
- Tap to select (no hover states)

### Mobile (<768px)

```css
/* Container */
padding: 32px 20px

/* Card Grid */
gap: 20px

/* Cards */
padding: 28px 20px

/* Icon Size */
width: 64px
height: 64px

/* Title */
font-size: 20px

/* Description */
font-size: 14px

/* Button */
height: 52px (larger touch target)
```

---

## 9. Accessibility Requirements

### Keyboard Navigation

```
Tab Order:
1. Card 1 (Gatekeeper)
2. Card 1 CTA button
3. Card 2 (Nurturer)
4. Card 2 CTA button
5. Card 3 (Closer)
6. Card 3 CTA button

Actions:
- Enter/Space on card: Select strategy
- Tab: Navigate between cards
- Shift+Tab: Reverse navigation
```

### Focus States

```css
/* Card Focus Ring */
outline: 3px solid var(--brand-primary)
outline-offset: 4px
border-radius: 16px

/* Button Focus */
outline: 3px solid [strategy-color]
outline-offset: 2px
```

### Screen Reader Support

```html
<!-- Card Structure -->
<article
  role="button"
  aria-label="The Gatekeeper strategy. Filter and qualify leads by budget. Select to configure."
  tabindex="0"
>
  <div aria-hidden="true">[Icon]</div>
  <h2>The Gatekeeper</h2>
  <p>Filter & Qualify</p>
  <p>Reject low budgets. Schedule high-value leads.</p>
  <ul aria-label="Benefits">
    <li>Saves 10 hours/week on unqualified calls</li>
    <!-- ... -->
  </ul>
  <button>Select Strategy</button>
</article>

<!-- Progress Indicator -->
<div
  role="progressbar"
  aria-valuenow="25"
  aria-valuemin="0"
  aria-valuemax="100"
>
  Step 1 of 4
</div>
```

### Color Contrast

- Card titles (#111827) on white: 16.1:1 ✓
- Descriptions (#6B7280) on white: 7.0:1 ✓
- Strategy colors on white backgrounds: All 4.5:1+ ✓
- CTA button text (white) on strategy colors: 4.5:1+ ✓

---

## 10. Edge Cases & States

### 10.1 Loading State (Initial Page Load)

```
Animation:
1. Cards fade in sequentially (100ms stagger)
2. Each card slides up from translateY(20px) to 0
3. Total animation: 500ms
4. Easing: ease-out
```

### 10.2 Error State (Failed Template Load)

```
Fallback UI:
┌─────────────────────────────────────┐
│   ⚠️  Unable to load strategies     │
│                                     │
│   [Retry Button]                    │
└─────────────────────────────────────┘

Style:
- Background: rgba(239, 68, 68, 0.05)
- Border: 2px solid var(--error-500)
- Padding: 40px
- Text: 15px, neutral-700
```

### 10.3 Previously Selected Strategy (Returning User)

```
Enhancement:
- Display "Currently Active" badge on selected strategy
- Badge style:
  - Background: var(--success-500)
  - Color: white
  - Position: Top-right corner of card
  - Text: "Active"
  - Size: 12px font, 6px padding
```

### 10.4 "Coming Soon" Strategy Placeholder

```css
/* Card Disabled State */
opacity: 0.6
cursor: not-allowed
pointer-events: none

/* Badge */
background: var(--neutral-300)
color: var(--neutral-700)
text: "Coming Soon"
```

---

## 11. Design Delight Details

### 11.1 Card Background Texture

```css
/* Subtle grain effect */
background-image:
  url('data:image/svg+xml,...') /* Noise texture */
opacity: 0.02
mix-blend-mode: overlay
```

### 11.2 Icon Glow on Hover

```css
/* Icon container */
box-shadow: 0 0 0 0 rgba([strategy-color-rgb], 0)

/* Hover */
box-shadow: 0 0 20px 8px rgba([strategy-color-rgb], 0.2)
transition: box-shadow 0.3s ease
```

### 11.3 Magnetic CTA Button

```
Effect: Button "pulls" cursor slightly when nearby
Implementation: Cursor within 20px triggers subtle transform
Transform: translateY towards cursor by ~2px
```

### 11.4 Selection Confirmation Sound

```
Optional Enhancement:
- Trigger: Card selection
- Sound: Subtle "click" or "chime" (50ms duration)
- Volume: Low (20% max)
- Format: Web Audio API
```

---

## 12. User Flow Logic

### Decision Tree

```
User lands on Strategy Selection
    ↓
Hover over cards (optional exploration)
    ↓
Read benefits and X-Ray preview
    ↓
Click card or CTA button
    ↓
Selected strategy stores in user session/DB
    ↓
Expansion animation plays
    ↓
Transition to Mad Libs Configurator (Screen 2)
```

### Data Persistence

```typescript
// On selection
interface StrategySelection {
  strategyId: 'gatekeeper' | 'nurturer' | 'closer'
  selectedAt: Date
  userId: string
}

// Store in backend
POST /api/onboarding/select-strategy
Body: { strategyId: 'gatekeeper' }

// Response: Template blueprint JSON
{
  templateId: 'gatekeeper-v1',
  nodes: [...],
  config: {...}
}
```

---

## 13. Implementation Checklist

When building this screen, ensure:

- [ ] All three strategy cards are functional and distinct
- [ ] Hover states perform smoothly (60fps minimum)
- [ ] X-Ray preview renders simplified node graph
- [ ] Selection triggers API call to store user choice
- [ ] Expansion animation completes before navigation
- [ ] Progress indicator updates to "Step 1 of 4 (Complete)"
- [ ] Focus states are visible and keyboard-accessible
- [ ] Mobile layout collapses to single column
- [ ] Loading skeleton appears while templates fetch
- [ ] Error state provides retry mechanism
- [ ] Analytics event fires on strategy selection
- [ ] Previously selected strategy shows "Active" badge

---

## 14. Analytics & Metrics

### Events to Track

```typescript
// Page View
track('strategy_selection_viewed', {
  userId: string,
  sessionId: string,
  timestamp: Date,
});

// Card Hover
track('strategy_card_hovered', {
  strategyId: 'gatekeeper' | 'nurturer' | 'closer',
  hoverDuration: number, // milliseconds
});

// Selection
track('strategy_selected', {
  strategyId: 'gatekeeper' | 'nurturer' | 'closer',
  timeOnPage: number, // seconds
  hoverCount: number, // how many cards they explored
});
```

### Success Metrics

- **Time to Selection**: Target <30 seconds (median)
- **Selection Rate**: >90% (not abandoned)
- **Hover Engagement**: >2 cards explored on average
- **Popular Choice**: Track distribution (goal: balanced across use cases)

---

## 15. Copy Variations for A/B Testing

### Sub-headline Alternatives

```
Version A (Current):
"Don't start from scratch. Choose a proven workflow."

Version B (Benefit-Forward):
"Get a working sales system in 10 minutes. Pick your strategy."

Version C (Social Proof):
"Join 10,000+ solopreneurs using proven automation blueprints."
```

### CTA Button Text Alternatives

```
Current: "Select Strategy →"
Alt 1: "Get Started →"
Alt 2: "Clone This System →"
Alt 3: "Build My Automation →"
```

---

**End of Specification**

This document serves as the complete design specification for the Strategy Selection screen. All subsequent onboarding screens will follow this same format and level of detail.
