# FlowTrack Public Contact Form - UI/UX Design Specification

## 1. Visual Strategy & Brand Vibe

### Core Design Philosophy

The public contact form embodies **"Effortless Engagement"** — a balance between professional credibility and inviting simplicity. The aesthetic should communicate:

- **Trust**: Polished, enterprise-grade design that inspires confidence
- **Clarity**: Clear hierarchy, obvious action paths, zero confusion
- **Warmth**: Approachable and human, not sterile or robotic
- **Efficiency**: Streamlined experience that respects user time

### Visual Tone

**Clean, Modern, and Professional**

- Primary aesthetic: Sophisticated light design with strategic depth and subtle gradients
- NOT generic/template-like (avoid basic form builder vibe)
- NOT overly minimal/empty (avoid excessive white space)
- NOT overly decorative (avoid distracting patterns)
- **TARGET**: Premium SaaS contact experience — think HubSpot, Intercom, or Typeform

---

## 2. Layout Architecture

### Single-Column Centered Card Layout

```
┌──────────────────────────────────────────────────────────┐
│                    BACKGROUND CANVAS                      │
│                 (Subtle gradient + patterns)              │
│                                                           │
│   ┌─────────────────────────────────────────────┐        │
│   │                                             │        │
│   │         [WORKSPACE BRANDING]                │        │
│   │                                             │        │
│   │         Contact Us / Get Started            │        │
│   │         We'd love to hear from you          │        │
│   │                                             │        │
│   │   ┌──────────────────────────────────┐      │        │
│   │   │  Name                            │      │        │
│   │   │  [Input Field]                   │      │        │
│   │   └──────────────────────────────────┘      │        │
│   │                                             │        │
│   │   ┌──────────────────────────────────┐      │        │
│   │   │  Email                           │      │        │
│   │   │  [Input Field]                   │      │        │
│   │   └──────────────────────────────────┘      │        │
│   │                                             │        │
│   │   [Dynamic Fields...]                       │        │
│   │                                             │        │
│   │   ┌──────────────────────────────────┐      │        │
│   │   │       Submit                     │      │        │
│   │   └──────────────────────────────────┘      │        │
│   │                                             │        │
│   │         Powered by FlowTrack                │        │
│   │                                             │        │
│   └─────────────────────────────────────────────┘        │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Desktop Layout (≥768px)

- **Form Card**: Centered container, max-width 580px
- **Padding**: 48px internal padding for breathing room
- **Elevation**: Prominent shadow for card floating effect
- **Background**: Gradient canvas with subtle geometric patterns

### Mobile Layout (<768px)

- **Form Card**: Full viewport width, minimal horizontal margin (16px)
- **Padding**: 32px internal padding
- **Background**: Simplified gradient without patterns
- **Stacked**: All elements single-column

---

## 3. Design System Definitions

### Color Palette

#### Primary Brand Colors

```css
--brand-primary: #4f46e5 /* Indigo 600 - Primary CTA */
  --brand-primary-hover: #4338ca /* Indigo 700 - Hover states */
  --brand-primary-light: #eef2ff /* Indigo 50 - Focus rings */
  --brand-secondary: #7c3aed /* Purple 600 - Accents */;
```

#### Neutral Scale

```css
--neutral-50: #f9fafb /* Lightest background */ --neutral-100: #f3f4f6
  /* Input backgrounds */ --neutral-200: #e5e7eb /* Borders */
  --neutral-300: #d1d5db /* Disabled states */ --neutral-400: #9ca3af
  /* Placeholder text */ --neutral-500: #6b7280 /* Secondary text */
  --neutral-600: #4b5563 /* Label text */ --neutral-700: #374151 /* Body text */
  --neutral-900: #111827 /* Headings */;
```

#### Semantic Colors

```css
--success-500: #10b981 /* Green - Success states */ --success-50: #ecfdf5
  /* Success background */ --error-500: #ef4444 /* Red - Error states */
  --error-50: #fef2f2 /* Error background */;
```

#### Background Strategy

```css
--bg-canvas: Linear gradient (see below) --bg-card: #ffffff with shadow
  elevation --bg-input: #f9fafb (neutral-50) --bg-input-focus: #ffffff;
