# FlowTrack Email Verification - UI/UX Design Specification

## Overview

This specification defines the email verification experience for FlowTrack, covering:

1. Post-registration verification notice
2. Email verification success/error states
3. Resend verification functionality

Maintains complete visual consistency with the "Glass & Graphite" design system.

---

## 1. Design System Inheritance

**Inherits from `LOGIN_UX.md`:**

- Split-screen layout (40/60)
- Color palette (Indigo primary)
- Typography (Inter font stack)
- Component specifications
- Animation timing
- Accessibility standards

---

## 2. Screen 1: Verification Notice (Post-Registration)

### 2.1 Context

**Trigger:** Immediately after successful registration (POST `/auth/register` returns 201)

**Purpose:** Inform user they must verify email before accessing the platform

**Layout:** Centered content card (right panel), brand panel (left)

---

### 2.2 Visual Structure

```
LEFT PANEL (40%)                RIGHT PANEL (60%)
┌──────────────────────┐        ┌─────────────────────────────────────┐
│                      │        │                                     │
│  [FlowTrack Logo]    │        │                                     │
│                      │        │         [✉️ Email Icon]             │
│                      │        │                                     │
│   [Hero Visual]      │        │   Check your email                  │
│   (Workflow Preview) │        │                                     │
│                      │        │   We sent a verification link to    │
│                      │        │   alex@company.com                  │
│   "Template-First    │        │                                     │
│    Automation"       │        │   Click the link in the email to    │
│                      │        │   activate your account and start   │
│   [Social Proof]     │        │   automating.                       │
│                      │        │                                     │
│                      │        │   ┌─────────────────────────────┐   │
│                      │        │   │   Go to Login               │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   Didn't receive it?                │
│                      │        │   Resend verification email         │
│                      │        │                                     │
│                      │        │   ─────────────────────────────     │
│                      │        │                                     │
│                      │        │   💡 Pro tip: Check your spam       │
│                      │        │   folder if you don't see it.       │
│                      │        │                                     │
└──────────────────────┘        └─────────────────────────────────────┘
```

---

### 2.3 Component Specifications

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

**Animation on Enter:**

```
Trigger: Page load
Effect:
1. Icon scales from 0 → 1.0 (300ms ease-out)
2. Background pulses (opacity 0.5 → 1.0, 600ms)
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
letter-spacing: -0.02em
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

**Copy Structure:**

```
We sent a verification link to {user_email}.

Click the link in the email to activate your account and start automating.
```

**Email Highlighting:**

```css
/* User email within text */
font-weight: 600
color: var(--neutral-900)
background: var(--brand-primary-light)
padding: 2px 6px
border-radius: 4px
```

---

#### Primary Button ("Go to Login")

**Inherits from `LOGIN_UX.md` Section 4.3**

```css
width: 100%
max-width: 320px
height: 44px
margin: 0 auto 24px
```

**Copy:**

```
"Go to Login"
```

**Behavior:**

- Navigates to `/login` or `/auth/login`
- Standard button hover/press animations

---

#### Resend Link

```css
/* Container */
text-align: center
margin-bottom: 24px
font-size: 14px

/* Static Text */
color: var(--neutral-600)

/* Link */
color: var(--brand-primary)
font-weight: 500
cursor: pointer
margin-left: 4px
text-decoration: none

/* Hover */
text-decoration: underline
color: var(--brand-primary-hover)

/* Disabled State (during cooldown) */
color: var(--neutral-400)
cursor: not-allowed
opacity: 0.6
```

**Copy:**

```
Didn't receive it? Resend verification email
```

**Interaction Flow:**

1. **Initial State:** Link is clickable
2. **On Click:**
   - Trigger POST `/auth/resend-verification`
   - Link becomes disabled
   - Text changes to "Sending..."
3. **On Success (200 OK):**
   - Show success toast
   - Start 60-second countdown
   - Text: "Resent! Wait 59s before resending again"
4. **Countdown:**
   - Text updates every second: "Wait 58s...", "Wait 57s...", etc.
   - Link remains disabled and grayed out
5. **After 60s:**
   - Link becomes clickable again
   - Text returns to "Resend verification email"

---

#### Pro Tip Box

```css
/* Container */
padding: 12px 16px
background: rgba(79, 70, 229, 0.05)
border-left: 3px solid var(--brand-primary)
border-radius: 8px
margin-top: 24px

/* Icon */
font-size: 16px
margin-right: 8px

