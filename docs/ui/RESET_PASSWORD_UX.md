# FlowTrack Reset Password - UI/UX Design Specification

## Overview

This specification defines the password reset completion flow for FlowTrack. Users arrive here via email link and set a new password.

**Backend Endpoint:** POST `/auth/reset-password`

**URL Pattern:** `/auth/reset-password?token=abc123xyz`

**Design Principle:** Secure, clear, with real-time password validation and expiry handling.

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
│                      │        │                                     │
│                      │        │   Set new password                  │
│   [Hero Visual]      │        │   Choose a strong password for      │
│   (Workflow Preview) │        │   your account.                     │
│                      │        │                                     │
│   "Template-First    │        │   New password                      │
│    Automation"       │        │   ┌─────────────────────────────┐   │
│                      │        │   │  ••••••••••        Show     │   │
│   [Social Proof]     │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   ✓ At least 8 characters           │
│                      │        │   ○ Contains a number               │
│                      │        │   ○ Contains uppercase letter       │
│                      │        │                                     │
│                      │        │   Confirm password                  │
│                      │        │   ┌─────────────────────────────┐   │
│                      │        │   │  ••••••••••        Show     │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
│                      │        │   ┌─────────────────────────────┐   │
│                      │        │   │   Reset Password            │   │
│                      │        │   └─────────────────────────────┘   │
│                      │        │                                     │
└──────────────────────┘        └─────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Heading

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
"Set new password"
```

**Alternative Headlines:**

```
"Create new password"
"Choose a new password"
"Reset your password"
```

---

### 3.2 Subtitle/Instructions

```css
font-size: 15px
line-height: 1.6
color: var(--neutral-600)
margin-bottom: 32px
max-width: 400px
```

**Copy:**

```
Choose a strong password for your account.
```

**Alternative Copy:**

```
Enter a new password below. Make it strong and unique.

Your password must be at least 8 characters and include numbers and letters.
```

---

### 3.3 Password Input Fields

#### New Password Field

**Inherits from `LOGIN_UX.md` Section 4.2**

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
padding: 0 80px 0 16px
font-size: 15px
border: 1.5px solid var(--neutral-200)
border-radius: 8px
background: var(--neutral-50)

/* Show/Hide Toggle */
position: absolute
right: 16px
font-size: 13px
color: var(--brand-primary)
cursor: pointer
font-weight: 500
```

**Label Copy:**

```
"New password"
```

**Placeholder:**

```
"Enter new password"
```

**Show/Hide Toggle:**

- Same as login page
- Text: "Show" / "Hide"
- Toggles input type between `password` and `text`

---

#### Password Requirements Checklist

**Inherits from `SIGNUP_UX.md` Section 4.3**

Positioned below new password input:

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

**Requirements:**

```
✓ At least 8 characters
○ Contains a number
○ Contains uppercase letter
```

**Real-Time Validation:**

- Updates as user types
- Each requirement animates when met (circle → checkmark)
- Scale animation (0.8 → 1.0 bounce, 150ms)

---

#### Confirm Password Field

**NEW FIELD** (not in login/signup)

```css
/* Same styling as New Password */
margin-top: 20px;
```

**Label Copy:**

```
"Confirm password"
```

**Placeholder:**

```
"Re-enter new password"
```

**Match Validation:**

- Shows green checkmark when passwords match
- Shows red warning when they don't match (after user types)

**Visual Feedback:**

When passwords match:

```
┌─────────────────────────────────────┐
│  Confirm password               [✓] │  ← Green checkmark icon
│  ••••••••••                    Show │
└─────────────────────────────────────┘
```

When passwords don't match (after blur):

```
┌─────────────────────────────────────┐
│  Confirm password               [⚠]│  ← Red border
│  ••••••••••                    Show │
└─────────────────────────────────────┘
  Passwords don't match                 ← Error message
```

**Error Message Style:**

```css
display: block
margin-top: 6px
font-size: 13px
color: var(--error-500)
font-weight: 400
```

---

