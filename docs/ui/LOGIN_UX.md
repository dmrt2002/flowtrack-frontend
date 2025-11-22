# FlowTrack Login/Authentication Page - UI/UX Design Specification

## 1. Visual Strategy & Brand Vibe

### Core Design Philosophy

The login page should embody **"Confident Simplicity"** — a balance between professional automation tooling and approachable solopreneur-friendly design. The aesthetic should communicate:

- **Speed**: Visual lightness, clean lines, no clutter
- **Reliability**: Solid, well-structured components with subtle depth
- **Intelligence**: Modern, sophisticated but not intimidating
- **Action-Oriented**: Clear CTAs that invite immediate engagement

### Visual Tone

**Light-Forward with Strategic Depth**

- Primary aesthetic: Clean, modern light mode with strategic dark accents
- NOT overly technical/dark (avoid dev-tool vibe)
- NOT overly playful/colorful (avoid consumer-app feel)
- TARGET: Professional SaaS with warmth — think Linear, Vercel, or Raycast

---

## 2. Layout Architecture

### Split-Screen Structure (60/40 Ratio)

```
┌─────────────────────────────────────────────────────────┐
│                    │                                    │
│                    │                                    │
│   BRAND/VISUAL     │     AUTHENTICATION FORM            │
│   STORYTELLING     │     (Functional Side)              │
│   (Left 40%)       │     (Right 60%)                    │
│                    │                                    │
│                    │                                    │
└─────────────────────────────────────────────────────────┘
```

### Desktop Layout (≥1024px)

- **Left Panel (40% width)**: Fixed, non-scrollable brand experience
- **Right Panel (60% width)**: Centered form container, max-width 480px
- **Breakpoint behavior**: Maintains split until 1024px

### Tablet/Mobile Layout (<1024px)

- **Stacked Layout**: Brand panel collapses to a compact header (80px height)
- **Form**: Full-width with 24px horizontal padding
- **Brand content**: Simplified to logo + tagline only

---

## 3. Design System Definitions

### Color Palette

#### Primary Brand Colors

```
--brand-primary: #4F46E5        /* Indigo 600 - Primary actions */
--brand-primary-hover: #4338CA  /* Indigo 700 - Hover states */
--brand-primary-light: #EEF2FF  /* Indigo 50 - Backgrounds */
```

#### Neutral Scale

```
--neutral-50: #F9FAFB          /* Lightest background */
--neutral-100: #F3F4F6         /* Card backgrounds */
--neutral-200: #E5E7EB         /* Borders, dividers */
--neutral-300: #D1D5DB         /* Disabled states */
--neutral-400: #9CA3AF         /* Placeholder text */
--neutral-500: #6B7280         /* Secondary text */
--neutral-700: #374151         /* Body text */
--neutral-900: #111827         /* Headings */
```

#### Semantic Colors

```
--success-500: #10B981         /* Green - Success states */
--error-500: #EF4444           /* Red - Error states */
--warning-500: #F59E0B         /* Amber - Warning states */
```

#### Background Strategy

```
--bg-page: #FFFFFF             /* Main page background */
--bg-form-panel: #FFFFFF       /* Form container */
--bg-brand-panel: Linear gradient (see below)
```

**Brand Panel Gradient**:

```css
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
/* Indigo to Purple gradient for visual depth */
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

**H1 - Page Title** (Not used on login page)

**H2 - Section Heading** ("Welcome back", "Create your account")

```
font-size: 32px
font-weight: 700 (Bold)
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
```

**H3 - Subsection** (Optional subtitle)

```
font-size: 16px
font-weight: 400 (Regular)
line-height: 1.5
color: var(--neutral-500)
margin-top: 8px
```

**Body - General Text**

```
font-size: 15px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)
```

**Label - Input Labels**

```
font-size: 14px
font-weight: 500 (Medium)
line-height: 1.4
color: var(--neutral-700)
margin-bottom: 6px
```

**Small - Helper Text**

```
font-size: 13px
font-weight: 400
line-height: 1.4
color: var(--neutral-500)
```

**Link Text**

```
font-size: inherit
font-weight: 500
color: var(--brand-primary)
text-decoration: none
```

---

## 4. Component Specifications

### 4.1 Input Fields

#### Visual Structure

```
┌─────────────────────────────────────────┐
│  Email address                          │  ← Label
├─────────────────────────────────────────┤
│  you@example.com          [icon]        │  ← Input
└─────────────────────────────────────────┘
   ↑ Helper text or error message
```

#### Specifications

```css
/* Container */
margin-bottom: 20px