/* Text */
font-size: 13px
line-height: 1.5
color: var(--neutral-600)
```

**Copy:**

```
💡 Pro tip: Check your spam folder if you don't see it.
```

---

### 2.4 Resend Success Toast

**Trigger:** After successful resend (200 OK from `/auth/resend-verification`)

```
┌────────────────────────────────────────┐
│  ✓  Verification email sent!          │
│  Check your inbox.                    │
└────────────────────────────────────────┘
```

**Specifications:**

```css
/* Toast Container */
position: fixed
top: 24px
right: 24px
padding: 16px 20px
background: #FFFFFF
border: 1px solid var(--success-500)
border-left: 4px solid var(--success-500)
border-radius: 8px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
z-index: 9999

/* Icon */
color: var(--success-500)
font-size: 20px
margin-right: 12px

/* Text */
font-size: 14px
font-weight: 500
color: var(--neutral-900)
```

**Animation:**

```
Enter: Slide in from right + fade in (300ms ease-out)
Exit: Fade out after 4 seconds (300ms ease-in)
```

---

### 2.5 Resend Error State

**Trigger:** Email already verified (400 Bad Request)

```
┌────────────────────────────────────────┐
│  ⚠️  Email already verified           │
│  You can sign in now.                 │
└────────────────────────────────────────┘
```

**Style:** Same as success toast but with `--warning-500` color

**Behavior:** Auto-dismisses after 4 seconds

---

## 3. Screen 2: Email Verification Success

### 3.1 Context

**Trigger:** User clicks verification link in email

**URL Pattern:** `/auth/verify-email?token=abc123xyz`

**Backend Call:** GET `/auth/verify-email?token=xxx`

**Expected Response:** 200 OK with message "Email verified successfully"

---

### 3.2 Visual Structure (Success)

```
LEFT PANEL (40%)                RIGHT PANEL (60%)
┌──────────────────────┐        ┌─────────────────────────────────────┐
│                      │        │                                     │
│  [FlowTrack Logo]    │        │                                     │
│                      │        │         [✓ Success Icon]            │
│                      │        │                                     │
│   [Hero Visual]      │        │   Email verified!                   │
│                      │        │                                     │
│                      │        │   Your account is now active.       │
│   "Template-First    │        │   Let's get you started with        │
│    Automation"       │        │   FlowTrack.                        │
│                      │        │                                     │
│   [Social Proof]     │        │   ┌─────────────────────────────┐   │
│                      │        │   │   Continue to Login         │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   Auto-redirecting in 3 seconds...  │
│                      │        │                                     │
└──────────────────────┘        └─────────────────────────────────────┘
```

---

### 3.3 Component Specifications (Success)

#### Success Icon

```css
/* Icon Container */
width: 80px
height: 80px
margin: 0 auto 24px
background: linear-gradient(135deg, #10B981 0%, #059669 100%)
border-radius: 50%
display: flex
align-items: center
justify-content: center
box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3)

/* Checkmark Icon */
width: 48px
height: 48px
color: #FFFFFF
```

**Animation:**

```
Trigger: Page load
Sequence:
1. Icon container scales from 0 → 1.2 → 1.0 (bounce, 400ms)
2. Checkmark draws in with stroke animation (300ms)
3. Subtle pulse effect (scale 1.0 → 1.05 → 1.0, infinite, 2s)
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
"Email verified!"
```

**Alternative:**

```
"You're all set!"
"Welcome to FlowTrack!"
```

---

#### Body Text

```css
font-size: 15px
line-height: 1.6
color: var(--neutral-600)
text-align: center
max-width: 360px
margin: 0 auto 32px
```

**Copy:**

```
Your account is now active. Let's get you started with FlowTrack.
```

---

#### Primary Button

```css
width: 100%
max-width: 320px
height: 44px
margin: 0 auto 16px
```

**Copy:**

```
"Continue to Login"
```

**Alternative:**

```
"Sign in to FlowTrack"
"Start Automating"
```

---

#### Auto-Redirect Countdown

```css
/* Text */
font-size: 13px
color: var(--neutral-500)
text-align: center
margin-top: 16px

