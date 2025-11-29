# TEAM_MANAGEMENT_UX.md

**Comprehensive UI/UX Specification for FlowTrack Team Management**

---

## Table of Contents

1. [Overview & Philosophy](#overview--philosophy)
2. [Visual Strategy & Brand Vibe](#visual-strategy--brand-vibe)
3. [Layout Architecture](#layout-architecture)
4. [Design System Foundations](#design-system-foundations)
5. [Team Members List](#team-members-list)
6. [Invite Member Modal](#invite-member-modal)
7. [Role Management & Permissions](#role-management--permissions)
8. [Member Actions Menu](#member-actions-menu)
9. [Remove Member Confirmation](#remove-member-confirmation)
10. [Transfer Ownership Flow](#transfer-ownership-flow)
11. [Leave Workspace Flow](#leave-workspace-flow)
12. [Empty States](#empty-states)
13. [Error States](#error-states)
14. [Loading States](#loading-states)
15. [Micro-interactions & Animations](#micro-interactions--animations)
16. [Responsive Behavior](#responsive-behavior)
17. [Accessibility](#accessibility)
18. [Implementation Checklist](#implementation-checklist)

---

## Overview & Philosophy

### Purpose

The Team Management interface enables **workspace collaboration** at scale. It provides workspace owners and admins the tools to invite team members, manage permissions, and maintain control over who has access to their workflows, leads, and data.

### Design Philosophy

- **Clear Hierarchy**: Make it obvious who owns the workspace and who has what permissions
- **Safe Actions**: Destructive actions (remove, transfer ownership) require confirmation
- **Invite Simplicity**: Make inviting new members frictionless
- **Role Clarity**: Each role's capabilities should be immediately understandable
- **Self-Service**: Members should be able to see their own role and leave if needed
- **Trust & Control**: Owners feel in control, members feel trusted

### User Roles (from database schema)

```typescript
enum WorkspaceMemberRole {
  owner   // Full control, can transfer ownership, delete workspace
  admin   // Can manage members, workflows, settings (except billing/ownership)
  member  // Can create and edit workflows, manage leads
  viewer  // Read-only access to workflows and leads
}
```

---

## Visual Strategy & Brand Vibe

### Tone

- **Collaborative** - This is about working together
- **Respectful** - Honor the hierarchy without being rigid
- **Clear** - No confusion about who can do what
- **Welcoming** - Make inviting new members feel positive

### Color Psychology

- **Primary (Indigo)**: Action buttons, owner badge
- **Green**: Success states, active members
- **Amber**: Pending invitations
- **Red**: Remove actions, destructive confirmations
- **Neutral grays**: Professional, clean member list

### Typography

- **Member names**: Medium weight, readable (font-medium)
- **Roles**: Smaller, subtle but clear (text-xs uppercase)
- **Email addresses**: Regular weight, secondary color
- **Headings**: Semibold, clear hierarchy

---

## Layout Architecture

### Team Tab Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Settings > Team                                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  TEAM HEADER                                                  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Team Members (5 / 10)             [+ Invite Member]    │  │  │
│  │  │  You're using 5 of your 10 available seats             │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ACTIVE MEMBERS LIST                                          │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  [Avatar] John Doe               [OWNER]    [•••]       │  │  │
│  │  │           john@example.com                              │  │  │
│  │  │           Joined Dec 1, 2024                            │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  [Avatar] Jane Smith             [ADMIN]    [•••]       │  │  │
│  │  │           jane@example.com                              │  │  │
│  │  │           Joined Dec 5, 2024                            │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  [Avatar] Bob Johnson            [MEMBER]   [•••]       │  │  │
│  │  │           bob@example.com                               │  │  │
│  │  │           Joined Dec 10, 2024                           │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PENDING INVITATIONS (2)                                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  [Email] sarah@example.com       [PENDING]  [Cancel]    │  │  │
│  │  │           Invited Dec 15, 2024 by John Doe              │  │  │
│  │  ├─────────────────────────────────────────────────────────┤  │  │
│  │  │  [Email] mike@example.com        [PENDING]  [Cancel]    │  │  │
│  │  │           Invited Dec 16, 2024 by Jane Smith            │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  PERMISSIONS REFERENCE                                        │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Role          Permissions                               │  │  │
│  │  │  ─────────────────────────────────────────────────────   │  │  │
│  │  │  Owner         Full access, billing, transfer ownership │  │  │
│  │  │  Admin         Manage members, workflows, settings      │  │  │
│  │  │  Member        Create workflows, manage leads           │  │  │
│  │  │  Viewer        Read-only access                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  DANGER ZONE (Owner/Admin only)                               │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Leave Workspace                                        │  │  │
│  │  │  You'll lose access to all workflows and data.          │  │  │
│  │  │  [Leave Workspace]                                      │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Spacing & Rhythm

- **Section gaps**: 32px between major sections
- **Card padding**: 24px all around
- **Member row padding**: 16px vertical, 20px horizontal
- **Tight spacing**: 8px for grouped information

---

## Design System Foundations

### Color Palette

```typescript
const teamColors = {
  // Role Badge Colors
  owner: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  admin: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  member: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  viewer: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-700',
    border: 'border-neutral-200',
  },

  // Status Colors
  active: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  expired: 'bg-red-100 text-red-700 border-red-200',
};
```

### Typography Scale

```typescript
const teamTypography = {
  // Member Names
  memberName: 'text-base font-medium text-neutral-900',
  memberEmail: 'text-sm text-neutral-600',
  memberMeta: 'text-xs text-neutral-500',

  // Role Badges
  roleBadge: 'text-xs font-semibold uppercase tracking-wide',

  // Section Titles
  sectionTitle: 'text-lg font-semibold text-neutral-900',
  subsectionTitle: 'text-base font-semibold text-neutral-900',

  // Count Indicators
  countBadge: 'text-sm font-medium text-neutral-700',

  // Permissions Table
  permissionRole: 'text-sm font-medium text-neutral-900',
  permissionDesc: 'text-sm text-neutral-600',
};
```

### Shadows & Depth

```typescript
const teamShadows = {
  memberCard: 'shadow-sm hover:shadow-md',
  modal: 'shadow-2xl',
  dropdown: 'shadow-lg',
};
```

---

## Team Members List

### Member Card Anatomy

```
┌─────────────────────────────────────────────────────────────────┐
│  [Avatar]  John Doe                      [OWNER]      [•••]    │
│            john@example.com                                     │
│            Joined Dec 1, 2024                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Structure

```typescript
interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
  };
}

function MemberCard({ member, currentUserId, currentUserRole }: MemberCardProps) {
  const isCurrentUser = member.userId === currentUserId;
  const canManage = ['owner', 'admin'].includes(currentUserRole) && !isCurrentUser;

  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {member.user.avatarUrl ? (
          <img
            src={member.user.avatarUrl}
            alt={`${member.user.firstName} ${member.user.lastName}`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-lg">
            {getInitials(`${member.user.firstName} ${member.user.lastName}`)}
          </div>
        )}
      </div>

      {/* Member Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-neutral-900 truncate">
            {member.user.firstName} {member.user.lastName}
            {isCurrentUser && (
              <span className="ml-2 text-sm text-neutral-500 font-normal">(You)</span>
            )}
          </h3>
        </div>
        <p className="text-sm text-neutral-600 truncate">{member.user.email}</p>
        <p className="text-xs text-neutral-500">
          Joined {formatDate(member.joinedAt)}
        </p>
      </div>

      {/* Role Badge */}
      <div className="flex-shrink-0">
        <RoleBadge role={member.role} />
      </div>

      {/* Actions Menu */}
      {canManage && (
        <div className="flex-shrink-0">
          <MemberActionsMenu member={member} />
        </div>
      )}
    </div>
  );
}
```

### Role Badge Component

```typescript
function RoleBadge({ role }: { role: WorkspaceMemberRole }) {
  const styles = {
    owner: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    member: 'bg-blue-100 text-blue-700 border-blue-200',
    viewer: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${styles[role]}`}
    >
      {role}
    </span>
  );
}
```

### Team Header Component

```typescript
function TeamHeader({ memberCount, seatLimit, canInvite }: TeamHeaderProps) {
  const isAtLimit = memberCount >= seatLimit;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Team Members ({memberCount} / {seatLimit})
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            {isAtLimit ? (
              <span className="text-amber-700 font-medium">
                You've reached your member limit. Upgrade to add more.
              </span>
            ) : (
              <>You're using {memberCount} of your {seatLimit} available seats</>
            )}
          </p>
        </div>

        {canInvite && (
          <button
            onClick={openInviteModal}
            disabled={isAtLimit}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Invite Member
          </button>
        )}
      </div>

      {isAtLimit && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-900">Member limit reached</p>
            <p className="text-xs text-amber-700 mt-1">
              Upgrade your plan to invite more team members.
            </p>
          </div>
          <button className="text-xs font-semibold text-amber-700 hover:text-amber-900">
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Invite Member Modal

### Modal Layout

```
┌───────────────────────────────────────────────────────────┐
│  Invite Team Member                               [×]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Add a new member to your workspace                      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Email Address *                                    │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │  sarah@example.com                            │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Role *                                             │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │  Member                             [▼]       │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  │                                                     │  │
│  │  Members can create workflows and manage leads.   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Cancel]                       [Send Invitation]   │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Modal Component

```typescript
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, role: WorkspaceMemberRole) => Promise<void>;
}

function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<WorkspaceMemberRole>('member');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roleDescriptions = {
    admin: 'Admins can manage team members, workflows, and workspace settings.',
    member: 'Members can create workflows and manage leads.',
    viewer: 'Viewers have read-only access to workflows and leads.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await onInvite(email, role);
      toast.success('Invitation sent!', {
        description: `An invitation has been sent to ${email}`,
      });
      onClose();
      setEmail('');
      setRole('member');
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your workspace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@example.com"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Role Select */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-neutral-700 mb-2">
              Role *
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as WorkspaceMemberRole)}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="viewer">Viewer</option>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-xs text-neutral-600 mt-2">{roleDescriptions[role]}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !email}
              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Success State After Invite

```typescript
// After successful invitation
toast.success('Invitation sent!', {
  description: `${email} will receive an email to join your workspace.`,
  duration: 4000,
});

// Update pending invitations list
refetchInvitations();
```

---

## Role Management & Permissions

### Permissions Matrix

```
┌─────────────────────────────────────────────────────────────────┐
│  Role Permissions                                               │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Permission              Owner  Admin  Member  Viewer     │  │
│  │  ───────────────────────────────────────────────────────  │  │
│  │  View workflows            ✓      ✓      ✓      ✓        │  │
│  │  Create workflows          ✓      ✓      ✓      ✗        │  │
│  │  Edit workflows            ✓      ✓      ✓      ✗        │  │
│  │  Delete workflows          ✓      ✓      ✗      ✗        │  │
│  │  View leads                ✓      ✓      ✓      ✓        │  │
│  │  Manage leads              ✓      ✓      ✓      ✗        │  │
│  │  Invite members            ✓      ✓      ✗      ✗        │  │
│  │  Remove members            ✓      ✓      ✗      ✗        │  │
│  │  Change member roles       ✓      ✓      ✗      ✗        │  │
│  │  Manage workspace settings ✓      ✓      ✗      ✗        │  │
│  │  Manage billing            ✓      ✗      ✗      ✗        │  │
│  │  Transfer ownership        ✓      ✗      ✗      ✗        │  │
│  │  Delete workspace          ✓      ✗      ✗      ✗        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Permissions Reference Component

```typescript
function PermissionsReference() {
  const permissions = [
    { role: 'Owner', description: 'Full access, billing, transfer ownership, delete workspace' },
    { role: 'Admin', description: 'Manage members, workflows, workspace settings (not billing)' },
    { role: 'Member', description: 'Create and edit workflows, manage leads' },
    { role: 'Viewer', description: 'Read-only access to workflows and leads' },
  ];

  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
      <h3 className="text-base font-semibold text-neutral-900 mb-4">
        Role Permissions
      </h3>
      <div className="space-y-3">
        {permissions.map((perm) => (
          <div key={perm.role} className="flex items-start gap-3">
            <RoleBadge role={perm.role.toLowerCase() as WorkspaceMemberRole} />
            <p className="text-sm text-neutral-600 flex-1">{perm.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Change Role Dropdown

```typescript
function ChangeRoleDropdown({ member, currentUserRole }: ChangeRoleDropdownProps) {
  const canChangeRole = currentUserRole === 'owner' ||
                        (currentUserRole === 'admin' && member.role !== 'owner');

  if (!canChangeRole) return null;

  const availableRoles = currentUserRole === 'owner'
    ? ['admin', 'member', 'viewer']
    : ['member', 'viewer']; // Admins can't promote to admin or owner

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-sm text-primary hover:text-primary-dark font-medium">
          Change Role
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={() => handleRoleChange(member.id, role as WorkspaceMemberRole)}
            className={member.role === role ? 'bg-neutral-100' : ''}
          >
            <div className="flex items-center justify-between gap-4 w-full">
              <span className="capitalize">{role}</span>
              {member.role === role && <Check className="h-4 w-4 text-primary" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Member Actions Menu

### Menu Layout

```
┌─────────────────────────────┐
│  Change Role          >     │
│  ───────────────────────    │
│  Resend Invitation          │  (if pending)
│  Copy Invitation Link       │  (if pending)
│  ───────────────────────    │
│  Transfer Ownership         │  (owner only, to promote)
│  ───────────────────────    │
│  Remove from Workspace      │  (destructive)
└─────────────────────────────┘
```

### Actions Menu Component

```typescript
function MemberActionsMenu({ member, currentUserRole }: MemberActionsMenuProps) {
  const isOwner = currentUserRole === 'owner';
  const isAdmin = currentUserRole === 'admin';
  const canTransferOwnership = isOwner && member.role !== 'owner';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
          <MoreVertical className="h-5 w-5 text-neutral-600" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Change Role */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserCog className="h-4 w-4 mr-2" />
            Change Role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {(isOwner ? ['admin', 'member', 'viewer'] : ['member', 'viewer']).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleChange(member.id, role as WorkspaceMemberRole)}
              >
                <span className="capitalize">{role}</span>
                {member.role === role && <Check className="h-4 w-4 ml-auto text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Transfer Ownership (Owner only) */}
        {canTransferOwnership && (
          <>
            <DropdownMenuItem
              onClick={() => handleTransferOwnership(member)}
              className="text-amber-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Transfer Ownership
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Remove Member (Destructive) */}
        <DropdownMenuItem
          onClick={() => handleRemoveMember(member)}
          className="text-red-700 focus:text-red-700 focus:bg-red-50"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          Remove from Workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Remove Member Confirmation

### Confirmation Modal

```
┌───────────────────────────────────────────────────────────┐
│  Remove Team Member?                              [×]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ⚠ Are you sure you want to remove Jane Smith?          │
│                                                           │
│  They will immediately lose access to:                   │
│  • All workflows in this workspace                       │
│  • All leads and customer data                           │
│  • Any integrations they set up                          │
│                                                           │
│  This action cannot be undone. They can be re-invited    │
│  later if needed.                                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Cancel]                [Remove Member]            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Component

```typescript
function RemoveMemberModal({ member, isOpen, onClose, onConfirm }: RemoveMemberModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onConfirm(member.id);
      toast.success('Member removed', {
        description: `${member.user.firstName} ${member.user.lastName} has been removed from the workspace.`,
      });
      onClose();
    } catch (error) {
      toast.error('Failed to remove member', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Team Member?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Are you sure you want to remove {member.user.firstName} {member.user.lastName}?
              </p>
            </div>
          </div>

          <div className="text-sm text-neutral-700 space-y-2">
            <p>They will immediately lose access to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All workflows in this workspace</li>
              <li>All leads and customer data</li>
              <li>Any integrations they set up</li>
            </ul>
            <p className="text-xs text-neutral-600 mt-3">
              This action cannot be undone. They can be re-invited later if needed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRemoving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                Removing...
              </>
            ) : (
              'Remove Member'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Transfer Ownership Flow

### Step 1: Initiate Transfer

```
┌───────────────────────────────────────────────────────────┐
│  Transfer Ownership?                              [×]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ⚠ You are about to transfer ownership to:              │
│                                                           │
│  [Avatar] Jane Smith                                     │
│           jane@example.com                               │
│           Current Role: Admin                            │
│                                                           │
│  After the transfer:                                     │
│  • Jane will become the workspace owner                  │
│  • You will become an admin                              │
│  • Jane will have full control including billing         │
│  • This cannot be undone without Jane's approval         │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Type "TRANSFER" to confirm:                        │  │
│  │  ┌───────────────────────────────────────────────┐  │  │
│  │  │                                               │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Cancel]              [Transfer Ownership]         │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Component

```typescript
function TransferOwnershipModal({ member, isOpen, onClose, onConfirm }: TransferOwnershipModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const isConfirmed = confirmText === 'TRANSFER';

  const handleTransfer = async () => {
    if (!isConfirmed) return;

    setIsTransferring(true);
    try {
      await onConfirm(member.id);
      toast.success('Ownership transferred', {
        description: `${member.user.firstName} ${member.user.lastName} is now the workspace owner.`,
      });
      onClose();
      // Optionally redirect or refresh
      window.location.reload();
    } catch (error) {
      toast.error('Failed to transfer ownership', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transfer Ownership?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-amber-900">
              You are about to transfer ownership to:
            </p>
          </div>

          {/* New Owner Info */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
              {getInitials(`${member.user.firstName} ${member.user.lastName}`)}
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {member.user.firstName} {member.user.lastName}
              </p>
              <p className="text-sm text-neutral-600">{member.user.email}</p>
              <p className="text-xs text-neutral-500">Current Role: {member.role}</p>
            </div>
          </div>

          {/* Consequences */}
          <div className="text-sm text-neutral-700 space-y-2">
            <p className="font-medium">After the transfer:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{member.user.firstName} will become the workspace owner</li>
              <li>You will become an admin</li>
              <li>{member.user.firstName} will have full control including billing</li>
              <li>This cannot be undone without {member.user.firstName}'s approval</li>
            </ul>
          </div>

          {/* Confirmation Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Type <code className="px-1 py-0.5 bg-neutral-100 rounded text-xs">TRANSFER</code> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="TRANSFER"
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!isConfirmed || isTransferring}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTransferring ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                Transferring...
              </>
            ) : (
              'Transfer Ownership'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Leave Workspace Flow

### Confirmation Modal (Non-Owner)

```
┌───────────────────────────────────────────────────────────┐
│  Leave Workspace?                                 [×]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ⚠ Are you sure you want to leave this workspace?       │
│                                                           │
│  You will immediately lose access to:                    │
│  • All workflows in this workspace                       │
│  • All leads and customer data                           │
│  • Team collaboration features                           │
│                                                           │
│  You can be re-invited by an admin if needed.            │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Cancel]                    [Leave Workspace]      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Owner Cannot Leave (Must Transfer First)

```
┌───────────────────────────────────────────────────────────┐
│  Cannot Leave Workspace                           [×]     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ❌ You cannot leave this workspace as the owner.        │
│                                                           │
│  To leave this workspace, you must first:                │
│  1. Transfer ownership to another member, or             │
│  2. Delete the workspace entirely                        │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  [Close]                                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Component

```typescript
function LeaveWorkspaceModal({ isOpen, onClose, onConfirm, isOwner }: LeaveWorkspaceModalProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  if (isOwner) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cannot Leave Workspace</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900">
                You cannot leave this workspace as the owner.
              </p>
            </div>

            <div className="text-sm text-neutral-700">
              <p className="mb-2">To leave this workspace, you must first:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Transfer ownership to another member, or</li>
                <li>Delete the workspace entirely</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded-lg font-medium"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await onConfirm();
      toast.success('Left workspace', {
        description: 'You have been removed from the workspace.',
      });
      // Redirect to workspaces list or home
      window.location.href = '/workspaces';
    } catch (error) {
      toast.error('Failed to leave workspace', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Workspace?</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-900">
              Are you sure you want to leave this workspace?
            </p>
          </div>

          <div className="text-sm text-neutral-700 space-y-2">
            <p>You will immediately lose access to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All workflows in this workspace</li>
              <li>All leads and customer data</li>
              <li>Team collaboration features</li>
            </ul>
            <p className="text-xs text-neutral-600 mt-3">
              You can be re-invited by an admin if needed.
            </p>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLeaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                Leaving...
              </>
            ) : (
              'Leave Workspace'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Empty States

### No Members Yet (Solo Owner)

```
┌─────────────────────────────────────────────────────────────────┐
│  Team Members (1 / 10)                   [+ Invite Member]     │
│  You're using 1 of your 10 available seats                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                        [Users Icon]                             │
│                                                                 │
│                   Build Your Team                               │
│                                                                 │
│  Invite team members to collaborate on workflows and leads.    │
│  Each member gets their own permissions based on their role.   │
│                                                                 │
│  ┌──────────────────────┐                                      │
│  │  Invite First Member │                                      │
│  └──────────────────────┘                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### No Pending Invitations

```
┌─────────────────────────────────────────────────────────────────┐
│  Pending Invitations (0)                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  No pending invitations                                         │
│                                                                 │
│  All invited members have joined or their invitations expired. │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Error States

### Failed to Load Members

```
┌─────────────────────────────────────────────────────────────────┐
│                     [Alert Icon]                                │
│                                                                 │
│              Failed to load team members                        │
│                                                                 │
│  We couldn't retrieve your team members.                       │
│  Please try again.                                              │
│                                                                 │
│  ┌──────────────────────┐                                      │
│  │  Retry                │                                      │
│  └──────────────────────┘                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Invitation Failed

```typescript
toast.error('Failed to send invitation', {
  description: 'User with this email is already a member.',
  duration: 5000,
});
```

### Role Change Failed

```typescript
toast.error('Failed to update role', {
  description: "You don't have permission to change this member's role.",
  duration: 5000,
});
```

---

## Loading States

### Skeleton for Members List

```typescript
function MembersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-lg">
          <div className="h-12 w-12 bg-neutral-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-neutral-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-6 w-16 bg-neutral-200 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}
```

### Button Loading State

```typescript
<button disabled={isInviting} className="...">
  {isInviting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      Sending...
    </>
  ) : (
    <>
      <Plus className="h-4 w-4 mr-2" />
      Invite Member
    </>
  )}
</button>
```

---

## Micro-interactions & Animations

### Member Card Hover

```typescript
className = `
  transition-all duration-200
  hover:shadow-md
  hover:border-primary
`;
```

### Role Badge Pulse on Change

```typescript
// After role change, briefly pulse the badge
<motion.span
  initial={{ scale: 1 }}
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 0.3 }}
>
  <RoleBadge role={newRole} />
</motion.span>
```

### Success Checkmark Animation

```typescript
// Show animated checkmark after successful invite
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
>
  <Check className="h-8 w-8 text-green-600" />
</motion.div>
```

---

## Responsive Behavior

### Breakpoints

```typescript
const breakpoints = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
};
```

### Member Card Responsive

**Desktop**: Full layout with avatar, name, email, joined date, role badge, menu
**Tablet**: Same as desktop
**Mobile**: Stack layout, smaller avatar, hide "Joined" date

```typescript
// Mobile adjustments
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
  <div className="h-10 w-10 sm:h-12 sm:w-12 ...">
    {/* Avatar */}
  </div>
  <div className="flex-1 min-w-0">
    {/* Name and email */}
    <p className="hidden sm:block text-xs text-neutral-500">
      Joined {formatDate(member.joinedAt)}
    </p>
  </div>
</div>
```

---

## Accessibility

### Keyboard Navigation

- **Tab order**: Invite button → Member cards → Action menus
- **Arrow keys**: Navigate dropdown menus
- **Escape**: Close modals and dropdowns
- **Enter/Space**: Activate buttons

### Screen Readers

```typescript
// Member card
<div
  role="listitem"
  aria-label={`${member.user.firstName} ${member.user.lastName}, ${member.role}, ${member.user.email}`}
>
  {/* Content */}
</div>

// Actions menu
<button
  aria-label={`Actions for ${member.user.firstName} ${member.user.lastName}`}
  aria-haspopup="menu"
>
  <MoreVertical />
</button>

// Role badge
<span
  role="status"
  aria-label={`Role: ${member.role}`}
>
  {member.role}
</span>
```

### Focus Management

```typescript
// Return focus after modal closes
const inviteButtonRef = useRef<HTMLButtonElement>(null);

function handleCloseModal() {
  setIsOpen(false);
  inviteButtonRef.current?.focus();
}
```

---

## Implementation Checklist

### Backend (NestJS)

**Workspace Module**

- [ ] Create `src/modules/workspace/workspace.module.ts`
- [ ] Create `src/modules/workspace/workspace.controller.ts`
- [ ] Create `src/modules/workspace/workspace.service.ts`
- [ ] Create DTOs for member management

**Member Management Endpoints**

- [ ] Implement `GET /api/v1/workspaces/:id/members`
- [ ] Implement `POST /api/v1/workspaces/:id/members/invite`
- [ ] Implement `PATCH /api/v1/workspaces/:id/members/:memberId/role`
- [ ] Implement `DELETE /api/v1/workspaces/:id/members/:memberId`
- [ ] Implement `POST /api/v1/workspaces/:id/transfer-ownership`
- [ ] Implement `POST /api/v1/workspaces/:id/leave`

**Invitation System**

- [ ] Create invitation tokens table
- [ ] Implement `POST /api/v1/invitations/:token/accept`
- [ ] Implement `POST /api/v1/invitations/:token/decline`
- [ ] Send invitation emails via email service
- [ ] Handle invitation expiration (7 days)

**Permission Guards**

- [ ] Create `WorkspaceOwnerGuard`
- [ ] Create `WorkspaceAdminGuard`
- [ ] Create `WorkspaceMemberGuard`
- [ ] Apply guards to protected endpoints

### Frontend (Next.js + React)

**Shadcn Components**

- [ ] Install: `npx shadcn@latest add dialog dropdown-menu avatar select`

**Team Feature Structure**

- [ ] Create `src/features/team/` directory
- [ ] Create `src/features/team/types/` for TypeScript types
- [ ] Create `src/features/team/components/` for UI components
- [ ] Create `src/features/team/hooks/` for data fetching
- [ ] Create `src/features/team/utils/` for helpers

**API Hooks**

- [ ] Create `useTeamMembers()` hook with React Query
- [ ] Create `usePendingInvitations()` hook
- [ ] Create `useInviteMember()` mutation
- [ ] Create `useUpdateMemberRole()` mutation
- [ ] Create `useRemoveMember()` mutation
- [ ] Create `useTransferOwnership()` mutation
- [ ] Create `useLeaveWorkspace()` mutation

**Components**

- [ ] Build `TeamHeader` component
- [ ] Build `MemberCard` component
- [ ] Build `RoleBadge` component
- [ ] Build `MemberActionsMenu` component
- [ ] Build `InviteMemberModal` component
- [ ] Build `RemoveMemberModal` component
- [ ] Build `TransferOwnershipModal` component
- [ ] Build `LeaveWorkspaceModal` component
- [ ] Build `PermissionsReference` component
- [ ] Build `PendingInvitationCard` component

**Main Team Tab**

- [ ] Create `TeamSection.tsx` in Settings
- [ ] Integrate all child components
- [ ] Handle member limit reached state
- [ ] Add loading skeletons
- [ ] Add error boundaries

**Testing**

- [ ] Test invite flow end-to-end
- [ ] Test role change for all role combinations
- [ ] Test remove member flow
- [ ] Test transfer ownership flow
- [ ] Test leave workspace flow
- [ ] Test member limit enforcement
- [ ] Test permission guards (owner/admin/member/viewer)
- [ ] Test responsive layouts
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

**Polish**

- [ ] Add micro-animations to member cards
- [ ] Add success/error toast notifications
- [ ] Test all edge cases
- [ ] Optimize performance

---

## Final Notes

### Permission Best Practices

1. **Always validate workspace membership** before any action
2. **Check role hierarchy** before allowing role changes
3. **Prevent self-demotion** unless transferring ownership
4. **Audit trail** - log all member actions (invite, remove, role change)
5. **Graceful failures** - clear error messages for permission issues

### Security Considerations

- **Verify workspace ownership** on backend for all destructive actions
- **Rate limit** invitation endpoints to prevent spam
- **Expire invitations** after 7 days
- **Prevent duplicate invites** to same email
- **Validate email format** before sending invitations

### User Experience Priorities

1. **Clarity** - Make roles and permissions crystal clear
2. **Safety** - Confirm all destructive actions
3. **Feedback** - Toast notifications for all actions
4. **Empowerment** - Let admins manage without bothering owners
5. **Simplicity** - Inviting should be quick and easy

---

**End of TEAM_MANAGEMENT_UX.md**
