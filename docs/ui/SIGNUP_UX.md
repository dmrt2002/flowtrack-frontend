# FlowTrack Sign Up Page - UI/UX Design Specification

## Overview

This specification defines the sign-up/registration experience for FlowTrack, maintaining complete visual and interaction consistency with the login page design system while accommodating additional registration fields and OAuth options.

---

## 1. Inheritance from Login Design

This page inherits the **complete design system** from `LOGIN_UX.md`:

- ✅ Split-screen layout (40/60 ratio)
- ✅ "Glass & Graphite" design system
- ✅ Color palette (Indigo primary, neutral scale)
- ✅ Typography (Inter font stack)
- ✅ Component specifications (inputs, buttons, links)
- ✅ Animation specifications
- ✅ Accessibility requirements

**Only differences** from login page are documented below.

---

## 2. Page-Specific Adaptations

### 2.1 Left Panel (Brand Panel) - IDENTICAL

Uses exact same visual composition as login page:

- Gradient background (Indigo → Purple)
- Logo placement (top-left, 40px from edges)
- Hero visual (workflow preview with glassmorphism)
- Tagline: "Template-First Automation for Solopreneurs"
- Social proof badge

**No changes required** - maintains brand consistency.

---

## 3. Right Panel - Sign Up Form

### 3.1 Form Container

Same container specifications as login:

```css
max-width: 480px
margin: 0 auto
padding: 0 32px
min-height: 100vh
display: flex
flex-direction: column
justify-content: center
```

### 3.2 Form Content Structure

```
┌─────────────────────────────────────┐
│                                     │
│   Create your account               │  ← H2 Heading
│   Start automating your leads       │  ← H3 Subtitle
│   in under 10 minutes               │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Sign up with Google    [G] │   │  ← OAuth Button (Optional)
│   └─────────────────────────────┘   │
│                                     │
│   ──────────  or  ──────────        │  ← Divider
│                                     │
│   Full name                         │  ← Label
│   ┌─────────────────────────────┐   │
│   │  John Smith                 │   │  ← Input
│   └─────────────────────────────┘   │
│                                     │
│   Email address                     │
│   ┌─────────────────────────────┐   │
│   │  you@example.com        [@] │   │  ← Email Input
│   └─────────────────────────────┘   │
│                                     │
│   Password                          │
│   ┌─────────────────────────────┐   │
│   │  ••••••••••        Show     │   │  ← Password Input
│   └─────────────────────────────┘   │
│   ✓ At least 8 characters           │  ← Password Requirements
│   ○ Contains a number               │     (Real-time validation)
│   ○ Contains uppercase letter       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │    Create account           │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│   By signing up, you agree to our   │  ← Legal Text
│   Terms of Service and Privacy      │
│   Policy                            │
│                                     │
│   Already have an account? Sign in  │  ← Alternate Action
│                                     │
└─────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 Heading & Subtitle

**H2 - "Create your account"**

```css
font-size: 32px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em
```

**H3 - Subtitle (Multi-line)**

```css
font-size: 16px
font-weight: 400
line-height: 1.5
color: var(--neutral-500)
margin-top: 8px
```

**Copy Options:**

- "Start automating your leads in under 10 minutes"
- "Join 10,000+ solopreneurs automating their workflows"
- "Deploy proven automation templates in minutes"

---

### 4.2 OAuth Button (Google Sign Up)

**Inherits from LOGIN_UX.md Section 4.4** (Secondary Button)

**Specific Copy:**

```
"Sign up with Google"
```

**Icon:**

- Google logo (20px × 20px)
- Position: 16px from left edge
- Color: Full-color Google brand icon

**States:**

- Base: White background, neutral-200 border
- Hover: neutral-50 background, neutral-300 border
- Loading: "Signing up with Google..." with spinner

---

### 4.3 Input Fields

#### Full Name Input

**NEW FIELD** (not in login page)

```css
/* Container */
margin-bottom: 20px

/* Label */
display: block
margin-bottom: 6px
font-size: 14px
font-weight: 500
color: var(--neutral-700)

