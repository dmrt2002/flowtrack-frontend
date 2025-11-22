# FlowTrack Authentication UI/UX - Complete Index

## Overview

This document serves as the master index for all FlowTrack authentication screens. All specifications maintain complete design consistency with the "Glass & Graphite" design system and the FlowTrack product vision.

**Version:** 1.0
**Last Updated:** 2025-11-22
**Design System:** Glass & Graphite
**Typography:** Inter (System Font Stack)

---

## 1. Complete Authentication Flow Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    FlowTrack Authentication                      │
└─────────────────────────────────────────────────────────────────┘

REGISTRATION PATH                      LOGIN PATH
─────────────────                      ──────────

1. Sign Up Page                        1. Login Page
   └─> POST /auth/register               └─> POST /auth/login
       ↓                                      ↓
2. Email Verification Notice            2. Dashboard
   └─> Click link in email                 (Authenticated)
       ↓
3. Email Verification Success
   └─> GET /auth/verify-email?token=xxx
       ↓
4. Login Page
   └─> POST /auth/login
       ↓
5. Dashboard

FORGOT PASSWORD PATH
────────────────────

1. Login Page
   └─> "Forgot password?" link
       ↓
2. Forgot Password Page
   └─> POST /auth/forgot-password
       ↓
3. Check Email Notice
   └─> Click link in email
       ↓
4. Reset Password Page
   └─> POST /auth/reset-password
       ↓
5. Password Reset Success
   └─> Redirect to Login
       ↓
6. Login Page
   └─> Sign in with new password
```

---

## 2. UX Specification Documents

### 2.1 Core Authentication Screens

| Screen                 | File                       | Backend Endpoints                                            | Status      |
| ---------------------- | -------------------------- | ------------------------------------------------------------ | ----------- |
| **Login**              | `LOGIN_UX.md`              | `POST /auth/login`<br>`POST /auth/refresh`                   | ✅ Complete |
| **Sign Up**            | `SIGNUP_UX.md`             | `POST /auth/register`                                        | ✅ Complete |
| **Email Verification** | `EMAIL_VERIFICATION_UX.md` | `GET /auth/verify-email`<br>`POST /auth/resend-verification` | ✅ Complete |
| **Forgot Password**    | `FORGOT_PASSWORD_UX.md`    | `POST /auth/forgot-password`                                 | ✅ Complete |
| **Reset Password**     | `RESET_PASSWORD_UX.md`     | `POST /auth/reset-password`                                  | ✅ Complete |

---

## 3. Design System Overview

### 3.1 Shared Layout Structure

**All authentication screens use:**

- Split-screen layout (40% brand panel / 60% form panel)
- Desktop breakpoint: ≥1024px maintains split
- Tablet: <1024px stacks vertically
- Mobile: <768px compact header only

**Left Panel (Brand Panel):**

- Gradient background: `linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)`
- Logo placement: Top-left, 40px padding
- Hero visual: Workflow preview with glassmorphism
- Tagline: "Template-First Automation for Solopreneurs"
- Social proof: "10,000+ leads automated"

**Right Panel (Form Panel):**

- Max-width: 480px
- Centered vertically and horizontally
- Padding: 32px (desktop), 24px (mobile)
- Background: #FFFFFF

---

### 3.2 Color Palette

```css
/* Primary Brand */
--brand-primary: #4f46e5 /* Indigo 600 */ --brand-primary-hover: #4338ca
  /* Indigo 700 */ --brand-primary-light: #eef2ff /* Indigo 50 */
  /* Neutral Scale */ --neutral-50: #f9fafb --neutral-100: #f3f4f6
  --neutral-200: #e5e7eb --neutral-300: #d1d5db --neutral-400: #9ca3af
  --neutral-500: #6b7280 --neutral-600: #4b5563 --neutral-700: #374151
  --neutral-900: #111827 /* Semantic Colors */ --success-500: #10b981
  --error-500: #ef4444 --warning-500: #f59e0b /* Backgrounds */
  --bg-page: #ffffff --bg-form-panel: #ffffff
  --bg-brand-panel: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
