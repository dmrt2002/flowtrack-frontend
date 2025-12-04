'use client';

import { Mail, Globe, MapPin, Building2 } from 'lucide-react';
import type { LeadDetailResponse } from '../types/lead';
import { getStatusColor } from '../utils/lead-status-colors';

interface LeadDetailHeroProps {
  lead: LeadDetailResponse;
  compact?: boolean;
}

export function LeadDetailHero({ lead }: LeadDetailHeroProps) {
  const statusColors = getStatusColor(lead.status);

  // Generate initials for avatar
  const getInitials = () => {
    if (lead.name) {
      return lead.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return lead.email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      {lead.enrichmentData?.person?.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={lead.enrichmentData.person.photoUrl}
          alt={lead.name || 'Lead'}
          className="h-16 w-16 flex-shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-semibold text-white">
          {getInitials()}
        </div>
      )}

      {/* Main Info */}
      <div className="flex-1">
        {/* Status Badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusColors.dot}`} />
            {lead.status.replace('_', ' ')}
          </span>
        </div>

        {/* Info - left aligned stack */}
        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-neutral-400" />
            <a
              href={`mailto:${lead.email}`}
              className="hover:text-brand-primary text-sm font-medium text-neutral-700"
            >
              {lead.email}
            </a>
          </div>

          {/* Website */}
          {lead.enrichmentData?.company?.domain && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-neutral-400" />
              <a
                href={`https://${lead.enrichmentData.company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-primary text-sm text-neutral-700"
              >
                {lead.enrichmentData.company.domain}
              </a>
            </div>
          )}

          {/* Location */}
          {lead.enrichmentData?.company?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              <span className="text-sm text-neutral-600">
                {lead.enrichmentData.company.location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Score - Right Side */}
      <div className="flex-shrink-0 text-right">
        <div className="text-xs font-medium text-neutral-500">Lead Score</div>
        <div className="mt-1 text-2xl font-bold text-neutral-900">
          {lead.score}
        </div>
        {lead.companyName && (
          <div className="mt-2 inline-flex items-center justify-end gap-1 text-xs text-neutral-600">
            <Building2 className="h-3 w-3 text-neutral-400" />
            <span className="max-w-[220px] truncate">{lead.companyName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