/* Label */
display: block
margin-bottom: 6px
font-size: 14px
font-weight: 500
color: var(--neutral-700)

/* Input Field */
width: 100%
height: 44px
padding: 0 16px
font-size: 15px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 0.15s ease

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)

/* Error State */
border-color: var(--error-500)
background: #FEF2F2

/* Disabled State */
background: var(--neutral-100)
border-color: var(--neutral-200)
color: var(--neutral-400)
cursor: not-allowed
```

#### Input Icons

- Position: Absolute right, 16px from edge
- Size: 20px × 20px
- Color: `var(--neutral-400)`
- Example icons: Mail icon for email, Lock icon for password

#### Error Message

```css
display: block
margin-top: 6px
font-size: 13px
color: var(--error-500)
font-weight: 400
```

### 4.2 Password Input (Special Case)

#### Toggle Visibility

- Add "Show/Hide" text button at right edge of input
- Text: "Show" / "Hide"
- Font-size: 13px
- Color: `var(--brand-primary)`
- Cursor: pointer
- Toggles input type between `password` and `text`

### 4.3 Primary Button (Login/Sign Up)

#### Specifications

```css
/* Base State */
width: 100%
height: 44px
padding: 0 24px
font-size: 15px
font-weight: 600
color: #FFFFFF
background: var(--brand-primary)
border: none
border-radius: 8px
cursor: pointer
transition: all 0.15s ease

/* Hover State */
background: var(--brand-primary-hover)
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2)

/* Active/Pressed State */
transform: translateY(0)
box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2)

/* Loading State */
background: var(--brand-primary)
cursor: wait
opacity: 0.8
/* Show spinner icon inside button */

/* Disabled State */
background: var(--neutral-300)
color: var(--neutral-500)
cursor: not-allowed
transform: none
box-shadow: none
```

### 4.4 Secondary Button (e.g., "Sign in with Google")

#### Specifications

```css
/* Base State */
width: 100%
height: 44px
padding: 0 24px
font-size: 15px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 8px
cursor: pointer
transition: all 0.15s ease

/* Hover State */
border-color: var(--neutral-300)
background: var(--neutral-50)

/* Icon Placement */
/* Display brand icon (Google logo) 16px from left edge */
padding-left: 48px
position: relative
```

### 4.5 Text Links

#### "Forgot Password" Link

```css
font-size: 14px
font-weight: 500
color: var(--brand-primary)
text-decoration: none

/* Hover */
text-decoration: underline
color: var(--brand-primary-hover)
```

#### "Don't have an account?" / "Already have an account?"

```css
/* Container */
text-align: center
margin-top: 24px
font-size: 14px
color: var(--neutral-600)

/* Link portion */
color: var(--brand-primary)
font-weight: 500
margin-left: 4px
```

### 4.6 Divider (Optional - for OAuth)

#### Visual

```
────────  or  ────────
```

#### Specifications

```css
/* Container */
display: flex
align-items: center
margin: 24px 0
color: var(--neutral-400)
font-size: 13px
text-transform: uppercase
letter-spacing: 0.05em

/* Lines */
flex: 1
height: 1px
background: var(--neutral-200)

/* Text */
padding: 0 16px
```

---

## 5. Micro-Interactions & Animation Specifications

### 5.1 Input Focus Animation

```
Trigger: User clicks/tabs into input field
Duration: 150ms
Easing: ease-out

Sequence:
1. Border color transitions to brand-primary (150ms)
2. Background fades from neutral-50 to white (150ms)
3. Box-shadow grows from 0 to 3px ring (150ms)
```

### 5.2 Button Hover/Press

```
Hover:
- Duration: 150ms
- Transform: translateY(-1px)
- Shadow: Elevates with colored glow
- Easing: ease-out

Press/Active:
- Duration: 100ms
- Transform: translateY(0) — returns to base
- Shadow: Reduces to pressed state
- Easing: ease-in
```

### 5.3 Error Shake Animation

```
Trigger: Form submission with validation errors
Target: Entire form container or specific input

Animation:
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

Duration: 400ms
Easing: ease-in-out
```

### 5.4 Loading State Transition

```
Trigger: Form submission (valid)
Duration: Seamless transition

Button Changes:
1. Text fades out (100ms)
2. Spinner fades in (100ms)
3. Button slightly reduces opacity to 0.8
4. Cursor changes to 'wait'

Spinner:
- Size: 20px
- Border: 2px solid rgba(255,255,255,0.3)
- Border-top: 2px solid #FFFFFF
- Animation: 600ms linear infinite rotation
```

### 5.5 Page Entry Animation

```
Trigger: Page load
Target: Form container