/* Input */
width: 100%
height: 44px
padding: 0 16px
font-size: 15px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 0.15s ease
```

**Placeholder:**

```
"John Smith"
```

**Validation:**

- Optional field (no red border if empty)
- Min 1 character, max 50 characters
- Trimmed whitespace
- No special validation icon

**Alternative: First Name + Last Name Split**

If backend requires separate fields:

```
┌──────────────────┬──────────────────┐
│  First name      │  Last name       │
│  ┌────────────┐  │  ┌────────────┐  │
│  │ John       │  │  │ Smith      │  │
│  └────────────┘  │  └────────────┘  │
└──────────────────┴──────────────────┘
```

```css
/* Grid Layout */
display: grid
grid-template-columns: 1fr 1fr
gap: 16px
margin-bottom: 20px
```

---

#### Email Address Input

**Inherits from LOGIN_UX.md Section 4.1**

**Icon:** Mail icon (20px, right-aligned)

**Validation:**

- Required field
- Valid email format (RFC 5322)
- Lowercase transformation
- Error message: "Please enter a valid email address"

**Duplicate Email Error:**

When backend returns 409 Conflict:

```
┌─────────────────────────────────────┐
│  Email address                      │
├─────────────────────────────────────┤
│  existing@user.com              [@] │  ← Red border
└─────────────────────────────────────┘
  This email is already registered.       ← Error message
  Sign in instead?                        ← Link to login
```

---

#### Password Input

**Inherits from LOGIN_UX.md Section 4.2**

**Show/Hide Toggle:** Yes (same as login)

**Real-Time Password Requirements Checklist**

Positioned below password input:

```css
/* Container */
margin-top: 8px
padding: 12px
background: var(--neutral-50)
border-radius: 6px
border: 1px solid var(--neutral-200)

/* Requirement Item */
font-size: 13px
line-height: 1.8
display: flex
align-items: center
gap: 8px

/* Icon States */
✓ (checkmark) - color: var(--success-500) - when met
○ (circle)    - color: var(--neutral-400) - when not met
```

**Requirements List:**

```
✓ At least 8 characters
○ Contains a number
○ Contains uppercase letter
```

**Validation Logic:**

- Updates in real-time as user types
- All must be green (✓) for form submission to succeed
- Backend enforces: `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/`

---

### 4.4 Legal Agreement Text

**NEW ELEMENT** (compliance requirement)

```css
/* Container */
margin-top: 16px
text-align: center
font-size: 12px
line-height: 1.6
color: var(--neutral-500)

/* Links within text */
color: var(--brand-primary)
font-weight: 500
text-decoration: underline
cursor: pointer

/* Hover state */
color: var(--brand-primary-hover)
```

**Copy:**

```
By signing up, you agree to our Terms of Service and Privacy Policy
```

**Link Behavior:**

- "Terms of Service" → Opens `/terms` in new tab
- "Privacy Policy" → Opens `/privacy` in new tab

---

### 4.5 Primary Button

**Inherits from LOGIN_UX.md Section 4.3**

**Button Copy:**

```
"Create account"
```

**Loading State:**

```
"Creating account..."
```

**States:**

- Disabled if password requirements not met (all ✓ not green)
- Loading state shows spinner
- Success state (optional): Green checkmark for 300ms before redirect

---

### 4.6 Alternate Action Link

**Inherits from LOGIN_UX.md Section 4.5**

```css
text-align: center
margin-top: 24px
font-size: 14px
color: var(--neutral-600)
```

**Copy:**

```
Already have an account? Sign in
```

**Link Behavior:**

- "Sign in" → Navigates to `/login` (or `/auth/login`)
- Maintains brand-primary color and hover underline

---

## 5. Spacing Specifications

```
Heading to Subtitle: 8px
Subtitle to OAuth button: 32px
OAuth to Divider: 24px
Divider to First Input (Full Name): 24px
Between Input Groups: 20px
Password to Requirements Checklist: 8px
Requirements to Submit Button: 24px
Submit Button to Legal Text: 16px
Legal Text to Alternate Action: 24px
```

---

## 6. Interaction Flows

### 6.1 Successful Registration Flow

```
1. User fills all fields correctly
2. Password requirements all show ✓ (green)
3. Click "Create account"
4. Button enters loading state ("Creating account...")
5. Backend returns 201 Created
6. Button shows green checkmark (300ms)
7. Page transitions to verification notice screen

Transition:
- Fade out current form (200ms)
- Slide in success message (300ms ease-out)
```

---

### 6.2 Post-Registration Success Screen

**REPLACES** the sign-up form after successful registration:

```
┌─────────────────────────────────────┐
│                                     │
│         [✉️ Email Icon]             │  ← Large icon (64px)
│                                     │
│   Check your email                  │  ← H2 Heading
│                                     │
│   We've sent a verification link    │  ← Body text
│   to user@example.com.              │
│                                     │
│   Please verify your email before   │
│   logging in.                       │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Go to Login               │   │  ← Primary Button
│   └─────────────────────────────┘   │
│                                     │
│   Didn't receive it?                │  ← Helper text
│   Resend verification email         │  ← Link
│                                     │
└─────────────────────────────────────┘
```

**Specifications:**

```css
/* Container */
text-align: center
max-width: 400px

