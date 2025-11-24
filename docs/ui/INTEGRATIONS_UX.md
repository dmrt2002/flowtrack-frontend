# FlowTrack Calendar Settings Screen - UI/UX Design Specification

> **Recent Update (2025-11-24)**: Simplified to focus on Calendly integration only. Gmail integration has been removed from the onboarding flow. The screen now provides a streamlined calendar setup experience.

## 1. Visual Strategy & Design Philosophy

### Core Design Philosophy

The calendar settings screen should embody **"Simple & Optional"** — creating a straightforward experience for users to optionally configure their Calendly link without friction. The aesthetic should communicate:

- **Simplicity**: Single-purpose screen focused on one clear action
- **Flexibility**: Calendar setup is completely optional
- **Guidance**: Clear instructions on where to find Calendly links
- **Progress**: User knows they can skip and continue anytime

### Visual Tone

**Clean & Focused**

- Maintains consistency with onboarding flow design system
- Emphasizes optional nature without pressure
- Uses visual hierarchy to show benefits without requiring action
- Balances encouragement (connect for better experience) with flexibility (skip is always available)

---

## 2. Layout Architecture

### Single-Column Centered Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                 HEADER & NAVIGATION                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│              CALENDLY CARD (Centered)                   │
│                                                         │
│         ┌─────────────────────────────────┐             │
│         │   Calendly Link                 │             │
│         │   (Optional)                    │             │
│         └─────────────────────────────────┘             │
│                                                         │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 BOTTOM ACTION BAR                       │
└─────────────────────────────────────────────────────────┘
```

### Desktop/Tablet Layout (≥768px)

- **Content Container**: Max-width 800px, centered
- **Card Width**: Full container width
- **Action Bar**: Fixed at bottom, full-width with max-width container

### Mobile Layout (<768px)

- **Content**: 16px horizontal padding
- **Card**: Full-width, responsive padding (16px)
- **Input/Button**: Stack vertically for better mobile UX
- **Action Bar**: Stacked buttons with full width

---

## 3. Design System Alignment

### Color Palette (Inherited from Onboarding)

#### Primary Brand Colors

```
--brand-primary: #4F46E5        /* Indigo 600 */
--brand-primary-hover: #4338CA  /* Indigo 700 */
--brand-primary-light: #EEF2FF  /* Indigo 50 */
--brand-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
```

#### Integration-Specific Colors

```
--calendly-blue: #006BFF        /* Calendly brand blue */
--calendly-bg: #EFF6FF          /* Light blue background */
--success-green: #10B981        /* Success states */
--success-bg: #D1FAE5           /* Success background */
```

#### Semantic Colors

```
--optional-gray: #6B7280        /* Optional badge */
--error-red: #EF4444            /* Error states */
```

### Typography (Inherited)

```css
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  sans-serif;
```

#### Hierarchy for Calendar Settings Screen

**Page Title (H1)**

```
font-size: 32px (mobile: 24px)
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
```

**Page Subtitle**

```
font-size: 16px (mobile: 15px)
font-weight: 400
line-height: 1.5
color: var(--neutral-500)
margin-top: 8px
```

**Card Title (H2)**

```
font-size: 18px
font-weight: 600
line-height: 1.3
color: var(--neutral-900)
```

**Card Description**

```
font-size: 14px
font-weight: 400
line-height: 1.6
color: var(--neutral-600)
```

**Badge Text**

```
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
```

**Helper Text**

```
font-size: 12px
font-weight: 400
line-height: 1.5
color: var(--neutral-500)
```

---

## 4. Component Specifications

### 4.1 Header Section

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  ← Back                                  Step 2 of 4  │
│                                                         │
│  Calendar Settings                                      │
│  Add your Calendly link so leads can easily schedule   │
│  meetings with you.                                     │
└─────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
padding: 24px 0 32px
max-width: 800px
margin: 0 auto

/* Mobile */
padding: 12px 0 24px (mobile)

/* Back Button */
display: flex
align-items: center
gap: 8px
font-size: 14px
font-weight: 500
color: var(--neutral-500)
margin-bottom: 16px (mobile: 12px)
cursor: pointer
transition: color 150ms ease

/* Hover State */
color: var(--brand-primary)

/* Step Indicator */
position: absolute
top: 24px
right: 24px (desktop)
font-size: 13px (mobile: 11px)
font-weight: 500
color: var(--neutral-500)

/* Title */
font-size: 32px (mobile: 24px)
font-weight: 700
color: var(--neutral-900)
margin-bottom: 8px

/* Subtitle */
font-size: 16px (mobile: 15px)
color: var(--neutral-500)
max-width: 600px
line-height: 1.5
```