Sequence:
1. Fade in from opacity 0 to 1 (300ms)
2. Slide up from translateY(20px) to 0 (300ms)
3. Easing: ease-out
4. Delay: 100ms (allows page structure to render first)
```

### 5.6 Success Micro-Feedback

```
Trigger: Successful login (optional, before redirect)
Duration: 400ms

Effect:
1. Green checkmark icon appears in button (200ms fade-in)
2. Button background transitions to success-500 (200ms)
3. Page fades out for redirect (200ms)
```

---

## 6. Brand Asset Integration (Left Panel)

### Visual Composition Strategy

The left panel should **sell the product** while the user authenticates. It's prime real estate for reinforcement of value proposition and trust-building.

#### 6.1 Layout Structure (Top to Bottom)

```
┌────────────────────────────────┐
│                                │
│   [Logo]                       │  ← Top: 40px padding
│                                │
│   ┌──────────────────────┐     │
│   │  VISUAL HERO         │     │  ← Middle: Primary visual
│   │  (Workflow Preview)  │     │
│   └──────────────────────┘     │
│                                │
│   "Template-First Automation   │  ← Tagline
│    for Solopreneurs"           │
│                                │
│   ─────────────────────        │  ← Social Proof
│   "10,000+ leads automated"    │
│                                │
└────────────────────────────────┘
```

### 6.2 Specific Asset Specifications

#### Logo Placement

```css
position: Absolute top-left
top: 40px
left: 40px
size: Logo height 32px (proportional width)
color: #FFFFFF (on gradient background)
```

#### Primary Visual Hero

**Option A: Animated Workflow Canvas Preview**

```
Component: Stylized React Flow miniature
Size: 400px × 360px
Position: Centered vertically and horizontally in panel
Style:
- Glassmorphism card container
- Background: rgba(255, 255, 255, 0.1)
- Backdrop-filter: blur(20px)
- Border: 1px solid rgba(255, 255, 255, 0.2)
- Border-radius: 16px
- Padding: 24px
- Box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)

Content:
- 3-4 simplified workflow nodes
- Connecting lines with animated flow (particles/dots)
- Nodes styled with white backgrounds, subtle shadows
- Icons representing: Form → Logic → Email
- Animation: Gentle floating motion (2-3px vertical oscillation, 3s duration)
```

**Option B: Abstract Automation Illustration**

```
Component: SVG illustration
Concept: Flowing streams converging into organized structure
Style:
- Gradient mesh with brand colors (Indigo → Purple)
- Subtle glow effects
- Organic curves suggesting flow automation
Size: 360px × 320px
Position: Centered in panel
```

#### Tagline Typography

```css
position: Below hero visual, 32px margin-top
font-size: 24px
font-weight: 600
line-height: 1.3
color: #FFFFFF
text-align: center
max-width: 320px
margin: 0 auto
letter-spacing: -0.01em
```

#### Social Proof Element

```
Position: Near bottom of panel (40px from bottom)
Style:
- Semi-transparent badge
- Background: rgba(255, 255, 255, 0.15)
- Padding: 12px 20px
- Border-radius: 24px (pill shape)
- Backdrop-filter: blur(10px)