/* Email Icon */
width: 64px
height: 64px
color: var(--brand-primary)
margin-bottom: 24px

/* Heading */
font-size: 28px
font-weight: 700
color: var(--neutral-900)
margin-bottom: 16px

/* Body Text */
font-size: 15px
line-height: 1.6
color: var(--neutral-600)
margin-bottom: 32px

/* Highlighted Email */
font-weight: 600
color: var(--neutral-900)

/* Resend Link */
font-size: 14px
color: var(--brand-primary)
margin-top: 16px
cursor: pointer
```

**Resend Link Behavior:**

- Clicking triggers POST `/auth/resend-verification`
- Link becomes disabled for 60 seconds
- Shows countdown: "Resend in 59s..."
- Success toast: "Verification email sent!"

---

### 6.3 Error States

#### Duplicate Email (409 Conflict)

```
Field: Email input shows red border
Message: "This email is already registered. Sign in instead?"
Action: "Sign in instead?" links to login page
```

#### Weak Password (400 Bad Request)

```
Field: Password input shows red border
Message: "Password must contain uppercase, lowercase, and number"
Checklist: Failed requirements remain gray (○)
```

#### Network Error (500 Internal Server Error)

```
┌─────────────────────────────────────────┐
│  ⚠️  Something went wrong              │
│  Please try again in a moment.         │
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

---

## 7. Validation Rules

### Client-Side Validation (Pre-Submit)

| Field     | Rule                                   | Error Message                   |
| --------- | -------------------------------------- | ------------------------------- |
| Full Name | Optional, 1-50 chars                   | "Name is too long"              |
| Email     | Required, valid format                 | "Please enter a valid email"    |
| Password  | 8+ chars, uppercase, lowercase, number | "Password requirements not met" |

### Server-Side Validation (Backend Response)

| Status           | Scenario       | UI Response                |
| ---------------- | -------------- | -------------------------- |
| 201 Created      | Success        | Show success screen        |
| 400 Bad Request  | Invalid data   | Show field-level errors    |
| 409 Conflict     | Email exists   | Show duplicate email error |
| 500 Server Error | System failure | Show generic error banner  |

---

## 8. Micro-Interactions

### 8.1 Password Requirements Animation

```
Trigger: User focuses password field
Effect: Requirements checklist slides down (200ms ease-out)

Trigger: User types in password
Effect: Each requirement animates individually:
  - Circle (○) → Checkmark (✓)
  - Color: neutral-400 → success-500
  - Scale: 0.8 → 1.0 (bounce effect, 150ms)
```

### 8.2 OAuth Button Loading

```
Trigger: Click "Sign up with Google"
Sequence:
1. Button text fades to "Signing up..." (100ms)
2. Google logo fades to 50% opacity (100ms)
3. Spinner appears (20px, brand-primary)
4. OAuth popup opens
5. On return: Button shows green checkmark
6. Redirect to dashboard (or verification if email not verified)
```

### 8.3 Form Submission Animation

```
Trigger: Click "Create account" with valid data
Sequence:
1. Button enters loading state (100ms)
2. All inputs become disabled (opacity: 0.6)
3. On success:
   - Button background → success-500 (200ms)
   - Checkmark icon appears (200ms)
   - Form fades out (300ms)
   - Success screen slides in from right (300ms ease-out)
```

---

## 9. Responsive Behavior

### Desktop (≥1024px)

- Split-screen maintained
- Form max-width: 480px
- All fields full-width within container

### Tablet (768px - 1023px)

- Stacked layout
- Brand panel: 200px height header
- Form: 48px horizontal padding
- First/Last name grid maintains 2 columns

### Mobile (<768px)

- Brand panel: 80px height (logo only)
- Form: 24px horizontal padding
- H2: 28px → 24px
- Button height: 44px → 48px (touch target)
- First/Last name: Stacks vertically (1 column)

---

## 10. Accessibility Requirements

### Keyboard Navigation

Tab order:

1. OAuth button
2. Full name
3. Email
4. Password
5. Show/Hide password toggle
6. Create account button
7. Terms of Service link
8. Privacy Policy link
9. Sign in link

### Screen Reader Support