### 3.4 Primary Button

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
"Reset Password"
```

**Alternative:**

```
"Set New Password"
"Update Password"
"Save Password"
```

**Loading State:**

```
"Resetting..."
```

**Disabled State:**

- Disabled if password requirements not all met (all ✓ not green)
- Disabled if passwords don't match
- Disabled if either field is empty
- Disabled during submission

---

## 4. Token States

### 4.1 Valid Token (Default State)

**Behavior:**

- Form displays normally
- Token is included in backend request
- User can set new password

---

### 4.2 Expired Token State

**Context:** Token is older than 1 hour

**Backend Response:** 401 Unauthorized with message "Invalid or expired token"

**UI Response:** Replace form with error screen

```
┌─────────────────────────────────────┐
│                                     │
│         [⚠️ Warning Icon]           │
│                                     │
│   Reset link expired                │
│                                     │
│   This password reset link has      │
│   expired for security. Links are   │
│   valid for 1 hour.                 │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Request New Link          │   │
│   └─────────────────────────────┘   │
│                                     │
│   Remember your password?           │
│   Sign in                           │
│                                     │
└─────────────────────────────────────┘
```

---

#### Expired Token Components

**Warning Icon:**

```css
width: 80px
height: 80px
margin: 0 auto 24px
background: rgba(251, 191, 36, 0.1)
border: 2px solid var(--warning-500)
border-radius: 50%
display: flex
align-items: center
justify-content: center

/* Icon */
width: 48px
height: 48px
color: var(--warning-500)
```

**Heading:**

```css
font-size: 32px
font-weight: 700
text-align: center
color: var(--neutral-900)
margin-bottom: 16px
```

**Copy:** "Reset link expired"

**Body Text:**

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
This password reset link has expired for security. Links are valid for 1 hour.
```

**Button:**

```
"Request New Link"
```

**Behavior:**

- Navigates to `/forgot-password`
- Or opens email input modal (same as verification flow)

---

### 4.3 Invalid Token State

**Context:** Token doesn't exist in database or already used

**Backend Response:** 401 Unauthorized with message "Invalid or expired token"

**UI Response:** Same as expired token screen

**Heading Copy:**

```
"Invalid reset link"
```

**Body Copy:**

```
This link doesn't appear to be valid. It may have already been used or is incorrect.
```

---

### 4.4 Already Used Token State

**Context:** Token has `isUsed: true` in database

**Backend Response:** 401 Unauthorized

**UI Response:**

```
┌─────────────────────────────────────┐
│                                     │
│         [✓ Success Icon]            │
│                                     │
│   Password already reset            │
│                                     │
│   This link has already been used   │
│   to reset your password.           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Go to Login               │   │
│   └─────────────────────────────┘   │
│                                     │
│   Forgot again? Request new link    │
│                                     │
└─────────────────────────────────────┘
```

**Success Icon:**

```css
width: 80px
height: 80px
margin: 0 auto 24px
background: rgba(16, 185, 129, 0.1)
border: 2px solid var(--success-500)
border-radius: 50%

/* Icon */
color: var(--success-500)
```

---

## 5. Success State (Password Reset Complete)

### 5.1 Context

**Trigger:** After successful password reset (POST `/auth/reset-password` returns 200 OK)

**Backend Side Effects:**

- Password updated in database
- All user refresh tokens revoked (forces re-login on all devices)
- Reset token marked as used

---

### 5.2 Success Screen Visual

```
┌─────────────────────────────────────┐
│                                     │
│         [✓ Success Icon]            │
│                                     │
│   Password reset successful         │
│                                     │
│   Your password has been changed.   │
│   You can now sign in with your     │
│   new password.                     │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Sign in to FlowTrack      │   │
│   └─────────────────────────────┘   │
│                                     │
│   Auto-redirecting in 3 seconds...  │
│                                     │
└─────────────────────────────────────┘
```

---