Content:
- Icon: Checkmark or trending-up icon (16px, white)
- Text: "10,000+ leads automated this month"
- Font-size: 13px
- Color: rgba(255, 255, 255, 0.95)
- Font-weight: 500
```

#### Decorative Elements

**Gradient Orbs (Subtle Background Enhancement)**

```
Purpose: Add depth without clutter
Count: 2-3 large blurred circles
Size: 300-500px diameter
Opacity: 0.1-0.2
Colors: Lighter/darker variations of gradient
Position: Absolute, partially off-canvas
Filter: blur(80px)
Animation: Slow drift (30s infinite alternate)
```

---

## 7. Functional Form Layout (Right Panel)

### 7.1 Container Specifications

```css
/* Form Container */
max-width: 480px
margin: 0 auto
padding: 0 32px
min-height: 100vh
display: flex
flex-direction: column
justify-content: center
```

### 7.2 Form Content Structure (Login View)

```
┌─────────────────────────────────────┐
│                                     │
│   Welcome back                      │  ← H2 Heading
│   Enter your credentials to access  │  ← H3 Subtitle
│   your automation dashboard         │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign in with Google        │   │  ← OAuth Button (Optional)
│   └─────────────────────────────┘   │
│                                     │
│   ──────────  or  ──────────        │  ← Divider
│                                     │
│   Email address                     │  ← Label
│   ┌─────────────────────────────┐   │
│   │  you@example.com            │   │  ← Input
│   └─────────────────────────────┘   │
│                                     │
│   Password                          │
│   ┌─────────────────────────────┐   │
│   │  ••••••••••        Show     │   │  ← Password Input
│   └─────────────────────────────┘   │
│                                     │
│   [Forgot password?]                │  ← Link (right-aligned)
│                                     │
│   ┌─────────────────────────────┐   │
│   │       Sign in               │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│   Don't have an account? Sign up    │  ← Alternate Action
│                                     │
└─────────────────────────────────────┘
```

### 7.3 Form Content Structure (Sign Up View)

```
┌─────────────────────────────────────┐
│                                     │
│   Create your account               │  ← H2 Heading
│   Start automating your leads       │  ← H3 Subtitle
│   in under 10 minutes               │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign up with Google        │   │  ← OAuth Button
│   └─────────────────────────────┘   │
│                                     │
│   ──────────  or  ──────────        │
│                                     │
│   Full name                         │
│   ┌─────────────────────────────┐   │
│   │  John Smith                 │   │
│   └─────────────────────────────┘   │
│                                     │
│   Email address                     │
│   ┌─────────────────────────────┐   │
│   │  you@example.com            │   │
│   └─────────────────────────────┘   │
│                                     │
│   Password                          │
│   ┌─────────────────────────────┐   │
│   │  ••••••••••        Show     │   │
│   └─────────────────────────────┘   │
│   Must be at least 8 characters     │  ← Helper text
│                                     │
│   ┌─────────────────────────────┐   │
│   │    Create account           │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│   By signing up, you agree to our   │  ← Legal text
│   Terms of Service and Privacy      │
│   Policy                            │
│                                     │
│   Already have an account? Sign in  │
│                                     │
└─────────────────────────────────────┘
```

### 7.4 Spacing Specifications

```
Heading to Subtitle: 8px
Subtitle to OAuth button: 32px
OAuth to Divider: 24px
Divider to First Input: 24px
Between Input Groups: 20px
Input to Forgot Password: 12px
Forgot Password to Submit Button: 24px
Submit Button to Alternate Action: 24px
Legal Text font-size: 12px, color: neutral-500, line-height: 1.5
```

---

## 8. Responsive Behavior

### Breakpoint Strategy

#### Desktop (≥1024px)

- Split-screen layout maintained
- Form max-width: 480px, centered in right panel
- Brand panel: Full visual experience

#### Tablet (768px - 1023px)

- Transition to stacked layout
- Brand panel: Collapses to 200px height header
  - Logo: Left-aligned, 32px from edges
  - Tagline: Right-aligned or centered below logo
  - Visual hero: Hidden
- Form: Full-width with 48px horizontal padding

#### Mobile (<768px)

- Brand panel: Minimal 80px height
  - Logo only, centered or left-aligned
- Form: 24px horizontal padding
- Font-size adjustments:
  - H2: 28px → 24px
  - Button height: 44px → 48px (easier touch target)
  - Input height: 44px → 48px

---

## 9. Accessibility Requirements

### Keyboard Navigation

- Tab order: OAuth → Email → Password → Forgot Password → Submit → Sign Up Link
- Focus indicators: Visible 3px ring (brand-primary-light) on all interactive elements
- Enter key: Submits form when focus is on any input

### Screen Reader Support

- All inputs must have associated `<label>` elements
- Error messages: Use `aria-describedby` to link to input
- Loading state: Add `aria-busy="true"` to form during submission
- Button states: Use `aria-label` for loading ("Signing in...")

### Color Contrast

- All text must meet WCAG AA standards (4.5:1 for body, 3:1 for large text)
- Error red (#EF4444) on white background: 4.8:1 (Pass)
- Primary indigo (#4F46E5) on white: 8.6:1 (Pass)
- Placeholder text (#9CA3AF): 3.7:1 (Pass for large text, use 14px minimum)

### Focus Management

- After successful login: Focus should move to main dashboard heading
- After error: Focus should move to first invalid input

---

## 10. Error States & Validation

### Validation Timing

- **Email**: On blur (when user leaves field)
- **Password**: On blur
- **Form submission**: On submit click (if client-side validation passed)

### Error Display Strategy

#### Field-Level Errors

```
┌─────────────────────────────────────┐
│  Email address                      │
├─────────────────────────────────────┤
│  invalid-email                  ❌  │  ← Red border, error icon
└─────────────────────────────────────┘
  Please enter a valid email address     ← Error message