```

---

### 3.3 Typography Scale

```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* H2 - Page Heading */
font-size: 32px (desktop) / 28px (mobile)
font-weight: 700
line-height: 1.2
color: var(--neutral-900)
letter-spacing: -0.02em

/* H3 - Subtitle */
font-size: 16px
font-weight: 400
line-height: 1.5
color: var(--neutral-500)

/* Body Text */
font-size: 15px
font-weight: 400
line-height: 1.6
color: var(--neutral-700)

/* Input Labels */
font-size: 14px
font-weight: 500
line-height: 1.4
color: var(--neutral-700)

/* Helper Text */
font-size: 13px
font-weight: 400
line-height: 1.4
color: var(--neutral-500)

/* Legal Text */
font-size: 12px
line-height: 1.6
color: var(--neutral-500)
```

---

### 3.4 Component Specifications

#### Input Fields

```css
/* Base State */
width: 100%
height: 44px (desktop) / 48px (mobile - touch target)
padding: 0 48px 0 16px
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

/* Icon (right-aligned) */
position: absolute
right: 16px
width: 20px
height: 20px
color: var(--neutral-400)
```

---

#### Primary Buttons

```css
/* Base State */
width: 100%
height: 44px (desktop) / 48px (mobile)
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

/* Loading State */
opacity: 0.8
cursor: wait
/* Show spinner (20px, white) */

/* Disabled State */
background: var(--neutral-300)
color: var(--neutral-500)
cursor: not-allowed
transform: none
```

---

#### Secondary Buttons (OAuth)

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

/* Hover State */
border-color: var(--neutral-300)
background: var(--neutral-50)

/* Icon (left-aligned) */
position: absolute
left: 16px
width: 20px
height: 20px
```

---

### 3.5 Animation Timing

```css
/* Standard Transitions */
--transition-fast: 100ms ease --transition-base: 150ms ease
  --transition-slow: 300ms ease /* Specific Animations */ Input Focus: 150ms
  ease-out Button Hover: 150ms ease-out Button Press: 100ms ease-in Page
  Transitions: 300ms ease-out Error Shake: 400ms ease-in-out Success Icon: 400ms
  cubic-bezier(bounce) Auto-redirect Countdown: 1s linear (per second);
```

---

## 4. Screen-Specific Features

### 4.1 Login Page (`LOGIN_UX.md`)

**Unique Features:**

- OAuth button: "Sign in with Google"
- "Forgot password?" link (right-aligned below password)
- "Don't have an account? Sign up" alternate action
- Rate limiting: 5 failed attempts per 15 minutes

**Backend Integration:**

- POST `/auth/login` → Returns access token + refresh token
- POST `/auth/refresh` → Refresh access token when expired

**Error Handling:**

- 401: Invalid credentials or unverified email
- 429: Rate limit exceeded (show remaining attempts)

---

### 4.2 Sign Up Page (`SIGNUP_UX.md`)

**Unique Features:**

- Full name input (or first/last name split)
- Real-time password requirements checklist
- Legal agreement text with links
- Post-registration success screen

**Password Requirements:**

- ✓ At least 8 characters
- ✓ Contains a number
- ✓ Contains uppercase letter

**Backend Integration:**

- POST `/auth/register` → Returns 201 Created
- Shows success screen: "Check your email"

**Error Handling:**

- 409 Conflict: Email already exists (show "Sign in instead?" link)
- 400 Bad Request: Password validation failed

---

### 4.3 Email Verification (`EMAIL_VERIFICATION_UX.md`)

**Screens:**

1. **Verification Notice** (post-registration)
2. **Verification Success** (after clicking link)
3. **Verification Error** (expired/invalid token)

**Unique Features:**

- Resend verification email with 60-second cooldown
- Auto-redirect countdown (5 seconds)
- Pro tip: "Check spam folder"

**Backend Integration:**

- GET `/auth/verify-email?token=xxx` → Returns 200 OK or 400 Bad Request
- POST `/auth/resend-verification` → Sends new email