### 5.3 Success Screen Components

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
Trigger: Success screen appears
Sequence:
1. Icon scales from 0 → 1.2 → 1.0 (bounce, 400ms)
2. Checkmark draws in with stroke animation (300ms)
3. Subtle pulse (scale 1.0 → 1.05 → 1.0, infinite, 2s)
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
"Password reset successful"
```

**Alternative:**

```
"Password changed!"
"You're all set!"
"Success!"
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
Your password has been changed. You can now sign in with your new password.
```

**Alternative:**

```
All done! Sign in with your new password to access your account.

For security, you've been signed out of all devices. Sign in again to continue.
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
"Sign in to FlowTrack"
```

**Alternative:**

```
"Go to Login"
"Continue to Sign In"
```

**Behavior:**

- Navigates to `/login`
- Or directly opens login modal if using modal-based auth

---

#### Auto-Redirect Countdown

**Inherits from `EMAIL_VERIFICATION_UX.md`**

```css
font-size: 13px
color: var(--neutral-500)
text-align: center
margin-top: 16px

/* Countdown Number */
font-weight: 600
color: var(--brand-primary)
```

**Copy:**

```
"Auto-redirecting in {seconds} seconds..."
```

**Behavior:**

- Countdown: 5 → 4 → 3 → 2 → 1
- At 0: Navigate to `/login`
- Clicking button cancels countdown and navigates immediately

---

## 6. Interaction Flows

### 6.1 Successful Password Reset Flow

```
1. User clicks reset link in email
2. Browser navigates to /auth/reset-password?token=xxx
3. Frontend verifies token exists in URL
4. Form displays (no token validation yet)
5. User enters new password
6. Requirements checklist updates in real-time
7. User enters confirmation password
8. Match indicator shows ✓ when passwords match
9. User clicks "Reset Password"
10. Button enters loading state ("Resetting...")
11. Frontend calls POST /auth/reset-password with:
    { token: "xxx", password: "newPassword123" }
12. Backend validates token, updates password, revokes refresh tokens
13. Backend returns 200 OK
14. Button shows green checkmark (300ms)
15. Form fades out (200ms)
16. Success screen slides in (300ms)
17. Success icon animates
18. Countdown starts (5 seconds)
19. At 0, redirect to /login
```

---

### 6.2 Expired Token Flow

```
1. User clicks old reset link (>1 hour)
2. Browser navigates to /auth/reset-password?token=xxx
3. User fills form and clicks "Reset Password"
4. Backend returns 401 Unauthorized (token expired)
5. Form fades out
6. Error screen displays (expired token)
7. User clicks "Request New Link"
8. Navigate to /forgot-password
```

**Alternative (Early Validation):**

```
1. User clicks old reset link
2. Frontend calls GET /auth/verify-reset-token?token=xxx (optional endpoint)
3. Backend returns 401 (expired)
4. Immediately show error screen (skip form display)
```

---

### 6.3 Password Mismatch Flow

```
1. User enters "Password123" in new password field
2. Requirements show all ✓
3. User enters "DifferentPassword" in confirm field
4. User blurs confirm field
5. Red border appears on confirm field
6. Error message: "Passwords don't match"
7. Submit button remains disabled
8. User corrects confirm field to "Password123"
9. Error clears, green ✓ appears
10. Submit button becomes enabled
```

---

### 6.4 Weak Password Attempt

```
1. User enters "weak" in new password field
2. Requirements show:
   ○ At least 8 characters (not met)
   ○ Contains a number (not met)
   ○ Contains uppercase letter (not met)