---

### 4.2 Calendly Card Component

#### Card Container

```css
/* Base Structure */
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 12px
padding: 24px (mobile: 16px)
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
transition: all 200ms ease

/* Hover State (when not saved) */
border-color: var(--neutral-300)
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)

/* Saved State */
border-color: var(--success-green)
background: linear-gradient(to bottom, #FFFFFF, var(--success-bg) 2%)
```

#### Card Header Layout

```
┌──────────────────────────────────────────────┐
│  [Icon]  Calendly Link            OPTIONAL  │
│                                              │
│  Add your Calendly link so leads can easily │
│  schedule meetings with you.                │
└──────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
display: flex
align-items: flex-start
gap: 16px

/* Mobile */
flex-direction: column (mobile)

/* Icon Container */
width: 48px
height: 48px
border-radius: 10px
display: flex
align-items: center
justify-content: center
flex-shrink: 0
background: var(--calendly-bg)
color: var(--calendly-blue)

/* Icon Size */
width: 24px
height: 24px

/* Content Container */
flex: 1
width: 100%

/* Title Row */
display: flex
align-items: center
justify-content: space-between
flex-wrap: wrap (mobile)
gap: 8px
margin-bottom: 4px

/* Card Title */
font-size: 18px
font-weight: 600
color: var(--neutral-900)

/* Description */
font-size: 14px
line-height: 1.6
color: var(--neutral-600)
margin-top: 4px
margin-bottom: 16px
```

---

### 4.3 Optional Badge

```css
/* Container */
background: var(--neutral-100)
color: var(--optional-gray)
padding: 4px 10px
border-radius: 4px
font-size: 11px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.05em
display: inline-block
```

---

### 4.4 Calendly Input Section

#### Visual Structure (Unsaved State)

```
┌──────────────────────────────────────────────┐
│  https://calendly.com/your-link      [Save]  │
└──────────────────────────────────────────────┘
  Find your Calendly link at calendly.com/...

  [Skip for Now]
```

#### Specifications

```css
/* Input Group Container */
display: flex
gap: 8px
margin-bottom: 8px

/* Mobile */
flex-direction: column (mobile)

/* Input Field */
flex: 1
height: 44px
padding: 0 16px
font-size: 15px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 150ms ease

/* Focus State */
border-color: var(--brand-primary)
background: #FFFFFF
outline: none
box-shadow: 0 0 0 3px var(--brand-primary-light)

/* Error State */
border-color: var(--error-red)
background: #FEF2F2

/* Save Button */
height: 44px
padding: 0 20px
font-size: 14px
font-weight: 600
color: var(--neutral-700)
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 8px
cursor: pointer
white-space: nowrap
transition: all 150ms ease

/* Mobile */
width: 100% (mobile)

/* Save Button Hover */
border-color: var(--brand-primary)
color: var(--brand-primary)

/* Save Button Loading */
opacity: 0.7
cursor: wait

/* Save Button Disabled */
opacity: 0.5
cursor: not-allowed

/* Helper Text */
font-size: 12px
color: var(--neutral-500)
line-height: 1.5
margin-top: 6px

/* Helper Link */
color: var(--brand-primary)
text-decoration: none
font-weight: 500

/* Helper Link Hover */
text-decoration: underline

/* Skip Button */
margin-top: 8px
height: 40px
padding: 0 18px
font-size: 14px
font-weight: 500
color: var(--neutral-600)
background: transparent
border: none
cursor: pointer
transition: all 150ms ease

/* Skip Button Hover */
color: var(--neutral-700)
text-decoration: underline
```

---

### 4.5 Calendly Saved State

#### Visual Structure

```
┌──────────────────────────────────────────────┐
│  ✓  Calendly link saved                      │
│     calendly.com/user/meeting  ↗             │
│                                              │
│     [Change Link]                            │
└──────────────────────────────────────────────┘
```

#### Specifications

