# FlowTrack Forgot Password - UI/UX Design Specification

## Overview

This specification defines the password reset request flow for FlowTrack. Users who can't remember their password can request a reset link to be sent to their email.

**Backend Endpoint:** POST `/auth/forgot-password`

**Design Principle:** Simple, single-purpose screen with anti-enumeration security (always returns success).

---

## 1. Design System Inheritance

**Inherits from `LOGIN_UX.md`:**

- Split-screen layout (40/60)
- Color palette (Indigo primary, neutral scale)
- Typography (Inter font stack)
- Input field specifications
- Button specifications
- Animation timing
- Accessibility standards

---

## 2. Visual Structure

```
LEFT PANEL (40%)                RIGHT PANEL (60%)
┌──────────────────────┐        ┌─────────────────────────────────────┐
│                      │        │                                     │
│  [FlowTrack Logo]    │        │                                     │
│                      │        │   ← Back to login                   │
│                      │        │                                     │
│   [Hero Visual]      │        │   Reset your password               │
│   (Workflow Preview) │        │   Enter your email and we'll send   │
│                      │        │   you instructions to reset your    │
│   "Template-First    │        │   password.                         │
│    Automation"       │        │                                     │
│                      │        │   Email address                     │
│   [Social Proof]     │        │   ┌─────────────────────────────┐   │
│                      │        │   │  you@example.com        [@] │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   ┌─────────────────────────────┐   │
│                      │        │   │   Send Reset Link           │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   Remember your password?           │
│                      │        │   Sign in                           │
│                      │        │                                     │
└──────────────────────┘        └─────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Back Navigation

```css
/* Container */
position: absolute
top: 40px
left: 0
display: flex
align-items: center
gap: 8px
cursor: pointer

/* Icon */
width: 16px
height: 16px
color: var(--neutral-500)

/* Text */
font-size: 14px
color: var(--neutral-600)
font-weight: 500
text-decoration: none

/* Hover */
color: var(--neutral-900)

/* Icon Hover */
transform: translateX(-2px)
transition: transform 150ms ease
```

**Copy:**

```
"← Back to login"
```

**Behavior:**

- Navigates to `/login` or `/auth/login`
- Hover animation: Arrow shifts 2px left

---

### 3.2 Heading

```css
font-size: 32px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
margin-bottom: 12px
letter-spacing: -0.02em
```

**Copy:**

```
"Reset your password"
```

**Alternative Headlines:**

```
"Forgot your password?"
"Can't sign in?"
"Reset password"
```

---

### 3.3 Subtitle/Instructions

```css
font-size: 15px
line-height: 1.6
color: var(--neutral-600)
margin-bottom: 32px
max-width: 400px
```

**Copy:**

```
Enter your email and we'll send you instructions to reset your password.
```

**Alternative Copy:**

```
No worries! Enter your email and we'll send you reset instructions.

We'll email you a link to reset your password.
```

---

### 3.4 Email Input Field

**Inherits from `LOGIN_UX.md` Section 4.1**

```css
/* Label */
display: block
margin-bottom: 6px
font-size: 14px
font-weight: 500
color: var(--neutral-700)

/* Input */
width: 100%
height: 44px
padding: 0 48px 0 16px
font-size: 15px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)
transition: all 0.15s ease

/* Icon (Mail) */
position: absolute
right: 16px
width: 20px
height: 20px
color: var(--neutral-400)
```

**Label Copy:**

```
"Email address"
```

**Placeholder:**

```
"you@example.com"
```

**Validation:**

- Required field
- Valid email format
- Lowercase transformation
- No red border on invalid (security: prevent enumeration)

---

### 3.5 Primary Button

**Inherits from `LOGIN_UX.md` Section 4.3**

```css
width: 100%
height: 44px
margin-top: 24px
font-size: 15px
font-weight: 600
```

**Button Copy:**

```
"Send Reset Link"
```

**Alternative:**

```
"Send Instructions"
"Email Me a Reset Link"
"Continue"
```

**Loading State:**

```
"Sending..."
```

**Disabled State:**

- Disabled if email field is empty
- Disabled during submission

---

### 3.6 Alternate Action Link

**Inherits from `LOGIN_UX.md` Section 4.5**

```css
text-align: center
margin-top: 24px
font-size: 14px
color: var(--neutral-600)
```

**Copy:**

```
Remember your password? Sign in
```

**Link Behavior:**

- "Sign in" → Navigates to `/login`
- Standard link hover/underline

---

## 4. Success State (Post-Submission)

### 4.1 Context

**Trigger:** After form submission, regardless of whether email exists

**Backend Response:** Always returns 200 OK with message:

```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