```

**Canvas Gradient**:

```css
background: linear-gradient(135deg, #eef2ff 0%, #f3e8ff 100%);
/* Indigo-50 to Purple-100 — subtle brand reinforcement */

/* Alternative Option: More neutral */
background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #eef2ff 100%);
```

**Geometric Pattern Overlay** (Optional Enhancement):

```css
/* Subtle dot grid or line pattern */
background-image: radial-gradient(
  circle at 1px 1px,
  rgba(79, 70, 229, 0.03) 1px,
  transparent 0
);
background-size: 32px 32px;
background-position:
  0 0,
  16px 16px;
```

### Typography

#### Font Stack

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  'Roboto',
  sans-serif;
```

#### Type Scale & Hierarchy

**H1 - Main Form Heading**

```css
font-size: 32px
font-weight: 700 (Bold)
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
margin-bottom: 8px
```

**H2 - Subheading / Description**

```css
font-size: 17px
font-weight: 400 (Regular)
line-height: 1.5
color: var(--neutral-600)
margin-bottom: 32px
```

**Label - Input Labels**

```css
font-size: 14px
font-weight: 500 (Medium)
line-height: 1.4
color: var(--neutral-700)
margin-bottom: 8px
display: block
```

**Input Text**

```css
font-size: 15px
font-weight: 400
line-height: 1.5
color: var(--neutral-900)
```

**Placeholder Text**

```css
font-size: 15px
font-weight: 400
color: var(--neutral-400)
```

**Helper Text / Error Messages**

```css
font-size: 13px
font-weight: 400
line-height: 1.5
color: var(--neutral-500) /* or error-500 for errors */
margin-top: 6px
```

**Footer Branding**

```css
font-size: 13px
font-weight: 400
color: var(--neutral-400)
text-align: center
```

---

## 4. Component Specifications

### 4.1 Form Card Container

#### Visual Structure

```css
/* Card Container */
max-width: 580px
width: 100%
margin: 0 auto
background: #FFFFFF
border-radius: 16px
padding: 48px
box-shadow:
  0 4px 6px rgba(0, 0, 0, 0.02),
  0 10px 25px rgba(0, 0, 0, 0.05),
  0 20px 40px rgba(79, 70, 229, 0.08);
/* Multi-layered shadow for depth */

/* Mobile Adjustments */
@media (max-width: 768px) {
  padding: 32px 24px;
  border-radius: 12px;
  margin: 16px;
}
```

#### Top Border Accent (Optional Enhancement)

```css
border-top: 4px solid transparent;
border-image: linear-gradient(90deg, #4f46e5, #7c3aed) 1;
/* Subtle brand accent at top of card */
```

### 4.2 Workspace Branding Section

#### Visual Structure

```
┌─────────────────────────────────┐
│   [LOGO or ICON]  Workspace     │
│   ────────────────────────      │
└─────────────────────────────────┘
```

#### Specifications

```css
/* Container */
margin-bottom: 32px
text-align: center
padding-bottom: 24px
border-bottom: 1px solid var(--neutral-100)

/* Workspace Logo (if available) */
width: 48px
height: 48px
border-radius: 12px
margin: 0 auto 12px
object-fit: cover
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08)

/* Workspace Name */
font-size: 18px
font-weight: 600
color: var(--neutral-800)
margin-bottom: 4px

/* Optional Tagline */
font-size: 14px
color: var(--neutral-500)
```

**Fallback Design** (No logo provided):

```css
/* Badge-style workspace initial */
width: 56px
height: 56px
border-radius: 16px
background: linear-gradient(135deg, #4F46E5, #7C3AED)
display: flex
align-items: center
justify-content: center
margin: 0 auto 16px

/* Initial Letter */
font-size: 24px
font-weight: 700
color: #FFFFFF
text-transform: uppercase
```

### 4.3 Form Header

#### Specifications

```css
/* Heading */
font-size: 32px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
margin-bottom: 8px
text-align: center

@media (max-width: 768px) {
  font-size: 28px
}

/* Subtitle/Description */
font-size: 17px
font-weight: 400
line-height: 1.5
color: var(--neutral-600)
margin-bottom: 32px
text-align: center

@media (max-width: 768px) {
  font-size: 16px
  margin-bottom: 28px
}
```

**Content Examples**:

- **Heading**: "Get in Touch" | "Contact Us" | "Let's Talk" | "Request a Demo"
- **Subtitle**: "Fill out the form below and we'll get back to you within 24 hours" | "We'd love to hear from you"

### 4.4 Input Fields (All Types)

#### Base Input Specifications

```css
/* Container */
margin-bottom: 24px

/* Label */
display: block
font-size: 14px
font-weight: 500
line-height: 1.4
color: var(--neutral-700)
margin-bottom: 8px

/* Required Indicator */
color: var(--error-500)
margin-left: 2px
```

**Text Input / Email / Phone / URL**

```css
/* Input Field */
width: 100%
height: 48px
padding: 0 16px
font-size: 15px
font-weight: 400
color: var(--neutral-900)
background: var(--neutral-50)
border: 1.5px solid var(--neutral-200)
border-radius: 10px
transition: all 0.2s ease

/* Placeholder */
color: var(--neutral-400)

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 4px var(--brand-primary-light)
/* Larger focus ring for better visibility */

/* Error State */
border-color: var(--error-500)
background: var(--error-50)
box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1)

/* Disabled State */
background: var(--neutral-100)
color: var(--neutral-400)
cursor: not-allowed
border-color: var(--neutral-200)
```

**Textarea Field**

```css
/* Extends base input styles */
height: 120px
padding: 14px 16px
resize: vertical
min-height: 120px
max-height: 300px
line-height: 1.6
```

**Number Input**

```css
/* Same as text input */
/* Consider adding increment/decrement buttons styling */

/* Remove default spinners on Firefox */
-moz-appearance: textfield;

/* Remove default spinners on WebKit */
&::-webkit-inner-spin-button,
&::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

**Select Dropdown**

```css
/* Base input styling + */
padding-right: 40px
appearance: none
background-image: url("data:image/svg+xml,..."); /* Custom chevron icon */
background-repeat: no-repeat
background-position: right 16px center
background-size: 16px
cursor: pointer

/* Custom option styling via library (e.g., Headless UI) */
```

**Checkbox Input**

```css
/* Container */
display: flex
align-items: flex-start
margin-bottom: 20px

/* Checkbox */
width: 20px
height: 20px
min-width: 20px
border: 1.5px solid var(--neutral-300)
border-radius: 6px
background: #FFFFFF
cursor: pointer
transition: all 0.15s ease
margin-right: 12px
margin-top: 2px

/* Checked State */
background: var(--brand-primary)
border-color: var(--brand-primary)
/* Checkmark icon centered */

/* Focus State */
box-shadow: 0 0 0 4px var(--brand-primary-light)
outline: none

/* Label */
font-size: 15px
line-height: 1.5
color: var(--neutral-700)
cursor: pointer
```

**Date Input**

```css
/* Extends base input */
/* Calendar icon positioned at right */
background-image: url("data:image/svg+xml,..."); /* Calendar icon */
background-repeat: no-repeat
background-position: right 16px center
background-size: 18px
padding-right: 44px

/* Override browser default date picker styling where possible */
```

#### Error Message Display

```css
/* Error Text */
display: flex
align-items: flex-start
margin-top: 8px
font-size: 13px
line-height: 1.5
color: var(--error-500)

/* Icon */
margin-right: 6px
flex-shrink: 0
width: 16px
height: 16px
```

#### Helper Text Display

```css
/* Helper Text */
display: block
margin-top: 6px
font-size: 13px
line-height: 1.5
color: var(--neutral-500)
```

### 4.5 Submit Button

#### Specifications

```css
/* Base State */
width: 100%
height: 52px
padding: 0 32px
font-size: 16px
font-weight: 600
color: #FFFFFF
background: linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)
border: none
border-radius: 10px
cursor: pointer
transition: all 0.2s ease
margin-top: 32px
box-shadow:
  0 2px 4px rgba(79, 70, 229, 0.15),
  0 4px 12px rgba(79, 70, 229, 0.1);