/* Countdown Number */
font-weight: 600
color: var(--brand-primary)
```

**Copy Pattern:**

```
"Auto-redirecting in {seconds} seconds..."
```

**Behavior:**

- Countdown: 5 → 4 → 3 → 2 → 1
- At 0: Navigate to `/login`
- Clicking button cancels countdown and navigates immediately

---

## 4. Screen 3: Email Verification Error

### 4.1 Context

**Trigger:** Invalid or expired token

**Backend Response:** 400 Bad Request

**Error Scenarios:**

1. Token doesn't exist in database
2. Token expired (>24 hours old)
3. Token already used
4. Malformed token

---

### 4.2 Visual Structure (Error)

```
LEFT PANEL (40%)                RIGHT PANEL (60%)
┌──────────────────────┐        ┌─────────────────────────────────────┐
│                      │        │                                     │
│  [FlowTrack Logo]    │        │                                     │
│                      │        │         [⚠️ Warning Icon]           │
│                      │        │                                     │
│   [Hero Visual]      │        │   Verification link expired         │
│                      │        │                                     │
│                      │        │   This verification link is no      │
│   "Template-First    │        │   longer valid. Request a new one   │
│    Automation"       │        │   to activate your account.         │
│                      │        │                                     │
│   [Social Proof]     │        │   ┌─────────────────────────────┐   │
│                      │        │   │   Request New Link          │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   Already verified? Sign in         │
│                      │        │                                     │
└──────────────────────┘        └─────────────────────────────────────┘
```

---

### 4.3 Component Specifications (Error)

#### Warning Icon

```css
/* Icon Container */
width: 80px
height: 80px
margin: 0 auto 24px
background: rgba(251, 191, 36, 0.1)
border: 2px solid var(--warning-500)
border-radius: 50%
display: flex
align-items: center
justify-content: center

/* Warning Icon */
width: 48px
height: 48px
color: var(--warning-500)
```

**Animation:**

```
Trigger: Page load
Effect: Gentle shake (translateX -4px → 4px, 400ms)
```

---

#### Heading

**Copy Variations by Error Type:**

| Error Type    | Heading Copy                |
| ------------- | --------------------------- |
| Expired token | "Verification link expired" |
| Invalid token | "Invalid verification link" |
| Already used  | "Link already used"         |
| Generic error | "Verification failed"       |

---

#### Body Text

**Copy Variations:**

**Expired:**

```
This verification link is no longer valid. Request a new one to activate your account.
```

**Invalid:**

```
This link doesn't appear to be valid. Please check your email for the correct verification link.
```

**Already Used:**

```
This email has already been verified. You can sign in to your account.
```

---

#### Primary Button

**Copy for Expired/Invalid:**

```
"Request New Link"
```

**Behavior:**

- Opens email input modal (see Section 4.4)
- OR navigates to dedicated resend page

**Copy for Already Verified:**

```
"Go to Login"
```

**Behavior:**

- Navigates to `/login`

---

### 4.4 Resend Email Modal (Alternative Implementation)

**Trigger:** Click "Request New Link" on error screen

```
┌─────────────────────────────────────────────┐
│  Request New Verification Link         [×] │
├─────────────────────────────────────────────┤
│                                             │
│  Enter your email address                   │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  you@example.com                  [@] │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         Send Verification Link        │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Cancel]                                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Specifications:**

```css
/* Modal Overlay */
position: fixed
top: 0
left: 0
width: 100vw
height: 100vh
background: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)
z-index: 9998

/* Modal Container */
position: fixed
top: 50%
left: 50%
transform: translate(-50%, -50%)
width: 90%
max-width: 480px
background: #FFFFFF
border-radius: 12px
padding: 32px
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
z-index: 9999
```

**Animation:**

```
Enter:
- Overlay: Fade in (200ms)
- Modal: Scale 0.9 → 1.0 + fade in (300ms ease-out)

Exit:
- Modal: Scale 1.0 → 0.95 + fade out (200ms ease-in)
- Overlay: Fade out (200ms)
```

---

## 5. Interaction Flows

### 5.1 Successful Verification Flow

```
1. User clicks link in email
2. Browser navigates to /auth/verify-email?token=xxx
3. Frontend calls GET /auth/verify-email?token=xxx
4. Backend returns 200 OK
5. Success icon animates in
6. Countdown starts (5 seconds)
7. At 0, redirect to /login
   OR user clicks button to redirect immediately
```

---

### 5.2 Expired Token Flow

```
1. User clicks old verification link
2. Backend returns 400 Bad Request (expired)
3. Error screen displays with warning icon
4. User clicks "Request New Link"
5. Modal opens with email input
6. User enters email
7. POST /auth/resend-verification
8. Success: Modal closes, toast appears
9. User redirected to "Check Email" screen
```

---

### 5.3 Resend with Cooldown Flow

```
1. User on "Check Email" screen
2. Clicks "Resend verification email"
3. Link text changes to "Sending..."
4. POST /auth/resend-verification returns 200
5. Success toast appears
6. Link enters cooldown state
7. Text: "Resent! Wait 60s..."
8. Countdown decrements every second
9. At 0, link becomes clickable again
```