**Security Note:** Always shows success to prevent email enumeration attacks.

---

### 4.2 Success Screen Visual

```
┌─────────────────────────────────────┐
│                                     │
│   ← Back to login                   │
│                                     │
│         [✉️ Email Icon]             │
│                                     │
│   Check your email                  │
│                                     │
│   If an account exists for          │
│   alex@company.com, we sent         │
│   password reset instructions.      │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Back to Login             │   │
│   └─────────────────────────────┘   │
│                                     │
│   Didn't receive it?                │
│   Try again or contact support      │
│                                     │
│   ─────────────────────────────     │
│                                     │
│   💡 Check your spam folder if      │
│   you don't see it within 5         │
│   minutes.                          │
│                                     │
└─────────────────────────────────────┘
```

---

### 4.3 Success Screen Components

#### Email Icon

```css
/* Icon Container */
width: 64px
height: 64px
margin: 0 auto 24px
color: var(--brand-primary)
background: var(--brand-primary-light)
border-radius: 50%
display: flex
align-items: center
justify-content: center

/* Icon */
width: 32px
height: 32px
```

**Animation:**

```
Trigger: Screen transition
Effect: Scale from 0 → 1.0 with bounce (300ms ease-out)
```

---

#### Heading

```css
font-size: 32px
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
text-align: center
margin-bottom: 16px
```

**Copy:**

```
"Check your email"
```

---

#### Body Text

```css
font-size: 15px
line-height: 1.6
color: var(--neutral-600)
text-align: center
max-width: 400px
margin: 0 auto 32px
```

**Copy:**

```
If an account exists for {user_email}, we sent password reset instructions.
```

**Email Highlighting:**

```css
font-weight: 600
color: var(--neutral-900)
background: var(--brand-primary-light)
padding: 2px 6px
border-radius: 4px
```

**Important:** Use conditional language ("If an account exists...") to prevent enumeration.

---

#### Primary Button

```css
width: 100%
max-width: 320px
height: 44px
margin: 0 auto 24px
```

**Copy:**

```
"Back to Login"
```

**Behavior:**

- Navigates to `/login`

---

#### Helper Text

```css
text-align: center
font-size: 14px
color: var(--neutral-600)
margin-bottom: 24px
```

**Copy:**

```
Didn't receive it? Try again or contact support
```

**Links:**

- "Try again" → Returns to forgot password form
- "contact support" → Opens mailto:support@flowtrack.com or /support

---

#### Pro Tip Box

**Inherits from `EMAIL_VERIFICATION_UX.md`**

```css
padding: 12px 16px
background: rgba(79, 70, 229, 0.05)
border-left: 3px solid var(--brand-primary)
border-radius: 8px
margin-top: 24px
```

**Copy:**

```
💡 Check your spam folder if you don't see it within 5 minutes.
```

---

## 5. Interaction Flows

### 5.1 Standard Reset Request Flow

```
1. User navigates to /forgot-password
2. User enters email address
3. User clicks "Send Reset Link"
4. Button enters loading state ("Sending...")
5. Frontend calls POST /auth/forgot-password
6. Backend returns 200 OK (always, regardless of email existence)
7. Form fades out (200ms)
8. Success screen slides in (300ms)
9. Email icon animates
10. User clicks "Back to Login" or waits
```

---