/* Hover State */
transform: translateY(-2px)
box-shadow:
  0 4px 8px rgba(79, 70, 229, 0.2),
  0 8px 20px rgba(79, 70, 229, 0.15);
background: linear-gradient(135deg, #4338CA 0%, #3730A3 100%)

/* Active/Pressed State */
transform: translateY(0)
box-shadow:
  0 1px 2px rgba(79, 70, 229, 0.15),
  0 2px 6px rgba(79, 70, 229, 0.1);

/* Loading State */
position: relative
cursor: wait
opacity: 0.9

/* Loading Spinner */
/* Replace text with centered spinner */
/* Size: 24px, color: white */
animation: spin 0.6s linear infinite

/* Disabled State */
background: var(--neutral-300)
color: var(--neutral-500)
cursor: not-allowed
transform: none
box-shadow: none
```

**Button Text Variations**:

- Default: "Submit" | "Send Message" | "Get Started"
- Loading: "Submitting..." (with spinner)
- Success: "Sent!" (with checkmark icon)

### 4.6 Footer Branding

#### Specifications

```css
/* Container */
margin-top: 32px
padding-top: 24px
border-top: 1px solid var(--neutral-100)
text-align: center

/* Text */
font-size: 13px
font-weight: 400
color: var(--neutral-400)
display: flex
align-items: center
justify-content: center
gap: 6px

/* Link to FlowTrack */
color: var(--brand-primary)
text-decoration: none
font-weight: 500
transition: color 0.15s ease

/* Hover */
color: var(--brand-primary-hover)
text-decoration: underline

/* FlowTrack Logo Icon */
width: 16px
height: 16px
opacity: 0.7
```

**Content**:

```html
Powered by <a href="https://flowtrack.com">FlowTrack</a>
```

---

## 5. Micro-Interactions & Animations

### 5.1 Page Load Animation

```css
Trigger: Component mount
Target: Form card
Duration: 400ms
Easing: cubic-bezier(0.16, 1, 0.3, 1) /* Smooth ease-out */

Sequence:
1. Initial state: opacity 0, translateY(30px), scale(0.98)
2. Animate to: opacity 1, translateY(0), scale(1)
3. Delay: 150ms (allows background to render first)
```

### 5.2 Input Focus Flow

```css
Trigger: User focuses input field
Duration: 200ms
Easing: ease-out

Sequence:
1. Border color: neutral-200 → brand-primary (200ms)
2. Background: neutral-50 → white (200ms)
3. Box-shadow: 0 → 4px ring (200ms)
4. Label color: neutral-700 → brand-primary (200ms) [Optional enhancement]
```

### 5.3 Field Validation Animation

```css
/* Success State */
Trigger: Valid input on blur
Duration: 300ms

Effect:
1. Green checkmark icon fades in at right edge of input (200ms)
2. Subtle green border pulse (300ms)

/* Error State */
Trigger: Invalid input on blur
Duration: 400ms

Effect:
1. Input shakes horizontally (400ms)
2. Error message slides down from top (300ms)
3. Error icon appears with bounce (250ms)

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 5.4 Submit Button States

```css
/* Hover Animation */
Duration: 200ms
Easing: ease-out
Effect: Lift + glow enhancement

/* Click/Press Animation */
Duration: 100ms
Easing: ease-in
Effect: Depress back to surface

/* Loading Transition */
Trigger: Form submission start
Duration: 300ms

Sequence:
1. Button text fades out (150ms)
2. Spinner fades in (150ms, starts at 150ms)
3. Button width optionally narrows to square (300ms) [Advanced]
```

### 5.5 Success State Animation

```css
Trigger: Successful form submission
Duration: 1000ms total

Sequence:
1. Form fields fade out (300ms)
2. Success message fades in (300ms, starts at 200ms)
3. Confetti particles (optional) (500ms)
4. Checkmark icon scales in with bounce (400ms)

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
```

### 5.6 Field Auto-Complete Highlight

```css
Trigger: Browser autofills field
Duration: 200ms

Effect:
/* Override browser yellow background */
animation: autofillFade 0.2s ease-out

@keyframes autofillFade {
  from {
    background: rgba(79, 70, 229, 0.1);
  }
  to {
    background: var(--neutral-50);
  }
}

/* Apply via :-webkit-autofill pseudo-class */
```

---

## 6. Dynamic Field Type Rendering

The form must gracefully handle **dynamic fields** from the API. Each field type has specific rendering requirements.

### 6.1 Field Type Matrix

| Field Type | Component                 | Icon       | Validation          |
| ---------- | ------------------------- | ---------- | ------------------- |
| TEXT       | `<input type="text">`     | None       | Max length, pattern |
| EMAIL      | `<input type="email">`    | Mail icon  | Email format        |
| PHONE      | `<input type="tel">`      | Phone icon | Phone pattern       |
| NUMBER     | `<input type="number">`   | Hash icon  | Min/max, integer    |
| URL        | `<input type="url">`      | Link icon  | URL format          |
| TEXTAREA   | `<textarea>`              | None       | Max length          |
| DROPDOWN   | `<select>` or custom      | Chevron    | Required selection  |
| CHECKBOX   | `<input type="checkbox">` | None       | Boolean             |
| DATE       | `<input type="date">`     | Calendar   | Date range          |

### 6.2 Dynamic Rendering Logic

```tsx
function renderField(field: FormField) {
  const baseProps = {
    id: field.id,
    name: field.fieldKey,
    required: field.isRequired,
    placeholder: field.placeholder,
    'aria-describedby': field.helpText ? `${field.id}-help` : undefined,
  };

  switch (field.fieldType) {
    case 'EMAIL':
      return <EmailInput {...baseProps} icon={<MailIcon />} />;

    case 'TEXTAREA':
      return <TextareaInput {...baseProps} rows={4} />;

    case 'DROPDOWN':
      return (
        <SelectInput {...baseProps} options={field.options}>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </SelectInput>
      );

    case 'CHECKBOX':
      return <CheckboxInput {...baseProps} label={field.label} />;

    case 'DATE':
      return (
        <DateInput
          {...baseProps}
          min={field.validationRules?.minDate}
          max={field.validationRules?.maxDate}
        />
      );

    default:
      return <TextInput {...baseProps} />;
  }
}
```

### 6.3 Field Order & Grouping

```css
/* Standard field flow */
display: flex
flex-direction: column
gap: 24px

/* Two-column layout for short fields (optional) */
@media (min-width: 768px) {
  /* When two consecutive short fields (e.g., First Name, Last Name) */
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 16px

  /* Field types eligible for two-column: TEXT, NUMBER, PHONE */
  /* Exclude: TEXTAREA, DROPDOWN, CHECKBOX, DATE */
}
```

---

## 7. Success State Design

### 7.1 Success Message Component

```
┌─────────────────────────────────────┐
│                                     │
│         ✓  Success!                 │
│                                     │
│   Thank you for reaching out!       │
│   We'll get back to you soon.       │
│                                     │
│   [Return to Homepage]              │
│                                     │
└─────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
text-align: center
padding: 48px 32px
animation: fadeIn 0.4s ease-out

/* Success Icon */
width: 72px
height: 72px
margin: 0 auto 24px
background: linear-gradient(135deg, #10B981 0%, #059669 100%)
border-radius: 50%
display: flex
align-items: center
justify-content: center
box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3)
animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Checkmark inside */
color: #FFFFFF
width: 36px
height: 36px
stroke-width: 3

/* Heading */
font-size: 28px
font-weight: 700
color: var(--neutral-900)
margin-bottom: 12px

/* Subtitle */
font-size: 16px
line-height: 1.5
color: var(--neutral-600)
margin-bottom: 28px

/* Optional CTA */
display: inline-block
padding: 12px 24px
font-size: 15px
font-weight: 500
color: var(--brand-primary)
background: var(--brand-primary-light)
border-radius: 8px
text-decoration: none
transition: all 0.2s ease

/* CTA Hover */
background: var(--brand-primary)
color: #FFFFFF
```

### 7.2 Success Animation Sequence

```css
Total Duration: 1200ms

Timeline:
0ms - 300ms:  Form fields fade out
300ms - 500ms: Success container fades in
400ms - 800ms: Success icon bounces in
600ms - 900ms: Text content fades in
900ms - 1200ms: Optional confetti particles (if enabled)
```

---

## 8. Error State Design

### 8.1 Inline Field Errors

```
┌─────────────────────────────────────┐
│  Email                              │
├─────────────────────────────────────┤
│  invalid-email              ❌      │ ← Red border
└─────────────────────────────────────┘
  ⚠️ Please enter a valid email address  ← Error message
```

#### Specifications

```css
/* Error Message Container */
display: flex
align-items: flex-start
margin-top: 8px
gap: 6px

/* Error Icon */
width: 16px
height: 16px
color: var(--error-500)
flex-shrink: 0
margin-top: 2px

/* Error Text */
font-size: 13px
line-height: 1.5
color: var(--error-500)
font-weight: 400
```

### 8.2 Form-Level Error Banner

```
┌─────────────────────────────────────────┐
│  ⚠️  Please fix the errors below        │
│  Some fields need your attention        │
└─────────────────────────────────────────┘
```

#### Specifications

```css
/* Banner Container */
background: rgba(239, 68, 68, 0.08)
border-left: 4px solid var(--error-500)
border-radius: 8px
padding: 14px 18px
margin-bottom: 24px
display: flex
align-items: flex-start
gap: 12px
animation: slideDown 0.3s ease-out

/* Icon */
width: 20px
height: 20px
color: var(--error-500)
flex-shrink: 0
margin-top: 2px

/* Text Container */
flex: 1

/* Heading */
font-size: 14px
font-weight: 600
color: var(--error-500)
margin-bottom: 2px

/* Description */
font-size: 13px
color: var(--neutral-700)
line-height: 1.5
```

---

## 9. Loading States

### 9.1 Initial Page Load

```css
/* Skeleton Loader */
Target: Form fields before data loads

Implementation:
- Show shimmer placeholder boxes
- Maintain layout structure
- Pulse animation

Shimmer Effect:
background: linear-gradient(
  90deg,
  var(--neutral-100) 0%,
  var(--neutral-50) 50%,
  var(--neutral-100) 100%
)
background-size: 200% 100%
animation: shimmer 1.5s ease-in-out infinite

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### 9.2 Form Submission Loading

```css
Trigger: Submit button clicked
Duration: Until response received

Button Changes:
1. Text fades out (150ms)
2. Spinner fades in (150ms)
3. Button disabled (pointer-events: none)
4. Opacity: 0.9

Form Changes:
1. All inputs disabled
2. Cursor: wait on entire form
3. Slight opacity reduction (0.7) on fields

Spinner Specifications:
width: 24px
height: 24px
border: 3px solid rgba(255, 255, 255, 0.3)
border-top-color: #FFFFFF
border-radius: 50%
animation: spin 0.6s linear infinite

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

---

## 10. Responsive Behavior

### 10.1 Breakpoint Strategy

#### Desktop (≥768px)

- Form card: max-width 580px, centered
- Padding: 48px
- Two-column layout for compatible fields
- Prominent shadows for elevation
- Full gradient background with patterns

#### Tablet (600px - 767px)

- Form card: max-width 560px
- Padding: 40px
- Single-column layout
- Reduced shadow elevation
- Simplified background gradient

#### Mobile (<600px)

- Form card: Full-width with 16px margin
- Padding: 32px 24px
- Single-column layout
- Input height: 48px → 52px (better touch targets)
- Button height: 52px → 56px
- Simplified background (solid or minimal gradient)
- Reduced font sizes:
  - H1: 32px → 26px
  - H2: 17px → 16px
  - Input: 15px (maintain)

### 10.2 Touch Optimization

```css
@media (max-width: 768px) {
  /* Minimum touch target: 48x48px */
  input,
  button,
  select {
    min-height: 52px;
  }

  /* Increase button padding for easier tapping */
  button {
    height: 56px;
    font-size: 16px;
  }

  /* Prevent iOS zoom on focus */
  input,
  select,
  textarea {
    font-size: 16px; /* Minimum to prevent auto-zoom */
  }

  /* Larger tap targets for checkboxes */
  input[type='checkbox'] {
    width: 24px;
    height: 24px;
  }
}
```

---

## 11. Accessibility Requirements

### 11.1 Keyboard Navigation

- **Tab order**: Follows visual flow (top to bottom)
- **Focus indicators**: Visible 4px ring on all interactive elements
- **Enter key**: Submits form from any input field
- **Escape key**: Clears focused input (optional enhancement)

```css
/* Focus Ring */
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px var(--brand-primary-light);
  border-color: var(--brand-primary);
}
```

### 11.2 Screen Reader Support

```html
<!-- Proper label association -->
<label for="email">Email address</label>
<input id="email" type="email" aria-required="true" />

<!-- Error announcement -->
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert"> Please enter a valid email address </span>

<!-- Form status announcement -->
<div role="status" aria-live="polite" aria-atomic="true">
  Form submitted successfully
</div>

<!-- Loading state -->
<button type="submit" aria-busy="true" aria-label="Submitting form">
  <span aria-hidden="true">Submitting...</span>
</button>
```

### 11.3 Color Contrast

All text must meet **WCAG AA** standards (4.5:1 ratio for normal text, 3:1 for large text):

- Neutral-900 on white: 16.4:1 ✓ (Headings)
- Neutral-700 on white: 10.7:1 ✓ (Body text)
- Neutral-600 on white: 7.5:1 ✓ (Labels)
- Neutral-500 on white: 4.9:1 ✓ (Helper text)
- Neutral-400 on white: 3.3:1 ⚠️ (Placeholder - use 15px minimum)
- Error-500 on white: 4.8:1 ✓
- Brand-primary on white: 8.6:1 ✓

### 11.4 ARIA Attributes

```html
<!-- Required fields -->
<input required aria-required="true" />

<!-- Invalid fields -->
<input aria-invalid="true" aria-describedby="error-id" />

<!-- Field descriptions -->
<input aria-describedby="help-text-id" />
<span id="help-text-id">Must be a valid email address</span>

<!-- Form status -->
<form aria-busy="true"><!-- During submission --></form>
```

---

## 12. Validation Rules & Timing

### 12.1 Validation Strategy

**On Blur (Recommended)**:

- Validate when user leaves field
- Immediate feedback without interrupting typing
- Best UX for most field types

**On Submit**:

- Final validation check before submission
- Show all errors at once if validation fails
- Focus first invalid field

**Real-Time (Optional)**:

- For password strength indicators
- For character count on textareas
- For email format hints

### 12.2 Validation Rules by Field Type

#### EMAIL

```javascript
Rules:
- Format: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Not empty (if required)
- Max length: 254 characters

Error Messages:
- Empty: "Email is required"
- Invalid format: "Please enter a valid email address"
- Example: "e.g., you@example.com"
```

#### TEXT

```javascript
Rules:
- Min length (if specified)
- Max length (if specified)
- Pattern matching (if specified)
- No leading/trailing whitespace

Error Messages:
- Empty: "[Field name] is required"
- Too short: "Must be at least X characters"
- Too long: "Must be no more than X characters"
- Invalid pattern: "[Custom message from API]"
```

#### PHONE

```javascript
Rules:
- Format: Flexible international support
- Recommended: Use library like libphonenumber-js
- Allow various formats: (123) 456-7890, +1-123-456-7890, etc.

Error Messages:
- Invalid: "Please enter a valid phone number"
- Example: "e.g., (555) 123-4567"
```

#### NUMBER

```javascript
Rules:
- Numeric only
- Min value (if specified)
- Max value (if specified)
- Integer only (if specified)

Error Messages:
- Non-numeric: "Please enter a number"
- Too small: "Must be at least X"
- Too large: "Must be no more than X"
```

#### URL

```javascript
Rules:
- Format: Valid URL with protocol
- Pattern: /^https?:\/\/.+/

Error Messages:
- Invalid: "Please enter a valid URL"
- Example: "e.g., https://example.com"
```

#### DROPDOWN

```javascript
Rules:
- Must select option (if required)
- Option must exist in provided list

Error Messages:
- Empty: "Please select an option"
```

#### CHECKBOX

```javascript
Rules:
- Must be checked (if required)
- Boolean value

Error Messages:
- Unchecked: "Please check this box to continue"
```

#### DATE

```javascript
Rules:
- Valid date format
- Min date (if specified)
- Max date (if specified)
- Not in past (if specified)

Error Messages:
- Invalid format: "Please enter a valid date"
- Too early: "Date must be after X"
- Too late: "Date must be before X"
```

---

## 13. Performance Optimizations

### 13.1 Image Optimization

- Workspace logos: Max 200KB, WebP format with JPG fallback
- Icons: Inline SVG for better performance
- Background patterns: CSS-generated or lightweight SVG

### 13.2 Animation Performance

```css
/* Use transform and opacity for animations (GPU-accelerated) */
/* Avoid animating: width, height, top, left */

/* Example: Good */
.animate-in {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

/* Example: Avoid */
.animate-in-bad {
  height: 0;
  top: 20px;
  transition:
    height 0.3s ease,
    top 0.3s ease;
}

/* Reduce animations on low-end devices */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 13.3 Loading Strategy

- Critical CSS inline in `<head>`
- Defer non-critical fonts
- Lazy-load workspace logo if large
- Preconnect to API domain

```html
<link rel="preconnect" href="https://api.flowtrack.com" />
<link rel="dns-prefetch" href="https://api.flowtrack.com" />
```

---

## 14. Field-Specific Enhancements

### 14.1 Email Input

```tsx
<div className="relative">
  <input
    type="email"
    placeholder="you@example.com"
    className="pl-12" /* Space for icon */
  />
  <MailIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />

  {/* Optional: Real-time domain suggestion */}
  {typedValue.includes('@') && !typedValue.includes('.') && (
    <span className="mt-1 text-xs text-neutral-400">
      Did you mean @gmail.com?
    </span>
  )}
</div>
```

### 14.2 Phone Input

```tsx
{
  /* Consider using react-phone-number-input library */
}
<PhoneInput
  country="US" /* Default country from API or geo-detection */
  placeholder="+1 (555) 000-0000"
  className="custom-phone-input"
  international
  countryCallingCodeEditable={false}
/>;
```

### 14.3 Textarea with Character Count

```tsx
<div className="relative">
  <textarea
    maxLength={500}
    placeholder="Tell us more..."
    onChange={(e) => setCharCount(e.target.value.length)}
  />
  <div className="mt-2 text-right text-xs text-neutral-400">
    {charCount} / 500 characters
  </div>
</div>
```

### 14.4 Dropdown with Search

```tsx
{
  /* For long option lists, use Headless UI Combobox */
}
<Combobox value={selected} onChange={setSelected}>
  <Combobox.Input
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search or select..."
  />
  <Combobox.Options>
    {filteredOptions.map((option) => (
      <Combobox.Option key={option.value} value={option}>
        {option.label}
      </Combobox.Option>
    ))}
  </Combobox.Options>
</Combobox>;
```

---

## 15. Advanced Features (Optional Enhancements)

### 15.1 Progressive Disclosure

For forms with many fields, consider multi-step approach:

```
Step 1: Essential info (Name, Email)
  ↓
Step 2: Additional details
  ↓
Step 3: Preferences/Options
```

**Step Indicator**:

```css
/* Progress bar */
height: 4px
background: var(--neutral-200)
border-radius: 2px
margin-bottom: 32px

/* Progress fill */
background: var(--brand-primary)
transition: width 0.3s ease

/* Step dots */
display: flex
justify-content: space-between
```

### 15.2 Conditional Fields

```tsx
{
  /* Show field based on previous answer */
}
{
  formData.industry === 'Other' && (
    <TextInput
      label="Please specify"
      name="industry_other"
      placeholder="Enter your industry"
    />
  );
}
```

### 15.3 Smart Defaults

- Pre-fill email if user came from email link (UTM parameter)
- Remember form data in localStorage (privacy-safe fields only)
- Geo-detect phone country code
- Auto-capitalize name fields

### 15.4 File Upload Field

```tsx
<div className="hover:border-brand-primary rounded-lg border-2 border-dashed border-neutral-200 p-6 text-center transition">
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    className="hidden"
    id="file-upload"
  />
  <label htmlFor="file-upload" className="cursor-pointer">
    <UploadIcon className="mx-auto mb-2 h-8 w-8 text-neutral-400" />
    <p className="text-sm text-neutral-600">Click to upload or drag and drop</p>
    <p className="mt-1 text-xs text-neutral-400">PDF, DOC, or DOCX (max 5MB)</p>
  </label>
</div>
```

---

## 16. Edge Cases & Error Handling

### 16.1 Network Errors

```tsx
{
  /* Network failure during submission */
}
<div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
  <div className="flex items-start">
    <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 text-red-500" />
    <div>
      <h4 className="font-semibold text-red-800">Submission Failed</h4>
      <p className="mt-1 text-sm text-red-700">
        Unable to connect. Please check your internet connection and try again.
      </p>
      <button
        onClick={retrySubmission}
        className="mt-2 text-sm font-medium text-red-600 underline"
      >
        Retry
      </button>
    </div>
  </div>
</div>;
```

### 16.2 Server-Side Validation Errors

```tsx
{
  /* API returns field-level errors */
}
{
  serverErrors.email && (
    <p className="text-error-500 mt-1 text-sm">
      {serverErrors.email} {/* e.g., "Email already exists" */}
    </p>
  );
}
```

### 16.3 Rate Limiting

```tsx
{
  /* Too many submissions */
}
<div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
  <p className="text-amber-800">
    Please wait {timeRemaining} seconds before submitting again.
  </p>
</div>;
```

### 16.4 Offline Detection

```tsx
{
  /* Show banner when offline */
}
{
  !isOnline && (
    <div className="mb-4 rounded border-l-4 border-neutral-400 bg-neutral-100 p-3">
      <p className="text-sm text-neutral-700">
        ⚠️ You are currently offline. Form will submit when connection is
        restored.
      </p>
    </div>
  );
}
```

---

## 17. Testing Checklist

### 17.1 Functional Testing

- [ ] All field types render correctly
- [ ] Validation works for each field type
- [ ] Required fields prevent submission
- [ ] Success message displays after submission
- [ ] Error messages display for invalid inputs
- [ ] Form clears after successful submission (or retains, based on UX decision)
- [ ] Submit button disables during submission (prevents double-submit)

### 17.2 Visual Testing

- [ ] Consistent spacing between elements
- [ ] Proper alignment on all screen sizes
- [ ] Icons display correctly in all states
- [ ] Focus rings visible and styled
- [ ] Error states visually distinct
- [ ] Success state visually appealing
- [ ] Animations smooth (60fps)

### 17.3 Accessibility Testing

- [ ] Keyboard navigation works (Tab, Shift+Tab, Enter)
- [ ] Screen reader announces all elements correctly
- [ ] Focus indicators meet WCAG standards
- [ ] Color contrast passes WCAG AA
- [ ] All interactive elements have labels
- [ ] Error messages linked to inputs (aria-describedby)

### 17.4 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 17.5 Performance Testing

- [ ] Page loads in under 2 seconds
- [ ] Animations don't cause jank
- [ ] Form submission responds within 1 second (or shows loading state)
- [ ] No layout shift (CLS < 0.1)
- [ ] Lighthouse score > 90

---

## 18. Design Tokens Summary

```css
/* Spacing */
--space-xs:
  4px --space-sm: 8px --space-md: 12px --space-lg: 16px --space-xl: 24px
    --space-2xl: 32px --space-3xl: 48px /* Border Radius */ --radius-sm: 6px
    --radius-md: 8px --radius-lg: 10px --radius-xl: 12px --radius-2xl: 16px
    --radius-full: 9999px /* Shadows */ --shadow-xs: 0 1px 2px
    rgba(0, 0, 0, 0.05) --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05)
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05),
  0 10px 15px rgba(0, 0, 0, 0.05) --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.08),
  0 20px 40px rgba(0, 0, 0, 0.08) --shadow-brand: 0 4px 12px
    rgba(79, 70, 229, 0.15) --shadow-card: 0 4px 6px rgba(0, 0, 0, 0.02),
  0 10px 25px rgba(0, 0, 0, 0.05),
  0 20px 40px rgba(79, 70, 229, 0.08) /* Transitions */ --transition-fast: 100ms
    cubic-bezier(0.4, 0, 0.2, 1) --transition-base: 200ms
    cubic-bezier(0.4, 0, 0.2, 1) --transition-slow: 300ms
    cubic-bezier(0.4, 0, 0.2, 1) --transition-bounce: 400ms
    cubic-bezier(0.68, -0.55, 0.265, 1.55) /* Z-Index Scale */ --z-base: 1
    --z-dropdown: 1000 --z-sticky: 1100 --z-modal: 1200 --z-toast: 1300;