---

## 6. Error States & Edge Cases

### 6.1 Network Failure During Verification

**Scenario:** Backend unreachable or timeout

**UI Response:**

```
┌─────────────────────────────────────────┐
│  ⚠️  Connection error                  │
│  Please check your internet and try    │
│  again.                                │
└─────────────────────────────────────────┘
```

**Behavior:**

- Show error banner at top of page
- Display "Retry" button below error
- Retry button triggers same GET request

---

### 6.2 User Already Verified Email

**Scenario:** Backend returns 400 "Email already verified"

**UI Response:**

```
Heading: "Email already verified"
Body: "Your account is active. You can sign in now."
Button: "Go to Login" (navigates to /login)
```

---

### 6.3 Resend Rate Limiting

**Scenario:** Backend implements rate limiting (e.g., max 3 emails per hour)

**Backend Response:** 429 Too Many Requests

**UI Response:**

```
Toast:
⚠️  Too many requests
Please wait before requesting another verification email.
```

**Button State:** Disabled for extended time (e.g., 15 minutes)

---

## 7. Responsive Behavior

### Desktop (≥1024px)

- Split-screen layout maintained
- Content max-width: 400px, centered
- Icons at full size (64px/80px)

### Tablet (768px - 1023px)

- Stacked layout
- Brand panel: 200px header
- Content padding: 48px horizontal

### Mobile (<768px)

- Brand panel: 80px header
- Content padding: 24px horizontal
- Heading: 32px → 28px
- Icon size: 64px → 56px
- Button: Full-width (max-width removed)
- Modal: 95% viewport width

---

## 8. Accessibility

### Screen Reader Support

```html
<!-- Success Screen -->
<div role="status" aria-live="polite">
  <h1>Email verified!</h1>
  <p>Your account is now active.</p>
</div>

<!-- Countdown -->
<p aria-live="polite" aria-atomic="true">
  Auto-redirecting in <span aria-label="3 seconds">3</span> seconds
</p>

<!-- Resend Link -->
<button aria-label="Resend verification email" aria-disabled="false">
  Resend verification email
</button>

<!-- During Cooldown -->
<button aria-label="Resend disabled. Wait 45 seconds" aria-disabled="true">
  Wait 45s before resending again
</button>
```

---

### Keyboard Navigation

**Verification Success Screen:**

1. Tab: Skip to "Continue to Login" button
2. Enter: Navigate to login
3. Escape: Cancel auto-redirect countdown

**Error Screen:**

1. Tab: Focus "Request New Link" button
2. Tab: Focus "Already verified? Sign in" link
3. Enter: Activate focused element

**Resend Modal:**

1. Focus traps within modal
2. Tab: Email input → Send button → Cancel
3. Escape: Close modal
4. Enter on input: Submit form

---

## 9. Copy Variations

### Success Screen Headlines

**Primary:**

```
"Email verified!"
```

**Alternatives:**

```
"You're all set!"
"Welcome aboard!"
"Account activated!"
```

### Error Screen Headlines

**Expired:**

```
"Verification link expired"
```

**Alternatives:**

```
"This link is too old"
"Link no longer valid"
```

---

## 10. Email Template Reference

**Subject Line:**

```
Verify your FlowTrack email address
```

**Preview Text:**

```
Click to activate your account and start automating
```

**Button Copy:**

```
Verify Email Address
```

**Link Format:**

```
https://app.flowtrack.com/auth/verify-email?token={verification_token}
```

**Fallback Text:**

```
If the button doesn't work, copy and paste this link:
https://app.flowtrack.com/auth/verify-email?token={token}
```

---

## 11. Implementation Checklist

- [ ] Verification notice screen shows after registration
- [ ] User email is highlighted in verification text
- [ ] Resend link has 60-second cooldown
- [ ] Cooldown countdown updates every second
- [ ] Success screen shows animated checkmark
- [ ] Auto-redirect countdown starts at 5 seconds
- [ ] Clicking button cancels auto-redirect
- [ ] Error screen detects token type (expired/invalid)
- [ ] Toast notifications auto-dismiss after 4 seconds
- [ ] Modal traps focus when open
- [ ] Escape key closes modal
- [ ] Success animation plays on page load
- [ ] All states handle network errors gracefully
- [ ] Screen reader announcements work correctly

---

**End of Specification**

This document covers all email verification scenarios while maintaining complete design consistency with the FlowTrack authentication system.