**Error Handling:**

- 400: Token expired (>24 hours)
- 400: Token already used
- 400: Email already verified

---

### 4.4 Forgot Password (`FORGOT_PASSWORD_UX.md`)

**Unique Features:**

- Back navigation to login
- Security-first copy (anti-enumeration)
- Always shows success screen (regardless of email existence)

**Backend Integration:**

- POST `/auth/forgot-password` → Always returns 200 OK
- Message: "If the email exists, a reset link has been sent"

**Security:**

- No indication if email exists (prevents enumeration)
- Same response time for existing/non-existing emails
- 1-hour token expiry

---

### 4.5 Reset Password (`RESET_PASSWORD_UX.md`)

**Unique Features:**

- New password field with requirements checklist
- Confirm password field with match indicator
- Token validation (expired/invalid/used)
- Success screen with auto-redirect

**Password Matching:**

- Green checkmark when passwords match
- Red border + error when they don't match

**Backend Integration:**

- POST `/auth/reset-password` → Returns 200 OK
- Side effect: All refresh tokens revoked

**Token States:**

- Valid: Form displays normally
- Expired (>1 hour): Show error screen
- Invalid: Show error screen
- Already used: Show "password already reset" screen

---

## 5. Common UI Patterns

### 5.1 Success Icons

**Used in:**

- Email verification success
- Password reset success
- "Already verified" screens

```css
width: 80px
height: 80px
background: linear-gradient(135deg, #10B981 0%, #059669 100%)
border-radius: 50%
box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3)

/* Animation */
scale: 0 → 1.2 → 1.0 (bounce, 400ms)
```

---

### 5.2 Warning Icons

**Used in:**

- Token expired screens
- Invalid link screens
- Error states

```css
width: 80px
height: 80px
background: rgba(251, 191, 36, 0.1)
border: 2px solid var(--warning-500)
border-radius: 50%

/* Animation */
shake: translateX ±4px (400ms)
```

---

### 5.3 Email Icons

**Used in:**

- Verification notice
- Forgot password success
- "Check email" screens

```css
width: 64px
height: 64px
background: var(--brand-primary-light)
border-radius: 50%
color: var(--brand-primary)

/* Animation */
scale: 0 → 1.0 with pulse (300ms)
```

---

### 5.4 Pro Tip Boxes

**Used in:**

- Verification notice: "Check spam folder"
- Forgot password success: "Allow 5 minutes"

```css
padding: 12px 16px
background: rgba(79, 70, 229, 0.05)
border-left: 3px solid var(--brand-primary)
border-radius: 8px
font-size: 13px
line-height: 1.5
color: var(--neutral-600)
```

---

### 5.5 Error Banners

**Used in:**

- Network errors
- Form-level validation errors
- Rate limiting warnings

```css
padding: 12px 16px
background: rgba(239, 68, 68, 0.1)
border-left: 4px solid var(--error-500)
border-radius: 8px
font-size: 14px
color: var(--error-500)
```

---

### 5.6 Success Toasts

**Used in:**

- Verification email resent
- Password reset email sent
- Temporary confirmations

```css
/* Container */
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

/* Animation */
Enter: Slide from right + fade (300ms)
Exit: Fade after 4 seconds (300ms)
```

---

## 6. Backend API Integration Summary

### 6.1 Public Endpoints (No Authentication Required)

| Method | Endpoint                    | Purpose                   | Success Response    | Error Codes                           |
| ------ | --------------------------- | ------------------------- | ------------------- | ------------------------------------- |
| POST   | `/auth/register`            | Create new account        | 201 Created         | 409 (email exists), 400 (validation)  |
| POST   | `/auth/login`               | Authenticate user         | 200 OK + tokens     | 401 (invalid), 429 (rate limit)       |
| POST   | `/auth/refresh`             | Refresh access token      | 200 OK + new tokens | 401 (invalid token)                   |
| POST   | `/auth/forgot-password`     | Request reset link        | 200 OK (always)     | -                                     |
| POST   | `/auth/reset-password`      | Set new password          | 200 OK              | 401 (invalid token), 400 (validation) |
| GET    | `/auth/verify-email`        | Verify email address      | 200 OK              | 400 (invalid/expired)                 |
| POST   | `/auth/resend-verification` | Resend verification email | 200 OK              | 400 (already verified)                |

