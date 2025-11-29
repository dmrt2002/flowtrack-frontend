# BILLING_UX.md

**Comprehensive UI/UX Specification for FlowTrack Billing & Subscription Management**

---

## Table of Contents

1. [Overview & Philosophy](#overview--philosophy)
2. [Visual Strategy & Brand Vibe](#visual-strategy--brand-vibe)
3. [Layout Architecture](#layout-architecture)
4. [Design System Foundations](#design-system-foundations)
5. [Subscription Plan Cards](#subscription-plan-cards)
6. [Current Plan Section](#current-plan-section)
7. [Usage Quotas Visualization](#usage-quotas-visualization)
8. [Billing History Table](#billing-history-table)
9. [Payment Method Management](#payment-method-management)
10. [Stripe Checkout Flow](#stripe-checkout-flow)
11. [Customer Portal Integration](#customer-portal-integration)
12. [Upgrade/Downgrade Flows](#upgradedowngrade-flows)
13. [Trial Period Handling](#trial-period-handling)
14. [Error States & Failed Payments](#error-states--failed-payments)
15. [Loading States & Transitions](#loading-states--transitions)
16. [Micro-interactions & Animations](#micro-interactions--animations)
17. [Responsive Behavior](#responsive-behavior)
18. [Accessibility](#accessibility)
19. [Implementation Checklist](#implementation-checklist)

---

## Overview & Philosophy

### Purpose

The Billing interface is the **financial control center** for FlowTrack users. It must instill confidence, transparency, and trust while making subscription management effortless. Users should feel in control of their spending, understand exactly what they're paying for, and be able to upgrade/downgrade without friction.

### Design Philosophy

- **Transparency First**: Show exactly what users are paying for and what they're getting
- **No Hidden Costs**: Display all pricing clearly with no surprises
- **Easy Upgrades**: Make it trivial to unlock more features when needed
- **Graceful Downgrades**: Don't punish users for downgrading
- **Usage Visibility**: Always show how much of their quota they're using
- **Stripe Native**: Leverage Stripe's battle-tested checkout and portal experiences
- **Trust Signals**: Use professional design to build confidence in financial transactions

---

## Visual Strategy & Brand Vibe

### Tone

- **Professional but approachable** - This is about money, so be serious but not intimidating
- **Transparent** - No dark patterns, no tricks, just honest pricing
- **Empowering** - Users should feel in control of their subscription
- **Confident** - Design that says "we're a real business you can trust"

### Color Psychology for Billing

- **Primary (Indigo)**: Trust, professionalism, premium features
- **Green**: Success states, active subscriptions, positive usage
- **Amber**: Warnings, approaching quota limits, trial ending soon
- **Red**: Critical alerts, failed payments, quota exceeded
- **Neutral grays**: Professional, clean, data-focused

### Typography for Pricing

- **Large, bold numbers** for prices - make them impossible to miss
- **Clear currency symbols** - always show $ before amounts
- **Subtle "per month/year"** - don't hide the billing cycle
- **Medium weight** for plan names - confident but not shouty
- **Regular weight** for feature lists - readable, scannable

---

## Layout Architecture

### Billing Tab Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Settings > Billing                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  CURRENT PLAN SECTION                                         │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  [Plan Badge]  Professional Plan                        │  │  │
│  │  │  $49/month • Renews on Dec 15, 2025                     │  │  │
│  │  │  [Manage Subscription] [Cancel Plan]                    │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  USAGE QUOTAS                                                 │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Active Workflows    [████████░░] 8/10                  │  │  │
│  │  │  Monthly Leads       [██████░░░░] 2,450/5,000           │  │  │
│  │  │  Team Members        [██████████] 5/5  (Limit reached)  │  │  │
│  │  │  Email Sends/month   [████░░░░░░] 1,200/3,000           │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  AVAILABLE PLANS                                              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │  Free    │  │  Starter │  │    Pro   │  │Enterprise│     │  │
│  │  │  $0/mo   │  │  $29/mo  │  │  $49/mo  │  │  Custom  │     │  │
│  │  │  [Current│  │  [Upgrade│  │  [Current│  │  [Contact│     │  │
│  │  │   Plan]  │  │    Now]  │  │   Plan]  │  │    Us]   │     │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  BILLING HISTORY                                              │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Date         Description           Amount    Invoice   │  │  │
│  │  │  Dec 1, 2024  Professional Plan     $49.00    [↓ PDF]   │  │  │
│  │  │  Nov 1, 2024  Professional Plan     $49.00    [↓ PDF]   │  │  │
│  │  │  Oct 1, 2024  Starter Plan          $29.00    [↓ PDF]   │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PAYMENT METHOD                                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  [Visa] •••• 4242  Expires 12/25                        │  │  │
│  │  │  [Update Payment Method]                                │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Spacing & Rhythm

- **Section gaps**: 32px between major sections
- **Card padding**: 24px all around
- **Content spacing**: 16px between related items
- **Tight spacing**: 8px for grouped information (like price + cycle)

---

## Design System Foundations

### Color Palette

```typescript
const billingColors = {
  // Plan Tier Colors
  free: {
    bg: 'bg-neutral-50',
    border: 'border-neutral-200',
    badge: 'bg-neutral-100 text-neutral-700',
  },
  starter: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  pro: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  enterprise: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },

  // Status Colors
  active: 'bg-green-100 text-green-700 border-green-200',
  trial: 'bg-amber-100 text-amber-700 border-amber-200',
  canceled: 'bg-red-100 text-red-700 border-red-200',
  pastDue: 'bg-red-100 text-red-700 border-red-200',

  // Usage Quota Colors
  quotaSafe: 'bg-green-500', // 0-70% used
  quotaWarning: 'bg-amber-500', // 70-90% used
  quotaDanger: 'bg-red-500', // 90-100% used
  quotaExceeded: 'bg-red-600', // over 100%
};
```

### Typography Scale

```typescript
const billingTypography = {
  // Pricing
  price: 'text-4xl font-bold text-neutral-900',
  priceSymbol: 'text-2xl font-bold text-neutral-700',
  priceCycle: 'text-sm font-normal text-neutral-600',

  // Plan Names
  planName: 'text-2xl font-semibold text-neutral-900',
  planNameCard: 'text-lg font-semibold text-neutral-900',

  // Sections
  sectionTitle: 'text-xl font-semibold text-neutral-900',
  subsectionTitle: 'text-base font-semibold text-neutral-900',

  // Features
  featureItem: 'text-sm font-normal text-neutral-700',
  featureHighlight: 'text-sm font-medium text-neutral-900',

  // Usage
  usageLabel: 'text-sm font-medium text-neutral-700',
  usageValue: 'text-sm font-semibold text-neutral-900',
  usageLimit: 'text-xs font-normal text-neutral-500',

  // Billing History
  tableHeader: 'text-xs font-semibold text-neutral-600 uppercase tracking-wide',
  tableCell: 'text-sm font-normal text-neutral-700',
  tableAmount: 'text-sm font-semibold text-neutral-900',
};
```

### Shadows & Depth

```typescript
const billingShadows = {
  planCard: 'shadow-sm hover:shadow-md',
  currentPlanCard: 'shadow-md',
  upgradeCTA: 'shadow-lg hover:shadow-xl',
  modal: 'shadow-2xl',
};
```

---

## Subscription Plan Cards

### Card Anatomy

```
┌─────────────────────────────────┐
│  [RECOMMENDED] (conditional)    │  ← Badge for recommended plan
│                                 │
│  Professional                   │  ← Plan name (text-lg font-semibold)
│                                 │
│  $49 /month                     │  ← Price (text-4xl font-bold) + cycle
│  or $470/year (save $118)       │  ← Annual option (text-sm)
│                                 │
│  ─────────────────────────────  │  ← Divider
│                                 │
│  Everything in Starter, plus:   │  ← Intro text
│  ✓ 10 active workflows          │  ← Feature list with checkmarks
│  ✓ 5,000 leads/month            │
│  ✓ 5 team members               │
│  ✓ 3,000 emails/month           │
│  ✓ Advanced analytics           │
│  ✓ Priority support             │
│                                 │
│  [Current Plan]                 │  ← Button (state-dependent)
│                                 │
└─────────────────────────────────┘
```

### Card Dimensions

- **Width**: Equal width in grid (1/4 on desktop, 1/2 on tablet, full on mobile)
- **Min Height**: 480px to maintain alignment
- **Padding**: 24px all around
- **Border Radius**: 12px (rounded-xl)
- **Border**: 2px solid (color depends on tier and state)

### Card States

#### Default State (Not Current Plan)

```typescript
className = `
  bg-white border-2 border-neutral-200 rounded-xl p-6
  hover:border-primary hover:shadow-md
  transition-all duration-200
`;
```

#### Current Plan State

```typescript
className = `
  bg-indigo-50 border-2 border-indigo-500 rounded-xl p-6
  shadow-md relative
`;
// Add "Current Plan" badge at top-right
```

#### Recommended Plan State

```typescript
// Add badge at top
<div className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-2">
  RECOMMENDED
</div>
```

### Button States per Plan

| User's Plan | Free                      | Starter                   | Pro                       | Enterprise               |
| ----------- | ------------------------- | ------------------------- | ------------------------- | ------------------------ |
| Free        | "Current Plan" (disabled) | "Upgrade Now" (primary)   | "Upgrade Now" (primary)   | "Contact Us" (secondary) |
| Starter     | "Downgrade" (secondary)   | "Current Plan" (disabled) | "Upgrade Now" (primary)   | "Contact Us" (secondary) |
| Pro         | "Downgrade" (secondary)   | "Downgrade" (secondary)   | "Current Plan" (disabled) | "Contact Us" (secondary) |

### Feature List Presentation

```typescript
// Checkmark icon for included features
<div className="flex items-start gap-2 mb-2">
  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
  <span className="text-sm text-neutral-700">10 active workflows</span>
</div>

// Highlight limits in bold
<div className="flex items-start gap-2 mb-2">
  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
  <span className="text-sm text-neutral-700">
    <strong className="font-semibold text-neutral-900">5,000</strong> leads/month
  </span>
</div>
```

### Annual vs Monthly Toggle

```
┌─────────────────────────────────────────┐
│  Billing Cycle:                         │
│  ┌─────────────┬─────────────┐          │
│  │  Monthly    │  Annual     │          │
│  │             │  Save 20%   │  ← Badge │
│  └─────────────┴─────────────┘          │
└─────────────────────────────────────────┘
```

**Position**: Above plan cards, centered
**Interaction**: Toggle between monthly/annual pricing display
**Visual**: Segmented control with "Save X%" badge on annual option

---

## Current Plan Section

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Current Subscription                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌────────┐                                               │  │
│  │  │[Active]│  Professional Plan                            │  │
│  │  └────────┘                                               │  │
│  │                                                           │  │
│  │  $49.00 per month                                         │  │
│  │  Next billing date: December 15, 2025                     │  │
│  │                                                           │  │
│  │  ┌────────────────────┐  ┌──────────────────┐            │  │
│  │  │  Manage via Stripe │  │  Cancel Plan     │            │  │
│  │  └────────────────────┘  └──────────────────┘            │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Status Badges

```typescript
// Active subscription
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
  Active
</span>

// Trial period
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
  Trial - 5 days left
</span>

// Past due / Payment failed
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
  Payment Failed
</span>

// Canceled (but active until period end)
<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
  Canceled - Active until Dec 15
</span>
```

### Button Actions

#### Manage via Stripe Button

```typescript
<button
  onClick={openStripeCustomerPortal}
  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
>
  Manage via Stripe
</button>
```

**What it does**: Opens Stripe Customer Portal in new tab where users can:

- Update payment method
- View all invoices
- Update billing email
- Cancel subscription
- Download receipts

#### Cancel Plan Button

```typescript
<button
  onClick={showCancelConfirmation}
  className="px-4 py-2 bg-white text-neutral-700 border-2 border-neutral-300 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
>
  Cancel Plan
</button>
```

**What it does**: Shows confirmation modal before canceling subscription

---

## Usage Quotas Visualization

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Usage This Month                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Active Workflows                           8 / 10        │  │
│  │  ┌───────────────────────────────────────────────────┐    │  │
│  │  │████████████████████████████████████░░░░░░░░░░░░░░│ 80%│  │
│  │  └───────────────────────────────────────────────────┘    │  │
│  │                                                           │  │
│  │  Monthly Leads                          2,450 / 5,000    │  │
│  │  ┌───────────────────────────────────────────────────┐    │  │
│  │  │████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░│ 49%│  │
│  │  └───────────────────────────────────────────────────┘    │  │
│  │                                                           │  │
│  │  Team Members                                5 / 5       │  │
│  │  ┌───────────────────────────────────────────────────┐    │  │
│  │  │██████████████████████████████████████████████████│ 100%│  │
│  │  └───────────────────────────────────────────────────┘    │  │
│  │  ⚠ Limit reached. Upgrade to add more members.          │  │
│  │                                                           │  │
│  │  Email Sends (Monthly)                   1,200 / 3,000   │  │
│  │  ┌───────────────────────────────────────────────────┐    │  │
│  │  │████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ 40%│  │
│  │  └───────────────────────────────────────────────────┘    │  │
│  │  Resets on December 1, 2025                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Progress Bar Component

```typescript
interface UsageBarProps {
  label: string;
  current: number;
  limit: number;
  resetDate?: string;
  showUpgradePrompt?: boolean;
}

function UsageBar({ label, current, limit, resetDate, showUpgradePrompt }: UsageBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isWarning = percentage >= 70 && percentage < 90;
  const isDanger = percentage >= 90;
  const isExceeded = percentage >= 100;

  const barColor = isExceeded
    ? 'bg-red-600'
    : isDanger
    ? 'bg-red-500'
    : isWarning
    ? 'bg-amber-500'
    : 'bg-green-500';

  return (
    <div className="mb-6 last:mb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-semibold text-neutral-900">
          {current.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage */}
      <div className="mt-1 text-right">
        <span className={`text-xs font-medium ${isDanger ? 'text-red-600' : 'text-neutral-600'}`}>
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Warning/Upgrade Messages */}
      {isExceeded && showUpgradePrompt && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Limit reached</p>
            <p className="text-xs text-red-700 mt-1">
              Upgrade your plan to add more {label.toLowerCase()}.
            </p>
          </div>
          <button className="text-xs font-semibold text-red-700 hover:text-red-900">
            Upgrade
          </button>
        </div>
      )}

      {isWarning && !isExceeded && (
        <div className="mt-2 flex items-center gap-2 text-xs text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>Approaching limit</span>
        </div>
      )}

      {resetDate && (
        <div className="mt-2 text-xs text-neutral-500">
          Resets on {resetDate}
        </div>
      )}
    </div>
  );
}
```

### Usage Data Structure

```typescript
interface UsageQuota {
  id: string;
  metricType: 'WORKFLOWS' | 'LEADS' | 'TEAM_MEMBERS' | 'EMAIL_SENDS';
  currentUsage: number;
  limit: number;
  resetType: 'NONE' | 'MONTHLY' | 'BILLING_CYCLE';
  nextResetDate?: string;
}
```

---

## Billing History Table

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  Billing History                                                    │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  DATE         DESCRIPTION           AMOUNT    STATUS  INVOICE │  │
│  │  ─────────────────────────────────────────────────────────────│  │
│  │  Dec 1, 2024  Professional Plan     $49.00    Paid    [↓ PDF]│  │
│  │  Nov 1, 2024  Professional Plan     $49.00    Paid    [↓ PDF]│  │
│  │  Oct 1, 2024  Starter Plan          $29.00    Paid    [↓ PDF]│  │
│  │  Sep 15, 2024 Plan Upgrade          $20.00    Paid    [↓ PDF]│  │
│  │  Sep 1, 2024  Starter Plan          $29.00    Failed  [Retry]│  │
│  │  Aug 1, 2024  Starter Plan          $29.00    Paid    [↓ PDF]│  │
│  │  ─────────────────────────────────────────────────────────────│  │
│  │  [Load More]                                                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Table Component

```typescript
interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  status: 'paid' | 'failed' | 'pending' | 'refunded';
  stripeInvoiceUrl: string;
  stripePdfUrl?: string;
}

function BillingHistoryTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Description
            </th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Amount
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Status
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-neutral-600 uppercase tracking-wide">
              Invoice
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-neutral-50">
              <td className="px-6 py-4 text-sm text-neutral-700 whitespace-nowrap">
                {formatDate(invoice.date)}
              </td>
              <td className="px-6 py-4 text-sm text-neutral-700">
                {invoice.description}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-neutral-900 text-right whitespace-nowrap">
                ${(invoice.amount / 100).toFixed(2)}
              </td>
              <td className="px-6 py-4 text-center">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
              <td className="px-6 py-4 text-center">
                {invoice.stripePdfUrl ? (
                  <a
                    href={invoice.stripePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </a>
                ) : (
                  <span className="text-sm text-neutral-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Status Badge Component

```typescript
function InvoiceStatusBadge({ status }: { status: Invoice['status'] }) {
  const styles = {
    paid: 'bg-green-100 text-green-700 border-green-200',
    failed: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    refunded: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  const icons = {
    paid: <Check className="h-3 w-3" />,
    failed: <X className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    refunded: <RefreshCw className="h-3 w-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

### Empty State

```
┌─────────────────────────────────────────────────────────────────┐
│  Billing History                                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │                    [Receipt Icon]                         │  │
│  │                                                           │  │
│  │                 No billing history yet                    │  │
│  │                                                           │  │
│  │  Your invoices and payment history will appear here      │  │
│  │  after your first billing cycle.                         │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Payment Method Management

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Payment Method                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌──────┐                                                 │  │
│  │  │ VISA │  •••• •••• •••• 4242                            │  │
│  │  └──────┘                                                 │  │
│  │            Expires 12/2025                                │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Update via Stripe   │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Card Brand Icons

```typescript
const cardBrands = {
  visa: <VisaIcon />,
  mastercard: <MastercardIcon />,
  amex: <AmexIcon />,
  discover: <DiscoverIcon />,
  unknown: <CreditCardIcon />,
};

function PaymentMethodDisplay({ paymentMethod }: { paymentMethod: StripePaymentMethod }) {
  const brand = paymentMethod.card?.brand || 'unknown';
  const last4 = paymentMethod.card?.last4 || '****';
  const expMonth = paymentMethod.card?.exp_month;
  const expYear = paymentMethod.card?.exp_year;

  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-16 bg-neutral-100 rounded flex items-center justify-center">
        {cardBrands[brand]}
      </div>
      <div>
        <div className="text-base font-medium text-neutral-900">
          •••• •••• •••• {last4}
        </div>
        <div className="text-sm text-neutral-600">
          Expires {expMonth}/{expYear}
        </div>
      </div>
    </div>
  );
}
```

### No Payment Method State

```
┌─────────────────────────────────────────────────────────────────┐
│  Payment Method                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  No payment method on file                               │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Add Payment Method  │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stripe Checkout Flow

### Upgrade Flow

**Step 1: User clicks "Upgrade Now" on plan card**

```typescript
async function handleUpgrade(planId: string) {
  setIsLoading(true);

  try {
    // Create Stripe Checkout session
    const response = await fetch('/api/v1/billing/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        successUrl: `${window.location.origin}/settings?tab=billing&checkout=success`,
        cancelUrl: `${window.location.origin}/settings?tab=billing&checkout=canceled`,
      }),
    });

    const { sessionId } = await response.json();

    // Redirect to Stripe Checkout
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
    await stripe.redirectToCheckout({ sessionId });
  } catch (error) {
    toast.error('Failed to start checkout. Please try again.');
  } finally {
    setIsLoading(false);
  }
}
```

**Step 2: Loading State During Redirect**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                     [Spinner Animation]                         │
│                                                                 │
│              Redirecting to secure checkout...                  │
│                                                                 │
│  You'll be taken to Stripe's secure payment page in a moment.  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Step 3: User completes payment on Stripe Checkout**

- Stripe handles all payment collection
- User enters card details on Stripe's secure page
- Stripe validates payment and creates subscription

**Step 4: Return to FlowTrack with Success**

URL: `https://app.flowtrack.com/settings?tab=billing&checkout=success`

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     [Success Icon]                        │  │
│  │                                                           │  │
│  │              Subscription Activated!                      │  │
│  │                                                           │  │
│  │  You're now on the Professional plan.                    │  │
│  │  Your new features are ready to use.                     │  │
│  │                                                           │  │
│  │  ┌─────────────────┐                                     │  │
│  │  │  Get Started    │                                     │  │
│  │  └─────────────────┘                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Step 5: Return with Cancellation**

URL: `https://app.flowtrack.com/settings?tab=billing&checkout=canceled`

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     [Info Icon]                           │  │
│  │                                                           │  │
│  │              Checkout Canceled                            │  │
│  │                                                           │  │
│  │  No charges were made.                                    │  │
│  │  You can upgrade anytime from this page.                 │  │
│  │                                                           │  │
│  │  ┌─────────────────┐                                     │  │
│  │  │  Dismiss        │                                     │  │
│  │  └─────────────────┘                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Success/Cancel Toast Handling

```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const checkoutStatus = params.get('checkout');

  if (checkoutStatus === 'success') {
    toast.success('Subscription activated successfully!', {
      description: 'Your new plan features are now available.',
      duration: 5000,
    });
    // Clean up URL
    window.history.replaceState({}, '', '/settings?tab=billing');
    // Refresh subscription data
    refetchSubscription();
  } else if (checkoutStatus === 'canceled') {
    toast.info('Checkout canceled', {
      description: 'No charges were made. You can upgrade anytime.',
      duration: 5000,
    });
    // Clean up URL
    window.history.replaceState({}, '', '/settings?tab=billing');
  }
}, []);
```

---

## Customer Portal Integration

### Opening Customer Portal

```typescript
async function openStripeCustomerPortal() {
  setIsLoading(true);

  try {
    const response = await fetch('/api/v1/billing/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/settings?tab=billing`,
      }),
    });

    const { url } = await response.json();

    // Open portal in new tab
    window.open(url, '_blank');
  } catch (error) {
    toast.error('Failed to open customer portal. Please try again.');
  } finally {
    setIsLoading(false);
  }
}
```

### What Users Can Do in Portal

- Update payment method
- View and download all invoices
- Update billing email and address
- Cancel subscription
- View upcoming invoices
- Update billing details

### Portal Button Placement

- Primary location: Current Plan section ("Manage via Stripe" button)
- Secondary location: Payment Method section ("Update via Stripe" button)
- Both open same portal, different tabs focused

---

## Upgrade/Downgrade Flows

### Immediate Upgrade (Proration)

**Scenario**: User on Starter ($29/mo) upgrades to Pro ($49/mo) mid-cycle

**Flow**:

1. User clicks "Upgrade Now" on Pro plan
2. Redirect to Stripe Checkout
3. Stripe shows prorated charge: $10 (difference for remaining days)
4. User completes payment
5. Subscription immediately upgraded
6. Next invoice will be full $49

**UI Feedback**:

```
┌─────────────────────────────────────────────────────────────────┐
│  ✓ Upgraded to Professional                                    │
│                                                                 │
│  Your plan has been upgraded immediately.                      │
│  You were charged $10 for the remaining days in this cycle.    │
│  Next billing: $49.00 on December 15, 2025                     │
└─────────────────────────────────────────────────────────────────┘
```

### Scheduled Downgrade (End of Period)

**Scenario**: User on Pro ($49/mo) downgrades to Starter ($29/mo)

**Flow**:

1. User clicks "Downgrade" on Starter plan
2. Show confirmation modal with warning
3. If confirmed, schedule downgrade for end of billing period
4. User keeps Pro features until period ends
5. Automatic downgrade on next billing date

**Confirmation Modal**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Downgrade to Starter Plan?                                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ⚠ You'll lose these features:                           │  │
│  │                                                           │  │
│  │  • Advanced analytics                                     │  │
│  │  • Priority support                                       │  │
│  │  • 5 workflows (you currently have 8 active)             │  │
│  │  • 1,000 leads/month (you have 2,450 this month)         │  │
│  │                                                           │  │
│  │  You'll keep Pro features until December 15, 2025.       │  │
│  │  After that, you'll be billed $29/month.                 │  │
│  │                                                           │  │
│  │  ┌────────────┐  ┌────────────────────────┐             │  │
│  │  │  Cancel    │  │  Confirm Downgrade     │             │  │
│  │  └────────────┘  └────────────────────────┘             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**UI After Scheduled Downgrade**:

```
┌─────────────────────────────────────────────────────────────────┐
│  Current Subscription                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Active] Professional Plan                               │  │
│  │                                                           │  │
│  │  ⚠ Scheduled to downgrade to Starter on Dec 15, 2025     │  │
│  │                                                           │  │
│  │  $49.00 per month (until downgrade)                      │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Cancel Downgrade    │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Downgrade Validation

**Check for blockers before allowing downgrade**:

```typescript
async function validateDowngrade(targetPlanId: string) {
  const response = await fetch(`/api/v1/billing/validate-downgrade/${targetPlanId}`);
  const { canDowngrade, blockers } = await response.json();

  if (!canDowngrade) {
    showDowngradeBlockedModal(blockers);
    return false;
  }

  return true;
}

// Blocker Modal
function DowngradeBlockedModal({ blockers }: { blockers: DowngradeBlocker[] }) {
  return (
    <Modal>
      <div className="p-6">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900 mb-2 text-center">
          Cannot Downgrade Yet
        </h3>
        <p className="text-sm text-neutral-600 mb-4 text-center">
          Please resolve these issues before downgrading:
        </p>

        <ul className="space-y-3 mb-6">
          {blockers.map((blocker) => (
            <li key={blocker.type} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">{blocker.title}</p>
                <p className="text-xs text-red-700 mt-1">{blocker.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium">
          I Understand
        </button>
      </div>
    </Modal>
  );
}

// Example blockers:
const exampleBlockers = [
  {
    type: 'ACTIVE_WORKFLOWS_EXCEEDED',
    title: 'Too many active workflows',
    description: 'You have 8 active workflows. Starter plan allows 3. Please deactivate 5 workflows.',
  },
  {
    type: 'TEAM_MEMBERS_EXCEEDED',
    title: 'Too many team members',
    description: 'You have 5 team members. Starter plan allows 1. Please remove 4 members.',
  },
];
```

---

## Trial Period Handling

### Trial Active State

```
┌─────────────────────────────────────────────────────────────────┐
│  Current Subscription                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Trial] Professional Plan                                │  │
│  │                                                           │  │
│  │  🎉 Free trial - 12 days remaining                        │  │
│  │                                                           │  │
│  │  Trial ends December 15, 2025                            │  │
│  │  You'll be charged $49/month after the trial.            │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Add Payment Method  │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Trial Ending Soon (3 days or less)

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠ Trial Ending Soon                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Your trial ends in 2 days (December 15, 2025)           │  │
│  │                                                           │  │
│  │  Add a payment method to continue using Professional     │  │
│  │  features after your trial ends.                         │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐  ┌──────────────────┐          │  │
│  │  │  Add Payment Method  │  │  View Plans      │          │  │
│  │  └──────────────────────┘  └──────────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Trial Ended (No Payment Method)

```
┌─────────────────────────────────────────────────────────────────┐
│  Trial Expired                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Your trial ended on December 15, 2025                   │  │
│  │                                                           │  │
│  │  You've been moved to the Free plan.                     │  │
│  │                                                           │  │
│  │  Subscribe to a paid plan to regain access to:           │  │
│  │  • Advanced workflows                                     │  │
│  │  • Unlimited leads                                        │  │
│  │  • Team collaboration                                     │  │
│  │  • Priority support                                       │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Choose a Plan       │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Banner Placement

- Show trial status banner at the **top of the Billing tab**
- Also show a **global app banner** when trial has ≤3 days remaining
- Banner should be dismissible but reappear on next session

---

## Error States & Failed Payments

### Payment Failed Banner

```
┌─────────────────────────────────────────────────────────────────┐
│  ❌ Payment Failed                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Your payment for $49.00 failed on December 1, 2025.     │  │
│  │                                                           │  │
│  │  Please update your payment method to avoid service      │  │
│  │  interruption. You have 7 days before your account is    │  │
│  │  downgraded to the Free plan.                            │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐  ┌──────────────────┐          │  │
│  │  │  Update Payment      │  │  Retry Payment   │          │  │
│  │  └──────────────────────┘  └──────────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Past Due State

```
┌─────────────────────────────────────────────────────────────────┐
│  Current Subscription                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Past Due] Professional Plan                             │  │
│  │                                                           │  │
│  │  ⚠ Payment failed - Account at risk                      │  │
│  │                                                           │  │
│  │  Failed charge: $49.00 on December 1, 2025               │  │
│  │  Grace period ends: December 8, 2025                     │  │
│  │                                                           │  │
│  │  Update your payment method or retry the charge to       │  │
│  │  keep your subscription active.                          │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐  ┌──────────────────┐          │  │
│  │  │  Update Payment      │  │  Retry Charge    │          │  │
│  │  └──────────────────────┘  └──────────────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Retry Payment Flow

```typescript
async function retryPayment() {
  setIsRetrying(true);

  try {
    const response = await fetch('/api/v1/billing/retry-payment', {
      method: 'POST',
    });

    const { success, error } = await response.json();

    if (success) {
      toast.success('Payment successful!', {
        description: 'Your subscription is now active.',
      });
      refetchSubscription();
    } else {
      toast.error('Payment failed', {
        description: error || 'Please update your payment method.',
      });
    }
  } catch (error) {
    toast.error('Failed to retry payment. Please try again.');
  } finally {
    setIsRetrying(false);
  }
}
```

### Generic Error States

**API Error (Failed to Load)**:

```
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    [Alert Icon]                           │  │
│  │                                                           │  │
│  │          Failed to load billing information               │  │
│  │                                                           │  │
│  │  We couldn't retrieve your subscription details.         │  │
│  │  Please try again.                                        │  │
│  │                                                           │  │
│  │  ┌──────────────────────┐                                │  │
│  │  │  Retry                │                                │  │
│  │  └──────────────────────┘                                │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Stripe Integration Error**:

```typescript
if (stripeError) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-red-900">
            Billing System Unavailable
          </h3>
          <p className="text-sm text-red-700 mt-1">
            We're experiencing issues with our billing provider. Please try again in a few minutes.
          </p>
          {stripeError.message && (
            <p className="text-xs text-red-600 mt-2 font-mono">
              Error: {stripeError.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## Loading States & Transitions

### Initial Load (Skeleton)

```
┌─────────────────────────────────────────────────────────────────┐
│  Current Subscription                                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ┌────────────────────────────────────────────┐          │  │
│  │  │  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │          │  │
│  │  └────────────────────────────────────────────┘          │  │
│  │  ┌────────────────────────┐                              │  │
│  │  │  ▓▓▓▓▓▓▓▓░░░░░░░░░░░░  │                              │  │
│  │  └────────────────────────┘                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Available Plans                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │       │
│  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │  │  ▓▓▓▓▓▓  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Button Loading States

```typescript
// Upgrade button loading
<button
  disabled={isLoading}
  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isLoading ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Processing...
    </span>
  ) : (
    'Upgrade Now'
  )}
</button>

// Stripe redirect loading
<button
  disabled={isRedirecting}
  className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium"
>
  {isRedirecting ? (
    <span className="flex items-center justify-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      Redirecting to Stripe...
    </span>
  ) : (
    'Manage via Stripe'
  )}
</button>
```

### Usage Quota Loading

```typescript
// Show skeleton bars while loading
{isLoadingUsage ? (
  <div className="space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2"></div>
        <div className="h-2 bg-neutral-200 rounded w-full"></div>
      </div>
    ))}
  </div>
) : (
  <UsageQuotaList quotas={quotas} />
)}
```

---

## Micro-interactions & Animations

### Plan Card Hover Effect

```typescript
// Subtle lift and border color change on hover
className = `
  transition-all duration-200 ease-out
  hover:-translate-y-1
  hover:shadow-lg
  hover:border-primary
`;
```

### Progress Bar Animation

```typescript
// Smooth width transition when usage updates
<div
  className="h-full bg-green-500 transition-all duration-500 ease-out"
  style={{ width: `${percentage}%` }}
/>
```

### Success Checkmark Animation

```typescript
// Animated checkmark on successful upgrade
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
>
  <Check className="h-16 w-16 text-green-600" />
</motion.div>
```

### Toast Notifications

```typescript
// Success toast
toast.success('Subscription updated!', {
  description: 'Your changes have been saved.',
  duration: 3000,
});

// Error toast
toast.error('Payment failed', {
  description: 'Please update your payment method.',
  duration: 5000,
  action: {
    label: 'Update',
    onClick: () => openStripeCustomerPortal(),
  },
});

// Info toast
toast.info('Downgrade scheduled', {
  description: 'Your plan will change at the end of the billing period.',
  duration: 4000,
});
```

### Button Press Animation

```typescript
// Subtle scale on click
className = `
  active:scale-95
  transition-transform duration-100
`;
```

---

## Responsive Behavior

### Breakpoints

```typescript
const breakpoints = {
  mobile: '640px', // 1 column for plans
  tablet: '768px', // 2 columns for plans
  desktop: '1024px', // 4 columns for plans
};
```

### Plan Cards Grid

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {plans.map((plan) => (
    <PlanCard key={plan.id} plan={plan} />
  ))}
</div>
```

### Billing History Table

**Desktop**: Full table with all columns

```
| Date | Description | Amount | Status | Invoice |
```

**Tablet**: Hide Status column, combine into description

```
| Date | Description (with status badge) | Amount | Invoice |
```

**Mobile**: Stack layout (no table)

```
┌─────────────────────────────┐
│  Dec 1, 2024   [Paid]       │
│  Professional Plan          │
│  $49.00         [↓ PDF]     │
└─────────────────────────────┘
```

### Usage Quotas

**All sizes**: Maintain same layout but adjust font sizes and spacing

- Mobile: Smaller labels, tighter spacing
- Desktop: Comfortable spacing for readability

---

## Accessibility

### Keyboard Navigation

- **Tab order**: Plan cards → CTA buttons → Billing history → Payment method
- **Focus indicators**: 2px blue ring on all interactive elements
- **Escape key**: Close modals
- **Enter/Space**: Activate buttons

### Screen Readers

```typescript
// Plan card aria labels
<div
  role="article"
  aria-labelledby="plan-name"
  aria-describedby="plan-features"
>
  <h3 id="plan-name">Professional Plan</h3>
  <ul id="plan-features" aria-label="Plan features">
    <li>10 active workflows</li>
    <li>5,000 leads per month</li>
  </ul>
</div>

// Usage progress bars
<div
  role="progressbar"
  aria-valuenow={current}
  aria-valuemin={0}
  aria-valuemax={limit}
  aria-label={`${label}: ${current} of ${limit} used`}
>
  {/* Visual bar */}
</div>

// Status badges
<span
  role="status"
  aria-label={`Subscription status: ${status}`}
  className="..."
>
  {status}
</span>
```

### Color Contrast

All text meets WCAG AA standards:

- White text on primary (indigo-600): 4.5:1
- Dark text on light backgrounds: 7:1+
- Status badges: Minimum 4.5:1

### Focus Management

```typescript
// Return focus to trigger button after modal closes
const previousFocusRef = useRef<HTMLElement | null>(null);

function openModal() {
  previousFocusRef.current = document.activeElement as HTMLElement;
  setIsOpen(true);
}

function closeModal() {
  setIsOpen(false);
  previousFocusRef.current?.focus();
}
```

---

## Implementation Checklist

### Backend (NestJS)

**Billing Module Setup**

- [ ] Install Stripe SDK: `npm install stripe`
- [ ] Create `src/modules/billing/billing.module.ts`
- [ ] Create `src/modules/billing/billing.controller.ts`
- [ ] Create `src/modules/billing/billing.service.ts`
- [ ] Add Stripe webhook handler endpoint
- [ ] Configure Stripe webhook signature verification

**Subscription Plans**

- [ ] Create subscription plan seeder (Free, Starter, Pro, Enterprise)
- [ ] Add plan features and quotas to database
- [ ] Implement `GET /api/v1/billing/plans` endpoint

**Checkout & Subscriptions**

- [ ] Implement `POST /api/v1/billing/create-checkout-session`
- [ ] Implement `POST /api/v1/billing/create-portal-session`
- [ ] Handle Stripe webhook: `checkout.session.completed`
- [ ] Handle Stripe webhook: `customer.subscription.updated`
- [ ] Handle Stripe webhook: `customer.subscription.deleted`
- [ ] Handle Stripe webhook: `invoice.payment_succeeded`
- [ ] Handle Stripe webhook: `invoice.payment_failed`

**Usage Tracking**

- [ ] Implement `GET /api/v1/billing/usage` endpoint
- [ ] Create background job to update usage quotas daily
- [ ] Implement quota enforcement in workflow/lead creation

**Subscription Management**

- [ ] Implement `GET /api/v1/billing/subscription` endpoint
- [ ] Implement `POST /api/v1/billing/validate-downgrade/:planId`
- [ ] Implement `POST /api/v1/billing/retry-payment`
- [ ] Implement `GET /api/v1/billing/invoices` endpoint

### Frontend (Next.js + React)

**Shadcn Components**

- [ ] Install required components: `npx shadcn@latest add card button badge progress toast tabs skeleton`
- [ ] Add custom Skeleton component for loading states
- [ ] Add custom Modal/Dialog component

**Billing Feature Structure**

- [ ] Create `src/features/billing/` directory
- [ ] Create `src/features/billing/types/` for TypeScript types
- [ ] Create `src/features/billing/components/` for UI components
- [ ] Create `src/features/billing/hooks/` for data fetching
- [ ] Create `src/features/billing/utils/` for helpers

**API Hooks**

- [ ] Create `usePlans()` hook with React Query
- [ ] Create `useSubscription()` hook with React Query
- [ ] Create `useUsageQuotas()` hook with React Query
- [ ] Create `useInvoices()` hook with React Query
- [ ] Create `useCreateCheckoutSession()` mutation
- [ ] Create `useCreatePortalSession()` mutation
- [ ] Create `useRetryPayment()` mutation

**Components**

- [ ] Build `SubscriptionPlanCard` component
- [ ] Build `CurrentPlanSection` component
- [ ] Build `UsageQuotaBar` component
- [ ] Build `UsageQuotaList` component
- [ ] Build `BillingHistoryTable` component
- [ ] Build `PaymentMethodDisplay` component
- [ ] Build `BillingCycleToggle` component (monthly/annual)
- [ ] Build `DowngradeConfirmationModal` component
- [ ] Build `TrialBanner` component
- [ ] Build `PaymentFailedBanner` component

**Main Billing Tab**

- [ ] Create `BillingSection.tsx` in Settings
- [ ] Integrate all child components
- [ ] Handle URL params for checkout success/cancel
- [ ] Implement Stripe redirect flows
- [ ] Add loading skeletons
- [ ] Add error boundaries

**Stripe Integration**

- [ ] Install: `npm install @stripe/stripe-js`
- [ ] Configure Stripe publishable key in env
- [ ] Implement Stripe Checkout redirect
- [ ] Test checkout success flow
- [ ] Test checkout cancel flow
- [ ] Test Customer Portal opening

**Testing**

- [ ] Test all subscription states: free, trial, active, past_due, canceled
- [ ] Test upgrade flow end-to-end
- [ ] Test downgrade flow with validation
- [ ] Test payment retry flow
- [ ] Test Stripe Customer Portal
- [ ] Test responsive layouts on mobile/tablet/desktop
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test all error states

**Polish**

- [ ] Add micro-animations to plan cards
- [ ] Add progress bar animations
- [ ] Add success/error toast notifications
- [ ] Test all edge cases (no payment method, expired card, etc.)
- [ ] Optimize performance (lazy loading, code splitting)

---

## Final Notes

### Stripe Best Practices

1. **Never store card details** - Always use Stripe Checkout or Elements
2. **Use webhooks** - Don't rely on client-side success callbacks
3. **Handle all webhook events** - subscription lifecycle has many states
4. **Test with Stripe CLI** - Use `stripe listen --forward-to localhost:3000/api/v1/billing/webhooks`
5. **Use idempotency keys** - Prevent duplicate charges
6. **Show prorated amounts** - Be transparent about upgrade costs

### Security Considerations

- **Verify workspace ownership** before allowing subscription changes
- **Validate webhook signatures** to prevent spoofing
- **Use HTTPS** for all Stripe communications
- **Log all billing events** for audit trail
- **Rate limit** billing endpoints to prevent abuse

### User Experience Priorities

1. **Transparency** - Users should never be surprised by charges
2. **Control** - Make it easy to upgrade, downgrade, or cancel
3. **Clarity** - Show exactly what they're getting at each tier
4. **Trust** - Professional design builds confidence
5. **Speed** - Minimize clicks to complete actions

---

**End of BILLING_UX.md**