### 5.2 Empty Email Submission

```
1. User clicks "Send Reset Link" with empty email
2. Email field shows focus ring (not error)
3. Button remains disabled
4. No API call is made

Alternative:
1. Allow submission
2. Show inline error: "Please enter your email address"
```

---

### 5.3 Invalid Email Format

```
1. User enters "notanemail"
2. User clicks "Send Reset Link"
3. Frontend validation catches invalid format
4. Email field shows focus ring (not red border for security)
5. Button shows subtle shake animation
6. No error message displayed (security)

Alternative (Less Secure):
- Show error: "Please enter a valid email address"
- Trade-off: Better UX vs. email enumeration risk
```

---

### 5.4 Rapid Retry Flow

```
1. User on success screen
2. User clicks "Try again"
3. Returns to forgot password form
4. Email field pre-filled with previous email
5. User can edit or resubmit
```

---

## 6. Error States

### 6.1 Network Error

**Scenario:** Backend unreachable, timeout, or 500 error

**UI Response:**

```
┌─────────────────────────────────────────┐
│  ⚠️  Connection error                  │
│  Please check your internet and try    │
│  again.                                │
└─────────────────────────────────────────┘
```

**Banner Style:**

```css
position: relative (above form)
padding: 12px 16px
background: rgba(239, 68, 68, 0.1)
border-left: 4px solid var(--error-500)
border-radius: 8px
margin-bottom: 20px
font-size: 14px
color: var(--error-500)
```

**Button State:**

- Returns to enabled state
- User can retry submission

---

### 6.2 Rate Limiting (Future)

**Scenario:** Backend implements rate limiting (e.g., max 3 requests per hour)

**Backend Response:** 429 Too Many Requests

**UI Response:**

```
┌─────────────────────────────────────────┐
│  ⚠️  Too many requests                 │
│  Please wait before trying again.      │
└─────────────────────────────────────────┘
```

**Button State:**

- Disabled for cooldown period
- Text: "Try again in 15 minutes"

---

## 7. Security Considerations

### 7.1 Email Enumeration Prevention

**Backend Behavior:**

- Always return 200 OK
- Always return same message
- Same response time regardless of email existence

**Frontend Behavior:**

- Never show "Email not found" error
- Never show "Email exists" confirmation
- Use conditional language: "If an account exists..."

**Success Message Copy:**

```
✓ GOOD:  "If an account exists for this email, we sent instructions."
✗ BAD:   "Password reset email sent to alex@company.com!"
```

---

### 7.2 Token Expiry Communication

**In Email Template:**

```
This link expires in 1 hour for security.
```

**On Success Screen:**

```
The reset link will expire in 1 hour.
```

---

## 8. Responsive Behavior

### Desktop (≥1024px)

- Split-screen layout maintained
- Form max-width: 480px
- Content centered in right panel

### Tablet (768px - 1023px)

- Stacked layout
- Brand panel: 200px header
- Form: 48px horizontal padding
- Success screen: Same width as form

### Mobile (<768px)

- Brand panel: 80px header (logo only)
- Form: 24px horizontal padding
- Heading: 32px → 28px
- Button: Full-width
- Back link: Smaller text (13px)

---

## 9. Accessibility

### Screen Reader Support

```html
<!-- Form -->
<form aria-label="Forgot password form">
  <label for="email">Email address</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby="emailHelp"
  />
  <span id="emailHelp" class="sr-only">
    Enter your email to receive password reset instructions
  </span>

  <button type="submit" aria-busy="false" aria-disabled="false">
    Send Reset Link
  </button>
</form>

<!-- Success Screen -->
<div role="status" aria-live="polite">
  <h1>Check your email</h1>
  <p>If an account exists, we sent password reset instructions.</p>
</div>
```

---

### Keyboard Navigation

**Forgot Password Form:**

1. Tab: Focus back link
2. Tab: Focus email input
3. Tab: Focus submit button
4. Tab: Focus "Sign in" link
5. Enter on input: Submit form
6. Escape: Clear email field (optional)