### 6.2 Protected Endpoints (Require Authentication)

| Method | Endpoint           | Purpose              | Auth Type    | Response           |
| ------ | ------------------ | -------------------- | ------------ | ------------------ |
| GET    | `/auth/me`         | Get current user     | JWT or Clerk | 200 OK + user data |
| POST   | `/auth/logout`     | Revoke refresh token | JWT or Clerk | 200 OK             |
| POST   | `/auth/logout-all` | Revoke all tokens    | JWT or Clerk | 200 OK             |

---

## 7. OAuth Integration (Clerk)

### 7.1 OAuth Flow

**Frontend:**

1. User clicks "Sign in with Google" or "Sign up with Google"
2. Clerk SDK handles OAuth popup
3. Clerk returns session token
4. Frontend sends token to backend
5. Backend validates with Clerk
6. Backend creates/syncs user in database
7. Frontend receives user data

**Backend Endpoints:**

- All protected endpoints accept Clerk tokens via `Authorization: Bearer <clerk_token>`
- First API call with Clerk token auto-creates user

### 7.2 Dual Auth Support

**FlowTrack supports both:**

- Native email/password authentication
- Clerk OAuth (Google, GitHub, etc.)

**Frontend Implementation:**

- Login page has toggle: "Social Login" vs "Email/Password"
- Sign up page has same toggle
- Protected routes accept both auth methods

---

## 8. Security Features

### 8.1 Password Security

- Algorithm: Argon2id
- Memory: 64 MB
- Time cost: 3 iterations
- Parallelism: 4 threads
- Min length: 8 characters
- Max length: 128 characters
- Requirements: Uppercase, lowercase, number

### 8.2 Token Security

**Access Tokens (JWT):**

- Expiry: 15 minutes
- Algorithm: HS256
- Claims: userId, email
- Storage: Client-side (memory/localStorage)

**Refresh Tokens:**

- Expiry: 7 days
- Storage: Database (SHA-256 hashed)
- Rotation: New token on each refresh
- Revocation: Single token or all user tokens

**Reset Tokens:**

- Expiry: 1 hour
- Single-use: Marked as used after reset
- Storage: Database (plain text, unique index)

**Verification Tokens:**

- Expiry: 24 hours
- Format: 32-byte cryptographic random hex
- Storage: User table (plain text)

### 8.3 Rate Limiting

**Login Attempts:**

- Limit: 5 failed attempts
- Window: 15 minutes
- Tracking: By email + IP address
- Response: 429 with remaining attempts

**Email Resend:**

- Cooldown: 60 seconds between requests
- Enforced: Client-side countdown
- Future: Backend rate limiting (3 per hour)

### 8.4 Anti-Enumeration

**Forgot Password:**

- Always returns 200 OK
- Same message regardless of email existence
- Same response time (no timing attacks)

**Registration:**

- Only reveals "email exists" error (necessary for UX)
- Alternative: Auto-login if user exists (less secure)

---

## 9. Responsive Breakpoints

### 9.1 Breakpoint Strategy

```css
/* Desktop */
@media (min-width: 1024px) {
  /* Split-screen layout (40/60) */
  /* Form max-width: 480px */
  /* Brand panel: Full visual experience */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Stacked layout */
  /* Brand panel: 200px header */
  /* Form: 48px horizontal padding */
}

/* Mobile */
@media (max-width: 767px) {
  /* Brand panel: 80px header (logo only) */
  /* Form: 24px horizontal padding */
  /* H2: 32px → 28px */
  /* Buttons: 48px height (touch target) */
}
```

### 9.2 Mobile Adaptations

**All Screens:**

- Brand panel collapses to compact header
- Form full-width with reduced padding
- Larger touch targets (48px buttons)
- Font sizes slightly reduced
- Simplified animations (reduce motion)