```html
<!-- Full Name Input -->
<label for="fullName">Full name</label>
<input id="fullName" type="text" aria-describedby="fullNameHelper" />
<span id="fullNameHelper" class="sr-only">Optional field</span>

<!-- Email Input -->
<label for="email">Email address</label>
<input id="email" type="email" aria-required="true" aria-invalid="false" />
<span id="emailError" role="alert"><!-- Error message --></span>

<!-- Password Requirements -->
<div role="status" aria-live="polite" aria-atomic="true">
  <ul aria-label="Password requirements">
    <li>
      <span aria-label="Requirement met">✓</span>
      At least 8 characters
    </li>
  </ul>
</div>

<!-- Form Submission -->
<form aria-busy="false" aria-label="Sign up form">
  <!-- Form fields -->
</form>
```

### Focus Management

- After successful registration: Focus moves to success screen heading
- After error: Focus moves to first invalid input
- Error messages announced via `aria-live="assertive"`

### Color Contrast

All text meets WCAG AA:

- Body text (#374151 on white): 10.4:1 ✓
- Error text (#EF4444 on white): 4.8:1 ✓
- Success checkmark (#10B981 on white): 3.4:1 ✓
- Legal text (#6B7280 on white): 5.7:1 ✓

---

## 11. OAuth Integration Considerations

### Clerk OAuth Flow

When using Clerk for "Sign up with Google":

1. **Frontend:** User clicks OAuth button
2. **Clerk SDK:** Opens OAuth popup
3. **Clerk:** Handles Google OAuth flow
4. **Clerk:** Returns session token to frontend
5. **Frontend:** Sends token to backend `/api/user`
6. **Backend:** Creates user in database
7. **Frontend:** Redirects to onboarding or dashboard

**Email Verification:**

- Clerk handles email verification automatically
- No need for verification email flow
- User is immediately authenticated

**Error Handling:**

- Popup blocked: Show toast "Please allow popups to sign up with Google"
- OAuth cancelled: Button returns to normal state
- Network error: Show generic error banner

---

## 12. Implementation Checklist

When implementing this design:

- [ ] Full name field supports both single input and first/last split
- [ ] Email validation uses RFC 5322 regex
- [ ] Password requirements update in real-time
- [ ] All checkmarks animate on requirement completion
- [ ] Duplicate email error shows "Sign in" link
- [ ] Legal text links open in new tabs
- [ ] Success screen replaces form (not modal)
- [ ] Resend verification link has 60-second cooldown
- [ ] OAuth button handles popup blockers gracefully
- [ ] All animations use specified durations
- [ ] Focus states visible (3px ring)
- [ ] Form prevents double-submission during loading
- [ ] Mobile layout stacks first/last name fields
- [ ] Screen reader announcements work correctly

---

## 13. Design Tokens (Inherited)

Uses exact same tokens as `LOGIN_UX.md`:

```css
/* Colors */
--brand-primary: #4f46e5 --brand-primary-hover: #4338ca
  --brand-primary-light: #eef2ff --success-500: #10b981 --error-500: #ef4444
  /* Spacing */ --space-sm: 8px --space-md: 16px --space-lg: 24px
  --space-xl: 32px /* Transitions */ --transition-fast: 100ms ease
  --transition-base: 150ms ease --transition-slow: 300ms ease;
```

---

## 14. Copy Variations

### Headlines

**Primary:**

```
"Create your account"
```

**Alternatives:**

```
"Join FlowTrack"
"Get started with FlowTrack"
"Start your free account"
```

### Subtitles

**Primary:**

```
"Start automating your leads in under 10 minutes"
```

**Alternatives:**

```
"Deploy proven automation templates in minutes"
"Join 10,000+ solopreneurs automating their workflows"
"Stop losing leads to process chaos"
```

### Button Copy

**Primary:**

```
"Create account"
```

**Alternatives:**

```
"Get started free"
"Start automating"
"Create my account"
```

---

## 15. Future Enhancements

Not required for V1, consider for future iterations:

1. **Social Proof Indicators:** "1,234 solopreneurs joined this week"
2. **Password Strength Meter:** Visual bar showing weak/medium/strong
3. **Magic Link Option:** "Send me a login link instead"
4. **Progressive Profiling:** Ask for name after email verification
5. **Referral Code Field:** "Have a referral code?"
6. **Company Field:** Optional "Company name" for agency users
7. **Avatar Upload:** Allow profile picture during registration
8. **Onboarding Preview:** "Here's what happens next" timeline

---

**End of Specification**

This document ensures the sign-up experience maintains complete visual and interaction consistency with the login page while accommodating registration-specific requirements (password validation, legal agreements, email verification).