3. Submit button remains disabled (grayed out)
4. User cannot submit until all requirements met
```

---

## 7. Error States

### 7.1 Token Validation Errors

| Error Type    | Backend Response         | UI Behavior                            |
| ------------- | ------------------------ | -------------------------------------- |
| Expired       | 401 "Token expired"      | Show expired token screen              |
| Invalid       | 401 "Invalid token"      | Show invalid token screen              |
| Already used  | 401 "Token already used" | Show "already reset" screen            |
| Missing token | -                        | Show error: "Reset link is incomplete" |

---

### 7.2 Password Validation Errors

**Client-Side (Pre-Submit):**

| Validation            | Error Display              |
| --------------------- | -------------------------- |
| Less than 8 chars     | Requirement stays gray (○) |
| No number             | Requirement stays gray (○) |
| No uppercase          | Requirement stays gray (○) |
| Passwords don't match | Red border + error message |
| Empty fields          | Submit button disabled     |

**Server-Side (Rare):**

If client-side validation missed something:

```
┌─────────────────────────────────────────┐
│  ⚠️  Password requirements not met     │
│  Please ensure your password contains  │
│  all required characters.              │
└─────────────────────────────────────────┘
```

---

### 7.3 Network Errors

**Scenario:** Backend unreachable, timeout, or 500 error

**UI Response:**

```
┌─────────────────────────────────────────┐
│  ⚠️  Connection error                  │
│  Please check your internet and try    │
│  again.                                │
└─────────────────────────────────────────┘
```

**Banner Position:** Above form, below heading

**Button State:**

- Returns to enabled state
- User can retry submission

---

## 8. Security Features

### 8.1 Token Handling

**Frontend:**

- Token extracted from URL query parameter
- Never stored in localStorage (stays in URL during session)
- Sent to backend in POST body (not headers)

**Backend Enforcement:**

- Token expiry: 1 hour from creation
- Single-use: Marked as used after successful reset
- All refresh tokens revoked after password change

---

### 8.2 Password Requirements

**Enforced Rules:**

- Minimum 8 characters
- Maximum 128 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain number

**Regex Pattern:**

```regex
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/
```

---

### 8.3 Side Effects Communication

**Important:** After password reset, user is logged out of all devices.

**Communicate this in success message:**

```
Your password has been changed. For security, you've been signed out of all devices.
```

**Or:**

```
Password updated successfully. Sign in with your new password to continue.
```

---

## 9. Responsive Behavior

### Desktop (≥1024px)

- Split-screen layout maintained
- Form max-width: 480px
- Password requirements: Full checklist visible

### Tablet (768px - 1023px)

- Stacked layout
- Brand panel: 200px header
- Form: 48px horizontal padding

### Mobile (<768px)

- Brand panel: 80px header (logo only)
- Form: 24px horizontal padding
- Heading: 32px → 28px
- Button height: 44px → 48px (touch target)
- Password requirements: Compact spacing

---

## 10. Accessibility

### Screen Reader Support

```html
<!-- Form -->
<form aria-label="Reset password form">
  <label for="newPassword">New password</label>
  <input
    id="newPassword"
    type="password"
    aria-required="true"
    aria-describedby="passwordRequirements"
  />

  <div id="passwordRequirements" role="status" aria-live="polite">
    <ul aria-label="Password requirements">
      <li aria-label="Requirement met: At least 8 characters">
        <span aria-hidden="true">✓</span> At least 8 characters
      </li>
      <li aria-label="Requirement not met: Contains a number">
        <span aria-hidden="true">○</span> Contains a number
      </li>
    </ul>
  </div>

  <label for="confirmPassword">Confirm password</label>
  <input
    id="confirmPassword"
    type="password"
    aria-required="true"
    aria-describedby="confirmError"
  />
  <span id="confirmError" role="alert">
    <!-- Error message if mismatch -->
  </span>

  <button type="submit" aria-disabled="true" aria-busy="false">
    Reset Password
  </button>