```css
/* Saved Container */
background: var(--success-bg)
border: 1px solid #A7F3D0  /* Success-200 */
border-radius: 8px
padding: 16px (mobile: 12px)
display: flex
align-items: flex-start
gap: 12px
margin-bottom: 12px

/* Checkmark Icon */
width: 20px
height: 20px
color: var(--success-green)
flex-shrink: 0
margin-top: 2px

/* Content Container */
flex: 1
min-width: 0  /* Allow text to wrap */

/* Status Label */
font-size: 14px
font-weight: 600
color: var(--success-green)
margin-bottom: 4px

/* Link Display */
display: flex
align-items: center
gap: 6px
font-size: 12px
color: var(--brand-primary)
text-decoration: none
word-break: break-all

/* External Link Icon */
width: 14px
height: 14px
opacity: 0.7
flex-shrink: 0

/* Link Hover */
text-decoration: underline

/* Change Button */
margin-top: 12px
font-size: 14px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 6px
padding: 8px 16px
cursor: pointer
transition: all 150ms ease

/* Change Button Hover */
border-color: var(--brand-primary)
color: var(--brand-primary)
```

---

### 4.6 Bottom Action Bar

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ← Back                                    [Continue →] │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Specifications

```css
/* Container */
position: fixed
bottom: 0
left: 0
right: 0
z-index: 10
background: #FFFFFF
border-top: 1px solid var(--neutral-200)
padding: 16px 24px
box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05)

/* Inner Container (max-width) */
max-width: 800px
margin: 0 auto
display: flex
align-items: center
justify-content: space-between
gap: 12px

/* Mobile */
flex-direction: column (mobile)
padding: 12px 16px (mobile)

/* Back Button */
display: inline-flex
align-items: center
gap: 6px
padding: 10px 20px
font-size: 15px
font-weight: 500
color: var(--neutral-700)
background: #FFFFFF
border: 1.5px solid var(--neutral-200)
border-radius: 8px
cursor: pointer
transition: all 150ms ease

/* Mobile */
width: 100% (mobile)
justify-content: center (mobile)

/* Back Button Hover */
border-color: var(--neutral-300)
background: var(--neutral-50)

/* Continue Button */
display: inline-flex
align-items: center
gap: 8px
padding: 0 24px
height: 44px
font-size: 15px
font-weight: 600
color: #FFFFFF
background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)
border: none
border-radius: 8px
cursor: pointer
transition: all 150ms ease
box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2)

/* Mobile */
width: 100% (mobile)
order: -1 (mobile) /* Show Continue first on mobile */

/* Continue Button Hover */
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3)

/* Arrow Icon */
width: 16px
height: 16px
display: none  /* Hidden on mobile */

/* Desktop (≥640px) */
.arrow-icon {
  display: inline-block;
}
```

---

## 5. Interaction States & Micro-Animations

### 5.1 Card Hover (Unsaved State)

```
Trigger: Mouse enters card
Duration: 200ms
Easing: ease-out

Effect:
- Border color transitions to neutral-300
- Box-shadow grows from sm to md
- Subtle scale: transform: scale(1.005)
```

### 5.2 Save Button Click

```
Trigger: User clicks "Save"
Duration: Multi-stage

Sequence:
1. Validate Calendly link
2. Button shows loading state (150ms)
3. Text changes to "Saving..."
4. Spinner appears
5. After save success: (500ms)
6. Card transitions to saved state (300ms)
```

### 5.3 Success State Transition

```
Trigger: Calendly save success
Duration: 400ms
Easing: ease-out

Sequence:
1. Input field fades out (200ms)
2. Success component slides in from bottom (200ms, translateY(-10px → 0))
3. Checkmark icon scales in (300ms, scale(0 → 1))
4. Green border pulses once (500ms)
```

### 5.4 Error State Animation

```
Trigger: Invalid Calendly link
Duration: 400ms

Effect:
- Input field border flashes red (2 pulses)
- Input field shakes horizontally (±4px)
- Error message fades in from top (200ms)
```

### 5.5 Skip Confirmation

```
Trigger: User clicks "Skip for Now"
Duration: 300ms

Effect:
- Toast notification: "You can add your Calendly link later from settings"
- Navigates to next screen
```

### 5.6 Page Load Animation

```
Trigger: Component mount
Duration: 500ms
Easing: ease-out

Sequence:
1. Header fades in + slides down (translateY(-10px → 0))
2. Card fades in (100ms delay)
3. Action bar slides up from bottom
```

---

## 6. Responsive Behavior

### Breakpoint Strategy

#### Desktop (≥1024px)

- Content max-width: 800px, centered
- Card: Full-width within container
- Action bar: Horizontal layout
- Card padding: 24px

#### Tablet (768px - 1023px)

- Content: 48px horizontal padding
- Card: Full-width
- Action bar: Horizontal layout maintained
- Card padding: 24px

#### Mobile (<768px)