**Success Screen:**

1. Tab: Focus "Back to Login" button
2. Tab: Focus "Try again" link
3. Tab: Focus "contact support" link
4. Enter: Activate focused element

---

### Focus Management

- After form submission: Focus moves to success screen heading
- After network error: Focus moves to email input
- Back link always visible and focusable

---

## 10. Animation Specifications

### 10.1 Form to Success Transition

```
Trigger: Successful form submission (200 OK)
Duration: 500ms total

Sequence:
1. Button shows green checkmark (200ms)
2. Form container fades out (200ms opacity)
3. Success screen slides in from right (300ms translateX)
4. Email icon bounces in (300ms scale)
5. Easing: ease-out
```

---

### 10.2 Button Loading State

```
Trigger: Form submission
Duration: Seamless

Changes:
1. Text "Send Reset Link" → "Sending..." (100ms fade)
2. Spinner appears (20px, brand-primary)
3. Button opacity: 0.8
4. Cursor: wait
```

---

### 10.3 Error Shake

```
Trigger: Network error or validation failure
Target: Form container
Animation:
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
Duration: 400ms
Easing: ease-in-out
```

---

## 11. Copy Variations

### Headlines

**Primary:**

```
"Reset your password"
```

**Alternatives:**

```
"Forgot your password?"
"Can't sign in?"
"Trouble logging in?"
"Password reset"
```

---

### Subtitle/Instructions

**Primary:**

```
"Enter your email and we'll send you instructions to reset your password."
```

**Alternatives:**

```
"No worries! Enter your email and we'll send you reset instructions."

"We'll email you a link to create a new password."

"Enter the email associated with your account and we'll send reset instructions."
```

---

### Success Screen Body

**Primary (Secure):**

```
"If an account exists for alex@company.com, we sent password reset instructions."
```

**Alternative (More Direct, Less Secure):**

```
"We sent password reset instructions to alex@company.com."
```

**Alternative (Friendlier):**

```
"Check your inbox! If an account exists for this email, you'll receive reset instructions shortly."
```

---

## 12. Email Template Reference

**Subject Line:**

```
Reset your FlowTrack password
```

**Preview Text:**

```
Click to create a new password for your account
```

**Body:**

```
Hi {user_name},

We received a request to reset your FlowTrack password.

Click the button below to choose a new password:

[Reset Password]

This link expires in 1 hour for security.

If you didn't request this, you can safely ignore this email.

—
The FlowTrack Team
```

**Button Copy:**

```
"Reset Password"
```

**Link Format:**

```
https://app.flowtrack.com/auth/reset-password?token={reset_token}
```

---

## 13. Implementation Checklist

- [ ] Form accessible via /forgot-password route
- [ ] Back link navigates to /login
- [ ] Email input validates format client-side
- [ ] Submit button disabled when email empty
- [ ] Loading state shows during API call
- [ ] Always shows success screen (200 OK response)
- [ ] Success screen highlights user email
- [ ] Never reveals if email exists or not
- [ ] Network errors show error banner
- [ ] Try again link returns to form with pre-filled email
- [ ] Contact support link works (mailto or /support)
- [ ] Form to success transition animates smoothly
- [ ] Mobile layout stacks properly
- [ ] Keyboard navigation works correctly
- [ ] Screen reader announces state changes
- [ ] Focus management works after submission

---

## 14. Future Enhancements

Not required for V1:

1. **Alternative Recovery Methods:** "Use phone number instead"
2. **Security Questions:** As backup recovery method
3. **Rate Limiting UI:** Show cooldown timer
4. **Multi-Factor Recovery:** Send code to verified phone
5. **Account Recovery Flow:** For users without email access
6. **Admin Override:** Support team reset capability
7. **Recovery Audit Log:** Show recent password reset attempts

---

**End of Specification**

This document ensures the forgot password flow is secure, user-friendly, and consistent with FlowTrack's design system while preventing email enumeration attacks.