</form>
```

---

### Keyboard Navigation

**Form:**

1. Tab: Focus new password input
2. Tab: Focus show/hide toggle
3. Tab: Focus confirm password input
4. Tab: Focus show/hide toggle (confirm)
5. Tab: Focus submit button
6. Enter on any input: Submit form (if valid)

**Success Screen:**

1. Tab: Focus "Sign in to FlowTrack" button
2. Enter: Navigate to login

**Error Screen:**

1. Tab: Focus "Request New Link" button
2. Tab: Focus "Sign in" link
3. Enter: Activate focused element

---

### Focus Management

- Page load: Focus moves to new password input
- After submission error: Focus returns to new password input
- After success: Focus moves to success screen heading
- After token error: Focus moves to error screen heading

---

### Color Contrast

All text meets WCAG AA:

- Body text (#374151 on white): 10.4:1 ✓
- Error text (#EF4444 on white): 4.8:1 ✓
- Success checkmark (#10B981 on white): 3.4:1 ✓
- Warning icon (#F59E0B on white): 3.2:1 ✓

---

## 11. Animation Specifications

### 11.1 Password Requirement Animations

```
Trigger: Requirement changes from not met → met
Target: Individual requirement item
Animation:
1. Circle (○) fades out (100ms)
2. Checkmark (✓) scales in 0 → 1.2 → 1.0 (200ms bounce)
3. Color transitions: neutral-400 → success-500 (150ms)
4. Icon shifts right 2px (subtle, 100ms)
```

---

### 11.2 Password Match Indicator

```
Trigger: Confirm password matches new password
Target: Confirm password input
Animation:
1. Green checkmark icon appears (scale 0 → 1, 200ms)
2. Border color: neutral-200 → success-500 (150ms)
3. Subtle glow effect (box-shadow, 200ms)
```

---

### 11.3 Form to Success Transition

```
Trigger: Successful password reset (200 OK)
Duration: 700ms total

Sequence:
1. Button shows green checkmark (200ms)
2. Form fades out (200ms opacity)
3. Success screen slides in from bottom (400ms translateY)
4. Success icon bounces in (400ms scale)
5. Countdown starts
```

---

### 11.4 Error Screen Appearance

```
Trigger: Token validation fails
Duration: 400ms

Sequence:
1. Form fades out (200ms)
2. Error screen fades in (300ms opacity)
3. Warning icon shakes (300ms, translateX ±4px)
```

---

## 12. Copy Variations

### Headlines

**Primary:**

```
"Set new password"
```

**Alternatives:**

```
"Create new password"
"Choose a new password"
"Reset your password"
```

---

### Success Screen

**Primary:**

```
"Password reset successful"
```

**Alternatives:**

```
"Password changed!"
"You're all set!"
"Success! Password updated"
```

---

### Error Screens

**Expired:**

```
"Reset link expired"
"This link is too old"
```

**Invalid:**

```
"Invalid reset link"
"Reset link not found"
```

**Already Used:**

```
"Password already reset"
"This link was already used"
```

---

## 13. Implementation Checklist

- [ ] Form extracts token from URL query parameter
- [ ] New password field has show/hide toggle
- [ ] Confirm password field has show/hide toggle
- [ ] Password requirements update in real-time
- [ ] All requirements must be ✓ to enable submit
- [ ] Confirm field shows match/mismatch indicator
- [ ] Submit button disabled until all validations pass
- [ ] Form handles 401 errors (expired/invalid token)
- [ ] Success screen shows animated checkmark
- [ ] Auto-redirect countdown starts at 5 seconds
- [ ] Clicking button cancels countdown
- [ ] Network errors show error banner
- [ ] Token errors show appropriate error screen
- [ ] Mobile layout works correctly
- [ ] Keyboard navigation functional
- [ ] Screen reader announces state changes
- [ ] Focus management works correctly

---

## 14. Future Enhancements

Not required for V1:

1. **Password Strength Meter:** Visual bar (weak/medium/strong)
2. **Compromised Password Check:** Check against haveibeenpwned API
3. **Password History:** Prevent reusing last 5 passwords
4. **Biometric Setup:** Offer fingerprint/Face ID after reset
5. **Security Alert Email:** Notify user of password change
6. **Multi-Device Notification:** "You were signed out of 3 devices"
7. **Two-Factor Setup:** Prompt to enable 2FA after reset

---

**End of Specification**

This document ensures the password reset completion flow is secure, user-friendly, and consistent with FlowTrack's design system while handling all edge cases (expired tokens, mismatched passwords, network errors).