**Sign Up Page:**

- First/Last name inputs stack vertically (1 column)
- Password requirements: Compact spacing

**Reset Password:**

- New/Confirm password fields full-width
- Requirements checklist: Reduced padding

---

## 10. Accessibility Compliance

### 10.1 WCAG AA Standards

**Color Contrast:**

- All text meets 4.5:1 minimum (AA standard)
- Large text meets 3:1 minimum
- Interactive elements have visible focus states

**Keyboard Navigation:**

- All forms navigable via Tab/Shift+Tab
- Enter key submits forms
- Escape key closes modals
- Focus indicators: 3px ring (brand-primary-light)

**Screen Readers:**

- All inputs have associated `<label>` elements
- Error messages use `aria-describedby`
- Loading states use `aria-busy`
- Dynamic content uses `aria-live` regions
- Required fields marked with `aria-required`

### 10.2 Focus Management

**Best Practices:**

- Page load: Focus moves to first input
- After submission: Focus moves to success/error content
- After error: Focus returns to first invalid input
- Modal open: Focus trapped within modal
- Modal close: Focus returns to trigger element

---

## 11. Implementation Roadmap

### 11.1 Phase 1: Core Authentication (MVP)

**Priority: P0 (Critical)**

- [ ] Login page (email/password only)
- [ ] Sign up page (email/password only)
- [ ] Email verification flow
- [ ] Forgot password flow
- [ ] Reset password flow

**Timeline:** Week 1-2

---

### 11.2 Phase 2: OAuth Integration

**Priority: P1 (High)**

- [ ] Clerk SDK integration
- [ ] "Sign in with Google" button
- [ ] "Sign up with Google" button
- [ ] Dual auth context (native + Clerk)
- [ ] Protected route handling

**Timeline:** Week 3

---

### 11.3 Phase 3: Polish & Edge Cases

**Priority: P2 (Medium)**

- [ ] Success animations
- [ ] Error state refinements
- [ ] Toast notifications
- [ ] Auto-redirect countdowns
- [ ] Responsive testing
- [ ] Accessibility audit

**Timeline:** Week 4

---

### 11.4 Phase 4: Future Enhancements

**Priority: P3 (Nice-to-Have)**

- [ ] Password strength meter
- [ ] Magic link authentication
- [ ] Two-factor authentication (2FA)
- [ ] Social proof carousel
- [ ] Dark mode variant
- [ ] Localization (i18n)

**Timeline:** Post-MVP

---

## 12. Testing Checklist

### 12.1 Functional Testing

**Login:**

- [ ] Valid credentials login successfully
- [ ] Invalid credentials show error
- [ ] Unverified email shows error
- [ ] Rate limiting after 5 failed attempts
- [ ] OAuth login works
- [ ] "Forgot password" link navigates correctly

**Sign Up:**

- [ ] Valid registration creates account
- [ ] Duplicate email shows error
- [ ] Password requirements validate correctly
- [ ] All checkmarks animate on completion
- [ ] Success screen shows after registration
- [ ] Verification email sent

**Email Verification:**

- [ ] Valid token verifies email
- [ ] Expired token shows error
- [ ] Invalid token shows error
- [ ] Resend link works with cooldown
- [ ] Cooldown countdown updates every second

**Forgot Password:**

- [ ] Email input triggers success screen
- [ ] Reset email sent (if email exists)
- [ ] Non-existent email still shows success (security)
- [ ] "Try again" returns to form

**Reset Password:**

- [ ] Valid token allows password reset
- [ ] Expired token shows error
- [ ] Password requirements validate
- [ ] Confirm password must match
- [ ] Success screen shows after reset
- [ ] User can login with new password

---

### 12.2 Responsive Testing

**Devices:**

- [ ] Desktop (1920×1080)
- [ ] Laptop (1440×900)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667 - iPhone SE)
- [ ] Mobile (390×844 - iPhone 12/13)

**Browsers:**

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

### 12.3 Accessibility Testing

**Tools:**