```

---

## 19. Implementation Priority

### Phase 1: MVP (Required for Launch)

1. Basic form card with gradient background
2. All dynamic field types (TEXT, EMAIL, TEXTAREA, DROPDOWN, etc.)
3. Client-side validation with error messages
4. Submit button with loading state
5. Success message display
6. Mobile responsive layout
7. Basic accessibility (labels, ARIA)

### Phase 2: Enhanced UX

1. Smooth animations (page load, field focus, errors)
2. Field icons and visual enhancements
3. Advanced validation (real-time feedback)
4. Improved error state design
5. Better branding integration (workspace logo)
6. Footer branding with FlowTrack link

### Phase 3: Advanced Features

1. Multi-step forms (if needed)
2. Conditional field logic
3. File upload support
4. Auto-save drafts (localStorage)
5. Geo-detection for phone country codes
6. Smart defaults and pre-filling

---

## Appendix: Design Rationale

### Why Centered Card Layout?

1. **Focus**: Removes distractions, directs attention to form
2. **Trust**: Professional, polished appearance builds credibility
3. **Flexibility**: Works well embedded in any website
4. **Modern**: Aligns with current SaaS design standards

### Why Gradient Background?

1. **Brand Reinforcement**: Subtle use of brand colors without overwhelming
2. **Depth**: Creates visual interest without clutter
3. **Differentiation**: Stands out from basic white-background forms
4. **Premium Feel**: Elevates perceived quality

### Why Larger Input Heights?

1. **Touch-Friendly**: Easier to tap on mobile devices
2. **Readability**: More comfortable to read and edit
3. **Modern Standard**: Aligns with contemporary UI patterns
4. **Accessibility**: Easier target for users with motor difficulties

### Why Rounded Corners?

1. **Friendly**: Softer, more approachable than sharp corners
2. **Modern**: Current design trend across web apps
3. **Brand Consistency**: Matches FlowTrack's overall design language

---

**End of Specification**

This document serves as the comprehensive guide for implementing the FlowTrack public contact form. It should be referenced during development and used as the source of truth for all design decisions.