- Content: 16px horizontal padding
- Card: Full-width, padding 16px
- Input/Button: Stack vertically
- Action bar: Stacked vertical layout
- Font sizes: Scale down by 1-2px
- Touch targets: Minimum 44px height

#### Mobile Specific Changes

```css
/* Card Layout */
@media (max-width: 767px) {
  flex-direction: column;
  gap: 16px;

  /* Input Group */
  flex-direction: column;

  /* Save Button */
  width: 100%;

  /* Action Bar Buttons */
  width: 100%;
  flex-direction: column;
}
```

---

## 7. Error States & Validation

### 7.1 Calendly Link Validation

#### Invalid URL Format

```
Input State:
- Border: 1.5px solid var(--error-red)
- Background: #FEF2F2

Error Message:
"Please enter a valid Calendly link"
- Font-size: 13px
- Color: var(--error-red)
- Margin-top: 6px
```

#### Missing "calendly.com"

```
Error Message:
"Please enter a valid Calendly link (calendly.com)"
```

#### Empty Input

```
Error Message:
"Please enter a Calendly link"
```

---

## 8. Loading States

### 8.1 Calendly Save Loading

```
Save Button:
- Text: "Saving..."
- Opacity: 0.7
- Disabled: true
- Small spinner (14px) before text

Spinner Specs:
- Size: 14px
- Border: 2px solid rgba(79, 70, 229, 0.3)
- Border-top: 2px solid var(--brand-primary)
- Animation: rotate 600ms linear infinite
```

### 8.2 Page Initial Load

```
Skeleton States (before data loads):

Card:
- Show placeholder content with shimmer effect
- Gray rectangles for text (animated gradient)
- Input field: Disabled with placeholder

Duration: Until calendar link status is fetched
Animation: Linear gradient sweep (left to right, 1.5s infinite)
```

---

## 9. Accessibility Requirements

### Keyboard Navigation

```
Tab Order:
1. Back button
2. Calendly input field
3. Save button (if visible)
4. Skip button (if visible)
5. Change Link button (if link saved)
6. Continue button

Focus Indicators:
- All interactive elements: 3px solid ring var(--brand-primary-light)
- Offset: 2px from element
- Border-radius: Matches element shape
```

### Screen Reader Support

```html
<!-- Calendly Card -->
<section
  aria-labelledby="calendly-heading"
  aria-describedby="calendly-description"
>
  <h2 id="calendly-heading">Calendly Link</h2>
  <p id="calendly-description">
    Add your Calendly link so leads can schedule meetings
  </p>

  <!-- Status announcement -->
  <div role="status" aria-live="polite">
    <!-- Announces "Calendly link saved" when successful -->
  </div>
</section>

<!-- Input -->
<label for="calendly-input">Calendly scheduling link</label>
<input
  id="calendly-input"
  aria-describedby="calendly-help calendly-error"
  aria-invalid="false"
/>

<!-- Continue Button -->
<button aria-label="Continue to Email Configuration" aria-disabled="false">
  Continue
</button>
```

### Announcements

```
Success:
- "Calendly link saved successfully"

Errors:
- "Invalid Calendly link format"
- "Please enter a valid Calendly link"

Navigation:
- "Step 2 of 4: Calendar Settings"
```

### Color Contrast

```
All text combinations meet WCAG AA:
- Card titles (#111827 on white): 16.1:1 ✓
- Descriptions (#6B7280 on white): 4.7:1 ✓
- Error messages (#EF4444 on white): 4.8:1 ✓
- Helper text (#6B7280 on white): 4.7:1 ✓
```

---

## 10. Content Guidelines

### 10.1 Calendar Card Copy

**Title**: "Calendly Link"

**Description**: "Add your Calendly link so leads can easily schedule meetings with you."

**Input Placeholder**: "https://calendly.com/your-link"

**Helper Text**: "Find your Calendly link at [calendly.com/event_types](https://calendly.com/event_types/user/me)"

**Saved State**: "Calendly link saved"

**Error Messages**:

- Empty: "Please enter a Calendly link"
- Invalid format: "Please enter a valid Calendly link"
- Missing domain: "Please enter a valid Calendly link (calendly.com)"

**Skip Button**: "Skip for Now"

### 10.2 Action Bar Copy

**Back**: "Back"

**Continue**: "Continue to Email Configuration" (desktop), "Continue →" (mobile)

**Note**: Continue button is always enabled since calendar setup is optional

---

## 11. Design Rationale

### Why Calendar Only?

