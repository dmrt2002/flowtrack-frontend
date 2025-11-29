import type { LeadSource, LeadStatus } from '../types/lead';

// Status badge colors using the new LeadStatus enum
export function getStatusColor(status: LeadStatus): {
  bg: string;
  text: string;
  dot: string;
} {
  const colors: Record<LeadStatus, { bg: string; text: string; dot: string }> =
    {
      NEW: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
      },
      EMAIL_SENT: {
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        dot: 'bg-cyan-500',
      },
      EMAIL_OPENED: {
        bg: 'bg-teal-50',
        text: 'text-teal-700',
        dot: 'bg-teal-500',
      },
      FOLLOW_UP_PENDING: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        dot: 'bg-amber-500',
      },
      FOLLOW_UP_SENT: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
      },
      RESPONDED: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        dot: 'bg-purple-500',
      },
      BOOKED: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        dot: 'bg-indigo-500',
      },
      WON: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        dot: 'bg-green-500',
      },
      LOST: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        dot: 'bg-red-500',
      },
      DISQUALIFIED: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        dot: 'bg-gray-500',
      },
    };

  return (
    colors[status] || {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      dot: 'bg-gray-500',
    }
  );
}

// Get badge classes for status (combined bg, text, border)
export function getStatusBadgeClasses(status: LeadStatus): string {
  const badges: Record<LeadStatus, string> = {
    NEW: 'bg-blue-50 text-blue-700 border-blue-200',
    EMAIL_SENT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    EMAIL_OPENED: 'bg-teal-50 text-teal-700 border-teal-200',
    FOLLOW_UP_PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    FOLLOW_UP_SENT: 'bg-orange-50 text-orange-700 border-orange-200',
    RESPONDED: 'bg-purple-50 text-purple-700 border-purple-200',
    BOOKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    WON: 'bg-green-50 text-green-700 border-green-200',
    LOST: 'bg-red-50 text-red-700 border-red-200',
    DISQUALIFIED: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return badges[status] || 'bg-gray-50 text-gray-700 border-gray-200';
}

// Get kanban column header colors
export function getKanbanColumnColor(status: LeadStatus): string {
  const colors: Record<LeadStatus, string> = {
    NEW: 'bg-blue-100 border-blue-300',
    EMAIL_SENT: 'bg-cyan-100 border-cyan-300',
    EMAIL_OPENED: 'bg-teal-100 border-teal-300',
    FOLLOW_UP_PENDING: 'bg-amber-100 border-amber-300',
    FOLLOW_UP_SENT: 'bg-orange-100 border-orange-300',
    RESPONDED: 'bg-purple-100 border-purple-300',
    BOOKED: 'bg-indigo-100 border-indigo-300',
    WON: 'bg-green-100 border-green-300',
    LOST: 'bg-red-100 border-red-300',
    DISQUALIFIED: 'bg-gray-100 border-gray-300',
  };

  return colors[status] || 'bg-gray-100 border-gray-300';
}

// Source badge colors
export function getSourceColor(source: LeadSource): {
  bg: string;
  text: string;
} {
  switch (source) {
    case 'FORM':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
      };
    case 'EMAIL_FORWARD':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
      };
    case 'API':
      return {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
      };
    case 'MANUAL':
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
      };
    case 'IMPORT':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
      };
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-600',
      };
  }
}

// Score color indicator
export function getScoreColor(score: number): {
  bg: string;
  text: string;
} {
  if (score >= 61) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-700',
    };
  }
  if (score >= 31) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
    };
  }
  return {
    bg: 'bg-red-100',
    text: 'text-red-700',
  };
}

// Format source label
export function formatSourceLabel(source: LeadSource): string {
  switch (source) {
    case 'FORM':
      return 'Form';
    case 'EMAIL_FORWARD':
      return 'Email';
    case 'API':
      return 'API';
    case 'MANUAL':
      return 'Manual';
    case 'IMPORT':
      return 'Import';
    default:
      return source;
  }
}