```

#### Form-Level Errors (Authentication Failure)

```
┌─────────────────────────────────────────┐
│  ⚠️  Invalid email or password         │
│  Please check your credentials and     │
│  try again.                            │
└─────────────────────────────────────────┘

Style:
- Background: rgba(239, 68, 68, 0.1)
- Border-left: 4px solid var(--error-500)
- Padding: 12px 16px
- Border-radius: 8px
- Margin-bottom: 20px
- Font-size: 14px
- Color: var(--error-500)
```

### Validation Rules Display

**Password Requirements (Sign Up)**

```
Below password input, show checklist:

✓ At least 8 characters
○ Contains a number (if not met)
○ Contains uppercase letter (if not met)

Style:
- Font-size: 13px
- Line-height: 1.6
- Checkmark: Green (success-500) when met
- Circle: Gray (neutral-400) when not met
- Updates in real-time as user types
```

---

## 11. Loading States

### Form Submission Loading

1. **Button transforms**:

   - Text fades to "Signing in..."
   - Spinner appears (20px, white)
   - Button remains full-width, maintains height

2. **Form interaction**:

   - All inputs become disabled (grayed out)
   - Cursor changes to wait state
   - Forgot password link disabled

3. **Duration**: Typically 500ms - 2s
   - If exceeds 2s, consider showing progress indicator

### OAuth Button Loading

- Same pattern as primary button
- Text: "Signing in with Google..."
- Google logo fades to 50% opacity

---

## 12. Success States

### Post-Login Transition

```
Option A: Instant Redirect
- No success message
- Page fades out (200ms)
- Router navigates to dashboard

Option B: Brief Confirmation
- Button shows green checkmark (300ms)
- Background color transitions to success-500
- Then fade out and redirect
- Total duration: 600ms
```

---

## 13. Design Tokens Summary (Quick Reference)

```css
/* Spacing Scale */
--space-xs: 4px --space-sm: 8px --space-md: 16px --space-lg: 24px
  --space-xl: 32px --space-2xl: 40px /* Border Radius */ --radius-sm: 6px
  --radius-md: 8px --radius-lg: 12px --radius-full: 9999px /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05) --shadow-md: 0 4px 6px
  rgba(0, 0, 0, 0.07) --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
  --shadow-brand: 0 4px 12px rgba(79, 70, 229, 0.2) /* Transitions */
  --transition-fast: 100ms ease --transition-base: 150ms ease
  --transition-slow: 300ms ease;
```

---

## 14. Implementation Checklist for Developers

When implementing this design, ensure:

- [ ] All color values use CSS custom properties (variables)
- [ ] All animations use the specified durations and easing functions
- [ ] Focus states are visible and meet accessibility standards
- [ ] Form validation provides immediate, clear feedback
- [ ] Touch targets are minimum 44×44px on mobile
- [ ] Loading states prevent double-submission
- [ ] Error messages are announced to screen readers
- [ ] The split-screen layout gracefully collapses on smaller screens
- [ ] Brand panel animations are smooth and don't impact form performance
- [ ] All text is selectable (except in buttons during loading)

---

## 15. Future Enhancement Opportunities

While not required for V1, consider these for future iterations:

1. **Magic Link Authentication**: Email-only login option
2. **Social Proof Carousel**: Rotating customer testimonials in brand panel
3. **Password Strength Meter**: Visual indicator as user types
4. **Remember Me Checkbox**: With secure token handling
5. **2FA Input Flow**: Six-digit code entry with auto-advance
6. **Dark Mode Variant**: Inverted color scheme with purple-dark brand panel
7. **Localization Support**: i18n-ready component structure

---

## Appendix: Design Rationale

### Why Split-Screen?

1. **Maximizes Prime Real Estate**: Login pages are visited repeatedly; use them to reinforce brand value
2. **Reduces Perceived Friction**: Visual interest on left makes form on right feel lighter
3. **Modern SaaS Standard**: Users expect this from professional tools (Stripe, Notion, Linear)

### Why Light Mode Primary?

1. **Approachability**: Solopreneurs need tools that feel accessible, not intimidating
2. **Differentiation**: Many automation tools default to dark; we stand out
3. **Readability**: Form inputs are easier to read on light backgrounds

### Why Glassmorphism for Brand Panel?

1. **Premium Feel**: Suggests sophisticated, modern technology
2. **Depth**: Creates visual hierarchy without clutter
3. **Trend-Forward**: Aligns with current design expectations for SaaS products

---

**End of Specification**

This document should serve as the single source of truth for implementing the FlowTrack login/authentication experience. Any deviations should be documented and approved by the design team.