- [ ] WAVE (WebAIM)
- [ ] axe DevTools
- [ ] Lighthouse Accessibility Audit
- [ ] Screen reader testing (NVDA/JAWS/VoiceOver)

**Manual Tests:**

- [ ] Keyboard navigation (Tab order)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announcements correct
- [ ] Error messages announced
- [ ] Loading states announced

---

## 13. Copy Bank

### 13.1 Headlines

**Login:**

- "Welcome back"
- "Sign in to FlowTrack"
- "Access your account"

**Sign Up:**

- "Create your account"
- "Join FlowTrack"
- "Get started with FlowTrack"

**Verification:**

- "Check your email"
- "Email verified!"
- "You're all set!"

**Forgot Password:**

- "Reset your password"
- "Forgot your password?"
- "Can't sign in?"

**Reset Password:**

- "Set new password"
- "Create new password"
- "Password reset successful"

---

### 13.2 Subtitles

**Login:**

- "Enter your credentials to access your automation dashboard"
- "Welcome back! Enter your details to continue"

**Sign Up:**

- "Start automating your leads in under 10 minutes"
- "Join 10,000+ solopreneurs automating their workflows"

**Verification:**

- "We sent a verification link to {email}"
- "Your account is now active"

**Forgot Password:**

- "Enter your email and we'll send you instructions"
- "No worries! We'll email you reset instructions"

**Reset Password:**

- "Choose a strong password for your account"
- "Enter a new password below"

---

### 13.3 Button Labels

**Primary Actions:**

- Login: "Sign in" / "Continue"
- Sign Up: "Create account" / "Get started"
- Verification: "Go to Login" / "Continue"
- Forgot: "Send Reset Link" / "Continue"
- Reset: "Reset Password" / "Save Password"

**Secondary Actions:**

- "Back to login"
- "Request new link"
- "Try again"
- "Contact support"

**OAuth:**

- "Sign in with Google"
- "Sign up with Google"

---

## 14. Design Assets Required

### 14.1 Icons

**System Icons (20×20px):**

- Mail (email input)
- Lock (password input)
- Eye / Eye-off (show/hide password)
- Check circle (success)
- Warning triangle (error)
- Alert circle (info)
- X circle (close)

**Brand Icons (32×32px):**

- Google logo (OAuth button)
- FlowTrack logo (header)

**Large Icons (64-80px):**

- Email envelope (verification screens)
- Checkmark circle (success screens)
- Warning triangle (error screens)

---

### 14.2 Illustrations

**Brand Panel Hero Visual:**

- Workflow preview (React Flow miniature)
- Glassmorphism card container
- Animated nodes with connecting lines
- Size: 400×360px
- Format: SVG or high-res PNG

**Alternative:**

- Abstract automation illustration
- Gradient mesh with brand colors
- Size: 360×320px

---

## 15. Environment Variables

### 15.1 Frontend (.env)

```bash
# API Configuration
VITE_API_URL=http://localhost:3000

# Clerk OAuth (Optional)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Feature Flags
VITE_ENABLE_OAUTH=true
VITE_ENABLE_EMAIL_AUTH=true
```

### 15.2 Backend (.env)

```bash
# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=noreply@flowtrack.app
SMTP_FROM_NAME=FlowTrack

# Application URLs
APP_URL=http://localhost:3001

# Clerk OAuth
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## 16. Related Documentation

**Backend:**

- `backend/docs/authentication/AUTHENTICATION.md` - API specification
- Prisma schema - Database models

**Product:**

- `FLOWTRACK.md` - Product vision and features
- `UX.md` - Overall FlowTrack UX specification

**Frontend:**

- Component implementations (to be created)
- State management (auth context)
- API client setup

---

## 17. Version History

| Version | Date       | Changes                                          | Author |
| ------- | ---------- | ------------------------------------------------ | ------ |
| 1.0     | 2025-11-22 | Initial complete authentication UX specification | -      |

---

**End of Index**

This master index provides a complete reference for implementing FlowTrack's authentication system with full design consistency and backend integration.