1. **Simplified Focus**: Single-purpose screen reduces cognitive load
2. **Optional by Nature**: Calendar setup is genuinely optional for many use cases
3. **Reduced Friction**: Fewer steps in onboarding = higher completion rates
4. **Gmail Not Required**: Email sending handled by system, no OAuth complexity needed
5. **Clear Value Prop**: Direct benefit of lead scheduling is easy to understand

### Why Calendly Link (Not OAuth)?

1. **Simplicity**: Paste link is faster than OAuth flow
2. **No Dependencies**: Works without additional permissions
3. **User Control**: Users know exactly which event they're sharing
4. **Flexibility**: Can paste any Calendly link (one-off, team, etc.)

### Why Fixed Bottom Bar?

1. **Persistent Navigation**: Always visible, reduces scrolling
2. **Mobile-Friendly**: Easy thumb access on mobile devices
3. **Clear Progress**: User always knows how to move forward
4. **Visual Hierarchy**: Separates actions from content

### Why Optional?

1. **Flexibility**: Not all users need calendar scheduling
2. **Onboarding Flow**: Reducing required steps improves completion
3. **Progressive Enhancement**: Can be added later from settings
4. **User Choice**: Respects different workflows and preferences

---

## 12. Implementation Checklist

When implementing this design, ensure:

- [ ] Calendly URL validation includes "calendly.com" check
- [ ] Continue button is always enabled (calendar is optional)
- [ ] Skip button navigates to next screen with toast confirmation
- [ ] Success states animate smoothly (no jarring transitions)
- [ ] All error states provide actionable feedback
- [ ] Focus management works correctly after save
- [ ] Mobile layout stacks input and button properly
- [ ] Loading states prevent double-submissions
- [ ] Screen reader announcements are clear and timely
- [ ] Saved state persists across page refreshes (via store)
- [ ] Skip button shows confirmation toast
- [ ] All links open in new tabs with security attributes
- [ ] Calendar status is fetched on page load
- [ ] Card hover states don't trigger when link is saved
- [ ] Input field is responsive and wraps properly on mobile
- [ ] Break-all applied to long URLs to prevent overflow

---

## 13. Future Enhancement Opportunities

### Phase 2 Considerations

1. **Multiple Calendar Providers**: Support Google Calendar, Outlook Calendar
2. **Calendly OAuth**: Full OAuth flow instead of link pasting
3. **Preview Integration**: Show how calendar link appears in emails
4. **Availability Sync**: Read user's calendar availability
5. **Custom Event Types**: Let users select which Calendly event to use
6. **Time Zone Detection**: Automatically detect and display user's timezone
7. **Calendar Webhooks**: Real-time status updates via webhooks
8. **Meeting Templates**: Pre-configured meeting types for common scenarios
9. **Booking Confirmation**: Show preview of calendar invite leads will receive
10. **Alternative Platforms**: Support Cal.com, Savvycal, etc.

---

## 14. Technical Implementation Notes

### State Management

```typescript
// Store state
{
  calendlyLink: string | null;
}

// Component state
const [calendlyInput, setCalendlyInput] = useState('');
const [isSavingCalendly, setIsSavingCalendly] = useState(false);
const [calendlyError, setCalendlyError] = useState<string | null>(null);
```

### Validation Logic

```typescript
// Calendly validation
const validateCalendlyLink = (url: string): boolean => {
  if (!url.trim()) return false;
  if (!url.includes('calendly.com/')) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

### Save Flow

```typescript
// Save Calendly link
const handleSaveCalendly = async () => {
  setCalendlyError(null);

  if (!calendlyInput.trim()) {
    setCalendlyError('Please enter a Calendly link');
    return;
  }

  if (!validateCalendlyLink(calendlyInput)) {
    setCalendlyError('Please enter a valid Calendly link (calendly.com)');
    return;
  }

  setIsSavingCalendly(true);

  try {
    await saveSchedulingPreference({
      workflowId,
      schedulingType: 'CALENDLY',
      calendlyLink: calendlyInput.trim(),
    });
    // Success state handled by store update
  } catch (error) {
    setCalendlyError('Failed to save. Please try again.');
  } finally {
    setIsSavingCalendly(false);
  }
};
```

---

**End of Specification**

This document serves as the single source of truth for implementing the FlowTrack Calendar Settings Screen experience. Any deviations should be documented and approved by the design team.

**Related Documentation**:

- `/frontend/docs/ui/LOGIN_UX.md` - Login screen design
- `/IMPLEMENTATION_DOCS.md` - Technical implementation guide
- `/frontend/docs/ui/ONBOARDING_FLOW.md` - Overall onboarding UX (if exists)
